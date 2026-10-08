"""The builder on the real optiland: every shape and mapping, the read-back, and the mistakes it must catch.

Skipped, with the reason, under an interpreter that has no optiland. Run with the interpreter of
``engines.optiland.python`` (``npm run test:optiland``). Nothing here imports optiland: a case goes in through
``lvrtc_optiland.build``, and what is asked of optiland's objects is asked of the optics the builder returned.
"""

from __future__ import annotations

import copy
import dataclasses
import math
import os
import struct
import unittest
import warnings
from decimal import Decimal, getcontext
from fractions import Fraction
from typing import Any
from unittest import mock

from lvrtc_optiland import build
from lvrtc_optiland.build import BuildMismatch, build_case, build_optic, describe_optics, read_optic, verify_optic
from lvrtc_optiland.engine import OptilandEngine
from lvrtc_worker_kit.ndarray import decode_ndarray, encode_ndarray
from lvrtc_worker_kit.protocol import parse_json
from lvrtc_worker_kit.validate import contract_schemas, quantity_schema_id, validate, validate_kind

from .support import (
    HELLO,
    SHUTDOWN,
    TempDirTest,
    describe_line,
    describe_request,
    read_fixture,
    real_optiland_missing,
)

MISSING = real_optiland_missing()
getcontext().prec = 60

D_LINE = 587.5618
NINE = [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1]


def surface(z: float, shape: dict[str, Any], semi: float = 10.0, **more: Any) -> dict[str, Any]:
    """One surface of a synthetic case; the thickness is filled in by ``make_case``."""
    aperture = {
        "semiDiameter": more.pop("clip", semi),
        "nominalSemiDiameter": semi,
        "innerSemiDiameter": more.pop("inner", 0),
    }
    return {
        "label": more.pop("label", "s"),
        "z": z,
        "thickness": 0,
        "shape": shape,
        "aperture": aperture,
        "elementId": 0,
    }


def sphere(radius: float, conic: float = 0) -> dict[str, Any]:
    return {"kind": "conic", "radius": radius, "conic": conic}


def asphere(radius: float | None, conic: float, *terms: tuple[int, float]) -> dict[str, Any]:
    stated = [{"power": power, "coeff": coeff} for power, coeff in terms]
    return {"kind": "asphere", "radius": radius, "conic": conic, "terms": stated}


PLANE: dict[str, Any] = {"kind": "plane"}


def make_case(
    surfaces: list[dict[str, Any]],
    *,
    stop: int = 0,
    image_z: float | None = None,
    stop_radius: float = 2.0,
    object_z: float | None = None,
    lines: tuple[float, ...] = (D_LINE,),
    indices: list[list[float]] | None = None,
) -> dict[str, Any]:
    """A synthetic optical case. Its ids are made up: nothing in a worker computes or checks one."""
    design = surfaces[-1]["z"] + 25.0
    for number, entry in enumerate(surfaces):
        entry["label"] = str(number + 1)
        following = surfaces[number + 1]["z"] if number + 1 < len(surfaces) else design
        entry["thickness"] = following - entry["z"]
    rows = (
        indices
        if indices is not None
        else [[1.5 if number % 2 == 0 else 1.0 for number in range(len(surfaces))]] * len(lines)
    )
    return {
        "contract": "1.0",
        "kind": "optical-case",
        "id": "c" * 64,
        "systemId": "5" * 64,
        "label": {"name": "synthetic"},
        "system": {
            "surfaces": surfaces,
            "stopIndex": stop,
            "lastLensSurfaceIndex": len(surfaces) - 1,
            "designImageZ": design,
        },
        "conditions": {
            "object": {"kind": "infinity"} if object_z is None else {"kind": "finite", "z": object_z},
            "stopSemiDiameter": stop_radius,
            "imageZ": design if image_z is None else image_z,
            "lines": [{"wavelengthNm": nm, "weight": 1, "indexSource": "authored"} for nm in lines],
            "indexAfterSurface": encode_ndarray("f8", [n for row in rows for n in row], [len(lines), len(surfaces)]),
        },
        "features": [],
        "provenance": {
            "source": {"kind": "fixture", "name": "synthetic"},
            "producer": {"tool": "lvrtc", "version": "0"},
        },
    }


def f8(wire: dict[str, Any]) -> list[float]:
    return decode_ndarray(wire).values()


def bits(wire: dict[str, Any]) -> list[str]:
    """Every element of an array as the 16 hex digits of its double, sign first."""
    data = decode_ndarray(wire).data
    return [struct.pack(">Q", struct.unpack_from("<Q", data, offset)[0]).hex() for offset in range(0, len(data), 8)]


def exact_sag(radius: float | None, conic: float, terms: tuple[tuple[int, float], ...], r: float) -> Decimal:
    """The contract's sag in 60 digits, from the numbers of a shape as they are."""
    height = Decimal(r)
    total = Decimal(0)
    if radius is not None:
        c = Decimal(1) / Decimal(radius)
        total = c * height * height / (1 + (1 - (1 + Decimal(conic)) * c * c * height * height).sqrt())
    return total + sum((Decimal(coeff) * height**power for power, coeff in terms), Decimal(0))


def exact_scale(radius: float | None, conic: float, terms: tuple[tuple[int, float], ...], r: float) -> float:
    return build.sag_scale(0.0 if radius is None else 1.0 / radius, conic, terms, r)


@unittest.skipIf(MISSING is not None, MISSING)
class BuildTest(unittest.TestCase):
    def described(self, case: dict[str, Any], fractions: list[float] | None = None) -> dict[str, Any]:
        data = describe_optics(build_case(case).optics, NINE if fractions is None else fractions)
        issues = validate(contract_schemas(), quantity_schema_id("system.describe", "data"), data)
        self.assertEqual(issues, [])
        return data

    def assert_sag_is_the_contracts(self, case: dict[str, Any], data: dict[str, Any], rounding: float = 32.0) -> float:
        """Holds every sag of an answer to the exact sag of the case's shape, within ``rounding`` ulps of its scale."""
        radii, sags = f8(data["sagRadii"]), f8(data["sag"])
        samples = decode_ndarray(data["sag"]).shape[1]
        worst = 0.0
        for number, entry in enumerate(case["system"]["surfaces"]):
            shape = entry["shape"]
            radius = None if shape["kind"] == "plane" else shape["radius"]
            conic = 0.0 if shape["kind"] == "plane" else float(shape["conic"])
            terms = tuple(build.nonzero_terms(shape))
            for sample in range(samples):
                r, got = radii[number * samples + sample], sags[number * samples + sample]
                inside = 1 if radius is None else 1 - (1 + conic) * (r / radius) ** 2
                if inside < 0:
                    self.assertTrue(math.isnan(got), f"surface {number} at {r}: {got}")
                    continue
                if inside < 1e-9:
                    continue
                scale = max(exact_scale(radius, conic, terms, r), 1e-300)
                error = float(abs(Decimal(got) - exact_sag(radius, conic, terms, r))) / scale
                worst = max(worst, error)
                self.assertLessEqual(error, rounding * 2.0**-53, f"surface {number} at {r}: {got}")
        return worst

    # ── The contract's own cases ─────────────────────────────────────────────────────────────────────────────────

    def test_the_singlet_is_described_as_the_contracts_worked_answer(self) -> None:
        case = read_fixture("valid", "optical-case", "singlet.json")
        spec = read_fixture("valid", "quantities", "system.describe.spec", "three-fractions.json")
        expected = read_fixture("valid", "quantities", "system.describe.data", "singlet.json")
        data = self.described(case, spec["sagFractions"])
        for member in expected:
            if member != "sag":
                self.assertEqual(data[member], expected[member], member)
        # The sag is the one member an engine computes: the worked answer to rounding.
        for got, wanted in zip(f8(data["sag"]), f8(expected["sag"]), strict=True):
            self.assertLessEqual(abs(got - wanted), 2.0**-51 * abs(wanted))
        self.assertEqual(sorted(data), sorted(expected))

    def test_the_double_gauss_is_built_where_the_case_says_bit_for_bit(self) -> None:
        case = read_fixture("valid", "optical-case", "double-gauss.json")
        surfaces = case["system"]["surfaces"]
        data = self.described(case)
        self.assertEqual(data["surfaceCount"], 11)
        self.assertEqual(data["stopIndex"], case["system"]["stopIndex"])
        self.assertEqual(data["imageZ"], case["conditions"]["imageZ"])
        self.assertEqual(data["stopSemiDiameter"], case["conditions"]["stopSemiDiameter"])
        self.assertEqual(f8(data["vertexZ"]), [entry["z"] for entry in surfaces])
        curvature = [0.0 if entry["shape"]["kind"] == "plane" else 1.0 / entry["shape"]["radius"] for entry in surfaces]
        self.assertEqual(f8(data["curvature"]), curvature)
        self.assertEqual(f8(data["conic"]), [0.0] * 11)
        self.assertEqual(f8(data["clipRadius"]), [entry["aperture"]["semiDiameter"] for entry in surfaces])
        self.assertEqual(f8(data["innerClipRadius"]), [0.0] * 11)
        self.assertEqual(data["indexAfterSurface"], case["conditions"]["indexAfterSurface"])
        self.assertEqual(data["terms"], [[]] * 11)
        self.assertEqual(decode_ndarray(data["sag"]).shape, (11, 9))
        nominal = [entry["aperture"]["nominalSemiDiameter"] for entry in surfaces]
        self.assertEqual(f8(data["sagRadii"]), [fraction * semi for semi in nominal for fraction in NINE])
        self.assert_sag_is_the_contracts(case, data)
        # A witness that is neither the builder nor the case: the case was written from optiland's own DoubleGauss
        # sample (contract/CONTRACT.md, "The Double-Gauss case"), whose focal length by optiland's paraxial module is
        # 100.00372050801042 mm and whose stop radius is that of f/5. The optic built from the case has both.
        (optic,) = build_case(case).optics
        self.assertAlmostEqual(float(optic.paraxial.f2()), 100.00372050801042, delta=1e-12)
        (f_number,) = build.optiland_api().np.asarray(optic.paraxial.FNO()).ravel()
        self.assertAlmostEqual(float(f_number), 5.0, delta=1e-12)

    def test_the_case_with_every_feature_is_built_feature_by_feature(self) -> None:
        case = read_fixture("valid", "optical-case", "all-features.json")
        surfaces = case["system"]["surfaces"]
        built = build_case(case)
        data = self.described(case, [0, 0.5, 1])

        # Several lines: an optic for each, with that line's indices and that line's wavelength as its only one.
        self.assertEqual(len(built.optics), 2)
        self.assertEqual([optic.primary_wavelength for optic in built.optics], [587.5618 / 1000.0, 486.1327 / 1000.0])
        self.assertEqual(data["indexAfterSurface"], case["conditions"]["indexAfterSurface"])
        table = f8(data["indexAfterSurface"])
        self.assertEqual((table[0], table[7]), (1.58913, 1.59581))
        # A finite object: the object surface stands at the object plane.
        for optic in built.optics:
            self.assertIs(bool(optic.object_surface.is_infinite), False)
            self.assertEqual(float(optic.object_surface.geometry.cs.z), -500.0)
        # An image plane that is not the design image plane: no thickness of the case states it.
        self.assertEqual((data["imageZ"], case["system"]["designImageZ"]), (47.625, 47.5))
        # The stop clips by its own aperture, and the pupils come from the stop radius of the conditions.
        self.assertEqual((data["stopIndex"], f8(data["clipRadius"])[2], data["stopSemiDiameter"]), (2, 6.0, 4.5))
        self.assertEqual(float(built.optics[0].aperture.value), 9.0)
        # An even asphere with a conic constant, an odd one on a flat base.
        self.assertEqual(data["terms"][0], [{"power": 4, "coeff": 1.2e-06}, {"power": 6, "coeff": -3.4e-09}])
        self.assertEqual(data["terms"][3], [{"power": 3, "coeff": 2e-05}, {"power": 4, "coeff": -1e-06}])
        self.assertEqual(f8(data["curvature"]), [1 / 40, 1 / -120, 0.0, 0.0, 1 / -35, 0.0, 0.0])
        self.assertEqual(f8(data["conic"]), [-0.8, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0])
        read = read_optic(built.optics[0], D_LINE / 1000.0)
        self.assertEqual(
            [row.geometry for row in read[1:8]],
            ["EvenAsphere", "StandardGeometry", "Plane", "OddAsphere", "StandardGeometry", "Plane", "Plane"],
        )
        self.assertEqual((read[4].radius, read[4].coefficients), (math.inf, (0.0, 0.0, 2e-05, -1e-06)))
        # An annular aperture, and a nominal semi-diameter that is not the clip radius: the sag is asked at the first.
        self.assertEqual(f8(data["innerClipRadius"]), [0.0, 0.0, 0.0, 2.0, 0.0, 0.0, 0.0])
        self.assertEqual(f8(data["clipRadius"])[0], 12.0)
        self.assertEqual(f8(data["sagRadii"])[:3], [0.0, 6.25, 12.5])
        self.assertEqual(f8(data["vertexZ"]), [entry["z"] for entry in surfaces])
        self.assert_sag_is_the_contracts(case, data)

    # ── Every shape ──────────────────────────────────────────────────────────────────────────────────────────────

    def test_planes_spheres_and_conics_are_optilands_standard_surfaces(self) -> None:
        shapes = [PLANE, sphere(50), sphere(-35.5), sphere(40, -1), sphere(-25, -2.5), sphere(30, 0.4)]
        case = make_case([surface(3.0 * number, shape, 8.0) for number, shape in enumerate(shapes)], stop=2)
        data = self.described(case)
        read = read_optic(build_case(case).optics[0], D_LINE / 1000.0)[1:-1]
        self.assertEqual([row.geometry for row in read], ["Plane"] + ["StandardGeometry"] * 5)
        self.assertEqual(f8(data["curvature"]), [0.0, 1 / 50, 1 / -35.5, 1 / 40, 1 / -25, 1 / 30])
        self.assertEqual(f8(data["conic"]), [0.0, 0.0, 0.0, -1.0, -2.5, 0.4])
        self.assertEqual(data["terms"], [[]] * 6)
        self.assertEqual(
            [row.tolerance for row in read], [None] * 6, "a standard surface is intersected in closed form"
        )
        self.assert_sag_is_the_contracts(case, data)

    def test_an_even_asphere_has_every_power_up_to_20_in_its_own_place_and_beyond(self) -> None:
        coefficients = (1.25e-6, -3.5e-9, 4.25e-12, -6.5e-15, 7.75e-18, -8.5e-21, 9.25e-24, -1.5e-26, 2.5e-29)
        to_20 = tuple((4 + 2 * at, value) for at, value in enumerate(coefficients))
        case = make_case(
            [
                surface(0.0, asphere(50, 0, *to_20)),
                surface(4.0, asphere(-80, -1.5, (4, 2e-6), (20, -3e-30))),
                surface(8.0, asphere(60, 0, (30, 1e-42), (6, 1e-9))),
                surface(12.0, asphere(45, 0.25, (2, 1e-4), (4, -1e-7))),
            ],
            stop=1,
        )
        built = build_case(case)
        data = self.described(case)
        read = read_optic(built.optics[0], D_LINE / 1000.0)[1:-1]
        self.assertEqual([row.geometry for row in read], ["EvenAsphere"] * 4)
        self.assertEqual(read[0].coefficients, (0.0, *coefficients), "the term of power 4 is the second entry")
        self.assertEqual(len(read[1].coefficients or ()), 10)
        self.assertEqual((read[1].coefficients or ())[9], -3e-30)
        self.assertEqual(len(read[2].coefficients or ()), 15, "a list is as long as the highest power asks")
        self.assertEqual(read[3].coefficients, (1e-4, -1e-7), "a term of power 2 is the first entry")
        self.assertEqual([(row.tolerance, row.max_iterations) for row in read], [(1e-12, 100)] * 4)
        self.assertEqual(data["terms"][0], [{"power": power, "coeff": coeff} for power, coeff in to_20])
        self.assertEqual(data["terms"][2], [{"power": 6, "coeff": 1e-9}, {"power": 30, "coeff": 1e-42}])
        self.assertEqual(data["terms"][3], [{"power": 2, "coeff": 1e-4}, {"power": 4, "coeff": -1e-7}])
        self.assertEqual(f8(data["conic"]), [0.0, -1.5, 0.0, 0.25])
        self.assert_sag_is_the_contracts(case, data)

    def test_an_odd_asphere_has_every_power_from_1_in_its_own_place(self) -> None:
        case = make_case(
            [
                surface(0.0, asphere(50, 0, (3, 2e-5), (4, -1e-6), (5, 3e-8), (7, 1e-11), (19, 1e-27))),
                surface(4.0, asphere(-60, -1, (1, 1e-3), (2, -2e-4), (3, 1e-6))),
                surface(8.0, asphere(70, 0, (4, 1e-6), (5, 0.0))),
            ]
        )
        built = build_case(case)
        data = self.described(case)
        read = read_optic(built.optics[0], D_LINE / 1000.0)[1:-1]
        self.assertEqual([row.geometry for row in read], ["OddAsphere"] * 3)
        self.assertEqual(len(read[0].coefficients or ()), 19)
        self.assertEqual((read[0].coefficients or ())[:5], (0.0, 0.0, 2e-5, -1e-6, 3e-8))
        self.assertEqual(read[1].coefficients, (1e-3, -2e-4, 1e-6), "a term of power 1 is the first entry")
        # A term of odd power that adds nothing still makes the surface an odd asphere, as it makes the case's flag.
        self.assertEqual(read[2].coefficients, (0.0, 0.0, 0.0, 1e-6, 0.0))
        self.assertEqual(
            data["terms"][1], [{"power": 1, "coeff": 1e-3}, {"power": 2, "coeff": -2e-4}, {"power": 3, "coeff": 1e-6}]
        )
        self.assertEqual(data["terms"][2], [{"power": 4, "coeff": 1e-6}])
        self.assert_sag_is_the_contracts(case, data)

    def test_a_flat_base_keeps_its_conic_constant_and_an_asphere_without_a_coefficient_stays_one(self) -> None:
        case = make_case(
            [
                surface(0.0, asphere(None, 0.5, (4, 1e-5), (6, -1e-8))),
                surface(2.0, asphere(None, -1, (3, 1e-5))),
                surface(4.0, asphere(None, 2, (4, 0.0))),
                surface(6.0, asphere(40, -0.7, (6, 0.0))),
            ]
        )
        data = self.described(case)
        read = read_optic(build_case(case).optics[0], D_LINE / 1000.0)[1:-1]
        self.assertEqual([row.geometry for row in read], ["EvenAsphere", "OddAsphere", "EvenAsphere", "EvenAsphere"])
        self.assertEqual([row.radius for row in read], [math.inf, math.inf, math.inf, 40.0])
        self.assertEqual(f8(data["curvature"]), [0.0, 0.0, 0.0, 1 / 40])
        # The conic constant shapes nothing on a flat base; it is echoed as the case states it, as `ref` echoes it.
        self.assertEqual(f8(data["conic"]), [0.5, -1.0, 2.0, -0.7])
        self.assertEqual(data["terms"][2:], [[], []])
        sag = f8(data["sag"])
        self.assertEqual(sag[8], math.fsum([1e-5 * 10.0**4, -1e-8 * 10.0**6]))
        self.assertEqual(sag[18:27], [0.0] * 9, "a flat base without a coefficient is flat")
        self.assert_sag_is_the_contracts(case, data)

    def test_a_zero_is_written_as_plus_zero_and_no_sag_as_the_one_nan(self) -> None:
        # A sphere that curves toward -z has the sag -0 at its vertex in optiland, and one of radius 6 has none at 8.
        case = make_case([surface(0.0, sphere(-50)), surface(3.0, sphere(-6), 8.0)])
        data = self.described(case, [0, 0.5, 1])
        self.assertEqual(bits(data["sag"])[0], "0000000000000000")
        self.assertEqual(bits(data["sag"])[3], "0000000000000000")
        self.assertEqual(bits(data["sag"])[5], "7ff8000000000000")
        self.assertLess(f8(data["sag"])[4], 0.0)
        with warnings.catch_warnings(record=True) as caught:
            warnings.simplefilter("always")
            self.described(case)
        self.assertEqual(
            [str(warning.message) for warning in caught], [], "numpy's warning of the root is not passed on"
        )

    def test_where_a_conic_ends_to_the_last_place_optiland_has_a_sag_that_the_contract_has_not(self) -> None:
        # A conic of radius 10 and conic constant 0.5 ends at 10 / sqrt(1.5). At the double nearest to that the
        # contract's 1 - (1 + K) c^2 r^2 is below 0, exactly and in doubles; optiland's 1 - (1 + k) r2 / R**2 rounds
        # to 0 there, so it has a sag where the contract has none. R0 fails such a surface and is not loosened for
        # it (docs/gotchas.md); the builder's own probe leaves the last millionth before the end of a conic alone.
        radius, conic = 10.0, 0.5
        end = radius / math.sqrt(1 + conic)
        self.assertEqual(end, 8.16496580927726)
        curvature = 1 / radius
        self.assertLess(1 - (1 + Fraction(conic)) * Fraction(curvature) ** 2 * Fraction(end) ** 2, 0)
        self.assertLess(1 - (1 + conic) * (curvature * end) * (curvature * end), 0)
        self.assertTrue(math.isnan(build.contract_sag(curvature, conic, (), end)))

        def sag_at_the_rim(semi: float) -> float:
            case = make_case([surface(0.0, sphere(radius, conic), semi), surface(30.0, PLANE, semi)])
            return f8(self.described(case, [0, 0.5, 1])["sag"])[2]

        self.assertEqual(sag_at_the_rim(end), (end * end) / radius)
        self.assertAlmostEqual(sag_at_the_rim(end), 20 / 3, delta=1e-14)
        # One double nearer the axis the contract has a sag too, and one double further out optiland has none either.
        inside, outside = math.nextafter(end, 0.0), math.nextafter(end, math.inf)
        self.assertTrue(math.isfinite(build.contract_sag(curvature, conic, (), inside)))
        self.assertTrue(math.isfinite(sag_at_the_rim(inside)))
        self.assertTrue(math.isnan(sag_at_the_rim(outside)))
        # A hemisphere is no such place: at a height that is the radius to the bit, both have its sag.
        for ball in (3.0, 0.7, 10.1, 49.3):
            self.assertTrue(math.isfinite(build.contract_sag(1 / ball, 0.0, (), ball)), ball)
            case = make_case([surface(0.0, sphere(ball), ball), surface(2 * ball + 1, sphere(-ball), ball)])
            sags = f8(self.described(case, [0, 0.5, 1])["sag"])
            self.assertAlmostEqual(sags[2], ball, delta=1e-7 * ball)
            self.assertAlmostEqual(sags[5], -ball, delta=1e-7 * ball)

    # ── The layout ───────────────────────────────────────────────────────────────────────────────────────────────

    def test_a_surface_stands_at_the_vertex_of_the_case_not_at_the_sum_of_the_thicknesses(self) -> None:
        # 0.1 + 0.2 is not 0.3 in doubles: a case may state the vertex 0.3 behind gaps of 0.1 and 0.2, and its image
        # plane where no gap ends. optiland places a surface given a thickness at the running sum.
        self.assertNotEqual(0.1 + 0.2, 0.3)
        case = make_case([surface(0.0, sphere(50)), surface(0.1, sphere(-50)), surface(0.3, PLANE)], image_z=25.337)
        case["system"]["surfaces"][1]["thickness"] = 0.2
        data = self.described(case)
        self.assertEqual(f8(data["vertexZ"]), [0.0, 0.1, 0.3])
        self.assertEqual(data["imageZ"], 25.337)
        optic = build_case(case).optics[0]
        # The paraxial rays of optiland are traced between the same places as its real rays.
        self.assertEqual(
            [float(value) for value in optic.surfaces.positions.ravel()], [-math.inf, 0.0, 0.1, 0.3, 25.337]
        )

    def test_the_stop_may_be_the_first_surface_the_last_or_one_between(self) -> None:
        for stop in (0, 1, 2):
            shapes = [sphere(50), PLANE, sphere(-50)]
            case = make_case(
                [surface(2.0 * number, shape) for number, shape in enumerate(shapes)], stop=stop, stop_radius=1.75
            )
            optic = build_case(case).optics[0]
            data = self.described(case)
            self.assertEqual((data["stopIndex"], data["stopSemiDiameter"]), (stop, 1.75))
            self.assertEqual(int(optic.surfaces.stop_index), stop + 1)
            self.assertEqual(
                [bool(entry.is_stop) for entry in optic.surfaces], [number == stop + 1 for number in range(5)]
            )
            self.assertEqual((optic.aperture.ap_type, float(optic.aperture.value)), ("float_by_stop_size", 3.5))

    def test_the_object_is_at_infinity_or_at_the_plane_of_the_case(self) -> None:
        surfaces = [surface(0.0, sphere(50)), surface(4.0, sphere(-50))]
        far = build_case(make_case(copy.deepcopy(surfaces))).optics[0]
        self.assertIs(bool(far.object_surface.is_infinite), True)
        self.assertEqual(float(far.object_surface.geometry.cs.z), -math.inf)
        near = build_case(make_case(copy.deepcopy(surfaces), object_z=-123.456)).optics[0]
        self.assertIs(bool(near.object_surface.is_infinite), False)
        self.assertEqual(float(near.object_surface.geometry.cs.z), -123.456)
        self.assertEqual(float(near.surfaces.positions.ravel()[0]), -123.456)

    def test_every_line_has_an_optic_of_its_own_indices_and_its_own_wavelength(self) -> None:
        lines = (587.5618, 486.1327, 656.2725)
        indices = [[1.5168, 1.0, 1.6200], [1.5224, 1.0, 1.6317], [1.5143, 1.0, 1.6150]]
        shapes = [sphere(50), sphere(-50), PLANE]
        case = make_case(
            [surface(2.0 * number, shape) for number, shape in enumerate(shapes)], lines=lines, indices=indices
        )
        built = build_case(case)
        self.assertEqual(len(built.optics), 3)
        for optic, nm, row in zip(built.optics, lines, indices, strict=True):
            self.assertEqual(int(optic.wavelengths.num_wavelengths), 1)
            self.assertEqual(float(optic.primary_wavelength), nm / 1000.0)
            # An ideal material is the same at every wavelength: which optic is asked is what matters.
            for wavelength in (nm / 1000.0, 0.4, 0.7):
                self.assertEqual([row_read.index_after for row_read in read_optic(optic, wavelength)[1:-1]], row)
        data = self.described(case)
        self.assertEqual(decode_ndarray(data["indexAfterSurface"]).shape, (3, 3))
        self.assertEqual(f8(data["indexAfterSurface"]), [n for row in indices for n in row])

    def test_every_surface_clips_by_a_radius_and_an_annular_aperture_by_two(self) -> None:
        case = make_case(
            [
                surface(0.0, sphere(50), 9.0, clip=9.000000001, inner=2.0),
                surface(4.0, PLANE, 3.0),
                surface(6.0, sphere(-50), 8.0),
            ],
            stop=1,
            stop_radius=3.0,
        )
        optic = build_case(case).optics[0]
        data = self.described(case)
        self.assertEqual(f8(data["clipRadius"]), [9.000000001, 3.0, 8.0])
        self.assertEqual(f8(data["innerClipRadius"]), [2.0, 0.0, 0.0])
        # The heights of the sag are fractions of the nominal semi-diameter, which is not the clip radius.
        self.assertEqual(f8(data["sagRadii"])[8], 9.0)
        for entry in optic.surfaces[1:4]:
            self.assertEqual(type(entry.aperture).__name__, "RadialAperture", "the stop has an aperture like any other")
        self.assertIsNone(optic.surfaces[4].aperture, "the image surface clips nothing")

        # Both limits are inclusive, as the contract's are: a ray at the inner radius passes, below it a ray is
        # stopped, and a ray passes up to the clip radius.
        np = build.optiland_api().np
        clip = 9.000000001
        heights = np.array([0.0, 1.9999999, 2.0, 5.0, clip * (1 - 2.0**-52), 9.0000000011])
        passed = optic.surfaces[1].aperture.contains(np.zeros_like(heights), heights)
        self.assertEqual([bool(value) for value in passed], [False, False, True, True, True, False])
        stop = optic.surfaces[2].aperture.contains(np.zeros(3), np.array([0.0, 3.0, 3.0000001]))
        self.assertEqual([bool(value) for value in stop], [True, True, False])
        # At the clip radius itself, to the bit, optiland compares the square numpy makes of the height with the
        # square Python's pow makes of r_max, and those two are not always the same double: such a ray passes or
        # is stopped by one unit in the last place of a square (docs/gotchas.md). It is the rim band's to absorb.
        at_the_rim = optic.surfaces[1].aperture.contains(np.zeros(1), np.array([clip]))
        self.assertEqual(bool(at_the_rim[0]), clip * clip <= clip**2)

    # ── What optiland's first-order model does not see ───────────────────────────────────────────────────────────

    def test_optilands_paraxial_data_does_not_see_a_term_of_power_2(self) -> None:
        # The contract's first-order curvature is the base curvature plus twice the coefficient of a term of power 2.
        # optiland's paraxial power of a surface is (n2 - n1) / radius: the term is in its sag and its real rays and
        # not in its focal length. So the builder builds the term, system.describe echoes it, and paraxial.first-order
        # of optiland must not be answered for such a case (docs/gotchas.md).
        def singlet(*terms: tuple[int, float]) -> dict[str, Any]:
            front = asphere(50, 0, (4, 0.0), *terms)
            return make_case([surface(0.0, front), surface(4.0, sphere(-50))], indices=[[1.5, 1.0]])

        plain = build_case(singlet()).optics[0]
        curved = build_case(singlet((2, 1e-3))).optics[0]
        self.assertEqual(float(curved.paraxial.f2()), float(plain.paraxial.f2()))
        self.assertAlmostEqual(float(plain.paraxial.f2()), 50.67567567567568, delta=1e-12)
        # A thick lens whose front curvature is 1/50 + 2e-3 has another focal length by more than 2 mm.
        front, back, n, d = 0.5 * (1 / 50 + 2e-3), -0.5 * (-1 / 50), 1.5, 4.0
        self.assertAlmostEqual(1 / (front + back - front * back * d / n), 48.29362524146813, delta=1e-12)
        described = self.described(singlet((2, 1e-3)))
        self.assertEqual(described["terms"][0], [{"power": 2, "coeff": 1e-3}])
        self.assert_sag_is_the_contracts(singlet((2, 1e-3)), described)


@unittest.skipIf(MISSING is not None, MISSING)
class VerificationTest(unittest.TestCase):
    """The builder's mistakes, made on purpose: each is found before anything is answered, and named."""

    CASE = read_fixture("valid", "optical-case", "all-features.json")

    def mismatch(self, tamper: Any, case: dict[str, Any] | None = None) -> str:
        """The message of the ``BuildMismatch`` that building ``case`` raises when ``tamper`` edits the keywords."""
        real = build.surface_keywords

        def tampered(api: Any, entry: dict[str, Any], index_after: float, is_stop: bool) -> dict[str, Any]:
            keywords = real(api, entry, index_after, is_stop)
            changed = tamper(dict(keywords), entry)
            return keywords if changed is None else changed

        with mock.patch.object(build, "surface_keywords", tampered), self.assertRaises(BuildMismatch) as raised:
            build_case(self.CASE if case is None else case)
        return str(raised.exception)

    def test_the_case_as_it_is_passes(self) -> None:
        self.assertEqual(len(build_case(self.CASE).optics), 2)

    def test_a_coefficient_list_one_place_off_names_the_surface_and_its_terms(self) -> None:
        def shift(keywords: dict[str, Any], entry: dict[str, Any]) -> dict[str, Any] | None:
            if entry["label"] != "1":
                return None
            # The list of an even asphere without its first entry: [A4, A6] where optiland reads [A2, A4].
            return {**keywords, "coefficients": keywords["coefficients"][1:]}

        self.assertEqual(
            self.mismatch(shift),
            "surface 0 (1): terms is ((2, 1.2e-06), (4, -3.4e-09)) in the optic optiland built and "
            "((4, 1.2e-06), (6, -3.4e-09)) in the case (line 0, 587.5618 nm)",
        )

    def test_a_diameter_taken_for_a_radius_names_the_surface_and_its_aperture(self) -> None:
        def bare_number(keywords: dict[str, Any], entry: dict[str, Any]) -> dict[str, Any] | None:
            # A bare number as the aperture is a diameter to optiland: the clip radius becomes half of it.
            return {**keywords, "aperture": entry["aperture"]["semiDiameter"]} if entry["label"] == "2" else None

        self.assertEqual(
            self.mismatch(bare_number),
            "surface 1 (2): aperture.r_max is 6.0 in the optic optiland built and 12.0 in the case "
            "(line 0, 587.5618 nm)",
        )

        def doubled(keywords: dict[str, Any], entry: dict[str, Any]) -> dict[str, Any] | None:
            if entry["label"] != "STO":
                return None
            api = build.optiland_api()
            return {**keywords, "aperture": api.RadialAperture(r_max=2 * entry["aperture"]["semiDiameter"])}

        self.assertIn(
            "surface 2 (STO): aperture.r_max is 12.0 in the optic optiland built and 6.0", self.mismatch(doubled)
        )

    def test_a_tolerance_the_factory_dropped_names_the_surface_and_tol(self) -> None:
        def renamed(keywords: dict[str, Any], entry: dict[str, Any]) -> dict[str, Any] | None:
            if "tol" not in keywords or entry["label"] != "4":
                return None
            # A keyword the geometry factory does not know is dropped without a word, and its own default is used.
            keywords["tolerance"] = keywords.pop("tol")
            return keywords

        self.assertEqual(
            self.mismatch(renamed),
            "surface 3 (4): tol is 1e-06 in the optic optiland built and 1e-12 in the case (line 0, 587.5618 nm)",
        )

    def test_every_other_keyword_is_held_to_the_case_too(self) -> None:
        api = build.optiland_api()

        def at(label: str, **changes: Any) -> Any:
            def tamper(keywords: dict[str, Any], entry: dict[str, Any]) -> dict[str, Any] | None:
                if entry["label"] != label:
                    return None
                kept = {name: value for name, value in keywords.items() if changes.get(name, 0) is not None}
                return {**kept, **{name: value for name, value in changes.items() if value is not None}}

            return tamper

        for tamper, said in (
            (at("2", z=3.0000001), "surface 1 (2): z is 3.0000001 in the optic optiland built and 3.0 in the case"),
            (
                at("2", radius=120.0),
                "surface 1 (2): radius is 120.0 in the optic optiland built and -120.0 in the case",
            ),
            (at("1", conic=None), "surface 0 (1): conic is 0.0 in the optic optiland built and -0.8 in the case"),
            (at("4", max_iter=7), "surface 3 (4): max_iter is 7 in the optic optiland built and 100 in the case"),
            (
                at("1", surface_type="odd_asphere"),
                "surface 0 (1): the class of its geometry is 'OddAsphere' in the optic optiland built and "
                "'EvenAsphere' in the case",
            ),
            (
                at("STO", aperture=None),
                "surface 2 (STO): the class of its aperture is None in the optic optiland built and "
                "'RadialAperture' in the case",
            ),
            (
                at("STO", is_stop=False),
                "surface 2 (STO): is_stop is False in the optic optiland built and True in the case",
            ),
            (
                at("4", aperture=api.RadialAperture(r_max=9.0)),
                "surface 3 (4): aperture.r_min is 0.0 in the optic optiland built and 2.0 in the case",
            ),
            (
                at("5", material=api.IdealMaterial(n=1.5)),
                "surface 4 (5): the index after it is 1.5 in the optic optiland built and 1.0 in the case",
            ),
            (
                at("5", material="mirror"),
                "surface 4 (5): is_reflective is True in the optic optiland built and False in the case",
            ),
            (
                # A thin lens of optiland's own stands on a plane, as the stop of the case is one: the geometry, the
                # aperture and the index are the case's, and the focal length of the system is 19 mm for 27 mm.
                at("STO", surface_type="paraxial", f=50.0),
                "surface 2 (STO): the model of its interaction is 'ThinLensInteractionModel' in the optic optiland "
                "built and 'RefractiveReflectiveModel' in the case",
            ),
            (
                at("5", coating="fresnel"),
                "surface 4 (5): its coating is 'FresnelCoating' in the optic optiland built and None in the case",
            ),
            (
                at("RP1a", radius=1e15),
                "surface 5 (RP1a): the class of its geometry is 'StandardGeometry' in the optic optiland built and "
                "'Plane' in the case",
            ),
            (
                at("5", x=0.5),
                "surface 4 (5): its decentres and tilts is (0.5, 0.0, 0.0, 0.0, 0.0) in the optic optiland built",
            ),
            (
                at("5", rx=0.01),
                "surface 4 (5): its decentres and tilts is (0.0, 0.0, 0.01, 0.0, 0.0) in the optic optiland built",
            ),
        ):
            message = self.mismatch(tamper)
            self.assertIn(said, message)
            self.assertTrue(message.endswith("(line 0, 587.5618 nm)"), message)

    def test_a_mistake_at_the_second_line_only_is_found_at_the_second_line(self) -> None:
        seen: list[float] = []

        def second_line(keywords: dict[str, Any], entry: dict[str, Any]) -> dict[str, Any] | None:
            if entry["label"] != "1":
                return None
            seen.append(1.0)
            api = build.optiland_api()
            return {**keywords, "material": api.IdealMaterial(n=1.58913)} if len(seen) == 2 else None

        self.assertEqual(
            self.mismatch(second_line),
            "surface 0 (1): the index after it is 1.58913 in the optic optiland built and 1.59581 in the case "
            "(line 1, 486.1327 nm)",
        )

    def test_what_is_set_on_the_optic_is_held_to_the_case_as_well(self) -> None:
        case = self.CASE
        for edit, said in (
            (
                lambda optic: optic.set_aperture("float_by_stop_size", 4.5),
                "the system: the stop diameter is 4.5 in the optic optiland built and 9.0 in the case",
            ),
            (
                lambda optic: optic.set_aperture("EPD", 9.0),
                "the system: the type of its aperture is 'EPD' in the optic optiland built and "
                "'float_by_stop_size' in the case",
            ),
            (
                lambda optic: optic.surfaces[1].set_semi_aperture(r_max=12.0),
                "surface 0 (1): semi_aperture is 12.0 in the optic optiland built and 12.5 in the case",
            ),
            (
                lambda optic: optic.wavelengths.add(value=0.55),
                "the system: the number of wavelengths is 2 in the optic optiland built and 1 in the case",
            ),
            (
                lambda optic: optic.surfaces.remove(6),
                "the system: the number of surfaces is 6 in the optic optiland built and 7 in the case",
            ),
        ):
            optic = build_optic(case, 0)
            verify_optic(optic, case, 0)
            edit(optic)
            with self.assertRaises(BuildMismatch) as raised:
                verify_optic(optic, case, 0)
            self.assertIn(said, str(raised.exception))

    def test_the_object_the_image_plane_the_stop_and_the_wavelength_are_held_to_the_case(self) -> None:
        # What the builder sets beside the surfaces of the lens, each changed on an optic that had passed. The case
        # has a finite object at -500 mm, its image plane at 47.625 mm and its stop at surface 2.
        case = self.CASE
        api = build.optiland_api()

        def place(index: int, **coordinates: float) -> Any:
            def edit(optic: Any) -> None:
                for name, value in coordinates.items():
                    setattr(optic.surfaces[index].geometry.cs, name, value)

            return edit

        def curved_image(optic: Any) -> None:
            image = optic.surfaces[-1]
            image.geometry = api.StandardGeometry(image.geometry.cs, radius=100.0)

        for edit, said in (
            (
                place(0, z=-400.0),
                "the object surface: z is -400.0 in the optic optiland built and -500.0 in the case",
            ),
            (
                # An object optiland takes for one at infinity, though it stands at the object plane along z.
                place(0, x=math.inf),
                "the object surface: is_infinite is True in the optic optiland built and False in the case",
            ),
            (
                lambda optic: setattr(optic.surfaces[0], "material_post", api.IdealMaterial(n=1.0003)),
                "the object surface: the index after it is 1.0003 in the optic optiland built and 1.0 in the case",
            ),
            (
                # The design image plane, where a sum of the case's thicknesses would have put it.
                place(-1, z=47.5),
                "the image surface: z is 47.5 in the optic optiland built and 47.625 in the case",
            ),
            (
                curved_image,
                "the image surface: the class of its geometry is 'StandardGeometry' in the optic optiland built and "
                "'Plane' in the case",
            ),
            (
                lambda optic: setattr(optic.surfaces[-1], "aperture", api.RadialAperture(r_max=5.0)),
                "the image surface: aperture is 'RadialAperture' in the optic optiland built and None in the case",
            ),
            (
                # optiland's stop is the first surface that is flagged, the object surface included.
                lambda optic: setattr(optic.surfaces[0], "is_stop", True),
                "the system: the index of the stop surface is -1 in the optic optiland built and 2 in the case",
            ),
            (
                # The same number read as nanometres: a thousandth of the wavelength, which is one division of the
                # case's nanometres and not the double nearest to 0.5875618.
                lambda optic: setattr(optic.wavelengths[0], "unit", "nm"),
                f"the system: the primary wavelength in µm is {D_LINE / 1000.0 * 0.001!r} in the optic optiland built "
                "and 0.5875617999999999 in the case",
            ),
        ):
            optic = build_optic(case, 0)
            verify_optic(optic, case, 0)
            edit(optic)
            with self.assertRaises(BuildMismatch) as raised:
                verify_optic(optic, case, 0)
            self.assertEqual(str(raised.exception), f"{said} (line 0, 587.5618 nm)")

    def test_the_axis_optilands_paraxial_rays_run_along_is_held_to_the_vertices_too(self) -> None:
        # optiland keeps a second account of where its surfaces stand, the axis its first-order data is traced
        # along (surfaces.positions), which is the vertices' z only while the path is straight. It is given here as
        # another axis than the geometry's, at a surface of the lens and at the image surface.
        case = self.CASE
        optic = build_optic(case, 0)
        verify_optic(optic, case, 0)
        axis = optic.surfaces.positions
        self.assertEqual(
            [float(value) for value in axis.ravel()], [-500.0, 0.0, 3.0, 8.0, 12.0, 14.5, 44.5, 45.5, 47.625]
        )
        for index, said in (
            (2, "surface 1 (2): its position on the paraxial axis is 3.25 in the optic optiland built and 3.0 in the"),
            (8, "the image surface: its position on the paraxial axis is 47.875 in the optic optiland built and 47.6"),
        ):
            moved = axis.copy()
            moved[index] += 0.25
            folded = mock.PropertyMock(return_value=moved)
            with (
                mock.patch.object(type(optic.surfaces), "positions", folded),
                self.assertRaises(BuildMismatch) as raised,
            ):
                verify_optic(optic, case, 0)
            self.assertIn(said, str(raised.exception))
        verify_optic(optic, case, 0)

    def test_a_call_that_optiland_has_deprecated_is_an_error_and_not_a_warning_in_a_log(self) -> None:
        # One of optiland's own deprecated wrappers stands where the builder calls set_aperture: optiland attributes
        # the warning to its caller, which is the builder, and there it is an error.
        api = build.optiland_api()

        class Old(api.Optic):  # type: ignore[misc, name-defined]
            set_aperture = api.Optic.set_radius

        with warnings.catch_warnings():
            warnings.simplefilter("ignore")
            with self.assertRaises(DeprecationWarning) as raised:
                build_optic(self.CASE, 0, dataclasses.replace(api, Optic=Old))
        self.assertRegex(str(raised.exception), r"^Optic\.set_radius is deprecated and will be removed in ")
        # The builder as it is makes no such call, nor does the reading back or the describing: with every
        # deprecation an error, whoever it is attributed to, the case is built, verified and described.
        with warnings.catch_warnings():
            warnings.simplefilter("error", DeprecationWarning)
            described = describe_optics(build_case(self.CASE).optics, NINE)
        self.assertEqual(described["surfaceCount"], 7)

    def test_a_surface_that_is_another_surface_is_found_by_its_sag_whatever_the_lists_say(self) -> None:
        # The builder and its reading of a list agree with each other and not with optiland: every term one place
        # down. Nothing that is read back differs from the case; the surface optiland evaluates does.
        def shifted_list(terms: list[tuple[int, float]]) -> tuple[str, list[float]]:
            highest = max(power for power, _ in terms)
            coefficients = [0.0] * (highest // 2 - 1)
            for power, coeff in terms:
                coefficients[power // 2 - 2] = coeff
            return "even_asphere", coefficients

        def shifted_reading(odd: bool, coefficients: list[float]) -> list[tuple[int, float]]:
            return [(2 * at + 4, float(value)) for at, value in enumerate(coefficients) if float(value) != 0.0]

        case = make_case([surface(0.0, asphere(40, -0.8, (4, 1.2e-6), (6, -3.4e-9)), 12.5), surface(3.0, sphere(-120))])
        build_case(case)
        with (
            mock.patch.object(build, "coefficient_list", shifted_list),
            mock.patch.object(build, "terms_of", shifted_reading),
            self.assertRaises(BuildMismatch) as raised,
        ):
            build_case(case)
        self.assertRegex(
            str(raised.exception),
            r"^surface 0 \(1\): the sag at the height 3\.125 mm is 0\.122\d+ in the optic optiland built and "
            r"0\.122\d+ in the case \(line 0, 587\.5618 nm\)$",
        )

    def test_the_engine_answers_a_mismatch_as_an_error_and_describes_nothing(self) -> None:
        def no_stop(keywords: dict[str, Any], entry: dict[str, Any]) -> dict[str, Any] | None:
            return {**keywords, "aperture": 3.0} if entry["label"] == "5" else None

        real = build.surface_keywords

        def tampered(api: Any, entry: dict[str, Any], index_after: float, is_stop: bool) -> dict[str, Any]:
            return no_stop(real(api, entry, index_after, is_stop), entry) or real(api, entry, index_after, is_stop)

        identity = {
            "id": "optiland",
            "version": "t",
            "fingerprint": "f" * 64,
            "adapterRevision": "a" * 64,
            "details": {},
        }
        engine = OptilandEngine(identity)
        request = describe_request(self.CASE)
        answered = engine.run(request, self.CASE)
        self.assertEqual(answered["status"], "ok")
        # The request names no fractions: the sag is given at the contract's nine, of each nominal semi-diameter.
        self.assertEqual(f8(answered["data"]["sagRadii"])[:9], [fraction * 12.5 for fraction in NINE])
        self.assertEqual(decode_ndarray(answered["data"]["sag"]).shape, (7, 9))
        with mock.patch.object(build, "surface_keywords", tampered):
            refused = engine.run(request, self.CASE)
        self.assertEqual(validate_kind("result", refused), [])
        self.assertEqual((refused["status"], refused["error"]["code"]), ("error", "build-mismatch"))
        self.assertEqual(
            refused["error"]["message"],
            "surface 4 (5): aperture.r_max is 1.5 in the optic optiland built and 9.0 in the case "
            "(line 0, 587.5618 nm)",
        )
        self.assertNotIn("data", refused)


@unittest.skipIf(MISSING is not None, MISSING)
class WorkerTest(TempDirTest):
    """``system.describe`` through the worker as a process, on the real optiland."""

    def test_the_worker_describes_the_contracts_cases_and_two_answers_are_the_same_bytes(self) -> None:
        names = ("NUMBA_CACHE_DIR", "MPLCONFIGDIR", "PYTHONPYCACHEPREFIX")
        environment = {name: os.environ[name] for name in names}
        cases = [
            read_fixture("valid", "optical-case", f"{name}.json")
            for name in ("singlet", "double-gauss", "all-features")
        ]
        spec = {"sagFractions": [0, 0.5, 1]}
        lines = HELLO + b"".join(describe_line(case, spec) for case in cases) + describe_line(cases[0], spec) + SHUTDOWN
        ended = self.worker(None, lines, env=environment)
        self.assertEqual(ended.returncode, 0, ended.stderr)
        hello, *answers, again, bye = [parse_json(line) for line in ended.stdout.splitlines()]
        self.assertEqual(hello["result"]["capabilities"]["quantities"], {"system.describe": {"version": 2}})
        self.assertNotRegex(hello["result"]["identity"]["version"], r"\.d\d{8}$")
        schemas = contract_schemas()
        for case, answer in zip(cases, answers, strict=True):
            self.assertIs(answer["ok"], True, answer)
            result = answer["result"]
            self.assertEqual(validate_kind("result", result), [])
            self.assertEqual((result["status"], result["caseId"]), ("ok", case["id"]))
            self.assertEqual(validate(schemas, quantity_schema_id("system.describe", "data"), result["data"]), [])
            self.assertEqual(
                result["method"],
                {
                    "name": "optic-readback",
                    "params": {"asphereTolerance": 1e-12, "asphereMaxIterations": 100, "positioning": "absolute-z"},
                },
            )
            counts = {"surfaces": len(case["system"]["surfaces"]), "lines": len(case["conditions"]["lines"])}
            self.assertEqual(result["diagnostics"], {"warnings": [], "counts": counts})
            self.assertEqual(f8(result["data"]["vertexZ"]), [entry["z"] for entry in case["system"]["surfaces"]])
        expected = read_fixture("valid", "quantities", "system.describe.data", "singlet.json")
        described = answers[0]["result"]["data"]
        self.assertEqual(
            {k: v for k, v in described.items() if k != "sag"}, {k: v for k, v in expected.items() if k != "sag"}
        )
        self.assertEqual(again["result"], answers[0]["result"], "the engine is deterministic")
        self.assertEqual(bye["result"], {})
        # Nothing optiland or numpy said while it computed reached the replies: there are six lines, all JSON.
        self.assertEqual(ended.stdout.count(b"\n"), 6)


if __name__ == "__main__":
    unittest.main()

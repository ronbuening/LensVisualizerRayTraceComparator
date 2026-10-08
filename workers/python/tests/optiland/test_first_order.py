"""``paraxial.first-order`` of the worker: optiland's own first-order data, held to values derived here by hand.

The first two classes need no optiland: what the engine refuses from the case alone, and that the hand derivations
agree with each other. The rest runs on the real optiland and is skipped, with the reason, under an interpreter
that has none (``npm run test:optiland`` runs it).

Every expected value is derived in the test that states it, from Gaussian optics written out here: the closed form
of a thick lens (``thick_lens``), the lens equation between its principal planes (``image_of``, ``object_of``) and
the imaging of a point by one refracting surface. A system of more surfaces is traced in exact rational arithmetic
by the textbook's y-nu trace (``exact``), which is itself held to the closed form first. Nothing here is taken from
another engine's output, and nothing from optiland.
"""

from __future__ import annotations

import json
import math
import os
import unittest
import warnings
from fractions import Fraction
from typing import Any
from unittest import mock

from lvrtc_optiland import build
from lvrtc_optiland.build import BuildMismatch, build_case, build_optic, describe_optics, index_rows, verify_optic
from lvrtc_optiland.engine import BAD_SPEC, QUANTITIES, OptilandEngine, refusals
from lvrtc_optiland.first_order import (
    AFOCAL_RELATIVE_POWER,
    AFOCAL_SYSTEM,
    FIRST_ORDER_VALUES,
    LINEAR_SAG_TERM,
    PARAXIAL_FIRST_ORDER,
    QUADRATIC_SAG_TERM,
    TELECENTRIC_OBJECT_SPACE,
    first_order_of,
    line_data,
    term_refusals,
)
from lvrtc_worker_kit.protocol import parse_json
from lvrtc_worker_kit.validate import contract_schemas, quantity_schema_id, validate, validate_kind

from .support import (
    HELLO,
    PLANE,
    REPO_ROOT,
    SHUTDOWN,
    TempDirTest,
    asphere,
    describe_request,
    f8,
    first_order_line,
    first_order_request,
    make_case,
    read_fixture,
    real_optiland_missing,
    sphere,
    surface,
)

MISSING = real_optiland_missing()

TOLERANCE_MM = 1e-11
"""How far a value of optiland may lie from the exact one here: a hundredth of the gate of rung R1. The largest
difference measured on the systems of this file is 2.1e-14 mm (optiland 4e893f53)."""

IDENTITY: dict[str, Any] = {
    "id": "optiland",
    "version": "0.0.0+test",
    "fingerprint": "f" * 64,
    "adapterRevision": "a" * 64,
    "details": {"jit": True},
}

SINGLET = read_fixture("valid", "optical-case", "singlet.json")
ALL_FEATURES = read_fixture("valid", "optical-case", "all-features.json")


# ── Gaussian optics, by hand ─────────────────────────────────────────────────────────────────────────────────────


def thick_lens(r1: float | None, r2: float | None, d: float, n: float, after: float = 1.0) -> dict[str, Fraction]:
    """The cardinal points of a lens of two surfaces at z = 0 and z = d, in exact arithmetic on the numbers given.

    Air in front, glass of index ``n`` between, a medium of index ``after`` behind; a radius of None is a plane.
    With the surface powers ``P1 = (n - 1) / r1`` and ``P2 = (after - n) / r2`` and the reduced thickness
    ``t = d / n`` the power is Gullstrand's ``P = P1 + P2 - P1 P2 t``, and

    - the front principal point lies ``P2 t / P`` behind the first vertex, the front focal point ``1 / P`` in
      front of it;
    - the rear principal point lies ``after P1 t / P`` in front of the second vertex, the rear focal point
      ``after / P`` behind it: the focal length of the contract is that distance, ``after / P``.
    """
    index, behind, thickness = Fraction(n), Fraction(after), Fraction(d)
    p1 = Fraction(0) if r1 is None else (index - 1) / Fraction(r1)
    p2 = Fraction(0) if r2 is None else (behind - index) / Fraction(r2)
    reduced = thickness / index
    power = p1 + p2 - p1 * p2 * reduced
    front_principal = p2 * reduced / power
    rear_principal = thickness - behind * p1 * reduced / power
    return {
        "power": power,
        "efl": behind / power,
        "frontPrincipalZ": front_principal,
        "rearPrincipalZ": rear_principal,
        "frontFocalZ": front_principal - 1 / power,
        "rearFocalZ": rear_principal + behind / power,
        "backFocus": rear_principal + behind / power - thickness,
    }


def image_of(z: Fraction | float, lens: dict[str, Fraction], at: float = 0.0) -> tuple[Fraction, Fraction]:
    """Where a lens in air, with its first vertex at ``at``, images the axial point ``z``, and how much larger.

    The Gaussian lens equation between the principal planes: ``1 / s' = 1 / s + P`` with ``s`` the distance of the
    point from the front principal point and ``s'`` that of its image from the rear one; the image is ``s' / s``
    times the size.
    """
    s = Fraction(z) - (Fraction(at) + lens["frontPrincipalZ"])
    s_image = 1 / (1 / s + lens["power"])
    return Fraction(at) + lens["rearPrincipalZ"] + s_image, s_image / s


def object_of(z: Fraction | float, lens: dict[str, Fraction], at: float = 0.0) -> tuple[Fraction, Fraction]:
    """The axial point of the object space that a lens in air images at ``z``, and how much larger that point is.

    The same equation solved the other way: ``1 / s = 1 / s' - P``; the object is ``s / s'`` times the size.
    """
    s_image = Fraction(z) - (Fraction(at) + lens["rearPrincipalZ"])
    s = 1 / (1 / s_image - lens["power"])
    return Fraction(at) + lens["frontPrincipalZ"] + s, s / s_image


def exact(case: dict[str, Any], line: int = 0) -> dict[str, Fraction]:
    """The contract's first-order data of a synthetic case in exact rational arithmetic: the textbook's y-nu trace.

    A paraxial ray is its height ``y`` and its reduced angle ``w = n u``. A surface of power ``P = (n' - n) c``
    turns ``w`` into ``w - y P``; a gap ``t`` in the index ``n`` turns ``y`` into ``y + (t / n) w``. The curvature
    is ``1 / radius``, 0 for a plane. Two rays, of height 1 and of angle 1, give everything:

    - through the whole lens they leave at heights ``a``, ``b`` with angles ``c``, ``d``: the ray of height 1
      crosses the axis ``-n' a / c`` behind the last vertex and, produced backwards, is at height 1 again
      ``n' (1 - a) / c`` behind it; the ray that leaves parallel came through the point ``d / c`` behind the first
      vertex, and the front principal point lies ``1 / c`` in front of that, as far as the focal length in air;
    - to the stop's plane they arrive at heights ``a``, ``b``: every ray through the point ``b / a`` behind the
      first vertex meets the stop at one height, ``1 / a`` of its own;
    - a ray of angle 1 from the centre of the stop, behind the stop's own refraction, leaves the lens at height
      ``b`` with the angle ``d``: it crosses the axis ``-n' b / d`` behind the last vertex, where the stop appears
      ``1 / d`` times its size.

    A case with a pupil at infinity divides by zero here: such a case is derived where it is tested.
    """
    system, conditions = case["system"], case["conditions"]
    surfaces = system["surfaces"]
    indices = [Fraction(value) for value in index_rows(case)[line]]
    vertices = [Fraction(entry["z"]) for entry in surfaces]
    curvatures = [
        Fraction(0) if entry["shape"].get("radius") is None else 1 / Fraction(entry["shape"]["radius"])
        for entry in surfaces
    ]
    last = len(surfaces) - 1
    stop = system["stopIndex"]

    def through(y: Fraction, w: Fraction, start: int, end: int, refract_first: bool) -> tuple[Fraction, Fraction]:
        """A ray carried from surface ``start`` to behind surface ``end``; refracted at ``start`` too, or not."""
        for number in range(start, end + 1):
            if number > start or refract_first:
                before = Fraction(1) if number == 0 else indices[number - 1]
                w = w - y * (indices[number] - before) * curvatures[number]
            if number < end:
                y = y + (vertices[number + 1] - vertices[number]) / indices[number] * w
        return y, w

    one, zero = Fraction(1), Fraction(0)
    a, c = through(one, zero, 0, last, True)
    b, d = through(zero, one, 0, last, True)
    behind = indices[last]
    rear_focal = vertices[last] - behind * a / c
    values = {
        "efl": -behind / c,
        "frontFocalZ": vertices[0] + d / c,
        "rearFocalZ": rear_focal,
        "frontPrincipalZ": vertices[0] + (d - 1) / c,
        "rearPrincipalZ": vertices[last] + behind * (1 - a) / c,
        "backFocus": rear_focal - vertices[system["lastLensSurfaceIndex"]],
    }

    # To the stop's plane, without the stop's own refraction: the last surface of this trace is not refracted at.
    def to_stop(y: Fraction, w: Fraction) -> Fraction:
        if stop == 0:
            return y
        y, w = through(y, w, 0, stop - 1, True)
        return y + (vertices[stop] - vertices[stop - 1]) / indices[stop - 1] * w

    front_a, front_b = to_stop(one, zero), to_stop(zero, one)
    rear_b, rear_d = through(zero, one, stop, last, False)
    radius = Fraction(conditions["stopSemiDiameter"])
    values.update(
        {
            "entrancePupilZ": vertices[0] + front_b / front_a,
            "exitPupilZ": vertices[last] - behind * rear_b / rear_d,
            "entrancePupilSemiDiameter": radius / abs(front_a),
            "exitPupilSemiDiameter": radius / abs(rear_d),
        }
    )
    if conditions["object"]["kind"] == "finite":
        # Newton: an object x from the front focal point is imaged 1 / (P x) times its size.
        values["magnification"] = 1 / (-c * (Fraction(conditions["object"]["z"]) - values["frontFocalZ"]))
    return values


def lens_surfaces(at: float = 0.0, **more: Any) -> list[dict[str, Any]]:
    """The two surfaces of the biconvex lens most tests here use: radii 50 and -50 mm, 4 mm thick."""
    return [surface(at, sphere(50), **more), surface(at + 4.0, sphere(-50), **more)]


LENS = thick_lens(50, -50, 4, 1.5)
"""That lens in glass of index 1.5, which ``make_case`` gives it: its focal length is 50.6757 mm."""


# ── Without optiland ─────────────────────────────────────────────────────────────────────────────────────────────


class RefusalTest(unittest.TestCase):
    """What the engine says it has no first-order data of, from the case alone and before anything is built."""

    def engine(self) -> tuple[OptilandEngine, list[str]]:
        built: list[str] = []

        def no_build(case: dict[str, Any]) -> Any:
            built.append(case["id"])
            raise AssertionError("nothing here builds an optic")

        return OptilandEngine(IDENTITY, build=no_build), built

    def test_the_engine_offers_the_quantity_at_the_version_of_the_contract(self) -> None:
        self.assertEqual(PARAXIAL_FIRST_ORDER, "paraxial.first-order")
        self.assertEqual(QUANTITIES[PARAXIAL_FIRST_ORDER], {"version": 1})
        # The values, in the order of the contract: every member the schema of the data requires but `recorded`.
        schema = REPO_ROOT / "contract" / "schema" / "v1" / "quantities" / "paraxial.first-order.data.schema.json"
        required = json.loads(schema.read_text(encoding="utf-8"))["required"]
        self.assertEqual([*FIRST_ORDER_VALUES, "recorded"], required)
        # The items the contract names are its own words (src/contract/quantities/paraxialFirstOrder.ts): the two
        # of every engine, and the one of an engine whose paraxial model reads the radius alone.
        self.assertEqual((AFOCAL_SYSTEM, LINEAR_SAG_TERM), ("system.afocal", "surface.asphere.linear-term"))
        self.assertEqual(QUADRATIC_SAG_TERM, "surface.asphere.quadratic-term")
        # And the one that is this engine's own.
        self.assertEqual(TELECENTRIC_OBJECT_SPACE, "system.telecentric.object-space")

    def test_a_term_of_power_1_and_a_term_of_power_2_are_named_with_the_first_surface_that_has_one(self) -> None:
        def case_of(*shapes: dict[str, Any]) -> dict[str, Any]:
            return make_case([surface(2.0 * number, shape) for number, shape in enumerate(shapes)])

        self.assertEqual(term_refusals(case_of(sphere(50), PLANE, sphere(-50))), [])
        # A term of power 3 or more is flat to second order: LensVisualizer's lowest is A3.
        self.assertEqual(term_refusals(case_of(asphere(50, -1, (3, 1e-5), (4, 1e-6), (20, 1e-30)))), [])
        # A coefficient of 0 adds nothing to a surface, in the contract and in optiland's list alike.
        self.assertEqual(term_refusals(case_of(asphere(50, 0, (1, 0.0), (2, 0.0), (4, 1e-6)))), [])

        quadratic = {
            "code": "feature",
            "item": "surface.asphere.quadratic-term",
            "message": "surface 1 has a term of power 2: optiland's paraxial power of a surface is "
            "(n2 - n1) / radius, which does not see it",
        }
        self.assertEqual(
            term_refusals(case_of(sphere(50), asphere(None, 0, (2, 1e-3)), asphere(30, 0, (2, -1e-3)))), [quadratic]
        )
        linear = {
            "code": "feature",
            "item": "surface.asphere.linear-term",
            "message": "surface 2 has a term of power 1: a cone has no curvature at its vertex",
        }
        # Both, the linear one first, each with the first surface it is on.
        both = case_of(sphere(50), asphere(None, 0, (2, 1e-3)), asphere(30, 0, (1, 1e-3), (2, 1e-3)))
        self.assertEqual(term_refusals(both), [linear, quadratic])

    def test_the_terms_keep_first_order_data_from_being_answered_and_nothing_else(self) -> None:
        curved = make_case([surface(0.0, asphere(50, 0, (2, 1e-3))), surface(4.0, sphere(-50))])
        self.assertEqual(
            [item["item"] for item in refusals(first_order_request(curved), curved)], [QUADRATIC_SAG_TERM]
        )
        # The system is built and echoed whatever its terms: only its first-order data is optiland's to refuse.
        self.assertEqual(refusals(describe_request(curved), curved), [])
        self.assertEqual(refusals(first_order_request(SINGLET), SINGLET), [])
        self.assertEqual(refusals(first_order_request(ALL_FEATURES), ALL_FEATURES), [])
        # After what the descriptor rules out, in the order of the comparator's negotiation.
        strange = {**curved, "features": ["surface.grating"]}
        self.assertEqual(
            [(item["code"], item["item"]) for item in refusals(first_order_request(strange), strange)],
            [("feature", "surface.grating"), ("feature", QUADRATIC_SAG_TERM)],
        )

    def test_such_a_case_is_answered_unsupported_before_anything_is_built(self) -> None:
        engine, built = self.engine()
        shapes = ((asphere(50, 0, (2, 1e-3)), QUADRATIC_SAG_TERM), (asphere(50, 0, (1, 1e-3)), LINEAR_SAG_TERM))
        for shape, item in shapes:
            case = make_case([surface(0.0, shape), surface(4.0, sphere(-50))])
            result = engine.run(first_order_request(case), case)
            self.assertEqual(validate_kind("result", result), [])
            self.assertEqual(result["status"], "unsupported")
            self.assertEqual([(entry["code"], entry["item"]) for entry in result["unsupported"]], [("feature", item)])
            self.assertNotIn("data", result)
        self.assertEqual(built, [])

    def test_a_spec_that_is_not_the_empty_object_is_bad_spec_before_anything_is_built(self) -> None:
        engine, built = self.engine()
        result = engine.run(first_order_request(SINGLET, {"sagFractions": [0, 1]}), SINGLET)
        self.assertEqual(validate_kind("result", result), [])
        self.assertEqual((result["status"], result["error"]["code"]), ("error", BAD_SPEC))
        self.assertTrue(result["error"]["message"].startswith("spec is not a paraxial.first-order spec: "), result)
        self.assertIn("[additionalProperties]", result["error"]["message"])
        self.assertEqual(built, [])


class HandDerivationTest(unittest.TestCase):
    """The derivations the other tests rest on agree with each other, and with the contract's worked answer."""

    def test_the_trace_gives_the_closed_form_of_a_thick_lens_exactly(self) -> None:
        for r1, r2, d, n in ((50, -50, 4, 1.5168), (30, 80, 12, 1.7), (-40, -25, 6, 1.6), (None, -50, 3, 1.5)):
            shapes = [PLANE if radius is None else sphere(radius) for radius in (r1, r2)]
            case = make_case([surface(0.0, shapes[0]), surface(float(d), shapes[1])], indices=[[n, 1.0]])
            traced, closed = exact(case), thick_lens(r1, r2, d, n)
            for name in ("efl", "frontFocalZ", "rearFocalZ", "frontPrincipalZ", "rearPrincipalZ", "backFocus"):
                self.assertEqual(traced[name], closed[name], f"{name} of {(r1, r2, d, n)}")

    def test_the_trace_gives_the_contracts_worked_answer_of_the_singlet(self) -> None:
        # contract/fixtures: "worked out from the formulas of a thick lens in air".
        worked = read_fixture("valid", "quantities", "paraxial.first-order.data", "singlet.json")
        traced = exact(SINGLET)
        for name in FIRST_ORDER_VALUES:
            self.assertAlmostEqual(float(traced[name]), f8(worked[name])[0], delta=1e-13, msg=name)

    def test_the_lens_equation_and_the_trace_place_a_pupil_alike(self) -> None:
        # A plane stop 10 mm in front of the lens, and one 10 mm behind it.
        front = make_case([surface(0.0, PLANE), *lens_surfaces(10.0)], indices=[[1.0, 1.5, 1.0]], stop=0)
        z, size = image_of(0, LENS, at=10.0)
        self.assertEqual((exact(front)["exitPupilZ"], exact(front)["exitPupilSemiDiameter"]), (z, 2 * abs(size)))
        behind = make_case([*lens_surfaces(), surface(14.0, PLANE)], indices=[[1.5, 1.0, 1.0]], stop=2)
        z, size = object_of(14, LENS)
        traced = exact(behind)
        self.assertEqual((traced["entrancePupilZ"], traced["entrancePupilSemiDiameter"]), (z, 2 * abs(size)))


# ── On the real optiland ─────────────────────────────────────────────────────────────────────────────────────────


@unittest.skipIf(MISSING is not None, MISSING)
class FirstOrderTest(unittest.TestCase):
    def answer(self, case: dict[str, Any]) -> dict[str, Any]:
        """The data optiland gives for a case, valid by the quantity's schema, as the engine would send it."""
        answered = first_order_of(build_case(case).optics, case["system"]["lastLensSurfaceIndex"])
        self.assertIsNotNone(answered.data, answered.unsupported)
        data = answered.data
        assert data is not None
        self.assertEqual(validate(contract_schemas(), quantity_schema_id(PARAXIAL_FIRST_ORDER, "data"), data), [])
        lines = len(case["conditions"]["lines"])
        for name in FIRST_ORDER_VALUES:
            self.assertEqual(len(f8(data[name])), lines, name)
        return data

    def refused(self, case: dict[str, Any]) -> tuple[dict[str, str], ...]:
        answered = first_order_of(build_case(case).optics, case["system"]["lastLensSurfaceIndex"])
        self.assertIsNone(answered.data)
        return answered.unsupported

    def hold(self, data: dict[str, Any], expected: dict[str, Any], line: int = 0, said: str = "") -> float:
        """Holds every compared value of one line to the exact one, and returns the largest difference, mm."""
        worst = 0.0
        for name in FIRST_ORDER_VALUES:
            got = f8(data[name])[line]
            self.assertTrue(math.isfinite(got), f"{said} {name}: {got}")
            difference = float(abs(Fraction(got) - Fraction(expected[name])))
            self.assertLessEqual(difference, TOLERANCE_MM, f"{said} {name}: {got} for {float(expected[name])}")
            worst = max(worst, difference)
        return worst

    # ── Lenses in air ────────────────────────────────────────────────────────────────────────────────────────────

    def test_the_contracts_singlet_has_the_cardinal_points_of_a_thick_lens_and_its_worked_answer(self) -> None:
        # Radii 50 and -50 mm, 4 mm of glass of index 1.5168, the stop on the first surface with a radius of 5 mm.
        lens = thick_lens(50, -50, 4, 1.5168)
        n, d = Fraction(1.5168), Fraction(4)
        # The entrance pupil is the stop: nothing stands in front of it, and its own refraction moves no image.
        # The exit pupil is the stop seen through the second surface from d inside the glass: one refracting
        # surface images a point s in front of it (s = -d) at s' with 1 / s' = n / s + P2 (the image space is air),
        # n s' / s times its size.
        p2 = (1 - n) / Fraction(-50)
        s_image = 1 / (n / -d + p2)
        expected = {
            **lens,
            "entrancePupilZ": Fraction(0),
            "entrancePupilSemiDiameter": Fraction(5),
            "exitPupilZ": d + s_image,
            "exitPupilSemiDiameter": 5 * abs(n * s_image / -d),
        }
        data = self.answer(SINGLET)
        self.hold(data, expected)
        self.assertAlmostEqual(float(lens["efl"]), 49.043005012335836, delta=1e-12)
        # The same numbers as the contract's fixture of the answer, which was worked out apart from this test.
        worked = read_fixture("valid", "quantities", "paraxial.first-order.data", "singlet.json")
        for name in FIRST_ORDER_VALUES:
            self.assertAlmostEqual(f8(data[name])[0], f8(worked[name])[0], delta=TOLERANCE_MM, msg=name)
        # optiland's f-number is its focal length over the diameter of its entrance pupil.
        self.assertEqual(sorted(data["recorded"]), ["optilandFNumber"])
        self.assertAlmostEqual(f8(data["recorded"]["optilandFNumber"])[0], float(lens["efl"]) / 10.0, delta=1e-13)

    def test_a_thick_meniscus_with_the_stop_on_its_last_surface(self) -> None:
        # Radii 30 and 80 mm, 12 mm of glass of index 1.7: a thick positive meniscus, whose front principal point
        # lies in front of the lens. The stop is the second surface.
        case = make_case(
            [surface(0.0, sphere(30)), surface(12.0, sphere(80))], indices=[[1.7, 1.0]], stop=1, stop_radius=3.0
        )
        lens = thick_lens(30, 80, 12, 1.7)
        self.assertTrue(lens["power"] > 0 and lens["frontPrincipalZ"] < 0)
        n, d = Fraction(1.7), Fraction(12)
        # The exit pupil is the stop. The entrance pupil is the point of the object space that the first surface
        # images onto the stop's centre, d behind it in the glass: n / s' = 1 / s + P1 with s' = d gives s, and
        # the stop is n s' / (n' s) = d / (n s) times the size of that point's neighbourhood (n' = n, n = 1).
        p1 = (n - 1) / Fraction(30)
        s = 1 / (n / d - p1)
        expected = {
            **lens,
            "entrancePupilZ": s,
            "entrancePupilSemiDiameter": 3 / abs(d / (n * s)),
            "exitPupilZ": d,
            "exitPupilSemiDiameter": Fraction(3),
        }
        self.hold(self.answer(case), expected)
        self.assertEqual(exact(case)["entrancePupilZ"], s)

    def test_a_cemented_doublet(self) -> None:
        # Three surfaces, two glasses: crown in front, flint behind, the stop on the first surface. Traced by hand
        # in exact arithmetic (`exact`): the y-nu trace of two rays.
        case = make_case(
            [surface(0.0, sphere(61.47)), surface(6.0, sphere(-44.64)), surface(8.5, sphere(-129.94))],
            indices=[[1.5168, 1.6727, 1.0]],
            stop_radius=7.5,
        )
        expected = exact(case)
        self.assertAlmostEqual(float(expected["efl"]), 100.0, delta=0.5)
        self.assertLess(self.hold(self.answer(case), expected), 1e-12)

    # ── Where the stop stands ────────────────────────────────────────────────────────────────────────────────────

    def test_a_stop_in_front_of_the_lens_is_the_entrance_pupil_and_is_imaged_by_the_whole_lens(self) -> None:
        # A plane stop of radius 1.75 mm at z = 0, the biconvex lens 10 mm behind it.
        case = make_case(
            [surface(0.0, PLANE), *lens_surfaces(10.0)], indices=[[1.0, 1.5, 1.0]], stop=0, stop_radius=1.75
        )
        shifted = {name: value + (0 if name in ("efl", "backFocus", "power") else 10) for name, value in LENS.items()}
        z, size = image_of(0, LENS, at=10.0)
        # 10 mm is inside the focal length: the exit pupil is a virtual, upright, larger image in front of the lens.
        self.assertTrue(z < 0 and size > 1)
        expected = {
            **shifted,
            "entrancePupilZ": Fraction(0),
            "entrancePupilSemiDiameter": Fraction(1.75),
            "exitPupilZ": z,
            "exitPupilSemiDiameter": Fraction(1.75) * size,
        }
        self.hold(self.answer(case), expected)

    def test_a_stop_behind_the_lens_is_the_exit_pupil_and_is_seen_through_the_whole_lens(self) -> None:
        case = make_case([*lens_surfaces(), surface(14.0, PLANE)], indices=[[1.5, 1.0, 1.0]], stop=2, stop_radius=1.75)
        z, size = object_of(14, LENS)
        self.assertTrue(z > 14 and size > 1)
        expected = {
            **LENS,
            # The back focus is from the last vertex of the case, which here is the stop's plane.
            "backFocus": LENS["rearFocalZ"] - 14,
            "entrancePupilZ": z,
            "entrancePupilSemiDiameter": Fraction(1.75) * size,
            "exitPupilZ": Fraction(14),
            "exitPupilSemiDiameter": Fraction(1.75),
        }
        self.hold(self.answer(case), expected)

    def test_a_stop_between_two_lenses_is_imaged_by_each_into_its_own_space(self) -> None:
        # The lens twice, 12 mm apart, with a plane stop in the middle: the front lens alone makes the entrance
        # pupil, the rear lens alone the exit pupil, and the cardinal points are those of the pair.
        case = make_case(
            [*lens_surfaces(), surface(10.0, PLANE), *lens_surfaces(16.0)],
            indices=[[1.5, 1.0, 1.0, 1.5, 1.0]],
            stop=2,
            stop_radius=2.5,
        )
        entrance, entrance_size = object_of(10, LENS)
        leaving, leaving_size = image_of(10, LENS, at=16.0)
        pair = exact(case)
        expected = {
            **pair,
            "entrancePupilZ": entrance,
            "entrancePupilSemiDiameter": Fraction(2.5) * abs(entrance_size),
            "exitPupilZ": leaving,
            "exitPupilSemiDiameter": Fraction(2.5) * abs(leaving_size),
        }
        self.assertEqual((pair["entrancePupilZ"], pair["exitPupilZ"]), (entrance, leaving))
        self.hold(self.answer(case), expected)
        # Two lenses of power P whose principal planes are e apart have the power 2 P - P^2 e (Gullstrand): the
        # rear principal point of the first is at 4 - h and the front one of the second at 16 + h.
        apart = (16 + LENS["frontPrincipalZ"]) - LENS["rearPrincipalZ"]
        self.assertEqual(pair["efl"], 1 / (2 * LENS["power"] - LENS["power"] ** 2 * apart))
        self.assertAlmostEqual(float(pair["efl"]), 29.64, delta=0.01)

    def test_the_pupils_are_images_of_the_stop_radius_of_the_case_not_of_the_stop_surfaces_clip_limit(self) -> None:
        # The stop surface clips at 2.75 mm and the stop setting of the case is 2 mm. optiland's ray aiming takes
        # the stop's radius from the surface's aperture (r_max); its paraxial pupils take it from the system's
        # aperture, which the builder set to twice conditions.stopSemiDiameter. The worker asks the second.
        surfaces = [*lens_surfaces(), surface(14.0, PLANE, 2.0, clip=2.75)]
        case = make_case(surfaces, indices=[[1.5, 1.0, 1.0]], stop=2, stop_radius=2.0)
        optic = build_case(case).optics[0]
        self.assertEqual(float(optic.surfaces[3].aperture.r_max), 2.75)
        self.assertEqual(float(optic.aperture.value), 4.0)
        _, size = object_of(14, LENS)
        data = self.answer(case)
        self.assertAlmostEqual(f8(data["entrancePupilSemiDiameter"])[0], float(2 * size), delta=TOLERANCE_MM)
        self.assertAlmostEqual(f8(data["exitPupilSemiDiameter"])[0], 2.0, delta=TOLERANCE_MM)
        self.assertGreater(abs(f8(data["entrancePupilSemiDiameter"])[0] - float(Fraction(2.75) * size)), 0.5)

    def test_a_pupil_that_is_upside_down_has_a_radius_above_zero(self) -> None:
        # A stop 150 mm behind the lens, beyond its focus: a ray that enters above the axis meets the stop below
        # it, and optiland's EPD(), a stop diameter over that height, is negative. A radius is a size.
        behind = make_case([*lens_surfaces(), surface(150.0, PLANE)], indices=[[1.5, 1.0, 1.0]], stop=2)
        optic = build_case(behind).optics[0]
        self.assertLess(float(optic.paraxial.EPD()[0]), 0)
        z, size = object_of(150, LENS)
        self.assertTrue(size < 0 and z < 0, "the entrance pupil is a real, inverted image in front of the lens")
        data = self.answer(behind)
        expected = {**exact(behind), "entrancePupilZ": z, "entrancePupilSemiDiameter": 2 * abs(size)}
        self.hold(data, expected)
        # What is recorded is optiland's own number, with optiland's sign.
        self.assertLess(f8(data["recorded"]["optilandFNumber"])[0], 0)

        # And the exit pupil of a stop far in front: XPD() is negative there.
        front = make_case([surface(0.0, PLANE), *lens_surfaces(150.0)], indices=[[1.0, 1.5, 1.0]], stop=0)
        self.assertLess(float(build_case(front).optics[0].paraxial.XPD()), 0)
        z, size = image_of(0, LENS, at=150.0)
        self.assertLess(size, 0)
        data = self.answer(front)
        self.assertAlmostEqual(f8(data["exitPupilZ"])[0], float(z), delta=TOLERANCE_MM)
        self.assertAlmostEqual(f8(data["exitPupilSemiDiameter"])[0], float(2 * abs(size)), delta=TOLERANCE_MM)

    # ── The object, the image plane and the rear plate ───────────────────────────────────────────────────────────

    def test_a_finite_object_changes_nothing_but_the_magnification_that_is_recorded(self) -> None:
        # Cardinal points and pupils are the lens's and the stop's: an object plane moves none of them. optiland
        # sizes its pupils with a ray from the axial object point, so this is where a mistake of frame would show.
        surfaces = [*lens_surfaces(), surface(14.0, PLANE)]
        far = self.answer(make_case([dict(entry) for entry in surfaces], indices=[[1.5, 1.0, 1.0]], stop=2))
        self.assertEqual(sorted(far["recorded"]), ["optilandFNumber"])
        for object_z in (-200.0, -1000.0, -60.0):
            case = make_case(
                [dict(entry) for entry in surfaces], indices=[[1.5, 1.0, 1.0]], stop=2, object_z=object_z
            )
            expected = exact(case)
            data = self.answer(case)
            self.hold(data, expected, said=f"object at {object_z}")
            for name in FIRST_ORDER_VALUES:
                self.assertAlmostEqual(f8(data[name])[0], f8(far[name])[0], delta=TOLERANCE_MM, msg=name)
            # Newton's equation: an object x from the front focal point is imaged f / x times its size.
            by_newton = LENS["efl"] / (Fraction(object_z) - LENS["frontFocalZ"])
            self.assertEqual(expected["magnification"], by_newton)
            newton = float(by_newton)
            self.assertEqual(sorted(data["recorded"]), ["magnification", "optilandFNumber"])
            self.assertAlmostEqual(f8(data["recorded"]["magnification"])[0], newton, delta=1e-12 * abs(newton))
            self.assertLess(newton, 0, "a real object beyond the focal point is imaged upside down")

    def test_the_rear_focal_point_is_referred_to_the_image_plane_wherever_the_case_put_it(self) -> None:
        # optiland's F2(), P2() and XPL() are distances from the image surface. The same lens with its image plane
        # at the design position (z = 29), 0.4 mm behind that, in front of the lens, inside the lens and a metre
        # away gives the same points.
        design = self.answer(make_case(lens_surfaces(), indices=[[1.5, 1.0]]))
        for image_z in (29.4, -1.0, 2.0, 1000.0):
            data = self.answer(make_case(lens_surfaces(), indices=[[1.5, 1.0]], image_z=image_z))
            for name in FIRST_ORDER_VALUES:
                self.assertAlmostEqual(f8(data[name])[0], f8(design[name])[0], delta=TOLERANCE_MM, msg=name)
        self.hold(design, exact(make_case(lens_surfaces(), indices=[[1.5, 1.0]])))

    def test_the_front_of_the_lens_is_referred_to_the_first_vertex_wherever_it_stands(self) -> None:
        # optiland's F1(), P1() and EPL() are distances from its first surface. A case has its first vertex at 0,
        # so the vertex the worker adds to them is 0 in every case there is, and leaving it out would show nowhere.
        # Here the lens, the plane stop 10 mm behind it and the image plane stand 7 mm further along the axis, as
        # no case does (the builder does not ask where a first vertex is): a system moved as a whole has every
        # position 7 mm further on and every length as it was, the one in front of the lens like the ones behind.
        moved = 7.0
        case = make_case(
            [*lens_surfaces(moved), surface(moved + 14.0, PLANE)], indices=[[1.5, 1.0, 1.0]], stop=2, stop_radius=1.75
        )
        z, size = object_of(14, LENS)
        lengths = {
            "efl": LENS["efl"],
            "backFocus": LENS["rearFocalZ"] - 14,
            "entrancePupilSemiDiameter": Fraction(1.75) * size,
            "exitPupilSemiDiameter": Fraction(1.75),
        }
        positions = {
            "frontFocalZ": LENS["frontFocalZ"],
            "rearFocalZ": LENS["rearFocalZ"],
            "frontPrincipalZ": LENS["frontPrincipalZ"],
            "rearPrincipalZ": LENS["rearPrincipalZ"],
            "entrancePupilZ": z,
            "exitPupilZ": Fraction(14),
        }
        expected = {**lengths, **{name: value + Fraction(moved) for name, value in positions.items()}}
        self.assertEqual(sorted(expected), sorted(FIRST_ORDER_VALUES))
        self.assertTrue(LENS["frontFocalZ"] < 0 < LENS["frontPrincipalZ"] and z > 14)
        optic = build_case(case).optics[0]
        self.assertEqual(float(optic.surfaces.positions[1, 0]), moved)
        data = self.answer(case)
        self.hold(data, expected)
        # And with an object 200 mm in front of where the lens was: optiland launches its marginal ray at the object
        # plane towards the rim of an entrance pupil it places from its first surface.
        near = make_case(
            [*lens_surfaces(moved), surface(moved + 14.0, PLANE)],
            indices=[[1.5, 1.0, 1.0]],
            stop=2,
            stop_radius=1.75,
            object_z=moved - 200.0,
        )
        answered = self.answer(near)
        self.hold(answered, expected)
        newton = float(LENS["efl"] / (Fraction(-200) - LENS["frontFocalZ"]))
        self.assertAlmostEqual(f8(answered["recorded"]["magnification"])[0], newton, delta=1e-12 * abs(newton))

    def test_the_back_focus_is_from_the_last_lens_vertex_and_a_rear_plate_lies_inside_it(self) -> None:
        # The singlet with a cover glass behind it: 2 mm of index 1.5168, from z = 30. A plate of thickness t and
        # index n moves a focus behind it t (1 - 1 / n) further away and changes no focal length.
        def plate() -> list[dict[str, Any]]:
            return [surface(30.0, PLANE), surface(32.0, PLANE)]

        indices = [[1.5, 1.0, 1.5168, 1.0]]
        shift = 2 * (1 - 1 / Fraction(1.5168))
        expected = {
            **LENS,
            "rearFocalZ": LENS["rearFocalZ"] + shift,
            "rearPrincipalZ": LENS["rearPrincipalZ"] + shift,
            "entrancePupilZ": Fraction(0),
            "entrancePupilSemiDiameter": Fraction(2),
        }
        with_plate = make_case([*lens_surfaces(), *plate()], indices=indices, last_lens=1)
        self.assertEqual(with_plate["system"]["lastLensSurfaceIndex"], 1)
        self.assertEqual([entry.get("synthetic") for entry in with_plate["system"]["surfaces"]][2:], ["rearPlate"] * 2)
        from_lens = self.answer(with_plate)
        self.assertAlmostEqual(f8(from_lens["rearFocalZ"])[0], float(expected["rearFocalZ"]), delta=TOLERANCE_MM)
        self.assertAlmostEqual(f8(from_lens["efl"])[0], float(LENS["efl"]), delta=TOLERANCE_MM)
        # From the vertex of the lens at z = 4, not from the plate's last surface at z = 32.
        self.assertAlmostEqual(f8(from_lens["backFocus"])[0], float(expected["rearFocalZ"] - 4), delta=TOLERANCE_MM)
        self.hold(from_lens, exact(with_plate))

        # The same four surfaces with the plate counted as lens: every value but the back focus is the same.
        as_lens = self.answer(make_case([*lens_surfaces(), *plate()], indices=indices))
        self.assertAlmostEqual(f8(as_lens["backFocus"])[0], float(expected["rearFocalZ"] - 32), delta=TOLERANCE_MM)
        for name in FIRST_ORDER_VALUES:
            if name != "backFocus":
                self.assertEqual(f8(as_lens[name]), f8(from_lens[name]), name)

    # ── An image space that is not air ───────────────────────────────────────────────────────────────────────────

    def test_one_surface_into_glass_has_the_focal_length_of_its_image_space(self) -> None:
        # A surface of radius 50 mm into an index of 1.5 that reaches to the image plane: its power is
        # 0.5 / 50 = 0.01 per mm. The rear focal point lies n' / P = 150 mm behind it, the front one 1 / P = 100 mm
        # in front, and both principal points are the vertex. The contract's focal length is the rear one.
        case = make_case([surface(0.0, sphere(50))], indices=[[1.5]])
        expected = {
            "efl": 150,
            "frontFocalZ": -100,
            "rearFocalZ": 150,
            "frontPrincipalZ": 0,
            "rearPrincipalZ": 0,
            "backFocus": 150,
            # The stop is the only surface: it is both pupils.
            "entrancePupilZ": 0,
            "exitPupilZ": 0,
            "entrancePupilSemiDiameter": 2,
            "exitPupilSemiDiameter": 2,
        }
        self.hold(self.answer(case), expected)

    def test_a_thick_lens_that_ends_in_water(self) -> None:
        case = make_case(lens_surfaces(), indices=[[1.5, 1.33]], stop_radius=3.0)
        lens = thick_lens(50, -50, 4, 1.5, after=1.33)
        n, behind, d = Fraction(1.5), Fraction(1.33), Fraction(4)
        # The stop on the first surface, seen through the second from d inside the glass, into water:
        # n' / s' = n / s + P2 with s = -d, and the image is n s' / (n' s) times the size.
        p2 = (behind - n) / Fraction(-50)
        s_image = behind / (n / -d + p2)
        expected = {
            **lens,
            "entrancePupilZ": Fraction(0),
            "entrancePupilSemiDiameter": Fraction(3),
            "exitPupilZ": d + s_image,
            "exitPupilSemiDiameter": 3 * abs(n * s_image / (behind * -d)),
        }
        self.hold(self.answer(case), expected)
        self.assertEqual(exact(case)["efl"], lens["efl"])
        # In water the rear focal length is longer than in air by more than the index: the second surface is weaker.
        self.assertGreater(float(lens["efl"]), 1.33 * float(LENS["efl"]))

    def test_an_image_surface_left_in_air_would_be_another_system_and_is_refused(self) -> None:
        # optiland takes the index of the image space from the image surface, and its paraxial rays are refracted
        # there. With optiland's default, air, behind the image plane of the surface into glass above, optiland's
        # focal length is 1 / P = 100 mm: that of a system with an interface the case does not have.
        case = make_case([surface(0.0, sphere(50))], indices=[[1.5]])
        optic = build_optic(case, 0)
        verify_optic(optic, case, 0)
        self.assertAlmostEqual(float(optic.paraxial.f2()), 150.0, delta=1e-12)
        optic.surfaces[-1].material_post = build.optiland_api().IdealMaterial(n=1.0)
        self.assertAlmostEqual(float(optic.paraxial.f2()), 100.0, delta=1e-12)
        with self.assertRaises(BuildMismatch) as raised:
            verify_optic(optic, case, 0)
        self.assertEqual(
            str(raised.exception),
            "the image surface: the index of the image space is 1.0 in the optic optiland built and 1.5 in the case "
            "(line 0, 587.5618 nm)",
        )

    # ── Several lines ────────────────────────────────────────────────────────────────────────────────────────────

    def test_every_line_is_answered_from_its_own_optic_with_its_own_indices(self) -> None:
        lines = (587.5618, 486.1327, 656.2725)
        glass = (1.5168, 1.5224, 1.5143)
        case = make_case(lens_surfaces(), lines=lines, indices=[[n, 1.0] for n in glass], stop_radius=4.0)
        data = self.answer(case)
        focal_lengths = []
        for line, n in enumerate(glass):
            lens = thick_lens(50, -50, 4, n)
            index, d = Fraction(n), Fraction(4)
            s_image = 1 / (index / -d + (1 - index) / Fraction(-50))
            expected = {
                **lens,
                "entrancePupilZ": Fraction(0),
                "entrancePupilSemiDiameter": Fraction(4),
                "exitPupilZ": d + s_image,
                "exitPupilSemiDiameter": 4 * abs(index * s_image / -d),
            }
            self.hold(data, expected, line, said=f"line {line}")
            focal_lengths.append(f8(data["efl"])[line])
            self.assertAlmostEqual(
                f8(data["recorded"]["optilandFNumber"])[line], float(lens["efl"]) / 8.0, delta=1e-13
            )
        # Blue is bent more: the focal length is shortest at the F line and longest at the C line.
        self.assertTrue(focal_lengths[1] < focal_lengths[0] < focal_lengths[2], focal_lengths)

    def test_the_case_with_every_feature_is_answered_at_both_lines_as_the_trace_by_hand_gives_it(self) -> None:
        # An odd asphere on a flat base (powers 3 and 4), an even asphere, an annular aperture, a rear plate, a
        # finite object, two lines and an image plane that is not the design one: none of them is curvature at a
        # vertex but the radii, and the back focus is from surface 4, in front of the plate.
        self.assertEqual(ALL_FEATURES["system"]["lastLensSurfaceIndex"], 4)
        data = self.answer(ALL_FEATURES)
        for line in range(2):
            expected = exact(ALL_FEATURES, line)
            self.assertLess(self.hold(data, expected, line), 1e-12)
            magnification = f8(data["recorded"]["magnification"])[line]
            self.assertAlmostEqual(magnification, float(expected["magnification"]), delta=1e-14)

    # ── What optiland has no first-order data of ─────────────────────────────────────────────────────────────────

    def test_a_term_of_power_3_or_more_changes_nothing_nor_does_a_term_of_power_2_without_a_coefficient(self) -> None:
        plain = self.answer(make_case(lens_surfaces(), indices=[[1.5, 1.0]]))
        for terms in (((4, 1e-5), (6, -1e-8)), ((3, 1e-4), (4, 1e-5)), ((2, 0.0), (4, 1e-5)), ((1, 0.0), (2, 0.0))):
            shaped = make_case(
                [surface(0.0, asphere(50, -0.7, *terms)), surface(4.0, sphere(-50))], indices=[[1.5, 1.0]]
            )
            data = self.answer(shaped)
            for name in FIRST_ORDER_VALUES:
                self.assertEqual(f8(data[name]), f8(plain[name]), f"{name} with {terms}")

    def test_a_term_of_power_2_is_unsupported_by_the_engine_and_what_optiland_would_say_is_another_lens(self) -> None:
        # The contract counts twice the coefficient as curvature: 1 / 50 + 2e-3 at the first vertex, a lens of
        # 48.29 mm. optiland's paraxial model reads the radius alone and says 50.68 mm, the lens without the term.
        case = make_case([surface(0.0, asphere(50, 0, (2, 1e-3))), surface(4.0, sphere(-50))], indices=[[1.5, 1.0]])
        contract = thick_lens(1 / (1 / 50 + 2e-3), -50, 4, 1.5)
        self.assertAlmostEqual(float(contract["efl"]), 48.29362524146813, delta=1e-9)
        without_refusal = first_order_of(build_case(case).optics, 1)
        self.assertIsNotNone(without_refusal.data)
        assert without_refusal.data is not None
        self.assertAlmostEqual(f8(without_refusal.data["efl"])[0], float(LENS["efl"]), delta=TOLERANCE_MM)

        result = OptilandEngine(IDENTITY).run(first_order_request(case), case)
        self.assertEqual(validate_kind("result", result), [])
        self.assertEqual(result["status"], "unsupported")
        self.assertEqual([item["item"] for item in result["unsupported"]], [QUADRATIC_SAG_TERM])

    def test_an_afocal_system_is_unsupported_also_where_rounding_left_it_a_focal_length(self) -> None:
        # A surface of radius 50 mm into glass of index 1.5 focuses 150 mm behind itself, in the glass. A second
        # surface of radius -25 mm has its front focal point 1.5 / 0.02 = 75 mm in front of itself. 225 mm apart,
        # parallel light leaves parallel: the powers 0.01 and 0.02 cancel against 0.01 x 0.02 x 225 / 1.5 = 0.03.
        telescope = make_case([surface(0.0, sphere(50)), surface(225.0, sphere(-25))], indices=[[1.5, 1.0]])
        (item,) = self.refused(telescope)
        self.assertEqual((item["code"], item["item"]), ("feature", "system.afocal"))
        self.assertEqual(
            item["message"],
            "the system has no finite focal length at line 0: optiland's f2() is -inf mm, and the powers of the "
            "surfaces add up to 0.03 per mm",
        )

        # The same construction with numbers that are not doubles: the gap n (r1 - r2) / (n - 1) is rounded, and
        # the powers cancel to -2.3e-18 per mm in exact arithmetic. optiland's f2() is then a number, -2.9e17 mm.
        n, r1, r2 = 1.7, 41.3, -17.9
        gap = n * (r1 - r2) / (n - 1)
        rounded = make_case([surface(0.0, sphere(r1)), surface(gap, sphere(r2))], indices=[[n, 1.0]])
        index, p1, p2 = Fraction(n), (Fraction(n) - 1) / Fraction(r1), (1 - Fraction(n)) / Fraction(r2)
        left = p1 + p2 - p1 * p2 * Fraction(gap) / index
        self.assertTrue(0 < abs(left) < 1e-17, float(left))
        focal_length = float(build_case(rounded).optics[0].paraxial.f2())
        self.assertTrue(math.isfinite(focal_length) and abs(focal_length) > 1e16, focal_length)
        (item,) = self.refused(rounded)
        self.assertEqual(item["item"], "system.afocal")
        self.assertIn(f"optiland's f2() is {focal_length!r} mm", item["message"])

        # Both lines of a case that is afocal at each are named, once.
        surfaces = [surface(0.0, sphere(50)), surface(225.0, sphere(-25))]
        two = make_case(surfaces, lines=(587.5618, 486.1327), indices=[[1.5, 1.0]] * 2)
        (item,) = self.refused(two)
        self.assertTrue(item["message"].startswith("the system has no finite focal length at lines 0, 1: "), item)

    def test_a_weak_lens_is_not_afocal(self) -> None:
        # A power that is small against nothing is a power: a plano-convex lens of 10 km focal length, and a
        # meniscus whose two surfaces cancel to under a percent of themselves.
        weak = make_case([surface(0.0, sphere(5e6)), surface(2.0, PLANE)], indices=[[1.5, 1.0]])
        self.assertAlmostEqual(f8(self.answer(weak)["efl"])[0], 1e7, delta=1e-6)
        meniscus = make_case([surface(0.0, sphere(50.0)), surface(2.0, sphere(50.001))], indices=[[1.5, 1.0]])
        lens = thick_lens(50.0, 50.001, 2, 1.5)
        self.assertGreater(float(lens["power"] / (abs(Fraction(1, 100)) * 2)), 1e6 * AFOCAL_RELATIVE_POWER)
        # 7.5 m of focal length from a sum that cancels by 150: a relative agreement, not one in millimetres.
        got = f8(self.answer(meniscus)["efl"])[0]
        self.assertAlmostEqual(got, float(lens["efl"]), delta=1e-12 * float(lens["efl"]))

    def test_an_exit_pupil_at_infinity_is_the_infinity_of_its_sign_and_an_infinite_radius(self) -> None:
        # A plano-convex lens, convex side first: radius 50 mm, 3 mm of index 1.5, then a plane. Its power is that
        # of the first surface, 0.01 per mm; its front principal point is the first vertex (the plane has no
        # power), so its front focal point lies 100 mm in front of that vertex. The stop is a plane there, at
        # z = 0, with the lens at z = 100: telecentric in image space.
        case = make_case(
            [surface(0.0, PLANE), surface(100.0, sphere(50)), surface(103.0, PLANE)], indices=[[1.0, 1.5, 1.0]], stop=0
        )
        lens = thick_lens(50, None, 3, 1.5)
        self.assertEqual((lens["efl"], lens["frontPrincipalZ"], lens["rearPrincipalZ"]), (100, 0, 1))
        data = self.answer(case)
        finite = {
            "efl": 100,
            "frontFocalZ": 0,
            "frontPrincipalZ": 100,
            "rearPrincipalZ": 101,
            "rearFocalZ": 201,
            "backFocus": 98,
            "entrancePupilZ": 0,
            "entrancePupilSemiDiameter": 2,
        }
        for name, expected in finite.items():
            self.assertAlmostEqual(f8(data[name])[0], expected, delta=TOLERANCE_MM, msg=name)
        # A ray from the centre of the stop, upwards, leaves the lens parallel to the axis and above it: produced
        # backwards it never comes down to the axis. The contract's exit pupil is -n' b / d behind the last vertex
        # with b the height that ray leaves at, above 0, and d its angle, which is 1 - 0.01 x 100: the zero of a
        # difference of two equal numbers, +0. So the pupil is at minus infinity, and its radius, stop / |d|, is
        # the positive infinity: never a NaN.
        self.assertEqual(f8(data["exitPupilZ"]), [-math.inf])
        self.assertEqual(f8(data["exitPupilSemiDiameter"]), [math.inf])

    def test_an_entrance_pupil_at_infinity_is_unsupported_for_optiland_has_no_exit_pupil_diameter_then(self) -> None:
        # The same lens turned round, plane side first: its rear principal point is the second vertex, so its rear
        # focal point lies 100 mm behind that, at z = 103, and the stop is a plane there. A ray that enters
        # parallel to the axis goes through the centre of the stop: the entrance pupil is at infinity.
        surfaces = [surface(0.0, PLANE), surface(3.0, sphere(-50)), surface(103.0, PLANE)]
        case = make_case(surfaces, indices=[[1.5, 1.0, 1.0]], stop=2)
        lens = thick_lens(None, -50, 3, 1.5)
        self.assertEqual((lens["efl"], lens["rearPrincipalZ"], lens["rearFocalZ"]), (100, 3, 103))
        optic = build_case(case).optics[0]
        with warnings.catch_warnings():
            warnings.simplefilter("ignore", RuntimeWarning)
            # The exit pupil is the stop itself, 2 mm in radius. optiland follows a marginal ray to it that it
            # launches at the rim of the entrance pupil, which is nowhere: its diameter is no number.
            self.assertTrue(math.isnan(float(optic.paraxial.XPD())))
            self.assertTrue(math.isinf(float(optic.paraxial.EPL())) and math.isinf(float(optic.paraxial.EPD()[0])))
        (item,) = self.refused(case)
        self.assertEqual((item["code"], item["item"]), ("feature", "system.telecentric.object-space"))
        self.assertEqual(
            item["message"],
            "the entrance pupil is at infinity, so optiland has no diameter of the exit pupil at line 0: optiland's "
            "EPL() is inf mm and its EPD() inf mm",
        )
        # With a finite object as well: the ray from the object to the rim of that pupil is as undefined.
        near = make_case([dict(entry) for entry in surfaces], indices=[[1.5, 1.0, 1.0]], stop=2, object_z=-250.0)
        self.assertEqual([entry["item"] for entry in self.refused(near)], [TELECENTRIC_OBJECT_SPACE])

        # The engine answers it as a result of status "unsupported", like any item of negotiation.
        result = OptilandEngine(IDENTITY).run(first_order_request(case), case)
        self.assertEqual(validate_kind("result", result), [])
        self.assertEqual((result["status"], result["unsupported"]), ("unsupported", [item]))

    def test_either_infinity_of_the_entrance_pupil_is_enough_its_position_or_its_diameter(self) -> None:
        # optiland finds the position with a ray traced backwards from the stop and the diameter with one traced
        # forwards to it. Both divide by the same quantity of the lens, the height a parallel ray has at the stop,
        # but each by its own rounding of it: with numbers that are not doubles one may come out at exactly 0 where
        # the other is left at 1e-17. (Measured at 4e893f53: radii 61.3 and -47.9 mm, 5.1 mm of index 1.5168 and a
        # plane stop at the double nearest the rear focal point give EPL() = inf and EPD() = 1.2e16 mm.) The exit
        # pupil's diameter is then a NaN, or a number without a correct digit: neither is an answer.
        case = make_case([*lens_surfaces(), surface(14.0, PLANE)], indices=[[1.5, 1.0, 1.0]], stop=2)
        optic = build_case(case).optics[0]
        self.assertIsNotNone(line_data(optic, 2).values)
        paraxial = type(optic.paraxial)
        infinite_diameter = build.optiland_api().np.array([math.inf])
        for name, given in (("EPL", -math.inf), ("EPL", math.inf), ("EPD", infinite_diameter)):
            with mock.patch.object(paraxial, name, return_value=given):
                line = line_data(optic, 2)
            self.assertEqual((line.values, line.without), (None, TELECENTRIC_OBJECT_SPACE), name)
            self.assertIn("inf mm", line.why)

    # ── How optiland is asked ────────────────────────────────────────────────────────────────────────────────────

    def test_asking_leaves_the_optic_the_case(self) -> None:
        # optiland has calls that write paraxial results back into an optic (updater.update_paraxial overwrites
        # every semi-aperture). The worker calls none: after its first-order data is read, the optic still passes
        # the verification, and describes itself in the same bytes.
        built = build_case(ALL_FEATURES)
        before = describe_optics(built.optics, [0, 0.5, 1])
        first_order_of(built.optics, ALL_FEATURES["system"]["lastLensSurfaceIndex"])
        for line, optic in enumerate(built.optics):
            verify_optic(optic, ALL_FEATURES, line)
        self.assertEqual(describe_optics(built.optics, [0, 0.5, 1]), before)
        # The field of an optic is the axis alone, and no value asked here reads a field.
        self.assertEqual(int(built.optics[0].fields.num_fields), 1)

    def test_a_value_that_is_no_number_is_the_engines_failure_and_never_an_answer(self) -> None:
        case = make_case(lens_surfaces(), indices=[[1.5, 1.0]])
        optic = build_case(case).optics[0]
        paraxial = type(optic.paraxial)
        with mock.patch.object(paraxial, "XPD", return_value=math.nan), self.assertRaises(RuntimeError) as raised:
            line_data(optic, 1)
        self.assertEqual(str(raised.exception), "optiland's first-order data has no exitPupilSemiDiameter: it is nan")
        # An infinity is a value of a pupil only: a focal point at infinity is no first-order data.
        with mock.patch.object(paraxial, "F1", return_value=math.inf), self.assertRaises(RuntimeError) as raised:
            line_data(optic, 1)
        self.assertEqual(str(raised.exception), "optiland's first-order data has no frontFocalZ: it is inf")
        two = build.optiland_api().np.array([1.0, 2.0])
        with mock.patch.object(paraxial, "EPL", return_value=two), self.assertRaises(RuntimeError) as raised:
            line_data(optic, 1)
        self.assertEqual(str(raised.exception), "optiland's paraxial.EPL() holds 2 values, not one")
        # A focal length that is no number is not the infinite one of an afocal system: it says nothing of the
        # system, and "unsupported" would say that the system has no focal length.
        with mock.patch.object(paraxial, "f2", return_value=math.nan), self.assertRaises(RuntimeError) as raised:
            line_data(optic, 1)
        self.assertEqual(str(raised.exception), "optiland's first-order data has no efl: it is nan")
        for name in ("EPL", "EPD"):
            with mock.patch.object(paraxial, name, return_value=math.nan), self.assertRaises(RuntimeError) as raised:
                line_data(optic, 1)
            self.assertIn("it is nan", str(raised.exception), name)

    def test_a_call_that_optiland_has_deprecated_is_an_error_and_not_a_warning_in_a_log(self) -> None:
        optic = build_case(make_case(lens_surfaces(), indices=[[1.5, 1.0]])).optics[0]
        original = type(optic.paraxial).f2

        def deprecated(paraxial: Any) -> Any:
            # As optiland's own decorator warns: attributed to whoever called the accessor.
            warnings.warn("paraxial.f2() is deprecated", DeprecationWarning, stacklevel=2)
            return original(paraxial)

        with (
            mock.patch.object(type(optic.paraxial), "f2", deprecated),
            self.assertRaisesRegex(DeprecationWarning, "paraxial.f2\\(\\) is deprecated"),
        ):
            line_data(optic, 1)
        # The accessors it does call warn of nothing: the whole answer under every warning as an error.
        with warnings.catch_warnings():
            warnings.simplefilter("error", DeprecationWarning)
            line_data(optic, 1)

    def test_the_engine_answers_with_the_method_and_the_counts(self) -> None:
        result = OptilandEngine(IDENTITY).run(first_order_request(ALL_FEATURES), ALL_FEATURES)
        self.assertEqual(validate_kind("result", result), [])
        self.assertEqual(result["status"], "ok")
        self.assertEqual(result["method"], {"name": "paraxial-accessors", "params": {"afocalRelativePower": 1e-12}})
        self.assertEqual(result["diagnostics"], {"warnings": [], "counts": {"surfaces": 7, "lines": 2}})
        self.assertEqual(sorted(result["data"]), sorted([*FIRST_ORDER_VALUES, "recorded"]))
        self.assertEqual(sorted(result["data"]["recorded"]), ["magnification", "optilandFNumber"])


@unittest.skipIf(MISSING is not None, MISSING)
class WorkerTest(TempDirTest):
    """``paraxial.first-order`` through the worker as a process, on the real optiland."""

    def test_the_worker_answers_the_contracts_cases_and_two_answers_are_the_same_bytes(self) -> None:
        names = ("NUMBA_CACHE_DIR", "MPLCONFIGDIR", "PYTHONPYCACHEPREFIX")
        environment = {name: os.environ[name] for name in names}
        cases = [
            read_fixture("valid", "optical-case", f"{name}.json")
            for name in ("singlet", "double-gauss", "all-features")
        ]
        telecentric = make_case(
            [surface(0.0, PLANE), surface(100.0, sphere(50)), surface(103.0, PLANE)], indices=[[1.0, 1.5, 1.0]], stop=0
        )
        asked = [*cases, telecentric, cases[0]]
        lines = HELLO + b"".join(first_order_line(case) for case in asked) + SHUTDOWN
        ended = self.worker(None, lines, env=environment)
        self.assertEqual(ended.returncode, 0, ended.stderr)
        hello, *answers, far, again, bye = [parse_json(line) for line in ended.stdout.splitlines()]
        self.assertEqual(hello["result"]["capabilities"]["quantities"], QUANTITIES)
        schemas = contract_schemas()
        for case, answer in zip(cases, answers, strict=True):
            self.assertIs(answer["ok"], True, answer)
            result = answer["result"]
            self.assertEqual(validate_kind("result", result), [])
            self.assertEqual((result["status"], result["caseId"]), ("ok", case["id"]))
            self.assertEqual(validate(schemas, quantity_schema_id(PARAXIAL_FIRST_ORDER, "data"), result["data"]), [])
            for line in range(len(case["conditions"]["lines"])):
                expected = exact(case, line)
                for name in FIRST_ORDER_VALUES:
                    got = f8(result["data"][name])[line]
                    self.assertAlmostEqual(got, float(expected[name]), delta=TOLERANCE_MM, msg=name)
        # The Double-Gauss case is optiland's own sample lens: 100.0037 mm, at f/5 by its stop.
        double_gauss = answers[1]["result"]["data"]
        self.assertAlmostEqual(f8(double_gauss["efl"])[0], 100.00372050801042, delta=1e-12)
        self.assertAlmostEqual(f8(double_gauss["recorded"]["optilandFNumber"])[0], 5.0, delta=1e-12)
        # An infinity travels in the array, bit for bit: the numbers of JSON have none.
        self.assertEqual(far["result"]["status"], "ok", far)
        self.assertEqual(f8(far["result"]["data"]["exitPupilZ"]), [-math.inf])
        self.assertEqual(f8(far["result"]["data"]["exitPupilSemiDiameter"]), [math.inf])
        self.assertEqual(again["result"], answers[0]["result"], "the engine is deterministic")
        self.assertEqual(bye["result"], {})
        # Nothing optiland or numpy said while it divided by zero reached the replies: seven lines, all JSON.
        self.assertEqual(ended.stdout.count(b"\n"), 7)
        self.assertNotIn(b"RuntimeWarning", ended.stderr)


if __name__ == "__main__":
    unittest.main()

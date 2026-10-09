"""``mtf.native`` by the method "geometric": what the worker asks of optiland's ``GeometricMTF``, and what it makes
of the answer.

The first half needs no optiland: the request is read, landings are summed, lines are added and a field gets its
status, on steps a test writes down (``made``), whose values are binary fractions so that every expected number is
exact, and on closed forms of sums of unit vectors. The second half is the real optiland and is skipped, with the
reason, under an interpreter that has none. Its expectations are derived here: a lens that images the axis without
aberration, out of focus, whose landings are a closed form; chief rays and rim rays by the 60-digit trace of
``exact.py``; and never read from an engine's output.
"""

from __future__ import annotations

import cmath
import copy
import json
import math
import types
import unittest
from collections.abc import Sequence
from decimal import Decimal
from typing import Any

from lvrtc_optiland import geometric, mtf
from lvrtc_optiland.build import BuildMismatch
from lvrtc_optiland.engine import QUANTITIES, OptilandEngine
from lvrtc_optiland.geometric import (
    MODULUS_ROUNDING,
    NUM_POINTS,
    SpotStep,
    class_curves,
    curves_of,
    landing_sums,
    sum_curves,
    top_frequency,
)
from lvrtc_optiland.mtf import CONVERGENCE_OFF_AXIS, CONVERGENCE_ON_AXIS, MtfRequest, answer_mtf, read_request
from lvrtc_worker_kit.ndarray import encode_ndarray
from lvrtc_worker_kit.validate import contract_schemas, format_issues, quantity_schema_id, validate, validate_kind

from . import test_mtf as fft
from .exact import exact_trace
from .support import PLANE, f8, make_case, mtf_request, mtf_spec, real_optiland_missing, sphere, surface

MISSING = real_optiland_missing()
DOUBLE_GAUSS = fft.DOUBLE_GAUSS


def geometric_spec(angles: list[float], frequencies: list[float] | None = None, **more: Any) -> dict[str, Any]:
    """An ``mtf.native`` spec of the geometric method, of fields given as angles, on the plane of the case."""
    return mtf_spec(angles, frequencies, method="geometric", **more)


# ── Without optiland ─────────────────────────────────────────────────────────────────────────────────────────────

FREQUENCIES_ASKED = (0.0, 10.0, 10.125, 31.5)
ASKED = MtfRequest(FREQUENCIES_ASKED, (0.0,), 0, (128, 256), "geometric", (0,))
TWO_LINES = MtfRequest(FREQUENCIES_ASKED, (0.0,), 0, (128, 256), "geometric", (0, 1))
STRAIGHT = [1.0, 0.84375, 0.841796875, 0.5078125]
"""1 - nu / 64 at the frequencies of ``ASKED``: 10.125 lies between two samples of the axis of ``made``."""


def made(rays: int, *, lowered: float = 0.0, off: float = 0.0, lit: int = 8, flux: float | None = None) -> SpotStep:
    """A step of ``ASKED`` whose curves of optiland fall in a straight line, 1 - nu / 64, on an axis of 127 samples
    a quarter cycle apart, and whose landings add up to the same line times the flux.

    ``lowered`` is taken off every value but the first, of the curves and of the sums; ``off`` of the sums alone,
    which is then how far optiland's curve lies from the sum of its landings. Every number is a binary fraction.
    """
    axis = tuple(0.25 * at for at in range(127))
    assert axis[-1] == top_frequency(FREQUENCIES_ASKED)

    def value(frequency: float, down: float) -> float:
        return 1.0 if frequency == 0.0 else max(0.0, 1.0 - frequency / 64.0 - down)

    curve = tuple(value(frequency, lowered) for frequency in axis)
    weight = float(lit) if flux is None else flux
    sums = tuple(complex(weight * value(frequency, lowered + off), 0.0) for frequency in FREQUENCIES_ASKED)
    return SpotStep(rays, len(axis), axis, curve, curve, 16, lit, weight, (0.25, 0.5), sums, sums)


class Spots(fft.StandIn):
    """Stands where optiland would for the geometric method: the spots, by line, angle and rays, a test wrote down."""

    def __init__(self, spots: dict[tuple[int, float, int], Any], probes: dict[float, Any] | None = None) -> None:
        super().__init__({}, probes)
        self.spots = spots

    def spot(
        self, case: dict[str, Any], line: int, angle_deg: float, num_rays: int, frequencies: Sequence[float]
    ) -> SpotStep:
        self.asked.append(("spot", line, angle_deg, num_rays))
        assert tuple(frequencies) == FREQUENCIES_ASKED
        outcome = self.spots[(line, angle_deg, num_rays)]
        if isinstance(outcome, BaseException):
            raise outcome
        return outcome


def settled(*angles: float, lines: tuple[int, ...] = (0,)) -> dict[tuple[int, float, int], Any]:
    """Steps that agree, of every line: the straight line at 128 rays and at 256."""
    return {(line, angle, rays): made(rays) for line in lines for angle in angles for rays in (128, 256)}


class ReadRequestTest(unittest.TestCase):
    def test_a_geometric_spec_is_read_with_the_ladder_of_128_and_256_and_the_lines_of_the_case(self) -> None:
        asked = read_request(geometric_spec([0, 10.5], [0, 12.5, 40]), {}, DOUBLE_GAUSS)
        self.assertEqual(asked, MtfRequest((0.0, 12.5, 40.0), (0.0, 10.5), 0, (128, 256), "geometric", (0,)))
        # The FFT's request is what it was: no method stated in it, and no lines.
        plain = read_request(mtf_spec([0]), {}, DOUBLE_GAUSS)
        self.assertEqual(plain, MtfRequest((10.0, 30.0, 50.0), (0.0,), 0, (128, 256)))
        self.assertEqual((plain.method, plain.lines), ("diffraction", ()))

    def test_each_method_has_an_option_for_its_finer_step_and_reads_no_other(self) -> None:
        self.assertEqual(read_request(geometric_spec([0]), {"geometricRays": 512}, DOUBLE_GAUSS).ladder, (256, 512))
        self.assertEqual(read_request(geometric_spec([0]), {"geometricRays": 256}, DOUBLE_GAUSS).ladder, (128, 256))
        for value in (128, 1024, 300, "512", 512.0, True, None, [512]):
            refused = read_request(geometric_spec([0]), {"geometricRays": value}, DOUBLE_GAUSS)
            self.assertEqual(
                [(item["code"], item["item"]) for item in refused], [("option", "option.geometricRays")], value
            )
            self.assertIn("the option geometricRays is 256 or 512", refused[0]["message"])
        # The other method's option is not this method's to read, whatever it holds.
        self.assertEqual(read_request(geometric_spec([0]), {"fftRays": 64}, DOUBLE_GAUSS).ladder, (128, 256))
        self.assertEqual(read_request(geometric_spec([0]), {"fftRays": 512}, DOUBLE_GAUSS).ladder, (128, 256))
        self.assertEqual(read_request(mtf_spec([0]), {"geometricRays": 64}, DOUBLE_GAUSS).ladder, (128, 256))
        self.assertEqual(read_request(mtf_spec([0]), {"geometricRays": 512}, DOUBLE_GAUSS).ladder, (128, 256))

    def test_a_case_of_several_lines_is_answered_whole_or_one_line_at_a_time(self) -> None:
        case = fft.two_lines(DOUBLE_GAUSS, 486.1327, 0.5)
        whole = read_request(geometric_spec([0]), {}, case)
        self.assertEqual((whole.line, whole.lines), (0, (0, 1)))
        second = read_request(geometric_spec([0]), {"line": 1}, case)
        self.assertEqual((second.line, second.lines), (1, (1,)))
        for value in (2, -1, True, 1.0, "1"):
            wrong = read_request(geometric_spec([0]), {"line": value}, case)
            self.assertEqual([(item["code"], item["item"]) for item in wrong], [("option", "option.line")], value)
        # The FFT has no MTF of several lines, as before.
        refused = read_request(mtf_spec([0]), {}, case)
        self.assertEqual([item["item"] for item in refused], ["lines.polychromatic"])

    def test_what_neither_method_answers_is_refused_item_by_item(self) -> None:
        spec = geometric_spec([0], focus="engine-best", profile="lv-tab-default")
        spec["fields"] = {"kind": "image-height-fractions", "values": [0, 1]}
        finite = make_case([surface(0, sphere(50)), surface(4, PLANE)], object_z=-200.0)
        refused = read_request(spec, {"geometricRays": 64}, finite)
        self.assertEqual(
            [(item["code"], item["item"]) for item in refused],
            [
                ("option", "profile"),
                ("option", "focus.engine-best"),
                ("option", "fields.image-height-fractions"),
                ("option", "option.geometricRays"),
                ("feature", "object.finite"),
            ],
        )


class LandingSumsTest(unittest.TestCase):
    """The sum of ``w exp(-2 pi i nu u)`` over landings, held to closed forms."""

    def test_at_no_frequency_the_sum_is_the_sum_of_the_weights_to_the_bit(self) -> None:
        # 0.1 + 0.2 + 0.3 is 0.6000000000000001 added in turn and 0.6 added without a rounding of its own.
        (total,) = landing_sums([17.5, -3.0, 1e-3], [0.1, 0.2, 0.3], [0.0])
        self.assertEqual((total.real, total.imag), (0.6, 0.0))

    def test_a_ray_a_quarter_period_from_the_origin_turns_the_sum_by_a_quarter_backwards(self) -> None:
        # exp(-2 pi i nu u) at nu u = 1/4 is -i: the sign of the comparator's convention.
        (total,) = landing_sums([0.25 / 32.0], [2.0], [32.0])
        self.assertAlmostEqual(total.real, 0.0, delta=1e-15)
        self.assertAlmostEqual(total.imag, -2.0, delta=1e-15)

    def test_a_row_of_evenly_spaced_landings_adds_up_to_the_closed_form_of_its_geometric_series(self) -> None:
        # N landings a + k d: the sum is exp(-2 pi i nu (a + (N - 1) d / 2)) sin(pi nu N d) / sin(pi nu d).
        first, apart, count = 17.5, 1.0 / 1024.0, 257
        landings = [first + at * apart for at in range(count)]
        for frequency in (12.5, 50.0, 300.0):
            (total,) = landing_sums(landings, [1.0] * count, [frequency])
            middle = first + (count - 1) * apart / 2.0
            size = math.sin(math.pi * frequency * count * apart) / math.sin(math.pi * frequency * apart)
            expected = cmath.exp(-2j * math.pi * frequency * middle) * size
            self.assertAlmostEqual(abs(total - expected), 0.0, delta=1e-10)
            # Moved as a whole, a spot has the same modulus: only the phase of its sum knows where it lies.
            (moved,) = landing_sums([at + 3.141 for at in landings], [1.0] * count, [frequency])
            self.assertAlmostEqual(abs(moved), abs(size), delta=1e-10)
            self.assertGreater(abs(moved - total), 0.1)

    def test_two_landings_of_unequal_weight_interfere_by_the_cosine_of_their_distance(self) -> None:
        heavy, light, apart = 3.0, 0.5, 0.0125
        for frequency in (10.0, 30.0, 40.0):
            (total,) = landing_sums([4.0, 4.0 + apart], [heavy, light], [frequency])
            turn = math.cos(2.0 * math.pi * frequency * apart)
            self.assertAlmostEqual(abs(total), math.sqrt(heavy**2 + light**2 + 2 * heavy * light * turn), delta=1e-12)
        # Half a period apart, at 40 cycles/mm, they are opposed.
        self.assertAlmostEqual(abs(total), heavy - light, delta=1e-12)

    def test_the_largest_frequency_asked_is_the_end_of_optilands_axis_and_one_cycle_stands_for_none(self) -> None:
        self.assertEqual(
            (top_frequency([0.0, 10.0, 50.0]), top_frequency([0.0]), top_frequency([12.5])), (50.0, 1.0, 12.5)
        )


def one(sums: complex, lit: int, flux: float | None = None) -> SpotStep:
    """A step of one frequency whose landings add up to ``sums`` in both cuts; it has no curve of optiland's."""
    weight = float(lit) if flux is None else flux
    return SpotStep(
        128, 2, (0.0, 1.0), (1.0, math.nan), (1.0, math.nan), lit, lit, weight, (0.0, 0.0), (sums,), (sums,)
    )


class SumCurvesTest(unittest.TestCase):
    """The MTF of several lines: their sums added as complex numbers, with their weights, over their flux."""

    def test_the_lines_add_as_complex_numbers_before_the_modulus_and_a_mean_of_moduli_is_another_number(self) -> None:
        # Two lines of modulus 5/8 each, whose sums lean opposite ways: 1 (3 + 4i) + 0.5 (-6 + 8i) = 8i over a
        # flux of 1 * 8 + 0.5 * 16.
        red, blue = one(complex(3.0, 4.0), 8), one(complex(-6.0, 8.0), 16)
        self.assertEqual(sum_curves([red, blue], [1.0, 0.5], 1), ([0.5], [0.5]))
        self.assertEqual(sum_curves([red], [1.0], 1), ([0.625], [0.625]))
        self.assertEqual(sum_curves([blue], [0.5], 1), ([0.625], [0.625]))

    def test_two_lines_that_land_apart_by_lateral_colour_interfere_and_the_fainter_counts_for_less(self) -> None:
        # Every ray of a line at one point, the second line 12.5 micrometres beside the first: the closed form of
        # two unit vectors with the flux each line carries, 8 rays of weight 1 and 2 rays of weight 0.5.
        apart, frequencies = 0.0125, (10.0, 30.0, 40.0)
        steps = []
        for landing, count in ((7.0, 8), (7.0 + apart, 2)):
            sums = landing_sums([landing] * count, [1.0] * count, frequencies)
            steps.append(
                SpotStep(128, 2, (0.0, 1.0), (1.0, 1.0), (1.0, 1.0), count, count, float(count), (0.0, 0.0), sums, sums)
            )
        got = sum_curves(steps, [1.0, 0.5], len(frequencies))
        assert not isinstance(got, str)
        for value, frequency in zip(got[0], frequencies, strict=True):
            turn = math.cos(2.0 * math.pi * frequency * apart)
            self.assertAlmostEqual(value, math.sqrt(8.0**2 + 1.0**2 + 2 * 8.0 * 1.0 * turn) / 9.0, delta=1e-12)
        # Opposed at 40 cycles/mm: (8 - 1) / 9, where each line alone is 1.
        self.assertAlmostEqual(got[0][2], 7.0 / 9.0, delta=1e-12)
        self.assertEqual(sum_curves(steps[:1], [1.0], 3)[0][2], 1.0)

    def test_a_line_without_rays_or_a_spectrum_without_flux_or_a_sum_that_is_no_modulus_is_a_reason(self) -> None:
        lit = one(complex(3.0, 4.0), 8)
        self.assertEqual(sum_curves([lit, one(0j, 0)], [1.0, 1.0], 1), "no-rays")
        self.assertEqual(sum_curves([lit], [0.0], 1), "no-flux")
        self.assertEqual(sum_curves([one(complex(3.0, 4.0), 8, flux=math.nan)], [1.0], 1), "no-flux")
        self.assertEqual(sum_curves([one(complex(math.nan, 0.0), 8)], [1.0], 1), "mtf-not-a-modulus")
        self.assertEqual(sum_curves([one(complex(8.5, 0.0), 8)], [1.0], 1), "mtf-not-a-modulus")

    def test_a_modulus_that_a_rounding_left_above_1_is_1_in_the_sum_and_in_optilands_curve(self) -> None:
        above = 1.0000000000000002
        self.assertTrue(1.0 < above <= 1.0 + MODULUS_ROUNDING)
        self.assertEqual(sum_curves([one(complex(8.0 * above, 0.0), 8)], [1.0], 1), ([1.0], [1.0]))
        step = SpotStep(128, 2, (0.0, 1.0), (1.0, above), (1.0, 1.001), 8, 8, 8.0, (0.0, 0.0), (8 + 0j,), (8 + 0j,))
        self.assertEqual(class_curves(step, [0.0]), ([1.0], [1.0]))
        self.assertEqual(class_curves(step, [1.0]), "mtf-not-a-modulus", "one part in a thousand is no rounding")
        fine = SpotStep(128, 2, (0.0, 1.0), (1.0, above), (1.0, above), 8, 8, 8.0, (0.0, 0.0), (8 + 0j,), (8 + 0j,))
        self.assertEqual(class_curves(fine, [1.0]), ([1.0], [1.0]))


class CurvesOfTest(unittest.TestCase):
    """Of one line the curves are optiland's, where its bins allow; of several they are the sum's."""

    def test_of_one_line_the_curves_are_optilands_and_the_sum_says_how_far_its_bins_moved_them(self) -> None:
        self.assertEqual(curves_of([made(256)], [1.0], FREQUENCIES_ASKED, 0.01), ((STRAIGHT, STRAIGHT), 0.0))
        # optiland's curve lies 1/128 above the sum of its own landings: inside a band of 0.01, outside one of 0.005.
        binned = made(256, off=0.0078125)
        self.assertEqual(curves_of([binned], [1.0], FREQUENCIES_ASKED, 0.01), ((STRAIGHT, STRAIGHT), 0.0078125))
        self.assertEqual(curves_of([binned], [1.0], FREQUENCIES_ASKED, 0.005), ("frequency-beyond-bins", 0.0078125))
        # The weight of the one line is no part of its curve.
        self.assertEqual(curves_of([binned], [0.5], FREQUENCIES_ASKED, 0.01), ((STRAIGHT, STRAIGHT), 0.0078125))

    def test_of_several_lines_the_curves_are_the_sums_and_the_bins_of_optilands_curves_gate_nothing(self) -> None:
        lowered = [1.0, *(value - 0.0078125 for value in STRAIGHT[1:])]
        steps = [made(256, off=0.0078125), made(256, off=0.0078125, lit=4)]
        self.assertEqual(curves_of(steps, [1.0, 0.5], FREQUENCIES_ASKED, 0.005), ((lowered, lowered), 0.0078125))
        # The distance stated is the largest of the lines', each line's curve beside that line's own sum.
        steps = [made(256), made(256, off=0.015625)]
        self.assertEqual(curves_of(steps, [1.0, 1.0], FREQUENCIES_ASKED, 0.005)[1], 0.015625)

    def test_a_curve_of_optiland_that_is_none_is_the_reason_of_one_line_and_leaves_several_their_sum(self) -> None:
        empty = made(256, lit=0)
        self.assertEqual(curves_of([empty], [1.0], FREQUENCIES_ASKED, 0.01), ("no-rays", None))
        broken = SpotStep(**{**vars(made(256)), "tangential": (1.0, *([math.nan] * 126))})
        self.assertEqual(curves_of([broken], [1.0], FREQUENCIES_ASKED, 0.01), ("mtf-not-a-modulus", None))
        self.assertEqual(
            curves_of([made(256), broken], [1.0, 1.0], FREQUENCIES_ASKED, 0.01), ((STRAIGHT, STRAIGHT), None)
        )
        short = SpotStep(**{**vars(made(256)), "axis": tuple(0.125 * at for at in range(127))})
        self.assertEqual(curves_of([short], [1.0], FREQUENCIES_ASKED, 0.01), ("frequency-beyond-axis", None))


class FieldAnswerTest(unittest.TestCase):
    def entry(self, measure: Spots, angle: float = 0.0, asked: MtfRequest = ASKED) -> tuple[dict[str, Any], list[str]]:
        return geometric.answer_field(asked, DOUBLE_GAUSS, angle, measure)

    def test_a_field_whose_two_steps_agree_is_ok_with_optilands_curves_and_what_was_sampled(self) -> None:
        measure = Spots(settled(0.0))
        field, notes = self.entry(measure)
        self.assertEqual(measure.asked, [("field", 0, 0.0), ("spot", 0, 0.0, 128), ("spot", 0, 0.0, 256)])
        self.assertEqual((field["status"], notes), ("ok", []))
        self.assertNotIn("reason", field)
        self.assertEqual((field["field"], field["fieldAngleDeg"], field["imageHeightMm"]), (0.0, 0.0, 0.0))
        self.assertEqual((f8(field["tangential"]), f8(field["sagittal"])), (STRAIGHT, STRAIGHT))
        self.assertEqual(
            field["sampling"],
            {
                "numRays": 256.0,
                "coarseNumRays": 128.0,
                "numPoints": 127.0,
                "raysLaunched": 16.0,
                "raysLit": 8.0,
                # 128 bins across a spot a quarter of a millimetre wide along x and half a millimetre along y.
                "binWidthSagittalMm": 0.001953125,
                "binWidthTangentialMm": 0.00390625,
                "optilandWarnings": 0.0,
                "binningMaxDelta": 0.0,
                "maxDelta": 0.0,
            },
        )

    def test_a_field_that_moved_by_more_than_its_band_is_unconverged_and_keeps_its_curves(self) -> None:
        moved = 0.0078125
        self.assertTrue(CONVERGENCE_ON_AXIS < moved < CONVERGENCE_OFF_AXIS)
        for angle, status in ((0.0, "unconverged"), (7.0, "ok")):
            field, notes = self.entry(
                Spots({(0, angle, 128): made(128), (0, angle, 256): made(256, lowered=moved)}), angle
            )
            self.assertEqual(
                (field["status"], field.get("reason")), (status, "not-converged" if angle == 0.0 else None)
            )
            self.assertEqual(field["sampling"]["maxDelta"], moved)
            self.assertEqual(f8(field["tangential"]), [1.0, *(value - moved for value in STRAIGHT[1:])])
            if angle == 0.0:
                expected = (
                    "the field at 0.0 degrees: the tangential MTF at 10.0 cycles/mm is 0.84375 at 128 rays and "
                    "0.8359375 at 256, further apart than 0.005"
                )
                self.assertEqual(notes, [expected])

    def test_a_field_whose_bins_are_too_wide_for_a_frequency_has_no_curves_and_says_how_far_off_they_were(self) -> None:
        # optiland's curve 1/128 from the sum of its own landings: beyond the band on the axis, within it off it.
        off = 0.0078125
        for angle, status in ((0.0, "unavailable"), (7.0, "ok")):
            steps = {(0, angle, rays): made(rays, off=off) for rays in (128, 256)}
            field, notes = self.entry(Spots(steps), angle)
            self.assertEqual((field["status"], field["sampling"]["binningMaxDelta"]), (status, off), angle)
        self.assertEqual(f8(field["tangential"]), STRAIGHT, "off the axis the curves are optiland's, not the sum's")
        field, notes = self.entry(Spots({(0, 0.0, rays): made(rays, off=off) for rays in (128, 256)}))
        self.assertEqual(field["reason"], "frequency-beyond-bins")
        self.assertTrue(all(math.isnan(value) for value in f8(field["tangential"]) + f8(field["sagittal"])))
        self.assertEqual(notes, ["the field at 0.0 degrees: frequency-beyond-bins at 256 rays"])
        self.assertNotIn("maxDelta", field["sampling"])
        # The coarser step alone beyond its bins: the finer has curves, and nothing says that it settled.
        field, notes = self.entry(Spots({(0, 0.0, 128): made(128, off=off), (0, 0.0, 256): made(256)}))
        self.assertEqual((field["status"], field["reason"]), ("unconverged", "convergence-unknown"))
        self.assertEqual((f8(field["tangential"]), field["sampling"]["binningMaxDelta"]), (STRAIGHT, 0.0))
        self.assertIn("frequency-beyond-bins at 128 rays", notes[0])

    def test_several_lines_are_each_asked_at_each_step_and_their_sum_is_the_curve(self) -> None:
        # The second line is half as bright and weighs half; both lie 1/128 below optiland's own curve of them.
        off = 0.0078125
        steps = {(line, 0.0, rays): made(rays, off=off, lit=8 >> line) for line in (0, 1) for rays in (128, 256)}
        measure = Spots(steps)
        case = fft.two_lines(DOUBLE_GAUSS, 486.1327, 0.5)
        field, notes = geometric.answer_field(TWO_LINES, case, 0.0, measure)
        self.assertEqual(
            measure.asked,
            [
                ("field", 0, 0.0),
                ("spot", 0, 0.0, 128),
                ("spot", 1, 0.0, 128),
                ("spot", 0, 0.0, 256),
                ("spot", 1, 0.0, 256),
            ],
        )
        self.assertEqual((field["status"], notes), ("ok", []))
        self.assertEqual(f8(field["tangential"]), [1.0, *(value - off for value in STRAIGHT[1:])])
        self.assertEqual((field["sampling"]["binningMaxDelta"], field["sampling"]["raysLit"]), (off, 8.0))

    def test_an_exception_of_optiland_is_the_fields_status_and_ends_its_ladder(self) -> None:
        said = ValueError("autodetected range of [nan, nan]\n is not finite")
        measure = Spots({(0, 9.0, 128): said, (0, 9.0, 256): AssertionError("the finer step is not asked")})
        field, notes = self.entry(measure, 9.0)
        self.assertEqual(measure.asked, [("field", 0, 9.0), ("spot", 0, 9.0, 128)])
        self.assertEqual((field["status"], field["reason"]), ("unavailable", "optiland-raised-ValueError"))
        self.assertTrue(all(math.isnan(value) for value in f8(field["tangential"]) + f8(field["sagittal"])))
        self.assertEqual((field["fieldAngleDeg"], field["imageHeightMm"], field["sampling"]), (9.0, 18.0, {}))
        expected = (
            "the field at 9.0 degrees: at 128 rays optiland raised ValueError: autodetected range of [nan, nan] is "
            "not finite"
        )
        self.assertEqual(notes, [expected])
        lost = Spots({}, probes={30.0: RuntimeError("no chief ray")})
        field, notes = self.entry(lost, 30.0)
        self.assertEqual((field["fieldAngleDeg"], field["imageHeightMm"], field["sampling"]), (None, None, {}))
        self.assertIn("at its chief ray optiland raised RuntimeError", notes[0])
        for error in (BuildMismatch("the geometric MTF: scale is True"), MemoryError()):
            with self.assertRaises(type(error)):
                self.entry(Spots({(0, 0.0, 128): error}))

    def test_a_field_none_of_whose_rays_arrives_has_no_curves_and_no_bins(self) -> None:
        dark = SpotStep(**{**vars(made(256, lit=0)), "tangential": (math.nan,) * 127, "sagittal": (math.nan,) * 127})
        field, notes = self.entry(Spots({(0, 25.0, 128): dark, (0, 25.0, 256): dark}), 25.0)
        self.assertEqual((field["status"], field["reason"]), ("unavailable", "no-rays"))
        self.assertEqual(notes, ["the field at 25.0 degrees: no-rays at 256 rays"])
        self.assertEqual((field["sampling"]["raysLaunched"], field["sampling"]["raysLit"]), (16.0, 0.0))
        self.assertNotIn("binWidthTangentialMm", field["sampling"])
        self.assertNotIn("binningMaxDelta", field["sampling"])


class AnswerTest(unittest.TestCase):
    PARAMS: dict[str, Any] = {
        "class": "GeometricMTF",
        "numRays": [128, 256],
        "distribution": "uniform",
        "numPoints": 2048,
        "bins": 2049,
        "maxFrequency": "largest-asked",
        "scale": False,
        "spotCoordinates": "local",
        "spotReference": "none",
        "lines": [1],
        "curves": "optiland",
        "transform": "sum-over-bin-centres",
        "rayWeight": "one-a-lit-ray",
        "polychromatic": "one-line",
        "sumReference": "image-plane-axis-point",
        "modulusRounding": 1e-12,
        "aiming": "robust",
        "aimingMaxIterations": 50,
        "aimingTolerance": 1e-10,
        "pupil": "stop-surface-grid",
        "fieldType": "angle",
        "frame": "mirrored-in-y",
        "frequencyAxis": "linspace-to-largest-asked",
        "interpolation": "linear",
        "convergenceOnAxis": 0.005,
        "convergenceOffAxis": 0.01,
    }

    def test_one_line_is_optilands_own_curve_and_the_answer_says_which_line_and_how_it_was_asked(self) -> None:
        case = fft.two_lines(DOUBLE_GAUSS, 486.1327, 0.5)
        measure = Spots(settled(0.0, lines=(1,)))
        data, _ = answer_mtf(MtfRequest(FREQUENCIES_ASKED, (0.0,), 1, (128, 256), "geometric", (1,)), case, measure)
        self.assertEqual(measure.asked[:2], [("aperture", 1), ("field", 1, 0.0)])
        self.assertEqual(data["lines"], [{"wavelengthNm": 486.1327, "weight": 0.5}])
        self.assertEqual(data["focus"], {"mode": "design", "appliedShiftMm": 0})
        self.assertEqual(data["aperture"], {"tracedFNumber": 4.0, "limitingSurfaceIndex": 1.0})
        self.assertEqual(data["notes"], ["of line 1 of the case alone, 486.1327 nm"])
        self.assertEqual(data["method"], {"name": "geometric-mtf", "params": self.PARAMS})
        self.assertEqual(validate(contract_schemas(), quantity_schema_id("mtf.native", "data"), data), [])
        alone, _ = answer_mtf(ASKED, DOUBLE_GAUSS, Spots(settled(0.0)))
        self.assertEqual((alone["notes"], alone["method"]["params"]["lines"]), ([], [0]))

    def test_several_lines_are_the_workers_sum_of_optilands_landings_and_the_answer_says_so(self) -> None:
        case = fft.two_lines(DOUBLE_GAUSS, 486.1327, 0.5)
        data, _ = answer_mtf(TWO_LINES, case, Spots(settled(0.0, lines=(0, 1))))
        self.assertEqual(
            data["lines"], [{"wavelengthNm": 587.5618, "weight": 1}, {"wavelengthNm": 486.1327, "weight": 0.5}]
        )
        self.assertEqual(data["method"]["name"], "spot-landings-sum")
        changed = {
            "lines": [0, 1],
            "curves": "worker-sum-of-optiland-landings",
            "transform": "sum-over-landings",
            "rayWeight": "intensity",
            "polychromatic": "complex-sum-of-lines",
        }
        self.assertEqual(data["method"]["params"], {**self.PARAMS, **changed})
        self.assertEqual(
            data["notes"],
            [
                "of the 2 lines of the case, summed by the worker as complex numbers with their weights: the rays and "
                "their landings are optiland's GeometricMTF's, a line a call, and the sum has no bins"
            ],
        )
        self.assertEqual(validate(contract_schemas(), quantity_schema_id("mtf.native", "data"), data), [])

    def test_a_field_that_fails_changes_nothing_of_the_fields_beside_it(self) -> None:
        steps = {**settled(0.0, 10.0), (0, 40.0, 128): ValueError("no rays")}
        three = MtfRequest(FREQUENCIES_ASKED, (0.0, 40.0, 10.0), 0, (128, 256), "geometric", (0,))
        data, seconds = answer_mtf(three, DOUBLE_GAUSS, Spots(steps))
        self.assertEqual([field["status"] for field in data["fields"]], ["ok", "unavailable", "ok"])
        two = MtfRequest(FREQUENCIES_ASKED, (0.0, 10.0), 0, (128, 256), "geometric", (0,))
        alone, _ = answer_mtf(two, DOUBLE_GAUSS, Spots(settled(0.0, 10.0)))
        self.assertEqual(([data["fields"][0], data["fields"][2]], len(seconds)), (alone["fields"], 3))


class EngineTest(unittest.TestCase):
    """The engine's ``run`` of a geometric MTF, with a stand-in where optiland would be asked."""

    SPEC = geometric_spec([0], list(FREQUENCIES_ASKED))

    def test_the_quantity_is_the_one_it_was_and_an_answer_counts_its_lines(self) -> None:
        self.assertEqual(QUANTITIES["mtf.native"], {"version": 1})
        case = fft.two_lines(DOUBLE_GAUSS, 486.1327, 0.5)
        measure, log = Spots(settled(0.0, lines=(0, 1))), []
        result = OptilandEngine(fft.IDENTITY, mtf=measure, log=log.append).run(mtf_request(case, self.SPEC), case)
        self.assertEqual(validate_kind("result", result), [])
        self.assertEqual((result["status"], result["method"]), ("ok", result["data"]["method"]))
        counts = {"surfaces": 11, "lines": 2, "fields": 1, "ok": 1, "unconverged": 0, "unavailable": 0}
        self.assertEqual(result["diagnostics"], {"warnings": [], "counts": counts})
        self.assertRegex(log[0], r"^lvrtc_optiland: mtf\.native fields=1 ok=1 .* rays=128,256 field_ms=\d+ ")
        self.assertNotIn("_ms", repr(result))

    def test_an_option_reaches_the_ladder_and_the_line_and_a_value_it_does_not_have_is_refused(self) -> None:
        case = fft.two_lines(DOUBLE_GAUSS, 486.1327, 0.5)
        measure = Spots({(1, 0.0, rays): made(rays) for rays in (256, 512)})
        engine = OptilandEngine(fft.IDENTITY, mtf=measure)
        result = engine.run(mtf_request(case, self.SPEC, geometricRays=512, line=1, fftRays=64), case)
        self.assertEqual(result["status"], "ok", result.get("error"))
        self.assertEqual(measure.asked[-2:], [("spot", 1, 0.0, 256), ("spot", 1, 0.0, 512)])
        self.assertEqual(
            (result["data"]["method"]["params"]["numRays"], result["diagnostics"]["counts"]["lines"]), ([256, 512], 1)
        )
        asked = len(measure.asked)
        refused = engine.run(mtf_request(case, self.SPEC, geometricRays=1024), case)
        self.assertEqual(validate_kind("result", refused), [])
        self.assertEqual(refused["status"], "unsupported")
        self.assertEqual([item["item"] for item in refused["unsupported"]], ["option.geometricRays"])
        self.assertEqual(len(measure.asked), asked, "nothing is asked of optiland for a request that is refused")


class DiffractionAsBeforeTest(unittest.TestCase):
    """The method "diffraction" answers as it did before the engine had another: the whole answer, key by key."""

    def test_the_answer_of_the_fft_is_this_text_to_the_byte(self) -> None:
        asked = MtfRequest(fft.ASKED.frequencies, (0.0, 7.0), 0, (128, 256))
        measure = fft.StandIn(fft.settled(0.0, 7.0))
        data, _ = answer_mtf(asked, DOUBLE_GAUSS, measure)
        self.assertEqual(
            measure.asked,
            [
                ("aperture", 0),
                ("field", 0, 0.0),
                ("step", 0, 0.0, 128),
                ("step", 0, 0.0, 256),
                ("field", 0, 7.0),
                ("step", 0, 7.0, 128),
                ("step", 0, 7.0, 256),
            ],
        )
        curve = encode_ndarray("f8", fft.STRAIGHT_AT_ASKED, [4])
        sampling = {
            "rimRaysLit": 4.0,
            "rimRaysLost": 0.0,
            "rimLandingSpreadMm": 0.015625,
            "numRays": 256.0,
            "gridSize": 512.0,
            "coarseNumRays": 128.0,
            "workingFNumber": 4.0,
            "optilandWarnings": 0.0,
            "frequencyStepTangentialPerMm": 0.25,
            "frequencyStepSagittalPerMm": 0.25,
            "maxDelta": 0.0,
        }
        expected = {
            "fields": [
                {
                    "field": angle,
                    "fieldAngleDeg": angle,
                    "imageHeightMm": 2.0 * angle,
                    "sagittal": curve,
                    "tangential": curve,
                    "status": "ok",
                    "sampling": sampling,
                }
                for angle in (0.0, 7.0)
            ],
            "method": {
                "name": "scalar-fft-mtf",
                "params": {
                    "class": "ScalarFFTMTF",
                    "numRays": [128, 256],
                    "gridFactor": 2,
                    "line": 0,
                    "referenceSphere": "chief_ray",
                    "removeTilt": False,
                    "aiming": "robust",
                    "aimingMaxIterations": 50,
                    "aimingTolerance": 1e-10,
                    "pupil": "stop-surface-grid",
                    "fieldType": "angle",
                    "frame": "mirrored-in-y",
                    "frequencyAxes": "freq_tang-and-freq_sag",
                    "interpolation": "linear",
                    "polychromatic": "one-line",
                    "convergenceOnAxis": 0.005,
                    "convergenceOffAxis": 0.01,
                },
            },
            "focus": {"mode": "design", "appliedShiftMm": 0},
            "aperture": {"tracedFNumber": 4.0, "limitingSurfaceIndex": 1.0},
            "lines": [{"wavelengthNm": 587.5618, "weight": 1}],
            "notes": [],
        }
        # Compared as text, in the order of the keys: an answer that says the same in another order is another text.
        self.assertEqual(json.dumps(data), json.dumps(expected))


# ── On the real optiland ─────────────────────────────────────────────────────────────────────────────────────────

FREQUENCIES = [0, 10, 30, 50]
BLUE = 486.1327

DEFOCUS = 0.5
"""How far behind its focus the image plane of ``PERFECT`` lies, mm."""

PERFECT = make_case(
    [surface(0.0, PLANE, semi=2.0), surface(5.0, sphere(-50.0, -2.25), semi=10.0)],
    stop=0,
    stop_radius=2.0,
    image_z=105.0 + DEFOCUS,
)
"""A lens that images the axis without aberration: glass of index 1.5 between a plane, which is the stop, and a
hyperboloid of conic constant -1.5^2, which sends every ray that reaches it along the axis through one point, 100 mm
behind its vertex. The image plane lies ``DEFOCUS`` behind that point."""


def perfect_landing(x: float, y: float) -> float:
    """Where along y the ray of ``PERFECT`` that passes the stop at (x, y) along the axis meets the image plane, mm.

    It keeps its place through the plane, meets the hyperboloid at the sag of its height and goes from there
    through the focus: similar triangles give the landing behind it, on the other side of the axis.
    """
    curvature, height = -1.0 / 50.0, math.hypot(x, y)
    sag = curvature * height * height / (1.0 + math.sqrt(1.0 + 1.25 * curvature * curvature * height * height))
    return -y * DEFOCUS / (100.0 - sag)


def bessel_j1(x: float) -> float:
    """J1 by its power series, which at the arguments of these tests, below 4, ends within a rounding in 30 terms."""
    return math.fsum(
        (-1.0) ** k * (x / 2.0) ** (2 * k + 1) / (math.factorial(k) * math.factorial(k + 1)) for k in range(30)
    )


def grid_within_the_circle(rays: int) -> list[tuple[float, float]]:
    """optiland's distribution "uniform" as its source defines it: the points of ``linspace(-1, 1, rays)`` in x and
    in y whose distance from the centre is at most 1, as (x, y). Needs numpy, for the same doubles."""
    import numpy as np  # noqa: PLC0415

    line = np.linspace(-1.0, 1.0, rays)
    x, y = np.meshgrid(line, line)
    inside = x**2 + y**2 <= 1
    return list(zip(x[inside].tolist(), y[inside].tolist(), strict=True))


def modulus_of(landings: Sequence[float], frequency: float) -> float:
    """The modulus of the mean of ``exp(-2 pi i nu u)`` over landings: a geometric MTF without bins, as defined."""
    turn = -2.0 * math.pi * frequency
    real = math.fsum(math.cos(turn * at) for at in landings)
    imaginary = math.fsum(math.sin(turn * at) for at in landings)
    return math.hypot(real, imaginary) / len(landings)


def bins_bound(frequency: float, extent: float, top: float, points: int = NUM_POINTS) -> float:
    """How far optiland's value at a frequency can lie from the modulus of the sum of the same landings without bins.

    A ray counts at the centre of its bin, at most half a bin of ``extent / (points + 1)`` from where it landed,
    which turns its unit vector by at most ``pi nu w`` and so moves it by at most ``2 sin(pi nu w / 2)``; the mean
    moves by no more. Between two samples of the axis, ``top / (points - 1)`` apart, a modulus of landings within
    ``extent`` of each other changes by at most ``pi extent`` a cycle/mm, so the chord lies within half a step of
    that slope from it; at the last sample, ``top``, nothing is interpolated.
    """
    width = extent / (points + 1)
    binned = 2.0 * math.sin(math.pi * frequency * width / 2.0)
    return binned + (0.0 if frequency in (0.0, top) else math.pi * extent * top / (points - 1) / 2.0)


@unittest.skipIf(MISSING is not None, MISSING)
class RealGeometricTest(unittest.TestCase):
    """optiland's geometric MTF of its own Double-Gauss, through the engine."""

    engine: OptilandEngine
    answer: dict[str, Any]
    fields: dict[float, dict[str, Any]]

    @classmethod
    def setUpClass(cls) -> None:
        cls.engine = OptilandEngine(fft.IDENTITY)
        # The axis, a field inside the image, one whose beam the lens cuts and one it does not pass.
        cls.answer = cls.ask([0, 10, 14, 25])
        cls.fields = {field["field"]: field for field in cls.answer["data"]["fields"]}

    @classmethod
    def ask(
        cls, angles: list[float], case: dict[str, Any] = DOUBLE_GAUSS, method: str = "geometric", **options: Any
    ) -> dict[str, Any]:
        result = cls.engine.run(mtf_request(case, mtf_spec(angles, FREQUENCIES, method=method), **options), case)
        issues = validate_kind("result", result)
        assert issues == [], format_issues(issues)
        return result

    def test_the_answer_is_a_valid_result_and_says_what_became_of_each_field(self) -> None:
        self.assertEqual(self.answer["status"], "ok", self.answer.get("error"))
        statuses = [(field["field"], field["status"], field.get("reason")) for field in self.answer["data"]["fields"]]
        self.assertEqual(
            statuses, [(0, "ok", None), (10, "ok", None), (14, "ok", None), (25, "unavailable", "no-rays")]
        )
        counts = self.answer["diagnostics"]["counts"]
        self.assertEqual(counts, {"surfaces": 11, "lines": 1, "fields": 4, "ok": 3, "unconverged": 0, "unavailable": 1})
        self.assertEqual(self.answer["data"]["lines"], [{"wavelengthNm": 587.5618, "weight": 1}])
        self.assertEqual(self.answer["data"]["method"]["name"], "geometric-mtf")
        launched = float(len(grid_within_the_circle(256)))
        for field in self.answer["data"]["fields"][:3]:
            for cut in ("tangential", "sagittal"):
                values = f8(field[cut])
                self.assertEqual(values[0], 1.0, "the MTF at no frequency is 1")
                self.assertTrue(all(0.0 <= value <= 1.0 for value in values))
            sampling = field["sampling"]
            self.assertEqual(field["fieldAngleDeg"], field["field"])
            self.assertEqual(
                (sampling["numRays"], sampling["coarseNumRays"], sampling["numPoints"]), (256.0, 128.0, 2048.0)
            )
            self.assertEqual((sampling["raysLaunched"], sampling["optilandWarnings"]), (launched, 0.0))
        # Every ray of the grid arrives on the axis and at 10 degrees; at 14 an aperture stops some, which optiland
        # leaves out of its spot and of its count.
        self.assertEqual([self.fields[angle]["sampling"]["raysLit"] for angle in (0, 10)], [launched, launched])
        self.assertTrue(0.9 * launched < self.fields[14]["sampling"]["raysLit"] < launched)

    def test_on_the_axis_the_two_cuts_are_one_curve_and_the_chief_ray_lands_where_it_is_traced_exactly(self) -> None:
        axis = self.fields[0]
        for tangential, sagittal in zip(f8(axis["tangential"]), f8(axis["sagittal"]), strict=True):
            self.assertAlmostEqual(tangential, sagittal, delta=1e-12)
        self.assertLessEqual(axis["imageHeightMm"], 1e-9)
        self.assertAlmostEqual(
            axis["sampling"]["binWidthTangentialMm"], axis["sampling"]["binWidthSagittalMm"], delta=1e-12
        )
        for angle in (10, 14):
            expected = fft.exact_chief_landing(DOUBLE_GAUSS, float(angle))
            self.assertAlmostEqual(self.fields[angle]["imageHeightMm"], expected, delta=1e-8)

    def test_off_the_axis_each_cut_is_the_cut_of_its_name_by_the_spot_of_rays_traced_exactly(self) -> None:
        # The spot at 10 degrees is wider along x, traced here in 60 digits on a lattice across the front of the
        # lens: the cut along y, the tangential one, is the higher by more than a quarter at 10 cycles/mm. That
        # lattice is even across the beam and coarse, optiland's is even on the stop and fine: the two agree to a
        # few hundredths, and optiland's two curves are each the one of its name.
        tangential, sagittal = fft.exact_spot_mtf(DOUBLE_GAUSS, 10.0, 10.0)
        self.assertGreater(tangential - sagittal, 0.25)
        field = self.fields[10]
        self.assertAlmostEqual(f8(field["tangential"])[1], tangential, delta=0.05)
        self.assertAlmostEqual(f8(field["sagittal"])[1], sagittal, delta=0.05)
        # A field at the mirrored angle is the mirrored field: the same curves.
        mirrored = self.ask([-10])["data"]["fields"][0]
        self.assertEqual((mirrored["fieldAngleDeg"], mirrored["status"]), (-10, "ok"))
        for cut in ("tangential", "sagittal"):
            for ours, theirs in zip(f8(mirrored[cut]), f8(field[cut]), strict=True):
                self.assertAlmostEqual(ours, theirs, delta=1e-9)

    def test_the_fields_settle_between_128_and_256_rays_and_512_is_asked_only_by_the_option(self) -> None:
        for angle, band in ((0, CONVERGENCE_ON_AXIS), (10, CONVERGENCE_OFF_AXIS), (14, CONVERGENCE_OFF_AXIS)):
            self.assertLessEqual(self.fields[angle]["sampling"]["maxDelta"], band)
        finer = self.ask([0, 10], geometricRays=512)["data"]
        self.assertEqual(finer["method"]["params"]["numRays"], [256, 512])
        for again, angle in zip(finer["fields"], (0, 10), strict=True):
            self.assertEqual((again["sampling"]["numRays"], again["sampling"]["coarseNumRays"]), (512.0, 256.0))
            # A step is computed on an optic of its own, so the 256 rays of this ladder are the 256 of the other:
            # what the finer answer says it moved by is the difference of the two answers.
            moved = max(
                abs(fine - coarse)
                for cut in ("tangential", "sagittal")
                for fine, coarse in zip(f8(again[cut]), f8(self.fields[angle][cut]), strict=True)
            )
            self.assertEqual((again["sampling"]["maxDelta"], again["status"]), (moved, "ok"))
            self.assertEqual(again["sampling"]["raysLaunched"], float(len(grid_within_the_circle(512))))

    def test_a_field_optiland_has_no_rays_of_is_a_row_and_the_fields_beside_it_are_what_they_are_alone(self) -> None:
        lost = self.fields[25]
        self.assertTrue(all(math.isnan(value) for value in f8(lost["tangential"]) + f8(lost["sagittal"])))
        self.assertEqual(lost["sampling"]["raysLit"], 0.0)
        self.assertEqual(self.answer["data"]["notes"], ["the field at 25.0 degrees: no-rays at 256 rays"])
        alone = self.ask([0, 10])["data"]["fields"]
        self.assertEqual(alone, [self.fields[0], self.fields[10]])
        # optiland's class does not raise for a spot without rays: its curves are NaN, and the worker says why.
        step = mtf.OptilandMtf().spot(DOUBLE_GAUSS, 0, 25.0, 32, (10.0,))
        self.assertEqual((step.lit, step.launched, step.flux), (0, len(grid_within_the_circle(32)), 0.0))
        self.assertTrue(all(math.isnan(value) for value in step.tangential + step.sagittal))

    def test_optilands_values_lie_within_what_its_bins_allow_of_the_sum_of_its_own_landings(self) -> None:
        # Asked at the frequencies of the answer: the sums are the worker's, of the landings optiland binned.
        for angle in (0, 10, 14):
            step = mtf.OptilandMtf().spot(DOUBLE_GAUSS, 0, float(angle), 256, [float(value) for value in FREQUENCIES])
            own = f8(self.fields[angle]["tangential"]), f8(self.fields[angle]["sagittal"])
            self.assertEqual(
                class_curves(step, [float(value) for value in FREQUENCIES]), own, "the answer is optiland's"
            )
            summed = sum_curves([step], [1.0], len(FREQUENCIES))
            assert not isinstance(summed, str)
            worst = 0.0
            for cut, extent in ((0, step.extent_mm[1]), (1, step.extent_mm[0])):
                for at, frequency in enumerate(FREQUENCIES):
                    apart = abs(own[cut][at] - summed[cut][at])
                    self.assertLessEqual(
                        apart, bins_bound(float(frequency), extent, 50.0) + 1e-12, (angle, cut, frequency)
                    )
                    worst = max(worst, apart)
            sampling = self.fields[angle]["sampling"]
            self.assertEqual(sampling["binningMaxDelta"], worst)
            self.assertEqual(sampling["binWidthTangentialMm"], step.extent_mm[1] / 2049)
            self.assertEqual(sampling["binWidthSagittalMm"], step.extent_mm[0] / 2049)
            self.assertLess(worst, CONVERGENCE_ON_AXIS)

    def test_with_nine_bins_across_the_spot_optilands_value_is_no_mtf_of_it_and_the_field_has_no_curves(self) -> None:
        # At 10 degrees the spot is some 0.08 mm wide along x: nine bins of 9 micrometres put 50 cycles/mm near
        # the frequency above which they tell nothing, 1 / (2 w).
        class Coarse(mtf.OptilandMtf):
            def spot(self, case: Any, line: int, angle_deg: float, num_rays: int, frequencies: Any) -> SpotStep:
                optic = mtf.field_optic(case, line, angle_deg)
                return geometric.geometric_step(optic, angle_deg, num_rays, frequencies, num_points=8)

        asked = MtfRequest((0.0, 10.0, 30.0, 50.0), (10.0,), 0, (128, 256), "geometric", (0,))
        field, notes = geometric.answer_field(asked, DOUBLE_GAUSS, 10.0, Coarse())
        self.assertEqual((field["status"], field["reason"]), ("unavailable", "frequency-beyond-bins"))
        self.assertGreater(field["sampling"]["binningMaxDelta"], CONVERGENCE_OFF_AXIS)
        width = field["sampling"]["binWidthSagittalMm"]
        self.assertTrue(0.3 < 50.0 * width < 0.6, width)
        self.assertEqual(notes, ["the field at 10.0 degrees: frequency-beyond-bins at 256 rays"])


@unittest.skipIf(MISSING is not None, MISSING)
class RealClosedFormTest(unittest.TestCase):
    """optiland's geometric MTF of spots whose landings are known in closed form."""

    def test_the_lens_without_aberration_sends_every_ray_through_its_focus_traced_exactly(self) -> None:
        for x, y in ((0.0, 0.25), (0.0, 2.0), (0.9, 1.2), (-0.5, 0.125)):
            ray = exact_trace(PERFECT, (x, y, -1.0), (0.0, 0.0, 1.0))
            assert ray.image is not None
            self.assertAlmostEqual(float(ray.image[1]), perfect_landing(x, y), delta=1e-15)
            self.assertAlmostEqual(float(ray.image[0]), perfect_landing(y, x), delta=1e-15)
            focused = exact_trace(
                {**PERFECT, "conditions": {**PERFECT["conditions"], "imageZ": 105.0}}, (x, y, -1.0), (0.0, 0.0, 1.0)
            )
            assert focused.image is not None
            self.assertLess(abs(focused.image[0]) + abs(focused.image[1]), Decimal("1e-30"))

    def test_out_of_focus_its_mtf_is_that_of_the_grid_of_landings_and_of_a_disc_to_the_coarseness_of_the_grid(
        self,
    ) -> None:
        # The stop is the plane in front and its clip radius 2 mm: optiland's pupil coordinate p is the point 2 p
        # of it, and its 256 by 256 grid within the circle lands in a disc of radius 2 * 0.5 / 100 mm, evenly but
        # for the sag of the hyperboloid, four parts in ten thousand at the rim.
        result = self.ask(PERFECT)
        (field,) = result["data"]["fields"]
        self.assertEqual((field["status"], field["imageHeightMm"]), ("ok", 0.0))
        landings = [perfect_landing(2.0 * x, 2.0 * y) for x, y in grid_within_the_circle(256)]
        self.assertEqual(field["sampling"]["raysLit"], float(len(landings)))
        extent = max(landings) - min(landings)
        radius = 2.0 * DEFOCUS / 100.0
        self.assertAlmostEqual(extent, 2.0 * radius, delta=0.02 * radius)
        self.assertAlmostEqual(field["sampling"]["binWidthTangentialMm"], extent / 2049, delta=1e-12)
        for cut in ("tangential", "sagittal"):
            values = f8(field[cut])
            self.assertEqual(values[0], 1.0)
            for value, frequency in zip(values[1:], FREQUENCIES[1:], strict=True):
                expected = modulus_of(landings, float(frequency))
                self.assertAlmostEqual(value, expected, delta=bins_bound(float(frequency), extent, 50.0) + 1e-9)
                # A disc lit evenly: 2 J1(x) / x at x = 2 pi nu r. The grid is that disc to its coarseness.
                x = 2.0 * math.pi * frequency * radius
                self.assertAlmostEqual(expected, 2.0 * bessel_j1(x) / x, delta=1e-3)
        self.assertLess(bins_bound(50.0, extent, 50.0), 2e-3)
        # The sums of optiland's landings are those of the closed form: nothing of them is binned.
        step = mtf.OptilandMtf().spot(PERFECT, 0, 0.0, 256, [30.0, 50.0])
        for cut in (step.sums_tangential, step.sums_sagittal):
            for total, frequency in zip(cut, (30.0, 50.0), strict=True):
                self.assertAlmostEqual(abs(total) / step.flux, modulus_of(landings, frequency), delta=1e-11)

    def ask(self, case: dict[str, Any], angles: Sequence[float] = (0,), **options: Any) -> dict[str, Any]:
        result = OptilandEngine(fft.IDENTITY).run(
            mtf_request(case, geometric_spec(list(angles), FREQUENCIES), **options), case
        )
        issues = validate_kind("result", result)
        assert issues == [], format_issues(issues)
        self.assertEqual(result["status"], "ok", result.get("error"))
        return result

    def chromatic(self) -> dict[str, Any]:
        """A singlet 40 mm behind a stop of half a micrometre, at two lines whose indices differ by 0.002, the second of
        half the weight: each line's spot is a point to a few nanometres, and the two lie apart by lateral colour,
        the chief ray meeting the lens 3.5 mm from the axis."""
        case = make_case(
            [surface(0.0, PLANE, semi=0.0005), surface(40.0, sphere(50.0)), surface(44.0, PLANE)],
            stop=0,
            stop_radius=0.0005,
            image_z=44.0 + 97.3,
            lines=(587.5618, BLUE),
            indices=[[1.0, 1.5, 1.0], [1.0, 1.502, 1.0]],
        )
        case["conditions"]["lines"][1]["weight"] = 0.5
        return case

    def test_two_lines_that_lateral_colour_sets_apart_add_up_as_two_points_traced_exactly(self) -> None:
        case, angle = self.chromatic(), 5.0
        radians = math.radians(angle)
        # optiland's field at a positive angle travels toward +y; the chief ray is the one through the centre of
        # the stop, the plane at z = 0, and the rays through the rim of the stop bound the spot.
        direction = (0.0, math.sin(radians), math.cos(radians))

        def landing(line: int, x: float, y: float) -> tuple[Decimal, Decimal]:
            # Through (x, y) of the stop, launched 10 mm in front of it; 0.999 of the way out keeps a rim ray inside.
            origin = (0.999 * x, 0.999 * y - 10.0 * math.tan(radians), -10.0)
            ray = exact_trace(case, origin, direction, line)
            assert ray.image is not None
            return ray.image[0], ray.image[1]

        chiefs = [landing(line, 0.0, 0.0) for line in (0, 1)]
        apart = float(chiefs[1][1] - chiefs[0][1])
        self.assertGreater(abs(apart), 0.005, "the lines land micrometres apart")
        self.assertEqual((chiefs[0][0], chiefs[1][0]), (0, 0))
        spread = max(
            float(((x - chiefs[line][0]) ** 2 + (y - chiefs[line][1]) ** 2).sqrt())
            for line in (0, 1)
            for turn in range(8)
            for x, y in [landing(line, 0.0005 * math.cos(turn * math.pi / 4), 0.0005 * math.sin(turn * math.pi / 4))]
        )
        self.assertLess(spread, 2e-5, "each line's spot is a point to twenty nanometres")

        whole = self.ask(case, [angle])
        self.assertEqual(whole["data"]["method"]["name"], "spot-landings-sum")
        self.assertEqual(
            whole["data"]["lines"], [{"wavelengthNm": 587.5618, "weight": 1}, {"wavelengthNm": BLUE, "weight": 0.5}]
        )
        (field,) = whole["data"]["fields"]
        self.assertEqual(field["status"], "ok")
        self.assertAlmostEqual(field["imageHeightMm"], float(abs(chiefs[0][1])), delta=1e-9)
        for at, frequency in enumerate(FREQUENCIES):
            # A ray within `spread` of its line's chief ray turns its unit vector by at most 2 pi nu spread; half
            # as much again for the rim being looked at in eight places.
            within = 1.5 * 2.0 * math.pi * frequency * spread + 1e-12
            turn = math.cos(2.0 * math.pi * frequency * apart)
            expected = math.sqrt(1.0 + 0.25 + 2.0 * 0.5 * turn) / 1.5
            self.assertAlmostEqual(f8(field["tangential"])[at], expected, delta=within)
            # The colour is along y: the cut along x sees one point.
            self.assertAlmostEqual(f8(field["sagittal"])[at], 1.0, delta=within)
        # At 50 cycles/mm the two points are far enough out of step to cost a quarter of the modulus, and a line
        # alone, which is optiland's own curve of a point, loses nothing: no mean of the lines' moduli is the sum.
        self.assertLess(f8(field["tangential"])[3], 0.75)
        for line in (0, 1):
            alone = self.ask(case, [angle], line=line)["data"]
            self.assertEqual(
                (alone["method"]["name"], alone["lines"]), ("geometric-mtf", [whole["data"]["lines"][line]])
            )
            self.assertAlmostEqual(f8(alone["fields"][0]["tangential"])[3], 1.0, delta=1e-3)

    def test_two_lines_of_the_same_indices_are_the_spot_of_one_and_a_line_of_several_is_that_line_alone(self) -> None:
        several = fft.two_lines(DOUBLE_GAUSS, BLUE, 0.5)
        only = copy.deepcopy(DOUBLE_GAUSS)
        only["conditions"]["lines"][0].update(wavelengthNm=BLUE, weight=0.5)
        asked = self.ask(several, [0, 10], line=1)
        alone = self.ask(only, [0, 10])
        self.assertEqual(asked["data"]["fields"], alone["data"]["fields"])
        self.assertEqual(asked["data"]["notes"], [f"of line 1 of the case alone, {BLUE} nm"])
        # The same rays at both lines: the sum of the two is the sum of one, which optiland's own curve of that
        # line lies beside by what its bins moved it.
        whole = self.ask(several, [0, 10])
        self.assertEqual(whole["diagnostics"]["counts"]["lines"], 2)
        for summed, own in zip(whole["data"]["fields"], alone["data"]["fields"], strict=True):
            self.assertEqual(summed["sampling"]["binningMaxDelta"], own["sampling"]["binningMaxDelta"])
            for cut in ("tangential", "sagittal"):
                for ours, theirs in zip(f8(summed[cut]), f8(own[cut]), strict=True):
                    self.assertAlmostEqual(ours, theirs, delta=own["sampling"]["binningMaxDelta"] + 1e-12)


@unittest.skipIf(MISSING is not None, MISSING)
class RealGeometricReadBackTest(unittest.TestCase):
    """What the worker states to optiland's class, read back; each mistake is made on purpose. And what the class
    does that ``docs/gotchas.md`` describes."""

    ASKED = (10.0, 50.0)

    def optic(self, angle: float = 10.0) -> Any:
        return mtf.field_optic(DOUBLE_GAUSS, 0, angle)

    def step(self, tools: Any = None, angle: float = 10.0) -> SpotStep:
        return geometric.geometric_step(self.optic(angle), angle, 16, self.ASKED, tools=tools, num_points=64)

    def test_a_step_is_what_was_asked_and_its_axis_is_the_one_stated_whatever_became_of_the_rim_rays(self) -> None:
        step = self.step()
        self.assertEqual(
            (step.num_rays, step.num_points, len(step.axis), len(step.tangential), len(step.sagittal)),
            (16, 64, 64, 64, 64),
        )
        self.assertEqual((step.launched, step.lit), (len(grid_within_the_circle(16)),) * 2)
        self.assertEqual((step.tangential[0], step.sagittal[0], step.flux), (1.0, 1.0, float(step.lit)))
        # Cycles/mm on the image surface, from 0 to the largest frequency asked in equal steps: nothing is traced
        # for it. At 14 degrees, where every ray through the rim of the stop is stopped, it is the same axis.
        outer = self.step(angle=14.0)
        self.assertEqual(outer.axis, step.axis)
        self.assertEqual((step.axis[0], step.axis[-1]), (0.0, 50.0))
        for at, frequency in enumerate(step.axis):
            self.assertAlmostEqual(frequency, 50.0 * at / 63, delta=1e-13)
        self.assertLess(outer.lit, outer.launched)

    def test_an_analysis_that_says_it_computed_with_anything_else_than_was_asked_is_no_answer(self) -> None:
        tools = mtf.mtf_api()

        def saying(**changed: Any) -> Any:
            """optiland's class, whose analysis says of itself what ``changed`` states instead of what it holds."""

            def made(optic: Any, **keywords: Any) -> Any:
                analysis = tools.GeometricMTF(optic, **keywords)
                for name, value in changed.items():
                    setattr(analysis, name, value(getattr(analysis, name)) if callable(value) else value)
                return analysis

            return types.SimpleNamespace(GeometricMTF=made)

        rays = len(grid_within_the_circle(16))

        def shorter(data: Any) -> Any:
            spot = data[0][0]
            return [[types.SimpleNamespace(x=spot.x[:-1], y=spot.y, intensity=spot.intensity)]]

        for changed, said in (
            ({"num_rings": 6}, "num_rays, the spot diagram's num_rings is 6 in what optiland computed and 16 asked"),
            ({"distribution": "hexapolar"}, "the distribution is 'hexapolar'"),
            ({"num_points": 256}, "num_points is 256 .* and 64 asked"),
            ({"max_freq": 100.0}, r"max_freq is 100\.0 .* and 50\.0 asked"),
            ({"scale": True}, "scale is True"),
            ({"diff_limited_mtf": [1.0, 0.5]}, r"the factor its curves are multiplied by is \[1\.0, 0\.5\]"),
            ({"coordinates": "global"}, "the coordinates of the spot is 'global'"),
            ({"wavelengths": [types.SimpleNamespace(value=0.55)]}, r"the wavelengths in µm is \[0\.55\]"),
            ({"fields": [types.SimpleNamespace(coord=(0.0, 0.5))]}, r"the field is \[\(0\.0, 0\.5\)\]"),
            ({"data": lambda data: [data[0] * 2]}, r"the spots of each field is \[2\]"),
            ({"mtf": lambda curves: curves * 2}, r"the curves of each field is \[2, 2\]"),
            ({"mtf": lambda curves: [[curves[0][0]]]}, r"the curves of each field is \[1\]"),
            ({"freq": lambda axis: axis[:-1]}, "the length of freq is 63 .* and 64 asked"),
            ({"mtf": lambda curves: [[curves[0][0][:-1], curves[0][1]]]}, "the length of the tangential curve is 63"),
            ({"mtf": lambda curves: [[curves[0][0], curves[0][1][:-1]]]}, "the length of the sagittal curve is 63"),
            ({"freq": lambda axis: axis * 2}, r"the ends of freq is \(0\.0, 100\.0\)"),
            ({"freq": lambda axis: axis + 1}, r"the ends of freq is \(1\.0, 51\.0\)"),
            ({"data": shorter}, rf"the rays of the spot in x, in y and in intensity is \({rays - 1}, {rays}, {rays}\)"),
        ):
            with self.assertRaisesRegex(BuildMismatch, f"the geometric MTF: {said}"):
                self.step(saying(**changed))

    def test_asked_without_its_options_optiland_multiplies_the_curve_by_a_diffraction_limit(self) -> None:
        # The default of the class is scale=True: every value times the MTF of a circular pupil without
        # aberration, whose cut-off is that of the paraxial f-number, 1 / (lambda F). The worker states
        # scale=False and would be told here if optiland scaled all the same.
        tools = mtf.mtf_api()
        keywords = {"fields": [(0.0, 1.0)], "wavelength": "primary", "num_rays": 16, "num_points": 64, "max_freq": 50.0}
        scaled = tools.GeometricMTF(self.optic(), **keywords)
        plain = tools.GeometricMTF(self.optic(), scale=False, **keywords)
        self.assertEqual((scaled.scale, scaled.distribution, plain.diff_limited_mtf), (True, "uniform", 1))
        optic = self.optic()
        (f_number,) = (float(value) for value in optic.paraxial.FNO())
        cutoff = 1.0 / (float(optic.primary_wavelength) * 1e-3 * f_number)
        self.assertAlmostEqual(f_number, 5.0, delta=0.01)
        for at in (1, 13, 63):
            ratio = float(scaled.freq[at]) / cutoff
            limit = (2.0 / math.pi) * (math.acos(ratio) - ratio * math.sqrt(1.0 - ratio * ratio))
            self.assertLess(limit, 1.0 - 1e-3 * at)
            self.assertAlmostEqual(float(scaled.mtf[0][0][at]), float(plain.mtf[0][0][at]) * limit, delta=1e-12)

        def unscaled(optic: Any, **stated: Any) -> Any:
            stated.pop("scale")
            return tools.GeometricMTF(optic, **stated)

        with self.assertRaisesRegex(BuildMismatch, "the geometric MTF: scale is True in what optiland computed"):
            self.step(types.SimpleNamespace(GeometricMTF=unscaled))

    def test_the_class_bins_the_landings_as_they_are_about_no_point_and_counts_each_lit_ray_once(self) -> None:
        # Its value is the modulus of the sum over the centres of 65 bins from the least landing to the greatest,
        # written out here; every landing moved by the same 3 mm, the bins move with them and the modulus stays,
        # to what a landing on the edge of a bin may count for on either side of it.
        import numpy as np  # noqa: PLC0415

        tools = mtf.mtf_api()
        analysis = tools.GeometricMTF(
            self.optic(),
            fields=[(0.0, 1.0)],
            wavelength="primary",
            num_rays=16,
            distribution="uniform",
            num_points=64,
            max_freq=50.0,
            scale=False,
        )
        landings = np.asarray(analysis.data[0][0].y, dtype=float)
        self.assertGreater(float(landings.min()), 17.0, "the landings are millimetres from the axis, not from a centre")
        counts, edges = np.histogram(landings, bins=65)
        centres = (edges[1:] + edges[:-1]) / 2
        for at in (0, 13, 63):
            turn = 2.0 * math.pi * float(analysis.freq[at]) * centres
            expected = math.hypot(float(np.sum(counts * np.cos(turn))), float(np.sum(counts * np.sin(turn)))) / len(
                landings
            )
            self.assertAlmostEqual(float(analysis.mtf[0][0][at]), expected, delta=1e-12)
        moved = analysis._compute_field_data(landings + 3.0, analysis.freq, 1)
        for at in (0, 13, 63):
            self.assertAlmostEqual(float(moved[at]), float(analysis.mtf[0][0][at]), delta=2.0 / len(landings))

    def test_the_width_of_a_bin_of_each_cut_is_that_of_the_bins_optiland_laid_for_the_curve_of_that_cut(self) -> None:
        # optiland's tangential curve is of the histogram of the landings' y and its sagittal one of that of their x
        # (``_generate_mtf_data``): numpy's edges of each, laid here from optiland's own spot, are what the worker
        # states under the cut's name. At 10 degrees the spot is wider along x by a third at least, so a width
        # stated under the other name is another number.
        import numpy as np  # noqa: PLC0415

        tools = mtf.mtf_api()
        analysis = tools.GeometricMTF(
            self.optic(),
            fields=[(0.0, 1.0)],
            wavelength="primary",
            num_rays=16,
            distribution="uniform",
            num_points=64,
            max_freq=50.0,
            scale=False,
        )
        spot = analysis.data[0][0]
        along_x, along_y = (np.histogram(np.asarray(part, dtype=float), bins=65)[1] for part in (spot.x, spot.y))
        step = self.step()
        self.assertGreater(float(along_x[-1] - along_x[0]), 1.3 * float(along_y[-1] - along_y[0]))
        self.assertAlmostEqual(geometric.bin_width(step, 0), float(along_x[1] - along_x[0]), delta=1e-12)
        self.assertAlmostEqual(geometric.bin_width(step, 1), float(along_y[1] - along_y[0]), delta=1e-12)
        asked = MtfRequest(self.ASKED, (10.0,), 0, (128, 256), "geometric", (0,))

        class Few(mtf.OptilandMtf):
            def spot(inner, case: Any, line: int, angle_deg: float, num_rays: int, frequencies: Any) -> SpotStep:
                return self.step()

        field, _ = geometric.answer_field(asked, DOUBLE_GAUSS, 10.0, Few())
        self.assertEqual(field["sampling"]["binWidthSagittalMm"], geometric.bin_width(step, 0))
        self.assertEqual(field["sampling"]["binWidthTangentialMm"], geometric.bin_width(step, 1))

    def test_a_ray_totally_reflected_at_the_last_surface_stays_in_optilands_spot_and_the_field_has_no_curves(
        self,
    ) -> None:
        # Glass of index 1.5 behind a plane, which is the stop, and a sphere of radius 6 mm concave toward the
        # image: a ray along the axis at the height h meets it at the angle whose sine is h / 6 and is totally
        # reflected where 1.5 h / 6 is above 1, beyond 4 mm. No aperture follows the last surface, so optiland
        # leaves such a ray its intensity and no landing, counts it into the spot, and its histogram raises.
        def case(stop_radius: float) -> dict[str, Any]:
            surfaces = [surface(0.0, PLANE, semi=stop_radius), surface(8.0, sphere(-6.0), semi=5.9)]
            return make_case(surfaces, stop=0, stop_radius=stop_radius, image_z=20.0)

        asked = MtfRequest((0.0, 10.0), (0.0,), 0, (128, 256), "geometric", (0,))
        field, notes = geometric.answer_field(asked, case(5.5), 0.0, mtf.OptilandMtf())
        self.assertEqual((field["status"], field["reason"]), ("unavailable", "optiland-raised-ValueError"))
        self.assertTrue(all(math.isnan(value) for value in f8(field["tangential"]) + f8(field["sagittal"])))
        self.assertRegex(notes[0], "at 128 rays optiland raised ValueError: .* is not finite")
        # Within 4 mm every ray is refracted and lands, and the field has its curves, of a spot millimetres wide.
        field, _ = geometric.answer_field(asked, case(3.9), 0.0, mtf.OptilandMtf())
        self.assertNotEqual(field["status"], "unavailable")
        self.assertTrue(all(0.0 <= value <= 1.0 for value in f8(field["tangential"]) + f8(field["sagittal"])))
        self.assertEqual(field["sampling"]["raysLit"], field["sampling"]["raysLaunched"])


if __name__ == "__main__":
    unittest.main()

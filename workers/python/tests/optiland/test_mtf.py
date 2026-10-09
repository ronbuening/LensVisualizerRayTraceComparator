"""``mtf.native`` of the worker: what it asks of optiland, and what it makes of the answer.

The first half needs no optiland: the request is read, a curve is carried from optiland's axis to the frequencies
asked, and a field gets its status, on curves a test writes down (``StandIn``), whose values are binary fractions so
that every expected number is exact. The second half is the real optiland on its own Double-Gauss sample, the
contract's fixture of it, and is skipped, with the reason, under an interpreter that has none. Its expectations are
derived here: a marginal ray and a chief ray by the 60-digit trace of ``exact.py``, the diffraction limit by counting
the cells of a disc, and never read from an engine's output.
"""

from __future__ import annotations

import copy
import math
import types
import unittest
from decimal import Decimal
from typing import Any
from unittest import mock

from lvrtc_optiland import mtf
from lvrtc_optiland.build import BuildMismatch
from lvrtc_optiland.engine import OptilandEngine
from lvrtc_optiland.mtf import (
    CONVERGENCE_OFF_AXIS,
    CONVERGENCE_ON_AXIS,
    REQUEST_BUDGET_S,
    FieldProbe,
    MtfRequest,
    StepCurves,
    answer_field,
    answer_mtf,
    axis_is_usable,
    curves_at,
    interpolate,
    read_request,
)
from lvrtc_optiland.trace import STATUS_OK
from lvrtc_worker_kit.validate import contract_schemas, format_issues, quantity_schema_id, validate, validate_kind

from .exact import Exact, exact_trace
from .support import PLANE, f8, make_case, mtf_request, mtf_spec, read_fixture, real_optiland_missing, sphere, surface

MISSING = real_optiland_missing()

IDENTITY: dict[str, Any] = {
    "id": "optiland",
    "version": "0.0.0+test",
    "fingerprint": "f" * 64,
    "adapterRevision": "a" * 64,
    "details": {"jit": True},
}

DOUBLE_GAUSS = read_fixture("valid", "optical-case", "double-gauss.json")
SINGLET = read_fixture("valid", "optical-case", "singlet.json")


def two_lines(case: dict[str, Any], second_nm: float, weight: float) -> dict[str, Any]:
    """``case`` with a second line of another wavelength and weight and the first line's indices."""
    from lvrtc_optiland.build import index_rows  # noqa: PLC0415
    from lvrtc_worker_kit.ndarray import encode_ndarray  # noqa: PLC0415

    (row,) = index_rows(case)
    made = copy.deepcopy(case)
    made["conditions"]["lines"].append({"wavelengthNm": second_nm, "weight": weight, "indexSource": "authored"})
    made["conditions"]["indexAfterSurface"] = encode_ndarray("f8", [*row, *row], [2, len(row)])
    return made


# ── Without optiland ─────────────────────────────────────────────────────────────────────────────────────────────


def straight(rays: int, step: float, lowered: float = 0.0) -> StepCurves:
    """The curves of a step whose MTF falls in a straight line, 1 - nu / 64, on both cuts; ``lowered`` is taken off
    every sample but the first. Every number is a binary fraction."""
    axis = tuple(at * step for at in range(rays))
    values = tuple(1.0 if at == 0 else max(0.0, 1.0 - frequency / 64.0 - lowered) for at, frequency in enumerate(axis))
    return StepCurves(rays, 2 * rays, axis, axis, values, values, working_f_number=4.0)


class StandIn:
    """Stands where optiland would: it gives the curves, the probes and the failures a test wrote down."""

    def __init__(self, steps: dict[tuple[float, int], Any], probes: dict[float, Any] | None = None) -> None:
        self.steps = steps
        self.probes = probes or {}
        self.aperture_outcome: Any = ({"tracedFNumber": 4.0, "limitingSurfaceIndex": 1.0}, [])
        self.asked: list[tuple[Any, ...]] = []

    def aperture(self, case: dict[str, Any], line: int) -> tuple[dict[str, float], list[str]]:
        self.asked.append(("aperture", line))
        if isinstance(self.aperture_outcome, BaseException):
            raise self.aperture_outcome
        return self.aperture_outcome

    def field(self, case: dict[str, Any], line: int, angle_deg: float) -> FieldProbe:
        self.asked.append(("field", line, angle_deg))
        outcome = self.probes.get(angle_deg, FieldProbe(angle_deg, 2.0 * abs(angle_deg), 4, 0, 0.015625))
        if isinstance(outcome, BaseException):
            raise outcome
        return outcome

    def step(self, case: dict[str, Any], line: int, angle_deg: float, num_rays: int) -> StepCurves:
        self.asked.append(("step", line, angle_deg, num_rays))
        outcome = self.steps[(angle_deg, num_rays)]
        if isinstance(outcome, BaseException):
            raise outcome
        return outcome


def settled(*angles: float) -> dict[tuple[float, int], Any]:
    """Steps that agree: the straight line at 128 rays and at 256."""
    return {(angle, rays): straight(rays, 64.0 / rays) for angle in angles for rays in (128, 256)}


ASKED = MtfRequest(frequencies=(0.0, 10.0, 10.125, 30.0), angles=(0.0,), line=0, ladder=(128, 256))
STRAIGHT_AT_ASKED = [1.0, 0.84375, 0.841796875, 0.53125]
"""1 - nu / 64 at the frequencies of ``ASKED``: 10.125 lies between two samples of either axis."""


class ReadRequestTest(unittest.TestCase):
    def test_a_spec_of_angles_on_the_plane_of_the_case_is_read_with_the_ladder_of_128_and_256(self) -> None:
        asked = read_request(mtf_spec([0, 10.5, -3], [0, 12.5, 40]), {}, DOUBLE_GAUSS)
        self.assertEqual(asked, MtfRequest((0.0, 12.5, 40.0), (0.0, 10.5, -3.0), 0, (128, 256)))
        # An option of another engine is not this engine's to read.
        self.assertEqual(
            read_request(mtf_spec([0]), {"lvGridCap": 64, "bundleGrid": 32}, DOUBLE_GAUSS).ladder, (128, 256)
        )

    def test_the_option_fftRays_moves_the_ladder_up_one_step_and_takes_no_other_value(self) -> None:
        self.assertEqual(read_request(mtf_spec([0]), {"fftRays": 512}, DOUBLE_GAUSS).ladder, (256, 512))
        self.assertEqual(read_request(mtf_spec([0]), {"fftRays": 256}, DOUBLE_GAUSS).ladder, (128, 256))
        for value in (128, 1024, 300, "512", 512.0, True, None, [512]):
            refused = read_request(mtf_spec([0]), {"fftRays": value}, DOUBLE_GAUSS)
            self.assertEqual([(item["code"], item["item"]) for item in refused], [("option", "option.fftRays")], value)
            self.assertIn("256 or 512", refused[0]["message"])

    def test_what_the_engine_has_no_method_for_is_refused_item_by_item(self) -> None:
        spec = mtf_spec([0], method="geometric", focus="engine-best", profile="lv-tab-default")
        spec["fields"] = {"kind": "image-height-fractions", "values": [0, 1]}
        refused = read_request(spec, {}, DOUBLE_GAUSS)
        self.assertEqual(
            [(item["code"], item["item"]) for item in refused],
            [
                ("option", "profile"),
                ("option", "method.geometric"),
                ("option", "focus.engine-best"),
                ("option", "fields.image-height-fractions"),
            ],
        )
        for name, value, item in (
            ("method", "geometric", "method.geometric"),
            ("focus", "engine-best", "focus.engine-best"),
        ):
            alone = read_request(mtf_spec([0], **{name: value}), {}, DOUBLE_GAUSS)
            self.assertEqual([entry["item"] for entry in alone], [item])

    def test_a_case_of_several_lines_is_answered_one_line_at_a_time_and_not_without_one(self) -> None:
        case = two_lines(DOUBLE_GAUSS, 486.1327, 0.5)
        refused = read_request(mtf_spec([0]), {}, case)
        self.assertEqual([(item["code"], item["item"]) for item in refused], [("feature", "lines.polychromatic")])
        self.assertIn("no polychromatic MTF is formed of moduli", refused[0]["message"])
        self.assertEqual(read_request(mtf_spec([0]), {"line": 1}, case).line, 1)
        self.assertEqual(read_request(mtf_spec([0]), {"line": 0}, case).line, 0)
        self.assertEqual(read_request(mtf_spec([0]), {"line": 0}, DOUBLE_GAUSS).line, 0)
        for value in (2, -1, True, 1.0, "1"):
            wrong = read_request(mtf_spec([0]), {"line": value}, case)
            self.assertEqual([(item["code"], item["item"]) for item in wrong], [("option", "option.line")], value)

    def test_a_finite_object_is_refused_because_no_spec_says_where_its_angle_is_measured(self) -> None:
        case = make_case([surface(0, sphere(50)), surface(4, PLANE)], object_z=-200.0)
        refused = read_request(mtf_spec([0, 5]), {}, case)
        self.assertEqual([(item["code"], item["item"]) for item in refused], [("feature", "object.finite")])


class InterpolationTest(unittest.TestCase):
    AXIS = (0.0, 2.5, 5.0, 7.5)
    VALUES = (1.0, 0.5, 0.25, 0.0)

    def test_a_sample_of_the_axis_keeps_its_value_and_a_frequency_between_two_lies_on_their_chord(self) -> None:
        for frequency, value in zip(self.AXIS, self.VALUES, strict=True):
            self.assertEqual(interpolate(self.AXIS, self.VALUES, frequency), value)
        # Halfway from 1 to 0.5; three quarters of the way from 0.25 to 0: binary fractions, so exact.
        self.assertEqual(interpolate(self.AXIS, self.VALUES, 1.25), 0.75)
        self.assertEqual(interpolate(self.AXIS, self.VALUES, 6.875), 0.0625)
        self.assertEqual(interpolate(self.AXIS, self.VALUES, 3.125), 0.4375)

    def test_nothing_is_extrapolated_beyond_the_last_sample(self) -> None:
        self.assertIsNone(interpolate(self.AXIS, self.VALUES, 7.5000001))
        self.assertIsNone(interpolate(self.AXIS, self.VALUES, 100.0))
        self.assertIsNone(interpolate(self.AXIS, self.VALUES, math.nan))

    def test_a_value_never_leaves_the_range_of_the_two_samples_it_lies_between(self) -> None:
        # 0.1 + 0.2 is above 0.3 in doubles: a chord evaluated plainly can end a rounding outside its ends.
        axis, values = (0.0, 0.3), (0.1, 0.30000000000000004)
        for frequency in (1e-300, 0.1, 0.2, 0.29999999999999993):
            got = interpolate(axis, values, frequency)
            assert got is not None
            self.assertTrue(values[0] <= got <= values[1], (frequency, got))

    def test_each_cut_is_read_on_its_own_axis(self) -> None:
        # The tangential samples lie 4 cycles/mm apart and the sagittal ones 2: at 3 cycles/mm the tangential value
        # is three quarters of the way from 1 to 0.5 and the sagittal one halfway from 0.75 to 0.25.
        step = StepCurves(
            4, 8, (0.0, 4.0, 8.0, 12.0), (0.0, 2.0, 4.0, 6.0), (1.0, 0.5, 0.25, 0.0), (1.0, 0.75, 0.25, 0.0), 4.0
        )
        self.assertEqual(curves_at(step, [0.0, 3.0, 6.0]), ([1.0, 0.625, 0.375], [1.0, 0.5, 0.0]))
        # Beyond the shorter axis, the sagittal one, there is no curve, though the tangential axis reaches further.
        self.assertEqual(curves_at(step, [3.0, 6.5]), "frequency-beyond-axis")

    def test_an_axis_that_is_none_a_frequency_beyond_it_and_a_value_that_is_no_modulus_are_reasons(self) -> None:
        nan = math.nan
        for axis in (
            (0.0, nan, nan, nan),
            (0.0, 0.0, 0.0, 0.0),
            (0.0, math.inf, math.inf, math.inf),
            (1.0, 2.0, 3.0, 4.0),
        ):
            self.assertFalse(axis_is_usable(axis), axis)
            step = StepCurves(4, 8, axis, self.AXIS, self.VALUES, self.VALUES, 4.0)
            self.assertEqual(curves_at(step, [1.0]), "no-frequency-axis", axis)
        self.assertTrue(axis_is_usable(self.AXIS))
        for values in ((1.0, nan, 0.25, 0.0), (1.0, 1.5, 0.25, 0.0), (1.0, -0.5, 0.25, 0.0)):
            step = StepCurves(4, 8, self.AXIS, self.AXIS, self.VALUES, values, 4.0)
            self.assertEqual(curves_at(step, [1.0]), "mtf-not-a-modulus", values)
            # Only the two samples a frequency lies between are read.
            self.assertEqual(curves_at(step, [6.875]), ([0.0625], [0.0625]), values)


class FieldAnswerTest(unittest.TestCase):
    def entry(
        self, measure: StandIn, angle: float = 0.0, asked: MtfRequest = ASKED
    ) -> tuple[dict[str, Any], list[str]]:
        return answer_field(asked, DOUBLE_GAUSS, angle, measure)

    def test_a_field_whose_two_steps_agree_is_ok_with_the_finer_steps_curves_and_what_was_sampled(self) -> None:
        measure = StandIn(settled(0.0))
        field, notes = self.entry(measure)
        self.assertEqual(measure.asked, [("field", 0, 0.0), ("step", 0, 0.0, 128), ("step", 0, 0.0, 256)])
        self.assertEqual((field["status"], notes), ("ok", []))
        self.assertNotIn("reason", field)
        self.assertEqual((field["field"], field["fieldAngleDeg"], field["imageHeightMm"]), (0.0, 0.0, 0.0))
        self.assertEqual(f8(field["tangential"]), STRAIGHT_AT_ASKED)
        self.assertEqual(f8(field["sagittal"]), STRAIGHT_AT_ASKED)
        self.assertEqual(
            field["sampling"],
            {
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
            },
        )

    def test_a_field_that_moved_by_more_than_its_band_is_unconverged_and_keeps_its_curves(self) -> None:
        # The finer step lies 1/128 below the coarser at every frequency but 0: more than the band on the axis,
        # 0.005, and less than the band off it, 0.01.
        moved = 0.0078125
        self.assertTrue(CONVERGENCE_ON_AXIS < moved < CONVERGENCE_OFF_AXIS)
        for angle, status in ((0.0, "unconverged"), (7.0, "ok")):
            steps = {(angle, 128): straight(128, 0.5), (angle, 256): straight(256, 0.25, lowered=moved)}
            field, notes = self.entry(StandIn(steps), angle)
            self.assertEqual(field["status"], status, angle)
            self.assertEqual(field["sampling"]["maxDelta"], moved)
            self.assertEqual(f8(field["tangential"]), [1.0, *(value - moved for value in STRAIGHT_AT_ASKED[1:])])
            self.assertEqual(field.get("reason"), "not-converged" if status == "unconverged" else None)
            self.assertEqual(len(notes), 1 if status == "unconverged" else 0)
        # The note states both steps' figures at the frequency that moved most, the first on a tie.
        self.assertEqual(
            notes_of(0.0, moved),
            [
                "the field at 0.0 degrees: the tangential MTF at 10.0 cycles/mm is 0.84375 at 128 rays and "
                "0.8359375 at 256, further apart than 0.005"
            ],
        )

    def test_an_exception_of_optiland_is_the_fields_status_and_ends_its_ladder(self) -> None:
        said = ValueError("Working F/# could not be calculated\n due to raytrace errors.")
        measure = StandIn({(9.0, 128): said, (9.0, 256): AssertionError("the finer step is not asked")})
        field, notes = self.entry(measure, 9.0)
        self.assertEqual(measure.asked, [("field", 0, 9.0), ("step", 0, 9.0, 128)])
        self.assertEqual((field["status"], field["reason"]), ("unavailable", "optiland-raised-ValueError"))
        self.assertTrue(all(math.isnan(value) for value in f8(field["tangential"]) + f8(field["sagittal"])))
        self.assertEqual(len(f8(field["tangential"])), len(ASKED.frequencies))
        # Where the chief ray landed was found before the MTF was asked, and is still said.
        self.assertEqual((field["fieldAngleDeg"], field["imageHeightMm"]), (9.0, 18.0))
        self.assertEqual(field["sampling"], {"rimRaysLit": 4.0, "rimRaysLost": 0.0, "rimLandingSpreadMm": 0.015625})
        expected = (
            "the field at 9.0 degrees: at 128 rays optiland raised ValueError: Working F/# could not be calculated "
            "due to raytrace errors."
        )
        self.assertEqual(notes, [expected])

        finer = StandIn({(9.0, 128): straight(128, 0.5), (9.0, 256): ZeroDivisionError("float division by zero")})
        field, notes = self.entry(finer, 9.0)
        self.assertEqual((field["status"], field["reason"]), ("unavailable", "optiland-raised-ZeroDivisionError"))
        self.assertIn("at 256 rays optiland raised ZeroDivisionError", notes[0])

    def test_a_field_without_a_chief_ray_has_no_angle_no_landing_and_no_step(self) -> None:
        measure = StandIn({}, probes={30.0: RuntimeError("no chief ray")})
        field, notes = self.entry(measure, 30.0)
        self.assertEqual(measure.asked, [("field", 0, 30.0)])
        self.assertEqual((field["status"], field["reason"]), ("unavailable", "optiland-raised-RuntimeError"))
        self.assertEqual(
            (field["field"], field["fieldAngleDeg"], field["imageHeightMm"], field["sampling"]), (30.0, None, None, {})
        )
        self.assertEqual(
            notes, ["the field at 30.0 degrees: at its chief ray optiland raised RuntimeError: no chief ray"]
        )
        # A chief ray that did not land: the angle is said, the landing is not, and a lost rim ray has no spread.
        lost = StandIn(settled(5.0), probes={5.0: FieldProbe(5.0, None, 1, 3, None)})
        field, _ = self.entry(lost, 5.0)
        self.assertEqual((field["fieldAngleDeg"], field["imageHeightMm"]), (5.0, None))
        self.assertEqual((field["sampling"]["rimRaysLit"], field["sampling"]["rimRaysLost"]), (1.0, 3.0))
        self.assertNotIn("rimLandingSpreadMm", field["sampling"])

    def test_curves_that_are_none_are_a_status_with_the_reason_whichever_step_has_none(self) -> None:
        nan_axis = straight(256, 0.25)
        broken = StepCurves(
            256, 512, (0.0, *([math.nan] * 255)), nan_axis.sagittal_axis, nan_axis.tangential, nan_axis.sagittal, 4.0
        )
        field, notes = self.entry(StandIn({(0.0, 128): straight(128, 0.5), (0.0, 256): broken}))
        self.assertEqual((field["status"], field["reason"]), ("unavailable", "no-frequency-axis"))
        self.assertEqual(notes, ["the field at 0.0 degrees: no-frequency-axis at 256 rays"])
        self.assertNotIn("frequencyStepTangentialPerMm", field["sampling"], "a NaN is no number of an answer")
        self.assertEqual(field["sampling"]["frequencyStepSagittalPerMm"], 0.25)

        # 32 samples a quarter cycle apart end at 7.75 cycles/mm: the frequencies asked lie beyond.
        short = {(0.0, 128): straight(16, 0.5), (0.0, 256): straight(32, 0.25)}
        field, _ = self.entry(StandIn(short))
        self.assertEqual((field["status"], field["reason"]), ("unavailable", "frequency-beyond-axis"))
        self.assertTrue(all(math.isnan(value) for value in f8(field["sagittal"])))

        # The coarser step has no curve and the finer has: nothing says the finer settled.
        coarse = StepCurves(128, 256, *([(0.0, *([math.nan] * 127))] * 2), *([straight(128, 0.5).tangential] * 2), 4.0)
        field, notes = self.entry(StandIn({(0.0, 128): coarse, (0.0, 256): straight(256, 0.25)}))
        self.assertEqual((field["status"], field["reason"]), ("unconverged", "convergence-unknown"))
        self.assertEqual(f8(field["tangential"]), STRAIGHT_AT_ASKED)
        self.assertNotIn("maxDelta", field["sampling"])
        self.assertIn("no-frequency-axis at 128 rays", notes[0])

    def test_what_is_no_fields_status_is_raised(self) -> None:
        for error in (BuildMismatch("surface 3: radius differs"), MemoryError(), ModuleNotFoundError("optiland.mtf")):
            with self.assertRaises(type(error)):
                self.entry(StandIn({(0.0, 128): error}))
            with self.assertRaises(type(error)):
                self.entry(StandIn({}, probes={0.0: error}))


def notes_of(angle: float, moved: float) -> list[str]:
    steps = {(angle, 128): straight(128, 0.5), (angle, 256): straight(256, 0.25, lowered=moved)}
    return answer_field(ASKED, DOUBLE_GAUSS, angle, StandIn(steps))[1]


class Clock:
    """A clock that is ``step`` seconds further each time a field has been answered."""

    def __init__(self, measure: StandIn, step: float) -> None:
        self._measure = measure
        self._step = step

    def __call__(self) -> float:
        return self._step * sum(1 for asked in self._measure.asked if asked[0] == "field")


class AnswerTest(unittest.TestCase):
    def test_a_field_that_fails_changes_nothing_of_the_fields_beside_it(self) -> None:
        steps = {**settled(0.0, 10.0), (40.0, 128): ValueError("No valid ray samples found for chief-ray wavefront.")}
        three = MtfRequest(ASKED.frequencies, (0.0, 40.0, 10.0), 0, (128, 256))
        data, seconds = answer_mtf(three, DOUBLE_GAUSS, StandIn(steps))
        self.assertEqual([field["status"] for field in data["fields"]], ["ok", "unavailable", "ok"])
        self.assertEqual(len(seconds), 3)
        self.assertEqual(validate(contract_schemas(), quantity_schema_id("mtf.native", "data"), data), [])
        two = MtfRequest(ASKED.frequencies, (0.0, 10.0), 0, (128, 256))
        alone, _ = answer_mtf(two, DOUBLE_GAUSS, StandIn(settled(0.0, 10.0)))
        self.assertEqual([data["fields"][0], data["fields"][2]], alone["fields"])
        self.assertEqual(len(data["notes"]), 1)
        self.assertEqual(alone["notes"], [])

    def test_the_answer_states_its_method_its_plane_its_aperture_and_the_one_line_it_is_of(self) -> None:
        case = two_lines(DOUBLE_GAUSS, 486.1327, 0.5)
        measure = StandIn({(0.0, rays): straight(rays, 64.0 / rays) for rays in (256, 512)})
        asked = MtfRequest(ASKED.frequencies, (0.0,), 1, (256, 512))
        data, _ = answer_mtf(asked, case, measure)
        self.assertEqual(
            measure.asked, [("aperture", 1), ("field", 1, 0.0), ("step", 1, 0.0, 256), ("step", 1, 0.0, 512)]
        )
        self.assertEqual(data["lines"], [{"wavelengthNm": 486.1327, "weight": 0.5}])
        self.assertEqual(data["focus"], {"mode": "design", "appliedShiftMm": 0})
        self.assertEqual(data["aperture"], {"tracedFNumber": 4.0, "limitingSurfaceIndex": 1.0})
        self.assertEqual(data["notes"], ["of line 1 of the case alone, 486.1327 nm: no polychromatic MTF"])
        self.assertEqual(data["method"]["name"], "scalar-fft-mtf")
        self.assertEqual(
            data["method"]["params"],
            {
                "class": "ScalarFFTMTF",
                "numRays": [256, 512],
                "gridFactor": 2,
                "line": 1,
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
        )
        self.assertEqual(data["fields"][0]["sampling"]["numRays"], 512.0)
        self.assertEqual(validate(contract_schemas(), quantity_schema_id("mtf.native", "data"), data), [])

    def test_a_request_over_its_budget_is_given_up_between_two_fields(self) -> None:
        angles = (0.0, 1.0, 2.0, 3.0)
        asked = MtfRequest(ASKED.frequencies, angles, 0, (128, 256))
        measure = StandIn(settled(*angles))
        # Each field takes 200 s: the third is begun at 400 s, which is over the budget.
        self.assertEqual(REQUEST_BUDGET_S, 300.0)
        with self.assertRaisesRegex(mtf.TimeBudgetExceeded, "had taken 400 s when field 2 of 4 was to be begun"):
            answer_mtf(asked, DOUBLE_GAUSS, measure, Clock(measure, 200.0))
        self.assertEqual([entry[2] for entry in measure.asked if entry[0] == "field"], [0.0, 1.0])
        within = StandIn(settled(*angles))
        data, seconds = answer_mtf(asked, DOUBLE_GAUSS, within, Clock(within, 100.0))
        self.assertEqual((len(data["fields"]), seconds), (4, [100.0] * 4))


class EngineTest(unittest.TestCase):
    """The engine's ``run`` of an MTF, with a stand-in where optiland would be asked."""

    def engine(self, measure: StandIn, **more: Any) -> tuple[OptilandEngine, list[str]]:
        log: list[str] = []
        return OptilandEngine(IDENTITY, mtf=measure, log=log.append, **more), log

    def test_an_answer_is_a_valid_result_whose_log_line_holds_the_time_and_whose_data_holds_none(self) -> None:
        measure = StandIn({**settled(0.0), (20.0, 128): ValueError("no rays")})
        engine, log = self.engine(measure)
        result = engine.run(mtf_request(DOUBLE_GAUSS, mtf_spec([0, 20])), DOUBLE_GAUSS)
        self.assertEqual(validate_kind("result", result), [])
        self.assertEqual(result["status"], "ok", result.get("error"))
        self.assertEqual(result["method"], result["data"]["method"])
        counts = {"surfaces": 11, "lines": 1, "fields": 2, "ok": 1, "unconverged": 0, "unavailable": 1}
        self.assertEqual(result["diagnostics"], {"warnings": [], "counts": counts})
        self.assertEqual(f8(result["data"]["fields"][0]["tangential"]), [0.84375, 0.53125, 0.21875])
        self.assertEqual(len(log), 1)
        self.assertRegex(
            log[0],
            r"^lvrtc_optiland: mtf\.native fields=2 ok=1 unconverged=0 unavailable=1 surfaces=11 rays=128,256 "
            r"field_ms=\d+,\d+ request_ms=\d+( peak_mib=\S+)? pid=\d+$",
        )
        self.assertNotIn("_ms", repr(result))

    def test_a_spec_that_is_none_is_an_error_and_what_has_no_answer_is_unsupported_before_optiland_is_asked(
        self,
    ) -> None:
        measure = StandIn({})
        engine, log = self.engine(measure)
        for spec, said in (
            (mtf_spec([0], [30, 10]), "/frequenciesPerMm/1 [invariant] the frequencies must ascend: 10 follows 30"),
            (mtf_spec([95]), "/fields"),
            ({"frequenciesPerMm": [10]}, "[required]"),
        ):
            answered = engine.run(mtf_request(DOUBLE_GAUSS, spec), DOUBLE_GAUSS)
            self.assertEqual(validate_kind("result", answered), [])
            self.assertEqual((answered["status"], answered["error"]["code"]), ("error", "bad-spec"), spec)
            self.assertIn("spec is not a mtf.native spec: ", answered["error"]["message"])
            self.assertIn(said, answered["error"]["message"])
        several = two_lines(DOUBLE_GAUSS, 486.1327, 0.5)
        for case, spec, options, items in (
            (several, mtf_spec([0]), {}, ["lines.polychromatic"]),
            (DOUBLE_GAUSS, mtf_spec([0], method="geometric"), {"fftRays": 64}, ["method.geometric", "option.fftRays"]),
        ):
            refused = engine.run(mtf_request(case, spec, **options), case)
            self.assertEqual(validate_kind("result", refused), [])
            self.assertEqual(refused["status"], "unsupported")
            self.assertEqual([item["item"] for item in refused["unsupported"]], items)
        self.assertEqual((measure.asked, log), ([], []))

    def test_an_optic_that_is_not_the_case_and_a_request_over_its_budget_are_errors_of_the_request(self) -> None:
        measure = StandIn(settled(0.0))
        measure.aperture_outcome = BuildMismatch("surface 2 (3): radius is 1.0 in the optic optiland built")
        engine, _ = self.engine(measure)
        answered = engine.run(mtf_request(DOUBLE_GAUSS, mtf_spec([0])), DOUBLE_GAUSS)
        self.assertEqual(validate_kind("result", answered), [])
        self.assertEqual(answered["error"]["code"], "build-mismatch")
        self.assertIn("surface 2 (3): radius", answered["error"]["message"])
        self.assertNotIn("data", answered)

        slow = StandIn(settled(0.0, 1.0, 2.0))
        engine, _ = self.engine(slow, clock=Clock(slow, 301.0))
        answered = engine.run(mtf_request(DOUBLE_GAUSS, mtf_spec([0, 1, 2])), DOUBLE_GAUSS)
        self.assertEqual(validate_kind("result", answered), [])
        self.assertEqual((answered["status"], answered["error"]["code"]), ("error", "time-budget"))
        self.assertIn("ask fewer fields at once", answered["error"]["message"])

    def test_an_option_reaches_the_ladder_and_the_line(self) -> None:
        case = two_lines(DOUBLE_GAUSS, 486.1327, 0.5)
        measure = StandIn({(0.0, rays): straight(rays, 64.0 / rays) for rays in (256, 512)})
        engine, _ = self.engine(measure)
        result = engine.run(mtf_request(case, mtf_spec([0]), fftRays=512, line=1), case)
        self.assertEqual(result["status"], "ok", result.get("error"))
        self.assertEqual(measure.asked[-2:], [("step", 1, 0.0, 256), ("step", 1, 0.0, 512)])
        self.assertEqual(result["data"]["method"]["params"]["numRays"], [256, 512])


# ── On the real optiland ─────────────────────────────────────────────────────────────────────────────────────────

STOP = 5
"""The stop of the Double-Gauss fixture, whose clip radius is 6.35 mm and whose stop radius is 6.3412 mm."""

FREQUENCIES = [0, 10, 30, 50]


def exact_axial_rim_ray(case: dict[str, Any]) -> tuple[float, float]:
    """The sine of the angle the axial ray through the rim of the stop leaves the lens at, and its height at launch.

    By the 60-digit trace of ``exact.py``, bisecting on the height at which a ray along the axis is still carried
    to the image: the highest such ray is the one through the rim of whichever surface bounds the beam, and the
    test that calls this holds that surface to be the stop.
    """
    passes, blocked = 0.0, float(case["system"]["surfaces"][0]["aperture"]["semiDiameter"])
    for _ in range(80):
        middle = (passes + blocked) / 2
        if exact_trace(case, (0.0, middle, -10.0), (0.0, 0.0, 1.0)).status == STATUS_OK:
            passes = middle
        else:
            blocked = middle
    ray = exact_trace(case, (0.0, passes, -10.0), (0.0, 0.0, 1.0))
    assert ray.direction is not None
    length = sum(part * part for part in ray.direction).sqrt()
    return float(abs(ray.direction[1]) / length), passes


def field_direction(angle_deg: float) -> tuple[float, float, float]:
    """The direction of the rays of the contract's field at an angle: an object toward +y, so (0, -sin, cos)."""
    radians = math.radians(angle_deg)
    return (0.0, -math.sin(radians), math.cos(radians))


def launched(case: dict[str, Any], angle_deg: float, height: float) -> Exact:
    """The ray of a field launched in the meridian at ``height``, 20 mm in front of the lens, traced in 60 digits."""
    return exact_trace(case, (0.0, height, -20.0), field_direction(angle_deg))


def reaching(case: dict[str, Any], angle_deg: float) -> list[float]:
    """The whole launch heights, mm, whose rays of a field get past the stop."""
    return [float(height) for height in range(-40, 41) if len(launched(case, angle_deg, height).hits) > STOP]


def exact_chief_landing(case: dict[str, Any], angle_deg: float) -> float:
    """How far from the axis the ray of a field through the centre of the stop lands, by the 60-digit trace.

    The height of the launch is found by the secant rule on the ray's height at the stop.
    """

    def at_stop(height: float) -> Decimal:
        return launched(case, angle_deg, height).hits[STOP][1]

    before, after = reaching(case, angle_deg)[:2]
    for _ in range(60):
        f_before, f_after = at_stop(before), at_stop(after)
        if abs(f_after) < Decimal("1e-28") or f_after == f_before:
            break
        before, after = after, after - float(f_after * (Decimal(after) - Decimal(before)) / (f_after - f_before))
    ray = launched(case, angle_deg, after)
    assert ray.image is not None and abs(ray.hits[STOP][1]) < Decimal("1e-12")
    return float(abs(ray.image[1]))


def exact_meridional_width(case: dict[str, Any], angle_deg: float) -> float:
    """The width of a field's beam along y in direction cosines behind the lens, by the 60-digit trace.

    The two rays in the meridian through the edge of the stop are found by bisection on the launch height, between
    a ray that gets past the stop and one the stop itself ends: the last ray on the inside is on the edge to a
    rounding of the height. Both must then pass every surface behind the stop, or the beam is not the stop's.
    """
    inside = reaching(case, angle_deg)
    cosines = []
    for passes, step in ((inside[-1], 1.0), (inside[0], -1.0)):
        blocked = passes + step
        assert launched(case, angle_deg, blocked).end == STOP, "the stop bounds the beam in the meridian"
        for _ in range(80):
            middle = (passes + blocked) / 2
            if len(launched(case, angle_deg, middle).hits) > STOP:
                passes = middle
            else:
                blocked = middle
        ray = launched(case, angle_deg, passes)
        assert ray.status == STATUS_OK and ray.direction is not None, "a ray on the edge of the stop reaches the image"
        cosines.append(ray.direction[1] / sum(part * part for part in ray.direction).sqrt())
    return float(abs(cosines[0] - cosines[1]))


def exact_spot_mtf(case: dict[str, Any], angle_deg: float, frequency: float) -> tuple[float, float]:
    """The geometric MTF of a field at one frequency, along y and along x, of rays traced in 60 digits.

    The rays are a lattice of 41 by 41 across the front of the lens, 1.5 mm apart, in the direction of the
    contract's field; those the lens passes are the beam, some 140 of them. The modulus of the mean of
    ``exp(-2 pi i nu u)`` over their landings is the binless estimate: a quadrature of the spot, coarse, and of no
    diffraction.
    """
    direction = field_direction(angle_deg)
    lift = 20.0 * math.tan(math.radians(angle_deg))
    landings = []
    for row in range(41):
        for column in range(41):
            ray = exact_trace(case, (-30.0 + 1.5 * column, -30.0 + 1.5 * row + lift, -20.0), direction)
            if ray.status == STATUS_OK and ray.image is not None:
                landings.append((float(ray.image[0]), float(ray.image[1])))
    assert len(landings) > 100, len(landings)
    turn = -2.0 * math.pi * frequency
    along_x = abs(sum(complex(math.cos(turn * x), math.sin(turn * x)) for x, _ in landings)) / len(landings)
    along_y = abs(sum(complex(math.cos(turn * y), math.sin(turn * y)) for _, y in landings)) / len(landings)
    return along_y, along_x


@unittest.skipIf(MISSING is not None, MISSING)
class RealMtfTest(unittest.TestCase):
    """optiland's FFT MTF of its own Double-Gauss, through the engine."""

    engine: OptilandEngine
    answer: dict[str, Any]
    fields: dict[float, dict[str, Any]]

    @classmethod
    def setUpClass(cls) -> None:
        cls.engine = OptilandEngine(IDENTITY)
        # The axis, two fields inside the image and one the lens does not pass.
        cls.answer = cls.ask([0, 10, 14, 40])
        cls.fields = {field["field"]: field for field in cls.answer["data"]["fields"]}

    @classmethod
    def ask(cls, angles: list[float], case: dict[str, Any] = DOUBLE_GAUSS, **options: Any) -> dict[str, Any]:
        result = cls.engine.run(mtf_request(case, mtf_spec(angles, FREQUENCIES), **options), case)
        issues = validate_kind("result", result)
        assert issues == [], format_issues(issues)
        return result

    def test_the_answer_is_a_valid_result_and_says_what_became_of_each_field(self) -> None:
        self.assertEqual(self.answer["status"], "ok", self.answer.get("error"))
        statuses = [(field["field"], field["status"], field.get("reason")) for field in self.answer["data"]["fields"]]
        self.assertEqual(statuses[:3], [(0, "ok", None), (10, "ok", None), (14, "ok", None)])
        self.assertEqual(statuses[3][:2], (40, "unavailable"))
        self.assertRegex(statuses[3][2], r"^optiland-raised-\w+$")
        counts = self.answer["diagnostics"]["counts"]
        self.assertEqual(counts, {"surfaces": 11, "lines": 1, "fields": 4, "ok": 3, "unconverged": 0, "unavailable": 1})
        self.assertEqual(self.answer["data"]["lines"], [{"wavelengthNm": 587.5618, "weight": 1}])
        for field in self.answer["data"]["fields"][:3]:
            for cut in ("tangential", "sagittal"):
                values = f8(field[cut])
                self.assertEqual(values[0], 1.0, "the MTF at no frequency is 1")
                self.assertTrue(all(0.0 <= value <= 1.0 for value in values))
                self.assertTrue(all(later <= 1.0 for later in values[1:]))
            self.assertEqual(field["fieldAngleDeg"], field["field"])
            self.assertEqual((field["sampling"]["numRays"], field["sampling"]["gridSize"]), (256.0, 512.0))
            self.assertEqual(field["sampling"]["optilandWarnings"], 0.0)

    def test_on_the_axis_the_two_cuts_are_one_curve_and_the_chief_ray_lands_on_the_axis(self) -> None:
        axis = self.fields[0]
        for tangential, sagittal in zip(f8(axis["tangential"]), f8(axis["sagittal"]), strict=True):
            self.assertAlmostEqual(tangential, sagittal, delta=1e-9)
        self.assertLessEqual(axis["imageHeightMm"], 1e-9)
        self.assertEqual(
            axis["sampling"]["frequencyStepTangentialPerMm"], axis["sampling"]["frequencyStepSagittalPerMm"]
        )

    def test_the_frequency_axis_is_that_of_the_ray_through_the_rim_of_the_stop_traced_exactly(self) -> None:
        # The cut-off of a pupil is the width of the beam in direction cosines over the wavelength: on the axis
        # twice the sine of the marginal ray's angle. optiland lays 256 rays across the pupil, so its lag of one
        # ray is that over 255. The marginal ray is traced here, in 60 digits, and it is the stop that bounds it.
        sine, height = exact_axial_rim_ray(DOUBLE_GAUSS)
        rim = exact_trace(DOUBLE_GAUSS, (0.0, height, -10.0), (0.0, 0.0, 1.0)).hits[STOP]
        clip = DOUBLE_GAUSS["system"]["surfaces"][STOP]["aperture"]["semiDiameter"]
        self.assertAlmostEqual(float(rim[1]), clip, delta=1e-12)
        cutoff = 2.0 * sine / (587.5618e-6)
        sampling = self.fields[0]["sampling"]
        self.assertAlmostEqual(sampling["frequencyStepTangentialPerMm"] * 255, cutoff, delta=1e-7 * cutoff)
        aperture = self.answer["data"]["aperture"]
        self.assertAlmostEqual(aperture["tracedFNumber"], 1.0 / (2.0 * sine), delta=1e-8)
        self.assertEqual(sampling["workingFNumber"], aperture["tracedFNumber"])
        # The pupil is the stop out to its clip radius, not the stop radius of the case, which is the paraxial
        # pupils': the two differ in this fixture, and optiland's aimed rays fill the first.
        self.assertEqual((aperture["aimedStopRadiusMm"], aperture["limitingSurfaceIndex"]), (clip, float(STOP)))
        self.assertLess(DOUBLE_GAUSS["conditions"]["stopSemiDiameter"], clip)
        # Without aiming, optiland's pupil coordinate 1 is the rim of its paraxial entrance pupil: another ray, and
        # another f-number, than the stop's.
        from lvrtc_optiland.build import build_case  # noqa: PLC0415

        (plain,) = build_case(DOUBLE_GAUSS).optics
        unaimed = float(mtf.mtf_api().get_working_FNO(plain, (0.0, 0.0), plain.primary_wavelength))
        self.assertGreater(abs(unaimed - 1.0 / (2.0 * sine)), 0.005)

    def test_a_surface_that_stops_the_axial_rim_rays_is_named_and_the_f_number_stays_the_stops(self) -> None:
        # The axial ray launched 6 mm from the axis, inside the beam, is above 4 mm at every surface in front of the
        # stop and above 3.8 mm at the eighth, traced here: an aperture of 4 mm in front, or of 3.5 mm behind, stops
        # the ray through the rim of the stop, which is higher still. optiland's f-number is of that ray all the same.
        inner = exact_trace(DOUBLE_GAUSS, (0.0, 6.0, -10.0), (0.0, 0.0, 1.0))
        self.assertEqual(inner.status, STATUS_OK)
        stops = self.answer["data"]["aperture"]["tracedFNumber"]
        for at, radius in ((0, 4.0), (2, 4.0), (8, 3.5)):
            self.assertGreater(float(inner.hits[at][1]), radius)
            narrowed = copy.deepcopy(DOUBLE_GAUSS)
            narrowed["system"]["surfaces"][at]["aperture"]["semiDiameter"] = radius
            aperture, notes = mtf.OptilandMtf().aperture(narrowed, 0)
            self.assertEqual((aperture["limitingSurfaceIndex"], notes), (float(at), []))
            self.assertEqual(aperture["tracedFNumber"], stops)

    def test_off_the_axis_the_tangential_axis_is_that_of_the_two_rim_rays_in_the_meridian_traced_exactly(self) -> None:
        # The width of the pupil along y in direction cosines, on a flat image, is the difference of the y cosines
        # of the rays through the top and the bottom of the stop, both traced here. The sagittal width is another,
        # so the two cuts are not confused.
        width = exact_meridional_width(DOUBLE_GAUSS, 10.0)
        sampling = self.fields[10]["sampling"]
        self.assertAlmostEqual(sampling["frequencyStepTangentialPerMm"] * 255, width / 587.5618e-6, delta=1e-4)
        apart = abs(sampling["frequencyStepTangentialPerMm"] - sampling["frequencyStepSagittalPerMm"]) * 255
        self.assertGreater(apart, 1.0, "the two cuts have axes of their own, a cycle/mm apart at the cut-off")

    def test_off_the_axis_each_cut_is_the_cut_of_its_name_by_the_spot_of_rays_traced_exactly(self) -> None:
        # At 10 degrees the lens is aberrated by many waves, and at 10 cycles/mm, a thirtieth of its cut-off, its
        # MTF is that of the spot of its rays to a few hundredths. The spot is traced here: it is wider along x, so
        # the cut along y, the tangential one, is the higher by more than a quarter, and optiland's two curves are
        # each the one of its name.
        tangential, sagittal = exact_spot_mtf(DOUBLE_GAUSS, 10.0, 10.0)
        self.assertGreater(tangential - sagittal, 0.25)
        field = self.fields[10]
        self.assertAlmostEqual(f8(field["tangential"])[1], tangential, delta=0.05)
        self.assertAlmostEqual(f8(field["sagittal"])[1], sagittal, delta=0.05)

    def test_the_diffraction_limit_of_the_traced_aperture_bounds_the_mtf_on_the_axis(self) -> None:
        # No pupil function of modulus 1 on a set of cells has an autocorrelation above that of the set itself.
        # optiland's pupil is the cells of its 256 by 256 grid inside the unit circle, every one lit on the axis of
        # this lens, so the bound at a lag is a count of cells; a lag is a frequency by the exact marginal ray.
        import numpy as np  # noqa: PLC0415

        rays = 256
        grid = np.linspace(-1.0, 1.0, rays)
        inside = (grid[None, :] ** 2 + grid[:, None] ** 2) <= 1.0
        limit = [1.0] + [
            float(np.count_nonzero(inside[:, lag:] & inside[:, :-lag])) / inside.sum() for lag in range(1, rays)
        ]
        sine, _ = exact_axial_rim_ray(DOUBLE_GAUSS)
        step = 2.0 * sine / 587.5618e-6 / (rays - 1)
        measured = f8(self.fields[0]["tangential"])
        for frequency, value in zip(FREQUENCIES, measured, strict=True):
            bound = interpolate([lag * step for lag in range(rays)], limit, float(frequency))
            assert bound is not None
            self.assertLessEqual(value, bound + 1e-8, frequency)
            # The count is the textbook limit of a circular pupil to the coarseness of the cells.
            ratio = frequency / (step * (rays - 1))
            textbook = (2.0 / math.pi) * (math.acos(ratio) - ratio * math.sqrt(1.0 - ratio * ratio))
            self.assertAlmostEqual(bound, textbook, delta=0.01)
        # The lens is no perfect one: at 30 cycles/mm it is well below its limit, and not at 0.
        self.assertLess(measured[2], 0.75)

    def test_the_chief_ray_lands_where_the_ray_through_the_centre_of_the_stop_does_traced_exactly(self) -> None:
        for angle in (10, 14):
            expected = exact_chief_landing(DOUBLE_GAUSS, float(angle))
            self.assertAlmostEqual(self.fields[angle]["imageHeightMm"], expected, delta=1e-8)
        self.assertGreater(self.fields[14]["imageHeightMm"], self.fields[10]["imageHeightMm"])
        # A field at the mirrored angle is the mirrored field: the same curves and the same distance.
        mirrored = self.ask([-10])["data"]["fields"][0]
        self.assertEqual(mirrored["fieldAngleDeg"], -10)
        self.assertAlmostEqual(mirrored["imageHeightMm"], self.fields[10]["imageHeightMm"], delta=1e-9)
        for cut in ("tangential", "sagittal"):
            for ours, theirs in zip(f8(mirrored[cut]), f8(self.fields[10][cut]), strict=True):
                self.assertAlmostEqual(ours, theirs, delta=1e-6)

    def test_the_axis_settles_between_128_and_256_rays_and_512_is_asked_only_by_the_option(self) -> None:
        axis = self.fields[0]
        self.assertEqual((axis["status"], axis["sampling"]["coarseNumRays"]), ("ok", 128.0))
        self.assertLessEqual(axis["sampling"]["maxDelta"], CONVERGENCE_ON_AXIS)
        finer = self.ask([0], fftRays=512)["data"]
        (again,) = finer["fields"]
        self.assertEqual(finer["method"]["params"]["numRays"], [256, 512])
        self.assertEqual((again["sampling"]["numRays"], again["sampling"]["coarseNumRays"]), (512.0, 256.0))
        # A step is computed on an optic of its own, so the 256 rays of this ladder are the 256 of the other: what
        # the finer answer says it moved by is the difference of the two answers.
        moved = max(
            abs(fine - coarse)
            for cut in ("tangential", "sagittal")
            for fine, coarse in zip(f8(again[cut]), f8(axis[cut]), strict=True)
        )
        self.assertEqual(again["sampling"]["maxDelta"], moved)
        self.assertLessEqual(moved, CONVERGENCE_ON_AXIS)
        self.assertEqual(again["status"], "ok")
        self.assertAlmostEqual(
            again["sampling"]["frequencyStepTangentialPerMm"] * 511,
            axis["sampling"]["frequencyStepTangentialPerMm"] * 255,
            delta=1e-6,
        )

    def test_a_field_optiland_cannot_compute_is_a_row_and_the_fields_beside_it_are_what_they_are_alone(self) -> None:
        lost = self.fields[40]
        self.assertTrue(all(math.isnan(value) for value in f8(lost["tangential"]) + f8(lost["sagittal"])))
        self.assertEqual(lost["sampling"]["rimRaysLit"], 0.0)
        noted = [note for note in self.answer["data"]["notes"] if note.startswith("the field at 40.0 degrees: ")]
        self.assertEqual(len(noted), 1, self.answer["data"]["notes"])
        self.assertIn("optiland raised", noted[0])
        alone = self.ask([0, 10])["data"]["fields"]
        self.assertEqual(alone, [self.fields[0], self.fields[10]])
        # optiland itself computes every field of a call before it gives any: asked for the axis and the field it
        # cannot compute at once, it raises, and the axis is lost with it.
        optic = mtf.field_optic(DOUBLE_GAUSS, 0, 40.0)
        optic.fields.add(y=0.0)
        with self.assertRaises(ValueError):
            mtf.mtf_api().ScalarFFTMTF(optic, fields="all", num_rays=128, grid_size=256)

    def test_a_line_of_a_case_of_several_is_the_mtf_of_that_line_alone(self) -> None:
        blue = 486.1327
        several = two_lines(DOUBLE_GAUSS, blue, 0.5)
        only = copy.deepcopy(DOUBLE_GAUSS)
        only["conditions"]["lines"][0].update(wavelengthNm=blue, weight=0.5)
        asked = self.ask([0, 10], several, line=1)
        alone = self.ask([0, 10], only)
        self.assertEqual(asked["data"]["fields"], alone["data"]["fields"])
        self.assertEqual(asked["data"]["lines"], [{"wavelengthNm": blue, "weight": 0.5}])
        self.assertEqual(self.ask([0], several)["status"], "unsupported")
        # The indices of the two lines are the same, so the rays are: the lag of one ray is a frequency by the
        # wavelength alone.
        ratio = (
            asked["data"]["fields"][0]["sampling"]["frequencyStepTangentialPerMm"]
            / self.fields[0]["sampling"]["frequencyStepTangentialPerMm"]
        )
        self.assertAlmostEqual(ratio, 587.5618 / blue, delta=1e-9)

    def test_optiland_calibrates_its_axes_with_rim_rays_that_carry_no_light(self) -> None:
        # At 14 degrees every ray through the rim of the stop is stopped by another aperture, and optiland traces
        # it on and takes its direction for the width of the pupil: the field has curves and both steps.
        outer = self.fields[14]
        self.assertEqual(
            (outer["status"], outer["sampling"]["rimRaysLit"], outer["sampling"]["rimRaysLost"]), ("ok", 0.0, 0.0)
        )
        self.assertGreater(outer["sampling"]["frequencyStepTangentialPerMm"], 0.0)
        self.assertLess(outer["sampling"]["rimLandingSpreadMm"], 0.1)
        # On the axis every rim ray arrives; one that lies on the very edge of the stop may be clipped there by a
        # rounding, so how many are lit is not held to four.
        self.assertEqual(self.fields[0]["sampling"]["rimRaysLost"], 0.0)


@unittest.skipIf(MISSING is not None, MISSING)
class RealReadBackTest(unittest.TestCase):
    """What the worker adds to a built optic for an MTF, read back; each mistake is made on purpose."""

    def optic(self, angle: float = 10.0) -> Any:
        return mtf.field_optic(DOUBLE_GAUSS, 0, angle)

    def refused(self, optic: Any, said: str, angle: float = 10.0) -> None:
        with self.assertRaisesRegex(BuildMismatch, said):
            mtf.verify_field(optic, DOUBLE_GAUSS, angle)

    def test_the_field_is_the_one_asked_and_any_other_is_named(self) -> None:
        mtf.verify_field(self.optic(), DOUBLE_GAUSS, 10.0)
        mtf.verify_field(self.optic(0.0), DOUBLE_GAUSS, 0.0)
        self.refused(self.optic(), r"the field angle along y, degrees is 10\.0 .* and 12\.0 asked", angle=12.0)
        second = self.optic()
        second.fields.add(y=0.0)
        self.refused(second, "the number of fields is 2")
        vignetted = self.optic()
        vignetted.fields.fields[0].vy = 0.25
        self.refused(vignetted, r"the vignetting factors is \(0\.0, 0\.25\)")
        along_x = self.optic()
        along_x.fields.fields[0].x = 1.0
        self.refused(along_x, "the field angle along x")
        heights = self.optic()
        heights.fields.set_type("object_height")
        self.refused(heights, "the type of the field is 'ObjectHeightField'")
        telecentric = self.optic()
        telecentric.fields.set_telecentric(True)
        self.refused(telecentric, "telecentric is True")

    def test_a_weight_another_normalised_field_an_apodization_and_a_polarization_are_named(self) -> None:
        weighted = self.optic()
        weighted.fields.fields[0].weight = 0.5
        self.refused(weighted, r"the weight is 0\.5 .* and 1\.0 asked")
        # The coordinate an analysis is asked with is the one field's own: optiland divides by the largest field.
        elsewhere = self.optic()
        elsewhere.fields.get_field_coords = lambda: [(0.0, 0.5)]
        self.refused(elsewhere, r"the normalised field is \[\(0\.0, 0\.5\)\] .* and \[\(0\.0, 1\.0\)\] asked")
        apodized = self.optic()
        apodized.apodization = "gaussian"
        self.refused(apodized, "the apodization is 'gaussian'")
        polarized = self.optic()
        with mock.patch.object(type(polarized), "polarization_state", new_callable=mock.PropertyMock) as state:
            state.return_value = "ignore"
            self.refused(polarized, "the polarization is 'ignore'")

    def test_a_chief_ray_that_lands_on_another_plane_than_the_cases_is_named(self) -> None:
        # The probe is told a case whose image plane lies a micrometre behind the one the optic was built with.
        moved = copy.deepcopy(DOUBLE_GAUSS)
        moved["conditions"]["imageZ"] += 1e-3
        with self.assertRaisesRegex(BuildMismatch, "the z of the chief ray's landing, mm"):
            mtf.probe_field(self.optic(), moved, 10.0)

    def test_an_analysis_that_says_it_computed_with_anything_else_than_was_asked_is_no_answer(self) -> None:
        tools = mtf.mtf_api()

        def saying(**changed: Any) -> Any:
            """optiland's class, whose analysis says of itself what ``changed`` states instead of what it holds."""

            def made(optic: Any, **keywords: Any) -> Any:
                analysis = tools.ScalarFFTMTF(optic, **keywords)
                for name, value in changed.items():
                    setattr(analysis, name, value(getattr(analysis, name)) if callable(value) else value)
                return analysis

            return types.SimpleNamespace(ScalarFFTMTF=made)

        for changed, said in (
            ({"grid_size": 128}, "grid_size is 128 in what optiland computed and 256 asked"),
            ({"resolved_wavelength": 0.55}, "the wavelength in µm is 0.55 "),
            ({"resolved_fields": [(0.0, 0.5)]}, r"the field is \[\(0\.0, 0\.5\)\] "),
            ({"strategy": "centroid_sphere"}, "the reference strategy is 'centroid_sphere'"),
            ({"remove_tilt": True}, "remove_tilt is True"),
            ({"mtf": lambda curves: curves * 2}, "the number of fields with curves is 2"),
            ({"freq_tang": lambda axes: [axes[0][:-1]]}, "the length of freq_tang is 127 .* and 128 asked"),
            ({"freq_sag": lambda axes: [axes[0][:-1]]}, "the length of freq_sag is 127"),
            ({"mtf": lambda curves: [[curves[0][0][:-1], curves[0][1]]]}, "the length of the tangential curve is 127"),
            ({"mtf": lambda curves: [[curves[0][0], curves[0][1][:-1]]]}, "the length of the sagittal curve is 127"),
        ):
            with self.assertRaisesRegex(BuildMismatch, f"the FFT MTF: {said}"):
                mtf.fft_step(self.optic(), 10.0, 128, tools=saying(**changed))  # type: ignore[arg-type]

    def test_the_aiming_and_the_stop_it_aims_at_are_the_workers_and_any_other_is_named(self) -> None:
        optic = self.optic()
        self.assertEqual(optic.ray_tracer.ray_aiming_config, {"mode": "robust", "max_iter": 50, "tol": 1e-10})
        paraxial = self.optic()
        paraxial.ray_tracer.set_aiming("paraxial")
        self.refused(paraxial, "the ray aiming is .*'paraxial'")
        loose = self.optic()
        loose.ray_tracer.set_aiming("robust")
        self.refused(loose, "the ray aiming is .*1e-06")
        from lvrtc_optiland.build import optiland_api  # noqa: PLC0415

        wider = self.optic()
        wider.surfaces[STOP + 1].aperture = optiland_api().RadialAperture(r_max=7.0)
        self.refused(wider, r"the radius of the stop the rays are aimed at, mm is 7\.0 .* and 6\.35 asked")

    def test_the_chief_ray_is_launched_in_the_direction_of_the_angle_which_is_optilands_mirror_of_the_contracts(
        self,
    ) -> None:
        optic = self.optic()
        launch = optic.ray_tracer.ray_generator.generate_rays(0.0, 1.0, 0.0, 0.0, optic.primary_wavelength)
        # optiland's positive angle sends its rays toward +y, from an object toward -y; the contract's positive
        # angle is an object toward +y. The probe holds the direction to optiland's.
        self.assertAlmostEqual(float(launch.M[0]), math.sin(math.radians(10.0)), delta=1e-15)
        self.assertEqual(float(launch.L[0]), 0.0)
        probe = mtf.probe_field(self.optic(), DOUBLE_GAUSS, 10.0)
        self.assertEqual(probe.angle_deg, 10.0)
        # An optic whose field is another angle than the one the probe is told: a field given in radians, say.
        with self.assertRaisesRegex(BuildMismatch, "the direction the chief ray is launched in"):
            mtf.probe_field(self.optic(math.radians(10.0)), DOUBLE_GAUSS, 10.0)
        paraxial = self.optic()
        paraxial.ray_tracer.set_aiming("paraxial")
        with self.assertRaisesRegex(BuildMismatch, "the aimer that launched the chief ray is 'ParaxialRayAimer'"):
            mtf.probe_field(paraxial, DOUBLE_GAUSS, 10.0)

    def test_an_analysis_of_another_sampling_than_the_one_asked_is_no_answer(self) -> None:
        tools = mtf.mtf_api()
        # optiland takes a num_rays without a grid size for OpticStudio's sampling number: 64 rays across the
        # pupil for 128. The worker states the grid, and would be told here if optiland took it otherwise.
        emulated = tools.ScalarFFTMTF(self.optic(0.0), fields=[(0.0, 0.0)], num_rays=128)
        self.assertEqual((int(emulated.num_rays), int(emulated.grid_size)), (64, 256))

        def remapped(optic: Any, **keywords: Any) -> Any:
            keywords.pop("grid_size")
            return tools.ScalarFFTMTF(optic, **keywords)

        stand_in = types.SimpleNamespace(ScalarFFTMTF=remapped)
        with self.assertRaisesRegex(
            BuildMismatch, "the FFT MTF: num_rays is 64 in what optiland computed and 128 asked"
        ):
            mtf.fft_step(self.optic(0.0), 0.0, 128, tools=stand_in)  # type: ignore[arg-type]
        step = mtf.fft_step(self.optic(0.0), 0.0, 128)
        self.assertEqual(
            (step.num_rays, step.grid_size, len(step.tangential), len(step.sagittal_axis)), (128, 256, 128, 128)
        )
        self.assertEqual((step.tangential[0], step.tangential_axis[0]), (1.0, 0.0))
        # The last sample is the cut-off: the pupil's autocorrelation ends there.
        self.assertLess(step.tangential[-1], 1e-12)


if __name__ == "__main__":
    unittest.main()

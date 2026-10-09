"""What the tests of traced rays share: an answer of the engine with its arrays decoded, and what it is held to.

``TracedRays`` is a test case without a test, for the classes of ``test_trace.py`` and ``test_path.py`` to build
on: it asks the engine for ``rays.trace``, holds the answer to the quantity's schema and to the contract's rule of
where a ray has numbers and where NaN, and compares numbers of an answer with values a test derived, in 60-digit
decimal arithmetic. Nothing here imports optiland: rays go in through the engine.
"""

from __future__ import annotations

import dataclasses
import math
import unittest
from decimal import Decimal
from typing import Any

from lvrtc_optiland.engine import OptilandEngine
from lvrtc_optiland.trace import RAYS_TRACE, STATUS_BLOCKED, STATUS_FAILED, STATUS_OK
from lvrtc_worker_kit.ndarray import decode_ndarray
from lvrtc_worker_kit.validate import contract_schemas, format_issues, quantity_schema_id, validate, validate_kind

from .exact import Point, exact_trace
from .support import f8, ray_spec, trace_request

IDENTITY: dict[str, Any] = {
    "id": "optiland",
    "version": "0.0.0+test",
    "fingerprint": "f" * 64,
    "adapterRevision": "a" * 64,
    "details": {"jit": True},
}

AXIS: Point = (0.0, 0.0, 1.0)


def unit(x: float, y: float, z: float) -> Point:
    """The direction of a vector, as doubles: a unit vector to a rounding, which is what a spec asks."""
    length = math.sqrt(x * x + y * y + z * z)
    return (x / length, y / length, z / length)


@dataclasses.dataclass(frozen=True)
class Answer:
    """A ``rays.trace`` answer with its arrays decoded: n rays through S surfaces."""

    status: list[int]
    end: list[int]
    hits: list[list[Point]]
    """``hits[surface][ray]``."""
    exit_point: list[Point]
    exit_direction: list[Point]
    image: list[Point]
    path: list[float]
    path_image: list[float]
    result: dict[str, Any]


def triples(values: list[float]) -> list[Point]:
    return [(values[at], values[at + 1], values[at + 2]) for at in range(0, len(values), 3)]


def is_nan(point: Point) -> bool:
    return all(math.isnan(value) for value in point)


def is_finite(point: Point) -> bool:
    return all(math.isfinite(value) for value in point)


class TracedRays(unittest.TestCase):
    """Given rays through the engine: the answer, and what it is held to. It has no test of its own."""

    def answer(self, case: dict[str, Any], origins: list[Point], directions: list[Point], line: int = 0) -> Answer:
        """Asks the engine, and holds the answer to the quantity's schema and to its rule of numbers and NaN."""
        result = OptilandEngine(IDENTITY).run(trace_request(case, ray_spec(origins, directions, line=line)), case)
        self.assertEqual(validate_kind("result", result), [])
        self.assertEqual(result["status"], "ok", result.get("error"))
        data = result["data"]
        issues = validate(contract_schemas(), quantity_schema_id(RAYS_TRACE, "data"), data)
        self.assertEqual(issues, [], format_issues(issues))
        rays, surfaces = len(origins), len(case["system"]["surfaces"])
        self.assertEqual(data["hits"]["$nd"]["shape"], [surfaces, rays, 3])
        every_hit = triples(f8(data["hits"]))
        answer = Answer(
            status=decode_ndarray(data["status"]).values(),
            end=decode_ndarray(data["endSurface"]).values(),
            hits=[every_hit[surface * rays : (surface + 1) * rays] for surface in range(surfaces)],
            exit_point=triples(f8(data["exitPoint"])),
            exit_direction=triples(f8(data["exitDirection"])),
            image=triples(f8(data["imagePoint"])),
            path=f8(data["opticalPath"]),
            path_image=f8(data["opticalPathToImage"]),
            result=result,
        )
        self.assert_numbers_up_to_where_each_ray_ended(answer, surfaces)
        return answer

    def assert_numbers_up_to_where_each_ray_ended(self, answer: Answer, surfaces: int) -> None:
        """The contract's rule: a number in every member of a ray that is ok, and NaN from where any other ended."""
        for ray, status in enumerate(answer.status):
            end = answer.end[ray]
            self.assertIn(status, (STATUS_OK, STATUS_BLOCKED, STATUS_FAILED))
            self.assertEqual(end == -1, status == STATUS_OK, ray)
            reached = surfaces if status == STATUS_OK else end
            self.assertTrue(0 <= reached <= surfaces, ray)
            for number in range(surfaces):
                hit = answer.hits[number][ray]
                self.assertTrue(is_finite(hit) if number < reached else is_nan(hit), (ray, number, hit))
            left = reached == surfaces
            self.assertTrue(is_finite(answer.exit_point[ray]) if left else is_nan(answer.exit_point[ray]), ray)
            self.assertTrue(is_finite(answer.exit_direction[ray]) if left else is_nan(answer.exit_direction[ray]), ray)
            self.assertEqual(math.isfinite(answer.path[ray]), left, ray)
            self.assertEqual(math.isnan(answer.path[ray]), not left, ray)
            landed = status == STATUS_OK
            self.assertTrue(is_finite(answer.image[ray]) if landed else is_nan(answer.image[ray]), ray)
            self.assertEqual(math.isfinite(answer.path_image[ray]), landed, ray)
            if left:
                self.assertEqual(answer.exit_point[ray], answer.hits[surfaces - 1][ray], "the exit point is that hit")

    def assert_near(self, actual: Point | float, expected: Any, within: float, said: Any = None) -> None:
        got = actual if isinstance(actual, tuple) else (actual,)
        wanted = expected if isinstance(expected, tuple) else (expected,)
        self.assertEqual(len(got), len(wanted), said)
        for value, target in zip(got, wanted, strict=True):
            self.assertTrue(math.isfinite(value), (said, got))
            self.assertLessEqual(abs(Decimal(value) - Decimal(target)), Decimal(within), (said, got, wanted))

    def assert_is_the_exact_trace(
        self, case: dict[str, Any], answer: Answer, origins: list[Point], directions: list[Point], within: float
    ) -> None:
        """Every ray of an answer against the trace in 60 digits: where it ended, and each number it has.

        ``within`` is in mm for a point and a path; a direction is held ten times as closely.
        """
        for ray, (origin, direction) in enumerate(zip(origins, directions, strict=True)):
            exact = exact_trace(case, origin, direction)
            self.assertEqual((answer.status[ray], answer.end[ray]), (exact.status, exact.end), ray)
            for number, hit in enumerate(exact.hits):
                self.assert_near(answer.hits[number][ray], hit, within, (ray, number))
            if exact.direction is not None and len(exact.hits) == len(answer.hits):
                self.assert_near(answer.exit_direction[ray], exact.direction, within / 10, ray)
                self.assert_near(answer.path[ray], exact.path, within, ray)
            if exact.image is not None:
                self.assert_near(answer.image[ray], exact.image, within, ray)
                self.assert_near(answer.path_image[ray], exact.path_image, within, ray)

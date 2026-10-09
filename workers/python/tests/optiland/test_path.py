"""The optical path of ``rays.trace`` as optiland has it: what its ``opd`` is made of, what the worker makes of it,
and what an answer's two paths are held to.

Everything here runs on the real optiland and skips, with the reason, under an interpreter that has none
(``npm run test:optiland``). Nothing imports optiland: rays go in through the engine or through
``lvrtc_optiland.trace``.

Every expected value is derived here from the optics, and never taken from an engine: the closed form of a plate,
the equal paths of the two Cartesian conics and of the aplanatic points of a sphere, a lens of two spheres traced
by hand, angle by angle, a step backwards by its closed form, and beside them the contract's own trace in 60-digit
decimal arithmetic (``exact.exact_trace``), whose path is index times the length of each stretch.

The contract's path (contract/CONTRACT.md, ``rays.trace``) is the sum of index times length from a ray's own
origin to its hit on the last surface of the case, a rear plate among its surfaces like any other, and from there
to the image plane in the index after the last surface. A stretch that runs backwards counts with its sign.
"""

from __future__ import annotations

import math
import random
import unittest
from decimal import Decimal, getcontext
from typing import Any

from lvrtc_optiland import trace
from lvrtc_optiland.build import BuildMismatch, build_case, build_optic, optiland_api, verify_optic
from lvrtc_optiland.trace import OPTICAL_PATH_RULE, STATUS_OK

from .exact import Point, exact_sag, exact_trace
from .support import D_LINE, PLANE, asphere, make_case, real_optiland_missing, sphere, surface
from .traced import AXIS, TracedRays, unit

MISSING = real_optiland_missing()
getcontext().prec = 60

WAVE_MM = D_LINE * 1e-6
"""The wavelength of a synthetic case's line, mm: what a path is divided by to be a number of waves."""

GATE_WAVES = 2e-5
"""The gate of rung R3 (``policy/rungs.v1.json``), restated to say what a figure of these tests would mean there."""

AGREEMENT_WAVES = 1e-7
"""How closely rung R3 asks another engine to agree with the arbiter before a floor is granted, restated likewise."""


def decimal_length(vector: Point) -> Decimal:
    """The length of a vector of doubles, in 60 digits."""
    return sum((Decimal(part) ** 2 for part in vector), Decimal(0)).sqrt()


def distance(a: Point, b: Point) -> Decimal:
    """The distance between two points of doubles, in 60 digits."""
    return sum(((Decimal(p) - Decimal(q)) ** 2 for p, q in zip(a, b, strict=True)), Decimal(0)).sqrt()


# ── What optiland's ``opd`` holds, read where optiland records it ────────────────────────────────────────────────


@unittest.skipIf(MISSING is not None, MISSING)
class PathSourceTest(TracedRays):
    """optiland's own rows: where a path starts, what a stretch adds, and which medium it is charged to."""

    def points(self, rows: trace.Rows, ray: int) -> list[Point]:
        """The point optiland recorded of a ray on each row: its origin, each surface, the image surface."""
        return [
            (float(rows.x[row, ray]), float(rows.y[row, ray]), float(rows.z[row, ray])) for row in range(len(rows.x))
        ]

    def test_a_path_is_0_at_the_rays_own_origin_and_the_way_to_the_first_surface_is_in_air(self) -> None:
        np = optiland_api().np
        case = make_case([surface(0.0, PLANE), surface(6.0, PLANE)])
        optic = build_case(case).optics[0]
        d = unit(0.3, -0.1, 1.0)
        near: Point = (1.0, -2.0, -5.0)
        # The same line, entered 7 mm earlier: an origin is where a ray's path is 0, so this ray's is 7 mm longer
        # on every surface, in air of index 1.
        far: Point = (near[0] - 7.0 * d[0], near[1] - 7.0 * d[1], near[2] - 7.0 * d[2])
        rows = trace.record(optic, np.array([near, far]), np.array([d, d]))
        self.assertEqual(rows.opd[0].tolist(), [0.0, 0.0])
        # A plane is met by one division, and 0 plus that step times an index of 1 is the step: to the bit.
        self.assertEqual(float(rows.opd[1, 0]), 5.0 / d[2])
        longer = Decimal(7) * decimal_length(d)
        for row in (1, 2, 3):
            apart = Decimal(float(rows.opd[row, 1])) - Decimal(float(rows.opd[row, 0]))
            self.assertLessEqual(abs(apart - longer), 5e-14, row)
        # The object surface of the optic stands at minus infinity, and no path is counted from there.
        self.assertEqual(float(optic.surfaces[0].geometry.cs.z), -math.inf)

    def test_a_stretch_is_charged_to_the_medium_in_front_of_its_surface_and_a_refraction_adds_nothing(self) -> None:
        api = optiland_api()
        np = api.np
        # Three media that differ, and an image space that is none of them and is not air.
        indices = [1.7, 1.3, 1.6]
        lens = [surface(0.0, sphere(40.0), 9.0), surface(5.0, sphere(-60.0), 9.0), surface(8.0, PLANE, 9.0)]
        case = make_case(lens, indices=[indices])
        optic = build_case(case).optics[0]
        origins = np.array([(0.0, 0.0, -4.0), (3.0, -5.0, -4.0), (-6.0, 2.0, -4.0)])
        directions = np.array([AXIS, unit(-0.05, 0.1, 1.0), unit(0.12, -0.03, 1.0)])
        rows = trace.record(optic, origins, directions)
        self.assertTrue(bool(np.all(rows.intensity > 0)))
        # The index in front of each row of optiland: air, then the case's index after the surface before; the
        # last row is the image surface, which is reached in the index after the last surface of the case.
        in_front = [1.0, *indices]
        for ray in range(3):
            points = self.points(rows, ray)
            for row in range(1, 5):
                stretch = Decimal(float(rows.opd[row, ray])) - Decimal(float(rows.opd[row - 1, ray]))
                expected = Decimal(in_front[row - 1]) * distance(points[row - 1], points[row])
                self.assertLessEqual(abs(stretch - expected), 2e-14, (ray, row))
        # The answer is those sums: on the last surface of the case, and on the image surface.
        settled = trace.settle(optic, rows)
        self.assertEqual(settled.status.tolist(), [STATUS_OK] * 3)
        for ray in range(3):
            self.assertAlmostEqual(float(settled.optical_path[ray]), float(rows.opd[3, ray]), delta=1e-14)
            self.assertAlmostEqual(float(settled.optical_path_to_image[ray]), float(rows.opd[4, ray]), delta=3e-14)

        # What the image surface itself states takes no part in a path: with that surface in air, where the case's
        # image space has an index of 1.6, optiland adds the same stretch, bit for bit. Such an optic is not the
        # case all the same, and is refused before a ray is traced: optiland's first-order data reads that medium.
        optic.surfaces[4].material_post = api.IdealMaterial(n=1.0)
        again = trace.record(optic, origins, directions)
        self.assertEqual(again.opd.tobytes(), rows.opd.tobytes())
        with self.assertRaises(BuildMismatch) as raised:
            verify_optic(optic, case, 0)
        self.assertIn(
            "the image surface: the index of the image space is 1.0 in the optic optiland built and 1.6",
            str(raised.exception),
        )

    def test_a_link_to_another_surface_charges_a_stretch_to_another_medium_and_is_refused(self) -> None:
        np = optiland_api().np
        # optiland finds the medium in front of a surface through a link to the surface before it. With the rear
        # face of a plate linked to the object surface, the way through the glass is counted in air: 6 mm for 9.
        case = make_case([surface(0.0, PLANE), surface(6.0, PLANE)])
        optic = build_optic(case, 0)
        verify_optic(optic, case, 0)
        along_the_axis = (np.array([(0.0, 0.0, -5.0)]), np.array([AXIS]))
        rows = trace.record(optic, *along_the_axis)
        for summed, expected in zip(rows.opd[:, 0].tolist(), [0.0, 5.0, 5.0 + 1.5 * 6.0, 14.0 + 25.0], strict=True):
            self.assertAlmostEqual(summed, expected, delta=1e-14)
        optic.surfaces[2].previous_surface = optic.surfaces[0]
        rows = trace.record(optic, *along_the_axis)
        for summed, expected in zip(rows.opd[:, 0].tolist(), [0.0, 5.0, 5.0 + 6.0, 11.0 + 25.0], strict=True):
            self.assertAlmostEqual(summed, expected, delta=1e-14)
        with self.assertRaises(BuildMismatch) as raised:
            verify_optic(optic, case, 0)
        self.assertIn(
            "surface 1 (2): the index in front of it is 1.0 in the optic optiland built and 1.5", str(raised.exception)
        )


# ── A step is not a length: what the worker makes of optiland's sum ──────────────────────────────────────────────


@unittest.skipIf(MISSING is not None, MISSING)
class PathLengthTest(TracedRays):
    """``length_excess`` and ``path_lengths``: optiland's steps as the lengths the contract counts."""

    def test_the_excess_of_a_directions_length_is_found_where_the_plain_expression_has_lost_it(self) -> None:
        np = optiland_api().np
        drawn = random.Random(25)
        units = [unit(drawn.uniform(-1, 1), drawn.uniform(-1, 1), drawn.uniform(0.05, 1)) for _ in range(300)]
        units += [AXIS, (0.6, 0.0, 0.8), (0.0, -0.28, 0.96)]
        scales = (1.0, 1.0 + 2.0**-52, 1.0 - 2.0**-45, 1.0 + 2.0**-41, 1.0 + 1e-12, 1.0 - 1e-12)
        vectors = [(scale * x, scale * y, scale * z) for scale in scales for x, y, z in units]
        columns = np.array(vectors, dtype=np.float64).T
        excess = trace.length_excess(np, columns[0], columns[1], columns[2])
        plain = np.sqrt(columns[0] * columns[0] + columns[1] * columns[1] + columns[2] * columns[2]) - 1.0
        lost = 0
        for at, vector in enumerate(vectors):
            exact = decimal_length(vector) - 1
            # The quotient of a number that is exact before it is rounded: right to a few units of its own last place,
            # or of the last place of the five remainders it is the sum of, which are below 1e-16 each.
            self.assertLessEqual(
                abs(Decimal(float(excess[at])) - exact), abs(exact) * Decimal(1e-15) + Decimal(1e-31), vector
            )
            if at < len(units):
                # A direction as a spec gives it: the nearest doubles to a unit vector, some 2e-16 from one at most.
                self.assertLess(abs(exact), Decimal(3e-16))
                lost += abs(Decimal(float(plain[at])) - exact) > abs(exact) / 2
        # The plain expression knows 1 to a rounding of 1, which is the size of what is asked: it is 0 or a few
        # units in the last place of 1, and more than half off for most such directions.
        self.assertGreater(lost, len(units) // 2)
        self.assertLessEqual(len(np.unique(plain[: len(units)])), 5)
        # Along the axis nothing rounds.
        self.assertEqual(float(excess[300]), 0.0)
        # A direction that is no number has an excess that is none.
        self.assertTrue(
            math.isnan(float(trace.length_excess(np, np.array([math.nan]), np.array([0.0]), np.array([1.0]))[0]))
        )

    def test_the_way_to_the_first_surface_is_its_length_to_a_unit_of_its_last_place_which_no_plain_excess_gives(
        self,
    ) -> None:
        np = optiland_api().np
        # One point 20 m in front of a plane, and 500 directions as doubles hold them: each a unit vector to a
        # rounding, some 1e-16 long or short. The way to the plane is in air, so optiland's sum on it is its step,
        # one division, and the path is that step times the length of the direction: on a stretch of 20 m, a
        # rounding of 1 in that length is a unit in the last place of the path.
        far = 20000.0
        case = make_case([surface(0.0, PLANE, 5000.0)], object_z=-far)
        optic = build_case(case).optics[0]
        drawn = random.Random(5)
        directions = [unit(drawn.uniform(-0.15, 0.15), drawn.uniform(-0.15, 0.15), 1.0) for _ in range(500)]
        rows = trace.record(optic, np.array([(0.0, 0.0, -far)] * len(directions)), np.array(directions))
        self.assertTrue(bool(np.all(rows.intensity[1] > 0)))
        lengths = trace.path_lengths(rows)
        # The same stretch times a length that was formed in doubles: 1 to a rounding of 1, and no closer.
        plainly = rows.opd[1] + rows.opd[1] * (np.sqrt(rows.L[0] ** 2 + rows.M[0] ** 2 + rows.N[0] ** 2) - 1.0)
        beyond = {"optiland's own sum": 0, "a length formed in doubles": 0}
        for ray, direction in enumerate(directions):
            # The distance from the point to the plane along the line, in 60 digits.
            truth = Decimal(far) * decimal_length(direction) / Decimal(direction[2])
            last_place = Decimal(math.ulp(float(truth)))
            # Half a unit is the rounding of optiland's division and half that of the one addition made here: the
            # excess of the length is exact, so nothing else of the answer rounds.
            off = abs(Decimal(float(lengths[1, ray])) - truth)
            self.assertLessEqual(off, last_place * Decimal("1.000001"), (ray, direction))
            beyond["optiland's own sum"] += abs(Decimal(float(rows.opd[1, ray])) - truth) > last_place
            beyond["a length formed in doubles"] += abs(Decimal(float(plainly[ray])) - truth) > last_place
        # Either of the two is more than a unit off for some twenty of the 500, and up to one and a half.
        self.assertGreater(beyond["optiland's own sum"], 10)
        self.assertGreater(beyond["a length formed in doubles"], 10)

    def test_along_the_axis_of_a_plate_optilands_own_direction_is_short_of_a_unit_vector_and_its_step_too_long(
        self,
    ) -> None:
        np = optiland_api().np
        # Into glass of index 1.5 optiland refracts the direction (0, 0, 1) to u + 1 - u with u = 1 / 1.5, which is
        # 1 less a rounding as doubles add it. The 6 mm of glass are then a step of 6.000000000000001, and optiland's
        # sum on the rear face is 14.000000000000002 where the path is 5 + 1.5 x 6. As a length the stretch is 6 mm.
        case = make_case([surface(0.0, PLANE), surface(6.0, PLANE)])
        optic = build_case(case).optics[0]
        rows = trace.record(optic, np.array([(0.0, 0.0, -5.0)]), np.array([AXIS]))
        self.assertEqual(float(rows.N[1, 0]), math.nextafter(1.0, 0.0))
        self.assertEqual(float(rows.opd[2, 0]), math.nextafter(14.0, 15.0))
        lengths = trace.path_lengths(rows)
        self.assertEqual(lengths[:3, 0].tolist(), [0.0, 5.0, 14.0])
        self.assertEqual(lengths.shape, rows.opd.shape)
        settled = trace.settle(optic, rows)
        self.assertEqual(float(settled.optical_path[0]), 14.0)
        self.assertAlmostEqual(float(settled.optical_path_to_image[0]), 39.0, delta=1e-14)

    def test_a_direction_longer_than_a_unit_vector_takes_shorter_steps_and_the_answer_is_the_length_all_the_same(
        self,
    ) -> None:
        np = optiland_api().np
        # A plate 16 m from where the rays start, as the far end of a long lens's focus range puts an object.
        thickness, n, far = 6.0, 1.5, 16000.0
        case = make_case([surface(0.0, PLANE, 400.0), surface(thickness, PLANE, 400.0)], object_z=-far)
        origin: Point = (0.0, 320.0, -far)
        aimed = unit(3.0, -318.0, far)
        # The same direction 4.5e-13 longer: inside the 1e-12 a spec may be off a unit vector by.
        longer = 1.0 + 2.0**-41
        stretched: Point = (aimed[0] * longer, aimed[1] * longer, aimed[2] * longer)
        self.assertLess(abs(decimal_length(stretched) - 1), Decimal(trace.DIRECTION_NORM_TOLERANCE) / 2)

        def closed_form(direction: Point) -> tuple[Decimal, Decimal]:
            """The contract's two paths through the plate along a direction of any length, in 60 digits."""
            length = decimal_length(direction)
            cosine = Decimal(direction[2]) / length
            inside = (1 - (1 - cosine * cosine) / Decimal(n) ** 2).sqrt()
            to_last = Decimal(far) / cosine + Decimal(n) * Decimal(thickness) / inside
            return to_last, to_last + (Decimal(case["conditions"]["imageZ"]) - Decimal(thickness)) / cosine

        optic = build_case(case).optics[0]
        for direction in (aimed, stretched):
            excess = decimal_length(direction) - 1
            to_last, to_image = closed_form(direction)
            exact = exact_trace(case, origin, direction)
            assert exact.path is not None and exact.path_image is not None
            self.assertLess(abs(exact.path - to_last), Decimal(1e-40))
            self.assertLess(abs(exact.path_image - to_image), Decimal(1e-40))
            # optiland's own sum is of steps: the way to the plate is one division by the direction's z, which is
            # longer by what the direction is longer, so the step is shorter by it. 7.3e-9 mm of 16 m here.
            rows = trace.record(optic, np.array([origin]), np.array([direction]))
            step = Decimal(far) / Decimal(direction[2])
            self.assertLessEqual(abs(Decimal(float(rows.opd[1, 0])) - step), 2e-12)
            # In the glass the direction optiland refracted is longer by excess / n^2, over 9 mm of path.
            in_glass = (
                (to_last - Decimal(far) / (Decimal(direction[2]) / decimal_length(direction)))
                * excess
                / Decimal(n) ** 2
            )
            short = to_last - Decimal(float(rows.opd[2, 0]))
            self.assertLessEqual(abs(short - step * excess - in_glass), Decimal(4e-12), direction)
            # The answer is the contract's path, to a rounding of 16 m, whichever of the two the ray was given with:
            # the plate is met 1.1 degrees off its axis, where what optiland's refraction makes of the longer
            # direction (the next test) is 4e-16 mm, far below a rounding of that path.
            answer = self.answer(case, [origin], [direction])
            self.assertEqual(answer.status, [STATUS_OK])
            self.assert_near(answer.path[0], to_last, 4e-12, direction)
            self.assert_near(answer.path_image[0], to_image, 4e-12, direction)
            self.assertEqual(answer.result["method"]["params"]["opticalPath"], OPTICAL_PATH_RULE)
        # What was made of optiland's sum for the longer direction: 1.2e-5 waves, most of the gate of R3, where the
        # unit vector's own is within a rounding of the path.
        self.assertTrue(1e-5 < float(step * excess) / WAVE_MM < GATE_WAVES)

    def test_a_direction_longer_than_a_unit_vector_is_bent_as_if_its_sine_were_longer_and_the_path_is_that_rays(
        self,
    ) -> None:
        # What the lengths do not make good: the ray. optiland refracts by the vector form of Snell's law on the
        # direction it holds, taken for a unit vector (RealRays.refract). At a plane across the axis that makes of
        # (0, dy, dz) the vector (0, dy / n, sqrt(1 - (1 - dz^2) / n^2)): its sine of incidence is dy, where the
        # sine of the ray is dy / |d|. So a direction e longer than a unit vector is bent as if it met the plane
        # e more steeply by its sine, and the ray in the glass is another ray than the one the contract bends by
        # Snell's law on the line. The plate above is met 1.1 degrees off its axis and is 6 mm thick, and nothing
        # of it shows there; here the ray leans 30 degrees and the glass is 100 mm thick.
        thickness, n, lean = 100.0, 1.5, 30.0
        case = make_case([surface(0.0, PLANE, 200.0), surface(thickness, PLANE, 200.0)])
        image_z = case["conditions"]["imageZ"]
        origin: Point = (0.0, 0.0, -5.0)
        aimed = unit(0.0, math.tan(math.radians(lean)), 1.0)
        longer = 1.0 + 2.0**-41
        stretched: Point = (aimed[0] * longer, aimed[1] * longer, aimed[2] * longer)
        costs: list[tuple[Decimal, Decimal]] = []
        for direction in (aimed, stretched):
            dy, dz, length = Decimal(direction[1]), Decimal(direction[2]), decimal_length(direction)
            # The contract's ray in the glass: n sin(r) = sin(i), with the sine of the line.
            sine = dy / length / Decimal(n)
            slope = sine / (1 - sine * sine).sqrt()
            # optiland's: the tangent of the vector its refraction makes of the direction as it holds it.
            bent = (dy / Decimal(n)) / (1 - (1 - dz * dz) / Decimal(n) ** 2).sqrt()
            # The way to the plate is the same for both: 5 mm along the axis, in air.
            first = Decimal(5) * dy / dz
            in_air = Decimal(5) * length / dz
            to_last = in_air + Decimal(n) * Decimal(thickness) * (1 + slope * slope).sqrt()
            exact = exact_trace(case, origin, direction)
            assert exact.path is not None
            self.assertLess(abs(exact.hits[1][1] - (first + Decimal(thickness) * slope)), Decimal(1e-40))
            self.assertLess(abs(exact.path - to_last), Decimal(1e-40))

            answer = self.answer(case, [origin], [direction])
            self.assertEqual(answer.status, [STATUS_OK])
            # optiland's hit on the rear face is where its own vector leads, to a rounding.
            self.assert_near(answer.hits[1][0], (0, first + Decimal(thickness) * bent, thickness), 3e-14, direction)
            # And the answer's path is index times length along that ray: the worker makes steps lengths, and
            # makes no ray another ray. Out of the glass optiland's vector is the direction it was given with
            # again, (0, dy, dz), so the ray leaves parallel to the contract's.
            along_bent = in_air + Decimal(n) * Decimal(thickness) * (1 + bent * bent).sqrt()
            self.assert_near(answer.path[0], along_bent, 6e-14, direction)
            self.assert_near(
                answer.path_image[0], along_bent + (Decimal(image_z) - Decimal(thickness)) * length / dz, 8e-14
            )
            costs.append((Decimal(thickness) * (bent - slope), along_bent - to_last))
        # As a spec gives a direction, a unit vector to a rounding, the two rays are one to a rounding.
        self.assertLess(abs(costs[0][0]), Decimal(1e-15))
        self.assertLess(abs(costs[0][1]), Decimal(1e-15))
        # 4.5e-13 longer: the hit is 1.0e-11 mm from the contract's and the path 5.0e-12 mm, 8.6e-9 waves. At
        # the 1e-12 a spec may be off by that is 2.2e-11 mm and 1.9e-8 waves: inside what the floor rule asks of
        # a witness on a stretch as steep and as long as this one, and no rounding.
        self.assertTrue(Decimal("0.9e-11") < costs[1][0] < Decimal("1.1e-11"), costs[1])
        self.assertTrue(8e-9 < float(costs[1][1]) / WAVE_MM < 9e-9, costs[1])
        self.assertLess(float(costs[1][1]) / WAVE_MM * (1e-12 / (longer - 1.0)), AGREEMENT_WAVES / 5)

    def test_through_many_surfaces_optilands_directions_drift_from_unit_vectors_and_as_lengths_its_steps_are_the_path(
        self,
    ) -> None:
        np = optiland_api().np
        # Thirty lenses, biconvex and biconcave in turn: sixty spheres. optiland computes each direction from the
        # one before and never makes it a unit vector again, so what each refraction rounds stays in the length of
        # every direction after it, and a step along a direction that is 4e-15 short is 4e-15 too long.
        spheres = []
        for lens in range(30):
            bulge = 90.0 if lens % 2 == 0 else -90.0
            spheres += [surface(7.0 * lens, sphere(bulge), 12.0), surface(7.0 * lens + 4.0, sphere(-bulge), 12.0)]
        count = len(spheres)
        case = make_case(spheres, indices=[[1.8 if number % 2 == 0 else 1.0 for number in range(count)]])
        optic = build_case(case).optics[0]
        drawn = random.Random(7)
        rays = 32
        origins: list[Point] = [(drawn.uniform(-5, 5), drawn.uniform(-5, 5), -5.0) for _ in range(rays)]
        directions = [unit(drawn.uniform(-0.05, 0.05), drawn.uniform(-0.05, 0.05), 1.0) for _ in range(rays)]
        rows = trace.record(optic, np.array(origins), np.array(directions))
        settled = trace.settle(optic, rows)
        self.assertEqual(settled.status.tolist(), [STATUS_OK] * rays)
        excess = np.abs(trace.length_excess(np, rows.L[: count + 1], rows.M[: count + 1], rows.N[: count + 1]))
        # As given, a direction is a unit vector to 2e-16; behind sixty refractions it is one to several 1e-15.
        self.assertLess(float(excess[0].max()), 3e-16)
        self.assertTrue(2e-15 < float(excess.max()) < 2e-14, float(excess.max()))
        # Against the contract's trace in 60 digits, whose path is index times length: the squared error of
        # optiland's own sum, and of the same sum with each step a length, on the last surface and on the image.
        squared = {"sum": [Decimal(0), Decimal(0)], "lengths": [Decimal(0), Decimal(0)]}
        for ray in range(rays):
            exact = exact_trace(case, origins[ray], directions[ray])
            assert exact.path is not None and exact.path_image is not None
            for at, (truth, row) in enumerate(((exact.path, count), (exact.path_image, count + 1))):
                answered = settled.optical_path if at == 0 else settled.optical_path_to_image
                squared["sum"][at] += (Decimal(float(rows.opd[row, ray])) - truth) ** 2
                squared["lengths"][at] += (Decimal(float(answered[ray])) - truth) ** 2
            for number, hit in enumerate(exact.hits):
                self.assert_near(tuple(settled.hits[number, ray].tolist()), hit, 1e-13, (ray, number))
        # In units of the last place of a path of 290 mm, 5.7e-14 mm: optiland's sum is some 4 of them from the
        # truth, by its steps, and as lengths 1.5, which is the rounding of sixty-one additions.
        last_place = Decimal(math.ulp(float(rows.opd[count, 0])))
        for at in (0, 1):
            summed = (squared["sum"][at] / rays).sqrt() / last_place
            as_lengths = (squared["lengths"][at] / rays).sqrt() / last_place
            self.assertTrue(3 < summed < 8, (at, summed))
            self.assertLess(as_lengths, Decimal("0.6") * summed, (at, summed, as_lengths))
            self.assertLess(as_lengths, 3, (at, as_lengths))

    def test_between_unit_vectors_the_answer_is_optilands_own_sum_to_a_rounding_of_it(self) -> None:
        np = optiland_api().np
        front = asphere(30.0, -0.7, (4, 2e-5), (6, -3e-8))
        lens = [surface(0.0, front, 9.0), surface(5.0, sphere(-40.0), 9.0), surface(9.0, sphere(25.0), 9.0)]
        case = make_case([*lens, surface(11.0, PLANE, 9.0)])
        optic = build_case(case).optics[0]
        drawn = random.Random(3)
        count = 400
        origins = np.array([(drawn.uniform(-7, 7), drawn.uniform(-7, 7), -4.0) for _ in range(count)])
        directions = np.array([unit(drawn.uniform(-0.2, 0.2), drawn.uniform(-0.2, 0.2), 1.0) for _ in range(count)])
        rows = trace.record(optic, origins, directions)
        settled = trace.settle(optic, rows)
        landed = settled.status == STATUS_OK
        self.assertGreater(int(np.count_nonzero(landed)), 200)
        # Through four surfaces optiland's directions are still unit vectors to a rounding or two.
        lengths = np.sqrt(rows.L[:5] ** 2 + rows.M[:5] ** 2 + rows.N[:5] ** 2)[:, landed]
        self.assertLess(float(np.abs(lengths - 1.0).max()), 2e-15)
        for answered, row in ((settled.optical_path, 4), (settled.optical_path_to_image, 5)):
            moved = np.abs(answered[landed] - rows.opd[row][landed])
            self.assertLessEqual(float((moved / rows.opd[row][landed]).max()), 1e-15)
            # A path of some 40 mm: a unit of its last place is 7e-15 mm, 1e-11 waves.
            self.assertLess(float(moved.max()) / WAVE_MM, 1e-10)
        # A ray that did not arrive has no path, whatever optiland summed for it.
        self.assertTrue(bool(np.all(np.isnan(settled.optical_path_to_image[~landed]))))
        self.assertTrue(bool(np.all(np.isfinite(rows.opd[5][settled.status != trace.STATUS_FAILED]))))


# ── Closed forms ─────────────────────────────────────────────────────────────────────────────────────────────────


def through_planes(direction: Point, indices: list[float], gaps: list[float]) -> Decimal:
    """Index times length through a stack of parallel plates, in 60 digits.

    A ray keeps ``n sin(a)`` through planes that are perpendicular to the axis, so in a medium of index n it leans
    ``sin(a) / n`` from the axis, and a gap of g along the axis is ``g / cos`` long.
    """
    length = decimal_length(direction)
    sine_squared = 1 - (Decimal(direction[2]) / length) ** 2
    total = Decimal(0)
    for index, gap in zip(indices, gaps, strict=True):
        cosine = (1 - sine_squared / Decimal(index) ** 2).sqrt()
        total += Decimal(index) * Decimal(gap) / cosine
    return total


@unittest.skipIf(MISSING is not None, MISSING)
class AnalyticPathTest(TracedRays):
    """The two paths of an answer, held to what the optics say they are."""

    def test_through_a_plate_the_path_is_the_way_in_air_and_index_times_the_way_in_the_glass_at_each_line(self) -> None:
        thickness = 6.0
        lines = [[1.5, 1.0], [1.62, 1.0]]
        case = make_case([surface(0.0, PLANE), surface(thickness, PLANE)], lines=(D_LINE, 486.1327), indices=lines)
        image_z = case["conditions"]["imageZ"]
        d = unit(0.3, -0.1, 1.0)
        origins: list[Point] = [(1.0, -2.0, -5.0), (0.0, 0.0, -5.0)]
        for line, (glass, _) in enumerate(lines):
            answer = self.answer(case, origins, [d, AXIS], line=line)
            self.assertEqual(answer.status, [STATUS_OK] * 2)
            to_last = through_planes(d, [1.0, glass], [5.0, thickness])
            self.assert_near(answer.path[0], to_last, 1e-14, line)
            self.assert_near(
                answer.path_image[0], to_last + through_planes(d, [1.0], [image_z - thickness]), 2e-14, line
            )
            # Along the axis nothing leans: 5 mm of air, 6 mm of glass and 25 mm of air.
            self.assertAlmostEqual(answer.path[1], 5.0 + glass * thickness, delta=4e-15)
            self.assertAlmostEqual(answer.path_image[1], 5.0 + glass * thickness + (image_z - thickness), delta=1e-14)
        # The glass of the second line is the denser: the same ray is 0.75 mm of path longer through it.
        self.assertGreater(float(through_planes(d, [1.62], [thickness]) - through_planes(d, [1.5], [thickness])), 0.7)

    def test_a_rear_plate_is_a_surface_like_any_other_and_the_image_plane_may_be_its_rear_face(self) -> None:
        # A window and, behind 6 mm of air, a cover glass that the case marks as a rear plate: the last surface of
        # the case is the rear face of that plate, and the path to it runs through the plate's glass.
        gaps = [4.0, 6.0, 1.0]
        media = [1.5, 1.0, 1.52]
        planes = [surface(0.0, PLANE), surface(4.0, PLANE), surface(10.0, PLANE), surface(11.0, PLANE)]
        d = unit(-0.2, 0.25, 1.0)
        origin: Point = (0.5, 1.0, -3.0)
        to_last = through_planes(d, [1.0, *media], [3.0, *gaps])
        behind = make_case([dict(entry) for entry in planes], indices=[[*media, 1.0]], last_lens=1)
        self.assertEqual(behind["system"]["lastLensSurfaceIndex"], 1)
        self.assertEqual([entry.get("synthetic") for entry in behind["system"]["surfaces"]][2:], ["rearPlate"] * 2)
        answer = self.answer(behind, [origin], [d])
        self.assertEqual(answer.status, [STATUS_OK])
        self.assert_near(answer.path[0], to_last, 2e-14)
        image_z = behind["conditions"]["imageZ"]
        self.assert_near(answer.path_image[0], to_last + through_planes(d, [1.0], [image_z - 11.0]), 4e-14)
        # The image plane on the rear face of the plate: the ray lands where it left, and its path ends there.
        on = make_case([dict(entry) for entry in planes], indices=[[*media, 1.0]], last_lens=1, image_z=11.0)
        answer = self.answer(on, [origin], [d])
        self.assertEqual(answer.status, [STATUS_OK])
        self.assert_near(answer.path[0], to_last, 2e-14)
        self.assert_near(answer.path_image[0], to_last, 2e-14)

    def test_the_way_to_the_image_plane_is_in_the_index_after_the_last_surface_which_need_not_be_air(self) -> None:
        # A plate that ends in water, as an immersed sensor would have it: 25 mm of an index of 1.33 behind it.
        thickness, glass, water = 6.0, 1.5, 1.33
        case = make_case([surface(0.0, PLANE), surface(thickness, PLANE)], indices=[[glass, water]])
        behind = case["conditions"]["imageZ"] - thickness
        d = unit(0.25, 0.15, 1.0)
        answer = self.answer(case, [(-1.0, 0.5, -5.0), (0.0, 0.0, -5.0)], [d, AXIS])
        self.assertEqual(answer.status, [STATUS_OK] * 2)
        to_last = through_planes(d, [1.0, glass], [5.0, thickness])
        self.assert_near(answer.path[0], to_last, 1e-14)
        self.assert_near(answer.path_image[0], to_last + through_planes(d, [water], [behind]), 3e-14)
        self.assertAlmostEqual(answer.path_image[1], 5.0 + glass * thickness + water * behind, delta=1e-14)
        # In air the same stretch would be 8 mm of path shorter.
        self.assertGreater(float(through_planes(d, [water], [behind]) - through_planes(d, [1.0], [behind])), 7.9)

    def test_the_cartesian_conics_bring_every_ray_of_a_collimated_beam_to_their_focus_by_one_path(self) -> None:
        n, radius = 1.5, 20.0
        heights = [
            (0.0, 0.0),
            (0.0, 2.0),
            (-5.0, 3.0),
            (7.0, 7.0),
            (0.0, -14.0),
            (12.0, -9.0),
            (-15.0, 0.5),
            (9.0, 12.0),
        ]
        starts: list[Point] = [(x, y, -5.0) for x, y in heights]
        beam = [AXIS] * len(starts)
        chief = 0

        def one_path(answer: Any, expected: float, label: str) -> None:
            self.assertEqual(answer.status, [STATUS_OK] * len(starts), label)
            for ray in range(len(starts)):
                self.assert_near(answer.path_image[ray], expected, 1e-13, (label, ray))
                # What rung R3 calls the path relative to the chief ray's: nothing, on a stigmatic surface.
                relative = Decimal(answer.path_image[chief]) - Decimal(answer.path_image[ray])
                self.assertLess(abs(relative) / Decimal(WAVE_MM), 2e-10, (label, ray))

        # Air into glass: the ellipsoid of conic constant -1/n^2 brings a collimated beam to n R / (n - 1) behind
        # its vertex, and Fermat makes that one path: the ray along the axis has 5 mm of air and n times that way.
        focus = n * radius / (n - 1)
        ellipse = sphere(radius, -1 / n**2)
        ellipsoid = make_case([surface(0.0, ellipse, 16.0)], image_z=focus)
        answer = self.answer(ellipsoid, starts, beam)
        one_path(answer, 5.0 + n * focus, "ellipsoid")
        # To the surface the paths are not one: each ray has its own sag of air in front of it, the contract's.
        for ray, (x, y) in enumerate(heights):
            sag = exact_sag(ellipse, (Decimal(x) ** 2 + Decimal(y) ** 2).sqrt())
            assert sag is not None
            self.assert_near(answer.path[ray], 5 + sag, 1e-14, ray)
        self.assertGreater(answer.path[6] - answer.path[chief], 6.0)

        # Glass into air: behind a plane, the hyperboloid of conic constant -n^2 brings it to |R| / (n - 1) behind
        # its vertex: 5 mm of air, the lens along its axis, and that way in air.
        thickness = 8.0
        behind = radius / (n - 1)
        back = surface(thickness, sphere(-radius, -(n**2)), 16.0)
        hyperboloid = make_case([surface(0.0, PLANE, 16.0), back], image_z=thickness + behind)
        answer = self.answer(hyperboloid, starts, beam)
        one_path(answer, 5.0 + n * thickness + behind, "hyperboloid")
        # The widest ray left the glass 4.9 mm before the vertex of the rear surface, and took the rest in air.
        self.assertLess(answer.hits[1][6][2], thickness - 4.8)

    def test_from_one_wavefront_every_ray_reaches_the_aplanatic_point_of_a_sphere_by_one_path(self) -> None:
        # Rays in air aimed at the point P, n R behind the centre of a sphere of glass, all pass in the glass
        # through the point P', R / n behind the centre, at every aperture; and every point A of the sphere is n
        # times as far from P as from P', so the path of a ray from O is |OA| + n |AP'| = |OA| + |AP| = |OP|.
        # Started 60 mm from P, on a sphere about it, every ray has a path of 60 mm.
        radius, n, away = 20.0, 1.5, 60.0
        aimed_at = radius + n * radius
        meet = radius + radius / n
        case = make_case([surface(0.0, sphere(radius), 19.0)], image_z=meet)
        leans = [(0.0, 0.0), (0.02, 0.0), (0.0, -0.11), (0.15, 0.2), (-0.26, 0.05), (0.2, -0.2), (-0.1, -0.28)]
        directions = [unit(x, y, 1.0) for x, y in leans]
        starts: list[Point] = [(-away * d[0], -away * d[1], aimed_at - away * d[2]) for d in directions]
        self.assertTrue(all(start[2] < -4.0 for start in starts))
        answer = self.answer(case, starts, directions)
        self.assertEqual(answer.status, [STATUS_OK] * len(starts))
        for ray, start in enumerate(starts):
            self.assert_near(answer.image[ray], (0.0, 0.0, meet), 4e-14, ray)
            # The origin is a double, and is 60 mm from P to its rounding: that distance is the path.
            self.assert_near(answer.path_image[ray], distance(start, (0.0, 0.0, aimed_at)), 1e-13, ray)
            self.assertAlmostEqual(answer.path_image[ray], away, delta=1e-13)
            # To the sphere the path is the way in air, |OA|, to the hit optiland has.
            self.assert_near(answer.path[ray], distance(start, answer.hits[0][ray]), 2e-14, ray)
        # The widest of them meets the sphere 13 mm off its axis, where it is 5 mm deep.
        self.assertGreater(max(math.hypot(hit[0], hit[1]) for hit in answer.hits[0]), 13.0)

    def test_a_lens_of_two_spheres_by_hand(self) -> None:
        # A biconvex lens, traced in its meridional plane by the angles alone. A ray that leans U from the axis
        # (toward +y) meets a sphere of centre C and radius r at the angle of incidence I, where the distance of C
        # from the ray's line is r sin(I). On the front sphere, whose centre lies behind it, the hit is seen from
        # C at the angle T = I - U from the axis, at (r sin T, zC - r cos T), and the ray leaves at U' = I' - T
        # with n sin(I) = n' sin(I'). On the rear sphere, whose centre lies in front of it, T = U - I, the hit is
        # (r sin T, zC + r cos T) and U' = T + I'.
        r1, r2, thickness, n = 40.0, 35.0, 6.0, 1.6
        case = make_case([surface(0.0, sphere(r1), 12.0), surface(thickness, sphere(-r2), 12.0)], indices=[[n, 1.0]])
        image_z = case["conditions"]["imageZ"]

        def by_hand(start: tuple[float, float], lean: float) -> tuple[float, float, tuple[float, float]]:
            """The path to the rear sphere, the path to the image plane and the landing (y, z) of a meridional ray."""
            (y, z), u = start, lean
            # The front sphere: its centre at (0, r1).
            offset = (0.0 - y) * math.cos(u) - (r1 - z) * math.sin(u)
            incidence = math.asin(-offset / r1)
            seen = incidence - u
            first = (r1 * math.sin(seen), r1 - r1 * math.cos(seen))
            u = math.asin(math.sin(incidence) / n) - seen
            # The rear sphere: its centre at (0, thickness - r2).
            centre = thickness - r2
            offset = (0.0 - first[0]) * math.cos(u) - (centre - first[1]) * math.sin(u)
            incidence = math.asin(offset / r2)
            seen = u - incidence
            second = (r2 * math.sin(seen), centre + r2 * math.cos(seen))
            u = seen + math.asin(n * math.sin(incidence))
            landing = (second[0] + (image_z - second[1]) * math.tan(u), image_z)
            to_last = math.dist(start, first) + n * math.dist(first, second)
            # Each hit lies on the line it was reached along: the angles were not chased astray.
            self.assertAlmostEqual((first[0] - y) * math.cos(lean) - (first[1] - z) * math.sin(lean), 0.0, delta=1e-13)
            return to_last, to_last + math.dist(second, landing), landing

        rays = [((9.0, -5.0), 0.0), ((-6.0, -10.0), 0.2), ((2.0, -5.0), -0.15), ((0.0, -5.0), 0.0)]
        origins: list[Point] = [(0.0, y, z) for (y, z), _ in rays]
        directions: list[Point] = [(0.0, math.sin(lean), math.cos(lean)) for _, lean in rays]
        answer = self.answer(case, origins, directions)
        self.assertEqual(answer.status, [STATUS_OK] * len(rays))
        for ray, (start, lean) in enumerate(rays):
            to_last, to_image, landing = by_hand(start, lean)
            self.assert_near(answer.path[ray], to_last, 2e-14, ray)
            self.assert_near(answer.path_image[ray], to_image, 4e-14, ray)
            self.assert_near(answer.image[ray], (0.0, *landing), 5e-14, ray)
        # The ray along the axis: 5 mm of air, the lens at its thickest, and the way to the image plane.
        self.assertAlmostEqual(answer.path[3], 5.0 + n * thickness, delta=4e-15)
        self.assertAlmostEqual(answer.path_image[3], 5.0 + n * thickness + (image_z - thickness), delta=1e-14)
        # The ray 9 mm from the axis met the lens a millimetre deep and left it where it is 3.8 mm thick.
        self.assertTrue(1.0 < answer.hits[0][0][2] < 1.1 and answer.hits[1][0][2] - answer.hits[0][0][2] < 3.9)

    def test_a_step_backwards_takes_index_times_its_length_off_the_path(self) -> None:
        # A plane set into the curve of a sphere of radius 10: 4 mm from the axis the sphere is 0.83 mm deep, and
        # the plane, 0.5 mm behind its vertex, lies behind the hit. The ray enters the glass at sin(I) = 0.4, leans
        # I - I' toward the axis in it, and is met with the plane by a step backwards: glass that it never crossed.
        radius, n, height, plane_z = 10.0, 1.5, 4.0, 0.5
        case = make_case([surface(0.0, sphere(radius), 6.0), surface(plane_z, PLANE, 6.0)])
        image_z = case["conditions"]["imageZ"]
        sag = radius - math.sqrt(radius**2 - height**2)
        incidence = math.asin(height / radius)
        lean = incidence - math.asin(math.sin(incidence) / n)
        step = (plane_z - sag) / math.cos(lean)
        self.assertLess(step, -0.33)
        to_last = 5.0 + sag + n * step
        # Out of the plane into air the ray leans n times as steeply, by its sine.
        after = math.asin(n * math.sin(lean))
        to_image = to_last + (image_z - plane_z) / math.cos(after)
        answer = self.answer(case, [(0.0, height, -5.0), (0.0, 1.0, -5.0)], [AXIS, AXIS])
        self.assertEqual(answer.status, [STATUS_OK] * 2)
        self.assert_near(answer.hits[0][0], (0.0, height, sag), 1e-14)
        # Toward the axis going forwards, so away from it going back.
        self.assert_near(answer.hits[1][0], (0.0, height - step * math.sin(lean), plane_z), 1e-14)
        self.assertLess(answer.hits[1][0][2], answer.hits[0][0][2] - 0.33)
        self.assert_near(answer.path[0], to_last, 1e-14)
        self.assert_near(answer.path_image[0], to_image, 2e-14)
        # The path on the plane is half a millimetre shorter than it was on the sphere before it.
        self.assertLess(answer.path[0], 5.0 + sag - 0.5)
        # A ray 1 mm from the axis meets the sphere 0.05 mm deep, in front of the plane, and gains path in the glass.
        shallow = radius - math.sqrt(radius**2 - 1.0)
        self.assertGreater(answer.path[1], 5.0 + shallow + n * 0.44)
        for ray, origin in enumerate([(0.0, height, -5.0), (0.0, 1.0, -5.0)]):
            exact = exact_trace(case, origin, AXIS)
            self.assert_near(answer.path[ray], exact.path, 1e-14, ray)
            self.assert_near(answer.path_image[ray], exact.path_image, 2e-14, ray)


# ── What optiland's arithmetic costs a path (docs/gotchas.md) ────────────────────────────────────────────────────


@unittest.skipIf(MISSING is not None, MISSING)
class PathPrecisionTest(TracedRays):
    """Where optiland's path is off the contract's by its own arithmetic: left as it is, and measured."""

    def worst(self, shape: dict[str, Any], far: float) -> tuple[float, float, float]:
        """The largest error of a first hit, of a path to the image and of a path relative to the first ray's, mm.

        Twenty rays from one point ``far`` mm in front of a lens whose front surface is ``shape``, against the
        contract's trace in 60 digits.
        """
        case = make_case([surface(0.0, shape, 9.0), surface(6.0, sphere(-80.0), 9.0)], object_z=-far)
        start: Point = (0.0, 0.02 * far, -far)
        aims = [(x, y) for x in (-6.0, -2.0, 0.5, 3.0, 6.0) for y in (-6.0, -3.0, 1.0, 5.0)]
        directions = [unit(x, y - start[1], far) for x, y in aims]
        answer = self.answer(case, [start] * len(aims), directions)
        self.assertEqual(answer.status, [STATUS_OK] * len(aims))
        exact = [exact_trace(case, start, direction) for direction in directions]
        hit = path = relative = Decimal(0)
        for ray, truth in enumerate(exact):
            assert truth.path_image is not None and exact[0].path_image is not None
            hit = max(
                hit,
                *(abs(Decimal(got) - wanted) for got, wanted in zip(answer.hits[0][ray], truth.hits[0], strict=True)),
            )
            path = max(path, abs(Decimal(answer.path_image[ray]) - truth.path_image))
            mine = Decimal(answer.path_image[0]) - Decimal(answer.path_image[ray])
            relative = max(relative, abs(mine - (exact[0].path_image - truth.path_image)))
        return float(hit), float(path), float(relative)

    def test_a_conic_met_from_far_away_costs_the_path_half_of_what_it_costs_the_hit(self) -> None:
        # optiland solves a conic from where the ray is, and the hit is off the surface, along the ray, by a
        # rounding of terms that grow with the square of the distance (test_trace.py). The ray is then refracted
        # at that point: it has travelled e further in air and starts e nearer in the glass, along a direction
        # that the surface hardly turned, so its path is off by e (1 - n cos(turn)), half of e in glass of 1.5.
        ball = sphere(30.0)
        # From 2.3 m, where the farthest object of a focus station that LensVisualizer certifies today lies: inside
        # what the floor rule asks of a witness, by a factor of three on a front surface as strongly curved as this
        # one. (LensVisualizer's own rays of a station start on a plane some centimetres in front of the lens; the
        # probe lattice of a case file with a finite object starts at the object point, as these rays do.)
        hit, path, relative = self.worst(ball, 2300.0)
        self.assertLess(hit, 1e-10)
        self.assertLess(max(path, relative) / WAVE_MM, AGREEMENT_WAVES)
        # From 16 m, where a 400 mm lens is focused at 1:40: inside the gate of R3, and no witness any more.
        hit, path, relative = self.worst(ball, 16000.0)
        self.assertTrue(1e-10 < hit < 1e-8, hit)
        self.assertTrue(0.3 < path / hit < 0.7, (path, hit))
        self.assertTrue(AGREEMENT_WAVES < path / WAVE_MM < GATE_WAVES, path)
        self.assertTrue(AGREEMENT_WAVES < relative / WAVE_MM < GATE_WAVES, relative)
        # From 100 m the path alone is beyond the gate.
        hit, path, relative = self.worst(ball, 1e5)
        self.assertTrue(0.3 < path / hit < 0.7, (path, hit))
        self.assertTrue(GATE_WAVES < path / WAVE_MM < 10 * GATE_WAVES, path)
        self.assertGreater(relative / WAVE_MM, GATE_WAVES)

    def test_an_asphere_and_a_plane_are_met_to_a_rounding_of_the_distance_and_so_is_the_sum(self) -> None:
        # An asphere's iteration brings the hit home, and a plane is one division: what is left is the rounding
        # of a path that is as long as the object is far, in a sum that optiland adds up plainly.
        bent = asphere(30.0, -0.5, (4, 1e-5), (6, -2e-8))
        for far in (2300.0, 16000.0, 1e5):
            for shape in (bent, PLANE):
                _, path, relative = self.worst(shape, far)
                # A unit in the last place of the distance is 4.5e-13 mm at 2.3 m and 1.5e-11 mm at 100 m.
                self.assertLess(path, 8 * math.ulp(far), (far, shape["kind"]))
                self.assertLess(relative, 8 * math.ulp(far), (far, shape["kind"]))
                if far < 1e5:
                    # From 16 m such a path is a witness still: 2e-8 waves.
                    self.assertLess(max(path, relative) / WAVE_MM, AGREEMENT_WAVES / 2, (far, shape["kind"]))


if __name__ == "__main__":
    unittest.main()

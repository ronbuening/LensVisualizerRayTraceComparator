"""The contract's trace of one ray in 60-digit decimal arithmetic: what the worker's rays and paths are held to.

Written from the contract alone (contract/CONTRACT.md, "Sag" and ``rays.trace``): Newton's method on the contract's
sag from the surface's vertex plane, the textbook vector form of Snell's law, the contract's rules of where a ray
ends, and its optical path, index times the length of each stretch. It shares no code with any engine and imports
nothing of optiland or of the worker but the reading of a case's index table and the three numbers of the contract
that it restates. Standard library only.
"""

from __future__ import annotations

import dataclasses
from decimal import Decimal, getcontext
from typing import Any

from lvrtc_optiland.build import index_rows
from lvrtc_optiland.trace import IMAGE_PLANE_TOLERANCE_MM, STATUS_BLOCKED, STATUS_OK

getcontext().prec = 60

Point = tuple[float, float, float]


@dataclasses.dataclass(frozen=True)
class Exact:
    """One ray traced by the contract's rules in 60-digit arithmetic."""

    status: int
    end: int
    hits: tuple[tuple[Decimal, Decimal, Decimal], ...]
    direction: tuple[Decimal, Decimal, Decimal] | None = None
    path: Decimal | None = None
    image: tuple[Decimal, Decimal, Decimal] | None = None
    path_image: Decimal | None = None


def exact_sag(shape: dict[str, Any], r: Decimal) -> Decimal | None:
    """The contract's sag (contract/CONTRACT.md, "Sag"); None beyond the height at which a conic ends."""
    total = Decimal(0)
    if shape["kind"] != "plane" and shape["radius"] is not None:
        c = 1 / Decimal(shape["radius"])
        inside = 1 - (1 + Decimal(shape["conic"])) * c * c * r * r
        if inside < 0:
            return None
        total = c * r * r / (1 + inside.sqrt())
    for term in shape.get("terms", []):
        total += Decimal(term["coeff"]) * r ** term["power"]
    return total


def exact_slope(shape: dict[str, Any], r: Decimal) -> Decimal:
    """The derivative of that sag by the height."""
    total = Decimal(0)
    if shape["kind"] != "plane" and shape["radius"] is not None:
        c = 1 / Decimal(shape["radius"])
        total = c * r / (1 - (1 + Decimal(shape["conic"])) * c * c * r * r).sqrt()
    for term in shape.get("terms", []):
        total += term["power"] * Decimal(term["coeff"]) * r ** (term["power"] - 1)
    return total


def exact_trace(case: dict[str, Any], origin: Point, direction: Point, line: int = 0) -> Exact:
    """Carries one ray through a case as the contract defines a trace (contract/CONTRACT.md, ``rays.trace``).

    The numbers of the case and of the ray are taken as the doubles they are. At each surface the line is met with
    the sag by Newton's method from the point where it crosses the surface's vertex plane, which on the surfaces of
    these tests is the crossing nearest that plane; the step may be negative. A line that leaves the heights at
    which the surface has a sag misses it. The aperture is inclusive at both radii. A ray is bent by Snell's law in
    its vector form, and ends where it is totally reflected. The optical path is index times the signed step.
    """
    surfaces = case["system"]["surfaces"]
    indices = [Decimal(value) for value in index_rows(case)[line]]
    p = tuple(Decimal(value) for value in origin)
    d = tuple(Decimal(value) for value in direction)
    index, path = Decimal(1), Decimal(0)
    hits: list[tuple[Decimal, Decimal, Decimal]] = []
    for number, entry in enumerate(surfaces):
        if d[2] <= 0:
            return Exact(STATUS_BLOCKED, number, tuple(hits))
        shape, vertex = entry["shape"], Decimal(entry["z"])
        length = (d[0] * d[0] + d[1] * d[1] + d[2] * d[2]).sqrt()
        step = (vertex - p[2]) / d[2]
        for _ in range(200):
            x, y = p[0] + step * d[0], p[1] + step * d[1]
            r = (x * x + y * y).sqrt()
            sag = exact_sag(shape, r)
            if sag is None:
                return Exact(STATUS_BLOCKED, number, tuple(hits))
            radial = (x * d[0] + y * d[1]) / r if r != 0 else Decimal(0)
            change = (p[2] + step * d[2] - vertex - sag) / (d[2] - exact_slope(shape, r) * radial)
            step -= change
            if abs(change) < Decimal(10) ** -45:
                break
        else:
            raise AssertionError(f"the exact trace did not settle on surface {number}")
        q = (p[0] + step * d[0], p[1] + step * d[1], p[2] + step * d[2])
        r = (q[0] * q[0] + q[1] * q[1]).sqrt()
        aperture = entry["aperture"]
        if r > Decimal(aperture["semiDiameter"]) or r < Decimal(aperture["innerSemiDiameter"]):
            return Exact(STATUS_BLOCKED, number, tuple(hits))
        slope = exact_slope(shape, r)
        gx, gy = (slope * q[0] / r, slope * q[1] / r) if r != 0 else (Decimal(0), Decimal(0))
        size = (gx * gx + gy * gy + 1).sqrt()
        normal = (gx / size, gy / size, -1 / size)
        heading = tuple(part / length for part in d)
        cosine = -(heading[0] * normal[0] + heading[1] * normal[1] + heading[2] * normal[2])
        if cosine < 0:
            normal, cosine = tuple(-part for part in normal), -cosine
        ratio = index / indices[number]
        radicand = 1 - ratio * ratio * (1 - cosine * cosine)
        if radicand < 0:
            return Exact(STATUS_BLOCKED, number, tuple(hits))
        factor = ratio * cosine - radicand.sqrt()
        path += index * step * length
        hits.append(q)
        p, d, index = q, tuple(ratio * heading[axis] + factor * normal[axis] for axis in range(3)), indices[number]
    count = len(surfaces)
    reached = (Decimal(case["conditions"]["imageZ"]) - p[2]) / d[2] if d[2] > 0 else None
    if reached is None or reached < -Decimal(IMAGE_PLANE_TOLERANCE_MM):
        return Exact(STATUS_BLOCKED, count, tuple(hits), d, path)
    along = max(reached, Decimal(0))
    image = (p[0] + along * d[0], p[1] + along * d[1], Decimal(case["conditions"]["imageZ"]))
    return Exact(STATUS_OK, -1, tuple(hits), d, path, image, path + index * along)

"""Raw Wavefront.get_data, one line/field/grid per fresh verified optic; no OTF is computed here.

A custom BaseDistribution supplies midpoint cells strictly inside the unit circle. get_data is compact;
we scatter its rows back to the square, retaining dark cells and optiland's OPD sign in vacuum waves.
Imports of optiland/numpy occur only after hygiene. See docs/gotchas.md and test_wavefront.py.
"""
from __future__ import annotations

import math
import time
from typing import Any, Callable

from lvrtc_worker_kit.ndarray import encode_ndarray
from .build import BuildMismatch, index_rows, optiland_api
from .mtf import (FATAL, REQUEST_BUDGET_S, TimeBudgetExceeded, _Quiet, _hold, _numbers,
                  field_coordinate, field_optic, LAUNCH_DIRECTION_TOLERANCE, read_request as read_mtf_request)

WAVEFRONT_NATIVE = "wavefront.native"


def read_request(spec: dict[str, Any], options: dict[str, Any], case: dict[str, Any]) -> Any:
    """Reuse the MTF field/finite-object option checks; a raw request explicitly names its one line."""
    if int(spec["line"]) >= len(case["conditions"]["lines"]):
        return [{"code": "option", "item": "line", "message": "the requested line is absent from the case"}]
    mtf_spec = {"fields": spec["fields"], "frequenciesPerMm": [0.0], "method": "diffraction", "focus": "design"}
    angles = options.get("fieldAnglesDeg")
    return read_mtf_request(mtf_spec, {"fieldAnglesDeg": angles, "line": int(spec["line"])}, case)


def grid_points(n: int) -> tuple[list[float], list[float], list[int]]:
    """Full midpoint square and compact circle indices, stdlib only, exact for power-of-two grids."""
    x = [(2 * (i % n) + 1) / n - 1 for i in range(n * n)]
    y = [(2 * (i // n) + 1) / n - 1 for i in range(n * n)]
    inside = [i for i in range(n * n) if x[i] * x[i] + y[i] * y[i] < 1.0]
    return x, y, inside


def verify_launch(optic: Any, angle: float, api: Any) -> None:
    """A separate fresh optic checks the chief launch without tracing any rim ray or priming the analysis aimer."""
    coord = field_coordinate(angle)
    with _Quiet(api):
        ray = optic.ray_tracer.ray_generator.generate_rays(*coord, 0., 0., optic.primary_wavelength)
    _hold("wavefront launch aimer", type(optic.ray_tracer.ray_generator.aimer).__name__, "RobustRayAimer")
    direction = [_numbers(api, v)[0] for v in (ray.L, ray.M, ray.N)]
    radians = math.radians(angle)
    expected = [0., math.sin(radians), math.cos(radians)]
    if not all(abs(got-want) <= LAUNCH_DIRECTION_TOLERANCE for got, want in zip(direction, expected, strict=True)):
        raise BuildMismatch("wavefront chief launch direction differs from its field angle")


def wavefront_step(case: dict[str, Any], line: int, angle: float, n: int) -> dict[str, Any]:
    """Read back every analysis setting, distribution and returned row on an optic used by no other analysis."""
    from optiland.distribution import BaseDistribution  # noqa: PLC0415 - after worker hygiene
    from optiland.wavefront import Wavefront  # noqa: PLC0415

    api = optiland_api()
    np = api.np
    x, y, inside = grid_points(n)

    class MidpointDistribution(BaseDistribution):
        def generate_points(self, num_points: int) -> None:
            gx, gy, indices = grid_points(num_points)
            self.x = np.array([gx[i] for i in indices], dtype=np.float64)
            self.y = np.array([gy[i] for i in indices], dtype=np.float64)

    distribution = MidpointDistribution()
    distribution.generate_points(n)
    verify_launch(field_optic(case, line, angle), angle, api)
    optic = field_optic(case, line, angle)
    coord = field_coordinate(angle)
    wl = float(optic.primary_wavelength)
    with _Quiet(api):
        analysis = Wavefront(optic, fields=[coord], wavelengths=[wl], num_rays=n,
                             distribution=distribution, strategy="chief_ray", afocal=False, remove_tilt=False)
    held = analysis.strategy
    expected_x = [x[i] for i in inside]
    expected_y = [y[i] for i in inside]
    _hold("wavefront strategy", type(held).__name__, "ChiefRayStrategy")
    _hold("wavefront optic", analysis.optic is optic and held.optic is optic, True)
    _hold("wavefront num_rays", analysis.num_rays, n)
    _hold("wavefront fields", [tuple(float(v) for v in f.coord) for f in analysis.fields], [coord])
    _hold("wavefront wavelengths", [float(w.value) for w in analysis.wavelengths], [wl])
    _hold("wavefront reference type", held.reference_type, "sphere")
    _hold("wavefront remove_tilt", analysis.remove_tilt, False)
    _hold("wavefront image index", float(held.n_image), index_rows(case)[line][-1])
    xp = _numbers(api, optic.paraxial.exit_pupil_point_gcs())
    _hold("wavefront exit pupil", _numbers(api, held.exit_pupil_point), xp)
    for name, dist in (("analysis", analysis.distribution), ("strategy", held.distribution)):
        _hold(f"wavefront {name} distribution x", _numbers(api, dist.x), expected_x)
        _hold(f"wavefront {name} distribution y", _numbers(api, dist.y), expected_y)
    _hold("wavefront data keys", list(analysis.data), [(coord, wl)])
    data = analysis.get_data(coord, wl)
    _hold("wavefront get_data selection", data is analysis.data[(coord, wl)], True)
    _hold("wavefront polarization", data.E_exits is None and data.prt_matrix is None, True)
    chief = held._chief_ray
    center = [_numbers(api, v)[0] for v in (chief.x, chief.y, chief.z)]
    if not all(math.isfinite(v) for v in center):
        raise ValueError("wavefront chief ray has no finite landing")
    if abs(center[2] - float(case["conditions"]["imageZ"])) > 1e-9:
        raise BuildMismatch("wavefront chief landing is not on the case image plane")
    radius = float(data.radius)
    if not math.isfinite(radius) or radius <= 0 or not all(math.isfinite(v) for v in xp):
        raise ValueError("wavefront has no finite reference sphere")
    expected_radius = math.sqrt(math.fsum((a - b) ** 2 for a, b in zip(center, xp, strict=True)))
    if not abs(radius - expected_radius) <= 1e-12 * max(1.0, expected_radius):
        raise BuildMismatch("wavefront reference radius differs from chief-to-exit-pupil distance")
    parts = {name: _numbers(api, getattr(data, name)) for name in ("pupil_x", "pupil_y", "pupil_z", "opd", "intensity")}
    for name, values in parts.items():
        _hold(f"wavefront {name} row count", len(values), len(inside))
    pupil = [0.0] * (3 * n * n)
    opd, intensity, valid = [0.0] * (n * n), [0.0] * (n * n), [0] * (n * n)
    for at, cell in enumerate(inside):
        values = [parts[name][at] for name in parts]
        if not all(math.isfinite(v) for v in values) or parts["intensity"][at] < 0:
            raise ValueError("wavefront returned nonfinite or negative-intensity samples")
        pupil[3 * cell:3 * cell + 3] = [parts[name][at] for name in ("pupil_x", "pupil_y", "pupil_z")]
        opd[cell] = parts["opd"][at]
        intensity[cell] = parts["intensity"][at]
        valid[cell] = int(intensity[cell] > 0)
    if not any(valid):
        raise ValueError("wavefront has no positive-intensity samples")
    return {"gridSize": n, "normalizedPupil": encode_ndarray("f8", [v for pair in zip(x, y) for v in pair], [n*n, 2]),
            "pupilMm": encode_ndarray("f8", pupil, [n*n, 3]), "opdWaves": encode_ndarray("f8", opd),
            "intensity": encode_ndarray("f8", intensity), "valid": encode_ndarray("u1", valid),
            "reference": {"strategy": "chief_ray", "removeTilt": False, "sphereCenterMm": center,
                          "radiusMm": radius, "exitPupilMm": xp}}


def answer_wavefront(spec: dict[str, Any], options: dict[str, Any], case: dict[str, Any],
                     step: Callable[..., dict[str, Any]] = wavefront_step,
                     clock: Callable[[], float] = time.monotonic) -> dict[str, Any] | list[dict[str, str]]:
    asked = read_request(spec, options, case)
    if isinstance(asked, list):
        return asked
    fields, notes = [], []
    started = clock()
    for at, angle in enumerate(asked.angles):
        if clock() - started > REQUEST_BUDGET_S:
            raise TimeBudgetExceeded("wavefront.native exceeded REQUEST_BUDGET_S before its next field")
        field = {"field": asked.fractions[at] if asked.fractions else angle, "fieldAngleDeg": angle,
                 "imageHeightMm": None, "status": "ok", "samples": []}
        try:
            for grid in spec["grids"]:
                sample = step(case, asked.line, angle, int(grid))
                field["samples"].append(sample)
                center = sample["reference"]["sphereCenterMm"]
                field["imageHeightMm"] = math.hypot(center[0], center[1])
        except FATAL:
            raise
        except Exception as error:  # noqa: BLE001 - one failed field, never the whole request
            field.update(status="unavailable", reason=f"optiland-raised-{type(error).__name__}", samples=[])
            notes.append(f"field {angle}: {type(error).__name__}: {' '.join(str(error).split())[:200]}")
        fields.append(field)
    line = case["conditions"]["lines"][asked.line]
    return {"line": {"index": asked.line, "wavelengthNm": line["wavelengthNm"], "weight": line["weight"],
                     "imageIndex": index_rows(case)[asked.line][-1]}, "fields": fields,
            "method": {"name": "wavefront-get-data", "params": {"grids": spec["grids"], "pupil": "stop-midpoints",
                       "frame": "mirrored-in-y", "opdSign": "reference-minus-path", "opdUnit": "vacuum-waves"}},
            "notes": notes}

"""Stage 4.2 pupil extents. Started only with optilandWorkerEnvironment, never a bare interpreter."""
from __future__ import annotations

import json
import math
import sys
from pathlib import Path
from typing import Any


def summary(n: int, samples: list[tuple[int, float, float]]) -> dict[str, Any]:
    """Lit centers (cell, normalized stop y, optical cosine y); never fit a disc to a clipped mask."""
    cells = {cell: cosine for cell, _, cosine in samples}
    pitch = sorted(abs(cells[cell+n]-cosine) for cell, _, cosine in samples if cell+n in cells)
    return {"lit": len(samples), "stopY": [min(y for _, y, _ in samples), max(y for _, y, _ in samples)],
            "cosineY": [min(c for _, _, c in samples), max(c for _, _, c in samples)],
            "pitchMinMaxMedian": [pitch[0], pitch[-1], pitch[len(pitch)//2]] if pitch else []}


def midpoint(case: dict[str, Any], angle: float, n: int) -> dict[str, Any]:
    from lvrtc_optiland.wavefront import wavefront_step
    from lvrtc_optiland.build import index_rows
    from lvrtc_worker_kit.ndarray import decode_ndarray
    raw = wavefront_step(case, 0, angle, n)
    values = lambda name: decode_ndarray(raw[name]).values()
    pupil, xy, valid = values("pupilMm"), values("normalizedPupil"), values("valid")
    center = raw["reference"]["sphereCenterMm"]
    image_index = index_rows(case)[0][-1]
    samples = []
    for cell, lit in enumerate(valid):
        if not lit:
            continue
        d = [center[k] - pupil[3*cell+k] for k in range(3)]
        samples.append((cell, xy[2*cell+1], d[1]*image_index/math.sqrt(math.fsum(v*v for v in d))))
    return {"grid": n, "stopStep": 2/n, **summary(n, samples)}


def fft_pupil(case: dict[str, Any], angle: float, n: int) -> dict[str, Any]:
    from lvrtc_optiland.build import optiland_api, index_rows
    from lvrtc_optiland.mtf import _Quiet, _hold, _numbers, field_coordinate, field_optic
    from optiland.psf.fft import ScalarFFTPSF
    api = optiland_api()
    optic = field_optic(case, 0, angle)
    field = field_coordinate(angle)
    with _Quiet(api):
        psf = ScalarFFTPSF(optic, field, optic.primary_wavelength, num_rays=n, grid_size=2*n,
                           strategy="chief_ray", remove_tilt=False)
    _hold("diagnostic FFT rays", psf.num_rays, n)
    _hold("diagnostic FFT grid", psf.grid_size, 2*n)
    _hold("diagnostic FFT strategy", type(psf.strategy).__name__, "ChiefRayStrategy")
    _hold("diagnostic FFT tilt", psf.remove_tilt, False)
    _hold("diagnostic FFT optic", psf.optic is optic and psf.strategy.optic is optic, True)
    _hold("diagnostic FFT fields", [tuple(float(v) for v in f.coord) for f in psf.fields], [field])
    _hold("diagnostic FFT wavelength", [float(w.value) for w in psf.wavelengths], [float(optic.primary_wavelength)])
    data = psf.get_data(field, optic.primary_wavelength)
    chief = psf.strategy._chief_ray
    center = [_numbers(api, v)[0] for v in (chief.x, chief.y, chief.z)]
    parts = [_numbers(api, getattr(data, key)) for key in ("pupil_x", "pupil_y", "pupil_z", "intensity")]
    # Use numpy's linspace, just as UniformDistribution and _generate_pupils do (not a rounded algebraic rewrite).
    axis = api.np.linspace(-1., 1., n)
    x, y = api.np.meshgrid(axis, axis)
    inside = api.np.flatnonzero(x.ravel()**2 + y.ravel()**2 <= 1.)
    _hold("diagnostic FFT compact length", len(parts[0]), len(inside))
    _hold("diagnostic FFT distribution x", _numbers(api, psf.distribution.x), list(x.ravel()[inside]))
    _hold("diagnostic FFT distribution y", _numbers(api, psf.distribution.y), list(y.ravel()[inside]))
    image_index = index_rows(case)[0][-1]
    samples = []
    for at, cell in enumerate(inside):
        if parts[3][at] <= 0:
            continue
        d = [center[k] - parts[k][at] for k in range(3)]
        samples.append((int(cell), float(y.ravel()[cell]), d[1]*image_index/math.sqrt(math.fsum(v*v for v in d))))
    return {"grid": n, "stopStep": 2/(n-1), **summary(n, samples)}


def main() -> None:
    # Same order as the worker: hygiene and stdout protection before importing numpy/optiland.
    from lvrtc_optiland.hygiene import prepare
    from lvrtc_worker_kit.protocol import protect_stdout
    dirs = prepare()
    replies = protect_stdout()
    from lvrtc_optiland.engine import load_engine, UnavailableEngine
    engine = load_engine(dirs)
    if isinstance(engine, UnavailableEngine):
        raise RuntimeError(engine.reason)
    directory = Path(sys.argv[1])
    manifest = json.loads((directory / "manifest.json").read_text())
    output = []
    for run in manifest["runs"]:
        if not run["name"].endswith("-a"):
            continue
        case = json.loads((directory / "cases" / (run["caseId"] + ".json")).read_text())
        recipe = run["recipe"]["recipe"]
        for field in recipe["fields"]:
            if field["fraction"] not in (0.5, 1):
                continue
            for n in (128, 256, 512):
                for name, measure in (("fft-pupil", fft_pupil), ("raw-midpoint", midpoint)):
                    try:
                        print(f"pupil diagnostic: {run['name']} field={field['fraction']} {name} grid={n}",
                              file=sys.stderr, flush=True)
                        row = measure(case, field["angleDeg"], n)
                    except Exception as error:
                        from lvrtc_optiland.mtf import FATAL
                        if isinstance(error, FATAL):
                            raise
                        row = {"grid": n, "reason": f"{type(error).__name__}: {error}"}
                    output.append({"run": run["name"][:-2], "field": field["fraction"], "method": name, **row})
    replies.write((json.dumps(output, allow_nan=False, indent=2)+"\n").encode())
    replies.flush()


if __name__ == "__main__":
    main()

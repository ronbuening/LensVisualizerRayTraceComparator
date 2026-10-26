"""Stage 5.3: inspect one temporary R2 reproduction, with native rows and the independent 60-digit trace.

Run through optilandWorkerEnvironment (prepare/protect_stdout precede every optical import). Input is one
LVRTC_RUNS_DIR made by a catalog-repro suite, never the owner's store. Output contains results only.
"""
from __future__ import annotations

import gzip
import json
import math
import sys
import warnings
from decimal import Decimal as D
from pathlib import Path


def main() -> None:
    from lvrtc_optiland.hygiene import prepare
    from lvrtc_worker_kit.protocol import protect_stdout
    dirs = prepare()
    replies = protect_stdout()
    from lvrtc_optiland.engine import load_engine, UnavailableEngine
    engine = load_engine(dirs)
    if isinstance(engine, UnavailableEngine):
        raise RuntimeError(engine.reason)
    from lvrtc_optiland.build import build_case, optiland_api
    from lvrtc_optiland.trace import record, settle
    from lvrtc_worker_kit.ndarray import decode_ndarray
    from tests.optiland.exact import exact_trace

    directory = Path(sys.argv[1]).resolve()
    if directory == Path(__file__).resolve().parents[3] / "runs" or "catalog-repro" == directory.name:
        raise ValueError("give the temporary LVRTC_RUNS_DIR, not a suite or the owner's runs directory")
    manifest = json.loads((directory / "catalog-repro/manifest.json").read_text())
    assert len(manifest["runs"]) == 1
    run = manifest["runs"][0]
    case = json.loads((directory / "catalog-repro/cases" / (run["caseId"] + ".json")).read_text())
    api = optiland_api()
    np = api.np
    values = lambda wire: decode_ndarray(wire).values()
    requests = {}
    for job in manifest["jobs"]:
        assert job["rung"] == "r2"
        with gzip.open(directory / "store" / (job["storeKey"] + ".json.gz"), "rt") as file:
            entry = json.load(file)
        request = requests.setdefault(job["requestId"], {"spec": entry["request"]["spec"], "answers": {}})
        request["answers"][job["engine"]] = entry["result"]["data"]
    output = {"run": run["name"], "caseId": case["id"], "requests": [], "rays": []}
    for request_id, request in requests.items():
        spec, answers = request["spec"], request["answers"]
        states = {name: (values(data["status"]), values(data["endSurface"])) for name, data in answers.items()}
        ends = {name: [math.inf if s == 0 else e for s, e in zip(*state)] for name, state in states.items()}
        count = len(ends["ref"])
        disputes = [ray for ray in range(count) if any(
            states[name][0][ray] != 2 and states["ref"][0][ray] != 2 and ends[name][ray] != ends["ref"][ray]
            for name in ("lv", "optiland"))]
        origins = np.array(values(spec["origins"])).reshape(count, 3)
        directions = np.array(values(spec["directions"])).reshape(count, 3)
        optic = build_case(case, lines=[spec["line"]]).optics[0]
        native = record(optic, origins, directions)
        settled = settle(optic, native)
        assert settled.status.tolist() == list(states["optiland"][0])
        assert settled.end_surface.tolist() == list(states["optiland"][1])
        checked = 0
        solves = {}
        for ray in disputes:
            expected = (states["ref"][0][ray], states["ref"][1][ray])
            row = {"request": request_id, "field": spec["groups"]["field"], "ray": ray,
                   "engines": {name: [s[ray], e[ray]] for name, (s, e) in states.items()}}
            # LV/ref disagreements require the independent full trace; an unsettled calculation aborts.
            # On optiland-only disagreements the evidence is its native rows below, not a Newton guess.
            if ends["lv"][ray] != ends["ref"][ray]:
                exact = exact_trace(case, tuple(origins[ray]), tuple(directions[ray]), spec["line"])
                row["decimal60"] = [exact.status, exact.end]
                assert (exact.status, exact.end) == expected, (ray, expected, exact)
                checked += 1
                at = int(ends["lv"][ray])
                assert at < len(exact.hits)
                q, p = exact.hits[at], exact.hits[at - 1]
                assert q[2] < p[2]
                ref_hits = values(answers["ref"]["hits"])
                row["backwardMm"] = str(q[2] - p[2])
                row["decimalHitDeltaMm"] = max(abs(float(q[a]) - ref_hits[(at * count + ray) * 3 + a])
                                               for a in range(3))
            if ends["optiland"][ray] != ends["ref"][ray]:
                at = int(min(ends["optiland"][ray], ends["ref"][ray]))
                geometry = optic.surfaces[at + 1].geometry
                point = [float(getattr(native, k)[at + 1, ray]) for k in ("x", "y", "z")]
                before = [float(getattr(native, k)[at, ray]) for k in ("x", "y", "z")]
                heading = [float(getattr(native, k)[at, ray]) for k in ("L", "M", "N")]
                sag = float(geometry.sag(np.array([point[0]]), np.array([point[1]]))[0])
                if hasattr(geometry, "_solve_distance_primal") and at not in solves:
                    coordinates = [np.copy(getattr(native, k)[at]) for k in ("x", "y", "z", "L", "M", "N")]
                    coordinates[2] -= float(geometry.cs.z)
                    rays = api.RealRays(*coordinates, np.copy(native.intensity[at]),
                                        np.full(count, float(optic.primary_wavelength)))
                    with np.errstate(all="ignore"), warnings.catch_warnings():
                        warnings.simplefilter("ignore")
                        solves[at] = geometry._solve_distance_primal(rays, aperture=optic.surfaces[at + 1].aperture)
                row["native"] = {"surface": at, "geometry": type(geometry).__name__, "point": point,
                                 "before": before, "heading": heading, "localZ": point[2] - float(geometry.cs.z),
                                 "sag": sag, "sagResidualMm": point[2] - float(geometry.cs.z) - sag,
                                 "radiusMm": math.hypot(*point[:2]),
                                 "stepMm": (point[2] - before[2]) / heading[2],
                                 "intensity": float(native.intensity[at + 1, ray]),
                                 "clipRadiusMm": case["system"]["surfaces"][at]["aperture"]["semiDiameter"]}
                if at in solves:
                    result = solves[at]
                    row["native"]["iterations"] = int(result.iterations)
                    row["native"]["converged"] = bool(result.converged[ray])
                    row["native"]["finalResidualMm"] = float(result.residual[ray])
                    assert abs(float(result.t[ray]) - row["native"]["stepMm"]) < 1e-9
                elif type(geometry) is api.StandardGeometry:
                    p = [D(v) for v in before]
                    p[2] -= D(float(geometry.cs.z))
                    d = [D(v) for v in heading]
                    radius, k1 = D(float(geometry.radius)), 1 + D(float(geometry.k))
                    a = d[0]**2 + d[1]**2 + k1*d[2]**2
                    b = 2*(p[0]*d[0] + p[1]*d[1] + (k1*p[2] - radius)*d[2])
                    c = p[0]**2 + p[1]**2 + p[2]*(k1*p[2] - 2*radius)
                    disc = b*b - 4*a*c
                    roots = [(-b - disc.sqrt())/(2*a), (-b + disc.sqrt())/(2*a)] if disc >= 0 else []
                    row["native"]["sheetFactors60"] = [str(1 - k1*(p[2] + t*d[2])/radius) for t in roots]
                if ends["ref"][ray] > at:
                    hit = values(answers["ref"]["hits"])[(at * count + ray)*3:(at * count + ray)*3 + 3]
                    row["native"]["refHitRadiusMm"] = math.hypot(*hit[:2])
                    from tests.optiland.exact import exact_sag
                    r = (D(hit[0])**2 + D(hit[1])**2).sqrt()
                    sag60 = exact_sag(case["system"]["surfaces"][at]["shape"], r)
                    residual60 = D(hit[2]) - D(case["system"]["surfaces"][at]["z"]) - sag60
                    row["native"]["refSagResidual60Mm"] = str(residual60)
            output["rays"].append(row)
        output["requests"].append({"id": request_id, "field": spec["groups"]["field"],
                                   "disputed": len(disputes), "decimal60Checked": checked})
    replies.write((json.dumps(output, allow_nan=False) + "\n").encode("utf-8"))


if __name__ == "__main__":
    main()

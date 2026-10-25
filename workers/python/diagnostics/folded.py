"""80-digit independent conic-path check. Input is temporary exported cases and stored ray requests; no engine import."""

import json, base64, struct, sys
from decimal import Decimal as D, localcontext


def unpack(w):
    nd = w["$nd"]
    code = {"f8": "d", "i4": "i", "u1": "B"}[nd["dtype"]]
    raw = base64.b64decode(nd["data"])
    return struct.unpack("<" + code * (len(raw) // struct.calcsize(code)), raw)


def exact(x):
    return D.from_float(float(x))


def dot(a, b):
    return sum((x * y for x, y in zip(a, b)), D(0))


def unit(v):
    n = dot(v, v).sqrt()
    return [x / n for x in v]


with localcontext() as ctx:
    ctx.prec = 80
    for item in json.load(open(sys.argv[1])):
        case = item["case"]
        ray = item["ray"]
        p = list(map(exact, unpack(item["spec"]["origins"])[3 * ray : 3 * ray + 3]))
        d = list(map(exact, unpack(item["spec"]["directions"])[3 * ray : 3 * ray + 3]))
        indices = list(map(exact, unpack(case["conditions"]["indexAfterSurface"])))
        n = D(1)
        details = []
        status = "ok"
        end = -1
        for at, visit in enumerate(case["system"]["opticalPath"]):
            s = case["system"]["surfaces"][visit["surfaceIndex"]]
            shape = s["shape"]
            z0 = exact(s["z"])
            t0 = (z0 - p[2]) / d[2]
            x0 = p[0] + t0 * d[0]
            y0 = p[1] + t0 * d[1]
            if shape["kind"] == "asphere":
                raise RuntimeError("asphere requires its own proof")
            c = D(0) if shape["kind"] == "plane" else D(1) / exact(shape["radius"])
            k = D(0) if shape["kind"] == "plane" else exact(shape["conic"])
            q = D(1) + k
            A = c * (d[0] * d[0] + d[1] * d[1] + q * d[2] * d[2])
            B = c * (x0 * d[0] + y0 * d[1]) - d[2]
            C = c * (x0 * x0 + y0 * y0)
            disc = B * B - A * C
            if disc < 0:
                status = "blocked"
                end = at
                details.append({"step": at, "proof": "negative discriminant"})
                break
            root = disc.sqrt()
            Q = -(B + (root if B > 0 else -root))
            roots = [D(0)] if Q == 0 else [C / Q] + ([] if A == 0 else [Q / A])
            roots = [u for u in roots if D(1) - q * c * u * d[2] >= 0]
            u = min(roots, key=abs)
            t = t0 + u
            point = [p[i] + t * d[i] for i in range(3)]
            r = (point[0] * point[0] + point[1] * point[1]).sqrt()
            outer = exact(s["aperture"]["semiDiameter"]) if s["aperture"]["semiDiameter"] is not None else D("Infinity")
            inner = exact(s["aperture"]["innerSemiDiameter"])
            inside = inner <= r <= outer
            details.append({"step": at, "radius": str(r), "inner": str(inner), "t": str(t), "active": inside})
            normal = unit([-c * point[0] / (D(1) - q * c * u * d[2]), -c * point[1] / (D(1) - q * c * u * d[2]), D(1)])
            side = "front" if dot(d, normal) >= 0 else "rear"
            active = visit.get("incidentSide", "both") in ("both", side)
            interaction = (
                visit["interaction"] if active else "block" if visit.get("inactiveSide") == "block" else "pass"
            )
            if (
                t < D("-1e-9")
                or (interaction == "block" and inside)
                or (interaction not in ("block", "pass") and r > outer)
            ):
                status = "blocked"
                end = at
                break
            if inside and interaction not in ("block", "pass"):
                if interaction == "reflect":
                    along = dot(d, normal)
                    d = unit([d[i] - 2 * along * normal[i] for i in range(3)])
                else:
                    ref = (
                        visit.get("reverseMediumAfter", visit["mediumAfter"])
                        if side == "rear"
                        else visit["mediumAfter"]
                    )
                    nn = D(1) if ref is None else indices[ref]
                    if nn != n:
                        if dot(d, normal) < 0:
                            normal = [-x for x in normal]
                        cosine = dot(d, normal)
                        tangent = [d[i] - cosine * normal[i] for i in range(3)]
                        ratio = n / nn
                        under = 1 - ratio * ratio * dot(tangent, tangent)
                        if under < 0:
                            status = "blocked"
                            end = at
                            break
                        d = unit([ratio * tangent[i] + under.sqrt() * normal[i] for i in range(3)])
                    n = nn
            p = point
        measured = {
            a["engine"]: {"status": unpack(a["data"]["status"])[ray], "end": unpack(a["data"]["endSurface"])[ray]}
            for a in item["answers"]
            if a.get("data")
        }
        print(
            json.dumps(
                {
                    "key": item["key"],
                    "field": item["field"],
                    "ray": ray,
                    "decimal80": {"status": status, "end": end},
                    "engines": measured,
                    "proof": details,
                }
            )
        )

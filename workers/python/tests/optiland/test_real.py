"""The worker on the real optiland. Skipped, with the reason, under an interpreter that has none.

Run with the interpreter of ``engines.optiland.python`` (``npm run test:optiland``), in the environment the
comparator gives the worker: the caches go where that says, and nothing is written into the optiland checkout.
"""

from __future__ import annotations

import os
import re
import sys
import unittest
from pathlib import Path
from typing import Any

from lvrtc_optiland.hygiene import check, protected_directories
from lvrtc_optiland.identity import adapter_revision, source_hash
from lvrtc_worker_kit.protocol import parse_json
from lvrtc_worker_kit.validate import validate_kind

from . import CACHE_DIRS
from .support import HELLO, SHUTDOWN, WORKERS_DIR, TempDirTest, real_optiland_missing, run_line

MISSING = real_optiland_missing()


@unittest.skipIf(MISSING is not None, MISSING)
class RealOptilandTest(TempDirTest):
    def environment(self) -> dict[str, str]:
        """The caches of this test process, which a worker started from here shares: they are warm."""
        names = ("NUMBA_CACHE_DIR", "MPLCONFIGDIR", "PYTHONPYCACHEPREFIX")
        return {name: os.environ[name] for name in names}

    def converse(self, lines: bytes) -> tuple[list[dict[str, Any]], bytes]:
        ended = self.worker(None, lines, env=self.environment())
        self.assertEqual(ended.returncode, 0, ended.stderr)
        return [parse_json(line) for line in ended.stdout.splitlines()], ended.stderr

    def test_the_worker_identifies_the_optiland_it_runs(self) -> None:
        (hello, ran, bye), _ = self.converse(HELLO + run_line() + SHUTDOWN)
        self.assertEqual([reply["ok"] for reply in (hello, ran, bye)], [True, True, True])
        descriptor = hello["result"]
        self.assertEqual(validate_kind("engine-descriptor", descriptor), [])
        identity = descriptor["identity"]
        details = identity["details"]

        import numba  # noqa: PLC0415
        import numpy  # noqa: PLC0415
        import optiland  # noqa: PLC0415
        import scipy  # noqa: PLC0415

        package = Path(optiland.__file__).resolve().parent
        sources, count = source_hash(package)
        self.assertEqual((details["sourceHash"], details["sourceFiles"]), (sources, count))
        self.assertGreater(count, 100)
        versions = (details["numpy"], details["scipy"], details["numba"])
        self.assertEqual(versions, (numpy.__version__, scipy.__version__, numba.__version__))
        self.assertEqual(details["python"], ".".join(str(part) for part in sys.version_info[:3]))
        self.assertIs(details["jit"], True)
        self.assertEqual((details["backend"], details["precision"]), ("numpy", "float64"))
        self.assertEqual(identity["version"], details["distVersion"])
        self.assertEqual(identity["adapterRevision"], adapter_revision(WORKERS_DIR))
        self.assertRegex(identity["fingerprint"], r"^[0-9a-f]{64}$")
        if details["commit"] is not None:
            self.assertRegex(details["commit"], r"^[0-9a-f]{40}$")
            self.assertIsInstance(details["dirty"], bool)
            # The distribution's version names the commit it was built from: a stale install would show here.
            named = re.search(r"\+g([0-9a-f]+)", details["distVersion"])
            if named is not None:
                self.assertTrue(details["commit"].startswith(named.group(1)), details)

        self.assertEqual(validate_kind("result", ran["result"]), [])
        self.assertEqual(ran["result"]["status"], "unsupported")
        self.assertEqual(ran["result"]["engine"]["fingerprint"], identity["fingerprint"])

    def test_the_fingerprint_is_the_same_in_two_processes(self) -> None:
        (first,), _ = self.converse(HELLO)
        (second,), _ = self.converse(HELLO)
        self.assertEqual(first["result"]["identity"], second["result"]["identity"])

    def test_numba_caches_where_the_worker_said_and_optiland_computes_in_float64(self) -> None:
        import numba  # noqa: PLC0415
        import optiland  # noqa: PLC0415
        import optiland.backend  # noqa: PLC0415

        assert CACHE_DIRS is not None
        check(CACHE_DIRS, optiland, numba)
        self.assertEqual(Path(numba.config.CACHE_DIR), CACHE_DIRS.numba)
        home = Path(optiland.__file__).resolve().parent.parent
        self.assertNotIn(home, CACHE_DIRS.numba.resolve().parents)
        # What the worker protects, found before anything was imported, is where optiland then turned out to be.
        self.assertEqual(protected_directories()[0], home)

    def test_what_the_jit_compiles_is_cached_where_the_worker_said_and_not_beside_the_source(self) -> None:
        # A ray through two spherical surfaces: optiland's conic intersection is a function numba compiles and
        # caches (@njit(cache=True)), which without NUMBA_CACHE_DIR goes into __pycache__ beside conic.py.
        import numba  # noqa: PLC0415
        import numpy as np  # noqa: PLC0415
        from optiland.materials import IdealMaterial  # noqa: PLC0415
        from optiland.optic import Optic  # noqa: PLC0415
        from optiland.physical_apertures import RadialAperture  # noqa: PLC0415
        from optiland.rays import RealRays  # noqa: PLC0415

        self.assertFalse(numba.config.DISABLE_JIT)
        optic = Optic()
        optic.surfaces.add(index=0, radius=np.inf, thickness=np.inf)
        front = {"material": IdealMaterial(n=1.5), "is_stop": True, "aperture": RadialAperture(r_max=10.0)}
        optic.surfaces.add(index=1, radius=50.0, thickness=5.0, **front)
        back = {"material": IdealMaterial(n=1.0), "aperture": RadialAperture(r_max=10.0)}
        optic.surfaces.add(index=2, radius=-50.0, thickness=40.0, **back)
        optic.surfaces.add(index=3)
        optic.set_aperture("float_by_stop_size", 20.0)
        optic.fields.set_type("angle")
        optic.fields.add(y=0.0)
        optic.wavelengths.add(value=0.5875618, is_primary=True)
        count = 5
        heights = np.linspace(-4.0, 4.0, count)
        zeros, ones = np.zeros(count), np.ones(count)
        rays = RealRays(heights, zeros, np.full(count, -10.0), zeros, zeros, ones, ones, np.full(count, 0.5875618))
        optic.surfaces.trace(rays)
        landed = np.asarray(optic.surfaces.x)[-1]
        self.assertEqual(landed.dtype, np.float64)
        self.assertEqual(float(landed[2]), 0.0)
        self.assertTrue(np.allclose(landed, -landed[::-1], rtol=0.0, atol=1e-12), landed)

        assert CACHE_DIRS is not None
        index_files = sorted(path.name for path in CACHE_DIRS.numba.rglob("*.nbi"))
        self.assertTrue(any(name.startswith("conic.") for name in index_files), index_files)


if __name__ == "__main__":
    unittest.main()

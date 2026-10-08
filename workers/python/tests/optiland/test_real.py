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

from lvrtc_optiland.build import build_case
from lvrtc_optiland.hygiene import check, protected_directories
from lvrtc_optiland.identity import adapter_revision, source_hash, stated_version
from lvrtc_worker_kit.protocol import parse_json
from lvrtc_worker_kit.validate import validate_kind

from . import CACHE_DIRS
from .support import HELLO, SHUTDOWN, WORKERS_DIR, TempDirTest, read_fixture, real_optiland_missing, run_line

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
        # The version is the distribution's without the day of the install, which an editable install of a checkout
        # with uncommitted changes ends in: no word the engine says of itself holds a date.
        import importlib.metadata  # noqa: PLC0415

        self.assertEqual(identity["version"], stated_version(importlib.metadata.version("optiland")))
        self.assertNotRegex(identity["version"], r"\.d\d{8}$")
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
        # The optic is the builder's, of the contract's singlet. The rays are still made here, with optiland's own
        # class: the worker traces rays from Stage 2.4 on, and this import goes then.
        import numba  # noqa: PLC0415
        import numpy as np  # noqa: PLC0415
        from optiland.rays import RealRays  # noqa: PLC0415

        self.assertFalse(numba.config.DISABLE_JIT)
        (optic,) = build_case(read_fixture("valid", "optical-case", "singlet.json")).optics
        count = 5
        heights = np.linspace(-4.0, 4.0, count)
        zeros, ones = np.zeros(count), np.ones(count)
        rays = RealRays(heights, zeros, np.full(count, -10.0), zeros, zeros, ones, ones, np.full(count, 0.5875618))
        optic.surfaces.trace(rays)
        landed = np.asarray(optic.surfaces.x)[-1]
        self.assertEqual(landed.dtype, np.float64)
        self.assertEqual(float(landed[2]), 0.0)
        self.assertTrue(np.allclose(landed, -landed[::-1], rtol=0.0, atol=1e-12), landed)
        # The image surface is where the case says, and every ray inside the apertures arrived.
        self.assertEqual([float(value) for value in np.asarray(optic.surfaces.z)[-1]], [100.0] * count)
        self.assertTrue(bool(np.all(np.asarray(optic.surfaces.intensity)[-1] > 0)))

        assert CACHE_DIRS is not None
        index_files = sorted(path.name for path in CACHE_DIRS.numba.rglob("*.nbi"))
        self.assertTrue(any(name.startswith("conic.") for name in index_files), index_files)

    def test_bytecode_is_cached_under_the_prefix_and_none_lies_in_the_optiland_checkout(self) -> None:
        import importlib.util  # noqa: PLC0415

        import optiland  # noqa: PLC0415

        assert CACHE_DIRS is not None
        self.assertIs(sys.dont_write_bytecode, False)
        self.assertEqual(Path(sys.pycache_prefix or ""), CACHE_DIRS.pycache)
        package = Path(optiland.__file__).resolve().parent
        # Where Python reads and writes the bytecode of optiland's own modules: under the prefix, by their full path.
        cached = Path(importlib.util.cache_from_source(optiland.__file__))
        self.assertTrue(cached.is_relative_to(CACHE_DIRS.pycache), cached)
        self.assertEqual(cached.parent, CACHE_DIRS.pycache.joinpath(*package.parts[1:]))
        self.assertTrue(cached.is_file(), "the import of optiland wrote it, or an earlier one did")
        self.assertFalse(cached.is_relative_to(package.parent))


if __name__ == "__main__":
    unittest.main()

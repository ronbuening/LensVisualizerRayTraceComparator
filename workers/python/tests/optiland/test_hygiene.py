"""The worker's hygiene: where the caches go, and what state the loaded modules must be in."""

from __future__ import annotations

import json
import os
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from types import SimpleNamespace
from typing import Any

from lvrtc_optiland.hygiene import (
    CACHE_DIR_VARIABLE,
    DEFAULT_CACHE_NAME,
    CacheDirs,
    HygieneError,
    check,
    prepare,
    protected_directories,
)

from .support import WORKERS_DIR, TempDirTest


class PrepareTest(TempDirTest):
    def setUp(self) -> None:
        super().setUp()
        saved = sys.dont_write_bytecode, sys.pycache_prefix

        def restore() -> None:
            sys.dont_write_bytecode, sys.pycache_prefix = saved

        self.addCleanup(restore)

    def test_every_cache_goes_under_the_stated_directory_and_bytecode_is_written_there_and_only_there(self) -> None:
        base = self.tmp / "cache"
        environ = {CACHE_DIR_VARIABLE: str(base), "NUMBA_DISABLE_JIT": "1", "OTHER": "kept"}
        dirs = prepare(environ)
        expected = CacheDirs(numba=base / "numba", matplotlib=base / "matplotlib", pycache=base / "pycache")
        self.assertEqual(dirs, expected)
        self.assertEqual(
            environ,
            {
                CACHE_DIR_VARIABLE: str(base),
                "OTHER": "kept",
                "NUMBA_CACHE_DIR": str(base / "numba"),
                "MPLCONFIGDIR": str(base / "matplotlib"),
                "PYTHONPYCACHEPREFIX": str(base / "pycache"),
                "MPLBACKEND": "Agg",
                "PYTHONDONTWRITEBYTECODE": "1",
            },
            "the JIT is not turned off: the variable that would do it is gone",
        )
        for directory in (dirs.numba, dirs.matplotlib, dirs.pycache):
            self.assertTrue(directory.is_dir())
        # The place first, then the permission: this interpreter caches what it imports from now on, under the
        # prefix; a process it starts is told not to write, by the variable above.
        self.assertEqual(sys.pycache_prefix, str(base / "pycache"))
        self.assertIs(sys.dont_write_bytecode, False)

    def test_what_is_imported_after_prepare_is_cached_under_the_prefix_and_not_beside_its_source(self) -> None:
        # An interpreter started as the comparator starts the worker, told to write no bytecode: nothing is written
        # for what it imports before prepare, and what it imports afterwards is cached under the prefix.
        package = self.tmp / "site" / "late"
        package.mkdir(parents=True)
        (package / "__init__.py").write_text("x = 1\n", encoding="utf-8")
        script = (
            "import sys\n"
            "import lvrtc_optiland.hygiene as hygiene\n"
            "hygiene.prepare(protected=[])\n"
            "import late\n"
            "print(sys.dont_write_bytecode, sys.pycache_prefix)\n"
        )
        cache = self.tmp / "cache"
        ended = subprocess.run(
            [sys.executable, "-c", script],
            capture_output=True,
            env={
                "PATH": os.environ.get("PATH", ""),
                "PYTHONPATH": os.pathsep.join([str(self.tmp / "site"), str(WORKERS_DIR)]),
                "PYTHONDONTWRITEBYTECODE": "1",
                CACHE_DIR_VARIABLE: str(cache),
            },
            cwd=self.tmp,
            timeout=120,
            check=False,
        )
        self.assertEqual(ended.returncode, 0, ended.stderr)
        self.assertEqual(ended.stdout.decode().strip(), f"False {cache / 'pycache'}")
        written = sorted(path for path in self.tmp.rglob("*.pyc"))
        self.assertEqual(len(written), 1, written)
        self.assertEqual(written[0].parent, (cache / "pycache").joinpath(*package.parts[1:]))
        self.assertRegex(written[0].name, r"^__init__\..+\.pyc$")
        self.assertEqual([path for path in self.tmp.rglob("__pycache__")], [], "nothing beside a source")
        self.assertEqual(sorted(path.name for path in package.iterdir()), ["__init__.py"])

    def test_a_cache_variable_that_is_set_is_kept_and_a_backend_that_is_set_is_not(self) -> None:
        numba = self.tmp / "elsewhere" / "numba"
        environ = {CACHE_DIR_VARIABLE: str(self.tmp / "cache"), "NUMBA_CACHE_DIR": str(numba), "MPLBACKEND": "TkAgg"}
        dirs = prepare(environ)
        self.assertEqual(dirs.numba, numba)
        self.assertEqual(dirs.matplotlib, self.tmp / "cache" / "matplotlib")
        self.assertEqual(environ["MPLBACKEND"], "Agg")

    def test_without_a_stated_directory_the_caches_go_to_the_systems_temporary_directory(self) -> None:
        # The system's temporary directory is this test's own for as long as it runs: nothing is left in the real one.
        saved = tempfile.tempdir
        tempfile.tempdir = str(self.tmp)
        self.addCleanup(lambda: setattr(tempfile, "tempdir", saved))
        environ: dict[str, str] = {}
        dirs = prepare(environ)
        base = self.tmp / DEFAULT_CACHE_NAME
        self.assertEqual(dirs.numba, base / "numba")
        self.assertEqual(environ["MPLCONFIGDIR"], str(base / "matplotlib"))
        self.assertTrue(dirs.pycache.is_dir())

    def test_a_cache_inside_a_protected_directory_is_refused_and_nothing_is_made_or_set(self) -> None:
        home = self.tmp / "checkout"
        (home / "optiland").mkdir(parents=True)
        outside = self.tmp / "cache"
        saved = sys.dont_write_bytecode, sys.pycache_prefix
        for variable, name in (
            ("NUMBA_CACHE_DIR", "numba"),
            ("MPLCONFIGDIR", "matplotlib"),
            ("PYTHONPYCACHEPREFIX", "bytecode"),
        ):
            inside = home / "optiland" / "__pycache__" / "cache"
            environ = {CACHE_DIR_VARIABLE: str(outside), variable: str(inside)}
            with self.assertRaises(HygieneError) as raised:
                prepare(environ, protected=[self.tmp / "other", home])
            self.assertEqual(
                str(raised.exception),
                f"the {name} cache {inside} lies inside {home}, which the worker must not write to",
            )
            self.assertEqual(environ, {CACHE_DIR_VARIABLE: str(outside), variable: str(inside)}, "nothing was set")
        self.assertEqual(sorted(path.name for path in self.tmp.iterdir()), ["checkout"], "and nothing was made")
        self.assertEqual(list((home / "optiland").iterdir()), [])
        self.assertEqual((sys.dont_write_bytecode, sys.pycache_prefix), saved)
        # The base directory itself may be the one inside; a path that only starts with the same letters is not.
        with self.assertRaises(HygieneError):
            prepare({CACHE_DIR_VARIABLE: str(home / "cache")}, protected=[home])
        dirs = prepare({CACHE_DIR_VARIABLE: str(self.tmp / "checkout-cache")}, protected=[home])
        self.assertEqual(dirs.numba, self.tmp / "checkout-cache" / "numba")

    def test_a_virtual_environment_is_protected_and_an_installation_of_python_is_not(self) -> None:
        saved = sys.prefix, sys.base_prefix
        self.addCleanup(lambda: (setattr(sys, "prefix", saved[0]), setattr(sys, "base_prefix", saved[1])))
        venv = self.tmp / "checkout" / ".venv"
        venv.mkdir(parents=True)
        sys.prefix, sys.base_prefix = str(venv), str(self.tmp / "python")
        self.assertEqual(protected_directories()[-1], venv)
        with self.assertRaises(HygieneError) as raised:
            prepare({CACHE_DIR_VARIABLE: str(venv / "cache")})
        self.assertIn(f"lies inside {venv}, which the worker must not write to", str(raised.exception))
        self.assertEqual(list(venv.iterdir()), [])
        # Outside a virtual environment the prefix is where Python is installed: not optiland's to protect.
        sys.base_prefix = sys.prefix
        self.assertNotIn(venv, protected_directories())

    def test_the_protected_directories_are_found_without_importing_optiland(self) -> None:
        site = self.fake_site()
        script = (
            "import json, sys\n"
            "from lvrtc_optiland.hygiene import protected_directories\n"
            "found = [str(path) for path in protected_directories()]\n"
            "print(json.dumps([found, sorted(set(sys.modules) & {'optiland', 'numpy', 'numba'})]))\n"
        )
        ended = subprocess.run(
            [sys.executable, "-B", "-c", script],
            capture_output=True,
            env={**os.environ, "PYTHONPATH": os.pathsep.join([str(site), str(WORKERS_DIR)])},
            timeout=120,
            check=False,
        )
        self.assertEqual(ended.returncode, 0, ended.stderr)
        found, imported = json.loads(ended.stdout)
        self.assertEqual(imported, [], "nothing of optiland ran")
        # The directory that holds the package comes first; the interpreter's virtual environment follows, if any.
        self.assertEqual(found[0], str(site))
        virtual = [str(Path(sys.prefix).resolve())] if sys.prefix != sys.base_prefix else []
        self.assertEqual(found[1:], virtual)


class CheckTest(TempDirTest):
    def modules(self, **changes: Any) -> tuple[CacheDirs, Any, Any]:
        """A checkout with a package, caches outside it, and modules in the state the worker needs."""
        package = self.tmp / "checkout" / "optiland"
        package.mkdir(parents=True, exist_ok=True)
        cache = self.tmp / "cache"
        dirs = CacheDirs(numba=cache / "numba", matplotlib=cache / "matplotlib", pycache=cache / "pycache")
        state = {"backend": "numpy", "precision": 64, "numba_cache": str(dirs.numba), "disable_jit": 0, **changes}
        backend = SimpleNamespace(get_backend=lambda: state["backend"], get_precision=lambda: state["precision"])
        optiland = SimpleNamespace(__file__=str(package / "__init__.py"), backend=backend)
        config = SimpleNamespace(CACHE_DIR=state["numba_cache"], DISABLE_JIT=state["disable_jit"])
        numba = SimpleNamespace(config=config)
        return dirs, optiland, numba

    def setUp(self) -> None:
        super().setUp()
        saved = sys.pycache_prefix
        sys.pycache_prefix = str(self.tmp / "cache" / "pycache")
        self.addCleanup(lambda: setattr(sys, "pycache_prefix", saved))

    def test_the_state_prepare_leaves_passes(self) -> None:
        check(*self.modules())

    def test_each_departure_is_named(self) -> None:
        departures: list[tuple[dict[str, Any], str]] = [
            ({"backend": "torch"}, "optiland's backend is torch, not numpy"),
            ({"precision": 32}, "optiland's precision is float32, not float64"),
            ({"disable_jit": 1}, "numba's JIT is off"),
            ({"numba_cache": ""}, "numba caches in the source directories, not in "),
            ({"numba_cache": str(self.tmp / "other")}, f"numba caches in {self.tmp / 'other'}, not in "),
        ]
        for changes, message in departures:
            with self.assertRaises(HygieneError) as raised:
                check(*self.modules(**changes))
            self.assertIn(message, str(raised.exception))

    def test_a_cache_inside_the_checkout_of_optiland_is_refused(self) -> None:
        dirs, optiland, numba = self.modules()
        home = self.tmp / "checkout"
        for name, inside in (
            ("numba", CacheDirs(home / "optiland" / "__pycache__", dirs.matplotlib, dirs.pycache)),
            ("matplotlib", CacheDirs(dirs.numba, home / ".mpl", dirs.pycache)),
            ("bytecode", CacheDirs(dirs.numba, dirs.matplotlib, home / "pyc")),
        ):
            numba.config.CACHE_DIR = str(inside.numba)
            with self.assertRaises(HygieneError) as raised:
                check(inside, optiland, numba)
            self.assertIn(f"the {name} cache", str(raised.exception))
            self.assertIn(f"lies inside {home}, which the worker must not write to", str(raised.exception))

    def test_an_interpreter_whose_bytecode_would_go_elsewhere_is_refused(self) -> None:
        dirs, optiland, numba = self.modules()
        sys.pycache_prefix = None
        with self.assertRaises(HygieneError) as raised:
            check(dirs, optiland, numba)
        self.assertEqual(str(raised.exception), f"bytecode is written to the source directories, not to {dirs.pycache}")
        sys.pycache_prefix = str(self.tmp / "elsewhere")
        with self.assertRaises(HygieneError) as raised:
            check(dirs, optiland, numba)
        self.assertEqual(
            str(raised.exception), f"bytecode is written to {self.tmp / 'elsewhere'}, not to {dirs.pycache}"
        )


if __name__ == "__main__":
    unittest.main()

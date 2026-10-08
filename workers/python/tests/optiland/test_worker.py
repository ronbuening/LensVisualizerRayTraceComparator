"""The worker as a process, on the fake optiland: what it says of itself, and what never reaches its replies."""

from __future__ import annotations

import os
import re
import subprocess
import sys
import unittest
from pathlib import Path
from typing import Any

from lvrtc_optiland.engine import QUANTITIES, SETTING_HINT, SUPPORTED_FEATURES
from lvrtc_optiland.identity import adapter_revision, fingerprint_of, source_hash
from lvrtc_worker_kit.protocol import parse_json
from lvrtc_worker_kit.validate import validate_kind

from .support import HELLO, SHUTDOWN, TempDirTest, describe_line, read_fixture, run_line

SHA256 = re.compile(r"^[0-9a-f]{64}$")


class WorkerTest(TempDirTest):
    def replies(self, site: Path | None, lines: bytes, **more: Any) -> tuple[list[dict[str, Any]], str]:
        ended = self.worker(site, lines, **more)
        self.assertEqual(ended.returncode, 0, ended.stderr)
        return [parse_json(line) for line in ended.stdout.splitlines()], ended.stderr.decode("utf-8")

    def identity(self, site: Path, **more: Any) -> dict[str, Any]:
        (hello,), _ = self.replies(site, HELLO, **more)
        self.assertIs(hello["ok"], True, hello)
        return hello["result"]["identity"]

    def test_hello_is_answered_with_a_descriptor_that_says_what_runs(self) -> None:
        site = self.fake_site()
        (hello, bye), log = self.replies(site, HELLO + SHUTDOWN)
        self.assertEqual((hello["id"], hello["ok"]), ("h", True))
        self.assertEqual(bye, {"contract": "1.0", "id": "s", "ok": True, "result": {}})
        descriptor = hello["result"]
        self.assertEqual(validate_kind("engine-descriptor", descriptor), [])
        sources, count = source_hash(site / "optiland")
        identity = descriptor["identity"]
        python = identity["details"]["python"]
        self.assertRegex(python, r"^3\.\d+\.\d+")
        parts = {
            "commit": None,
            "dirty": None,
            "sourceHash": sources,
            "python": python,
            "numpy": "0.1.fake",
            "scipy": "0.2.fake",
            "numba": "0.3.fake",
            "jit": True,
        }
        self.assertEqual(
            identity,
            {
                "id": "optiland",
                "version": "0.0.7+fake",
                "fingerprint": fingerprint_of(parts),
                "adapterRevision": adapter_revision(),
                "details": {
                    **parts,
                    "sourceFiles": count,
                    "distVersion": "0.0.7+fake",
                    "backend": "numpy",
                    "precision": "float64",
                },
            },
        )
        self.assertEqual(count, 3)
        self.assertEqual(
            descriptor["capabilities"],
            {
                "features": {"supported": list(SUPPORTED_FEATURES), "limits": {}},
                "quantities": {"system.describe": {"version": 2}},
                "deterministic": True,
                "maxConcurrency": 1,
            },
        )
        self.assertEqual(descriptor["capabilities"]["quantities"], QUANTITIES)
        self.assertEqual(list(SUPPORTED_FEATURES), sorted(SUPPORTED_FEATURES))
        # The distribution's version ends in the day of an install; what the worker states does not.
        metadata = (site / "optiland-0.0.7.dist-info" / "METADATA").read_text(encoding="utf-8")
        self.assertIn("Version: 0.0.7+fake.d20260131\n", metadata)
        self.assertNotIn("d2026", repr(descriptor))
        # What the fakes wrote to the standard output while they were imported is in the log, and only there.
        for line in ("fake numpy: imported", "fake optiland: imported", "fake optiland: wrote to file descriptor 1"):
            self.assertIn(line + "\n", log)
        self.assertIn("RuntimeWarning: fake optiland: a warning at import", log)

    def test_a_quantity_it_does_not_offer_is_answered_unsupported_and_stamped_with_both_hashes(self) -> None:
        site = self.fake_site()
        (hello, ran), _ = self.replies(site, HELLO + run_line())
        request = read_fixture("valid", "protocol-request", "run.json")["params"]["request"]
        identity = hello["result"]["identity"]
        self.assertIs(ran["ok"], True)
        self.assertEqual(validate_kind("result", ran["result"]), [])
        quantity = request["quantity"]
        self.assertEqual(
            ran["result"],
            {
                "contract": "1.0",
                "kind": "result",
                "requestId": request["id"],
                "caseId": request["caseId"],
                "engine": {
                    "id": "optiland",
                    "fingerprint": identity["fingerprint"],
                    "adapterRevision": identity["adapterRevision"],
                    "details": identity["details"],
                },
                "status": "unsupported",
                "unsupported": [
                    {"code": "quantity", "item": quantity, "message": f"the engine does not offer {quantity}"}
                ],
                "diagnostics": {"warnings": [], "counts": {}},
            },
        )

    def test_a_spec_that_is_not_the_quantitys_is_an_error_of_the_engine_before_anything_is_built(self) -> None:
        site = self.fake_site()
        case = read_fixture("valid", "optical-case", "singlet.json")
        for spec, said in (
            ({"sagFractions": [0.5, 0.25]}, "/sagFractions/1 [invariant] the fractions must ascend: 0.25 follows 0.5"),
            ({"sagFractions": []}, "/sagFractions [minItems] "),
            ({"sagFractions": [0, 2]}, "/sagFractions/1 [maximum] "),
            ({"radii": [1]}, " [additionalProperties] "),
        ):
            (ran,), _ = self.replies(site, describe_line(case, spec))
            self.assertIs(ran["ok"], True, ran)
            result = ran["result"]
            self.assertEqual((result["status"], result["error"]["code"]), ("error", "bad-spec"), spec)
            self.assertTrue(result["error"]["message"].startswith("spec is not a system.describe spec: "), result)
            self.assertIn(said, result["error"]["message"])

    def test_what_the_builder_needs_of_optiland_is_imported_when_a_case_is_built_and_not_before(self) -> None:
        # The fake optiland has no geometries, materials or apertures. The worker starts on it and says who it is;
        # a case cannot be built, which is the engine's failure on that request and leaves the worker a worker.
        site = self.fake_site()
        case = read_fixture("valid", "optical-case", "singlet.json")
        (hello, ran, again, bye), log = self.replies(site, HELLO + describe_line(case) + run_line() + SHUTDOWN)
        self.assertIs(hello["ok"], True)
        self.assertIs(ran["ok"], True)
        result = ran["result"]
        self.assertEqual(validate_kind("result", result), [])
        self.assertEqual((result["status"], result["error"]["code"]), ("error", "engine-failure"))
        self.assertIn("No module named 'optiland.geometries'", result["error"]["message"])
        self.assertEqual(result["engine"]["fingerprint"], hello["result"]["identity"]["fingerprint"])
        self.assertEqual((again["result"]["status"], bye["ok"]), ("unsupported", True))
        self.assertIn("ModuleNotFoundError", log)

    def test_the_fingerprint_is_the_same_in_another_process_and_another_for_another_source(self) -> None:
        site = self.fake_site()
        first = self.identity(site)
        self.assertEqual(self.identity(site), first)
        self.assertRegex(first["fingerprint"], SHA256)

        (site / "optiland" / "optic" / "__init__.py").write_text("class Optic:\n    edited = True\n", encoding="utf-8")
        edited = self.identity(site)
        self.assertNotEqual(edited["fingerprint"], first["fingerprint"])
        self.assertNotEqual(edited["details"]["sourceHash"], first["details"]["sourceHash"])
        self.assertEqual(edited["adapterRevision"], first["adapterRevision"], "the worker did not change")

        (site / "optiland" / "added.py").write_text("", encoding="utf-8")
        added = self.identity(site)
        self.assertEqual(added["details"]["sourceFiles"], 4)
        self.assertEqual(len({first["fingerprint"], edited["fingerprint"], added["fingerprint"]}), 3)

        # A version of what optiland computes with is part of it; a file that is not source is not.
        (site / "optiland" / "notes.txt").write_text("x", encoding="utf-8")
        self.assertEqual(self.identity(site)["fingerprint"], added["fingerprint"])
        (site / "numba" / "__init__.py").write_text(
            (site / "numba" / "__init__.py").read_text(encoding="utf-8").replace("0.3.fake", "0.4.fake"),
            encoding="utf-8",
        )
        upgraded = self.identity(site)
        self.assertEqual(upgraded["details"]["numba"], "0.4.fake")
        self.assertNotEqual(upgraded["fingerprint"], added["fingerprint"])
        self.assertEqual(upgraded["details"]["sourceHash"], added["details"]["sourceHash"])

    def test_the_caches_are_where_it_was_told_and_the_jit_cannot_be_turned_off_from_outside(self) -> None:
        site = self.fake_site()
        identity = self.identity(site, env={"NUMBA_DISABLE_JIT": "1"})
        self.assertIs(identity["details"]["jit"], True)
        cache = self.tmp / "cache"
        self.assertEqual(sorted(path.name for path in cache.iterdir()), ["matplotlib", "numba", "pycache"])
        # Bytecode is cached, under the cache directory and nowhere else: of what was imported once the worker had
        # said where, the fakes among it. Nothing lies beside a source.
        written = [path for path in self.tmp.rglob("*") if path.suffix == ".pyc" or path.name == "__pycache__"]
        self.assertTrue(written)
        for path in written:
            self.assertTrue(path.is_relative_to(cache / "pycache") and path.suffix == ".pyc", path)
        cached = {path.name.split(".")[0] for path in (cache / "pycache").joinpath(*site.parts[1:]).rglob("*.pyc")}
        self.assertEqual(cached, {"__init__"}, "the fake numpy, scipy, numba and optiland, each an __init__")
        self.assertEqual(sorted(str(path.relative_to(site)) for path in site.rglob("*.pyc")), [])

    def test_an_interpreter_that_cannot_import_optiland_refuses_hello_and_says_what_to_set(self) -> None:
        site = self.fake_site()
        (site / "optiland" / "__init__.py").write_text("raise ImportError('no vtk here')\n", encoding="utf-8")
        (hello, ran, bye), log = self.replies(site, HELLO + run_line() + SHUTDOWN)
        self.assertEqual((hello["ok"], hello["error"]["code"]), (False, "engine-failure"))
        message = hello["error"]["message"]
        self.assertTrue(message.startswith("EngineUnavailable: "), message)
        self.assertIn("cannot import optiland (ImportError: no vtk here): ", message)
        self.assertTrue(message.endswith(SETTING_HINT), message)
        self.assertIn("engines.optiland.python in lvrtc.local.json (or LVRTC_OPTILAND_PYTHON)", SETTING_HINT)
        # A run has no descriptor to be stamped with, so it is refused too; the worker still ends as asked.
        self.assertEqual((ran["ok"], ran["error"]["code"], bye["ok"]), (False, "engine-failure", True))
        self.assertIn("EngineUnavailable", log)

    def test_a_state_the_worker_must_not_compute_in_is_refused_with_the_reason(self) -> None:
        site = self.fake_site()
        for env, reason in (
            ({"FAKE_OPTILAND_BACKEND": "torch"}, "optiland's backend is torch, not numpy"),
            ({"FAKE_OPTILAND_PRECISION": "32"}, "optiland's precision is float32, not float64"),
        ):
            (hello,), _ = self.replies(site, HELLO, env=env)
            self.assertIs(hello["ok"], False)
            self.assertIn("cannot run optiland for the comparator: ", hello["error"]["message"])
            self.assertIn(reason, hello["error"]["message"])

    def test_a_cache_that_would_lie_beside_optiland_is_refused_before_anything_is_written_or_imported(self) -> None:
        site = self.fake_site()
        before = sorted(str(path.relative_to(site)) for path in site.rglob("*"))
        for variable, inside in (
            ("NUMBA_CACHE_DIR", site / "optiland" / "__pycache__" / "numba"),
            ("MPLCONFIGDIR", site / "matplotlib-cache"),
            ("PYTHONPYCACHEPREFIX", site / "optiland" / "pyc"),
            ("LVRTC_CACHE_DIR", site / "cache"),
        ):
            (hello, ran, bye), log = self.replies(site, HELLO + run_line() + SHUTDOWN, env={variable: str(inside)})
            self.assertEqual((hello["ok"], ran["ok"], bye["ok"]), (False, False, True), variable)
            message = hello["error"]["message"]
            self.assertIn("cannot run optiland for the comparator: the ", message)
            self.assertIn(f"lies inside {site}, which the worker must not write to", message)
            # Refused before the directory was made, and before numba, which would probe it, was imported.
            self.assertEqual(sorted(str(path.relative_to(site)) for path in site.rglob("*")), before, variable)
            self.assertNotIn("fake optiland: imported", log)
            self.assertNotIn("fake numpy: imported", log)

    def test_identity_prints_the_identity_and_nothing_else(self) -> None:
        site = self.fake_site()
        ended = self.worker(site, b"", "--identity")
        self.assertEqual(ended.returncode, 0, ended.stderr)
        self.assertEqual(ended.stdout.count(b"\n"), 1)
        self.assertEqual(parse_json(ended.stdout), self.identity(site))

        (site / "optiland" / "__init__.py").write_text("raise ImportError('gone')\n", encoding="utf-8")
        failed = self.worker(site, b"", "--identity")
        self.assertEqual((failed.returncode, failed.stdout), (1, b""))
        self.assertIn(b"cannot import optiland (ImportError: gone)", failed.stderr)

    def test_options_and_arguments_it_does_not_have_end_it_before_anything_is_loaded(self) -> None:
        site = self.fake_site()
        for env, arguments, said in (
            ({"LVRTC_ENGINE_OPTIONS": '{"numRays": 512}'}, [], b"the engine optiland has no options"),
            ({"LVRTC_ENGINE_OPTIONS": "not json"}, [], b"the engine optiland has no options"),
            ({}, ["--verbose"], b"usage: python -m lvrtc_optiland [--identity]"),
        ):
            ended = self.worker(site, HELLO, *arguments, env=env)
            self.assertEqual((ended.returncode, ended.stdout), (2, b""))
            self.assertIn(said, ended.stderr)
            self.assertNotIn(b"fake optiland: imported", ended.stderr)
        accepted = self.worker(site, HELLO, env={"LVRTC_ENGINE_OPTIONS": "{}"})
        self.assertEqual(accepted.returncode, 0)

    def test_importing_the_package_imports_nothing_of_optiland(self) -> None:
        site = self.fake_site()
        script = (
            "import sys, lvrtc_optiland, lvrtc_optiland.hygiene, lvrtc_optiland.identity\n"
            "print(sorted(set(sys.modules) & {'optiland', 'numpy', 'scipy', 'numba', 'matplotlib'}))\n"
        )
        ended = subprocess.run(
            [sys.executable, "-B", "-c", script],
            capture_output=True,
            env={**os.environ, "PYTHONPATH": os.pathsep.join([str(site), str(Path(__file__).resolve().parents[2])])},
            timeout=120,
            check=False,
        )
        self.assertEqual((ended.returncode, ended.stdout.strip()), (0, b"[]"), ended.stderr)


if __name__ == "__main__":
    unittest.main()

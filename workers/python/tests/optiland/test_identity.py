"""The identity of the engine and of its worker: what each hash covers, and what it does not."""

from __future__ import annotations

import os
import shutil
import subprocess
import unittest
from pathlib import Path

from lvrtc_optiland.identity import (
    FINGERPRINT_PARTS,
    WORKER_PACKAGES,
    adapter_revision,
    engine_identity,
    fingerprint_of,
    git_state,
    source_hash,
)

from .support import GIT_MISSING, WORKERS_DIR, TempDirTest


def write(path: Path, text: str | bytes) -> Path:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(text if isinstance(text, bytes) else text.encode("utf-8"))
    return path


def git(directory: Path, *arguments: str) -> None:
    env = {name: value for name, value in os.environ.items() if not name.startswith("GIT_")}
    identity = ["-c", "user.name=t", "-c", "user.email=t@example.invalid", "-c", "commit.gpgsign=false"]
    subprocess.run(["git", "-C", str(directory), *identity, *arguments], check=True, capture_output=True, env=env)


class SourceHashTest(TempDirTest):
    def package(self, name: str = "pkg") -> Path:
        root = self.tmp / name
        write(root / "__init__.py", "x = 1\n")
        write(root / "sub" / "deep.py", "y = 2\n")
        write(root / "data.yml", "not: python\n")
        return root

    def test_it_covers_every_python_file_by_path_and_bytes_and_nothing_else(self) -> None:
        root = self.package()
        first, count = source_hash(root)
        self.assertRegex(first, r"^[0-9a-f]{64}$")
        self.assertEqual(count, 2)
        self.assertEqual(source_hash(root), (first, 2))

        write(root / "data.yml", "changed: true\n")
        write(root / "sub" / "__pycache__" / "deep.cpython-314.pyc", b"\0")
        self.assertEqual(source_hash(root), (first, 2), "a file that is not .py is no part of it")

        seen = {first}
        write(root / "sub" / "deep.py", "y = 3\n")
        seen.add(source_hash(root)[0])
        write(root / "sub" / "deep.py", "y = 2\n")
        self.assertEqual(source_hash(root)[0], first)
        (root / "sub" / "deep.py").rename(root / "sub" / "deeper.py")
        seen.add(source_hash(root)[0])
        write(root / "new.py", "")
        seen.add(source_hash(root)[0])
        self.assertEqual(source_hash(root)[1], 3)
        self.assertEqual(len(seen), 4, "an edit, a rename and a new file each give another hash")

    def test_it_is_the_same_wherever_the_tree_is_and_keeps_bytes_as_they_are(self) -> None:
        root = self.package("here")
        moved = self.tmp / "elsewhere" / "nested"
        shutil.copytree(root, moved)
        self.assertEqual(source_hash(root), source_hash(moved))
        # The engine's sources are hashed as they are on disk: a line ending is a byte like any other.
        write(moved / "__init__.py", "x = 1\r\n")
        self.assertNotEqual(source_hash(root), source_hash(moved))

    def test_a_path_cannot_be_taken_for_content(self) -> None:
        one, two = self.tmp / "one", self.tmp / "two"
        write(one / "a.py", "b.py")
        write(two / "a.pyb.py", "")
        self.assertNotEqual(source_hash(one)[0], source_hash(two)[0])


@unittest.skipIf(GIT_MISSING is not None, GIT_MISSING)
class GitStateTest(TempDirTest):
    def checkout(self) -> Path:
        top = self.tmp / "checkout"
        write(top / "optiland" / "__init__.py", "")
        write(top / "pyproject.toml", "[project]\n")
        write(top / ".gitignore", "__pycache__/\n")
        git(top, "init", "-q")
        git(top, "add", ".")
        git(top, "commit", "-q", "-m", "one")
        return top

    def test_the_commit_and_the_dirty_flag_are_the_checkouts(self) -> None:
        top = self.checkout()
        commit, dirty = git_state(top / "optiland")
        self.assertRegex(commit or "", r"^[0-9a-f]{40}$")
        self.assertIs(dirty, False)

        # Anything in the checkout that git lists makes it dirty, the package or not; an ignored file does not.
        write(top / "optiland" / "__pycache__" / "x.pyc", b"\0")
        self.assertEqual(git_state(top / "optiland"), (commit, False))
        write(top / "pyproject.toml", "[project]\nname = 'x'\n")
        self.assertEqual(git_state(top / "optiland"), (commit, True))
        git(top, "checkout", "-q", "--", "pyproject.toml")
        write(top / "untracked.txt", "")
        self.assertEqual(git_state(top / "optiland"), (commit, True))

    def test_reading_the_state_writes_nothing_into_the_checkout(self) -> None:
        top = self.checkout()
        # A file whose time changed and whose bytes did not: a plain "git status" would refresh the index for it.
        os.utime(top / "pyproject.toml", (1, 1))

        def snapshot() -> dict[str, tuple[int, int]]:
            return {
                str(path.relative_to(top)): (path.stat().st_size, path.stat().st_mtime_ns)
                for path in sorted(top.rglob("*"))
                if path.is_file()
            }

        before = snapshot()
        git_state(top / "optiland")
        self.assertEqual(snapshot(), before)

    def test_a_package_that_is_in_no_checkout_of_its_own_has_neither(self) -> None:
        loose = write(self.tmp / "loose" / "optiland" / "__init__.py", "").parent
        self.assertEqual(git_state(loose), (None, None))
        # Installed inside someone else's repository, untracked: that repository's commit is not its commit.
        top = self.checkout()
        installed = write(top / "venv" / "optiland" / "__init__.py", "").parent
        self.assertEqual(git_state(installed), (None, None))

    def test_the_repository_of_a_parent_git_is_not_read_in_its_place(self) -> None:
        top = self.checkout()
        other = self.tmp / "other"
        write(other / "x.py", "")
        git(other, "init", "-q")
        saved = os.environ.get("GIT_DIR")
        os.environ["GIT_DIR"] = str(other / ".git")
        try:
            commit, dirty = git_state(top / "optiland")
        finally:
            if saved is None:
                del os.environ["GIT_DIR"]
            else:
                os.environ["GIT_DIR"] = saved
        self.assertRegex(commit or "", r"^[0-9a-f]{40}$")
        self.assertIs(dirty, False)


class FingerprintTest(TempDirTest):
    PARTS = {
        "commit": "c" * 40,
        "dirty": False,
        "sourceHash": "5" * 64,
        "python": "3.14.0",
        "numpy": "2.3.0",
        "scipy": "1.16.0",
        "numba": "0.65.0",
        "jit": True,
    }

    def test_the_parts_are_the_ones_the_fingerprint_is_made_of(self) -> None:
        self.assertEqual(sorted(self.PARTS), sorted(FINGERPRINT_PARTS))

    def test_equal_parts_give_an_equal_fingerprint_and_each_part_changes_it(self) -> None:
        base = fingerprint_of(self.PARTS)
        self.assertRegex(base, r"^[0-9a-f]{64}$")
        self.assertEqual(base, fingerprint_of(dict(reversed(self.PARTS.items()))))
        changed = {
            "commit": "d" * 40,
            "dirty": True,
            "sourceHash": "6" * 64,
            "python": "3.14.1",
            "numpy": "2.3.1",
            "scipy": "1.16.1",
            "numba": "0.65.1",
            "jit": False,
        }
        others = {fingerprint_of({**self.PARTS, name: value}) for name, value in changed.items()}
        self.assertEqual(len(others | {base}), len(changed) + 1)
        self.assertNotEqual(fingerprint_of({**self.PARTS, "commit": None, "dirty": None}), base)

    def identity(self, package: Path, **changes: object) -> dict[str, object]:
        stated: dict[str, object] = {
            "engine_id": "optiland",
            "package_dir": package,
            "dist_version": "0.6.2.post1+gabc.d20260101",
            "python": "3.14.0",
            "numpy": "2.3.0",
            "scipy": "1.16.0",
            "numba": "0.65.0",
            "jit": True,
            "adapter": "a" * 64,
        }
        return engine_identity(**{**stated, **changes})  # type: ignore[arg-type]

    def test_the_identity_states_every_part_and_the_install_date_is_no_part_of_the_fingerprint(self) -> None:
        package = write(self.tmp / "optiland" / "__init__.py", "x = 1\n").parent
        identity = self.identity(package)
        sources, count = source_hash(package)
        self.assertEqual(
            identity,
            {
                "id": "optiland",
                "version": "0.6.2.post1+gabc.d20260101",
                "fingerprint": fingerprint_of({**self.PARTS, "commit": None, "dirty": None, "sourceHash": sources}),
                "adapterRevision": "a" * 64,
                "details": {
                    "commit": None,
                    "dirty": None,
                    "sourceHash": sources,
                    "sourceFiles": count,
                    "python": "3.14.0",
                    "numpy": "2.3.0",
                    "scipy": "1.16.0",
                    "numba": "0.65.0",
                    "jit": True,
                    "distVersion": "0.6.2.post1+gabc.d20260101",
                    "backend": "numpy",
                    "precision": "float64",
                },
            },
        )
        reinstalled = self.identity(package, dist_version="0.6.2.post1+gabc.d20260102", adapter="b" * 64)
        self.assertEqual(reinstalled["fingerprint"], identity["fingerprint"])
        self.assertNotEqual(self.identity(package, jit=False)["fingerprint"], identity["fingerprint"])
        self.assertNotEqual(self.identity(package, numba="0.66.0")["fingerprint"], identity["fingerprint"])
        write(package / "__init__.py", "x = 2\n")
        self.assertNotEqual(self.identity(package)["fingerprint"], identity["fingerprint"])


class AdapterRevisionTest(TempDirTest):
    def workers(self) -> Path:
        root = self.tmp / "workers"
        for package in WORKER_PACKAGES:
            write(root / package / "__init__.py", f"# {package}\n")
        write(root / "lvrtc_optiland" / "engine.py", "x = 1\n")
        write(root / "tests" / "test_x.py", "")
        return root

    def test_it_is_the_workers_own_sources_and_the_kits(self) -> None:
        self.assertEqual(WORKER_PACKAGES, ("lvrtc_optiland", "lvrtc_worker_kit"))
        root = self.workers()
        first = adapter_revision(root)
        self.assertRegex(first, r"^[0-9a-f]{64}$")
        write(root / "tests" / "test_x.py", "changed = True\n")
        write(root / "lvrtc_optiland" / "notes.md", "not code\n")
        write(root / "lvrtc_optiland" / "engine.py", "x = 1\r\n")
        self.assertEqual(adapter_revision(root), first, "tests, other files and line endings are no part of it")

        seen = {first}
        write(root / "lvrtc_optiland" / "engine.py", "x = 2\n")
        seen.add(adapter_revision(root))
        write(root / "lvrtc_optiland" / "engine.py", "x = 1\n")
        write(root / "lvrtc_worker_kit" / "__init__.py", "# edited\n")
        seen.add(adapter_revision(root))
        write(root / "lvrtc_worker_kit" / "more.py", "")
        seen.add(adapter_revision(root))
        self.assertEqual(len(seen), 4)

    def test_the_revision_of_this_checkout_is_that_of_the_directory_the_worker_is_in(self) -> None:
        self.assertEqual(adapter_revision(), adapter_revision(WORKERS_DIR))


if __name__ == "__main__":
    unittest.main()

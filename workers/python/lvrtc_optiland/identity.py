"""Who answers: the identity of the optiland that is loaded, and of the worker around it. Standard library only.

Two bodies of code stand behind an answer, and each has its own hash (contract/CONTRACT.md, "Fingerprint and
adapter revision"):

- the **fingerprint** is optiland's: the commit and dirty flag of its checkout, a hash of the package's Python
  sources, the versions of Python, numpy, scipy and numba, and whether numba's JIT is on. The distribution's
  version string is not part of it: its ``.dYYYYMMDD`` suffix is the day of an install, not a state of the code;
- the **adapter revision** is the worker's: a hash of the Python sources of ``lvrtc_optiland`` and of the worker
  kit, which are the comparator's code and not the engine.
"""

from __future__ import annotations

import hashlib
import json
import os
import subprocess
from pathlib import Path
from typing import Any

GIT_TIMEOUT_S = 20

_GIT_REPOSITORY_VARIABLES = (
    "GIT_ALTERNATE_OBJECT_DIRECTORIES",
    "GIT_COMMON_DIR",
    "GIT_CONFIG",
    "GIT_CONFIG_COUNT",
    "GIT_CONFIG_PARAMETERS",
    "GIT_DIR",
    "GIT_GRAFT_FILE",
    "GIT_IMPLICIT_WORK_TREE",
    "GIT_INDEX_FILE",
    "GIT_NO_REPLACE_OBJECTS",
    "GIT_OBJECT_DIRECTORY",
    "GIT_PREFIX",
    "GIT_REPLACE_REF_BASE",
    "GIT_SHALLOW_FILE",
    "GIT_WORK_TREE",
)
"""The variables with which a git points its hooks at its own repository; they outrank ``-C``, so they are dropped
(the same list as ``src/core/systemCommand.ts``)."""


def source_hash(directory: Path) -> tuple[str, int]:
    """A SHA-256 over every ``.py`` file under ``directory``, and how many there are.

    The files are taken in the order of their POSIX paths relative to ``directory``; each contributes its path, a
    NUL, its bytes as they are on disk, and a NUL. So an edit, a rename, a new file and a removed one each give
    another hash, and the same tree gives the same hash wherever it is.
    """
    files = sorted((path.relative_to(directory).as_posix(), path) for path in directory.rglob("*.py"))
    digest = hashlib.sha256()
    for relative, path in files:
        digest.update(relative.encode("utf-8") + b"\0")
        digest.update(path.read_bytes() + b"\0")
    return digest.hexdigest(), len(files)


def _git(directory: Path, *arguments: str) -> str | None:
    """The output of a git command that only reads, or None when it cannot be had.

    ``--no-optional-locks`` keeps ``git status`` from refreshing the index, so nothing is written to the checkout.
    """
    environment = {name: value for name, value in os.environ.items() if name not in _GIT_REPOSITORY_VARIABLES}
    try:
        ended = subprocess.run(
            ["git", "--no-optional-locks", "-C", str(directory), *arguments],
            capture_output=True,
            stdin=subprocess.DEVNULL,
            env=environment,
            timeout=GIT_TIMEOUT_S,
            check=False,
        )
    except (OSError, subprocess.SubprocessError):
        return None
    return ended.stdout.decode("utf-8", "replace") if ended.returncode == 0 else None


def git_state(package_dir: Path) -> tuple[str | None, bool | None]:
    """The commit and the dirty flag of the checkout that holds ``package_dir``; both None when there is none.

    A package that is not in a work tree of its own (installed into site-packages, or git missing) has neither.
    Dirty means that ``git status`` lists anything in the checkout: a tracked file that differs, or a file that is
    neither tracked nor ignored.
    """
    top = _git(package_dir, "rev-parse", "--show-toplevel")
    commit = _git(package_dir, "rev-parse", "--verify", "HEAD")
    if top is None or commit is None:
        return None, None
    # A package that git ignores inside someone else's repository is not that repository's code.
    if _git(package_dir, "ls-files", "--error-unmatch", "__init__.py") is None:
        return None, None
    status = _git(Path(top.strip()), "status", "--porcelain")
    return commit.strip(), (None if status is None else status.strip() != "")


def fingerprint_of(parts: dict[str, Any]) -> str:
    """The fingerprint: a SHA-256 over ``parts`` as JSON with sorted keys. ``parts`` holds strings, booleans, None."""
    text = json.dumps(parts, sort_keys=True, separators=(",", ":"), ensure_ascii=True, allow_nan=False)
    return hashlib.sha256(text.encode("ascii")).hexdigest()


FINGERPRINT_PARTS: tuple[str, ...] = ("commit", "dirty", "sourceHash", "python", "numpy", "scipy", "numba", "jit")
"""The details the fingerprint is made of, and nothing else is."""


def engine_identity(
    *,
    engine_id: str,
    package_dir: Path,
    dist_version: str,
    python: str,
    numpy: str,
    scipy: str,
    numba: str,
    jit: bool,
    adapter: str,
) -> dict[str, Any]:
    """The ``identity`` of the engine's descriptor, from the optiland package at ``package_dir`` and what runs it."""
    commit, dirty = git_state(package_dir)
    sources, count = source_hash(package_dir)
    details: dict[str, Any] = {
        "commit": commit,
        "dirty": dirty,
        "sourceHash": sources,
        "sourceFiles": count,
        "python": python,
        "numpy": numpy,
        "scipy": scipy,
        "numba": numba,
        "jit": jit,
        "distVersion": dist_version,
        "backend": "numpy",
        "precision": "float64",
    }
    return {
        "id": engine_id,
        "version": dist_version,
        "fingerprint": fingerprint_of({name: details[name] for name in FINGERPRINT_PARTS}),
        "adapterRevision": adapter,
        "details": details,
    }


WORKER_PACKAGES: tuple[str, ...] = ("lvrtc_optiland", "lvrtc_worker_kit")
"""The packages whose sources are the adapter: this worker and the kit it is built on."""


def adapter_revision(workers_dir: Path | None = None) -> str:
    """The adapter revision: a SHA-256 over the ``.py`` files of ``WORKER_PACKAGES`` under ``workers_dir``.

    Each file contributes its POSIX path relative to ``workers_dir``, a NUL, its bytes with line endings read as
    LF (so a checkout that rewrites them changes nothing), and a NUL, in the order of the paths. ``workers_dir``
    defaults to the directory that holds this package.
    """
    root = workers_dir if workers_dir is not None else Path(__file__).resolve().parent.parent
    sources = (path for package in WORKER_PACKAGES for path in (root / package).rglob("*.py"))
    files = sorted((path.relative_to(root).as_posix(), path) for path in sources)
    digest = hashlib.sha256()
    for relative, path in files:
        digest.update(relative.encode("utf-8") + b"\0")
        digest.update(path.read_bytes().replace(b"\r\n", b"\n") + b"\0")
    return digest.hexdigest()

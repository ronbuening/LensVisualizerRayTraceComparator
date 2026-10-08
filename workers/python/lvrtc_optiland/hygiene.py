"""What keeps the worker from writing where it must not, enforced by the worker itself. Standard library only.

optiland is a checkout the comparator may only read, and importing it brings in numba, matplotlib and vtk, each of
which writes a cache somewhere unless told where:

- numba writes the machine code of every ``@njit(cache=True)`` function next to the function's source, so into
  the optiland checkout, unless ``NUMBA_CACHE_DIR`` names another place;
- matplotlib writes its font cache into its configuration directory (``MPLCONFIGDIR``), and wants a display
  unless its backend is ``Agg`` (``MPLBACKEND``);
- Python writes bytecode beside every source it imports unless told not to (``PYTHONDONTWRITEBYTECODE``), or told
  to write it elsewhere (``PYTHONPYCACHEPREFIX``).

The comparator's engine definition sets all of these in the worker's environment
(``src/engines/optiland/definition.ts``). ``prepare`` sets them again from inside, for a worker started by hand or
with a variable missing, before anything of optiland is imported; ``check`` holds the loaded modules to them
afterwards. The JIT stays on: a variable that would turn it off is removed.

A cache that would lie inside the optiland checkout or its environment is refused by ``prepare`` itself, before a
directory is made and before numba is imported: numba makes its cache directory, and probes it with a file, as
soon as a cached function is defined, which is when optiland is imported.
"""

from __future__ import annotations

import importlib.util
import os
import sys
import tempfile
from collections.abc import MutableMapping, Sequence
from dataclasses import dataclass
from pathlib import Path
from typing import Any

CACHE_DIR_VARIABLE = "LVRTC_CACHE_DIR"
"""Names the directory the worker's caches go under; the comparator sets it below its own cache directory."""

DEFAULT_CACHE_NAME = "lvrtc-optiland-cache"
"""The directory under the system's temporary directory that is used when no variable says where."""


class HygieneError(RuntimeError):
    """A cache would be written where it must not be, or a module is not in the state the worker needs."""


@dataclass(frozen=True)
class CacheDirs:
    """Where each cache of the worker goes; every path is absolute."""

    numba: Path
    matplotlib: Path
    pycache: Path


def protected_directories() -> list[Path]:
    """The directories the worker must not write into, found without importing anything of optiland.

    First the directory that holds the optiland package this interpreter would import: its checkout, or the
    site-packages it is installed into. Then the interpreter's virtual environment, when it runs in one. Nothing
    is listed for an interpreter that has no optiland: it has nothing to protect, and ``hello`` will say so.
    """
    found: list[Path] = []
    try:
        # Of a top-level package only the place is looked up: none of its code runs.
        spec = importlib.util.find_spec("optiland")
    except (ImportError, ValueError):
        spec = None
    if spec is not None and spec.origin is not None:
        found.append(Path(spec.origin).resolve().parent.parent)
    if sys.prefix != sys.base_prefix:
        found.append(Path(sys.prefix).resolve())
    return found


def _inside(path: Path, directory: Path) -> bool:
    try:
        path.resolve().relative_to(directory.resolve())
    except ValueError:
        return False
    return True


def _refuse_inside(dirs: CacheDirs, protected: Sequence[Path]) -> None:
    """Raises a ``HygieneError`` for the first cache that lies inside a protected directory."""
    for name, path in (("numba", dirs.numba), ("matplotlib", dirs.matplotlib), ("bytecode", dirs.pycache)):
        for home in protected:
            if _inside(path, home):
                raise HygieneError(f"the {name} cache {path} lies inside {home}, which the worker must not write to")


def prepare(environ: MutableMapping[str, str] | None = None, protected: Sequence[Path] | None = None) -> CacheDirs:
    """Sets the environment and the interpreter so that nothing is written beside a source file.

    Call it before numba, matplotlib, numpy or optiland is imported. A cache variable that is already set is
    kept; one that is not is set to a directory under ``LVRTC_CACHE_DIR``, or under the system's temporary directory
    when that is not set either. The directories are created. Returns where the caches go.

    Raises a ``HygieneError``, with nothing set and no directory made, when a cache would lie inside one of
    ``protected``: by default ``protected_directories()``, the optiland this interpreter would import and its
    environment.
    """
    environ = os.environ if environ is None else environ
    stated = environ.get(CACHE_DIR_VARIABLE, "")
    base = Path(stated) if stated != "" else Path(tempfile.gettempdir()) / DEFAULT_CACHE_NAME

    def directory(variable: str, name: str) -> Path:
        value = environ.get(variable, "")
        return Path(value if value != "" else base / name).absolute()

    dirs = CacheDirs(
        numba=directory("NUMBA_CACHE_DIR", "numba"),
        matplotlib=directory("MPLCONFIGDIR", "matplotlib"),
        pycache=directory("PYTHONPYCACHEPREFIX", "pycache"),
    )
    _refuse_inside(dirs, protected_directories() if protected is None else protected)
    for variable, path in (
        ("NUMBA_CACHE_DIR", dirs.numba),
        ("MPLCONFIGDIR", dirs.matplotlib),
        ("PYTHONPYCACHEPREFIX", dirs.pycache),
    ):
        environ[variable] = str(path)
        path.mkdir(parents=True, exist_ok=True)
    environ["MPLBACKEND"] = "Agg"
    environ["PYTHONDONTWRITEBYTECODE"] = "1"
    # The JIT stays on: optiland is compared as it runs for its users.
    environ.pop("NUMBA_DISABLE_JIT", None)
    # The variables above reach the processes this one starts; these two reach this interpreter, which has
    # already read its environment.
    sys.dont_write_bytecode = True
    sys.pycache_prefix = str(dirs.pycache)
    return dirs


def check(dirs: CacheDirs, optiland: Any, numba: Any) -> None:
    """Holds the loaded modules to what ``prepare`` set. Raises a ``HygieneError`` that says what is wrong.

    - no cache directory lies inside the directory that holds the optiland package that was loaded (its checkout,
      or the site-packages it is installed into): ``prepare`` refused that for the package it could find, and this
      is the same of the one that is there;
    - numba caches where it was told to, so it was not imported before ``prepare`` ran, and its JIT is on;
    - optiland computes with numpy in float64, its default: the worker never switches backend or precision.
    """
    _refuse_inside(dirs, [Path(optiland.__file__).resolve().parent.parent])
    if not sys.dont_write_bytecode:
        raise HygieneError("the interpreter writes bytecode")
    used = str(getattr(numba.config, "CACHE_DIR", ""))
    if used == "" or Path(used).absolute() != dirs.numba:
        raise HygieneError(f"numba caches in {used or 'the source directories'}, not in {dirs.numba}")
    if bool(numba.config.DISABLE_JIT):
        raise HygieneError("numba's JIT is off")
    backend = optiland.backend.get_backend()
    if backend != "numpy":
        raise HygieneError(f"optiland's backend is {backend}, not numpy")
    precision = optiland.backend.get_precision()
    if precision != 64:
        raise HygieneError(f"optiland's precision is float{precision}, not float64")

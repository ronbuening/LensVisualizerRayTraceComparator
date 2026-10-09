"""The tests of the optiland worker (``python -m unittest discover -s tests/optiland -t .`` from ``workers/python``).

Some of them import the real optiland into this process, where an interpreter has it. So the worker's hygiene is
applied here, before any test module is loaded: whoever runs these tests, and however, numba does not write its
cache into the optiland checkout and no bytecode is written. The caches go where the environment says
(``npm run test:optiland`` names the comparator's cache directory), else under the system's temporary directory.

Under an interpreter that has no optiland nothing is imported that could write, so nothing is prepared and no
directory is made: those tests run on the fake optiland, each in a temporary directory of its own.
"""

from __future__ import annotations

from lvrtc_optiland.hygiene import CacheDirs, prepare

from .support import real_optiland_missing

CACHE_DIRS: CacheDirs | None = prepare() if real_optiland_missing() is None else None
"""Where the caches of this test process go; None where the tests of the real optiland are skipped."""

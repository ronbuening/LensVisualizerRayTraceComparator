"""The fake numba: a version and the two settings the worker reads, taken from the environment as numba does."""

import os


class _Config:
    CACHE_DIR = os.environ.get("NUMBA_CACHE_DIR", "")
    DISABLE_JIT = int(os.environ.get("NUMBA_DISABLE_JIT", "0"))


config = _Config()
__version__ = "0.3.fake"

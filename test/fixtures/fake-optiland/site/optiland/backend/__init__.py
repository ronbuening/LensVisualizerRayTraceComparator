"""The fake optiland's backend: numpy in float64, unless a variable of the test says otherwise."""

import os

_current_backend = os.environ.get("FAKE_OPTILAND_BACKEND", "numpy")
_precision = int(os.environ.get("FAKE_OPTILAND_PRECISION", "64"))


def get_backend():
    return _current_backend


def get_precision():
    return _precision

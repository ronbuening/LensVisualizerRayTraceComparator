"""The optiland worker: optiland behind the comparator's protocol, run as ``python -m lvrtc_optiland``.

It is the only code of the comparator that calls optiland, and it is never installed: the comparator puts
``workers/python`` on ``PYTHONPATH`` of the interpreter that ``engines.optiland.python`` names. It imports the
standard library, the worker kit (``lvrtc_worker_kit``), numpy and optiland, and nothing else.

Importing this package imports none of numpy, numba or optiland: ``hygiene.prepare`` must run first, and
``__main__`` sees to the order.
"""

from __future__ import annotations

ENGINE_ID = "optiland"
"""The engine id of the descriptor and of every result."""

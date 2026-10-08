A fake `optiland` for the hermetic tests: `site/` is put on `PYTHONPATH` in front of the worker
(`workers/python`), and holds packages named `optiland`, `numpy`, `scipy` and `numba` that have what the worker
reads at start-up and nothing of the real ones. A test copies it to a temporary directory first: here it lies
inside this repository, whose commit is not the fake's.

Each fake writes a line to the standard output when it is imported, as the real ones may: the worker must keep it
off the reply stream. Its versions are deliberately not optiland's.

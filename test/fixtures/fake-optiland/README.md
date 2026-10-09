A fake `optiland` for the hermetic tests: `site/` is put on `PYTHONPATH` in front of the worker
(`workers/python`), and holds packages named `optiland`, `numpy`, `scipy` and `numba` that have what the worker
reads at start-up and nothing of the real ones. A test copies it to a temporary directory first: here it lies
inside this repository, whose commit is not the fake's.

Each fake writes a line to the standard output when it is imported, as the real ones may: the worker must keep it
off the reply stream. Its versions are deliberately not optiland's. The distribution's version ends in the day of
an install, `.d20260131`, as that of an editable install of a checkout with uncommitted changes does: the worker
states it without.

The fake has nothing the builder uses (`optiland.geometries`, `optiland.materials`, `optiland.physical_apertures`)
and no rays (`optiland.rays`), so the worker starts and identifies itself on it and cannot build a case: a test of
the builder or of a trace needs the real optiland, and skips without it. What the worker does before it builds,
the rules of a spec among it, is tested on the fake.

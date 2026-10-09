"""The fake optiland: importable, and noisy on the standard output as an import of the real one can be."""

import os
import warnings

print("fake optiland: imported")
os.write(1, b"fake optiland: wrote to file descriptor 1\n")
warnings.warn("fake optiland: a warning at import", RuntimeWarning, stacklevel=1)

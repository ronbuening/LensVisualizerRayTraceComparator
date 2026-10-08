"""The comparator's Python worker kit: what a worker needs to speak the engine protocol, on the standard library.

- ``ndarray``: the bit-exact wire form of numeric arrays;
- ``validate``: the contract's schema validator, a port of ``src/contract/validate.ts``;
- ``protocol``: the NDJSON message loop around an engine object;
- ``fake_engine``: an engine without optics that answers ``selftest.echo``.

The kit imports nothing outside the standard library and writes nothing to disk. It runs on Python 3.10 and later.
"""

CONTRACT_VERSION = "1.0"
"""The contract version this kit reads and writes, as ``<major>.<minor>``."""

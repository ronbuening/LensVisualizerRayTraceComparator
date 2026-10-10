"""The comparator's Python worker kit: what a worker needs to speak the engine protocol, on the standard library.

- ``ndarray``: the bit-exact wire form of numeric arrays;
- ``validate``: the contract's schema validator, a port of ``src/contract/validate.ts``;
- ``protocol``: the NDJSON message loop around an engine object;
- ``fake_engine``: an engine without optics that answers ``selftest.echo``.

The kit imports nothing outside the standard library and writes nothing to disk. It runs on Python 3.10 and later.
"""

CONTRACT_VERSION = "1.0"
"""The contract version this kit reads and writes, as ``<major>.<minor>``."""

CONTRACT_VERSION_1_2 = "1.2"
"""The newest version an engine of this repository says it speaks (``contract.max``): minor 2 added the optical case
with a surface that does not clip (``aperture.semiDiameter`` null, the feature flag ``aperture.unclipped``). Every
message and result is still written to ``CONTRACT_VERSION``."""


def speaks(version: str) -> bool:
    """Whether a document written to ``version`` lies in the range ``CONTRACT_VERSION`` to ``CONTRACT_VERSION_1_2``.

    Versions are ordered by major and then by minor, as numbers (``isContractInRange``, src/contract/version.ts); a
    text that is not ``<major>.<minor>`` in plain decimal is in no range.
    """
    at, low, high = _parse(version), _parse(CONTRACT_VERSION), _parse(CONTRACT_VERSION_1_2)
    return at is not None and low is not None and high is not None and low <= at <= high


def _parse(version: object) -> tuple[int, int] | None:
    """The major and minor of a version, or None when the text is not ``<major>.<minor>`` in plain decimal."""
    if not isinstance(version, str):
        return None
    major, dot, minor = version.partition(".")
    if not dot or not _plain_decimal(major) or not _plain_decimal(minor):
        return None
    return int(major), int(minor)


def _plain_decimal(text: str) -> bool:
    """Whether a text is a number in plain ASCII digits without a leading zero."""
    return text.isascii() and text.isdigit() and (text == "0" or not text.startswith("0"))

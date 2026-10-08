"""What the kit's tests share: where the contract lives, and how its files are read."""

from __future__ import annotations

from pathlib import Path
from typing import Any

from lvrtc_worker_kit.protocol import parse_json

REPO_ROOT: Path = Path(__file__).resolve().parents[4]
"""The repository root: the kit is at workers/python inside it."""

FIXTURE_DIR: Path = REPO_ROOT / "contract" / "fixtures" / "v1"
"""The contract's fixture corpus, shared with the TypeScript tests."""


def read_fixture(*parts: str) -> Any:
    """One fixture file, parsed as the protocol loop parses a line."""
    return parse_json((FIXTURE_DIR.joinpath(*parts)).read_bytes())


def f8_bytes(*bits: int) -> bytes:
    """Float64 elements given as their IEEE 754 bit patterns, as little-endian bytes."""
    return b"".join(pattern.to_bytes(8, "little") for pattern in bits)


def bits_of(data: bytes) -> list[int]:
    """The IEEE 754 bit pattern of every float64 element in little-endian bytes."""
    return [int.from_bytes(data[offset : offset + 8], "little") for offset in range(0, len(data), 8)]

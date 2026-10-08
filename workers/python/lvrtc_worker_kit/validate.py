"""A validator for the subset of JSON Schema draft 2020-12 that the contract's schemas are written in.

This is a port of ``src/contract/validate.ts`` and must stay one: the two are held together by the fixture corpus
in ``contract/fixtures``, which both must accept and reject identically, at the same instance path and with the
same failing keyword. A schema that uses anything outside the subset is refused when it is loaded.

The subset:
  assertions   type, enum, const, minimum, maximum, exclusiveMinimum, exclusiveMaximum, minLength, pattern,
               minItems, maxItems, uniqueItems, items, required, properties, additionalProperties, oneOf, anyOf
  structure    $ref, $defs, $id, $schema
  annotations  title, description

What Python does differently from ECMAScript by default, and what this port does about it:
  - ``True == 1`` and ``isinstance(True, int)``: a boolean is tested for first and is never a number;
  - ``1 == 1.0`` but ``type(1) is not type(1.0)``: numbers are compared as floats, and an integer is a number
    without a fraction however it was written (``4``, ``4.0``, ``4e0``);
  - ``json`` reads ``1e400``, ``NaN`` and ``Infinity`` as floats: a non-finite number anywhere in an instance is
    rejected before any schema is consulted, with the keyword ``finite``;
  - ``$`` matches before a trailing newline: every ``$`` of a pattern is compiled as ``\\Z``;
  - ``[]`` and ``[^]`` are not whole classes but the start of a class that holds ``]``: a pattern with either is
    refused when it is loaded, here as in the TypeScript validator;
  - strings sort by code point, ECMAScript's by UTF-16 code unit: object members are visited in UTF-16 order.
"""

from __future__ import annotations

import json
import math
import re
from collections.abc import Callable, Mapping, Sequence
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

TYPE_NAMES: tuple[str, ...] = ("null", "boolean", "integer", "number", "string", "array", "object")
"""Every name the ``type`` keyword accepts."""

DRAFT = "https://json-schema.org/draft/2020-12/schema"
"""The only ``$schema`` a schema file may state."""

SCHEMA_ID_PREFIX = "urn:lvrtc:contract:v1:"
"""What every schema ``$id`` of contract v1 starts with."""

_DEFINITION_NAME = re.compile(r"[A-Za-z][A-Za-z0-9]*")
# The keywords that assert nothing, and so may share a schema node with a $ref.
_BESIDE_REF = ("$ref", "$id", "$schema", "$defs", "title", "description")
_PRIMITIVE_TYPE_NAMES = ("null", "boolean", "integer", "number", "string")
# An escape, a character class or a "$": what a pattern is split into to find the dots and dollars that matter.
# ECMAScript's dot matches no line terminator, hence the class in the first alternative.
_PATTERN_TOKEN = re.compile(r"\\[^\n\r\u2028\u2029]|\[(?:\\[^\n\r\u2028\u2029]|[^\]\\])*\]|\$")


class SchemaError(ValueError):
    """A schema file that is outside the subset, malformed, or refers to a schema that is not loaded."""


@dataclass(frozen=True)
class ValidationIssue:
    """One reason an instance was rejected. An instance is valid exactly when there are none."""

    path: str
    """JSON Pointer (RFC 6901) to the offending value; "" is the instance itself."""
    keyword: str
    """The schema keyword that failed; "finite" or "json" for a value that is not JSON data."""
    message: str
    """For people; only ``path`` and ``keyword`` are the same in every implementation."""


@dataclass(frozen=True)
class SchemaDocument:
    """A schema file as read: its parsed JSON, and a name for it that load errors quote."""

    source: str
    schema: Any


@dataclass(frozen=True)
class SchemaSet:
    """Checked schemas, ready to validate against. Built only by ``compile_schemas``."""

    ids: tuple[str, ...]
    """The ``$id`` of every file, in the order the files were given."""
    targets: Mapping[str, Mapping[str, Any]]
    """Everything a ``$ref`` can name: ``<$id>`` for a file and ``<$id>#/$defs/<name>`` for each definition."""
    patterns: Mapping[str, re.Pattern[str]] = field(default_factory=dict)
    """Every ``pattern`` of the schemas, compiled so that it matches what ECMAScript matches."""


# ── JSON values ──────────────────────────────────────────────────────────────────────────────────────────────────


def _is_number(value: Any) -> bool:
    return isinstance(value, (int, float)) and not isinstance(value, bool)


def _is_finite_number(value: Any) -> bool:
    """A number that is a float64: not NaN, not an infinity, and not an integer too large to be one."""
    if not _is_number(value):
        return False
    try:
        return math.isfinite(float(value))
    except OverflowError:
        return False


def _is_integer(value: Any) -> bool:
    return _is_finite_number(value) and (isinstance(value, int) or value.is_integer())


def _is_primitive(value: Any) -> bool:
    return value is None or isinstance(value, (bool, str)) or _is_finite_number(value)


def _primitive_key(value: Any) -> tuple[Any, ...]:
    """A primitive as JSON sees it: equal keys exactly when type and value are equal. 1 is 1.0; neither is true."""
    if value is None:
        return ("null",)
    if isinstance(value, bool):
        return ("boolean", value)
    if isinstance(value, str):
        return ("string", value)
    return ("number", float(value))


def _json_type_of(value: Any) -> str | None:
    """The JSON type of a value, or None when it is not JSON data: a tuple, a set, bytes, a class instance."""
    if value is None:
        return "null"
    if isinstance(value, bool):
        return "boolean"
    if _is_number(value):
        return "number"
    if isinstance(value, str):
        return "string"
    if isinstance(value, list):
        return "array"
    if isinstance(value, dict) and all(isinstance(name, str) for name in value):
        return "object"
    return None


def _utf16_order(name: str) -> bytes:
    """A sort key that orders strings as ECMAScript does, by UTF-16 code unit."""
    return name.encode("utf-16-be", "surrogatepass")


def _child_path(path: str, key: str | int) -> str:
    """One step deeper in a JSON Pointer."""
    return f"{path}/{str(key).replace('~', '~0').replace('/', '~1')}"


def _show(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, separators=(",", ":"))


# ── Loading ──────────────────────────────────────────────────────────────────────────────────────────────────────


def _fail(where: str, message: str) -> Any:
    raise SchemaError(f"schema {where}: {message}")


def _is_distinct_list(value: Any, is_member: Callable[[Any], bool]) -> bool:
    """A list whose members all pass ``is_member`` and are pairwise different. Meant for primitives."""
    if not isinstance(value, list) or not all(is_member(member) for member in value):
        return False
    return len({_primitive_key(member) for member in value}) == len(value)


def _is_type_name(value: Any) -> bool:
    return isinstance(value, str) and value in TYPE_NAMES


def _compile_pattern(value: Any, at: str) -> re.Pattern[str]:
    if not isinstance(value, str) or not value.startswith("^") or not value.endswith("$") or value.endswith("\\$"):
        _fail(at, "must be a string anchored with ^ and $")
    # Every escape and every character class, as ECMAScript reads them.
    if any(token.group() in ("[]", "[^]") for token in _PATTERN_TOKEN.finditer(value)):
        _fail(at, "[] and [^] are whole classes in ECMAScript and the start of a class in Python")
    # What is left once they are taken out: a dot in it is the wildcard.
    outside_classes = _PATTERN_TOKEN.sub(lambda token: "$" if token.group() == "$" else "", value)
    if re.search(r"\\[dDwWsSbB]", value) or "." in outside_classes:
        _fail(at, "\\d, \\w, \\s, \\b and a dot outside a character class match differently in ECMAScript and Python")
    # ECMAScript's $ is the very end of the string; Python's also matches before a trailing newline. \Z does not.
    translated = _PATTERN_TOKEN.sub(lambda token: "\\Z" if token.group() == "$" else token.group(), value)
    try:
        return re.compile(translated)
    except (re.error, RecursionError, OverflowError):
        return _fail(at, "is not a regular expression")


def _check_node(
    node: Any, where: str, base: str, is_root: bool, refs: list[tuple[str, str, str]], patterns: dict[str, Any]
) -> None:
    """Checks one schema node and everything below it against the subset, and notes each $ref for resolution."""
    if not isinstance(node, dict):
        _fail(where, "a schema must be an object")

    def below(value: Any, at: str) -> None:
        _check_node(value, at, base, False, refs, patterns)

    for keyword, value in node.items():
        at = f"{where}/{keyword}"
        if keyword == "$schema":
            if not is_root or not isinstance(value, str) or value != DRAFT:
                _fail(at, f'must be "{DRAFT}", at the root of a file')
        elif keyword == "$id":
            if not is_root:
                _fail(at, "only the root of a file has an $id")
        elif keyword == "$defs":
            if not is_root or not isinstance(value, dict):
                _fail(at, "must be an object, at the root of a file")
            for name, definition in value.items():
                if _DEFINITION_NAME.fullmatch(name) is None:
                    _fail(f"{at}/{name}", "a definition name is letters and digits")
                below(definition, f"{at}/{name}")
        elif keyword in ("title", "description"):
            if not isinstance(value, str):
                _fail(at, "must be a string")
        elif keyword == "$ref":
            if not isinstance(value, str):
                _fail(at, "must be a string")
            refs.append((value, base, at))
        elif keyword == "type":
            if not _is_type_name(value) and not (_is_distinct_list(value, _is_type_name) and len(value) > 0):
                _fail(at, f"must be one of {', '.join(TYPE_NAMES)}, or a non-empty list of distinct ones")
        elif keyword == "enum":
            if not _is_distinct_list(value, _is_primitive) or len(value) == 0:
                _fail(at, "must be a non-empty list of distinct primitives")
        elif keyword == "const":
            if not _is_primitive(value):
                _fail(at, "must be a primitive")
        elif keyword in ("minimum", "maximum", "exclusiveMinimum", "exclusiveMaximum"):
            if not _is_finite_number(value):
                _fail(at, "must be a finite number")
        elif keyword in ("minLength", "minItems", "maxItems"):
            if not _is_integer(value) or value < 0:
                _fail(at, "must be a non-negative integer")
        elif keyword == "pattern":
            compiled = _compile_pattern(value, at)
            patterns[value] = compiled
        elif keyword == "uniqueItems":
            if not isinstance(value, bool):
                _fail(at, "must be a boolean")
        elif keyword == "required":
            if not _is_distinct_list(value, lambda name: isinstance(name, str)):
                _fail(at, "must be a list of distinct property names")
        elif keyword == "properties":
            if not isinstance(value, dict):
                _fail(at, "must be an object of schemas")
            for name, member in value.items():
                below(member, f"{at}/{name}")
        elif keyword == "additionalProperties":
            if not isinstance(value, bool):
                below(value, at)
        elif keyword == "items":
            below(value, at)
        elif keyword in ("oneOf", "anyOf"):
            if not isinstance(value, list) or len(value) == 0:
                _fail(at, "must be a non-empty list of schemas")
            for index, option in enumerate(value):
                below(option, f"{at}/{index}")
        else:
            _fail(at, "unknown keyword")

    if "$ref" in node:
        beside = next((keyword for keyword in node if keyword not in _BESIDE_REF), None)
        if beside is not None:
            _fail(f"{where}/{beside}", "a $ref stands alone: no assertion may sit beside it")
    if node.get("uniqueItems") is True:
        # Only primitives are compared, so the schema itself must rule everything else out.
        items = node.get("items")
        item_type = items.get("type") if isinstance(items, dict) else None
        names = [item_type] if isinstance(item_type, str) else item_type
        if not isinstance(names, list) or not all(
            isinstance(name, str) and name in _PRIMITIVE_TYPE_NAMES for name in names
        ):
            _fail(f"{where}/uniqueItems", "needs a sibling items schema whose type names only primitive types")


def compile_schemas(documents: Sequence[SchemaDocument]) -> SchemaSet:
    """Checks schema files against the subset and links them.

    Raises a ``SchemaError`` naming the file and the JSON Pointer of the first fault: an unknown keyword, a
    malformed keyword value, a file without an ``$id``, two files with the same ``$id``, or a ``$ref`` that names
    no loaded schema. Nothing is fetched: a ``$ref`` resolves only among ``documents``.
    """
    ids: list[str] = []
    targets: dict[str, Mapping[str, Any]] = {}
    refs: list[tuple[str, str, str]] = []
    patterns: dict[str, Any] = {}
    for document in documents:
        schema = document.schema
        schema_id = schema.get("$id") if isinstance(schema, dict) else None
        if not isinstance(schema_id, str) or schema_id == "" or "#" in schema_id:
            _fail(document.source, "a schema file is an object with a non-empty $id that has no fragment")
        if schema_id in targets:
            _fail(document.source, f'the $id "{schema_id}" is already taken by another file')
        _check_node(schema, f"{document.source}#", schema_id, True, refs, patterns)
        ids.append(schema_id)
        targets[schema_id] = schema
        for name, definition in schema.get("$defs", {}).items():
            targets[f"{schema_id}#/$defs/{name}"] = definition
    for ref, base, where in refs:
        if (base + ref if ref.startswith("#") else ref) not in targets:
            _fail(where, f'"{ref}" names no loaded schema')
    return SchemaSet(ids=tuple(ids), targets=targets, patterns=patterns)


# ── Validating ───────────────────────────────────────────────────────────────────────────────────────────────────


def _check_json(value: Any, path: str, issues: list[ValidationIssue], ancestors: set[int]) -> None:
    """Reports every value in the instance that JSON cannot carry. No schema can accept one."""
    kind = _json_type_of(value)
    if kind is None:
        issues.append(ValidationIssue(path, "json", f"{type(value).__name__} is not JSON data"))
    elif kind == "number" and not _is_finite_number(value):
        issues.append(ValidationIssue(path, "finite", "the number is not a finite float64"))
    elif id(value) in ancestors:
        issues.append(ValidationIssue(path, "json", "a circular reference is not JSON data"))
    elif kind == "array":
        ancestors.add(id(value))
        for index, item in enumerate(value):
            _check_json(item, _child_path(path, index), issues, ancestors)
        ancestors.discard(id(value))
    elif kind == "object":
        ancestors.add(id(value))
        for name in sorted(value, key=_utf16_order):
            _check_json(value[name], _child_path(path, name), issues, ancestors)
        ancestors.discard(id(value))


def _try_alternatives(
    schemas: SchemaSet, alternatives: Sequence[Mapping[str, Any]], base: str, value: Any, path: str
) -> tuple[int, list[str]]:
    """How many alternatives accept the value, and the first issue of each one that does not."""
    matched = 0
    failures: list[str] = []
    for index, alternative in enumerate(alternatives):
        issues: list[ValidationIssue] = []
        _check(schemas, alternative, base, value, path, issues)
        if not issues:
            matched += 1
        else:
            first = issues[0]
            failures.append(f"[{index}] {first.path or '(root)'} {first.keyword}: {first.message}")
    return matched, failures


def _check(
    schemas: SchemaSet, schema: Mapping[str, Any], base: str, value: Any, path: str, issues: list[ValidationIssue]
) -> None:
    """Appends to ``issues`` every way ``value`` breaks ``schema``. ``base`` is the ``$id`` of the schema's file."""

    def report(keyword: str, message: str) -> None:
        issues.append(ValidationIssue(path, keyword, message))

    if "$ref" in schema:
        ref = schema["$ref"]
        key = base + ref if ref.startswith("#") else ref
        target = schemas.targets.get(key)
        if target is None:
            raise SchemaError(f'validate: "{key}" names no loaded schema')
        _check(schemas, target, key.split("#")[0], value, path, issues)
        return  # a $ref stands alone

    kind = _json_type_of(value)
    is_number = kind == "number"
    if "type" in schema:
        allowed = [schema["type"]] if isinstance(schema["type"], str) else schema["type"]
        if not any(name == kind or (name == "integer" and _is_integer(value)) for name in allowed):
            report("type", f"expected {' or '.join(allowed)}, got {kind}")
            return
    # Primitives compare by JSON type and value: 1 equals 1.0, and neither equals true or "1".
    own = _primitive_key(value) if _is_primitive(value) else None
    if "enum" in schema and not any(_primitive_key(option) == own for option in schema["enum"]):
        report("enum", f"must be one of {_show(schema['enum'])}")
    if "const" in schema and _primitive_key(schema["const"]) != own:
        report("const", f"must be {_show(schema['const'])}")

    if is_number:
        # As a float, which is what the number is in ECMAScript; the bounds are compared the same way.
        number = float(value)
        if "minimum" in schema and number < float(schema["minimum"]):
            report("minimum", f"must be at least {schema['minimum']}")
        if "maximum" in schema and number > float(schema["maximum"]):
            report("maximum", f"must be at most {schema['maximum']}")
        if "exclusiveMinimum" in schema and number <= float(schema["exclusiveMinimum"]):
            report("exclusiveMinimum", f"must be greater than {schema['exclusiveMinimum']}")
        if "exclusiveMaximum" in schema and number >= float(schema["exclusiveMaximum"]):
            report("exclusiveMaximum", f"must be less than {schema['exclusiveMaximum']}")

    if kind == "string":
        # len() counts Unicode code points, as the draft does.
        if "minLength" in schema and len(value) < schema["minLength"]:
            report("minLength", f"must be at least {schema['minLength']} character(s) long")
        if "pattern" in schema and schemas.patterns[schema["pattern"]].search(value) is None:
            report("pattern", f"must match {schema['pattern']}")

    if kind == "array":
        if "minItems" in schema and len(value) < schema["minItems"]:
            report("minItems", f"must have at least {schema['minItems']} item(s), has {len(value)}")
        if "maxItems" in schema and len(value) > schema["maxItems"]:
            report("maxItems", f"must have at most {schema['maxItems']} item(s), has {len(value)}")
        if schema.get("uniqueItems") is True:
            first_index: dict[tuple[Any, ...], int] = {}
            for index, item in enumerate(value):
                if not _is_primitive(item):
                    continue
                key_of_item = _primitive_key(item)
                if key_of_item in first_index:
                    report("uniqueItems", f"items {first_index[key_of_item]} and {index} are equal")
                else:
                    first_index[key_of_item] = index
        if "items" in schema:
            for index, item in enumerate(value):
                _check(schemas, schema["items"], base, item, _child_path(path, index), issues)

    if kind == "object":
        for name in schema.get("required", ()):
            if name not in value:
                report("required", f'missing property "{name}"')
        properties = schema.get("properties", {})
        additional = schema.get("additionalProperties")
        # Sorted, so the issues come in the same order in every implementation.
        for name in sorted(value, key=_utf16_order):
            child = _child_path(path, name)
            if name in properties:
                _check(schemas, properties[name], base, value[name], child, issues)
            elif additional is False:
                issues.append(ValidationIssue(child, "additionalProperties", "unexpected property"))
            elif isinstance(additional, dict):
                _check(schemas, additional, base, value[name], child, issues)

    if "oneOf" in schema:
        matched, failures = _try_alternatives(schemas, schema["oneOf"], base, value, path)
        if matched == 0:
            report("oneOf", f"matches none of the alternatives: {'; '.join(failures)}")
        elif matched > 1:
            report("oneOf", f"matches {matched} alternatives, must match exactly one")
    if "anyOf" in schema:
        matched, failures = _try_alternatives(schemas, schema["anyOf"], base, value, path)
        if matched == 0:
            report("anyOf", f"matches none of the alternatives: {'; '.join(failures)}")


def validate(schemas: SchemaSet, schema_id: str, value: Any) -> list[ValidationIssue]:
    """Validates ``value`` against the schema that ``schema_id`` names: a file's ``$id``, or ``<$id>#/$defs/<name>``.

    Returns every issue found, in a fixed order, and an empty list exactly when the value is valid. A value that is
    not JSON data (a non-finite number anywhere in it, a tuple, a class instance) is never valid, whatever the
    schema says. Raises a ``SchemaError`` when ``schema_id`` names no schema in the set.
    """
    schema = schemas.targets.get(schema_id)
    if schema is None:
        raise SchemaError(f'validate: "{schema_id}" names no loaded schema')
    issues: list[ValidationIssue] = []
    _check_json(value, "", issues, set())
    if not issues:
        _check(schemas, schema, schema_id.split("#")[0], value, "", issues)
    return issues


def format_issues(issues: Sequence[ValidationIssue]) -> str:
    """Issues as one line of text: ``/system/stopIndex [type] expected integer, got string; ...``."""
    return "; ".join(f"{issue.path or '(root)'} [{issue.keyword}] {issue.message}" for issue in issues)


# ── The contract's own schemas ───────────────────────────────────────────────────────────────────────────────────

DEFAULT_SCHEMA_DIR: Path = Path(__file__).resolve().parents[3] / "contract" / "schema" / "v1"
"""Where the contract's schema files are when the kit runs from its place in the repository."""

_loaded: dict[Path, SchemaSet] = {}


def load_schema_directory(directory: Path | str) -> SchemaSet:
    """Reads every ``*.schema.json`` below ``directory``, at any depth, in sorted path order, as one set.

    Other files are ignored. Raises a ``SchemaError`` for a directory that does not exist, one naming the file for
    JSON that does not parse, and as ``compile_schemas`` does for a schema outside the subset.
    """
    root = Path(directory)
    if not root.is_dir():
        raise SchemaError(f"schema directory {root} does not exist")
    files = sorted(path.relative_to(root).as_posix() for path in root.rglob("*.schema.json") if path.is_file())
    documents: list[SchemaDocument] = []
    for file in files:
        try:
            documents.append(SchemaDocument(file, json.loads((root / file).read_text(encoding="utf-8"))))
        except (OSError, ValueError) as error:
            raise SchemaError(f"schema {file}: {error}") from error
    return compile_schemas(documents)


def contract_schemas(directory: Path | str | None = None) -> SchemaSet:
    """The contract's schemas: those of ``directory``, or of ``DEFAULT_SCHEMA_DIR`` when none is given.

    A directory is read and compiled on the first call that names it and kept for the life of the process.
    """
    root = Path(directory).resolve() if directory is not None else DEFAULT_SCHEMA_DIR
    if root not in _loaded:
        _loaded[root] = load_schema_directory(root)
    return _loaded[root]


def kind_schema_id(kind: str) -> str:
    """The ``$id`` of the schema for a kind of document, such as ``request`` or ``optical-case``."""
    return f"{SCHEMA_ID_PREFIX}{kind}"


def quantity_schema_id(quantity: str, part: str) -> str:
    """The ``$id`` of a quantity's schema: ``part`` is "spec" for a request's spec, "data" for an ok result's data."""
    return f"{SCHEMA_ID_PREFIX}quantities:{quantity}.{part}"


def validate_kind(kind: str, value: Any, schemas: SchemaSet | None = None) -> list[ValidationIssue]:
    """Validates a document against the schema of its kind; an empty list exactly when it is valid."""
    return validate(schemas if schemas is not None else contract_schemas(), kind_schema_id(kind), value)

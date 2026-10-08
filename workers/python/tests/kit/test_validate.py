"""The validator: the whole shared corpus, then each keyword, then what Python gets wrong by default."""

from __future__ import annotations

import math
import unittest
from typing import Any

from lvrtc_worker_kit.validate import (
    DRAFT,
    SCHEMA_ID_PREFIX,
    SchemaDocument,
    SchemaError,
    compile_schemas,
    contract_schemas,
    format_issues,
    kind_schema_id,
    load_schema_directory,
    quantity_schema_id,
    validate,
    validate_kind,
)

from .support import FIXTURE_DIR, REPO_ROOT, read_fixture

ID = "urn:test:schema"


def issues_of(schema: dict[str, Any], value: Any, *others: dict[str, Any]) -> list[tuple[str, str]]:
    """The (path, keyword) of every issue ``value`` has against ``schema``, compiled with any other files."""
    documents = [SchemaDocument("test.json", {"$id": ID, **schema})]
    documents += [SchemaDocument(f"other{index}.json", other) for index, other in enumerate(others)]
    return [(issue.path, issue.keyword) for issue in validate(compile_schemas(documents), ID, value)]


def load_error(schema: Any, *others: Any) -> str:
    """The message of the error that loading ``schema`` raises; fails when it loads."""
    documents = [SchemaDocument("test.json", schema)]
    documents += [SchemaDocument(f"other{index}.json", other) for index, other in enumerate(others)]
    try:
        compile_schemas(documents)
    except SchemaError as error:
        return str(error)
    raise AssertionError("the schema loaded")


class CorpusTest(unittest.TestCase):
    """Both implementations must accept and reject the corpus identically; this is the Python half."""

    def schema_names(self, side: str) -> list[str]:
        root = FIXTURE_DIR / side
        return sorted({path.parent.relative_to(root).as_posix() for path in root.rglob("*.json")})

    def schema_id(self, name: str) -> str:
        return SCHEMA_ID_PREFIX + name.replace("/", ":")

    def test_the_corpus_covers_every_schema_that_is_not_only_a_part_of_others(self) -> None:
        schemas = contract_schemas()
        shared = (f"{SCHEMA_ID_PREFIX}common", f"{SCHEMA_ID_PREFIX}provenance")
        expected = sorted(schema_id for schema_id in schemas.ids if schema_id not in shared)
        for side in ("valid", "invalid"):
            self.assertEqual(sorted(self.schema_id(name) for name in self.schema_names(side)), expected, side)

    def test_every_valid_fixture_passes_the_schema_of_its_directory(self) -> None:
        schemas = contract_schemas()
        seen = 0
        for name in self.schema_names("valid"):
            for file in sorted((FIXTURE_DIR / "valid" / name).glob("*.json")):
                issues = validate(schemas, self.schema_id(name), read_fixture("valid", name, file.name))
                self.assertEqual(issues, [], f"valid/{name}/{file.name}: {format_issues(issues)}")
                seen += 1
        self.assertGreater(seen, 30)

    def test_every_invalid_fixture_fails_with_the_one_issue_its_expectation_names(self) -> None:
        schemas = contract_schemas()
        seen = 0
        for name in self.schema_names("invalid"):
            directory = FIXTURE_DIR / "invalid" / name
            expectations = sorted(directory.glob("*.expect.json"))
            documents = sorted(file for file in directory.glob("*.json") if not file.name.endswith(".expect.json"))
            self.assertEqual(
                [file.name[: -len(".expect.json")] for file in expectations],
                [file.name[: -len(".json")] for file in documents],
                name,
            )
            for file in expectations:
                expectation = read_fixture("invalid", name, file.name)
                self.assertEqual(sorted(expectation), ["keyword", "path"], file.name)
                document = file.name[: -len(".expect.json")] + ".json"
                issues = validate(schemas, self.schema_id(name), read_fixture("invalid", name, document))
                self.assertEqual(
                    [{"path": issue.path, "keyword": issue.keyword} for issue in issues],
                    [expectation],
                    f"invalid/{name}/{document}",
                )
                seen += 1
        self.assertGreater(seen, 60)

    def test_the_cross_language_fixtures_are_among_them(self) -> None:
        # Named in CONTRACT.md as the fixtures an implementation in any language must pass.
        for parts in (
            ("valid", "engine-descriptor", "integers-as-floats.json"),
            ("invalid", "optical-case", "number-overflow.json"),
            ("invalid", "request", "spec-number-overflow.json"),
            ("invalid", "run-spec", "name-with-trailing-newline.json"),
            ("invalid", "engine-descriptor", "concurrency-as-boolean.json"),
            ("invalid", "result", "count-as-boolean.json"),
            ("invalid", "protocol-response", "ok-as-number.json"),
        ):
            self.assertTrue(FIXTURE_DIR.joinpath(*parts).is_file(), "/".join(parts))
        overflow = read_fixture("invalid", "optical-case", "number-overflow.json")
        self.assertEqual([issue.keyword for issue in validate_kind("optical-case", overflow)], ["finite"])

    def test_the_schemas_are_found_beside_the_kit_or_where_they_are_said_to_be(self) -> None:
        directory = REPO_ROOT / "contract" / "schema" / "v1"
        self.assertEqual(contract_schemas(directory).ids, contract_schemas().ids)
        self.assertIs(contract_schemas(directory), contract_schemas(str(directory)))
        loaded = load_schema_directory(directory)
        self.assertIn(kind_schema_id("optical-case"), loaded.targets)
        self.assertIn(quantity_schema_id("selftest.echo", "spec"), loaded.targets)
        self.assertEqual(list(loaded.ids), sorted(loaded.ids, key=lambda i: i.replace(":", "/")))
        with self.assertRaises(SchemaError):
            validate(loaded, "urn:lvrtc:contract:v1:nothing", {})

    def test_a_schema_directory_that_is_not_there_is_an_error_and_not_an_empty_set(self) -> None:
        # A kit copied away from its repository must say so when it starts, not refuse every message later.
        missing = REPO_ROOT / "contract" / "schema" / "v0"
        for load in (load_schema_directory, contract_schemas):
            with self.assertRaisesRegex(SchemaError, r"^schema directory .*v0 does not exist$"):
                load(missing)


class TypeTest(unittest.TestCase):
    def test_each_name_accepts_its_own_json_type_and_no_other(self) -> None:
        samples: dict[str, Any] = {
            "null": None,
            "boolean": True,
            "number": 1.5,
            "string": "a",
            "array": [1],
            "object": {"a": 1},
        }
        for name in samples:
            for other, value in samples.items():
                expected = [] if other == name else [("", "type")]
                self.assertEqual(issues_of({"type": name}, value), expected, f"{name} / {other}")

    def test_a_boolean_is_not_a_number_and_not_an_integer(self) -> None:
        for name in ("number", "integer"):
            for value in (True, False):
                self.assertEqual(issues_of({"type": name}, value), [("", "type")], f"{name} / {value}")
        self.assertEqual(issues_of({"type": "boolean"}, 1), [("", "type")])
        self.assertEqual(issues_of({"type": "boolean"}, 0), [("", "type")])
        self.assertEqual(issues_of({"type": ["integer", "boolean"]}, True), [])

    def test_integer_is_a_number_without_a_fraction_however_it_was_written(self) -> None:
        for value in (4, 4.0, 4e0, -3.0, 0, -0.0, 1e300, 2**70):
            self.assertEqual(issues_of({"type": "integer"}, value), [], repr(value))
        for value in (4.5, 1e-9, "4", None):
            self.assertEqual(issues_of({"type": "integer"}, value), [("", "type")], repr(value))

    def test_a_list_accepts_any_of_its_names(self) -> None:
        schema = {"type": ["string", "null"]}
        self.assertEqual(issues_of(schema, "a"), [])
        self.assertEqual(issues_of(schema, None), [])
        self.assertEqual(issues_of(schema, 1), [("", "type")])

    def test_a_value_of_the_wrong_type_gets_that_issue_and_no_other_from_the_same_schema(self) -> None:
        schema = {"type": "string", "enum": ["a"], "minLength": 3, "oneOf": [{"type": "number"}]}
        self.assertEqual(issues_of(schema, 5), [("", "type")])


class ValueKeywordTest(unittest.TestCase):
    def test_enum_and_const_compare_primitives_by_json_type_and_value(self) -> None:
        self.assertEqual(issues_of({"enum": [1, "a", None, True]}, 1.0), [])
        self.assertEqual(issues_of({"enum": [1.0]}, 1), [])
        self.assertEqual(issues_of({"enum": [1]}, True), [("", "enum")])
        self.assertEqual(issues_of({"enum": [0]}, False), [("", "enum")])
        self.assertEqual(issues_of({"enum": [True]}, 1), [("", "enum")])
        self.assertEqual(issues_of({"enum": [False]}, 0), [("", "enum")])
        self.assertEqual(issues_of({"enum": ["1"]}, 1), [("", "enum")])
        self.assertEqual(issues_of({"enum": [None]}, 0), [("", "enum")])
        self.assertEqual(issues_of({"enum": ["a"]}, ["a"]), [("", "enum")])
        self.assertEqual(issues_of({"enum": [0]}, -0.0), [])

        self.assertEqual(issues_of({"const": True}, True), [])
        self.assertEqual(issues_of({"const": True}, 1), [("", "const")])
        self.assertEqual(issues_of({"const": 1}, True), [("", "const")])
        self.assertEqual(issues_of({"const": 1}, 1.0), [])
        self.assertEqual(issues_of({"const": None}, None), [])
        self.assertEqual(issues_of({"const": None}, False), [("", "const")])
        self.assertEqual(issues_of({"const": "f8"}, "i4"), [("", "const")])
        self.assertEqual(issues_of({"const": 1}, {"a": 1}), [("", "const")])

    def test_minimum_and_maximum_include_their_bound_and_the_exclusive_forms_do_not(self) -> None:
        self.assertEqual(issues_of({"minimum": 0}, 0), [])
        self.assertEqual(issues_of({"minimum": 0}, -0.0), [])
        self.assertEqual(issues_of({"minimum": 0}, -1e-300), [("", "minimum")])
        self.assertEqual(issues_of({"maximum": 1}, 1.0), [])
        self.assertEqual(issues_of({"maximum": 1}, 1.0000000000000002), [("", "maximum")])
        self.assertEqual(issues_of({"exclusiveMinimum": 0}, 0), [("", "exclusiveMinimum")])
        self.assertEqual(issues_of({"exclusiveMinimum": 0}, 5e-324), [])
        self.assertEqual(issues_of({"exclusiveMaximum": 0}, 0), [("", "exclusiveMaximum")])
        self.assertEqual(issues_of({"exclusiveMaximum": 0}, -0.0), [("", "exclusiveMaximum")])
        self.assertEqual(issues_of({"exclusiveMaximum": 0}, -5e-324), [])
        self.assertEqual(issues_of({"exclusiveMaximum": 90}, 90), [("", "exclusiveMaximum")])
        self.assertEqual(issues_of({"exclusiveMaximum": 90}, 89.99999999999999), [])
        self.assertEqual(issues_of({"exclusiveMaximum": 90}, 91), [("", "exclusiveMaximum")])

    def test_numbers_are_compared_as_float64_as_ecmascript_compares_them(self) -> None:
        # 2**53 + 1 is not a float64: ECMAScript reads it as 2**53, which is not above the bound.
        self.assertEqual(issues_of({"maximum": 2**53}, 2**53 + 1), [])
        self.assertEqual(issues_of({"exclusiveMinimum": 2**53}, 2**53 + 1), [("", "exclusiveMinimum")])
        self.assertEqual(issues_of({"enum": [2**53]}, 2**53 + 1), [])

    def test_numeric_keywords_say_nothing_about_values_that_are_not_numbers(self) -> None:
        schema = {"minimum": 5, "maximum": 1, "exclusiveMinimum": 5, "exclusiveMaximum": 1}
        for value in ("7", None, [7], {"a": 7}, True):
            self.assertEqual(issues_of(schema, value), [], repr(value))

    def test_min_length_counts_unicode_code_points(self) -> None:
        self.assertEqual(issues_of({"minLength": 1}, ""), [("", "minLength")])
        self.assertEqual(issues_of({"minLength": 2}, "\U0001f600"), [("", "minLength")])
        self.assertEqual(issues_of({"minLength": 1}, "\U0001f600"), [])
        self.assertEqual(issues_of({"minLength": 2.0}, "ab"), [])
        self.assertEqual(issues_of({"minLength": 2}, [1]), [])

    def test_pattern_must_match_the_whole_string(self) -> None:
        schema = {"pattern": "^[a-z]+$"}
        self.assertEqual(issues_of(schema, "abc"), [])
        for value in ("abc1", "1abc", "", "Abc", "abc ", " abc"):
            self.assertEqual(issues_of(schema, value), [("", "pattern")], repr(value))
        self.assertEqual(issues_of(schema, 5), [])

    def test_a_dollar_does_not_match_before_a_trailing_newline(self) -> None:
        # Python's own $ would: re.search("^abc$", "abc\n") matches.
        self.assertEqual(issues_of({"pattern": "^abc$"}, "abc\n"), [("", "pattern")])
        self.assertEqual(issues_of({"pattern": "^[a-z]*$"}, "\n"), [("", "pattern")])
        self.assertEqual(issues_of({"pattern": "^(a$|b)$"}, "a\n"), [("", "pattern")])
        self.assertEqual(issues_of({"pattern": "^(a$|b)$"}, "a"), [])
        self.assertEqual(issues_of({"pattern": "^[$]$"}, "$"), [])
        self.assertEqual(issues_of({"pattern": "^a\\$b$"}, "a$b"), [])
        self.assertEqual(issues_of({"pattern": "^a\\.b$"}, "a.b"), [])
        self.assertEqual(issues_of({"pattern": "^a\\.b$"}, "axb"), [("", "pattern")])
        self.assertEqual(issues_of({"pattern": "^[A-Za-z0-9][A-Za-z0-9._-]*$"}, "double-gauss\n"), [("", "pattern")])


class ArrayKeywordTest(unittest.TestCase):
    def test_items_validates_every_element_and_reports_each_failure_at_its_index(self) -> None:
        schema = {"items": {"type": "number"}}
        self.assertEqual(issues_of(schema, [1, "a", 2, None]), [("/1", "type"), ("/3", "type")])
        self.assertEqual(issues_of(schema, []), [])

    def test_min_items_and_max_items_bound_the_length(self) -> None:
        schema = {"minItems": 2, "maxItems": 2.0}
        self.assertEqual(issues_of(schema, [1, 2]), [])
        self.assertEqual(issues_of(schema, [1]), [("", "minItems")])
        self.assertEqual(issues_of(schema, [1, 2, 3]), [("", "maxItems")])
        self.assertEqual(issues_of(schema, "a"), [])

    def test_unique_items_compares_numbers_by_value_whatever_their_spelling(self) -> None:
        schema = {"type": "array", "items": {"type": "number"}, "uniqueItems": True}
        self.assertEqual(issues_of(schema, [1, 2, 3]), [])
        self.assertEqual(issues_of(schema, [1, 1.0]), [("", "uniqueItems")])
        self.assertEqual(issues_of(schema, [10, 1e1, 10.0]), [("", "uniqueItems"), ("", "uniqueItems")])
        self.assertEqual(issues_of(schema, [0, -0.0]), [("", "uniqueItems")])
        self.assertEqual(issues_of(schema, [0.1, 0.1 + 1e-18]), [("", "uniqueItems")])
        self.assertEqual(issues_of(schema, [0.1, 0.2, 0.30000000000000004, 0.3]), [])

    def test_unique_items_compares_primitives_by_json_type(self) -> None:
        mixed = {"items": {"type": ["number", "boolean", "string", "null"]}, "uniqueItems": True}
        self.assertEqual(issues_of(mixed, [1, True, "1", None, 0, False, "", "true"]), [])
        self.assertEqual(issues_of(mixed, [True, True]), [("", "uniqueItems")])
        self.assertEqual(issues_of(mixed, [None, None]), [("", "uniqueItems")])
        self.assertEqual(issues_of(mixed, ["a", "b", "a"]), [("", "uniqueItems")])

    def test_unique_items_leaves_an_item_of_the_wrong_type_to_the_items_schema(self) -> None:
        schema = {"items": {"type": "string"}, "uniqueItems": True}
        self.assertEqual(issues_of(schema, [["a"], ["a"]]), [("/0", "type"), ("/1", "type")])


class ObjectKeywordTest(unittest.TestCase):
    def test_required_names_each_missing_property_at_the_object(self) -> None:
        schema = {"required": ["a", "b"]}
        self.assertEqual(issues_of(schema, {"a": 1, "b": None}), [])
        self.assertEqual(issues_of(schema, {}), [("", "required"), ("", "required")])
        self.assertEqual(issues_of(schema, []), [])

    def test_properties_and_additional_properties(self) -> None:
        schema = {"properties": {"a": {"type": "number"}}, "additionalProperties": False}
        self.assertEqual(issues_of(schema, {"a": 1}), [])
        self.assertEqual(issues_of(schema, {"a": "x", "b": 1}), [("/a", "type"), ("/b", "additionalProperties")])
        typed = {"properties": {"a": {"type": "number"}}, "additionalProperties": {"type": "string"}}
        self.assertEqual(issues_of(typed, {"a": 1, "b": "x", "c": 2}), [("/c", "type")])
        self.assertEqual(issues_of({"properties": {"a": {"type": "number"}}}, {"b": "anything"}), [])

    def test_members_are_visited_in_utf16_order_as_ecmascript_sorts_them(self) -> None:
        # U+FF5E is one code unit, U+1F600 a surrogate pair that starts with D83D: ECMAScript sorts the pair first.
        schema = {"additionalProperties": False}
        value = {"～": 1, "\U0001f600": 2, "b": 3, "a": 4}
        self.assertEqual(
            [path for path, _ in issues_of(schema, value)],
            ["/a", "/b", "/\U0001f600", "/～"],
        )

    def test_a_path_is_a_json_pointer_with_tilde_and_slash_escaped(self) -> None:
        schema = {"additionalProperties": {"items": {"type": "number"}}}
        self.assertEqual(issues_of(schema, {"a/b": [1, "x"], "c~d": ["y"]}), [("/a~1b/1", "type"), ("/c~0d/0", "type")])


class AlternativesTest(unittest.TestCase):
    def test_one_of_needs_exactly_one_alternative_to_accept_the_value(self) -> None:
        schema = {"oneOf": [{"type": "number"}, {"type": "integer"}, {"type": "string"}]}
        self.assertEqual(issues_of(schema, "a"), [])
        self.assertEqual(issues_of(schema, 1.5), [])
        self.assertEqual(issues_of(schema, 1), [("", "oneOf")])
        self.assertEqual(issues_of(schema, None), [("", "oneOf")])

    def test_any_of_needs_at_least_one_alternative_to_accept_the_value(self) -> None:
        schema = {"anyOf": [{"type": "number"}, {"type": "integer"}, {"type": "string"}]}
        self.assertEqual(issues_of(schema, 1), [])
        self.assertEqual(issues_of(schema, "a"), [])
        self.assertEqual(issues_of(schema, None), [("", "anyOf")])
        # The contract's nonZero: a number on either side of 0.
        non_zero = {"type": "number", "anyOf": [{"exclusiveMinimum": 0}, {"exclusiveMaximum": 0}]}
        self.assertEqual(issues_of(non_zero, -2), [])
        self.assertEqual(issues_of(non_zero, 1e-300), [])
        self.assertEqual(issues_of(non_zero, 0), [("", "anyOf")])
        self.assertEqual(issues_of(non_zero, -0.0), [("", "anyOf")])

    def test_a_failure_inside_an_alternative_is_reported_at_the_value_with_the_keyword(self) -> None:
        schema = {"properties": {"a": {"oneOf": [{"type": "object", "required": ["x"]}, {"type": "string"}]}}}
        self.assertEqual(issues_of(schema, {"a": {}}), [("/a", "oneOf")])
        documents = [SchemaDocument("test.json", {"$id": ID, **schema})]
        (issue,) = validate(compile_schemas(documents), ID, {"a": {}})
        self.assertIn('[0] /a required: missing property "x"', issue.message)
        self.assertIn("[1] /a type: expected string, got object", issue.message)

    def test_keywords_combine_and_every_one_that_fails_is_reported_in_a_fixed_order(self) -> None:
        schema = {
            "type": "object",
            "required": ["z"],
            "properties": {"b": {"type": "string"}, "a": {"minimum": 1, "enum": [5]}},
            "additionalProperties": False,
            "oneOf": [{"required": ["q"]}],
        }
        self.assertEqual(
            issues_of(schema, {"c": 1, "b": 2, "a": 0}),
            [
                ("", "required"),
                ("/a", "enum"),
                ("/a", "minimum"),
                ("/b", "type"),
                ("/c", "additionalProperties"),
                ("", "oneOf"),
            ],
        )


class NotJsonTest(unittest.TestCase):
    def test_a_non_finite_number_is_never_valid_whatever_the_schema_says(self) -> None:
        for value in (math.nan, math.inf, -math.inf, float("1e400")):
            self.assertEqual(issues_of({}, value), [("", "finite")], repr(value))
            self.assertEqual(issues_of({"type": "number"}, value), [("", "finite")], repr(value))
        # An integer too large for a float64 is an infinity in ECMAScript.
        self.assertEqual(issues_of({"type": "integer"}, 10**400), [("", "finite")])

    def test_a_non_finite_number_is_found_at_any_depth_and_is_the_only_thing_reported(self) -> None:
        schema = {"type": "string"}
        self.assertEqual(
            issues_of(schema, {"b": [1, {"c": math.nan}], "a": math.inf}), [("/a", "finite"), ("/b/1/c", "finite")]
        )

    def test_a_value_json_cannot_carry_is_never_valid(self) -> None:
        for value in ((1, 2), {1, 2}, b"bytes", object(), {1: "a"}, 1j):
            self.assertEqual(issues_of({}, value), [("", "json")], repr(value))
        self.assertEqual(issues_of({}, {"a": [(1,)]}), [("/a/0", "json")])

    def test_a_value_that_contains_itself_is_not_json_data_and_one_merely_repeated_is(self) -> None:
        loop: list[Any] = [1]
        loop.append(loop)
        self.assertEqual(issues_of({}, loop), [("/1", "json")])
        shared = {"x": 1}
        self.assertEqual(issues_of({}, {"a": shared, "b": shared, "c": [shared, shared]}), [])

    def test_an_empty_schema_accepts_every_json_value(self) -> None:
        for value in (None, True, 0, -1.5, "", "a", [], [None], {}, {"a": {"b": []}}):
            self.assertEqual(issues_of({}, value), [], repr(value))


class ReferenceTest(unittest.TestCase):
    def test_ref_resolves_a_definition_in_the_same_file_and_in_another(self) -> None:
        other = {
            "$id": "urn:test:other",
            "$defs": {"positive": {"type": "number", "exclusiveMinimum": 0}, "again": {"$ref": "#/$defs/positive"}},
            "type": "string",
        }
        schema = {
            "$defs": {"name": {"type": "string", "minLength": 1}},
            "properties": {
                "name": {"$ref": "#/$defs/name"},
                "size": {"$ref": "urn:test:other#/$defs/again"},
                "text": {"$ref": "urn:test:other"},
            },
        }
        self.assertEqual(issues_of(schema, {"name": "a", "size": 1, "text": "t"}, other), [])
        self.assertEqual(
            issues_of(schema, {"name": "", "size": 0, "text": 5}, other),
            [("/name", "minLength"), ("/size", "exclusiveMinimum"), ("/text", "type")],
        )

    def test_a_definition_can_be_validated_against_directly(self) -> None:
        schemas = compile_schemas([SchemaDocument("a.json", {"$id": ID, "$defs": {"n": {"type": "number"}}})])
        self.assertEqual(validate(schemas, f"{ID}#/$defs/n", 1), [])
        self.assertEqual([issue.keyword for issue in validate(schemas, f"{ID}#/$defs/n", "1")], ["type"])
        with self.assertRaisesRegex(SchemaError, 'validate: "urn:test:nothing" names no loaded schema'):
            validate(schemas, "urn:test:nothing", 1)

    def test_a_ref_stands_alone_and_must_name_a_loaded_schema(self) -> None:
        self.assertEqual(
            load_error({"$id": ID, "$defs": {"n": {}}, "properties": {"a": {"$ref": "#/$defs/n", "type": "number"}}}),
            "schema test.json#/properties/a/type: a $ref stands alone: no assertion may sit beside it",
        )
        self.assertEqual(
            load_error({"$id": ID, "properties": {"a": {"$ref": "#/$defs/missing"}}}),
            'schema test.json#/properties/a/$ref: "#/$defs/missing" names no loaded schema',
        )
        self.assertEqual(
            load_error({"$id": ID, "items": {"$ref": "urn:test:elsewhere"}}),
            'schema test.json#/items/$ref: "urn:test:elsewhere" names no loaded schema',
        )
        annotated = {
            "$id": ID,
            "$defs": {"n": {"type": "number"}},
            "title": "t",
            "description": "d",
            "$ref": "#/$defs/n",
        }
        schemas = compile_schemas([SchemaDocument("a.json", annotated)])
        self.assertEqual([issue.keyword for issue in validate(schemas, ID, "x")], ["type"])


class LoadTest(unittest.TestCase):
    def test_an_unknown_keyword_is_an_error_at_load_time_naming_the_file_and_the_place(self) -> None:
        for keyword in ("maxLength", "format", "allOf", "not", "if", "patternProperties", "multipleOf", "$comment"):
            self.assertEqual(
                load_error({"$id": ID, keyword: 1}), f"schema test.json#/{keyword}: unknown keyword", keyword
            )
        nested = {"$id": ID, "properties": {"a": {"items": {"oneOf": [{"type": "string"}, {"nullable": True}]}}}}
        self.assertEqual(load_error(nested), "schema test.json#/properties/a/items/oneOf/1/nullable: unknown keyword")
        self.assertEqual(
            load_error({"$id": ID, "additionalProperties": {"minProperties": 1}}),
            "schema test.json#/additionalProperties/minProperties: unknown keyword",
        )
        self.assertEqual(
            load_error({"$id": ID, "$defs": {"a": {"default": 1}}}),
            "schema test.json#/$defs/a/default: unknown keyword",
        )
        # A property may have the name of a keyword, known or not.
        self.assertEqual(
            issues_of({"properties": {"format": {"type": "string"}, "type": {"const": 1}}}, {"type": 1}), []
        )

    def test_a_malformed_keyword_value_is_an_error_at_load_time(self) -> None:
        cases: list[tuple[dict[str, Any], str]] = [
            ({"type": "float"}, "/type"),
            ({"type": []}, "/type"),
            ({"type": ["string", "string"]}, "/type"),
            ({"enum": []}, "/enum"),
            ({"enum": [1, 1.0]}, "/enum"),
            ({"enum": [[1]]}, "/enum"),
            ({"enum": [math.nan]}, "/enum"),
            ({"const": {"a": 1}}, "/const"),
            ({"minimum": "0"}, "/minimum"),
            ({"minimum": True}, "/minimum"),
            ({"maximum": math.inf}, "/maximum"),
            ({"exclusiveMinimum": None}, "/exclusiveMinimum"),
            ({"exclusiveMaximum": [0]}, "/exclusiveMaximum"),
            ({"minLength": -1}, "/minLength"),
            ({"minLength": 1.5}, "/minLength"),
            ({"minItems": True}, "/minItems"),
            ({"maxItems": "2"}, "/maxItems"),
            ({"uniqueItems": 1}, "/uniqueItems"),
            ({"required": "a"}, "/required"),
            ({"required": ["a", "a"]}, "/required"),
            ({"required": [1]}, "/required"),
            ({"properties": []}, "/properties"),
            ({"properties": {"a": True}}, "/properties/a"),
            ({"items": True}, "/items"),
            ({"additionalProperties": "no"}, "/additionalProperties"),
            ({"oneOf": []}, "/oneOf"),
            ({"anyOf": {}}, "/anyOf"),
            ({"title": 1}, "/title"),
            ({"description": None}, "/description"),
            ({"$ref": 5}, "/$ref"),
            ({"$schema": "http://json-schema.org/draft-07/schema#"}, "/$schema"),
            ({"$defs": {"a-b": {}}}, "/$defs/a-b"),
            ({"$defs": {"ab\n": {}}}, "/$defs/ab\n"),
            ({"$defs": []}, "/$defs"),
        ]
        for schema, where in cases:
            self.assertTrue(load_error({"$id": ID, **schema}).startswith(f"schema test.json#{where}: "), repr(schema))
        # Enum members are distinct by JSON type and value: 1 and true are two.
        self.assertEqual(issues_of({"enum": [1, True, "1", 0, False, None]}, False), [])
        self.assertEqual(issues_of({"$schema": DRAFT, "minItems": 1.0}, []), [("", "minItems")])

    def test_a_pattern_must_be_anchored_compile_and_use_nothing_the_languages_match_differently(self) -> None:
        anchored = "schema test.json#/pattern: must be a string anchored with ^ and $"
        for pattern in ("abc", "^abc", "abc$", "^abc\\$", 5, None):
            self.assertEqual(load_error({"$id": ID, "pattern": pattern}), anchored, repr(pattern))
        self.assertEqual(
            load_error({"$id": ID, "pattern": "^(abc$"}), "schema test.json#/pattern: is not a regular expression"
        )
        for pattern in ("^\\d+$", "^\\w$", "^a\\sb$", "^\\bword$", "^a.b$", "^.*$", "^[a-z].$", "^\\D$", "^[\\s]$"):
            self.assertIn(
                "match differently in ECMAScript and Python", load_error({"$id": ID, "pattern": pattern}), pattern
            )
        for pattern in ("^[.]$", "^a\\.b$", "^[a.b]+$", "^[^.]*$", "^1\\.(0|[1-9][0-9]*)$"):
            compile_schemas([SchemaDocument("test.json", {"$id": ID, "pattern": pattern})])

    def test_a_pattern_has_no_character_class_that_starts_with_its_closing_bracket(self) -> None:
        # ECMAScript reads [] as a class that matches nothing and [^] as one that matches anything. Python reads the
        # ] as the first member of a class that goes on to the next ]: "^[^][a]$" would load and match other strings.
        starts = (
            "schema test.json#/pattern: [] and [^] are whole classes in ECMAScript and the start of a class in Python"
        )
        for pattern in ("^[]$", "^[^]$", "^[^][a]$", "^[][a]$", "^a[^]*$", "^[a][]$", "^\\\\[]$", "^[^].$"):
            self.assertEqual(load_error({"$id": ID, "pattern": pattern}), starts, pattern)
        # A bracket that is escaped, or that is not the first member of its class, is a member like any other.
        self.assertEqual(issues_of({"pattern": "^[\\]]$"}, "]"), [])
        self.assertEqual(issues_of({"pattern": "^[^\\]]$"}, "a"), [])
        self.assertEqual(issues_of({"pattern": "^[^\\]]$"}, "]"), [("", "pattern")])
        self.assertEqual(issues_of({"pattern": "^[a\\]]+$"}, "a]"), [])
        self.assertEqual(issues_of({"pattern": "^\\[\\]$"}, "[]"), [])

    def test_unique_items_needs_an_items_schema_that_admits_only_primitives(self) -> None:
        message = "schema test.json#/uniqueItems: needs a sibling items schema whose type names only primitive types"
        for schema in (
            {"uniqueItems": True},
            {"uniqueItems": True, "items": {}},
            {"uniqueItems": True, "items": {"type": "array"}},
            {"uniqueItems": True, "items": {"type": ["string", "object"]}},
            {"uniqueItems": True, "items": {"enum": [1]}},
        ):
            self.assertEqual(load_error({"$id": ID, **schema}), message, repr(schema))
        compile_schemas([SchemaDocument("test.json", {"$id": ID, "uniqueItems": False})])
        compile_schemas(
            [SchemaDocument("test.json", {"$id": ID, "uniqueItems": True, "items": {"type": ["integer", "null"]}})]
        )

    def test_id_schema_and_defs_belong_to_the_root_of_a_file_which_needs_an_id_of_its_own(self) -> None:
        self.assertEqual(
            load_error({"$id": ID, "items": {"$id": "urn:x"}}),
            "schema test.json#/items/$id: only the root of a file has an $id",
        )
        self.assertTrue(load_error({"$id": ID, "items": {"$defs": {}}}).startswith("schema test.json#/items/$defs: "))
        self.assertTrue(
            load_error({"$id": ID, "items": {"$schema": DRAFT}}).startswith("schema test.json#/items/$schema: ")
        )
        needs_id = "schema test.json: a schema file is an object with a non-empty $id that has no fragment"
        for schema in ({}, {"$id": ""}, {"$id": 5}, {"$id": "urn:a#b"}, [], "schema", None):
            self.assertEqual(load_error(schema), needs_id, repr(schema))
        self.assertEqual(
            load_error({"$id": ID}, {"$id": ID}), f'schema other0.json: the $id "{ID}" is already taken by another file'
        )
        self.assertEqual(load_error({"$id": ID, "items": 5}), "schema test.json#/items: a schema must be an object")

    def test_files_may_reference_each_other_in_any_order_and_an_empty_set_loads(self) -> None:
        first = {"$id": "urn:test:first", "properties": {"b": {"$ref": "urn:test:second"}}}
        second = {"$id": "urn:test:second", "properties": {"a": {"$ref": "urn:test:first"}}, "type": "object"}
        schemas = compile_schemas([SchemaDocument("first.json", first), SchemaDocument("second.json", second)])
        self.assertEqual(schemas.ids, ("urn:test:first", "urn:test:second"))
        self.assertEqual([i.path for i in validate(schemas, "urn:test:first", {"b": {"a": {"b": 5}}})], ["/b/a/b"])
        self.assertEqual(compile_schemas([]).ids, ())


if __name__ == "__main__":
    unittest.main()

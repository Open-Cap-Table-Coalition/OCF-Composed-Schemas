---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Numeric.schema.json
ocf_object_type: null
ocf_title: Type - Numeric
ocf_kind: type
required_fields: []
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-05-18
---

# Type - Numeric → Carta

> Fixed-point string representation of a number (up to 10 decimal places supported)

## OCF schema

Source: [`Numeric.schema.json`](./Numeric.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Numeric.schema.json",
  "title": "Type - Numeric",
  "description": "Fixed-point string representation of a number (up to 10 decimal places supported)",
  "type": "string",
  "pattern": "^[+-]?[0-9]+(\\.[0-9]{1,10})?$",
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/Numeric.schema.json",
  "properties": {},
  "required": []
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
status: complete
coverage: 0/0

fields: {}
```

## Notes / open questions

- `Numeric` is a bare scalar type with zero properties — a fixed-point numeric string (`^[+-]?[0-9]+(\.[0-9]{1,10})?$`, up to 10 decimal places). Like `Md5`, there are no member fields to map, so `fields: {}` and `coverage: 0/0`; the correspondence is type-level and is captured here.
- Carta models numeric magnitudes with the same string-based-decimal strategy as OCF. The closest type is **`#/$defs/Decimal`** ("A string-based representation of the decimal type."), whose sole member **`#/$defs/Decimal/properties/value`** carries the number as a string (`pattern ^[\+\-]?((0|[1-9][0-9]*)(\.[0-9]*)?|\.[0-9]+)([eE][\+\-]?[0-9]+)?$`, `minLength 1`, `maxLength 100`). This is the natural target for an OCF `Numeric`: both sides encode an exact decimal as text rather than as an IEEE float, avoiding binary rounding.
- The two patterns are **not** in a strict superset/subset relationship — each accepts strings the other rejects, so a verbatim copy is not always valid and light normalization is needed in both directions:
    - Carta → OCF: Carta additionally permits scientific notation (`+1.23456e-3`, `1e-05`), a bare-leading-dot form (`.321`), trailing dots / unbounded fractional digits, and is bounded by `maxLength 100`. Any such value must be expanded to plain fixed-point and rounded/truncated to ≤10 decimal places to satisfy OCF's `^[+-]?[0-9]+(\.[0-9]{1,10})?$`.
    - OCF → Carta: OCF permits multi-digit leading zeros in the integer part (`007`, `00123`, `010`), which Carta's `(0|[1-9][0-9]*)` integer rule rejects (verified by testing both regexes). Such values must have leading zeros stripped before they are valid `Decimal.value`s. All other OCF `Numeric` forms (e.g. `0`, `0.5`, `+1`, `-456.0`, `1.0000000000`) copy through verbatim.
- `#/$defs/Decimal` is the workhorse numeric type across the Carta bundle: 118 properties `$ref` it for share counts and quantities (e.g. `Certificate.quantity`, `CapitalizationTableSummary.fullyDilutedShares`/`.outstandingShares`), and `#/$defs/Money/properties/amount` is itself a `Decimal`. Wherever an OCF object embeds a `Numeric` (e.g. `Monetary.amount`, share quantities, ratios), the per-object mapping should land on the specific `Decimal`-typed property for that field; this type-level mapping records the generic correspondence rather than picking one representative leaf.
- No semantic value transformation is required beyond the lexical normalization noted above: an OCF `Numeric` string can be written into a Carta `Decimal.value` verbatim except when it carries multi-digit leading zeros (strip them), and any Carta `Decimal.value` that uses scientific notation, a bare leading dot, or more than 10 decimal places needs normalization to round-trip back into OCF's stricter fixed-point pattern. The numeric value itself is preserved in every case.

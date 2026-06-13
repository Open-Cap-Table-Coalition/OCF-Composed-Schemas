---
canonical_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/main/canonical/vesting/VestingScheduleTemplate.schema.json
canonical_title: Canonical - Vesting Schedule Template
canonical_kind: type
required_fields:
  - id
  - statements
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-06-13
---

# Canonical - Vesting Schedule Template → Carta

> Reusable vesting schedule shape, independent of any specific grant: an ordered list of vesting statements that together describe how a grant vests over time. Maps to Carta's `VestingScheduleTemplate`.

## Canonical schema

Source: [`VestingScheduleTemplate.schema.json`](./VestingScheduleTemplate.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft/2020-12/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/main/canonical/vesting/VestingScheduleTemplate.schema.json",
  "title": "Canonical - Vesting Schedule Template",
  "description": "Reusable vesting schedule shape, independent of any specific grant: an ordered list of vesting statements that together describe how a grant vests over time. Assumes CUMULATIVE_ROUND_DOWN allocation throughout.",
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "statements": {
      "type": "array",
      "items": {
        "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/main/canonical/vesting/VestingStatement.schema.json"
      },
      "minItems": 1
    }
  },
  "required": ["id", "statements"],
  "additionalProperties": false
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: complete
coverage: 2/2

fields:
  id:
    kind: rename
    target: "#/$defs/VestingScheduleTemplate/properties/id"
  statements:
    kind: rename
    target: "#/$defs/VestingScheduleTemplate/properties/periods"
```

## Notes / open questions

Each `VestingStatement` in `statements` becomes one Carta `VestingPeriod`; the array maps to Carta's `VestingScheduleTemplate.periods[]`. For the per-statement projection rule and worked examples, see [`../README.md`](../README.md).

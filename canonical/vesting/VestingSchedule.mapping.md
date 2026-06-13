---
canonical_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/main/canonical/vesting/VestingSchedule.schema.json
canonical_title: Canonical - Vesting Schedule
canonical_kind: type
required_fields:
  - template_id
  - start_date
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-06-13
---

# Canonical - Vesting Schedule → Carta

> Per-grant application of a `VestingScheduleTemplate`: references a template by id and anchors it to a concrete start date. Maps to Carta's per-grant `Vesting`.

## Canonical schema

Source: [`VestingSchedule.schema.json`](./VestingSchedule.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft/2020-12/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/main/canonical/vesting/VestingSchedule.schema.json",
  "title": "Canonical - Vesting Schedule",
  "description": "Per-grant application of a VestingScheduleTemplate: references a template by id and anchors it to a concrete start date.",
  "type": "object",
  "properties": {
    "template_id": { "type": "string" },
    "start_date": {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    }
  },
  "required": ["template_id", "start_date"],
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
  template_id:
    kind: rename
    target: "#/$defs/Vesting/properties/templateId"
  start_date:
    kind: rename
    target: "#/$defs/Vesting/properties/startDate"
```

## Notes / open questions

`VestingSchedule` is the per-grant application; Carta computes the materialized event stream from the template plus this start date. For the full canonical → Carta projection, see [`../README.md`](../README.md).

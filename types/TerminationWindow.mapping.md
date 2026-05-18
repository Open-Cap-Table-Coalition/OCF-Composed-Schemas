---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/TerminationWindow.schema.json
ocf_object_type: null
ocf_title: Type - Termination Window
ocf_kind: type
required_fields:
  - reason
  - period
  - period_type
target_standard: TBD
target_version: TBD
status: draft
last_generated: 2026-05-18
---

# Type - Termination Window → TBD

> Type representation of a termination window

## OCF schema

Source: [`TerminationWindow.schema.json`](./TerminationWindow.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/TerminationWindow.schema.json",
  "title": "Type - Termination Window",
  "description": "Type representation of a termination window",
  "type": "object",
  "properties": {
    "reason": {
      "description": "What cause of termination is this window for?",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/TerminationWindowType.schema.json"
    },
    "period": {
      "description": "The length of the period in this termination window (in number of periods of type period_type)",
      "type": "integer"
    },
    "period_type": {
      "description": "The type of period being measured (e.g. days or month)",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/PeriodType.schema.json"
    }
  },
  "additionalProperties": false,
  "required": [
    "reason",
    "period",
    "period_type"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/TerminationWindow.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: draft
coverage: 0/3

fields:
  reason:
    kind: TODO          # likely enum-remap
    target: TODO
    values:
      VOLUNTARY_OTHER: TODO
      VOLUNTARY_GOOD_CAUSE: TODO
      VOLUNTARY_RETIREMENT: TODO
      INVOLUNTARY_OTHER: TODO
      INVOLUNTARY_DEATH: TODO
      INVOLUNTARY_DISABILITY: TODO
      INVOLUNTARY_WITH_CAUSE: TODO
  period:
    kind: TODO
    target: TODO
  period_type:
    kind: TODO          # likely enum-remap
    target: TODO
    values:
      DAYS: TODO
      MONTHS: TODO
      YEARS: TODO
```

## Notes / open questions

- 

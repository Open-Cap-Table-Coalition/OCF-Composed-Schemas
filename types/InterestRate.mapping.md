---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/InterestRate.schema.json
ocf_object_type: null
ocf_title: Type - Interest Rate
ocf_kind: type
required_fields:
  - rate
  - accrual_start_date
target_standard: TBD
target_version: TBD
status: draft
last_generated: 2026-05-18
---

# Type - Interest Rate → TBD

> Type representation of an interest rate, including accrual start and end dates

## OCF schema

Source: [`InterestRate.schema.json`](./InterestRate.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/InterestRate.schema.json",
  "title": "Type - Interest Rate",
  "description": "Type representation of an interest rate, including accrual start and end dates",
  "type": "object",
  "properties": {
    "rate": {
      "description": "Interest rate for the convertible (decimal representation - e.g. 0.125 for 12.5%)",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Percentage.schema.json"
    },
    "accrual_start_date": {
      "description": "Commencement date for interest accruing at the specified rate",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "accrual_end_date": {
      "description": "Optional end date (inclusive) for interest accruing at the specified rate. If none specified, interest will accrue indefinitely or until accrual of next interest rate commences",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    }
  },
  "additionalProperties": false,
  "required": [
    "rate",
    "accrual_start_date"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/InterestRate.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: draft
coverage: 0/3

fields:
  rate:
    kind: TODO
    target: TODO
  accrual_start_date:
    kind: TODO
    target: TODO
  accrual_end_date:
    kind: TODO
    target: TODO
```

## Notes / open questions

- 

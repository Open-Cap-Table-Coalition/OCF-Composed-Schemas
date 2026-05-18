---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Vesting.schema.json
ocf_object_type: null
ocf_title: Type - Vesting
ocf_kind: type
required_fields:
  - date
  - amount
target_standard: TBD
target_version: TBD
status: draft
last_generated: 2026-05-18
---

# Type - Vesting → TBD

> Describes an exact vesting date and amount

## OCF schema

Source: [`Vesting.schema.json`](./Vesting.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Vesting.schema.json",
  "title": "Type - Vesting",
  "description": "Describes an exact vesting date and amount",
  "type": "object",
  "properties": {
    "date": {
      "description": "Date the vesting occurred or will occur",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "amount": {
      "description": "Quantity of shares which vested or will vest",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Numeric.schema.json"
    }
  },
  "required": [
    "date",
    "amount"
  ],
  "additionalProperties": false,
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/Vesting.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: draft
coverage: 0/2

fields:
  date:
    kind: TODO
    target: TODO
  amount:
    kind: TODO
    target: TODO
```

## Notes / open questions

- 

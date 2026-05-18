---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Monetary.schema.json
ocf_object_type: null
ocf_title: Type - Monetary
ocf_kind: type
required_fields:
  - amount
  - currency
target_standard: TBD
target_version: TBD
status: draft
last_generated: 2026-05-18
---

# Type - Monetary → TBD

> Type representation of an amount of money in a specified currency

## OCF schema

Source: [`Monetary.schema.json`](./Monetary.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Monetary.schema.json",
  "title": "Type - Monetary",
  "description": "Type representation of an amount of money in a specified currency",
  "type": "object",
  "properties": {
    "amount": {
      "description": "Numeric amount of money",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Numeric.schema.json"
    },
    "currency": {
      "description": "ISO 4217 currency code",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/CurrencyCode.schema.json"
    }
  },
  "additionalProperties": false,
  "required": [
    "amount",
    "currency"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/Monetary.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: draft
coverage: 0/2

fields:
  amount:
    kind: TODO
    target: TODO
  currency:
    kind: TODO
    target: TODO
```

## Notes / open questions

- 

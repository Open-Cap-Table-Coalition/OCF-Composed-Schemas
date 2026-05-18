---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/StockParent.schema.json
ocf_object_type: null
ocf_title: Type - Stock Parent
ocf_kind: type
required_fields:
  - parent_object_type
  - parent_object_id
target_standard: TBD
target_version: TBD
status: draft
last_generated: 2026-05-18
---

# Type - Stock Parent → TBD

> Type representation of the parent security of a given stock issuance (e.g. if a stock issuance came from a plan, such as an RSA, or if a stock came from a previous stock entry)

## OCF schema

Source: [`StockParent.schema.json`](./StockParent.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/StockParent.schema.json",
  "title": "Type - Stock Parent",
  "description": "Type representation of the parent security of a given stock issuance (e.g. if a stock issuance came from a plan, such as an RSA, or if a stock came from a previous stock entry)",
  "type": "object",
  "properties": {
    "parent_object_type": {
      "description": "Parent object type for this stock issuance (e.g. a stock plan or warrant)",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/ParentSecurityType.schema.json"
    },
    "parent_object_id": {
      "description": "Parent object's ID must be a valid ID pointing to an object of the type specified in parent_object_type",
      "type": "string"
    }
  },
  "additionalProperties": false,
  "required": [
    "parent_object_type",
    "parent_object_id"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/StockParent.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: draft
coverage: 0/2

fields:
  parent_object_type:
    kind: TODO          # likely enum-remap
    target: TODO
    values:
      STOCK_PLAN: TODO
      STOCK: TODO
      WARRANT: TODO
      CONVERTIBLE: TODO
  parent_object_id:
    kind: TODO
    target: TODO
```

## Notes / open questions

- 

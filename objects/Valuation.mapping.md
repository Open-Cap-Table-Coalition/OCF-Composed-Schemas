---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/Valuation.schema.json
ocf_object_type: VALUATION
ocf_title: Object - Valuation
ocf_kind: object
required_fields:
  - price_per_share
  - effective_date
  - valuation_type
  - stock_class_id
  - id
  - object_type
target_standard: TBD
target_version: TBD
status: draft
last_generated: 2026-05-18
---

# Object - Valuation → TBD

> Object describing a valuation used in the cap table

## OCF schema

Source: [`Valuation.schema.json`](./Valuation.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/Valuation.schema.json",
  "title": "Object - Valuation",
  "description": "Object describing a valuation used in the cap table",
  "type": "object",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/Object.schema.json"
    }
  ],
  "properties": {
    "id": {
      "description": "Identifier for the object",
      "type": "string"
    },
    "comments": {
      "description": "Unstructured text comments related to and stored for the object",
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "object_type": {
      "const": "VALUATION"
    },
    "provider": {
      "description": "Entity which provided the valuation",
      "type": "string"
    },
    "board_approval_date": {
      "description": "Date on which board approved the valuation. This is essential for 409A valuations, in particular, which require the Board to approve the valuation.",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "stockholder_approval_date": {
      "description": "This optional field tracks when the stockholders approved the valuation.",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "price_per_share": {
      "description": "Valued price per share",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Monetary.schema.json"
    },
    "effective_date": {
      "description": "Date on which this valuation is first valid",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "stock_class_id": {
      "description": "Identifier of the stock class for this valuation",
      "type": "string"
    },
    "valuation_type": {
      "description": "Seam for supporting different types of valuations in future versions",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/ValuationType.schema.json"
    }
  },
  "additionalProperties": false,
  "required": [
    "price_per_share",
    "effective_date",
    "valuation_type",
    "stock_class_id",
    "id",
    "object_type"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/Valuation.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: draft
coverage: 0/10

fields:
  id:
    kind: TODO
    target: TODO
  comments:
    kind: TODO
    target: TODO
  object_type:
    kind: TODO          # likely enum-remap
    target: TODO
    values:
      VALUATION: TODO
  provider:
    kind: TODO
    target: TODO
  board_approval_date:
    kind: TODO
    target: TODO
  stockholder_approval_date:
    kind: TODO
    target: TODO
  price_per_share:
    kind: TODO
    target: TODO
  effective_date:
    kind: TODO
    target: TODO
  stock_class_id:
    kind: TODO
    target: TODO
  valuation_type:
    kind: TODO          # likely enum-remap
    target: TODO
    values:
      409A: TODO
```

## Notes / open questions

- 

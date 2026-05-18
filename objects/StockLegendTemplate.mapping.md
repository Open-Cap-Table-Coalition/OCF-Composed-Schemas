---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/StockLegendTemplate.schema.json
ocf_object_type: STOCK_LEGEND_TEMPLATE
ocf_title: Object - Stock Legend Template
ocf_kind: object
required_fields:
  - name
  - text
  - id
  - object_type
target_standard: TBD
target_version: TBD
status: draft
last_generated: 2026-05-18
---

# Object - Stock Legend Template → TBD

> Object describing a stock legend template

## OCF schema

Source: [`StockLegendTemplate.schema.json`](./StockLegendTemplate.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/StockLegendTemplate.schema.json",
  "title": "Object - Stock Legend Template",
  "description": "Object describing a stock legend template",
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
      "const": "STOCK_LEGEND_TEMPLATE"
    },
    "name": {
      "description": "Name for the stock legend template",
      "type": "string"
    },
    "text": {
      "description": "The full text of the stock legend",
      "type": "string"
    }
  },
  "additionalProperties": false,
  "required": [
    "name",
    "text",
    "id",
    "object_type"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/StockLegendTemplate.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: draft
coverage: 0/5

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
      STOCK_LEGEND_TEMPLATE: TODO
  name:
    kind: TODO
    target: TODO
  text:
    kind: TODO
    target: TODO
```

## Notes / open questions

- 

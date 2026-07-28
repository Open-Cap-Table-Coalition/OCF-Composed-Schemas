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
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-05-18
---

# Object - Stock Legend Template → Carta

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
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
status: complete

fields:
  id:
    kind: unmappable
    target: null
    reason: ocf-internal
  comments:
    kind: unmappable
    target: null
    reason: ocf-internal
  object_type:
    kind: unmappable
    target: null
    reason: ocf-internal
    values:
      STOCK_LEGEND_TEMPLATE: null
  name:
    kind: unmappable
    target: null
    reason: no-equivalent
  text:
    kind: unmappable
    target: null
    reason: no-equivalent
```

## Ask a mapping question

Use a link below to open a prefilled GitHub issue. The issue can be copied into the auditable checklist in `## Notes / open questions`.

<details>
<summary>Open a prefilled issue for a property</summary>

<!-- mapping-question-links:start -->
| Source property | Action |
| --- | --- |
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FStockLegendTemplate.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FStockLegendTemplate.mapping.md&title=%5BMapping+question%5D+StockLegendTemplate) |
| `id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FStockLegendTemplate.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FStockLegendTemplate.mapping.md&title=%5BMapping+question%5D+StockLegendTemplate%3A+id&property_path=id) |
| `comments` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FStockLegendTemplate.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FStockLegendTemplate.mapping.md&title=%5BMapping+question%5D+StockLegendTemplate%3A+comments&property_path=comments) |
| `object_type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FStockLegendTemplate.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FStockLegendTemplate.mapping.md&title=%5BMapping+question%5D+StockLegendTemplate%3A+object_type&property_path=object_type) |
| `name` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FStockLegendTemplate.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FStockLegendTemplate.mapping.md&title=%5BMapping+question%5D+StockLegendTemplate%3A+name&property_path=name) |
| `text` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FStockLegendTemplate.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FStockLegendTemplate.mapping.md&title=%5BMapping+question%5D+StockLegendTemplate%3A+text&property_path=text) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- Carta has no stock-legend object, legend text field, or legend ID relationship. The entire OCF `StockLegendTemplate` object and `StockIssuance.stock_legend_ids` link are therefore `no-equivalent`.
- `name` and `text` are dropped because Carta has no target; `id`, `comments`, and `object_type` are OCF scaffolding. Preserve the template in an extension or sidecar if legend fidelity is required.
</content>
</invoke>

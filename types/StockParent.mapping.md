---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/StockParent.schema.json
ocf_object_type: null
ocf_title: Type - Stock Parent
ocf_kind: type
required_fields:
  - parent_object_type
  - parent_object_id
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-05-18
---

# Type - Stock Parent → Carta

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
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
status: complete

fields:
  parent_object_type:
    kind: unmappable
    target: null
    reason: no-equivalent
    values:
      STOCK_PLAN: null
      STOCK: null
      WARRANT: null
      CONVERTIBLE: null
  parent_object_id:
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
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FStockParent.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FStockParent.mapping.md&title=%5BMapping+question%5D+StockParent) |
| `parent_object_type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FStockParent.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FStockParent.mapping.md&title=%5BMapping+question%5D+StockParent+%2F+parent_object_type&property_path=parent_object_type) |
| `parent_object_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FStockParent.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FStockParent.mapping.md&title=%5BMapping+question%5D+StockParent+%2F+parent_object_id&property_path=parent_object_id) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- OCF's `StockParent` is a generic parent-security reference (a stock issuance came from a stock plan, a prior stock entry, a warrant exercise, or a convertible conversion). Carta represents these lineage relationships positionally via specific typed transaction and `*PrecededBy` shapes (`CertificatePrecededBy`/`CertificatePrecededByReason`, `RestrictedStockAwardPrecededBy`/`RestrictedStockAwardPrecededByReason`, and the various `*ExerciseTransaction`/`*ConversionTransaction` types) rather than via a single polymorphic `parent` reference. There is no Carta type that corresponds to `StockParent` itself.

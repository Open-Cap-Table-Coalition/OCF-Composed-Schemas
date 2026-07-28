---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/ObjectReference.schema.json
ocf_object_type: null
ocf_title: Type - Object Reference
ocf_kind: type
required_fields:
  - object_type
  - object_id
target_standard: Carta
target_version: "v1alpha1 (2026-06-22)"
status: complete
last_generated: 2026-06-29
---

# Type - Object Reference → Carta

> A type representing a reference to any kind of OCF object

## OCF schema

Source: [`ObjectReference.schema.json`](./ObjectReference.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/ObjectReference.schema.json",
  "title": "Type - Object Reference",
  "description": "A type representing a reference to any kind of OCF object",
  "type": "object",
  "properties": {
    "object_type": {
      "description": "The type of object being referenced. Informs which type of identifier is represented by the associated object_id",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/ObjectType.schema.json"
    },
    "object_id": {
      "description": "The identifier for the referenced object",
      "type": "string"
    }
  },
  "additionalProperties": false,
  "required": [
    "object_type",
    "object_id"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/ObjectReference.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
# unmappable reason vocabulary: no-equivalent | excluded-from-snapshot | out-of-scope | ocf-internal
status: complete

fields:
  object_type:
    kind: unmappable
    target: null
    reason: no-equivalent
    values:
      ISSUER: null
      STAKEHOLDER: null
      STOCK_CLASS: null
      STOCK_LEGEND_TEMPLATE: null
      STOCK_PLAN: null
      VALUATION: null
      VESTING_TERMS: null
      FINANCING: null
      DOCUMENT: null
      CE_STAKEHOLDER_RELATIONSHIP: null
      CE_STAKEHOLDER_STATUS: null
      TX_ISSUER_AUTHORIZED_SHARES_ADJUSTMENT: null
      TX_STOCK_CLASS_CONVERSION_RATIO_ADJUSTMENT: null
      TX_STOCK_CLASS_AUTHORIZED_SHARES_ADJUSTMENT: null
      TX_STOCK_CLASS_SPLIT: null
      TX_STOCK_PLAN_POOL_ADJUSTMENT: null
      TX_STOCK_PLAN_RETURN_TO_POOL: null
      TX_CONVERTIBLE_ACCEPTANCE: null
      TX_CONVERTIBLE_CANCELLATION: null
      TX_CONVERTIBLE_CONVERSION: null
      TX_CONVERTIBLE_ISSUANCE: null
      TX_CONVERTIBLE_RETRACTION: null
      TX_CONVERTIBLE_TRANSFER: null
      TX_EQUITY_COMPENSATION_ACCEPTANCE: null
      TX_EQUITY_COMPENSATION_CANCELLATION: null
      TX_EQUITY_COMPENSATION_EXERCISE: null
      TX_EQUITY_COMPENSATION_ISSUANCE: null
      TX_EQUITY_COMPENSATION_RELEASE: null
      TX_EQUITY_COMPENSATION_RETRACTION: null
      TX_EQUITY_COMPENSATION_TRANSFER: null
      TX_EQUITY_COMPENSATION_REPRICING: null
      TX_PLAN_SECURITY_ACCEPTANCE: null
      TX_PLAN_SECURITY_CANCELLATION: null
      TX_PLAN_SECURITY_EXERCISE: null
      TX_PLAN_SECURITY_ISSUANCE: null
      TX_PLAN_SECURITY_RELEASE: null
      TX_PLAN_SECURITY_RETRACTION: null
      TX_PLAN_SECURITY_TRANSFER: null
      TX_STOCK_ACCEPTANCE: null
      TX_STOCK_CANCELLATION: null
      TX_STOCK_CONVERSION: null
      TX_STOCK_ISSUANCE: null
      TX_STOCK_REISSUANCE: null
      TX_STOCK_CONSOLIDATION: null
      TX_STOCK_REPURCHASE: null
      TX_STOCK_RETRACTION: null
      TX_STOCK_TRANSFER: null
      TX_WARRANT_ACCEPTANCE: null
      TX_WARRANT_CANCELLATION: null
      TX_WARRANT_EXERCISE: null
      TX_WARRANT_ISSUANCE: null
      TX_WARRANT_RETRACTION: null
      TX_WARRANT_TRANSFER: null
      TX_VESTING_ACCELERATION: null
      TX_VESTING_EVENT: null
  object_id:
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
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FObjectReference.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FObjectReference.mapping.md&title=%5BMapping+question%5D+ObjectReference) |
| `object_type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FObjectReference.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FObjectReference.mapping.md&title=%5BMapping+question%5D+ObjectReference%3A+object_type&property_path=object_type) |
| `object_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FObjectReference.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FObjectReference.mapping.md&title=%5BMapping+question%5D+ObjectReference%3A+object_id&property_path=object_id) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- OCF's polymorphic `ObjectReference` has no generic Carta counterpart. Carta uses typed relationships, security lineage, and server-side IDs instead.
- The direct consumer, `Document.related_objects`, is unmappable; both the OCF type tag and local object ID are dropped.

---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/transfer/PlanSecurityTransfer.schema.json
ocf_object_type: TX_PLAN_SECURITY_TRANSFER
ocf_title: Object - Plan Security Transfer
ocf_kind: object
required_fields: []
target_standard: Carta
target_version: "v1alpha1 (2026-06-22)"
status: complete
last_generated: 2026-05-18
---

# Object - Plan Security Transfer → Carta

> Object describing plan security transfer transaction (a compatibility wrapper for equity compensation transfer event)

## OCF schema

Source: [`PlanSecurityTransfer.schema.json`](./PlanSecurityTransfer.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/transfer/PlanSecurityTransfer.schema.json",
  "title": "Object - Plan Security Transfer",
  "description": "Object describing plan security transfer transaction (a compatibility wrapper for equity compensation transfer event)",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/transfer/EquityCompensationTransfer.schema.json"
    }
  ],
  "properties": {
    "object_type": {
      "const": "TX_PLAN_SECURITY_TRANSFER"
    }
  },
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/transfer/PlanSecurityTransfer.schema.json",
  "required": []
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
status: complete

fields:
  object_type:
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
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Ftransfer%2FPlanSecurityTransfer.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Ftransfer%2FPlanSecurityTransfer.mapping.md&title=%5BMapping+question%5D+PlanSecurityTransfer) |
| `object_type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Ftransfer%2FPlanSecurityTransfer.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Ftransfer%2FPlanSecurityTransfer.mapping.md&title=%5BMapping+question%5D+PlanSecurityTransfer%3A+object_type&property_path=object_type) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- Deprecated compatibility wrapper for `EquityCompensationTransfer`; its inherited fields remain unmappable because Carta has no option/equity-compensation transfer transaction.
- The wrapper contributes only `object_type`, which is OCF scaffolding.
- As with `EquityCompensationTransfer`, a cancellation followed by an issuance cannot represent the inherited transfer event without losing key causal information: it would replace one transfer event with two separate lifecycle events and fail to preserve the relationship between the source, resulting, and balance securities.

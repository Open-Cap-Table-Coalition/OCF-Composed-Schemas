---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/issuance/PlanSecurityIssuance.schema.json
ocf_object_type: TX_PLAN_SECURITY_ISSUANCE
ocf_title: Object - Plan Security Issuance
ocf_kind: object
required_fields: []
target_standard: Carta
target_version: "v1alpha1 (2026-06-22)"
status: complete
last_generated: 2026-05-18
---

# Object - Plan Security Issuance → Carta

> A Plan Security Issuance is a transaction to issue plan securities (it's a compatibility wrapper for Equity Compensation Issuances)

## OCF schema

Source: [`PlanSecurityIssuance.schema.json`](./PlanSecurityIssuance.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/issuance/PlanSecurityIssuance.schema.json",
  "title": "Object - Plan Security Issuance",
  "description": "A Plan Security Issuance is a transaction to issue plan securities (it's a compatibility wrapper for Equity Compensation Issuances)",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/issuance/EquityCompensationIssuance.schema.json"
    }
  ],
  "properties": {
    "object_type": {
      "const": "TX_PLAN_SECURITY_ISSUANCE"
    }
  },
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/issuance/PlanSecurityIssuance.schema.json",
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
    reason: ocf-internal
    values:
      TX_PLAN_SECURITY_ISSUANCE: null
```

## Ask a mapping question

Use a link below to open a prefilled GitHub issue. The issue can be copied into the auditable checklist in `## Notes / open questions`.

<details>
<summary>Open a prefilled issue for a property</summary>

<!-- mapping-question-links:start -->
| Source property | Action |
| --- | --- |
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fissuance%2FPlanSecurityIssuance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fissuance%2FPlanSecurityIssuance.mapping.md&title=%5BMapping+question%5D+PlanSecurityIssuance) |
| `object_type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fissuance%2FPlanSecurityIssuance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fissuance%2FPlanSecurityIssuance.mapping.md&title=%5BMapping+question%5D+PlanSecurityIssuance%3A+object_type&property_path=object_type) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- Deprecated compatibility wrapper for `EquityCompensationIssuance`; the inherited mapping routes the substantive issuance through compensation family logic.
- The wrapper contributes only `object_type`, which is OCF scaffolding and has no Carta target.

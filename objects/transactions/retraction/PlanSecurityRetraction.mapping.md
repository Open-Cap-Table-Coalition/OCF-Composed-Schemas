---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/retraction/PlanSecurityRetraction.schema.json
ocf_object_type: TX_PLAN_SECURITY_RETRACTION
ocf_title: Object - Plan Security Retraction
ocf_kind: object
required_fields: []
target_standard: Carta
target_version: "v1alpha1 (2026-04-30)"
status: complete
last_generated: 2026-05-18
---

# Object - Plan Security Retraction → Carta

> Object describing plan security retraction transaction (a compatibility wrapper for equity compensation retraction event)

## OCF schema

Source: [`PlanSecurityRetraction.schema.json`](./PlanSecurityRetraction.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/retraction/PlanSecurityRetraction.schema.json",
  "title": "Object - Plan Security Retraction",
  "description": "Object describing plan security retraction transaction (a compatibility wrapper for equity compensation retraction event)",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/retraction/EquityCompensationRetraction.schema.json"
    }
  ],
  "properties": {
    "object_type": {
      "const": "TX_PLAN_SECURITY_RETRACTION"
    }
  },
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/retraction/PlanSecurityRetraction.schema.json",
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
```

## Ask a mapping question

Use a link below to open a prefilled GitHub issue. The issue can be copied into the auditable checklist in `## Notes / open questions`.

<details>
<summary>Open a prefilled issue for a property</summary>

<!-- mapping-question-links:start -->
| Source property | Action |
| --- | --- |
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fretraction%2FPlanSecurityRetraction.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fretraction%2FPlanSecurityRetraction.mapping.md&title=%5BMapping+question%5D+PlanSecurityRetraction) |
| `object_type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fretraction%2FPlanSecurityRetraction.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fretraction%2FPlanSecurityRetraction.mapping.md&title=%5BMapping+question%5D+PlanSecurityRetraction%3A+object_type&property_path=object_type) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- Deprecated compatibility wrapper for `EquityCompensationRetraction`; its inherited fields remain unmappable because Carta has no retraction transaction.
- The wrapper contributes only `object_type`, which is OCF scaffolding.

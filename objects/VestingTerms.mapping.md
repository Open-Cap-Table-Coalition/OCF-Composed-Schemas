---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/VestingTerms.schema.json
ocf_object_type: VESTING_TERMS
ocf_title: Object - Vesting Terms
ocf_kind: object
required_fields:
  - object_type
  - id
  - statements
target_standard: Carta
target_version: "v1alpha1 (2026-06-22)"
status: complete
last_generated: 2026-06-29
---

# Object - Vesting Terms → Carta

> Version dispatcher for vesting terms. The stable public `$id` accepts either the current condition-DAG shape (v1) or the forward-looking ordered-statement template shape (v2) during the transition window.

## OCF schema

Source: [`VestingTerms.schema.json`](./VestingTerms.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/VestingTerms.schema.json",
  "title": "Object - Vesting Terms",
  "description": "Version dispatcher for vesting terms. The stable public `$id` accepts either the current condition-DAG shape (v1) or the forward-looking ordered-statement template shape (v2) during the transition window.",
  "x-ocf-stability": "alpha",
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "description": "Identifier the issuance's `vesting_template_id` references."
    },
    "object_type": {
      "const": "VESTING_TERMS"
    },
    "statements": {
      "description": "Ordered list of vesting statements. They chain implicitly by their `order` field rather than via explicit graph edges.",
      "type": "array",
      "items": {
        "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/vesting/VestingStatement.schema.json"
      },
      "minItems": 1
    }
  },
  "required": [
    "object_type",
    "id",
    "statements"
  ],
  "additionalProperties": false,
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/versions.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
# unmappable reason vocabulary: no-equivalent | excluded-from-snapshot | target-definition-removed | out-of-scope | ocf-internal
status: complete

fields:
  id:
    kind: rename
    target: "#/$defs/VestingScheduleTemplate/properties/id"
  object_type:
    kind: unmappable
    target: null
    reason: ocf-internal
  statements:
    kind: rename
    target: "#/$defs/VestingScheduleTemplate/properties/periods"
```

## Ask a mapping question

Use a link below to open a prefilled GitHub issue. The issue can be copied into the auditable checklist in `## Notes / open questions`.

<details>
<summary>Open a prefilled issue for a property</summary>

<!-- mapping-question-links:start -->
| Source property | Action |
| --- | --- |
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FVestingTerms.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FVestingTerms.mapping.md&title=%5BMapping+question%5D+VestingTerms) |
| `id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FVestingTerms.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FVestingTerms.mapping.md&title=%5BMapping+question%5D+VestingTerms%3A+id&property_path=id) |
| `object_type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FVestingTerms.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FVestingTerms.mapping.md&title=%5BMapping+question%5D+VestingTerms%3A+object_type&property_path=object_type) |
| `statements` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FVestingTerms.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FVestingTerms.mapping.md&title=%5BMapping+question%5D+VestingTerms%3A+statements&property_path=statements) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- OCF `VestingTerms` maps to Carta `VestingScheduleTemplate`: `id` → `id`, and each `VestingStatement` in `statements` projects to one `VestingPeriod` in `periods[]`.
- The per-statement projection is defined in [`VestingStatement.mapping.md`](../types/vesting/VestingStatement.mapping.md). June 22 makes `VestingScheduleTemplate.issuerId`, `name`, and `vestingScheduleType` required; issuer context, a template name, and the schedule mode are not present on OCF `VestingTerms` and remain explicit requirements for a schema-valid Carta record.
- `object_type` is OCF scaffolding; Carta types the schedule positionally.

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
target_version: v1alpha1 (2026-04-30)
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
# unmappable reason vocabulary: no-equivalent | excluded-from-snapshot | out-of-scope | ocf-internal
status: complete
coverage: 3/3

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

## Notes / open questions

- `VestingTerms` is the parent of OCF's new statements-based vesting model. Its Carta analogue is `VestingScheduleTemplate`: a reusable schedule shape whose statements live as `periods[]` in the template. This mirrors the pre-#227 `canonical/vesting/VestingScheduleTemplate.mapping.md` targets exactly.
- `id` → the template's `id`. OCF's `id` is the identifier an issuance's `vesting_template_id` references, which is the same role Carta's `VestingScheduleTemplate.id` plays, so it is a genuine `rename` rather than `ocf-internal`. Note Carta's `id` has `maxLength: 50`; OCF imposes no length bound, so a long OCF id could need truncation/remapping at export time.
- `statements` → `periods[]`. Each OCF `VestingStatement` projects to one Carta `VestingPeriod`; the per-statement field projection (`order`/`occurrences`/`period`/`period_type`/`cliff`/`percentage` → Carta `VestingPeriod`) is documented on `types/vesting/VestingStatement.mapping.md`, not here.
- `object_type` is the OCF type discriminator (const `VESTING_TERMS`); Carta has no equivalent, so it is `ocf-internal`.
- Carta's `VestingScheduleTemplate` also exposes `issuerId`, `name`, `description`, `vestingScheduleType`, and `uuid`, which have no OCF source on `VestingTerms` and are left unset by this mapping.

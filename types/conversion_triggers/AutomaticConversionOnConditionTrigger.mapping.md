---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_triggers/AutomaticConversionOnConditionTrigger.schema.json
ocf_object_type: null
ocf_title: Type - Automatic Conversion on Condition Trigger
ocf_kind: type
required_fields:
  - trigger_id
  - trigger_condition
  - type
  - conversion_right
  - type
  - trigger_id
  - conversion_right
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-05-18
---

# Type - Automatic Conversion on Condition Trigger → Carta

> Type representation of automatic trigger on a tive or condition.

## OCF schema

Source: [`AutomaticConversionOnConditionTrigger.schema.json`](./AutomaticConversionOnConditionTrigger.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_triggers/AutomaticConversionOnConditionTrigger.schema.json",
  "title": "Type - Automatic Conversion on Condition Trigger",
  "description": "Type representation of automatic trigger on a tive or condition.",
  "type": "object",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/types/conversion_triggers/ConversionTrigger.schema.json"
    }
  ],
  "properties": {
    "type": {
      "const": "AUTOMATIC_ON_CONDITION"
    },
    "trigger_id": {
      "description": "Id for this conversion trigger, unique within list of ConversionTriggers in parent convertible issuance's `conversion_triggers` field.",
      "type": "string"
    },
    "nickname": {
      "description": "Human-friendly nickname to describe the conversion right",
      "type": "string"
    },
    "trigger_description": {
      "description": "Long-form description of the trigger",
      "type": "string"
    },
    "conversion_right": {
      "description": "When the conditions of the trigger are met, how does the convertible convert?",
      "oneOf": [
        {
          "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_rights/ConvertibleConversionRight.schema.json"
        },
        {
          "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_rights/WarrantConversionRight.schema.json"
        },
        {
          "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_rights/StockClassConversionRight.schema.json"
        }
      ]
    },
    "trigger_condition": {
      "description": "Legal language describing what conditions must be satisfied for the conversion to take place (ideally, this should be excerpted from the instrument where possible)",
      "type": "string"
    }
  },
  "additionalProperties": false,
  "required": [
    "trigger_id",
    "trigger_condition",
    "type",
    "conversion_right",
    "type",
    "trigger_id",
    "conversion_right"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/conversion_triggers/AutomaticConversionOnConditionTrigger.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: complete
coverage: 6/6

fields:
  type:
    kind: unmappable
    target: null
    reason: no-equivalent
    values:
      AUTOMATIC_ON_CONDITION: null
  trigger_id:
    kind: unmappable
    target: null
    reason: ocf-internal
  nickname:
    kind: unmappable
    target: null
    reason: no-equivalent
  trigger_description:
    kind: unmappable
    target: null
    reason: no-equivalent
  conversion_right:
    kind: unmappable
    target: null
    reason: no-equivalent
  trigger_condition:
    kind: unmappable
    target: null
    reason: no-equivalent
```

## Notes / open questions

- **Bucket 3 (absent).** Carta has no reusable conversion-trigger type and does not model OCF's structured, polymorphic conversion-trigger objects at all. OCF's `ConversionTrigger` family (`AutomaticConversionOnConditionTrigger`, `AutomaticConversionOnDateTrigger`, `ElectiveConversionAtWillTrigger`, `ElectiveConversionInDateRangeTrigger`, `ElectiveConversionOnConditionTrigger`, `UnspecifiedConversionTrigger`) is a small event/state-machine vocabulary: each trigger carries a `type` discriminator, a `trigger_id`, free-text labels (`nickname`, `trigger_description`), the legal `trigger_condition`, and a polymorphic `conversion_right` describing *how* the instrument converts once the trigger fires. Carta records convertible economics as flat scalars and has no analogous structure for "when/whether a conversion is triggered and the right it produces."
- **Where this type is `$ref`'d in OCF.** The `conversion_triggers` array on `objects/transactions/issuance/ConvertibleIssuance.schema.json` and on `objects/transactions/issuance/WarrantIssuance.schema.json` (via the shared `ConversionMechanism`/issuance shapes), as a member of the trigger `oneOf`.
- **Why nothing here has a Carta home (field by field):**
  - `type` (const `AUTOMATIC_ON_CONDITION`) is the trigger-kind discriminator. Carta has no conversion-trigger-type enum (no `ConversionTriggerType`/`TriggerType` `$def` exists in the pinned bundle), so the single allowed value has no enum member to remap to — `unmappable / no-equivalent`, value listed as `null`.
  - `trigger_id` is an OCF-internal identifier scoped to the parent issuance's `conversion_triggers` list; Carta has no per-trigger objects to carry an id. Marked `ocf-internal` for consistency with the structural twin `ElectiveConversionOnConditionTrigger` and the other trigger siblings (`AutomaticConversionOnDateTrigger`, `ElectiveConversionAtWillTrigger`, `UnspecifiedConversionTrigger`), all of which treat the trigger-list `trigger_id` as OCF list-scaffolding rather than `no-equivalent`.
  - `nickname` / `trigger_description` are human-friendly labels for the trigger; Carta exposes no free-text field on its convertible objects to hold trigger-level descriptions.
  - `conversion_right` is the polymorphic right (`ConvertibleConversionRight` / `WarrantConversionRight` / `StockClassConversionRight`) that the convertible exercises on conversion — itself a structured object with its own conversion-mechanism economics. Carta has no conversion-right type and does not store the per-trigger conversion mechanism.
  - `trigger_condition` is the excerpted legal language for the conversion condition; Carta has no field for the legal/contractual condition text.
- **Re: Carta's `conversionTrigger` (`Money`) — not a target here.** `#/$defs/ConvertibleNote/properties/conversionTrigger` and `#/$defs/ConvertibleIssuanceTransaction/properties/conversionTrigger` are single `Money` scalars representing a monetary conversion-trigger threshold (e.g. a qualified-financing amount). They are NOT analogues of this OCF type: this type carries no top-level monetary amount — any threshold amount lives inside the nested `conversion_right`'s conversion mechanism, not as a property of the trigger itself. Mapping any field here onto Carta's `conversionTrigger` `Money` would be a category error (structured trigger/condition logic vs. a bare dollar threshold), so the field is intentionally left as a target for the convertible economics that DO produce a dollar amount, handled at the convertible-issuance object level — not by this trigger type.
- **Net:** the economic terms Carta does record for convertibles (principal, valuation/price cap, discount, interest, maturity — see `ConvertibleNote`/`ConvertibleIssuanceTransaction`) flow from the convertible issuance object and its conversion *mechanism*, not from the trigger's condition/event logic. This trigger type contributes only the absent state-machine/legal-condition layer, hence all six properties are `unmappable / no-equivalent`.

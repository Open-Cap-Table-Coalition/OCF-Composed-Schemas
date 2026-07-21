---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_triggers/ElectiveConversionOnConditionTrigger.schema.json
ocf_object_type: null
ocf_title: Type - Elective Conversion on Condition Trigger
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

# Type - Elective Conversion on Condition Trigger → Carta

> Type representation of elective trigger on fulfillment of a condition.

## OCF schema

Source: [`ElectiveConversionOnConditionTrigger.schema.json`](./ElectiveConversionOnConditionTrigger.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_triggers/ElectiveConversionOnConditionTrigger.schema.json",
  "title": "Type - Elective Conversion on Condition Trigger",
  "description": "Type representation of elective trigger on fulfillment of a condition.",
  "type": "object",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/types/conversion_triggers/ConversionTrigger.schema.json"
    }
  ],
  "properties": {
    "type": {
      "const": "ELECTIVE_ON_CONDITION"
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
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/conversion_triggers/ElectiveConversionOnConditionTrigger.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: complete

fields:
  type:
    kind: unmappable
    target: null
    reason: no-equivalent
    values:
      ELECTIVE_ON_CONDITION: null
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

- **Bucket 3 (absent).** `ElectiveConversionOnConditionTrigger` is one of OCF's six `ConversionTrigger` variants — a structural/event-logic node that says *when and how* a convertible may convert (here: an **elective** right the holder may exercise once a stated **condition** is fulfilled). Carta does **not** model the OCF conversion-trigger concept as a reusable `$def`: there is no Carta type, object, or sub-structure corresponding to a conversion **trigger** (no trigger-kind discriminator, no AND/OR / EARLIER_OF / LATER_OF event logic, no per-trigger id, no per-trigger free-text labels, and no field for the legal trigger condition). The only `trigger`-named node in the pinned bundle is the scalar `conversionTrigger` Money field (see below), which is a dollar threshold, not the OCF trigger object. Carta records convertible *terms* on `ConvertibleNote` / `ConvertibleIssuanceTransaction`, not OCF's trigger state machine, so every property here is `unmappable`. This is the exact structural twin of `AutomaticConversionOnConditionTrigger` (same six properties, same `trigger_condition`); only the `type` discriminator differs (`ELECTIVE_ON_CONDITION` vs `AUTOMATIC_ON_CONDITION`), so both classify identically.
- **Where this type is `$ref`'d in OCF.** As a member of the `ConversionTrigger` `oneOf` on the `conversion_triggers` array of `objects/transactions/issuance/ConvertibleIssuance.schema.json` and `objects/transactions/issuance/WarrantIssuance.schema.json`. At the object level those issuances map their economic terms to `ConvertibleIssuanceTransaction` / `ConvertibleNote`; the trigger array (this type) is dropped on transfer.
- **Why nothing here has a Carta home (field by field):**
  - `type` (const `ELECTIVE_ON_CONDITION`) is the variant discriminator selecting which `ConversionTrigger` subtype this is. Carta has no conversion-trigger-type enum (no `ConversionTriggerType`/`TriggerType` `$def` exists in the pinned bundle; the `oneOf` over `Automatic*`/`Elective*`/`Unspecified*` triggers has no analogue), so the single OCF enum value has no enum member to remap to — `unmappable / no-equivalent`, value listed as `null`.
  - `trigger_id` is OCF-internal scaffolding (a list-local id, unique only within the parent convertible/warrant issuance's `conversion_triggers` array); it has no business meaning to carry into Carta, hence `ocf-internal`. (Mirrors the `ElectiveConversionAtWillTrigger` precedent's treatment of `trigger_id`.)
  - `nickname` / `trigger_description` are human-friendly labels for the trigger; Carta exposes no free-text field on its convertible objects to hold trigger-level descriptions, so both are dropped (`no-equivalent`).
  - `conversion_right` is a nested `oneOf` over `ConvertibleConversionRight` / `WarrantConversionRight` / `StockClassConversionRight`, each of which wraps a conversion **mechanism** carrying the economic terms (discount, valuation/price cap, ratio, etc.). Those economic terms reach Carta only at the mechanism-object level — e.g. ratio/price terms route to `#/$defs/ShareClassRightsAndPreferences/properties/{conversionRatio,conversionPrice}` and note/SAFE terms to `#/$defs/ConvertibleNote/properties/{priceCap,discountPercentage,...}` — and are covered by the conversion-mechanism mappings, not here. The `conversion_right` reference itself (and the trigger-to-right linkage) is not representable as a Carta field, so it is `unmappable` at this node.
  - `trigger_condition` is the excerpted legal language describing the condition that must be satisfied for the conversion to take place. Carta has no field for the legal/contractual condition text on its convertible objects, so it is `unmappable / no-equivalent`.
- **Re: Carta's `conversionTrigger` (`Money`) — not a target here.** `#/$defs/ConvertibleNote/properties/conversionTrigger` and `#/$defs/ConvertibleIssuanceTransaction/properties/conversionTrigger` are single `Money` scalars representing a monetary conversion-trigger threshold (e.g. a qualified-financing amount). They are NOT analogues of this OCF type: an elective-on-condition trigger carries no top-level monetary amount — any threshold/economic amount lives inside the nested `conversion_right`'s conversion mechanism, not as a property of the trigger itself. Mapping `trigger_condition` (or any field here) onto Carta's `conversionTrigger` `Money` would be a category error (structured trigger/condition logic vs. a bare dollar threshold), so the field is left for the convertible economics that DO produce a dollar amount, handled at the convertible-issuance object level — not by this trigger type.
- **Net:** the economic terms Carta does record for convertibles (principal, valuation/price cap, discount, interest, maturity — see `ConvertibleNote` / `ConvertibleIssuanceTransaction`) flow from the convertible issuance object and its conversion *mechanism*, not from the trigger's condition/event logic. This trigger type contributes only the absent state-machine/legal-condition layer, hence all six properties are `unmappable`.

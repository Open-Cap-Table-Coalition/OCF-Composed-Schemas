---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_triggers/UnspecifiedConversionTrigger.schema.json
ocf_object_type: null
ocf_title: Type - Unspecified Conversion Trigger
ocf_kind: type
required_fields:
  - trigger_id
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

# Type - Unspecified Conversion Trigger → Carta

> Use this where no structured data is available regarding what triggers the conversion of a given security.

## OCF schema

Source: [`UnspecifiedConversionTrigger.schema.json`](./UnspecifiedConversionTrigger.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_triggers/UnspecifiedConversionTrigger.schema.json",
  "title": "Type - Unspecified Conversion Trigger",
  "description": "Use this where no structured data is available regarding what triggers the conversion of a given security.",
  "type": "object",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/types/conversion_triggers/ConversionTrigger.schema.json"
    }
  ],
  "properties": {
    "type": {
      "const": "UNSPECIFIED"
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
    }
  },
  "additionalProperties": false,
  "required": [
    "trigger_id",
    "type",
    "conversion_right",
    "type",
    "trigger_id",
    "conversion_right"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/conversion_triggers/UnspecifiedConversionTrigger.schema.json"
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
      UNSPECIFIED: null
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
```

## Notes / open questions

- **Bucket 3 (absent).** `UnspecifiedConversionTrigger` is the catch-all variant of OCF's `ConversionTrigger` family — used "where no structured data is available regarding what triggers the conversion of a given security." Like its siblings (`AutomaticConversionOnConditionTrigger`, `AutomaticConversionOnDateTrigger`, `ElectiveConversionAtWillTrigger`, `ElectiveConversionInDateRangeTrigger`, `ElectiveConversionOnConditionTrigger`), it is a structural/event-logic node describing *when and how* a convertible converts. Carta does **not** model the OCF conversion-trigger concept as a reusable `$def`: there is no Carta type, object, or sub-structure corresponding to a conversion **trigger** (no trigger-kind discriminator, no trigger id, no per-trigger free-text labels, no nested conversion-right linkage). Carta records convertible *terms* on `ConvertibleNote` / `ConvertibleIssuanceTransaction`, not OCF's trigger state machine, so every property here is `unmappable`. This is consistent with the completed `ElectiveConversionAtWillTrigger` and `AutomaticConversionOnConditionTrigger` mappings, which share the identical field set and the same bucket-3 disposition.
- **This is the *unspecified* variant specifically.** By definition this trigger carries *no* structured trigger condition or date — it exists precisely because the conversion mechanics could not be captured as structured data. So even setting aside Carta's missing trigger structure, there is nothing here to route to a Carta field beyond the free-text labels, which Carta also has no home for.
- Do not confuse this with Carta's `conversionTrigger` field (`#/$defs/ConvertibleNote/properties/conversionTrigger` and `#/$defs/ConvertibleIssuanceTransaction/properties/conversionTrigger`, both `#/$defs/Money`). That field is a **dollar amount** — the qualified-financing threshold that must be raised for an automatic conversion — not a representation of OCF's polymorphic `ConversionTrigger`. An *unspecified* trigger has no such threshold amount, and none of this type's properties carry a monetary value, so there is no Money target to route to. Mapping any field here onto that `Money` scalar would be a category error (structured/undescribed trigger logic vs. a bare dollar threshold).
- `type` (const `UNSPECIFIED`) is the variant discriminator selecting which `ConversionTrigger` subtype this is. Carta has no conversion-trigger-type enum (no `ConversionTriggerType` / `TriggerType` `$def` exists in the pinned bundle; the `oneOf` over `Automatic*` / `Elective*` / `Unspecified*` triggers has no analogue), so the single OCF enum value maps to `null` (`no-equivalent`).
- `trigger_id` is OCF-internal scaffolding — a list-local id, unique only within the parent convertible/warrant issuance's `conversion_triggers` array. It has no business meaning to carry into Carta, hence `ocf-internal` rather than `no-equivalent`. (This matches the `ElectiveConversionAtWillTrigger` precedent; `AutomaticConversionOnConditionTrigger` used `no-equivalent` for the same field — either is defensible, but `ocf-internal` is the more precise reason for a pure list-local identifier.)
- `nickname` and `trigger_description` are human-friendly labels for the trigger. Carta exposes no free-text label field on its convertible objects to hold a per-trigger note/description, so both are dropped as `no-equivalent`.
- `conversion_right` is a nested `oneOf` over `ConvertibleConversionRight` / `WarrantConversionRight` / `StockClassConversionRight`, each of which wraps a conversion **mechanism** carrying the economic terms (discount, valuation/price cap, ratio, etc.). Those economic terms reach Carta only at the mechanism/issuance-object level — e.g. ratio terms route to `#/$defs/ShareClassRightsAndPreferences/properties/{conversionRatio,conversionPrice}` and note/SAFE terms to `#/$defs/ConvertibleNote/properties/{priceCap,discountPercentage,...}` — and are covered by the conversion-mechanism mappings, not here. The `conversion_right` reference itself (and the trigger-to-right linkage) is not representable as a Carta field, so it is `unmappable / no-equivalent` at this node.
- **Where this type is `$ref`'d in OCF.** As a member of the conversion-trigger `oneOf` on the `conversion_triggers` array of `objects/transactions/issuance/ConvertibleIssuance.schema.json` and `objects/transactions/issuance/WarrantIssuance.schema.json`. At the object level those issuances map their economic terms to `ConvertibleIssuanceTransaction` / `ConvertibleNote`; the trigger array (this type) is dropped on transfer.

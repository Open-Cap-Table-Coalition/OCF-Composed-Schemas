---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_triggers/ElectiveConversionAtWillTrigger.schema.json
ocf_object_type: null
ocf_title: Type - Elective Conversion At Will
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

# Type - Elective Conversion At Will → Carta

> Type representation of elective trigger valid at will (so long as instrument is valid and outstanding).

## OCF schema

Source: [`ElectiveConversionAtWillTrigger.schema.json`](./ElectiveConversionAtWillTrigger.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_triggers/ElectiveConversionAtWillTrigger.schema.json",
  "title": "Type - Elective Conversion At Will",
  "description": "Type representation of elective trigger valid at will (so long as instrument is valid and outstanding).",
  "type": "object",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/types/conversion_triggers/ConversionTrigger.schema.json"
    }
  ],
  "properties": {
    "type": {
      "const": "ELECTIVE_AT_WILL"
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
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/conversion_triggers/ElectiveConversionAtWillTrigger.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
status: complete
coverage: 5/5

fields:
  type:
    kind: unmappable
    target: null
    reason: no-equivalent
    values:
      ELECTIVE_AT_WILL: null
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

- **Bucket 3 (absent).** `ElectiveConversionAtWillTrigger` is one of OCF's `ConversionTrigger` variants — a structural/event-logic node that says *when and how* a convertible may convert (here: an elective right the holder may exercise at any time the instrument is valid and outstanding). Carta does **not** model the OCF conversion-trigger concept as a reusable `$def`: there is no Carta type, object, or sub-structure that corresponds to a conversion **trigger** (the trigger-kind discriminator, the AND/OR / EARLIER_OF / LATER_OF event logic, the trigger id, or the per-trigger free-text labels). Carta records convertible *terms* on `ConvertibleNote` / `ConvertibleIssuanceTransaction`, not OCF's trigger state machine, so every property here is `unmappable`.
- Do not confuse this with Carta's `conversionTrigger` field (`#/$defs/ConvertibleNote/properties/conversionTrigger` and `#/$defs/ConvertibleIssuanceTransaction/properties/conversionTrigger`, both `#/$defs/Money`). That field is a **dollar amount** — the qualified-financing threshold that must be raised for an automatic conversion — not a representation of OCF's polymorphic `ConversionTrigger`. An *elective at-will* trigger has no such threshold amount, and none of this type's properties carry a monetary value, so there is no Money target to route to.
- `type` (const `ELECTIVE_AT_WILL`) is the variant discriminator selecting which `ConversionTrigger` subtype this is. Carta has no conversion-trigger-type enum (the `oneOf` over `Automatic*`/`Elective*`/`Unspecified*` triggers has no analogue), so the single OCF enum value maps to `null`.
- `trigger_id` is OCF-internal scaffolding (a list-local id, unique only within the parent convertible/warrant issuance's `conversion_triggers` array); it has no business meaning to carry into Carta, hence `ocf-internal` rather than `no-equivalent`.
- `nickname` and `trigger_description` are human-friendly labels for the trigger. Carta has no free-text label field on the convertible objects that corresponds to a per-trigger note, so both are dropped.
- `conversion_right` is a nested `oneOf` over `ConvertibleConversionRight` / `WarrantConversionRight` / `StockClassConversionRight`, each of which wraps a conversion **mechanism** carrying the economic terms (discount, valuation/price cap, ratio, etc.). Those economic terms reach Carta only at the mechanism-object level — e.g. ratio terms route to `#/$defs/ShareClassRightsAndPreferences/properties/{conversionRatio,conversionPrice}` and note/SAFE terms to `#/$defs/ConvertibleNote/properties/{priceCap,discountPercentage,...}` — and are covered by the conversion-mechanism mappings, not here. The `conversion_right` reference itself (and the trigger-to-right linkage) is not representable as a Carta field, so it is `unmappable` at this node.
- OCF objects that `$ref` this type (via the `ConversionTrigger` `oneOf` on `conversion_triggers`): `objects/transactions/issuance/ConvertibleIssuance.schema.json` and `objects/transactions/issuance/WarrantIssuance.schema.json`. At the object level those issuances map their economic terms to `ConvertibleIssuanceTransaction` / `ConvertibleNote`; the trigger array (this type) is dropped on transfer.

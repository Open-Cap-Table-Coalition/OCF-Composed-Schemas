---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_triggers/ElectiveConversionInDateRangeTrigger.schema.json
ocf_object_type: null
ocf_title: Type - Elective Conversion In Date Range Trigger
ocf_kind: type
required_fields:
  - trigger_id
  - type
  - start_date
  - end_date
  - conversion_right
  - type
  - trigger_id
  - conversion_right
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-05-18
---

# Type - Elective Conversion In Date Range Trigger → Carta

> Type representation of elective trigger valid on or after start_date and until or before end_date.

## OCF schema

Source: [`ElectiveConversionInDateRangeTrigger.schema.json`](./ElectiveConversionInDateRangeTrigger.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_triggers/ElectiveConversionInDateRangeTrigger.schema.json",
  "title": "Type - Elective Conversion In Date Range Trigger",
  "description": "Type representation of elective trigger valid on or after start_date and until or before end_date.",
  "type": "object",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/types/conversion_triggers/ConversionTrigger.schema.json"
    }
  ],
  "properties": {
    "type": {
      "const": "ELECTIVE_IN_RANGE"
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
    "start_date": {
      "description": "Start date of range (inclusive)",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "end_date": {
      "description": "End date of range (inclusive)",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    }
  },
  "additionalProperties": false,
  "required": [
    "trigger_id",
    "type",
    "start_date",
    "end_date",
    "conversion_right",
    "type",
    "trigger_id",
    "conversion_right"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/conversion_triggers/ElectiveConversionInDateRangeTrigger.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: complete
coverage: 7/7

fields:
  type:
    kind: unmappable
    target: null
    reason: no-equivalent
    values:
      ELECTIVE_IN_RANGE: null
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
  start_date:
    kind: unmappable
    target: null
    reason: no-equivalent
  end_date:
    kind: unmappable
    target: null
    reason: no-equivalent
```

## Notes / open questions

- **Bucket 3 (absent).** `ElectiveConversionInDateRangeTrigger` is one of OCF's `ConversionTrigger` variants — a structural/event-logic node that says *when and how* a convertible may convert. Here the trigger is an elective right the holder may exercise during a bounded calendar window: valid on or after `start_date` and until or before `end_date` (both inclusive). Carta does **not** model the OCF conversion-trigger concept as a reusable `$def`: there is no Carta type, object, or sub-structure that corresponds to a conversion **trigger** (the trigger-kind discriminator, the permissible-window date bounds, the trigger id, the per-trigger free-text labels, or the polymorphic `conversion_right`). Carta records convertible *terms* on `ConvertibleNote` / `ConvertibleIssuanceTransaction`, not OCF's trigger state machine, so every property here is `unmappable / no-equivalent`. This is consistent with the sibling trigger mappings (`ElectiveConversionAtWillTrigger`, `AutomaticConversionOnConditionTrigger`), which are likewise all-unmappable.
- **Where this type is `$ref`'d in OCF.** As a member of the `conversion_triggers` trigger `oneOf` on `objects/transactions/issuance/ConvertibleIssuance.schema.json` and `objects/transactions/issuance/WarrantIssuance.schema.json`. At the object level those issuances map their economic terms to `ConvertibleIssuanceTransaction` / `ConvertibleNote`; the trigger array (this type) is dropped on transfer.
- **Why nothing here has a Carta home (field by field):**
  - `type` (const `ELECTIVE_IN_RANGE`) is the trigger-kind discriminator selecting which `ConversionTrigger` subtype this is. Carta has no conversion-trigger-type enum (no `ConversionTriggerType`/`TriggerType` `$def` exists in the pinned bundle; the OCF `oneOf` over `Automatic*`/`Elective*`/`Unspecified*` triggers has no analogue), so the single OCF enum value has no enum member to remap to — `unmappable / no-equivalent`, value listed as `null`.
  - `trigger_id` is an OCF-internal identifier scoped to the parent issuance's `conversion_triggers` list; Carta has no per-trigger objects to carry an id. Marked `ocf-internal` (list-scaffolding, not an absent business concept) for consistency with the structural elective twins `ElectiveConversionOnConditionTrigger` and `ElectiveConversionAtWillTrigger`, and the majority of the trigger siblings (`AutomaticConversionOnConditionTrigger`, `UnspecifiedConversionTrigger`), all of which treat the trigger-list `trigger_id` the same way.
  - `nickname` / `trigger_description` are human-friendly labels for the trigger; Carta exposes no free-text field on its convertible objects to hold trigger-level descriptions.
  - `conversion_right` is the polymorphic right (`ConvertibleConversionRight` / `WarrantConversionRight` / `StockClassConversionRight`) describing *how* the instrument converts once the holder elects — itself a structured object carrying conversion-mechanism economics (discount, valuation/price cap, ratio, etc.). Those economic terms reach Carta only at the mechanism-object level (e.g. ratio terms → `#/$defs/ShareClassRightsAndPreferences/properties/{conversionRatio,conversionPrice}`, note/SAFE terms → `#/$defs/ConvertibleNote/properties/{priceCap,discountPercentage,...}`) and are covered by the conversion-mechanism mappings, not here. Carta has no conversion-right type and does not store the per-trigger conversion mechanism, so the `conversion_right` reference and the trigger-to-right linkage are not representable at this node.
  - `start_date` / `end_date` (OCF `Date`) are the inclusive bounds of the *permissible elective-conversion window* — i.e. trigger-eligibility logic ("the holder may elect to convert between X and Y"), not a realized conversion event. Carta has no field for a conversion-eligibility window. The only Carta date fields in this neighborhood are realized-event datetimes on `ConvertibleNote` — `#/$defs/ConvertibleNote/properties/conversionDatetime` (the single datetime the note actually converted), `issueDatetime`, `canceledDatetime`, `maturityDatetime` — none of which is a window start/end. Mapping a two-ended permissible range onto a single realized `conversionDatetime` (which is populated only *after* conversion occurs, and holds one point in time) would be a category error and lossy, so both window bounds are `unmappable / no-equivalent`. (Although OCF `Date` itself is a bucket-1 type that aligns with Carta's `Iso8601CompleteCalendarDate`, the absence here is at the trigger-semantics level — there is no Carta field whose *meaning* is "conversion-window boundary" to receive these values.)
- **Re: Carta's `conversionTrigger` (`Money`) — not a target here.** `#/$defs/ConvertibleNote/properties/conversionTrigger` and `#/$defs/ConvertibleIssuanceTransaction/properties/conversionTrigger` are single `Money` scalars representing a monetary conversion-trigger threshold (e.g. a qualified-financing amount), not analogues of OCF's polymorphic `ConversionTrigger`. This date-range trigger carries no top-level monetary amount, so there is no Money value to route there — that field stays reserved for the convertible economics that genuinely produce a dollar amount, handled at the convertible-issuance object level, not by this trigger type.
- **Net:** the convertible economics Carta does record (principal, valuation/price cap, discount, interest, maturity — see `ConvertibleNote` / `ConvertibleIssuanceTransaction`) flow from the convertible issuance object and its conversion *mechanism*, not from this trigger's window/event logic. This trigger type contributes only the absent state-machine layer (trigger kind, eligibility window, per-trigger labels, conversion-right linkage), hence all seven properties are `unmappable / no-equivalent`.
```

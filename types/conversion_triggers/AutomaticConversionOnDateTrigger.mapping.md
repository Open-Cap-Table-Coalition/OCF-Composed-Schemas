---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_triggers/AutomaticConversionOnDateTrigger.schema.json
ocf_object_type: null
ocf_title: Type - Automatic Conversion on Date Trigger
ocf_kind: type
required_fields:
  - trigger_id
  - trigger_date
  - type
  - conversion_right
  - type
  - trigger_id
  - conversion_right
target_standard: Carta
target_version: "v1alpha1 (2026-04-30)"
status: complete
last_generated: 2026-05-18
---

# Type - Automatic Conversion on Date Trigger → Carta

> Type representation of an automatic trigger on a date.

## OCF schema

Source: [`AutomaticConversionOnDateTrigger.schema.json`](./AutomaticConversionOnDateTrigger.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_triggers/AutomaticConversionOnDateTrigger.schema.json",
  "title": "Type - Automatic Conversion on Date Trigger",
  "description": "Type representation of an automatic trigger on a date.",
  "type": "object",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/types/conversion_triggers/ConversionTrigger.schema.json"
    }
  ],
  "properties": {
    "type": {
      "const": "AUTOMATIC_ON_DATE"
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
    "trigger_date": {
      "description": "Date on which trigger occurs automatically (if it hasn't already occured)",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    }
  },
  "additionalProperties": false,
  "required": [
    "trigger_id",
    "trigger_date",
    "type",
    "conversion_right",
    "type",
    "trigger_id",
    "conversion_right"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/conversion_triggers/AutomaticConversionOnDateTrigger.schema.json"
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
      AUTOMATIC_ON_DATE: null
  trigger_id:
    kind: unmappable
    target: null
    reason: no-equivalent
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
  trigger_date:
    kind: unmappable
    target: null
    reason: no-equivalent
```

## Notes / open questions

**Bucket 3 (absent).** `AutomaticConversionOnDateTrigger` is one member of OCF's
`ConversionTrigger` family — the structured, event-logic nodes that sit in a convertible
issuance's `conversion_triggers[]` array and describe *when* and *how* an instrument converts.
Here the trigger fires automatically on a single pre-agreed calendar date. Carta does **not**
model the OCF conversion-trigger concept as a reusable `$def`: there is no Carta type, object,
or sub-structure that corresponds to a conversion **trigger** (the trigger-kind discriminator,
the scheduled trigger date, the trigger id, the per-trigger free-text labels, or the
polymorphic `conversion_right`). Carta records convertible *terms and realized lifecycle dates*
on `#/$defs/ConvertibleNote` / `#/$defs/ConvertibleIssuanceTransaction`
(`conversionDatetime`, `maturityDatetime`, `priceCap`, `discountPercentage`,
`conversionTrigger`, `interestRate`, …), not OCF's trigger state machine, so every property
here is `unmappable / no-equivalent`. This is consistent with the sibling trigger mappings
(`ElectiveConversionInDateRangeTrigger`, `AutomaticConversionOnConditionTrigger`,
`ElectiveConversionAtWillTrigger`, `UnspecifiedConversionTrigger`,
`ElectiveConversionOnConditionTrigger`), which are likewise all-unmappable / bucket 3.

This type carries no economic terms of its own (discount, valuation cap, ratio, price,
interest, conversion-trigger amount all live deeper, inside `conversion_right` →
`conversion_mechanism`), so there are no economic fields to route here either — only a
scheduled date and the trigger scaffolding, both absent on the Carta side.

**Where this type is `$ref`'d in OCF** (via `grep -rl`):
`objects/transactions/issuance/ConvertibleIssuance.schema.json` and
`objects/transactions/issuance/WarrantIssuance.schema.json` each `$ref` it (through the
`conversion_triggers[]` `oneOf`). At the object level those issuances map their economic
terms to `#/$defs/ConvertibleIssuanceTransaction` / `#/$defs/ConvertibleNote`; the trigger
array (this type) is dropped on transfer.

Field-by-field:

- `trigger_date` → unmappable (no-equivalent). OCF `trigger_date` is the *scheduled,
  pre-agreed* automatic-conversion date that may not yet have occurred ("Date on which trigger
  occurs automatically (if it hasn't already occured)") — trigger-eligibility logic, not a
  realized conversion event. Carta has no field for a forward-looking scheduled trigger date.
  The only Carta date fields in this neighborhood are *realized-event* datetimes on
  `ConvertibleNote` — `conversionDatetime` (the single datetime the note **actually**
  converted, populated only *after* conversion occurs), `issueDatetime`, `canceledDatetime`,
  `maturityDatetime`. Routing a forward-looking scheduled date onto `conversionDatetime` would
  be a category error (scheduled term vs. realized event) and is explicitly rejected by the
  sibling `ElectiveConversionInDateRangeTrigger` mapping for the same reason; `maturityDatetime`
  denotes maturity, not an automatic conversion date. (Although OCF `Date` is itself a bucket-1
  type aligned with Carta's `Iso8601CompleteCalendarDate`, the absence here is at the
  trigger-semantics level — there is no Carta field whose *meaning* is "scheduled automatic
  conversion date" to receive this value.) So `unmappable / no-equivalent`.

- `type` → unmappable (no-equivalent). The OCF trigger discriminator (const
  `AUTOMATIC_ON_DATE`) selecting which `ConversionTrigger` subtype applies. Carta has no
  conversion-trigger-type enum (no `ConversionTriggerType`/`TriggerType` `$def` in the pinned
  bundle; the OCF `oneOf` over `Automatic*`/`Elective*`/`Unspecified*` triggers has no
  analogue), so there is no enum member to remap onto — value listed as `null`.

- `trigger_id` → unmappable (no-equivalent). Identifier unique only within a single issuance's
  `conversion_triggers[]` list; Carta has no per-trigger objects to carry an id. Kept
  `no-equivalent` (rather than `ocf-internal`) because the whole structured trigger concept is
  absent on the Carta side, not merely OCF scaffolding inside an otherwise-mapped object —
  matching the `ElectiveConversionInDateRangeTrigger` / `AutomaticConversionOnConditionTrigger`
  precedents.

- `nickname` → unmappable (no-equivalent). Free-text human label for the trigger. Carta's
  convertible objects expose `securityLabel` for the *security*, but no per-trigger label, and
  triggers are not retained, so there is nowhere to route a trigger nickname.

- `trigger_description` → unmappable (no-equivalent). Long-form prose describing the trigger.
  Carta records structured term fields, not narrative trigger descriptions; no free-text trigger
  field exists on `ConvertibleNote` / `ConvertibleIssuanceTransaction`.

- `conversion_right` → unmappable (no-equivalent). A nested `oneOf` over
  `ConvertibleConversionRight` / `WarrantConversionRight` / `StockClassConversionRight`, each
  of which further nests a `conversion_mechanism`. Carta has no analogous reusable
  conversion-right/mechanism structure: the convertible's economics it *does* keep (cap,
  discount, conversion-trigger amount, etc.) are flattened directly onto `ConvertibleNote` /
  `ConvertibleIssuanceTransaction`, not held in a nested per-trigger right object. Those
  economic terms are mapped by the conversion-mechanism mapping files, not here; this
  pointer-to-a-subtree as a whole has no single Carta home, so it is unmappable at this level.

**Re: Carta's `conversionTrigger` (`Money`) — not a target here.**
`#/$defs/ConvertibleNote/properties/conversionTrigger` and
`#/$defs/ConvertibleIssuanceTransaction/properties/conversionTrigger` are single `Money`
scalars representing a monetary conversion-trigger threshold (e.g. a qualified-financing
amount), not analogues of OCF's polymorphic `ConversionTrigger`. This date trigger carries no
top-level monetary amount, so there is no Money value to route there.
</content>
</invoke>

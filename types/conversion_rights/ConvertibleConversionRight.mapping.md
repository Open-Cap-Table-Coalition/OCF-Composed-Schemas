---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_rights/ConvertibleConversionRight.schema.json
ocf_object_type: null
ocf_title: Type - Convertible Conversion Rights
ocf_kind: type
required_fields:
  - conversion_mechanism
  - conversion_mechanism
target_standard: Carta
target_version: "v1alpha1 (2026-04-30)"
status: complete
last_generated: 2026-05-18
---

# Type - Convertible Conversion Rights → Carta

> Type representation of a conversion right from a convertible into another non-plan security

## OCF schema

Source: [`ConvertibleConversionRight.schema.json`](./ConvertibleConversionRight.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_rights/ConvertibleConversionRight.schema.json",
  "title": "Type - Convertible Conversion Rights",
  "description": "Type representation of a conversion right from a convertible into another non-plan security",
  "type": "object",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/types/conversion_rights/ConversionRight.schema.json"
    }
  ],
  "properties": {
    "type": {
      "const": "CONVERTIBLE_CONVERSION_RIGHT"
    },
    "conversion_mechanism": {
      "oneOf": [
        {
          "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/SAFEConversionMechanism.schema.json"
        },
        {
          "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/NoteConversionMechanism.schema.json"
        },
        {
          "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/CustomConversionMechanism.schema.json"
        },
        {
          "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/PercentCapitalizationConversionMechanism.schema.json"
        },
        {
          "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/FixedAmountConversionMechanism.schema.json"
        }
      ]
    },
    "converts_to_future_round": {
      "description": "Is this stock class potentially convertible into a future, as-yet undetermined stock class (e.g. Founder Preferred)",
      "type": "boolean"
    },
    "converts_to_stock_class_id": {
      "description": "The identifier of the existing, known stock class this stock class can convert into",
      "type": "string"
    }
  },
  "additionalProperties": false,
  "required": [
    "conversion_mechanism",
    "conversion_mechanism"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/conversion_rights/ConvertibleConversionRight.schema.json"
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
      CONVERTIBLE_CONVERSION_RIGHT: null
  conversion_mechanism:
    kind: split
    target:
      - "#/$defs/ConvertibleNote/properties/discountPercentage"
      - "#/$defs/ConvertibleNote/properties/priceCap"
      - "#/$defs/ConvertibleNote/properties/interestRate"
      - "#/$defs/ConvertibleNote/properties/interestAccrualPeriod"
      - "#/$defs/ConvertibleNote/properties/interestCompoundingPeriod"
      - "#/$defs/ConvertibleNote/properties/dayCountBasis"
  converts_to_future_round:
    kind: unmappable
    target: null
    reason: no-equivalent
  converts_to_stock_class_id:
    kind: unmappable
    target: null
    reason: no-equivalent
```

## Notes / open questions

- **Bucket 1 (type-to-type, with one clear Carta home).** `ConvertibleConversionRight` is OCF's polymorphic *conversion-right wrapper* for a convertible — a discriminated container (`type` + a `conversion_mechanism` `oneOf`) that bundles the conversion economics and logic/state-machine of a convertible together with its conversion target. Carta has no reusable `$def` literally named "conversion right," but a convertible's economic terms have a single, unambiguous Carta home: Carta models the convertible itself as a reusable object, `#/$defs/ConvertibleNote` (mirrored by the issuance event `#/$defs/ConvertibleIssuanceTransaction`), which inlines the discount, valuation/price cap, interest rate, accrual/compounding period, and day-count basis that this type's mechanisms carry. Per the Carta structured-target surface ("Convertible economics → `#/$defs/ConvertibleNote/...`") and the directly analogous sibling `StockClassConversionRight.mapping.md` (whose single mechanism maps onto `ShareClassRightsAndPreferences`), this is bucket 1, not bucket 3: the `conversion_mechanism` payload is mapped to its Carta leaves and only the genuinely-absent structural fields are marked `unmappable`. (It is deliberately NOT treated like the sibling `WarrantConversionRight`, whose mechanisms describe *warrant* economics that Carta's `WarrantIssuanceTransaction` does not carry; here the relevant `oneOf` members are convertible mechanisms with a clean `ConvertibleNote` home.)
- `type` is the `CONVERTIBLE_CONVERSION_RIGHT` discriminator const drawn from OCF's `ConversionRightType` enum (`CONVERTIBLE_CONVERSION_RIGHT` / `WARRANT_CONVERSION_RIGHT` / `STOCK_CLASS_CONVERSION_RIGHT`). It selects which OCF conversion-right subtype is in play. Carta has no "conversion right type" enum or analog — convertible-ness is implied positionally by being a `ConvertibleNote` rather than recorded as a typed discriminator — so this is `no-equivalent` rather than `enum-remap` (there is no Carta enum to remap onto).
- `conversion_mechanism` is a `oneOf` over five OCF mechanism types (`SAFEConversionMechanism`, `NoteConversionMechanism`, `CustomConversionMechanism`, `PercentCapitalizationConversionMechanism`, `FixedAmountConversionMechanism`). It is a polymorphic *container*, not a single leaf, so — exactly like the single mechanism on `StockClassConversionRight` — it is mapped as a `split` that fans the convertible's economic terms out to the `#/$defs/ConvertibleNote` leaves that hold them: `discountPercentage`, `priceCap`, `interestRate`, `interestAccrualPeriod`, `interestCompoundingPeriod`, `dayCountBasis`. These are precisely the targets the two convertible-economics members route to in their own bucket-1 mapping files — `SAFEConversionMechanism.mapping.md` (`conversion_discount → discountPercentage`, `conversion_valuation_cap → priceCap`) and `NoteConversionMechanism.mapping.md` (the same two plus `interest_rates → interestRate`, `interest_accrual_period → interestAccrualPeriod`, `compounding_type → interestCompoundingPeriod`, `day_count_convention → dayCountBasis`). `#/$defs/ConvertibleIssuanceTransaction` carries the same terms (with `priceCap` named `valuationCap`) and is the acceptable alternate home when the convertible is written as an issuance rather than as the note holding. The per-field routing of each nested mechanism lives in its own mapping file; this `split` records that the wrapper's economic payload lands on `ConvertibleNote`. NOT every `oneOf` member contributes economics: `CustomConversionMechanism` (free-text), `PercentCapitalizationConversionMechanism` (percent-of-cap + cap-definition rules), and `FixedAmountConversionMechanism` (`converts_to_quantity`) are each entirely unmappable in their own files — when one of those is the active mechanism, the `split` simply writes no values. Likewise the structural/event logic the container carries (MFN, AND/OR conditions, EARLIER_OF/LATER_OF triggers, pre/post-money timing, capitalization-definition prose and rule booleans, `exit_multiple`, `conversion_trigger` amount) is OCF conversion state-machine that Carta does not model; those nested fields stay `unmappable` at the mechanism level and are dropped.
- `converts_to_future_round` is a boolean flag for convertibility into a future, as-yet-undetermined stock class (e.g. Founder Preferred). Carta records no "converts into a not-yet-defined future round" flag — its convertible/preferred records reference concrete instruments and terms — so `no-equivalent`.
- `converts_to_stock_class_id` is the identifier of the known destination stock class. Carta's `ConvertibleNote` / `ConvertibleIssuanceTransaction` carry no pointer to a target share class, and `ShareClassRightsAndPreferences` records the conversion economics OF the preferred class itself (`conversionRatio`, `conversionPrice`) rather than a *source-security → destination-stock-class* reference. There is no Carta field for the conversion-target id, so `no-equivalent`. (This is also consistent with `StockParent.mapping.md`, where OCF's generic cross-security lineage references have no single Carta home.)
- OCF objects that `$ref` this type: it is referenced (alongside its sibling conversion-right types) only by the OCF conversion-*trigger* types (`AutomaticConversionOnDateTrigger`, `AutomaticConversionOnConditionTrigger`, `ElectiveConversionAtWillTrigger`, `ElectiveConversionOnConditionTrigger`, `ElectiveConversionInDateRangeTrigger`, `UnspecifiedConversionTrigger`) and via the `ConversionRight` primitive. Those triggers are themselves OCF conversion state-machine constructs; at the object level the convertible economics that the `conversion_mechanism` carries land on `#/$defs/ConvertibleNote` / `#/$defs/ConvertibleIssuanceTransaction` (the discount, cap, interest, accrual/compounding, and day-count leaves mapped above), while the trigger/mechanism wrapper *logic* — the discriminator, the future-round flag, the conversion-target pointer, and the trigger state machine — is dropped.

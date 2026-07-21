---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/NoteConversionMechanism.schema.json
ocf_object_type: null
ocf_title: Conversion Mechanism - Note
ocf_kind: type
required_fields:
  - type
  - interest_rates
  - day_count_convention
  - interest_payout
  - interest_accrual_period
  - compounding_type
  - type
target_standard: Carta
target_version: "v1alpha1 (2026-04-30)"
status: complete
last_generated: 2026-05-18
---

# Conversion Mechanism - Note → Carta

> Sets forth inputs and conversion mechanism of a convertible note

## OCF schema

Source: [`NoteConversionMechanism.schema.json`](./NoteConversionMechanism.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/NoteConversionMechanism.schema.json",
  "title": "Conversion Mechanism - Note",
  "description": "Sets forth inputs and conversion mechanism of a convertible note",
  "type": "object",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/types/conversion_mechanisms/ConversionMechanism.schema.json"
    }
  ],
  "properties": {
    "type": {
      "const": "CONVERTIBLE_NOTE_CONVERSION"
    },
    "interest_rates": {
      "title": "Note Conversion Mechanism - Interest Rates Array",
      "description": "Interest rate(s) of the convertible (if applicable)",
      "type": "array",
      "items": {
        "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/InterestRate.schema.json"
      }
    },
    "day_count_convention": {
      "description": "How many days are there is a given period for calculation purposes?",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/DayCountType.schema.json"
    },
    "interest_payout": {
      "description": "How is interest paid out (if at applicable)",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/InterestPayoutType.schema.json"
    },
    "interest_accrual_period": {
      "description": "What is the period over which interest is calculated?",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/AccrualPeriodType.schema.json"
    },
    "compounding_type": {
      "description": "What type of interest compounding?",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/CompoundingType.schema.json"
    },
    "conversion_discount": {
      "description": "What is the percentage discount available upon conversion, if applicable? (decimal representation - e.g. 0.125 for 12.5%)",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Percentage.schema.json"
    },
    "conversion_valuation_cap": {
      "description": "What is the valuation cap (if applicable)?",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Monetary.schema.json"
    },
    "capitalization_definition": {
      "description": "How is company capitalization defined for purposes of conversion? If possible, include the legal language from the instrument.",
      "type": "string"
    },
    "capitalization_definition_rules": {
      "description": "The rules for which types of securities would be included in the capitalization definition.",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/CapitalizationDefinitionRules.schema.json"
    },
    "exit_multiple": {
      "description": "For cash proceeds calculation during a liquidity event.",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Ratio.schema.json"
    },
    "conversion_mfn": {
      "description": "Is this an MFN (Most Favored Nations) flavored Convertible Note?",
      "type": "boolean"
    }
  },
  "additionalProperties": false,
  "required": [
    "type",
    "interest_rates",
    "day_count_convention",
    "interest_payout",
    "interest_accrual_period",
    "compounding_type",
    "type"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/conversion_mechanisms/NoteConversionMechanism.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
status: complete
coverage: 12/12

fields:
  type:
    kind: unmappable
    target: null
    reason: ocf-internal
  interest_rates:
    kind: select
    target: "#/$defs/ConvertibleNote/properties/interestRate"
    policy: first_applicable_interest_rate
    source: "/rate"
  day_count_convention:
    kind: enum-remap
    target: "#/$defs/ConvertibleNote/properties/dayCountBasis"
    values:
      ACTUAL_365: COUNT_ACTUAL_365
      30_360: COUNT_30_360
  interest_payout:
    kind: unmappable
    target: null
    reason: no-equivalent
  interest_accrual_period:
    kind: enum-remap
    target: "#/$defs/ConvertibleNote/properties/interestAccrualPeriod"
    values:
      DAILY: INTEREST_ACCRUAL_PERIOD_DAILY
      MONTHLY: INTEREST_ACCRUAL_PERIOD_MONTHLY
      QUARTERLY: INTEREST_ACCRUAL_PERIOD_QUARTERLY_CALENDAR
      SEMI_ANNUAL: INTEREST_ACCRUAL_PERIOD_SEMI_ANNUALLY
      ANNUAL: INTEREST_ACCRUAL_PERIOD_ANNUALLY
  compounding_type:
    kind: enum-remap
    target: "#/$defs/ConvertibleNote/properties/interestCompoundingPeriod"
    values:
      COMPOUNDING: ANNUALLY
      SIMPLE: SIMPLE
  conversion_discount:
    kind: rename
    target: "#/$defs/ConvertibleNote/properties/discountPercentage"
  conversion_valuation_cap:
    kind: rename
    target: "#/$defs/ConvertibleNote/properties/priceCap"
  capitalization_definition:
    kind: unmappable
    target: null
    reason: no-equivalent
  capitalization_definition_rules:
    kind: unmappable
    target: null
    reason: no-equivalent
  exit_multiple:
    kind: unmappable
    target: null
    reason: no-equivalent
  conversion_mfn:
    kind: unmappable
    target: null
    reason: no-equivalent
```

## Notes / open questions

- **Bucket (1) — structured OCF type with a single, unambiguous Carta home.** `NoteConversionMechanism` carries the economic terms of a convertible note, and Carta models exactly that note as a reusable object: `#/$defs/ConvertibleNote` (mirrored by the issuance event `#/$defs/ConvertibleIssuanceTransaction`). Per the Carta structured-target surface, a convertible's interest, day-count, accrual, compounding, discount and cap terms are inlined as fields on those two objects, so this is bucket-1, not bucket-2: we map every term that has a home and mark `unmappable` only the genuinely-absent OCF concepts. The two OCF objects that `$ref` this type are `types/conversion_mechanisms/NoteConversionMechanism.schema.json` itself (it self-composes the `ConversionMechanism` primitive) and `types/conversion_rights/ConvertibleConversionRight.schema.json`; at the object level a convertible's conversion right / mechanism resolves onto `ConvertibleNote` (the persistent security) and `ConvertibleIssuanceTransaction` (the issuance), which is where these fields land.
- `ConvertibleNote` is chosen as the canonical target over `ConvertibleIssuanceTransaction` because it is the persistent note object and exposes the full set of terms used here (`interestRate`, `dayCountBasis`, `interestAccrualPeriod`, `interestCompoundingPeriod`, `discountPercentage`, `priceCap`). The issuance transaction carries the same terms (with `priceCap` named `valuationCap` and its own `Convertible*` enum variants) and is an acceptable alternate destination for the same values.
- `type` → **unmappable / ocf-internal.** This is the OCF discriminator constant (`const: "CONVERTIBLE_NOTE_CONVERSION"`) that selects which `ConversionMechanism` variant the object is — pure OCF scaffolding, not a data value. Carta encodes the "this is a convertible note" fact structurally (the object simply *is* a `ConvertibleNote`); there is no Carta enum or field that stores a conversion-mechanism-type tag, so the constant is not carried over. Treated as `ocf-internal` (the same class as `object_type`/discriminator fields) rather than `no-equivalent`.
- `interest_rates` → `#/$defs/ConvertibleNote/properties/interestRate` (Carta `Decimal`). This is the array of `InterestRate` objects; consistent with `types/InterestRate.mapping.md`, each entry's `rate` lands on the note's flat `interestRate`. **Lossy in two ways:** (a) OCF allows an *array* of time-segmented rates (each with accrual `start`/`end` dates), but Carta stores a single scalar rate with no window dates, so the explicit `first_applicable_interest_rate` policy selects one representative rate and drops the segment boundaries; (b) the per-segment accrual `start`/`end` dates have no Carta home. Representation matches at the value level: OCF stores the rate as a decimal fraction and Carta's `Decimal` is the same fraction in string form — no scaling.
- `day_count_convention` → `#/$defs/ConvertibleNote/properties/dayCountBasis` (`DayCountBasis` enum). Clean enum-remap: OCF `ACTUAL_365` → Carta `COUNT_ACTUAL_365`; OCF `30_360` → Carta `COUNT_30_360`. (Carta additionally offers `COUNT_ACTUAL_360`, which OCF's `DayCountType` does not enumerate; no information is lost mapping the two OCF values.)
- `interest_accrual_period` → `#/$defs/ConvertibleNote/properties/interestAccrualPeriod` (`InterestAccrualPeriod` enum). Enum-remap covering all five OCF `AccrualPeriodType` values: `DAILY` → `INTEREST_ACCRUAL_PERIOD_DAILY`, `MONTHLY` → `INTEREST_ACCRUAL_PERIOD_MONTHLY`, `SEMI_ANNUAL` → `INTEREST_ACCRUAL_PERIOD_SEMI_ANNUALLY`, `ANNUAL` → `INTEREST_ACCRUAL_PERIOD_ANNUALLY`. OCF `QUARTERLY` has no plain `..._QUARTERLY` member in Carta — the only quarterly option is `INTEREST_ACCRUAL_PERIOD_QUARTERLY_CALENDAR`, so `QUARTERLY` maps there. That is a slight semantic narrowing (Carta's quarterly is calendar-quarter-aligned; OCF's `QUARTERLY` does not specify alignment) and is the closest available member; flag at ingestion if the instrument's quarters are not calendar-aligned.
- `compounding_type` → `#/$defs/ConvertibleNote/properties/interestCompoundingPeriod` (`InterestCompoundingPeriod` enum). OCF's `CompoundingType` is a coarse two-value flag (`SIMPLE` vs `COMPOUNDING`) whereas Carta's enum is a compounding *frequency* (`SIMPLE`, `DAILY`, `MONTHLY`, `SEMI_ANNUALLY`, `ANNUALLY`, `QUARTERLY_CALENDAR`, `ANNUALLY_CALENDAR`). `SIMPLE` → `SIMPLE` is exact. `COMPOUNDING` carries no frequency in OCF, so it cannot be mapped losslessly; it is mapped to `ANNUALLY` as the conventional default compounding frequency. This is a **lossy enum-remap**: the true compounding frequency is not present in OCF, so when the actual frequency is known from the instrument the importer should override the `ANNUALLY` default. (Note: OCF carries the accrual frequency in the separate `interest_accrual_period` field; that is the accrual period, not the compounding period, so it cannot be reused to recover the compounding frequency here.)
- `conversion_discount` → `#/$defs/ConvertibleNote/properties/discountPercentage` (Carta `Decimal`). Direct rename. OCF's `Percentage` is a decimal-fraction representation (`0.125` for 12.5%, per the field description) and Carta's `discountPercentage` is a `Decimal`; the same `0.125` value transfers with no scaling, only a numeric-to-string serialization. `ConvertibleIssuanceTransaction.discountPercentage` is the equivalent alternate target.
- `conversion_valuation_cap` → `#/$defs/ConvertibleNote/properties/priceCap` (Carta `Money`). The note's valuation/price cap. Both are monetary amounts (OCF `Monetary` → Carta `Money`), so it is a structural rename. `ConvertibleIssuanceTransaction.valuationCap` (also `Money`) is the equivalently-named field on the issuance transaction and is an acceptable alternate destination for the same value.
- `capitalization_definition` → **unmappable / no-equivalent.** This is free-text (often verbatim legal language) describing how the company's capitalization is computed for the conversion price. Carta records the resulting numeric terms (cap, discount, rate) but has no field to store the *definition* of the capitalization base or its legal prose anywhere on `ConvertibleNote` / `ConvertibleIssuanceTransaction` or the wider bundle.
- `capitalization_definition_rules` → **unmappable / no-equivalent.** This is the structured `CapitalizationDefinitionRules` type (the boolean inclusion rules for the cap-table base). Consistent with `types/CapitalizationDefinitionRules.mapping.md`, every one of its fields is unmappable — Carta has no analogue for the cap-table-composition rule set used in a convertible's price calculation, so the whole reference is dropped.
- `exit_multiple` → **unmappable / no-equivalent.** OCF's `Ratio` here is the liquidity-event cash-proceeds multiple (a return multiple paid on an exit). Carta's convertible model has no exit/return-multiple field: a scan of the bundle finds only `ConvertibleNote.priceCap`/`discountPercentage`, `ShareClassRightsAndPreferences.participationCap` and `ConvertibleIssuanceTransaction.valuationCap` — none of which is a liquidity-event exit multiple. Carta's `ShareClassRightsAndPreferences.multiplier`/`conversionRatio` belong to preferred-stock conversion, not a note's cash-out multiple, so reusing them would be incorrect.
- `conversion_mfn` → **unmappable / no-equivalent.** The Most-Favored-Nations boolean flag has no Carta field; there is no MFN/most-favored term anywhere on `ConvertibleNote`, `ConvertibleIssuanceTransaction`, or in the enum surface. The MFN provision is dropped.
- `interest_payout` → **unmappable / no-equivalent.** OCF's `InterestPayoutType` (`DEFERRED` vs `CASH`) records *how* accrued interest is settled. Carta tracks accrued interest amounts (`ConvertibleNote.interest`, `cashPaid`) but exposes no enum or flag for the payout *mode* — there is no deferred-vs-cash field on the convertible objects or in the Carta enum set — so the distinction cannot be represented and is dropped.

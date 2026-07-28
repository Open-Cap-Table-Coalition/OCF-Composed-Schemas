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
target_version: "v1alpha1 (2026-06-22)"
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

## Ask a mapping question

Use a link below to open a prefilled GitHub issue. The issue can be copied into the auditable checklist in `## Notes / open questions`.

<details>
<summary>Open a prefilled issue for a property</summary>

<!-- mapping-question-links:start -->
| Source property | Action |
| --- | --- |
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FNoteConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FNoteConversionMechanism.mapping.md&title=%5BMapping+question%5D+NoteConversionMechanism) |
| `type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FNoteConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FNoteConversionMechanism.mapping.md&title=%5BMapping+question%5D+NoteConversionMechanism%3A+type&property_path=type) |
| `interest_rates` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FNoteConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FNoteConversionMechanism.mapping.md&title=%5BMapping+question%5D+NoteConversionMechanism%3A+interest_rates&property_path=interest_rates) |
| `day_count_convention` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FNoteConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FNoteConversionMechanism.mapping.md&title=%5BMapping+question%5D+NoteConversionMechanism%3A+day_count_convention&property_path=day_count_convention) |
| `interest_payout` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FNoteConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FNoteConversionMechanism.mapping.md&title=%5BMapping+question%5D+NoteConversionMechanism%3A+interest_payout&property_path=interest_payout) |
| `interest_accrual_period` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FNoteConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FNoteConversionMechanism.mapping.md&title=%5BMapping+question%5D+NoteConversionMechanism%3A+interest_accrual_period&property_path=interest_accrual_period) |
| `compounding_type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FNoteConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FNoteConversionMechanism.mapping.md&title=%5BMapping+question%5D+NoteConversionMechanism%3A+compounding_type&property_path=compounding_type) |
| `conversion_discount` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FNoteConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FNoteConversionMechanism.mapping.md&title=%5BMapping+question%5D+NoteConversionMechanism%3A+conversion_discount&property_path=conversion_discount) |
| `conversion_valuation_cap` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FNoteConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FNoteConversionMechanism.mapping.md&title=%5BMapping+question%5D+NoteConversionMechanism%3A+conversion_valuation_cap&property_path=conversion_valuation_cap) |
| `capitalization_definition` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FNoteConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FNoteConversionMechanism.mapping.md&title=%5BMapping+question%5D+NoteConversionMechanism%3A+capitalization_definition&property_path=capitalization_definition) |
| `capitalization_definition_rules` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FNoteConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FNoteConversionMechanism.mapping.md&title=%5BMapping+question%5D+NoteConversionMechanism%3A+capitalization_definition_rules&property_path=capitalization_definition_rules) |
| `exit_multiple` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FNoteConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FNoteConversionMechanism.mapping.md&title=%5BMapping+question%5D+NoteConversionMechanism%3A+exit_multiple&property_path=exit_multiple) |
| `conversion_mfn` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FNoteConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FNoteConversionMechanism.mapping.md&title=%5BMapping+question%5D+NoteConversionMechanism%3A+conversion_mfn&property_path=conversion_mfn) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- Note terms land on `ConvertibleNote` (and the equivalent issuance transaction): the selected interest rate, day-count basis, accrual/compounding periods, discount, and valuation cap map to the corresponding Carta fields.
- `first_applicable_interest_rate` selects one rate from OCF's potentially segmented array. Interest payout, capitalization rules, exit multiple, MFN, and the mechanism discriminator have no target.

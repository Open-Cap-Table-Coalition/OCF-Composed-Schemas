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
target_standard: TBD
target_version: TBD
status: draft
last_generated: 2026-05-18
---

# Conversion Mechanism - Note → TBD

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
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: draft
coverage: 0/12

fields:
  type:
    kind: TODO          # likely enum-remap
    target: TODO
    values:
      CONVERTIBLE_NOTE_CONVERSION: TODO
  interest_rates:
    kind: TODO
    target: TODO
  day_count_convention:
    kind: TODO          # likely enum-remap
    target: TODO
    values:
      ACTUAL_365: TODO
      30_360: TODO
  interest_payout:
    kind: TODO          # likely enum-remap
    target: TODO
    values:
      DEFERRED: TODO
      CASH: TODO
  interest_accrual_period:
    kind: TODO          # likely enum-remap
    target: TODO
    values:
      DAILY: TODO
      MONTHLY: TODO
      QUARTERLY: TODO
      SEMI_ANNUAL: TODO
      ANNUAL: TODO
  compounding_type:
    kind: TODO          # likely enum-remap
    target: TODO
    values:
      COMPOUNDING: TODO
      SIMPLE: TODO
  conversion_discount:
    kind: TODO
    target: TODO
  conversion_valuation_cap:
    kind: TODO
    target: TODO
  capitalization_definition:
    kind: TODO
    target: TODO
  capitalization_definition_rules:
    kind: TODO
    target: TODO
  exit_multiple:
    kind: TODO
    target: TODO
  conversion_mfn:
    kind: TODO
    target: TODO
```

## Notes / open questions

- 

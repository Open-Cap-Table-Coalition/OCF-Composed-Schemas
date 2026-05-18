---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/ValuationBasedConversionMechanism.schema.json
ocf_object_type: null
ocf_title: Conversion Mechanism - Valuation-Based Conversion Mechanism
ocf_kind: type
required_fields:
  - type
  - valuation_type
  - type
target_standard: TBD
target_version: TBD
status: draft
last_generated: 2026-05-18
---

# Conversion Mechanism - Valuation-Based Conversion Mechanism → TBD

> Sets forth inputs and conversion mechanism based on valuations

## OCF schema

Source: [`ValuationBasedConversionMechanism.schema.json`](./ValuationBasedConversionMechanism.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/ValuationBasedConversionMechanism.schema.json",
  "title": "Conversion Mechanism - Valuation-Based Conversion Mechanism",
  "description": "Sets forth inputs and conversion mechanism based on valuations",
  "type": "object",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/types/conversion_mechanisms/ConversionMechanism.schema.json"
    }
  ],
  "properties": {
    "type": {
      "const": "VALUATION_BASED_CONVERSION"
    },
    "valuation_type": {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/ValuationBasedFormulaType.schema.json"
    },
    "valuation_amount": {
      "description": "If there is a specified valuation figure to use, what is it? Look to `valuation_type` to understand whether this represents, a max valuation (`CAP`), actual valuation at time of exercise (`ACTUAL`) or fixed valuation (`FIXED`).",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Monetary.schema.json"
    },
    "capitalization_definition": {
      "description": "How is company capitalization defined for purposes of exercise calculations? If possible, include the legal language from the instrument.",
      "type": "string"
    },
    "capitalization_definition_rules": {
      "description": "The rules for which types of securities would be included in the capitalization definition.",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/CapitalizationDefinitionRules.schema.json"
    }
  },
  "oneOf": [
    {
      "properties": {
        "valuation_type": {
          "const": "CAP"
        }
      },
      "required": [
        "valuation_amount"
      ]
    },
    {
      "properties": {
        "valuation_type": {
          "const": "FIXED"
        }
      },
      "required": [
        "valuation_amount"
      ]
    },
    {
      "properties": {
        "valuation_type": {
          "const": "ACTUAL"
        }
      }
    }
  ],
  "required": [
    "type",
    "valuation_type",
    "type"
  ],
  "additionalProperties": false,
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/conversion_mechanisms/ValuationBasedConversionMechanism.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: draft
coverage: 0/5

fields:
  type:
    kind: TODO          # likely enum-remap
    target: TODO
    values:
      VALUATION_BASED_CONVERSION: TODO
  valuation_type:
    kind: TODO          # likely enum-remap
    target: TODO
    values:
      FIXED: TODO
      ACTUAL: TODO
      CAP: TODO
  valuation_amount:
    kind: TODO
    target: TODO
  capitalization_definition:
    kind: TODO
    target: TODO
  capitalization_definition_rules:
    kind: TODO
    target: TODO
```

## Notes / open questions

- 

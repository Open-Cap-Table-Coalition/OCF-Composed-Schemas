---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/ValuationBasedConversionMechanism.schema.json
ocf_object_type: null
ocf_title: Conversion Mechanism - Valuation-Based Conversion Mechanism
ocf_kind: type
required_fields:
  - type
  - valuation_type
  - type
target_standard: Carta
target_version: "v1alpha1 (2026-04-30)"
status: complete
last_generated: 2026-05-18
---

# Conversion Mechanism - Valuation-Based Conversion Mechanism → Carta

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
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
status: complete

fields:
  type:
    kind: unmappable
    target: null
    reason: ocf-internal
  valuation_type:
    kind: unmappable
    target: null
    reason: no-equivalent
  valuation_amount:
    kind: unmappable
    target: null
    reason: no-equivalent
  capitalization_definition:
    kind: unmappable
    target: null
    reason: no-equivalent
  capitalization_definition_rules:
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
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FValuationBasedConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FValuationBasedConversionMechanism.mapping.md&title=%5BMapping+question%5D+ValuationBasedConversionMechanism) |
| `type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FValuationBasedConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FValuationBasedConversionMechanism.mapping.md&title=%5BMapping+question%5D+ValuationBasedConversionMechanism%3A+type&property_path=type) |
| `valuation_type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FValuationBasedConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FValuationBasedConversionMechanism.mapping.md&title=%5BMapping+question%5D+ValuationBasedConversionMechanism%3A+valuation_type&property_path=valuation_type) |
| `valuation_amount` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FValuationBasedConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FValuationBasedConversionMechanism.mapping.md&title=%5BMapping+question%5D+ValuationBasedConversionMechanism%3A+valuation_amount&property_path=valuation_amount) |
| `capitalization_definition` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FValuationBasedConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FValuationBasedConversionMechanism.mapping.md&title=%5BMapping+question%5D+ValuationBasedConversionMechanism%3A+capitalization_definition&property_path=capitalization_definition) |
| `capitalization_definition_rules` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FValuationBasedConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FValuationBasedConversionMechanism.mapping.md&title=%5BMapping+question%5D+ValuationBasedConversionMechanism%3A+capitalization_definition_rules&property_path=capitalization_definition_rules) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- Carta has no term-level representation for this valuation-based conversion formula or its capitalization rules. The discriminator, valuation type/amount, and capitalization definition/rules are all `no-equivalent`.

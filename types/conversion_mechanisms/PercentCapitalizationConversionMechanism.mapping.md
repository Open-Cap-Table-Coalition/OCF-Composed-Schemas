---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/PercentCapitalizationConversionMechanism.schema.json
ocf_object_type: null
ocf_title: Conversion Mechanism - Percent of Capitalization
ocf_kind: type
required_fields:
  - converts_to_percent
  - type
  - type
target_standard: Carta
target_version: "v1alpha1 (2026-06-22)"
status: complete
last_generated: 2026-05-18
---

# Conversion Mechanism - Percent of Capitalization → Carta

> Sets forth inputs and conversion mechanism of percent of capitalization conversion (where an instrument purports to grant a percent of company capitalization at some point in time)

## OCF schema

Source: [`PercentCapitalizationConversionMechanism.schema.json`](./PercentCapitalizationConversionMechanism.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/PercentCapitalizationConversionMechanism.schema.json",
  "title": "Conversion Mechanism - Percent of Capitalization",
  "description": "Sets forth inputs and conversion mechanism of percent of capitalization conversion (where an instrument purports to grant a percent of company capitalization at some point in time)",
  "type": "object",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/types/conversion_mechanisms/ConversionMechanism.schema.json"
    }
  ],
  "properties": {
    "type": {
      "const": "FIXED_PERCENT_OF_CAPITALIZATION_CONVERSION"
    },
    "converts_to_percent": {
      "description": "What percentage of the company capitalization does this convert to",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Percentage.schema.json"
    },
    "capitalization_definition": {
      "description": "How is company capitalization defined for purposes of conversion? If possible, include the legal language from the instrument.",
      "type": "string"
    },
    "capitalization_definition_rules": {
      "description": "The rules for which types of securities would be included in the capitalization definition.",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/CapitalizationDefinitionRules.schema.json"
    }
  },
  "additionalProperties": false,
  "required": [
    "converts_to_percent",
    "type",
    "type"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/conversion_mechanisms/PercentCapitalizationConversionMechanism.schema.json"
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
    reason: no-equivalent
  converts_to_percent:
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
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FPercentCapitalizationConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FPercentCapitalizationConversionMechanism.mapping.md&title=%5BMapping+question%5D+PercentCapitalizationConversionMechanism) |
| `type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FPercentCapitalizationConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FPercentCapitalizationConversionMechanism.mapping.md&title=%5BMapping+question%5D+PercentCapitalizationConversionMechanism%3A+type&property_path=type) |
| `converts_to_percent` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FPercentCapitalizationConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FPercentCapitalizationConversionMechanism.mapping.md&title=%5BMapping+question%5D+PercentCapitalizationConversionMechanism%3A+converts_to_percent&property_path=converts_to_percent) |
| `capitalization_definition` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FPercentCapitalizationConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FPercentCapitalizationConversionMechanism.mapping.md&title=%5BMapping+question%5D+PercentCapitalizationConversionMechanism%3A+capitalization_definition&property_path=capitalization_definition) |
| `capitalization_definition_rules` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FPercentCapitalizationConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FPercentCapitalizationConversionMechanism.mapping.md&title=%5BMapping+question%5D+PercentCapitalizationConversionMechanism%3A+capitalization_definition_rules&property_path=capitalization_definition_rules) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- Carta has no term for converting into a percentage of capitalization and no reusable conversion-mechanism type. The discriminator, percentage, and capitalization definition/rules are all `no-equivalent`.
- Do not substitute discount, conversion ratio, or valuation-cap fields; they represent different economics.

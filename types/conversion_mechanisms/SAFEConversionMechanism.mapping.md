---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/SAFEConversionMechanism.schema.json
ocf_object_type: null
ocf_title: Conversion Mechanism - SAFE
ocf_kind: type
required_fields:
  - conversion_mfn
  - type
  - type
target_standard: Carta
target_version: "v1alpha1 (2026-06-22)"
status: complete
last_generated: 2026-05-18
---

# Conversion Mechanism - SAFE → Carta

> Sets forth inputs and conversion mechanism of a SAFE (mirrors the flavors and inputs of the Y Combinator SAFE)

## OCF schema

Source: [`SAFEConversionMechanism.schema.json`](./SAFEConversionMechanism.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/SAFEConversionMechanism.schema.json",
  "title": "Conversion Mechanism - SAFE",
  "description": "Sets forth inputs and conversion mechanism of a SAFE (mirrors the flavors and inputs of the Y Combinator SAFE)",
  "type": "object",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/types/conversion_mechanisms/ConversionMechanism.schema.json"
    }
  ],
  "properties": {
    "type": {
      "const": "SAFE_CONVERSION"
    },
    "conversion_discount": {
      "description": "What is the percentage discount available upon conversion, if applicable? (decimal representation - e.g. 0.125 for 12.5%)",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Percentage.schema.json"
    },
    "conversion_valuation_cap": {
      "description": "What is the valuation cap (if applicable)?",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Monetary.schema.json"
    },
    "exit_multiple": {
      "description": "For cash proceeds calculation during a liquidity event.",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Ratio.schema.json"
    },
    "conversion_mfn": {
      "description": "Is this an MFN flavored SAFE?",
      "type": "boolean"
    },
    "conversion_timing": {
      "description": "Should the conversion amount be based on pre or post money capitalization",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/ConversionTimingType.schema.json"
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
  "required": [
    "conversion_mfn",
    "type",
    "type"
  ],
  "additionalProperties": false,
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/conversion_mechanisms/SAFEConversionMechanism.schema.json"
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
    values:
      SAFE_CONVERSION: null
  conversion_discount:
    kind: rename
    target: "#/$defs/ConvertibleNote/properties/discountPercentage"
  conversion_valuation_cap:
    kind: rename
    target: "#/$defs/ConvertibleNote/properties/priceCap"
  exit_multiple:
    kind: unmappable
    target: null
    reason: no-equivalent
  conversion_mfn:
    kind: unmappable
    target: null
    reason: no-equivalent
  conversion_timing:
    kind: unmappable
    target: null
    reason: no-equivalent
    values:
      PRE_MONEY: null
      POST_MONEY: null
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
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FSAFEConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FSAFEConversionMechanism.mapping.md&title=%5BMapping+question%5D+SAFEConversionMechanism) |
| `type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FSAFEConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FSAFEConversionMechanism.mapping.md&title=%5BMapping+question%5D+SAFEConversionMechanism%3A+type&property_path=type) |
| `conversion_discount` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FSAFEConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FSAFEConversionMechanism.mapping.md&title=%5BMapping+question%5D+SAFEConversionMechanism%3A+conversion_discount&property_path=conversion_discount) |
| `conversion_valuation_cap` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FSAFEConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FSAFEConversionMechanism.mapping.md&title=%5BMapping+question%5D+SAFEConversionMechanism%3A+conversion_valuation_cap&property_path=conversion_valuation_cap) |
| `exit_multiple` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FSAFEConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FSAFEConversionMechanism.mapping.md&title=%5BMapping+question%5D+SAFEConversionMechanism%3A+exit_multiple&property_path=exit_multiple) |
| `conversion_mfn` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FSAFEConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FSAFEConversionMechanism.mapping.md&title=%5BMapping+question%5D+SAFEConversionMechanism%3A+conversion_mfn&property_path=conversion_mfn) |
| `conversion_timing` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FSAFEConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FSAFEConversionMechanism.mapping.md&title=%5BMapping+question%5D+SAFEConversionMechanism%3A+conversion_timing&property_path=conversion_timing) |
| `capitalization_definition` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FSAFEConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FSAFEConversionMechanism.mapping.md&title=%5BMapping+question%5D+SAFEConversionMechanism%3A+capitalization_definition&property_path=capitalization_definition) |
| `capitalization_definition_rules` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FSAFEConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FSAFEConversionMechanism.mapping.md&title=%5BMapping+question%5D+SAFEConversionMechanism%3A+capitalization_definition_rules&property_path=capitalization_definition_rules) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- SAFE `conversion_discount` and `conversion_valuation_cap` map to `ConvertibleNote.discountPercentage` and `priceCap` (or the equivalent issuance fields).
- The SAFE discriminator, exit multiple, MFN/timing flags, and capitalization definition/rules have no Carta target.

---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/CustomConversionMechanism.schema.json
ocf_object_type: null
ocf_title: Conversion Mechanism - Custom
ocf_kind: type
required_fields:
  - type
  - custom_conversion_description
  - type
target_standard: Carta
target_version: "v1alpha1 (2026-04-30)"
status: complete
last_generated: 2026-05-18
---

# Conversion Mechanism - Custom → Carta

> Sets forth inputs and conversion mechanism of a custom conversion, a conversion type that cannot be accurately modelled with any other OCF conversion mechanism type

## OCF schema

Source: [`CustomConversionMechanism.schema.json`](./CustomConversionMechanism.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/CustomConversionMechanism.schema.json",
  "title": "Conversion Mechanism - Custom",
  "description": "Sets forth inputs and conversion mechanism of a custom conversion, a conversion type that cannot be accurately modelled with any other OCF conversion mechanism type",
  "type": "object",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/types/conversion_mechanisms/ConversionMechanism.schema.json"
    }
  ],
  "properties": {
    "type": {
      "const": "CUSTOM_CONVERSION"
    },
    "custom_conversion_description": {
      "description": "Detailed description of how the number of resulting shares should be determined? Use legal language from an instrument where possible",
      "type": "string"
    }
  },
  "additionalProperties": false,
  "required": [
    "type",
    "custom_conversion_description",
    "type"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/conversion_mechanisms/CustomConversionMechanism.schema.json"
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
      CUSTOM_CONVERSION: null
  custom_conversion_description:
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
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FCustomConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FCustomConversionMechanism.mapping.md&title=%5BMapping+question%5D+CustomConversionMechanism) |
| `type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FCustomConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FCustomConversionMechanism.mapping.md&title=%5BMapping+question%5D+CustomConversionMechanism%3A+type&property_path=type) |
| `custom_conversion_description` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FCustomConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FCustomConversionMechanism.mapping.md&title=%5BMapping+question%5D+CustomConversionMechanism%3A+custom_conversion_description&property_path=custom_conversion_description) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- Carta has no conversion-mechanism container or free-text field for a bespoke conversion rule. Both the `CUSTOM_CONVERSION` discriminator and `custom_conversion_description` are `no-equivalent`.
- The custom mechanism cannot be safely decomposed into Carta's typed discount, cap, price, or ratio fields.

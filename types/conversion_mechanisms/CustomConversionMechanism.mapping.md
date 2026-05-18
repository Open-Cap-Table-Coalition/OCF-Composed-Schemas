---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/CustomConversionMechanism.schema.json
ocf_object_type: null
ocf_title: Conversion Mechanism - Custom
ocf_kind: type
required_fields:
  - type
  - custom_conversion_description
  - type
target_standard: TBD
target_version: TBD
status: draft
last_generated: 2026-05-18
---

# Conversion Mechanism - Custom → TBD

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
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: draft
coverage: 0/2

fields:
  type:
    kind: TODO          # likely enum-remap
    target: TODO
    values:
      CUSTOM_CONVERSION: TODO
  custom_conversion_description:
    kind: TODO
    target: TODO
```

## Notes / open questions

- 

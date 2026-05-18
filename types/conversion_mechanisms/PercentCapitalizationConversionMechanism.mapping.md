---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/PercentCapitalizationConversionMechanism.schema.json
ocf_object_type: null
ocf_title: Conversion Mechanism - Percent of Capitalization
ocf_kind: type
required_fields:
  - converts_to_percent
  - type
  - type
target_standard: TBD
target_version: TBD
status: draft
last_generated: 2026-05-18
---

# Conversion Mechanism - Percent of Capitalization → TBD

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
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: draft
coverage: 0/4

fields:
  type:
    kind: TODO          # likely enum-remap
    target: TODO
    values:
      FIXED_PERCENT_OF_CAPITALIZATION_CONVERSION: TODO
  converts_to_percent:
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

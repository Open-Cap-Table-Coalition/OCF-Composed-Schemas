---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/RatioConversionMechanism.schema.json
ocf_object_type: null
ocf_title: Conversion Mechanism - Ratio
ocf_kind: type
required_fields:
  - ratio
  - conversion_price
  - rounding_type
  - type
  - type
target_standard: TBD
target_version: TBD
status: draft
last_generated: 2026-05-18
---

# Conversion Mechanism - Ratio → TBD

> Sets forth inputs and conversion mechanism of a ratio conversion (primarily used to describe conversion from one stock class (e.g. Preferred) into another (e.g. Common)

## OCF schema

Source: [`RatioConversionMechanism.schema.json`](./RatioConversionMechanism.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/RatioConversionMechanism.schema.json",
  "title": "Conversion Mechanism - Ratio",
  "description": "Sets forth inputs and conversion mechanism of a ratio conversion (primarily used to describe conversion from one stock class (e.g. Preferred) into another (e.g. Common)",
  "type": "object",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/types/conversion_mechanisms/ConversionMechanism.schema.json"
    }
  ],
  "properties": {
    "type": {
      "const": "RATIO_CONVERSION"
    },
    "conversion_price": {
      "description": "What is the effective conversion price per share of this stock class?",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Monetary.schema.json"
    },
    "ratio": {
      "description": "One share of this stock class converts into this many target stock class shares",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Ratio.schema.json"
    },
    "rounding_type": {
      "description": "How should fractional shares be rounded?",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/RoundingType.schema.json"
    }
  },
  "additionalProperties": false,
  "required": [
    "ratio",
    "conversion_price",
    "rounding_type",
    "type",
    "type"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/conversion_mechanisms/RatioConversionMechanism.schema.json"
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
      RATIO_CONVERSION: TODO
  conversion_price:
    kind: TODO
    target: TODO
  ratio:
    kind: TODO
    target: TODO
  rounding_type:
    kind: TODO          # likely enum-remap
    target: TODO
    values:
      CEILING: TODO
      FLOOR: TODO
      NORMAL: TODO
```

## Notes / open questions

- 

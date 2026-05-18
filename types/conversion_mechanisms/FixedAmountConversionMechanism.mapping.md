---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/FixedAmountConversionMechanism.schema.json
ocf_object_type: null
ocf_title: Conversion Mechanism - Fixed Amount
ocf_kind: type
required_fields:
  - converts_to_quantity
  - type
  - type
target_standard: TBD
target_version: TBD
status: draft
last_generated: 2026-05-18
---

# Conversion Mechanism - Fixed Amount → TBD

> Describes how a security converts into a fixed amount of a stock class

## OCF schema

Source: [`FixedAmountConversionMechanism.schema.json`](./FixedAmountConversionMechanism.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/FixedAmountConversionMechanism.schema.json",
  "title": "Conversion Mechanism - Fixed Amount",
  "description": "Describes how a security converts into a fixed amount of a stock class",
  "type": "object",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/types/conversion_mechanisms/ConversionMechanism.schema.json"
    }
  ],
  "properties": {
    "type": {
      "const": "FIXED_AMOUNT_CONVERSION"
    },
    "converts_to_quantity": {
      "description": "How many shares of target Stock Class does this security convert into?",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Numeric.schema.json"
    }
  },
  "additionalProperties": false,
  "required": [
    "converts_to_quantity",
    "type",
    "type"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/conversion_mechanisms/FixedAmountConversionMechanism.schema.json"
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
      FIXED_AMOUNT_CONVERSION: TODO
  converts_to_quantity:
    kind: TODO
    target: TODO
```

## Notes / open questions

- 

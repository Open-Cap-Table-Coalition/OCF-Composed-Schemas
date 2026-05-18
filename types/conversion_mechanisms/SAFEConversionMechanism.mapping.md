---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/SAFEConversionMechanism.schema.json
ocf_object_type: null
ocf_title: Conversion Mechanism - SAFE
ocf_kind: type
required_fields:
  - conversion_mfn
  - type
  - type
target_standard: TBD
target_version: TBD
status: draft
last_generated: 2026-05-18
---

# Conversion Mechanism - SAFE → TBD

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
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: draft
coverage: 0/8

fields:
  type:
    kind: TODO          # likely enum-remap
    target: TODO
    values:
      SAFE_CONVERSION: TODO
  conversion_discount:
    kind: TODO
    target: TODO
  conversion_valuation_cap:
    kind: TODO
    target: TODO
  exit_multiple:
    kind: TODO
    target: TODO
  conversion_mfn:
    kind: TODO
    target: TODO
  conversion_timing:
    kind: TODO          # likely enum-remap
    target: TODO
    values:
      PRE_MONEY: TODO
      POST_MONEY: TODO
  capitalization_definition:
    kind: TODO
    target: TODO
  capitalization_definition_rules:
    kind: TODO
    target: TODO
```

## Notes / open questions

- 

---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/CapitalizationDefinition.schema.json
ocf_object_type: null
ocf_title: Type - Capitalization Definition
ocf_kind: type
required_fields:
  - include_stock_class_ids
  - include_stock_plans_ids
  - include_security_ids
  - exclude_security_ids
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-05-18
---

# Type - Capitalization Definition → Carta

> Type represents a group of securities that constitutes some formally defined part of the company (e.g. post-money capitalization vs pre-money for a security)

## OCF schema

Source: [`CapitalizationDefinition.schema.json`](./CapitalizationDefinition.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/CapitalizationDefinition.schema.json",
  "title": "Type - Capitalization Definition",
  "description": "Type represents a group of securities that constitutes some formally defined part of the company (e.g. post-money capitalization vs pre-money for a security)",
  "type": "object",
  "properties": {
    "include_stock_class_ids": {
      "description": "All issuances of stock classes with these ids should be included (unless such an issuance is specifically included in `exclude_security_ids`",
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "include_stock_plans_ids": {
      "description": "All issuances of plan securities from stock plans with these ids should be included (unless such an issuance is specifically excluded in `exclude_security_ids`",
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "include_security_ids": {
      "description": "Securities (whether Stock, Plan Securities, Convertibles or Warrants) with these security ids should be included from this definition of capitalization (overrides plan or class-level rules)",
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "exclude_security_ids": {
      "description": "Securities (whether Stock, Plan Securities, Convertibles or Warrants) with these security ids should be excluded from this definition of capitalization (overrides plan or class-level rules)",
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  },
  "additionalProperties": false,
  "required": [
    "include_stock_class_ids",
    "include_stock_plans_ids",
    "include_security_ids",
    "exclude_security_ids"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/CapitalizationDefinition.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: complete
coverage: 4/4

fields:
  include_stock_class_ids:
    kind: unmappable
    target: null
  include_stock_plans_ids:
    kind: unmappable
    target: null
  include_security_ids:
    kind: unmappable
    target: null
  exclude_security_ids:
    kind: unmappable
    target: null
```

## Notes / open questions

- Carta has no concept of a named, configurable capitalization-rule definition. OCF uses `CapitalizationDefinition` (and `CapitalizationDefinitionRules`) to express *which* stock classes/plans/securities are included or excluded when calculating fully-diluted capitalization. Carta exposes aggregate quantities (e.g. `fullyDilutedShares` on `OptionPoolSummary`, `CapitalizationTableSummary`) but not the rule definitions that produced them. The README also notes that Carta capitalization-summary types are an excluded part of the bundle in any case.

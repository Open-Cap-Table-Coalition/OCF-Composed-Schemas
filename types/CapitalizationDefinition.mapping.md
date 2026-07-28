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
target_version: "v1alpha1 (2026-06-22)"
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
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
status: complete

fields:
  include_stock_class_ids:
    kind: unmappable
    target: null
    reason: no-equivalent
  include_stock_plans_ids:
    kind: unmappable
    target: null
    reason: no-equivalent
  include_security_ids:
    kind: unmappable
    target: null
    reason: no-equivalent
  exclude_security_ids:
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
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FCapitalizationDefinition.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FCapitalizationDefinition.mapping.md&title=%5BMapping+question%5D+CapitalizationDefinition) |
| `include_stock_class_ids` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FCapitalizationDefinition.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FCapitalizationDefinition.mapping.md&title=%5BMapping+question%5D+CapitalizationDefinition%3A+include_stock_class_ids&property_path=include_stock_class_ids) |
| `include_stock_plans_ids` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FCapitalizationDefinition.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FCapitalizationDefinition.mapping.md&title=%5BMapping+question%5D+CapitalizationDefinition%3A+include_stock_plans_ids&property_path=include_stock_plans_ids) |
| `include_security_ids` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FCapitalizationDefinition.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FCapitalizationDefinition.mapping.md&title=%5BMapping+question%5D+CapitalizationDefinition%3A+include_security_ids&property_path=include_security_ids) |
| `exclude_security_ids` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FCapitalizationDefinition.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FCapitalizationDefinition.mapping.md&title=%5BMapping+question%5D+CapitalizationDefinition%3A+exclude_security_ids&property_path=exclude_security_ids) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- Carta exposes capitalization totals, not the inclusion/exclusion rule set that OCF `CapitalizationDefinition` describes. All four rule inputs are `no-equivalent` and must be handled outside the Carta snapshot if needed.

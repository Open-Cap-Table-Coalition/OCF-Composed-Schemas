---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/CapitalizationDefinitionRules.schema.json
ocf_object_type: null
ocf_title: Type - Capitalization Definition Rules
ocf_kind: type
required_fields:
  - include_outstanding_shares
  - include_outstanding_options
  - include_outstanding_unissued_options
  - include_this_security
  - include_other_converting_securities
  - include_option_pool_topup_for_promised_options
  - include_additional_option_pool_topup
  - include_new_money
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-05-18
---

# Type - Capitalization Definition Rules → Carta

> Type represents the rules for determining the capitalization definition for a security

## OCF schema

Source: [`CapitalizationDefinitionRules.schema.json`](./CapitalizationDefinitionRules.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/CapitalizationDefinitionRules.schema.json",
  "title": "Type - Capitalization Definition Rules",
  "description": "Type represents the rules for determining the capitalization definition for a security",
  "type": "object",
  "properties": {
    "include_outstanding_shares": {
      "description": "Include all outstanding share issuances in the capitalization definition",
      "type": "boolean"
    },
    "include_outstanding_options": {
      "description": "Include all outstanding options in the capitalization definition",
      "type": "boolean"
    },
    "include_outstanding_unissued_options": {
      "description": "Include all outstanding options that have been reserved but have not been issued yet in the capitalization definition",
      "type": "boolean"
    },
    "include_this_security": {
      "description": "Include the shares issued for converting this security in the capitalization definition",
      "type": "boolean"
    },
    "include_other_converting_securities": {
      "description": "Include the shares issued for converting all other convertibles that are converted as part of the conversion event in the capitalization definition",
      "type": "boolean"
    },
    "include_option_pool_topup_for_promised_options": {
      "description": "Include the shares reserved for increasing option plans to cover all promised options in the capitalization definition",
      "type": "boolean"
    },
    "include_additional_option_pool_topup": {
      "description": "Include the shares reserved for increasing option plans beyond the amount needed for any promised options in the capitalization definition",
      "type": "boolean"
    },
    "include_new_money": {
      "description": "Include the shares issued for any new share subscriptions that are part of the conversion event in the capitalization definition",
      "type": "boolean"
    }
  },
  "additionalProperties": false,
  "required": [
    "include_outstanding_shares",
    "include_outstanding_options",
    "include_outstanding_unissued_options",
    "include_this_security",
    "include_other_converting_securities",
    "include_option_pool_topup_for_promised_options",
    "include_additional_option_pool_topup",
    "include_new_money"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/CapitalizationDefinitionRules.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
status: complete

fields:
  include_outstanding_shares:
    kind: unmappable
    target: null
    reason: no-equivalent
  include_outstanding_options:
    kind: unmappable
    target: null
    reason: no-equivalent
  include_outstanding_unissued_options:
    kind: unmappable
    target: null
    reason: no-equivalent
  include_this_security:
    kind: unmappable
    target: null
    reason: no-equivalent
  include_other_converting_securities:
    kind: unmappable
    target: null
    reason: no-equivalent
  include_option_pool_topup_for_promised_options:
    kind: unmappable
    target: null
    reason: no-equivalent
  include_additional_option_pool_topup:
    kind: unmappable
    target: null
    reason: no-equivalent
  include_new_money:
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
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FCapitalizationDefinitionRules.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FCapitalizationDefinitionRules.mapping.md&title=%5BMapping+question%5D+CapitalizationDefinitionRules) |
| `include_outstanding_shares` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FCapitalizationDefinitionRules.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FCapitalizationDefinitionRules.mapping.md&title=%5BMapping+question%5D+CapitalizationDefinitionRules+%2F+include_outstanding_shares&property_path=include_outstanding_shares) |
| `include_outstanding_options` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FCapitalizationDefinitionRules.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FCapitalizationDefinitionRules.mapping.md&title=%5BMapping+question%5D+CapitalizationDefinitionRules+%2F+include_outstanding_options&property_path=include_outstanding_options) |
| `include_outstanding_unissued_options` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FCapitalizationDefinitionRules.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FCapitalizationDefinitionRules.mapping.md&title=%5BMapping+question%5D+CapitalizationDefinitionRules+%2F+include_outstanding_unissued_options&property_path=include_outstanding_unissued_options) |
| `include_this_security` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FCapitalizationDefinitionRules.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FCapitalizationDefinitionRules.mapping.md&title=%5BMapping+question%5D+CapitalizationDefinitionRules+%2F+include_this_security&property_path=include_this_security) |
| `include_other_converting_securities` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FCapitalizationDefinitionRules.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FCapitalizationDefinitionRules.mapping.md&title=%5BMapping+question%5D+CapitalizationDefinitionRules+%2F+include_other_converting_securities&property_path=include_other_converting_securities) |
| `include_option_pool_topup_for_promised_options` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FCapitalizationDefinitionRules.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FCapitalizationDefinitionRules.mapping.md&title=%5BMapping+question%5D+CapitalizationDefinitionRules+%2F+include_option_pool_topup_for_promised_options&property_path=include_option_pool_topup_for_promised_options) |
| `include_additional_option_pool_topup` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FCapitalizationDefinitionRules.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FCapitalizationDefinitionRules.mapping.md&title=%5BMapping+question%5D+CapitalizationDefinitionRules+%2F+include_additional_option_pool_topup&property_path=include_additional_option_pool_topup) |
| `include_new_money` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FCapitalizationDefinitionRules.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FCapitalizationDefinitionRules.mapping.md&title=%5BMapping+question%5D+CapitalizationDefinitionRules+%2F+include_new_money&property_path=include_new_money) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- Same reason as `types/CapitalizationDefinition.mapping.md`: Carta does not represent fully-diluted *rule definitions* — the booleans here (whether to include outstanding shares, unissued options, promised-option top-ups, new money, etc.) have no counterpart in the bundle. Carta exposes aggregate share counts but not the inclusion/exclusion policy used to compute them.

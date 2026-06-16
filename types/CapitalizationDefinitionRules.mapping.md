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
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: complete
coverage: 8/8

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

## Notes / open questions

- Same reason as `types/CapitalizationDefinition.mapping.md`: Carta does not represent fully-diluted *rule definitions* — the booleans here (whether to include outstanding shares, unissued options, promised-option top-ups, new money, etc.) have no counterpart in the bundle. Carta exposes aggregate share counts but not the inclusion/exclusion policy used to compute them.

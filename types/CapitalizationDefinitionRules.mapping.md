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
target_standard: TBD
target_version: TBD
status: draft
last_generated: 2026-05-18
---

# Type - Capitalization Definition Rules → TBD

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
status: draft
coverage: 0/8

fields:
  include_outstanding_shares:
    kind: TODO
    target: TODO
  include_outstanding_options:
    kind: TODO
    target: TODO
  include_outstanding_unissued_options:
    kind: TODO
    target: TODO
  include_this_security:
    kind: TODO
    target: TODO
  include_other_converting_securities:
    kind: TODO
    target: TODO
  include_option_pool_topup_for_promised_options:
    kind: TODO
    target: TODO
  include_additional_option_pool_topup:
    kind: TODO
    target: TODO
  include_new_money:
    kind: TODO
    target: TODO
```

## Notes / open questions

- 

---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/acceptance/PlanSecurityAcceptance.schema.json
ocf_object_type: TX_PLAN_SECURITY_ACCEPTANCE
ocf_title: Object - Plan Security Acceptance
ocf_kind: object
required_fields: []
target_standard: TBD
target_version: TBD
status: draft
last_generated: 2026-05-18
---

# Object - Plan Security Acceptance → TBD

> An object that represents a plan security acceptance transaction, which is just a compatibility wrapper for an Equity Compensation Acceptance.

## OCF schema

Source: [`PlanSecurityAcceptance.schema.json`](./PlanSecurityAcceptance.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/acceptance/PlanSecurityAcceptance.schema.json",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/acceptance/EquityCompensationAcceptance.schema.json"
    }
  ],
  "title": "Object - Plan Security Acceptance",
  "description": "An object that represents a plan security acceptance transaction, which is just a compatibility wrapper for an Equity Compensation Acceptance.",
  "properties": {
    "object_type": {
      "const": "TX_PLAN_SECURITY_ACCEPTANCE",
      "description": "This is done to avoid a breaking change as we work towards a bigger restructure of the equity types in v2.0.0. `TX_PLAN_SECURITY_ACCEPTANCE` will be deprecated in v2.0.0"
    }
  },
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/acceptance/PlanSecurityAcceptance.schema.json",
  "required": []
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: draft
coverage: 0/1

fields:
  object_type:
    kind: TODO          # likely enum-remap
    target: TODO
    values:
      TX_PLAN_SECURITY_ACCEPTANCE: TODO
```

## Notes / open questions

- 

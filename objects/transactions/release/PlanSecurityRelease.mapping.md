---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/release/PlanSecurityRelease.schema.json
ocf_object_type: TX_PLAN_SECURITY_RELEASE
ocf_title: Object - Plan Security Release
ocf_kind: object
required_fields: []
target_standard: TBD
target_version: TBD
status: draft
last_generated: 2026-05-18
---

# Object - Plan Security Release → TBD

> Object describing plan security release transaction (a compatibility wrapper for equity compensation release event

## OCF schema

Source: [`PlanSecurityRelease.schema.json`](./PlanSecurityRelease.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/release/PlanSecurityRelease.schema.json",
  "title": "Object - Plan Security Release",
  "description": "Object describing plan security release transaction (a compatibility wrapper for equity compensation release event",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/release/EquityCompensationRelease.schema.json"
    }
  ],
  "properties": {
    "object_type": {
      "const": "TX_PLAN_SECURITY_RELEASE"
    }
  },
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/release/PlanSecurityRelease.schema.json",
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
      TX_PLAN_SECURITY_RELEASE: TODO
```

## Notes / open questions

- 

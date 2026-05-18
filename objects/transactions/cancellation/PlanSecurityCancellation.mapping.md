---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/cancellation/PlanSecurityCancellation.schema.json
ocf_object_type: TX_PLAN_SECURITY_CANCELLATION
ocf_title: Object - Plan Security Cancellation
ocf_kind: object
required_fields: []
target_standard: TBD
target_version: TBD
status: draft
last_generated: 2026-05-18
---

# Object - Plan Security Cancellation → TBD

> Object describing a plan security cancellation (which is a compatibility wrapper for Equity Compensation Cancellation)

## OCF schema

Source: [`PlanSecurityCancellation.schema.json`](./PlanSecurityCancellation.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/cancellation/PlanSecurityCancellation.schema.json",
  "title": "Object - Plan Security Cancellation",
  "description": "Object describing a plan security cancellation (which is a compatibility wrapper for Equity Compensation Cancellation)",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/cancellation/EquityCompensationCancellation.schema.json"
    }
  ],
  "properties": {
    "object_type": {
      "const": "TX_PLAN_SECURITY_CANCELLATION"
    }
  },
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/cancellation/PlanSecurityCancellation.schema.json",
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
      TX_PLAN_SECURITY_CANCELLATION: TODO
```

## Notes / open questions

- 

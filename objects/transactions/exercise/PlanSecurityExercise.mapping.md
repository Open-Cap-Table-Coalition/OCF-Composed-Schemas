---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/exercise/PlanSecurityExercise.schema.json
ocf_object_type: TX_PLAN_SECURITY_EXERCISE
ocf_title: Object - Plan Security Exercise
ocf_kind: object
required_fields: []
target_standard: TBD
target_version: TBD
status: draft
last_generated: 2026-05-18
---

# Object - Plan Security Exercise → TBD

> Object for a plan security exercise (which is a compatibility wrapper for Equity Compensation Exercise)

## OCF schema

Source: [`PlanSecurityExercise.schema.json`](./PlanSecurityExercise.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/exercise/PlanSecurityExercise.schema.json",
  "title": "Object - Plan Security Exercise",
  "description": "Object for a plan security exercise (which is a compatibility wrapper for Equity Compensation Exercise)",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/exercise/EquityCompensationExercise.schema.json"
    }
  ],
  "properties": {
    "object_type": {
      "const": "TX_PLAN_SECURITY_EXERCISE"
    }
  },
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/exercise/PlanSecurityExercise.schema.json",
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
      TX_PLAN_SECURITY_EXERCISE: TODO
```

## Notes / open questions

- 

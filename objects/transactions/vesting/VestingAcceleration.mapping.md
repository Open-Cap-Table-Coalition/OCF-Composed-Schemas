---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/vesting/VestingAcceleration.schema.json
ocf_object_type: TX_VESTING_ACCELERATION
ocf_title: Object - Vesting Acceleration Transaction
ocf_kind: object
required_fields:
  - quantity
  - reason_text
  - id
  - object_type
  - date
  - security_id
target_standard: TBD
target_version: TBD
status: draft
last_generated: 2026-05-18
---

# Object - Vesting Acceleration Transaction → TBD

> Object describing an acceleration of vesting, in which additional shares vest ahead of the schedule specified in security's vesting terms.

## OCF schema

Source: [`VestingAcceleration.schema.json`](./VestingAcceleration.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/vesting/VestingAcceleration.schema.json",
  "title": "Object - Vesting Acceleration Transaction",
  "description": "Object describing an acceleration of vesting, in which additional shares vest ahead of the schedule specified in security's vesting terms.",
  "type": "object",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/Object.schema.json"
    },
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/Transaction.schema.json"
    },
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/SecurityTransaction.schema.json"
    }
  ],
  "properties": {
    "id": {
      "description": "Identifier for the object",
      "type": "string"
    },
    "comments": {
      "description": "Unstructured text comments related to and stored for the object",
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "object_type": {
      "const": "TX_VESTING_ACCELERATION"
    },
    "date": {
      "description": "Date on which the transaction occurred",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "security_id": {
      "description": "Identifier for the security (stock, plan security, warrant, or convertible) by which it can be referenced by other transaction objects. Note that while this identifier is created with an issuance object, it should be different than the issuance object's `id` field which identifies the issuance transaction object itself. All future transactions on the security (e.g. acceptance, transfer, cancel, etc.) must reference this `security_id` to qualify which security the transaction applies to.",
      "type": "string"
    },
    "quantity": {
      "description": "Number of shares vesting ahead of schedule",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Numeric.schema.json"
    },
    "reason_text": {
      "description": "Reason for the acceleration; unstructured text",
      "type": "string"
    }
  },
  "additionalProperties": false,
  "required": [
    "quantity",
    "reason_text",
    "id",
    "object_type",
    "date",
    "security_id"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/vesting/VestingAcceleration.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: draft
coverage: 0/7

fields:
  id:
    kind: TODO
    target: TODO
  comments:
    kind: TODO
    target: TODO
  object_type:
    kind: TODO          # likely enum-remap
    target: TODO
    values:
      TX_VESTING_ACCELERATION: TODO
  date:
    kind: TODO
    target: TODO
  security_id:
    kind: TODO
    target: TODO
  quantity:
    kind: TODO
    target: TODO
  reason_text:
    kind: TODO
    target: TODO
```

## Notes / open questions

- 

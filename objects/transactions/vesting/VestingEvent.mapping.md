---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/vesting/VestingEvent.schema.json
ocf_object_type: TX_VESTING_EVENT
ocf_title: Object - Vesting Event Transaction
ocf_kind: object
required_fields:
  - vesting_condition_id
  - id
  - object_type
  - date
  - security_id
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-05-26
---

# Object - Vesting Event Transaction → Carta

> Object describing the transaction of an non-schedule-driven vesting event associated with a security

## OCF schema

Source: [`VestingEvent.schema.json`](./VestingEvent.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/vesting/VestingEvent.schema.json",
  "title": "Object - Vesting Event Transaction",
  "description": "Object describing the transaction of an non-schedule-driven vesting event associated with a security",
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
      "const": "TX_VESTING_EVENT"
    },
    "date": {
      "description": "Date on which the transaction occurred",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "security_id": {
      "description": "Identifier for the security (stock, plan security, warrant, or convertible) by which it can be referenced by other transaction objects. Note that while this identifier is created with an issuance object, it should be different than the issuance object's `id` field which identifies the issuance transaction object itself. All future transactions on the security (e.g. acceptance, transfer, cancel, etc.) must reference this `security_id` to qualify which security the transaction applies to.",
      "type": "string"
    },
    "vesting_condition_id": {
      "description": "Reference to the `id` of a VestingCondition in this security's VestingTerms. This condition should have a trigger type of `VESTING_EVENT`.",
      "type": "string"
    }
  },
  "additionalProperties": false,
  "required": [
    "vesting_condition_id",
    "id",
    "object_type",
    "date",
    "security_id"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/vesting/VestingEvent.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: complete
coverage: 6/6

fields:
  id:
    kind: unmappable
    target: null
  comments:
    kind: unmappable
    target: null
  object_type:
    kind: unmappable
    target: null
    values:
      TX_VESTING_EVENT: null
  date:
    kind: unmappable
    target: null
  security_id:
    kind: unmappable
    target: null
  vesting_condition_id:
    kind: unmappable
    target: null
```

## Notes / open questions

- OCF's `TX_VESTING_EVENT` is superseded by a hypothetical replacement at [`canonical/transactions/vesting/VestingEvent.schema.json`](../../../canonical/transactions/vesting/VestingEvent.schema.json) (the canonical `TX_CANONICAL_VESTING_EVENT`). The canonical version replaces OCF's `vesting_condition_id` (which references a node in OCF's DAG of `VestingCondition`s) with `event_id` (a named event in the canonical AST) and adds an optional `realized_fraction` for partial-payout firings. The Carta mapping lives on the canonical side; see [`canonical/transactions/vesting/VestingEvent.mapping.md`](../../../canonical/transactions/vesting/VestingEvent.mapping.md).
- This OCF object is therefore left unmapped here. Implementers should use the canonical replacement and its Carta mapping.

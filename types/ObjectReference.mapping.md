---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/ObjectReference.schema.json
ocf_object_type: null
ocf_title: Type - Object Reference
ocf_kind: type
required_fields:
  - object_type
  - object_id
target_standard: TBD
target_version: TBD
status: draft
last_generated: 2026-05-18
---

# Type - Object Reference → TBD

> A type representing a reference to any kind of OCF object

## OCF schema

Source: [`ObjectReference.schema.json`](./ObjectReference.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/ObjectReference.schema.json",
  "title": "Type - Object Reference",
  "description": "A type representing a reference to any kind of OCF object",
  "type": "object",
  "properties": {
    "object_type": {
      "description": "The type of object being referenced. Informs which type of identifier is represented by the associated object_id",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/ObjectType.schema.json"
    },
    "object_id": {
      "description": "The identifier for the referenced object",
      "type": "string"
    }
  },
  "additionalProperties": false,
  "required": [
    "object_type",
    "object_id"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/ObjectReference.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: draft
coverage: 0/2

fields:
  object_type:
    kind: TODO          # likely enum-remap
    target: TODO
    values:
      ISSUER: TODO
      STAKEHOLDER: TODO
      STOCK_CLASS: TODO
      STOCK_LEGEND_TEMPLATE: TODO
      STOCK_PLAN: TODO
      VALUATION: TODO
      VESTING_TERMS: TODO
      FINANCING: TODO
      DOCUMENT: TODO
      CE_STAKEHOLDER_RELATIONSHIP: TODO
      CE_STAKEHOLDER_STATUS: TODO
      TX_ISSUER_AUTHORIZED_SHARES_ADJUSTMENT: TODO
      TX_STOCK_CLASS_CONVERSION_RATIO_ADJUSTMENT: TODO
      TX_STOCK_CLASS_AUTHORIZED_SHARES_ADJUSTMENT: TODO
      TX_STOCK_CLASS_SPLIT: TODO
      TX_STOCK_PLAN_POOL_ADJUSTMENT: TODO
      TX_STOCK_PLAN_RETURN_TO_POOL: TODO
      TX_CONVERTIBLE_ACCEPTANCE: TODO
      TX_CONVERTIBLE_CANCELLATION: TODO
      TX_CONVERTIBLE_CONVERSION: TODO
      TX_CONVERTIBLE_ISSUANCE: TODO
      TX_CONVERTIBLE_RETRACTION: TODO
      TX_CONVERTIBLE_TRANSFER: TODO
      TX_EQUITY_COMPENSATION_ACCEPTANCE: TODO
      TX_EQUITY_COMPENSATION_CANCELLATION: TODO
      TX_EQUITY_COMPENSATION_EXERCISE: TODO
      TX_EQUITY_COMPENSATION_ISSUANCE: TODO
      TX_EQUITY_COMPENSATION_RELEASE: TODO
      TX_EQUITY_COMPENSATION_RETRACTION: TODO
      TX_EQUITY_COMPENSATION_TRANSFER: TODO
      TX_EQUITY_COMPENSATION_REPRICING: TODO
      TX_PLAN_SECURITY_ACCEPTANCE: TODO
      TX_PLAN_SECURITY_CANCELLATION: TODO
      TX_PLAN_SECURITY_EXERCISE: TODO
      TX_PLAN_SECURITY_ISSUANCE: TODO
      TX_PLAN_SECURITY_RELEASE: TODO
      TX_PLAN_SECURITY_RETRACTION: TODO
      TX_PLAN_SECURITY_TRANSFER: TODO
      TX_STOCK_ACCEPTANCE: TODO
      TX_STOCK_CANCELLATION: TODO
      TX_STOCK_CONVERSION: TODO
      TX_STOCK_ISSUANCE: TODO
      TX_STOCK_REISSUANCE: TODO
      TX_STOCK_CONSOLIDATION: TODO
      TX_STOCK_REPURCHASE: TODO
      TX_STOCK_RETRACTION: TODO
      TX_STOCK_TRANSFER: TODO
      TX_WARRANT_ACCEPTANCE: TODO
      TX_WARRANT_CANCELLATION: TODO
      TX_WARRANT_EXERCISE: TODO
      TX_WARRANT_ISSUANCE: TODO
      TX_WARRANT_RETRACTION: TODO
      TX_WARRANT_TRANSFER: TODO
      TX_VESTING_ACCELERATION: TODO
      TX_VESTING_START: TODO
      TX_VESTING_EVENT: TODO
  object_id:
    kind: TODO
    target: TODO
```

## Notes / open questions

- 

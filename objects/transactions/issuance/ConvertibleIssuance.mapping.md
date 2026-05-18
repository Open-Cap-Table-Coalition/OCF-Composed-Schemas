---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/issuance/ConvertibleIssuance.schema.json
ocf_object_type: TX_CONVERTIBLE_ISSUANCE
ocf_title: Object - Convertible Issuance Transaction
ocf_kind: object
required_fields:
  - convertible_type
  - investment_amount
  - conversion_triggers
  - seniority
  - id
  - object_type
  - date
  - security_id
  - security_law_exemptions
  - stakeholder_id
  - custom_id
target_standard: TBD
target_version: TBD
status: draft
last_generated: 2026-05-18
---

# Object - Convertible Issuance Transaction → TBD

> Object describing convertible instrument issuance transaction by the issuer and held by a stakeholder

## OCF schema

Source: [`ConvertibleIssuance.schema.json`](./ConvertibleIssuance.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/issuance/ConvertibleIssuance.schema.json",
  "title": "Object - Convertible Issuance Transaction",
  "description": "Object describing convertible instrument issuance transaction by the issuer and held by a stakeholder",
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
    },
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/issuance/Issuance.schema.json"
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
      "const": "TX_CONVERTIBLE_ISSUANCE"
    },
    "date": {
      "description": "Date on which the transaction occurred",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "security_id": {
      "description": "Identifier for the security (stock, plan security, warrant, or convertible) by which it can be referenced by other transaction objects. Note that while this identifier is created with an issuance object, it should be different than the issuance object's `id` field which identifies the issuance transaction object itself. All future transactions on the security (e.g. acceptance, transfer, cancel, etc.) must reference this `security_id` to qualify which security the transaction applies to.",
      "type": "string"
    },
    "custom_id": {
      "description": "A custom ID for this security (e.g. CN-1.)",
      "type": "string"
    },
    "stakeholder_id": {
      "description": "Identifier for the stakeholder that holds legal title to this security",
      "type": "string"
    },
    "board_approval_date": {
      "description": "Date of board approval for the security",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "stockholder_approval_date": {
      "description": "Date on which the stockholders approved the security",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "consideration_text": {
      "description": "Unstructured text description of consideration provided in exchange for security issuance",
      "type": "string"
    },
    "security_law_exemptions": {
      "title": "Security Issuance - Security Exemption Array",
      "description": "List of security law exemptions (and applicable jurisdictions) for this security",
      "type": "array",
      "items": {
        "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/SecurityExemption.schema.json"
      }
    },
    "investment_amount": {
      "description": "Amount invested and outstanding on date of issuance of this convertible",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Monetary.schema.json"
    },
    "convertible_type": {
      "description": "What kind of convertible instrument is this (of the supported, enumerated types)",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/ConvertibleType.schema.json"
    },
    "conversion_triggers": {
      "title": "Convertible - Conversion Trigger Array",
      "description": "In event the convertible can convert due to trigger events (e.g. Maturity, Next Qualified Financing, Change of Control, at Election of Holder), what are the terms?",
      "type": "array",
      "minItems": 1,
      "items": {
        "anyOf": [
          {
            "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_triggers/AutomaticConversionOnConditionTrigger.schema.json"
          },
          {
            "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_triggers/AutomaticConversionOnDateTrigger.schema.json"
          },
          {
            "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_triggers/ElectiveConversionAtWillTrigger.schema.json"
          },
          {
            "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_triggers/ElectiveConversionInDateRangeTrigger.schema.json"
          },
          {
            "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_triggers/ElectiveConversionOnConditionTrigger.schema.json"
          },
          {
            "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_triggers/UnspecifiedConversionTrigger.schema.json"
          }
        ]
      }
    },
    "pro_rata": {
      "description": "What pro-rata (if any) is the holder entitled to buy at the next round?",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Numeric.schema.json"
    },
    "seniority": {
      "description": "If different convertible instruments have seniorty over one another, use this value to build a seniority stack, with 1 being highest seniority and equal seniority values assumed to be equal priority",
      "type": "integer"
    }
  },
  "additionalProperties": false,
  "required": [
    "convertible_type",
    "investment_amount",
    "conversion_triggers",
    "seniority",
    "id",
    "object_type",
    "date",
    "security_id",
    "security_law_exemptions",
    "stakeholder_id",
    "custom_id"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/issuance/ConvertibleIssuance.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: draft
coverage: 0/16

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
      TX_CONVERTIBLE_ISSUANCE: TODO
  date:
    kind: TODO
    target: TODO
  security_id:
    kind: TODO
    target: TODO
  custom_id:
    kind: TODO
    target: TODO
  stakeholder_id:
    kind: TODO
    target: TODO
  board_approval_date:
    kind: TODO
    target: TODO
  stockholder_approval_date:
    kind: TODO
    target: TODO
  consideration_text:
    kind: TODO
    target: TODO
  security_law_exemptions:
    kind: TODO
    target: TODO
  investment_amount:
    kind: TODO
    target: TODO
  convertible_type:
    kind: TODO          # likely enum-remap
    target: TODO
    values:
      NOTE: TODO
      SAFE: TODO
      CONVERTIBLE_SECURITY: TODO
  conversion_triggers:
    kind: TODO
    target: TODO
  pro_rata:
    kind: TODO
    target: TODO
  seniority:
    kind: TODO
    target: TODO
```

## Notes / open questions

- 

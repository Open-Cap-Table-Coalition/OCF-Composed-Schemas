---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/issuance/EquityCompensationIssuance.schema.json
ocf_object_type: null
ocf_title: Object - Equity Compensation Issuance Transaction
ocf_kind: object
required_fields:
  - compensation_type
  - quantity
  - expiration_date
  - termination_exercise_windows
  - id
  - object_type
  - date
  - security_id
  - security_law_exemptions
  - stakeholder_id
  - custom_id
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-05-26
---

# Object - Equity Compensation Issuance Transaction → Carta

> Object describing securities issuance transaction by the issuer and held by a stakeholder as a form of compensation (as noted elsewhere, RSAs are not included here intentionally and should be modelled using Stock Issuances).

## OCF schema

Source: [`EquityCompensationIssuance.schema.json`](./EquityCompensationIssuance.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/issuance/EquityCompensationIssuance.schema.json",
  "title": "Object - Equity Compensation Issuance Transaction",
  "description": "Object describing securities issuance transaction by the issuer and held by a stakeholder as a form of compensation (as noted elsewhere, RSAs are not included here intentionally and should be modelled using Stock Issuances).",
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
      "enum": [
        "TX_PLAN_SECURITY_ISSUANCE",
        "TX_EQUITY_COMPENSATION_ISSUANCE"
      ],
      "description": "This is done to avoid a breaking change as we work towards a bigger restructure of the equity types in v2.0.0. `TX_PLAN_SECURITY_ISSUANCE` will be deprecated in v2.0.0"
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
    "stock_plan_id": {
      "description": "If the equity compensation was issued from a plan (don't forget, plan-less options are a thing), what is the plan id.",
      "type": "string"
    },
    "stock_class_id": {
      "description": "The stock class options will exercise into. Especially important for plan-less options and any issuances from a plan that supports multiple share classes.",
      "type": "string"
    },
    "compensation_type": {
      "description": "If the plan security is compensation, what kind?",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/CompensationType.schema.json"
    },
    "option_grant_type": {
      "description": "If the plan security is an option, what kind?",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/OptionType.schema.json",
      "$comment": "DEPRECATION WARNING - This field is being retained for compatibility, but these variations have been incorporated into CompensationType.schema.json enum options"
    },
    "quantity": {
      "description": "How many shares are subject to this plan security?",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Numeric.schema.json"
    },
    "exercise_price": {
      "description": "If this is an option, what is the exercise price of the option?",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Monetary.schema.json"
    },
    "base_price": {
      "description": "If this is a stock appreciation right, what is the base price used to calculate the appreciation of the SAR?",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Monetary.schema.json"
    },
    "early_exercisable": {
      "type": "boolean",
      "description": "Is this Equity Compensation exercisable prior to completion of vesting? If so, it's assumed the vesting schedule will remain in effect but, instead of vesting a right to exercise, it becomes the schedule determining when a right to repurchase the resulting stock lapses.",
      "$comment": "REQUIRED in v2"
    },
    "vesting_terms_id": {
      "description": "Identifier of the VestingTerms to which this security is subject. If neither `vesting_terms_id` or `vestings` are present then the security is fully vested on issuance.",
      "type": "string"
    },
    "vestings": {
      "title": "Equity Compensation Issuance - Vestings Array",
      "description": "List of exact vesting dates and amounts for this security. When `vestings` array is present then `vesting_terms_id` may be ignored.",
      "type": "array",
      "minItems": 1,
      "items": {
        "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Vesting.schema.json"
      }
    },
    "expiration_date": {
      "description": "Expiration date of the plan security",
      "oneOf": [
        {
          "type": "null"
        },
        {
          "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
        }
      ]
    },
    "termination_exercise_windows": {
      "title": "Plan Security - Termination Window Array",
      "description": "Exercise periods applicable to plan security after a termination for a given, enumerated reason",
      "type": "array",
      "items": {
        "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/TerminationWindow.schema.json"
      }
    }
  },
  "anyOf": [
    {
      "properties": {
        "compensation_type": {
          "const": "OPTION"
        }
      },
      "$comment": "For now, we're using JSONSchema to enforce some properties for some compensation types but not others. Options require exercise price.",
      "required": [
        "exercise_price"
      ]
    },
    {
      "properties": {
        "compensation_type": {
          "const": "OPTION_NSO"
        }
      },
      "$comment": "For now, we're using JSONSchema to enforce some properties for some compensation types but not others. Options require exercise price.",
      "required": [
        "exercise_price"
      ]
    },
    {
      "properties": {
        "compensation_type": {
          "const": "OPTION_ISO"
        }
      },
      "$comment": "For now, we're using JSONSchema to enforce some properties for some compensation types but not others. Options require exercise price.",
      "required": [
        "exercise_price"
      ]
    },
    {
      "properties": {
        "compensation_type": {
          "const": "RSU"
        }
      },
      "$comment": "For now, we're using JSONSchema to enforce some properties for some compensation types but not others. RSUs usually don't have exercise prices."
    },
    {
      "properties": {
        "compensation_type": {
          "const": "CSAR"
        }
      },
      "$comment": "For now, we're using JSONSchema to enforce some properties for some compensation types but not others. Stock appreciation rights have grant prices.",
      "required": [
        "base_price"
      ]
    },
    {
      "properties": {
        "compensation_type": {
          "const": "SSAR"
        }
      },
      "$comment": "For now, we're using JSONSchema to enforce some properties for some compensation types but not others. Stock appreciation rights have grant prices.",
      "required": [
        "base_price"
      ]
    }
  ],
  "additionalProperties": false,
  "required": [
    "compensation_type",
    "quantity",
    "expiration_date",
    "termination_exercise_windows",
    "id",
    "object_type",
    "date",
    "security_id",
    "security_law_exemptions",
    "stakeholder_id",
    "custom_id"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/issuance/EquityCompensationIssuance.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: complete
coverage: 23/23

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
      TX_PLAN_SECURITY_ISSUANCE: null
      TX_EQUITY_COMPENSATION_ISSUANCE: null
  date:
    kind: unmappable
    target: null
  security_id:
    kind: unmappable
    target: null
  custom_id:
    kind: unmappable
    target: null
  stakeholder_id:
    kind: unmappable
    target: null
  board_approval_date:
    kind: unmappable
    target: null
  stockholder_approval_date:
    kind: unmappable
    target: null
  consideration_text:
    kind: unmappable
    target: null
  security_law_exemptions:
    kind: unmappable
    target: null
  stock_plan_id:
    kind: unmappable
    target: null
  stock_class_id:
    kind: unmappable
    target: null
  compensation_type:
    kind: unmappable
    target: null
    values:
      OPTION_NSO: null
      OPTION_ISO: null
      OPTION: null
      RSU: null
      CSAR: null
      SSAR: null
  option_grant_type:
    kind: unmappable
    target: null
    values:
      NSO: null
      ISO: null
      INTL: null
  quantity:
    kind: unmappable
    target: null
  exercise_price:
    kind: unmappable
    target: null
  base_price:
    kind: unmappable
    target: null
  early_exercisable:
    kind: unmappable
    target: null
  vesting_terms_id:
    kind: unmappable
    target: null
  vestings:
    kind: unmappable
    target: null
  expiration_date:
    kind: unmappable
    target: null
  termination_exercise_windows:
    kind: unmappable
    target: null
```

## Notes / open questions

- OCF's `TX_EQUITY_COMPENSATION_ISSUANCE` is superseded by a hypothetical replacement at [`canonical/transactions/issuance/EquityCompensationIssuance.schema.json`](../../../canonical/transactions/issuance/EquityCompensationIssuance.schema.json) (the canonical `TX_CANONICAL_EQUITY_COMPENSATION_ISSUANCE`). The canonical version is field-for-field equivalent to OCF's with one substantive change: `vesting_terms_id` (which references OCF's DAG-based `VestingTerms`) is replaced with `vesting_template_id` (which references the canonical `VestingScheduleTemplate`). The Carta mapping lives on the canonical side; see [`canonical/transactions/issuance/EquityCompensationIssuance.mapping.md`](../../../canonical/transactions/issuance/EquityCompensationIssuance.mapping.md).
- This OCF object is therefore left unmapped here. Implementers should use the canonical replacement and its Carta mapping. Per `compensation_type`, the canonical mapping fans out to Carta's `OptionGrant` (option variants), `RestrictedStockUnit` (RSU), or `SarIssuanceTransaction` (CSAR/SSAR).

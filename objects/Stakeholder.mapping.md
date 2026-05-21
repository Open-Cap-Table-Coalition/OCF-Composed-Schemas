---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/Stakeholder.schema.json
ocf_object_type: STAKEHOLDER
ocf_title: Object - Stakeholder
ocf_kind: object
required_fields:
  - name
  - stakeholder_type
  - id
  - object_type
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-05-18
---

# Object - Stakeholder → Carta

> Object describing a stakeholder

## OCF schema

Source: [`Stakeholder.schema.json`](./Stakeholder.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/Stakeholder.schema.json",
  "title": "Object - Stakeholder",
  "description": "Object describing a stakeholder",
  "type": "object",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/Object.schema.json"
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
      "const": "STAKEHOLDER"
    },
    "name": {
      "description": "Name for the stakeholder",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Name.schema.json"
    },
    "stakeholder_type": {
      "description": "Distinguish individuals from institutions",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/StakeholderType.schema.json"
    },
    "issuer_assigned_id": {
      "description": "This might be any sort of id assigned to the stakeholder by the issuer, such as an internal company ID for an employee stakeholder",
      "type": "string"
    },
    "current_relationship": {
      "description": "What is the current relationship of the stakeholder to the issuer?",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/StakeholderRelationshipType.schema.json",
      "$comment": "Deprecated in v2, see `current_relationships` array instead"
    },
    "current_relationships": {
      "title": "Stakeholder - Relationships Array",
      "description": "What is/are the current relationship(s) of the stakeholder to the issuer?",
      "type": "array",
      "items": {
        "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/StakeholderRelationshipType.schema.json"
      }
    },
    "current_status": {
      "description": "What is the current activity status of the stakeholder?",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/StakeholderStatusType.schema.json"
    },
    "primary_contact": {
      "description": "The primary contact info for an institutional stakeholder",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/ContactInfo.schema.json"
    },
    "contact_info": {
      "description": "The contact info for an individual stakeholder",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/ContactInfoWithoutName.schema.json"
    },
    "addresses": {
      "title": "Stakeholder - Address Array",
      "description": "Addresses for the stakeholder",
      "type": "array",
      "items": {
        "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Address.schema.json"
      }
    },
    "tax_ids": {
      "title": "Stakeholder - Tax ID Array",
      "description": "The tax ids for this stakeholder",
      "type": "array",
      "items": {
        "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/TaxID.schema.json"
      }
    }
  },
  "additionalProperties": false,
  "required": [
    "name",
    "stakeholder_type",
    "id",
    "object_type"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/Stakeholder.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: complete
coverage: 13/13

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
      STAKEHOLDER: null
  name:
    kind: rename
    target: "#/$defs/Stakeholder/properties/fullName"
  stakeholder_type:
    kind: enum-remap
    target: "#/$defs/Stakeholder/properties/entityType"
    values:
      INDIVIDUAL: INDIVIDUAL
      INSTITUTION: UNKNOWN
  issuer_assigned_id:
    kind: rename
    target: "#/$defs/Stakeholder/properties/employeeId"
  current_relationship:
    kind: enum-remap
    target: "#/$defs/Stakeholder/properties/relationship"
    values:
      ADVISOR: ADVISOR
      BOARD_MEMBER: BOARD_MEMBER
      CONSULTANT: CONSULTANT
      EMPLOYEE: EMPLOYEE
      EX_ADVISOR: EX_ADVISOR
      EX_CONSULTANT: EX_CONSULTANT
      EX_EMPLOYEE: EX_EMPLOYEE
      EXECUTIVE: EXECUTIVE
      FOUNDER: FOUNDER
      INVESTOR: INVESTOR
      NON_US_EMPLOYEE: INTERNATIONAL_EMPLOYEE
      OFFICER: OFFICER
      OTHER: OTHER
  current_relationships:
    kind: enum-remap
    target: "#/$defs/Stakeholder/properties/relationship"
    values:
      ADVISOR: ADVISOR
      BOARD_MEMBER: BOARD_MEMBER
      CONSULTANT: CONSULTANT
      EMPLOYEE: EMPLOYEE
      EX_ADVISOR: EX_ADVISOR
      EX_CONSULTANT: EX_CONSULTANT
      EX_EMPLOYEE: EX_EMPLOYEE
      EXECUTIVE: EXECUTIVE
      FOUNDER: FOUNDER
      INVESTOR: INVESTOR
      NON_US_EMPLOYEE: INTERNATIONAL_EMPLOYEE
      OFFICER: OFFICER
      OTHER: OTHER
  current_status:
    kind: unmappable
    target: null
    values:
      ACTIVE: null
      LEAVE_OF_ABSENCE: null
      TERMINATION_VOLUNTARY_OTHER: null
      TERMINATION_VOLUNTARY_GOOD_CAUSE: null
      TERMINATION_VOLUNTARY_RETIREMENT: null
      TERMINATION_INVOLUNTARY_OTHER: null
      TERMINATION_INVOLUNTARY_DEATH: null
      TERMINATION_INVOLUNTARY_DISABILITY: null
      TERMINATION_INVOLUNTARY_WITH_CAUSE: null
  primary_contact:
    kind: rename
    target: "#/$defs/Stakeholder/properties/email"
  contact_info:
    kind: rename
    target: "#/$defs/Stakeholder/properties/email"
  addresses:
    kind: rename
    target: "#/$defs/Stakeholder/properties/address"
  tax_ids:
    kind: unmappable
    target: null
```

## Notes / open questions

- `name` → `fullName`: OCF `name` is a structured `Name` (required `legal_name`, optional `first_name`/`last_name`); Carta `fullName` is a flat string. Only `legal_name` carries; `first_name`/`last_name` have no Carta slot and are dropped.
- `stakeholder_type` → `entityType`: OCF's 2-value enum (`INDIVIDUAL` / `INSTITUTION`) is coarser than Carta's 7-value `StakeholderEntityType` (`INDIVIDUAL`, `CORPORATION`, `LIMITED_LIABILITY_CORPORATION`, `ESTATE_OR_TRUST`, `PARTNERSHIP`, `DISREGARDED_ENTITY`, `UNKNOWN`). `INDIVIDUAL` maps cleanly. `INSTITUTION` collapses to `UNKNOWN` because OCF doesn't say *what kind* of institution. A consumer with side information (e.g., the stakeholder's name) can refine `UNKNOWN` to a more specific Carta value, but that's out of scope for the schema-level mapping.
- Carta also defines an unused `StakeholderType` enum (`STAKEHOLDER_TYPE_INDIVIDUAL` / `STAKEHOLDER_TYPE_NON_INDIVIDUAL`) that is a closer 1:1 match for OCF's `stakeholder_type`, but it is not `$ref`'d from `Stakeholder` — Carta's `Stakeholder.entityType` uses the finer-grained `StakeholderEntityType` instead. So `StakeholderType` is a dead-end target.
- `issuer_assigned_id` → `employeeId`: rename. OCF's description (e.g., "an internal company ID for an employee stakeholder") aligns with Carta's field. Carta is more narrowly named ("employee") but the underlying semantics match.
- `current_relationship` (deprecated singular) and `current_relationships` (canonical v2 array) both target Carta's single-valued `relationship`. Both rows pointing at the same target mirrors the `path`/`uri` pattern in `Document`. Per-value mapping is a near-identity rename; the only renamed value is `NON_US_EMPLOYEE` → `INTERNATIONAL_EMPLOYEE`. Carta has additional values (`EX_BOARD_MEMBER`, `EX_INTERNATIONAL_EMPLOYEE`) with no OCF source — those would have to come from elsewhere if needed.
- `current_relationships` array → single Carta value is a lossy collapse: if OCF carries `[BOARD_MEMBER, FOUNDER]`, only one fits Carta. The mapping doc doesn't prescribe the rule; the consumer picks per-record (e.g., the most senior, the first, or by some policy).
- `current_status`: unmappable. Carta has no per-stakeholder status field. The `EX_*` values of Carta's `relationship` enum partially encode termination (someone is an `EX_EMPLOYEE` rather than `EMPLOYEE`), but the finer-grained OCF status values (`LEAVE_OF_ABSENCE`, the various `TERMINATION_*` reasons) have no Carta target.
- `primary_contact` (institutional) and `contact_info` (individual) both → Carta `email`: both OCF types carry `emails: array` and `phone_numbers: array` (and `primary_contact` also carries `name`). Only the email is transferred, and Carta accepts only a single string — so only the first email per record survives. Phone numbers, the contact person's name (for institutions), and additional emails are all dropped. Marked `kind: rename` rather than `computed` because the OCF field structurally corresponds to the Carta field, even though the inner shape collapses.
- `addresses` → `address`: dramatic loss in two dimensions. OCF carries an *array* of richly structured `Address` objects (street, city, state, country, postal code, etc.); Carta's `StakeholderAddress` has *only* `country` (a single string, no structure). Only the country of one address survives; all other address data is dropped.
- `tax_ids`: unmappable. Carta's `Stakeholder` has no tax-id field.
- `id`, `comments`, `object_type`: unmappable boilerplate OCF object scaffolding (same as `Document`/`Issuer`).
- Carta-side fields with no OCF counterpart: `issuerId` (a back-reference; in OCF the issuer is implicit because each OCF file represents one issuer), `group` (an arbitrary tag with no OCF analogue).

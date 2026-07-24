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
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
status: complete

fields:
  id:
    kind: unmappable
    target: null
    reason: ocf-internal
  comments:
    kind: unmappable
    target: null
    reason: ocf-internal
  object_type:
    kind: unmappable
    target: null
    reason: ocf-internal
    values:
      STAKEHOLDER: null
  name:
    kind: select
    target: "#/$defs/Stakeholder/properties/fullName"
    policy: legal_name
    source: "/legal_name"
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
    policy: first_relationship_in_order
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
    reason: no-equivalent
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
    kind: combine
    target: "#/$defs/Stakeholder/properties/email"
  contact_info:
    kind: combine
    target: "#/$defs/Stakeholder/properties/email"
  addresses:
    kind: select
    target: "#/$defs/Stakeholder/properties/address"
    policy: first_address_country
    source: "/country"
  tax_ids:
    kind: unmappable
    target: null
    reason: no-equivalent
```

## Ask a mapping question

Use a link below to open a prefilled GitHub issue. The issue can be copied into the auditable checklist in `## Notes / open questions`.

<details>
<summary>Open a prefilled issue for a property</summary>

<!-- mapping-question-links:start -->
| Source property | Action |
| --- | --- |
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FStakeholder.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FStakeholder.mapping.md&title=%5BMapping+question%5D+Stakeholder) |
| `id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FStakeholder.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FStakeholder.mapping.md&title=%5BMapping+question%5D+Stakeholder%3A+id&property_path=id) |
| `comments` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FStakeholder.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FStakeholder.mapping.md&title=%5BMapping+question%5D+Stakeholder%3A+comments&property_path=comments) |
| `object_type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FStakeholder.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FStakeholder.mapping.md&title=%5BMapping+question%5D+Stakeholder%3A+object_type&property_path=object_type) |
| `name` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FStakeholder.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FStakeholder.mapping.md&title=%5BMapping+question%5D+Stakeholder%3A+name&property_path=name) |
| `stakeholder_type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FStakeholder.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FStakeholder.mapping.md&title=%5BMapping+question%5D+Stakeholder%3A+stakeholder_type&property_path=stakeholder_type) |
| `issuer_assigned_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FStakeholder.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FStakeholder.mapping.md&title=%5BMapping+question%5D+Stakeholder%3A+issuer_assigned_id&property_path=issuer_assigned_id) |
| `current_relationship` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FStakeholder.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FStakeholder.mapping.md&title=%5BMapping+question%5D+Stakeholder%3A+current_relationship&property_path=current_relationship) |
| `current_relationships` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FStakeholder.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FStakeholder.mapping.md&title=%5BMapping+question%5D+Stakeholder%3A+current_relationships&property_path=current_relationships) |
| `current_status` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FStakeholder.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FStakeholder.mapping.md&title=%5BMapping+question%5D+Stakeholder%3A+current_status&property_path=current_status) |
| `primary_contact` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FStakeholder.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FStakeholder.mapping.md&title=%5BMapping+question%5D+Stakeholder%3A+primary_contact&property_path=primary_contact) |
| `contact_info` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FStakeholder.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FStakeholder.mapping.md&title=%5BMapping+question%5D+Stakeholder%3A+contact_info&property_path=contact_info) |
| `addresses` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FStakeholder.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FStakeholder.mapping.md&title=%5BMapping+question%5D+Stakeholder%3A+addresses&property_path=addresses) |
| `tax_ids` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FStakeholder.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FStakeholder.mapping.md&title=%5BMapping+question%5D+Stakeholder%3A+tax_ids&property_path=tax_ids) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- `name` → `fullName`: OCF `name` is a structured `Name` (required `legal_name`, optional `first_name`/`last_name`); Carta `fullName` is a flat string. The mapping explicitly selects `/legal_name` under policy `legal_name`; `first_name`/`last_name` have no Carta slot and are dropped.
- `stakeholder_type` → `entityType`: OCF's 2-value enum (`INDIVIDUAL` / `INSTITUTION`) is coarser than Carta's 7-value `StakeholderEntityType` (`INDIVIDUAL`, `CORPORATION`, `LIMITED_LIABILITY_CORPORATION`, `ESTATE_OR_TRUST`, `PARTNERSHIP`, `DISREGARDED_ENTITY`, `UNKNOWN`). `INDIVIDUAL` maps cleanly. `INSTITUTION` collapses to `UNKNOWN` because OCF doesn't say *what kind* of institution. A consumer with side information (e.g., the stakeholder's name) can refine `UNKNOWN` to a more specific Carta value, but that's out of scope for the schema-level mapping.
- Carta also defines an unused `StakeholderType` enum (`STAKEHOLDER_TYPE_INDIVIDUAL` / `STAKEHOLDER_TYPE_NON_INDIVIDUAL`) that is a closer 1:1 match for OCF's `stakeholder_type`, but it is not `$ref`'d from `Stakeholder` — Carta's `Stakeholder.entityType` uses the finer-grained `StakeholderEntityType` instead. So `StakeholderType` is a dead-end target.
- `issuer_assigned_id` → `employeeId`: rename. OCF's description (e.g., "an internal company ID for an employee stakeholder") aligns with Carta's field. Carta is more narrowly named ("employee") but the underlying semantics match.
- `current_relationship` (deprecated singular) and `current_relationships` (canonical v2 array) both target Carta's single-valued `relationship`. Both rows pointing at the same target mirrors the `path`/`uri` pattern in `Document`. Per-value mapping is a near-identity rename; the only renamed value is `NON_US_EMPLOYEE` → `INTERNATIONAL_EMPLOYEE`. Carta has additional values (`EX_BOARD_MEMBER`, `EX_INTERNATIONAL_EMPLOYEE`) with no OCF source — those would have to come from elsewhere if needed.
- `current_relationships` array → single Carta value is a lossy collapse: if OCF carries `[BOARD_MEMBER, FOUNDER]`, only one fits Carta. The mapping uses the explicit deterministic policy `first_relationship_in_order`; a consumer that needs a different business policy must preserve the full array outside this mapping rather than silently changing the fold.
- `current_status`: unmappable. Carta has no per-stakeholder status field. The `EX_*` values of Carta's `relationship` enum partially encode termination (someone is an `EX_EMPLOYEE` rather than `EMPLOYEE`), but the finer-grained OCF status values (`LEAVE_OF_ABSENCE`, the various `TERMINATION_*` reasons) have no Carta target.
- `primary_contact` (institutional) and `contact_info` (individual) both → Carta `email`: both OCF types carry `emails: array` and `phone_numbers: array` (and `primary_contact` also carries `name`). Only the email is transferred, and Carta accepts only a single string — so only the first email per record survives. Phone numbers, the contact person's name (for institutions), and additional emails are all dropped. Marked `kind: combine` rather than `rename`: these are two *distinct* optional OCF fields that both feed Carta's single `email`, so the relationship is a two-source → one-target fan-in, not a 1:1 field rename. Selection is by `stakeholder_type` (`contact_info` for an `INDIVIDUAL`, `primary_contact` for an `INSTITUTION`); the OCF schema places no `oneOf`/`anyOf` on the two fields, so if both happen to be set the one matching `stakeholder_type` wins. (`computed` is reserved for cross-record or otherwise-derived values; here the value is copied verbatim from whichever source applies, just collapsed to the first email.)
- `addresses` → `address`: dramatic loss in two dimensions. OCF carries an *array* of richly structured `Address` objects (street, city, state, country, postal code, etc.); Carta's `StakeholderAddress` has *only* `country` (a single string, no structure). The mapping explicitly selects the first address's `/country` under policy `first_address_country`; all other address data is dropped.
- `tax_ids`: unmappable. Carta's `Stakeholder` has no tax-id field.
- `id`, `comments`, `object_type`: unmappable boilerplate OCF object scaffolding (same as `Document`/`Issuer`).
- Carta-side fields with no OCF counterpart: `issuerId` (a back-reference; in OCF the issuer is implicit because each OCF file represents one issuer), `group` (an arbitrary tag with no OCF analogue).

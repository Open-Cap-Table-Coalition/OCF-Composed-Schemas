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
target_version: "v1alpha1 (2026-06-22)"
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
    kind: rename
    target: "#/$defs/Stakeholder/properties/id"
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

- `name` selects `Name.legal_name` → `fullName`; given/family-name components are not separately represented. `INDIVIDUAL` maps to Carta `entityType=INDIVIDUAL`, while `INSTITUTION` collapses to `UNKNOWN`.
- `current_relationship` and `current_relationships` both map to Carta's single `relationship`; the array uses `first_relationship_in_order`, and `NON_US_EMPLOYEE` remaps to `INTERNATIONAL_EMPLOYEE`.
- `primary_contact`/`contact_info` combine into the single `email` field according to stakeholder type; only the first selected email survives. `addresses` selects the first address's `country` into Carta's single `address` object; other contact/address data and `tax_ids` are dropped.
- `id` and `issuer_assigned_id` map to `Stakeholder.id` and `employeeId`. June 22 makes `Stakeholder.issuerId` required, but issuer context is not a field on OCF Stakeholder; it must be supplied by the enclosing issuer context. `current_status`, `comments`, and `object_type` have no target; `group` remains Carta-only.

- [x] `addresses[].country`: Should an OCF stakeholder address country also populate Carta `Compliance.countryOfResidency`? Investigate whether a two-hop stakeholder linkage is required and how the OCF alpha-2 value should be converted to Carta's alpha-3 code.
  - Asked by: @johnscrudato
  - Answer: Moot for this target snapshot: the June 22 bundle removed the `Compliance` definition, so `countryOfResidency` no longer exists and the `Target:` pointer was dropped. Neither sub-question was decided on the merits — whether `addresses[].country` is the intended residency source, whether a two-hop stakeholder linkage is needed, and how alpha-2 → alpha-3 conversion should work all remain undetermined and must be reopened if Carta reinstates a residency field.
  - Answered by: @johnscrudato
- [x] `addresses[].country_subdivision`: Should an OCF stakeholder address subdivision also populate Carta `Compliance.stateOfResidency`? Investigate whether a two-hop stakeholder linkage is required and how the country-qualified ISO 3166-2 value should be constructed.
  - Asked by: @johnscrudato
  - Answer: Moot for this target snapshot: the June 22 bundle removed the `Compliance` definition, so `stateOfResidency` no longer exists and the `Target:` pointer was dropped. Neither sub-question was decided on the merits — whether `addresses[].country_subdivision` is the intended residency source, whether a two-hop stakeholder linkage is needed, and how the country-qualified ISO 3166-2 value should be constructed all remain undetermined and must be reopened if Carta reinstates a residency field.
  - Answered by: @johnscrudato

---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/Issuer.schema.json
ocf_object_type: ISSUER
ocf_title: Object - Issuer
ocf_kind: object
required_fields:
  - legal_name
  - formation_date
  - country_of_formation
  - id
  - object_type
target_standard: Carta
target_version: "v1alpha1 (2026-06-22)"
status: complete
last_generated: 2026-05-18
---

# Object - Issuer → Carta

> Object describing the issuer of the cap table (the company whose cap table this is)

## OCF schema

Source: [`Issuer.schema.json`](./Issuer.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/Issuer.schema.json",
  "title": "Object - Issuer",
  "description": "Object describing the issuer of the cap table (the company whose cap table this is)",
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
      "const": "ISSUER"
    },
    "legal_name": {
      "description": "Legal name of the issuer",
      "type": "string"
    },
    "dba": {
      "description": "Doing Business As name",
      "type": "string"
    },
    "formation_date": {
      "description": "Date of formation",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "country_of_formation": {
      "description": "The country where the issuer company was legally formed (ISO 3166-1 alpha-2)",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/CountryCode.schema.json"
    },
    "country_subdivision_of_formation": {
      "description": "The code for the state, province, or subdivision where the issuer company was legally formed",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/CountrySubdivisionCode.schema.json"
    },
    "country_subdivision_name_of_formation": {
      "description": "The text name of state, province, or subdivision where the issuer company was legally formed if the code is not available",
      "type": "string"
    },
    "tax_ids": {
      "title": "Issuer - Tax ID Array",
      "description": "The tax ids for this issuer company",
      "type": "array",
      "items": {
        "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/TaxID.schema.json"
      }
    },
    "email": {
      "description": "A work email that the issuer company can be reached at",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Email.schema.json"
    },
    "phone": {
      "description": "A phone number that the issuer company can be reached at",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Phone.schema.json"
    },
    "address": {
      "description": "The headquarters address of the issuing company",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Address.schema.json"
    },
    "initial_shares_authorized": {
      "description": "The initial number of shares authorized for this issuer",
      "oneOf": [
        {
          "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/AuthorizedShares.schema.json"
        },
        {
          "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Numeric.schema.json"
        }
      ]
    }
  },
  "anyOf": [
    {
      "oneOf": [
        {
          "required": [
            "country_subdivision_of_formation"
          ]
        },
        {
          "required": [
            "country_subdivision_name_of_formation"
          ]
        }
      ]
    },
    {
      "not": {
        "required": [
          "country_subdivision_of_formation",
          "country_subdivision_name_of_formation"
        ]
      }
    }
  ],
  "additionalProperties": false,
  "required": [
    "legal_name",
    "formation_date",
    "country_of_formation",
    "id",
    "object_type"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/Issuer.schema.json"
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
    target: "#/$defs/Issuer/properties/id"
  comments:
    kind: unmappable
    target: null
    reason: ocf-internal
  object_type:
    kind: unmappable
    target: null
    reason: ocf-internal
    values:
      ISSUER: null
  legal_name:
    kind: rename
    target: "#/$defs/Issuer/properties/legalName"
  dba:
    kind: rename
    target: "#/$defs/Issuer/properties/doingBusinessAsName"
  formation_date:
    kind: unmappable
    target: null
    reason: no-equivalent
  country_of_formation:
    kind: unmappable
    target: null
    reason: no-equivalent
  country_subdivision_of_formation:
    kind: unmappable
    target: null
    reason: no-equivalent
  country_subdivision_name_of_formation:
    kind: unmappable
    target: null
    reason: no-equivalent
  tax_ids:
    kind: unmappable
    target: null
    reason: no-equivalent
  email:
    kind: unmappable
    target: null
    reason: no-equivalent
  phone:
    kind: unmappable
    target: null
    reason: no-equivalent
  address:
    kind: unmappable
    target: null
    reason: no-equivalent
  initial_shares_authorized:
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
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FIssuer.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FIssuer.mapping.md&title=%5BMapping+question%5D+Issuer) |
| `id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FIssuer.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FIssuer.mapping.md&title=%5BMapping+question%5D+Issuer%3A+id&property_path=id) |
| `comments` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FIssuer.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FIssuer.mapping.md&title=%5BMapping+question%5D+Issuer%3A+comments&property_path=comments) |
| `object_type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FIssuer.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FIssuer.mapping.md&title=%5BMapping+question%5D+Issuer%3A+object_type&property_path=object_type) |
| `legal_name` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FIssuer.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FIssuer.mapping.md&title=%5BMapping+question%5D+Issuer%3A+legal_name&property_path=legal_name) |
| `dba` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FIssuer.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FIssuer.mapping.md&title=%5BMapping+question%5D+Issuer%3A+dba&property_path=dba) |
| `formation_date` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FIssuer.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FIssuer.mapping.md&title=%5BMapping+question%5D+Issuer%3A+formation_date&property_path=formation_date) |
| `country_of_formation` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FIssuer.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FIssuer.mapping.md&title=%5BMapping+question%5D+Issuer%3A+country_of_formation&property_path=country_of_formation) |
| `country_subdivision_of_formation` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FIssuer.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FIssuer.mapping.md&title=%5BMapping+question%5D+Issuer%3A+country_subdivision_of_formation&property_path=country_subdivision_of_formation) |
| `country_subdivision_name_of_formation` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FIssuer.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FIssuer.mapping.md&title=%5BMapping+question%5D+Issuer%3A+country_subdivision_name_of_formation&property_path=country_subdivision_name_of_formation) |
| `tax_ids` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FIssuer.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FIssuer.mapping.md&title=%5BMapping+question%5D+Issuer%3A+tax_ids&property_path=tax_ids) |
| `email` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FIssuer.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FIssuer.mapping.md&title=%5BMapping+question%5D+Issuer%3A+email&property_path=email) |
| `phone` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FIssuer.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FIssuer.mapping.md&title=%5BMapping+question%5D+Issuer%3A+phone&property_path=phone) |
| `address` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FIssuer.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FIssuer.mapping.md&title=%5BMapping+question%5D+Issuer%3A+address&property_path=address) |
| `initial_shares_authorized` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FIssuer.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FIssuer.mapping.md&title=%5BMapping+question%5D+Issuer%3A+initial_shares_authorized&property_path=initial_shares_authorized) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- OCF `Issuer` maps to Carta `Issuer`: `id`, `legal_name`, and `dba` map to `id`, `legalName`, and `doingBusinessAsName`. (The April bundle's separate `Corporation` definition was removed in the June 22 refresh.)
- `formation_date`, formation-country fields, `tax_ids`, `email`, `phone`, `address`, and `initial_shares_authorized` have no issuer-level Carta target. Lower-level authorized-share summaries and stakeholder contact fields are not equivalent issuer fields.
- `comments` and `object_type` are OCF scaffolding (`ocf-internal`). Carta's `website` is target-only and has no OCF source.

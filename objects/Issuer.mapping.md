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
target_standard: TBD
target_version: TBD
status: draft
last_generated: 2026-05-18
---

# Object - Issuer → TBD

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
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: draft
coverage: 0/14

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
      ISSUER: TODO
  legal_name:
    kind: TODO
    target: TODO
  dba:
    kind: TODO
    target: TODO
  formation_date:
    kind: TODO
    target: TODO
  country_of_formation:
    kind: TODO
    target: TODO
  country_subdivision_of_formation:
    kind: TODO
    target: TODO
  country_subdivision_name_of_formation:
    kind: TODO
    target: TODO
  tax_ids:
    kind: TODO
    target: TODO
  email:
    kind: TODO
    target: TODO
  phone:
    kind: TODO
    target: TODO
  address:
    kind: TODO
    target: TODO
  initial_shares_authorized:
    kind: TODO
    target: TODO
```

## Notes / open questions

- 

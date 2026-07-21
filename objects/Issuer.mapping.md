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
target_version: v1alpha1 (2026-04-30)
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
coverage: 14/14

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

## Notes / open questions

- Carta's `Issuer` is the cap-table-owning entity. The bundled schema's description says it's "derived from the **Carta Issuer API** OpenAPI spec," `issuerId` appears 11× as a foreign key across Stakeholder/Certificate/ConvertibleNote/OptionGrant/Interest/etc., and `corporationId` does not appear at all — so OCF Issuer maps to Carta `Issuer`, not Carta `Corporation`.
- Carta also defines a near-identical 4-field `Corporation` type (same fields as `Issuer`: `id`, `legalName`, `doingBusinessAsName`, `website`), but it is not `$ref`'d from anywhere in the bundle and no other type carries a `corporationId`. It may be vestigial or used by API surfaces excluded from this snapshot. The token `CORPORATION` does appear in the schema — only as a value of the `StakeholderEntityType` enum (alongside `LIMITED_LIABILITY_CORPORATION`, etc.) — i.e., "corporation" in Carta is a *category of stakeholder*, not the cap-table-owning entity.
- Carta's `Issuer` carries only `id`, `legalName`, `doingBusinessAsName`, `website`. That leaves 12 of OCF's 14 fields with no Carta counterpart at the Issuer level:
    - `formation_date`, `country_of_formation`, `country_subdivision_of_formation`, `country_subdivision_name_of_formation`: Carta's `Issuer` records no formation info. Nothing Issuer-adjacent in the bundle stores it.
    - `tax_ids`, `email`, `phone`, `address`: no contact/identity fields on Carta's `Issuer`. (Carta has `StakeholderAddress` for stakeholders, not for the issuer entity.)
    - `initial_shares_authorized`: OCF stores a single number-or-sentinel at the Issuer level (the corporate-charter total, `oneOf [AuthorizedShares enum, Numeric]` where the enum values `NOT APPLICABLE` and `UNLIMITED` are sentinels). Carta exposes authorized counts only at lower levels — `ShareClass.authorizedShareCount` and `OptionPoolSummary.authorizedShares` — both `$ref: Decimal` with no description and no Issuer-level rollup. The schema doesn't document the temporal semantics of those counts (initial vs. current vs. as-of-amendment), nor precisely how `OptionPool` authorizations relate to their parent `ShareClass` (the bundle only says `OptionPoolSummary.shareClassId` is "the share class used by the option pool to issue equity"). So no deterministic computation can be constructed from the schema, and even if it could, the OCF sentinel values cannot be produced from a numeric aggregation.
    - `id`, `comments`, `object_type`: boilerplate OCF object scaffolding. `id` is OCF's identifier and Carta assigns its own server-side; `object_type` is a discriminator Carta doesn't need (positional typing per endpoint); `comments` has no Carta slot.
- Carta's `Issuer.website` has no OCF counterpart on `Issuer`.

---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Address.schema.json
ocf_object_type: null
ocf_title: Type - Address
ocf_kind: type
required_fields:
  - address_type
  - country
target_standard: TBD
target_version: TBD
status: draft
last_generated: 2026-05-18
---

# Type - Address → TBD

> Type representation of an address

## OCF schema

Source: [`Address.schema.json`](./Address.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Address.schema.json",
  "title": "Type - Address",
  "description": "Type representation of an address",
  "type": "object",
  "properties": {
    "address_type": {
      "description": "What type of address is this (e.g. legal address, contact address, etc.)",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/AddressType.schema.json"
    },
    "street_suite": {
      "description": "Street address (multi-line string)",
      "type": "string"
    },
    "city": {
      "description": "City",
      "type": "string"
    },
    "country_subdivision": {
      "description": "State, province, or equivalent identifier required for an address in this country",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/CountrySubdivisionCode.schema.json"
    },
    "country": {
      "description": "Country code for this address (ISO 3166-1 alpha-2)",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/CountryCode.schema.json"
    },
    "postal_code": {
      "description": "Address postal code",
      "type": "string"
    }
  },
  "additionalProperties": false,
  "required": [
    "address_type",
    "country"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/Address.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: draft
coverage: 0/6

fields:
  address_type:
    kind: TODO          # likely enum-remap
    target: TODO
    values:
      LEGAL: TODO
      CONTACT: TODO
      OTHER: TODO
  street_suite:
    kind: TODO
    target: TODO
  city:
    kind: TODO
    target: TODO
  country_subdivision:
    kind: TODO
    target: TODO
  country:
    kind: TODO
    target: TODO
  postal_code:
    kind: TODO
    target: TODO
```

## Notes / open questions

- 

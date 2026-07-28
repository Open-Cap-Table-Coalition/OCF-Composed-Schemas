---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Address.schema.json
ocf_object_type: null
ocf_title: Type - Address
ocf_kind: type
required_fields:
  - address_type
  - country
target_standard: Carta
target_version: "v1alpha1 (2026-06-22)"
status: complete
last_generated: 2026-05-18
---

# Type - Address → Carta

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
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
status: complete

fields:
  address_type:
    kind: unmappable
    target: null
    reason: no-equivalent
    values:
      LEGAL: null
      CONTACT: null
      OTHER: null
  street_suite:
    kind: unmappable
    target: null
    reason: no-equivalent
  city:
    kind: unmappable
    target: null
    reason: no-equivalent
  country_subdivision:
    kind: unmappable
    target: null
    reason: no-equivalent
  country:
    kind: rename
    target: "#/$defs/StakeholderAddress/properties/country"
  postal_code:
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
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FAddress.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FAddress.mapping.md&title=%5BMapping+question%5D+Address) |
| `address_type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FAddress.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FAddress.mapping.md&title=%5BMapping+question%5D+Address%3A+address_type&property_path=address_type) |
| `street_suite` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FAddress.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FAddress.mapping.md&title=%5BMapping+question%5D+Address%3A+street_suite&property_path=street_suite) |
| `city` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FAddress.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FAddress.mapping.md&title=%5BMapping+question%5D+Address%3A+city&property_path=city) |
| `country_subdivision` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FAddress.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FAddress.mapping.md&title=%5BMapping+question%5D+Address%3A+country_subdivision&property_path=country_subdivision) |
| `country` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FAddress.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FAddress.mapping.md&title=%5BMapping+question%5D+Address%3A+country&property_path=country) |
| `postal_code` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FAddress.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FAddress.mapping.md&title=%5BMapping+question%5D+Address%3A+postal_code&property_path=postal_code) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- Carta's reachable address type is `StakeholderAddress`, which stores only `country`. OCF `country` maps directly; street, city, subdivision, postal code, and address classification have no address target.
- Carta's address country is free text, so the OCF alpha-2 value can be copied without the alpha-3 conversion required by residency or tax-jurisdiction fields.

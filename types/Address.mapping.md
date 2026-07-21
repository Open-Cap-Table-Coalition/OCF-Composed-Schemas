---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Address.schema.json
ocf_object_type: null
ocf_title: Type - Address
ocf_kind: type
required_fields:
  - address_type
  - country
target_standard: Carta
target_version: "v1alpha1 (2026-04-30)"
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
coverage: 6/6

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

## Notes / open questions

- Carta models a postal address as `StakeholderAddress`, and it is deliberately minimal: the only property is `country` (a free `string`, `maxLength: 1000`, "The country of the stakeholder's address. This will not be set for all stakeholders."). `StakeholderAddress` is reachable in the bundle via `Stakeholder.address → #/$defs/StakeholderAddress`, so it is the correct, in-scope home for an OCF mailing `Address`. Of OCF's six fields, only `country` has a Carta destination.
- `country` → `#/$defs/StakeholderAddress/properties/country` (rename). This is the correct target because it is the *address's* country and is reachable from the address slot (`Stakeholder.address → StakeholderAddress.country`). The two other country fields in the bundle are deliberately not used: `#/$defs/Jurisdiction/country` is a tax-withholding jurisdiction (alpha-3 enum) and `#/$defs/Compliance/countryOfResidency` is stakeholder residency (alpha-3 enum) — both different concepts from a mailing-address country, and neither reachable from `StakeholderAddress`. The chosen target resolves to a free `string` (`maxLength: 1000`, not the `true` excluded-schema sentinel and not an enum), so `rename` — not `enum-remap` — is the right kind. Note a representation difference, not a semantic one: OCF's `country` is an ISO 3166-1 alpha-2 code (`CountryCode`), whereas Carta's `StakeholderAddress.country` is an unconstrained string. Because the Carta field is free text (unlike the alpha-3 enums above, which would require a transcode), the OCF alpha-2 code is a valid value to copy in verbatim; a transformer may pass it through or expand it to a country name without losing meaning. This matches `types/CountryCode.mapping.md`, which records `StakeholderAddress.country` as the home for `Address.country`.
- `street_suite`, `city`, `postal_code` → no-equivalent. Carta retains no street/suite line, no city, and no postal/ZIP component on `StakeholderAddress` (the only property is `country`), and a full-bundle grep finds no `street`/`suite`/`line1`/`line2`/`addressLine`/`postalCode`/`zip`/`locality`/`region` property anywhere. `StakeholderAddress` itself exposes no free-text/notes field that could absorb these components, so there is no lossless or even lossy in-concept home for them. The only `city` token in the entire bundle is `#/$defs/Jurisdiction/city`, described as "The city used to calculate tax withholding" — a tax-jurisdiction input, not a mailing-address line, and not reachable from `StakeholderAddress`; folding a postal city into it would be a semantically wrong target. These postal components are dropped on transfer to Carta.
- `country_subdivision` → no-equivalent. The only `countrySubdivision` field in the bundle lives on `#/$defs/Jurisdiction`, which is explicitly "Jurisdiction used to calculate tax withholding." `Jurisdiction.city`/`countrySubdivision`/`country` are tax-withholding inputs, not mailing-address components, so mapping a postal address's state/province onto them would be semantically wrong (and they are not reachable from `StakeholderAddress`). `Compliance.stateOfResidency` is likewise a residency/compliance field, not a mailing-address subdivision. With no postal-address subdivision field in Carta, this is genuinely no-equivalent. (`Stakeholder.address` itself only exposes `country`.)
- `address_type` (`LEGAL` / `CONTACT` / `OTHER`) → no-equivalent. Carta's `StakeholderAddress` is a single, untyped address with no kind/role discriminator — there is no `addressType`/`type`/`kind`/`label` token on `StakeholderAddress` anywhere in the bundle, and Carta holds at most one address per stakeholder (`Stakeholder.address` is a single object, not an array), so there are no separate legal-vs-contact slots to disambiguate. None of Carta's 47 enums expresses a LEGAL/CONTACT/OTHER address classification. The classification is genuinely absent from the standard (not merely from this snapshot), so `no-equivalent` is correct rather than `excluded-from-snapshot`. The classification is dropped; all three OCF values map to null.
- Net effect: an OCF `Address` collapses to just its country when transferred to Carta. This mirrors `types/Phone.mapping.md` (a concept Carta barely models): the structure exists nominally but most components have no Carta target.

---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/CountrySubdivisionCode.schema.json
ocf_object_type: null
ocf_title: Type - Country Subdivision Code
ocf_kind: type
required_fields: []
target_standard: Carta
target_version: "v1alpha1 (2026-04-30)"
status: complete
last_generated: 2026-05-18
---

# Type - Country Subdivision Code → Carta

> State, province, or equivalent identifier required for an address in this country

## OCF schema

Source: [`CountrySubdivisionCode.schema.json`](./CountrySubdivisionCode.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/CountrySubdivisionCode.schema.json",
  "title": "Type - Country Subdivision Code",
  "description": "State, province, or equivalent identifier required for an address in this country",
  "type": "string",
  "minLength": 1,
  "maxLength": 3,
  "pattern": "^[A-Z0-9]{1,}$",
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/CountrySubdivisionCode.schema.json",
  "properties": {},
  "required": []
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
status: complete

fields: {}
```

## Notes / open questions

- **Type-level correspondence (bucket 1, type-to-type).** OCF `CountrySubdivisionCode` is a zero-property scalar string (`type: string`, `pattern: ^[A-Z0-9]{1,}$`, max 3 chars) carrying an ISO 3166-2 principal-subdivision code (e.g. `CA`, `NY`, `BC`). Carta models the exact same concept as a reusable `$def`: `#/$defs/Iso3166Set2Code` — "Codes identifying the principal subdivisions of countries as defined by the ISO 3166-2 standard." The whole OCF type therefore corresponds, value-for-value, to `Iso3166Set2Code`. As with `types/Md5.mapping.md`, a scalar type has no `properties`, so `fields: {}`; the correspondence lives here in Notes rather than in a per-field row.
- **Shape note.** OCF carries the subdivision code as a bare JSON string. Carta wraps it in an object with a single `value: string` property (`Iso3166Set2Code.properties.value`). A converter writing OCF→Carta lifts the OCF string into `{ "value": "<code>" }`; reading Carta→OCF reads `.value` back out.
- **Value-format mismatch (encoding, not field, gap).** The two ends use different encodings of the *same* concept, so the lift is not a verbatim copy. OCF `CountrySubdivisionCode` is the bare subdivision part only — `type: string`, `minLength: 1`, `maxLength: 3`, `pattern: ^[A-Z0-9]{1,}$` (e.g. `CA`, `NY`, `BC`). Carta's `Iso3166Set2Code.properties.value` is the **full** ISO 3166-2 code — `minLength: 4`, `maxLength: 6`, `pattern: [A-Z]{2}-[A-Z0-9]{1,3}` (e.g. `US-CA`), i.e. the ISO 3166-1 country prefix, a hyphen, then the subdivision. A faithful converter must therefore: OCF→Carta, prefix the sibling `country` (an ISO 3166-1 code) and a hyphen onto the OCF subdivision to form `CC-SUB`; Carta→OCF, strip the `CC-` prefix and keep the part after the hyphen. The OCF subdivision alone is **not** a valid Carta `value` and would fail Carta's pattern. Round-tripping is lossless *only* when the country context is available to supply/strip the prefix; an OCF subdivision with no associated country cannot be encoded into a valid Carta `value` on its own.
- **Where the value lands at the OBJECT level.** Carta does not reference `Iso3166Set2Code` from a generic address structure; it surfaces it on two specific objects:
  - `#/$defs/Compliance/properties/stateOfResidency` ($ref → `Iso3166Set2Code`) — the stakeholder's state/province of residency.
  - `#/$defs/Jurisdiction/properties/countrySubdivision` ($ref → `Iso3166Set2Code`) — the subdivision used for tax-withholding jurisdiction.
  Note that Carta's `StakeholderAddress` $def only exposes a free-text `country` field and has **no** subdivision/state field, so an OCF `Address.country_subdivision` value cannot be round-tripped into Carta's address object — at the object level it routes (if applicable) onto `Compliance.stateOfResidency`, otherwise it is dropped. This object-level routing is documented on the consuming-object mappings, not here; this type-level file only fixes the type ↔ type pairing.
- **OCF consumers of this type.** `grep -rl "types/CountrySubdivisionCode.schema.json"` finds it `$ref`-ed by `types/Address.schema.json` (`country_subdivision`) and `objects/Issuer.schema.json` (`country_subdivision_of_formation`). Both feed values that conform to `Iso3166Set2Code`. (Issuer additionally has a separate free-text `country_subdivision_name_of_formation`, which is a plain `String`, not this coded type.)
- **Consistency.** This pairing mirrors the sibling code types: `CountryCode → Iso3166Set1Alpha3Code` and `CurrencyCode → Iso4217CurrencyAlphaCode`. The same concept (ISO 3166-2 subdivision) is always mapped to the same Carta `$def`.

---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/CountryCode.schema.json
ocf_object_type: null
ocf_title: Type - Country Code
ocf_kind: type
required_fields: []
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-05-18
---

# Type - Country Code → Carta

> Type representation of an ISO 3166-1 alpha 2 country code

## OCF schema

Source: [`CountryCode.schema.json`](./CountryCode.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/CountryCode.schema.json",
  "title": "Type - Country Code",
  "description": "Type representation of an ISO 3166-1 alpha 2 country code",
  "type": "string",
  "minLength": 2,
  "maxLength": 2,
  "pattern": "^[A-Z]{2}$",
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/CountryCode.schema.json",
  "properties": {},
  "required": []
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
status: complete
coverage: 0/0

fields: {}
```

<!-- BEGIN GENERATED REFERENCE SITES -->
### Reference sites (generated)

Reverse `$ref` index: **3/3** discovered consumer sites are listed here. The consumer mapping is authoritative; this section exists to make the context-dependent resolution auditable and complete.

| OCF consumer schema | Consumer mapping | Disposition |
| --- | --- | --- |
| objects/Issuer | [objects/Issuer · country_of_formation](../objects/Issuer.mapping.md) | unmappable / no-equivalent |
| types/Address | [types/Address · country](./Address.mapping.md) | rename → #/$defs/StakeholderAddress/properties/country |
| types/TaxID | [types/TaxID · country](./TaxID.mapping.md) | unmappable / no-equivalent |
<!-- END GENERATED REFERENCE SITES -->

## Notes / open questions

- `CountryCode` is a bare scalar string type (zero `properties`), so per the zero-property convention it carries `fields: {}` and `coverage: 0/0` (cf. `types/Md5.mapping.md`); the type-level correspondence is documented here.
- OCF `CountryCode` is an ISO 3166-1 **alpha-2** code — exactly two uppercase letters (`^[A-Z]{2}$`), e.g. `US`, `GB`. Carta does model country codes, but under a **different ISO encoding**: `#/$defs/Iso3166Set1Alpha3Code` is ISO 3166-1 **alpha-3** (three letters, `[A-Z]{3}`, e.g. `USA`, `GBR`), wrapped as `{ value: string }`. The two represent the same concept (a country) but are not interchangeable strings: any transfer of an OCF country code into a Carta `Iso3166Set1Alpha3Code` requires a deterministic alpha-2 → alpha-3 transcode (the ISO 3166-1 tables are 1:1, so this is lossless), not a verbatim copy. That transcode is a referencing-field concern, not a property of this scalar type, so there is no single string target to record at the type level.
- Carta consumes country codes in three places, none of which gives this reusable type one canonical home: `#/$defs/Jurisdiction/country` (alpha-3, for tax-withholding jurisdiction), `#/$defs/Compliance/countryOfResidency` (alpha-3, stakeholder residency), and `#/$defs/StakeholderAddress/country` (a free-text `string` with no ISO pattern — "The country of the stakeholder's address. This will not be set for all stakeholders."). An alpha-2 OCF value could be copied verbatim into the free-text `StakeholderAddress.country`, but whether that is the right destination depends entirely on the referencing OCF field.
- Because the correct Carta destination is field-specific, each OCF property that `$ref`s `CountryCode` is resolved in its own mapping, not here, and the resolutions genuinely diverge: `Address.country` is a `rename` to the free-text `#/$defs/StakeholderAddress/properties/country` (verbatim alpha-2 copy is acceptable — that field is an unconstrained `string`, `maxLength` 1000, no ISO pattern; see `types/Address.mapping.md`); `TaxID.country` is `unmappable` / `no-equivalent` because Carta has no tax-identifier record at all, so its issuing-country code has nowhere to go (see `types/TaxID.mapping.md`); and `Issuer.country_of_formation` is `unmappable` / `no-equivalent` because Carta's `Issuer` entity has no formation-country slot (see `objects/Issuer.mapping.md`). The three alpha-3 ISO targets (`Jurisdiction.country`, `Compliance.countryOfResidency`, both via `Iso3166Set1Alpha3Code`) are not referenced by any of these OCF fields and, even where they were, would require the alpha-2 → alpha-3 transcode above. The existence of `Iso3166Set1Alpha3Code`, `Jurisdiction.country`, `Compliance.countryOfResidency`, and `StakeholderAddress.country` confirms the *concept* is present in Carta even where a specific referencing field has no home.

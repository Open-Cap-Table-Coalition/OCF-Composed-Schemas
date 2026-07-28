---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/CountryCode.schema.json
ocf_object_type: null
ocf_title: Type - Country Code
ocf_kind: type
required_fields: []
target_standard: Carta
target_version: "v1alpha1 (2026-06-22)"
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

## Ask a mapping question

Use a link below to open a prefilled GitHub issue. The issue can be copied into the auditable checklist in `## Notes / open questions`.

<details>
<summary>Open a prefilled issue for a property</summary>

<!-- mapping-question-links:start -->
| Source property | Action |
| --- | --- |
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FCountryCode.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FCountryCode.mapping.md&title=%5BMapping+question%5D+CountryCode) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- OCF uses ISO 3166-1 alpha-2; Carta's reusable country code uses alpha-3 and a `{value}` wrapper. There is no single type-level destination because the correct Carta field depends on the consuming object.
- Address country can use the free-text `StakeholderAddress.country`; fields requiring Carta's alpha-3 type need a deterministic alpha-2 → alpha-3 conversion.

---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/CurrencyCode.schema.json
ocf_object_type: null
ocf_title: Type - Currency Code
ocf_kind: type
required_fields: []
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-05-18
---

# Type - Currency Code → Carta

> Type representation of an ISO 4217 currency code

## OCF schema

Source: [`CurrencyCode.schema.json`](./CurrencyCode.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/CurrencyCode.schema.json",
  "title": "Type - Currency Code",
  "description": "Type representation of an ISO 4217 currency code",
  "type": "string",
  "minLength": 3,
  "maxLength": 3,
  "pattern": "^[A-Z]{3}$",
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/CurrencyCode.schema.json",
  "properties": {},
  "required": []
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: complete

fields: {}
```

## Notes / open questions

- `CurrencyCode` is a bare scalar string type (zero properties), so there are no per-field rows; the correspondence lives at the type level (same convention as `types/Md5.mapping.md`).
- Type-level target: Carta's `#/$defs/Iso4217CurrencyAlphaCode` is the exact semantic twin. OCF defines `CurrencyCode` as an ISO 4217 three-letter code (`type: string`, `minLength`/`maxLength` 3, `pattern: ^[A-Z]{3}$`); Carta's `Iso4217CurrencyAlphaCode.value` carries the identical constraints (`maxLength`/`minLength` 3, `pattern: [A-Z]{3}`) and the same "three-letter alphabetic currency code defined by the ISO 4217 standard" description. The only shape difference is the wrapper: OCF carries the code as the bare string, whereas Carta nests it under a `value` property.
- Wherever an OCF field `$ref`s `CurrencyCode`, it folds into a Carta `Iso4217CurrencyAlphaCode`. The concrete instance is `Monetary.currency`, which `types/Monetary.mapping.md` renames to `#/$defs/Money/properties/currencyCode` (whose `$ref` target is `Iso4217CurrencyAlphaCode`). No data is dropped on transfer.

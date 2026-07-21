---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/CustomConversionMechanism.schema.json
ocf_object_type: null
ocf_title: Conversion Mechanism - Custom
ocf_kind: type
required_fields:
  - type
  - custom_conversion_description
  - type
target_standard: Carta
target_version: "v1alpha1 (2026-04-30)"
status: complete
last_generated: 2026-05-18
---

# Conversion Mechanism - Custom → Carta

> Sets forth inputs and conversion mechanism of a custom conversion, a conversion type that cannot be accurately modelled with any other OCF conversion mechanism type

## OCF schema

Source: [`CustomConversionMechanism.schema.json`](./CustomConversionMechanism.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/CustomConversionMechanism.schema.json",
  "title": "Conversion Mechanism - Custom",
  "description": "Sets forth inputs and conversion mechanism of a custom conversion, a conversion type that cannot be accurately modelled with any other OCF conversion mechanism type",
  "type": "object",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/types/conversion_mechanisms/ConversionMechanism.schema.json"
    }
  ],
  "properties": {
    "type": {
      "const": "CUSTOM_CONVERSION"
    },
    "custom_conversion_description": {
      "description": "Detailed description of how the number of resulting shares should be determined? Use legal language from an instrument where possible",
      "type": "string"
    }
  },
  "additionalProperties": false,
  "required": [
    "type",
    "custom_conversion_description",
    "type"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/conversion_mechanisms/CustomConversionMechanism.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: complete

fields:
  type:
    kind: unmappable
    target: null
    reason: no-equivalent
    values:
      CUSTOM_CONVERSION: null
  custom_conversion_description:
    kind: unmappable
    target: null
    reason: no-equivalent
```

## Notes / open questions

- **Bucket 3 (absent).** `CustomConversionMechanism` is OCF's escape-hatch conversion-mechanism subtype — the one used when a bespoke conversion "cannot be accurately modelled with any other OCF conversion mechanism type." It carries exactly two fields: a `CUSTOM_CONVERSION` discriminator const and a free-text legal-language `custom_conversion_description`. Carta has **no analogous reusable `$def` for a conversion mechanism**, no conversion-mechanism-type enum, and — critically for this subtype — **no free-text conversion-description field anywhere in the bundle**. Carta models convertible economics only as concrete, typed term fields (`#/$defs/ConvertibleNote/properties/{interestRate, priceCap, discountPercentage, conversionTrigger, …}`, `#/$defs/ConvertibleIssuanceTransaction/properties/{principal, valuationCap, …}`, and `#/$defs/ShareClassRightsAndPreferences/properties/{conversionPrice, conversionRatio, multiplier, …}`). A *custom* mechanism by definition does not fit those typed fields, and there is no narrative slot to spill the prose into — so both properties are `unmappable` / `no-equivalent`.
- `type` is the `CUSTOM_CONVERSION` discriminator const drawn from OCF's `ConversionMechanismType` enum (inherited via the `ConversionMechanism` primitive). It selects which OCF conversion-mechanism subtype is in play. Carta has **no "conversion mechanism type" enum** — I confirmed no Carta enum carries `CUSTOM_CONVERSION` or any mechanism-discriminator value (`NoteType` is `DEBT`/`CONVERTIBLE_DEBT`/`CONVERTIBLE_EQUITY`/`SAFE`/`ASA`, an instrument classification, not a conversion-mechanism selector). With no Carta enum to target, this is `no-equivalent` rather than `enum-remap`. This is consistent with the sibling wrapper `ConvertibleConversionRight.mapping.md`, whose `type` discriminator const is likewise `no-equivalent`.
- `custom_conversion_description` is detailed free-text (legal language from the instrument) describing how the resulting share count should be determined. Carta has no free-text conversion-description / notes / memo field on `ConvertibleNote`, `ConvertibleIssuanceTransaction`, `NoteBlock`, or `ShareClassRightsAndPreferences` (the only `description` strings in the Carta bundle are `#/$defs/PerformanceCondition/properties/description` and `#/$defs/VestingScheduleTemplate/properties/description`, both vesting-scoped and semantically unrelated to convertible conversion). Because a custom mechanism cannot be decomposed into Carta's typed economic fields and there is no narrative slot to hold the prose, this is `no-equivalent` and the bespoke conversion logic is dropped on transfer.
- Unlike the *typed* sibling mechanisms (`SAFEConversionMechanism`, `NoteConversionMechanism`, `RatioConversionMechanism`, etc.), whose economic terms — discount, valuation/price cap, interest rate/accrual/compounding, conversion-trigger amount, conversion ratio/price — DO have Carta homes on the convertible/share-class objects, `CustomConversionMechanism` exposes none of those structured terms. It deliberately holds only a discriminator and free prose, neither of which Carta represents; hence this file is fully unmappable while its siblings are not.
- OCF objects that `$ref` this type: it appears only inside the `conversion_mechanism` `oneOf` of the conversion-right wrappers (`ConvertibleConversionRight`, `WarrantConversionRight`) and via the `ConversionRight` primitive. At the OBJECT level the convertible economics those wrappers govern land on `#/$defs/ConvertibleNote` / `#/$defs/ConvertibleIssuanceTransaction`; the custom-mechanism discriminator and its free-text description are dropped, exactly as the parent `ConvertibleConversionRight.mapping.md` records.

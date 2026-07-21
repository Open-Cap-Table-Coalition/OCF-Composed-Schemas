---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_rights/StockClassConversionRight.schema.json
ocf_object_type: null
ocf_title: Type - Stock Class Conversion Rights
ocf_kind: type
required_fields:
  - conversion_mechanism
  - conversion_mechanism
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-05-18
---

# Type - Stock Class Conversion Rights → Carta

> Type representation of a conversion right from one Stock Class into another Stock Class

## OCF schema

Source: [`StockClassConversionRight.schema.json`](./StockClassConversionRight.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_rights/StockClassConversionRight.schema.json",
  "title": "Type - Stock Class Conversion Rights",
  "description": "Type representation of a conversion right from one Stock Class into another Stock Class",
  "type": "object",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/types/conversion_rights/ConversionRight.schema.json"
    }
  ],
  "properties": {
    "type": {
      "const": "STOCK_CLASS_CONVERSION_RIGHT"
    },
    "conversion_mechanism": {
      "oneOf": [
        {
          "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/RatioConversionMechanism.schema.json"
        }
      ]
    },
    "converts_to_future_round": {
      "description": "Is this stock class potentially convertible into a future, as-yet undetermined stock class (e.g. Founder Preferred)",
      "type": "boolean"
    },
    "converts_to_stock_class_id": {
      "description": "The identifier of the existing, known stock class this stock class can convert into",
      "type": "string"
    }
  },
  "additionalProperties": false,
  "required": [
    "conversion_mechanism",
    "conversion_mechanism"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/conversion_rights/StockClassConversionRight.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
status: complete
coverage: 4/4

fields:
  type:
    kind: unmappable
    target: null
    reason: no-equivalent
    values:
      STOCK_CLASS_CONVERSION_RIGHT: null
  conversion_mechanism:
    kind: split
    target:
      - "#/$defs/ShareClassRightsAndPreferences/properties/conversionRatio"
      - "#/$defs/ShareClassRightsAndPreferences/properties/conversionPrice"
  converts_to_future_round:
    kind: unmappable
    target: null
    reason: no-equivalent
  converts_to_stock_class_id:
    kind: unmappable
    target: null
    reason: no-equivalent
```

## Notes / open questions

- **Bucket 1 (type-to-type, with one clear Carta home).** A stock-class conversion right describes how one preferred share class converts into another (typically Common). Carta models exactly this concept on `#/$defs/ShareClassRightsAndPreferences` (the preferred share class's rights/preferences block, reachable via `PreferredShareClassDetails.rightsAndPreferences`), which carries `conversionRatio` (Decimal), `conversionPrice` (Money), `originalIssuePrice`, `multiplier`, `participating`, and `participationCap`. That structure is the unambiguous destination for the economic terms of this OCF type, so the economic payload is mapped there and only the genuinely-absent structural fields are marked unmappable.
- `conversion_mechanism` here is constrained to a single `oneOf` member, `RatioConversionMechanism`, whose economic inputs are `ratio` and `conversion_price` (plus a `rounding_type`). These fan out to two Carta leaves — `ratio → ShareClassRightsAndPreferences.conversionRatio` and `conversion_price → ShareClassRightsAndPreferences.conversionPrice` — hence `split`. The per-field routing of the nested mechanism is detailed in `types/conversion_mechanisms/RatioConversionMechanism.mapping.md`; the mechanism's `rounding_type` (RoundingType enum) has no Carta equivalent and is dropped, and the mechanism's discriminator `type: RATIO_CONVERSION` is OCF scaffolding with no Carta home. Carta records the resulting conversion terms, not OCF's full mechanism object.
- `type` is the OCF discriminator for which kind of conversion right this is. In this composed schema it is pinned to the const `STOCK_CLASS_CONVERSION_RIGHT` (overriding the parent `ConversionRight.type`, which `$ref`s the `ConversionRightType` enum: `CONVERTIBLE_CONVERSION_RIGHT` / `WARRANT_CONVERSION_RIGHT` / `STOCK_CLASS_CONVERSION_RIGHT`). Carta has no `ConversionRightType` enum and no polymorphic conversion-right object; the stock-class-conversion semantics are implicit in the fact that the terms land on `ShareClassRightsAndPreferences` (a preferred-share-class structure). The discriminator value therefore carries no information for Carta and is unmappable / `no-equivalent`. (`ShareClassType` is `COMMON`/`PREFERRED`, an unrelated classification, not a conversion-right-type enum.)
- `converts_to_future_round` (boolean) flags a class convertible into a future, as-yet-undetermined stock class (e.g. Founder Preferred). Carta's `ShareClassRightsAndPreferences` records concrete ratio/price terms only and has no flag for an indeterminate future conversion target, so this is unmappable / `no-equivalent`.
- `converts_to_stock_class_id` is the identifier of the *target* share class this class converts into. Carta exposes many `shareClassId` fields, but every one of them identifies the share class that *owns* the surrounding record (e.g. on issuance transactions, certificates, option pools, valuations), not a conversion-target pointer; `ShareClassRightsAndPreferences` itself carries no target-class reference. There is no Carta field for "the share class this one converts into," so this is unmappable / `no-equivalent`.
- This type is `$ref`'d into the conversion-rights array of `objects/StockClass.schema.json` (and is enumerated as a `oneOf` option by the `conversion_triggers/*` types). At the object level, `StockClass` is where Carta's `ShareClassRightsAndPreferences` block is populated, so the economic terms mapped above are written there; the unmappable discriminator/flag/target-pointer fields are dropped.

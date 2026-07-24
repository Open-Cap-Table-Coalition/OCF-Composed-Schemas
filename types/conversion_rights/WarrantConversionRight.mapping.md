---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_rights/WarrantConversionRight.schema.json
ocf_object_type: null
ocf_title: Type - Warrant Conversion Rights
ocf_kind: type
required_fields:
  - conversion_mechanism
  - conversion_mechanism
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-05-18
---

# Type - Warrant Conversion Rights → Carta

> Type representation of a conversion right from a convertible into another non-plan security

## OCF schema

Source: [`WarrantConversionRight.schema.json`](./WarrantConversionRight.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_rights/WarrantConversionRight.schema.json",
  "title": "Type - Warrant Conversion Rights",
  "description": "Type representation of a conversion right from a convertible into another non-plan security",
  "type": "object",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/types/conversion_rights/ConversionRight.schema.json"
    }
  ],
  "properties": {
    "type": {
      "const": "WARRANT_CONVERSION_RIGHT"
    },
    "conversion_mechanism": {
      "description": "What conversion mechanism applies to calculate the number of resulting stock class shares?",
      "oneOf": [
        {
          "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/CustomConversionMechanism.schema.json"
        },
        {
          "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/PercentCapitalizationConversionMechanism.schema.json"
        },
        {
          "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/FixedAmountConversionMechanism.schema.json"
        },
        {
          "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/ValuationBasedConversionMechanism.schema.json"
        },
        {
          "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/SharePriceBasedConversionMechanism.schema.json"
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
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/conversion_rights/WarrantConversionRight.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
status: complete

fields:
  type:
    kind: unmappable
    target: null
    reason: no-equivalent
    values:
      WARRANT_CONVERSION_RIGHT: null
  conversion_mechanism:
    kind: unmappable
    target: null
    reason: no-equivalent
  converts_to_future_round:
    kind: unmappable
    target: null
    reason: no-equivalent
  converts_to_stock_class_id:
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
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_rights%2FWarrantConversionRight.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_rights%2FWarrantConversionRight.mapping.md&title=%5BMapping+question%5D+WarrantConversionRight) |
| `type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_rights%2FWarrantConversionRight.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_rights%2FWarrantConversionRight.mapping.md&title=%5BMapping+question%5D+WarrantConversionRight%3A+type&property_path=type) |
| `conversion_mechanism` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_rights%2FWarrantConversionRight.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_rights%2FWarrantConversionRight.mapping.md&title=%5BMapping+question%5D+WarrantConversionRight%3A+conversion_mechanism&property_path=conversion_mechanism) |
| `converts_to_future_round` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_rights%2FWarrantConversionRight.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_rights%2FWarrantConversionRight.mapping.md&title=%5BMapping+question%5D+WarrantConversionRight%3A+converts_to_future_round&property_path=converts_to_future_round) |
| `converts_to_stock_class_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_rights%2FWarrantConversionRight.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_rights%2FWarrantConversionRight.mapping.md&title=%5BMapping+question%5D+WarrantConversionRight%3A+converts_to_stock_class_id&property_path=converts_to_stock_class_id) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- **Bucket 3 (absent).** `WarrantConversionRight` is OCF's polymorphic *conversion-right wrapper* for a warrant — a discriminated container (`type` + a `conversion_mechanism` `oneOf`) that bundles the conversion logic/state-machine of a warrant together with its conversion target. Carta has **no analogous reusable `$def` for a "conversion right"** and **no single object that is THE home for this wrapper**. Carta models warrants as flat transaction records (`#/$defs/WarrantIssuanceTransaction`, whose only economic leaves are `exercisePrice`, `purchasePrice`, `quantity`, `shareClassId`, `expirationDatetime`/`issueDatetime`) and never represents a *conversion mechanism* container, the *which-subtype* discriminator, or the convertible-style economics those mechanisms carry. Hence every property is `unmappable` / `no-equivalent`. (It is deliberately NOT treated like the convertible siblings: `StockClassConversionRight`'s single `RatioConversionMechanism` has one clean Carta home on `ShareClassRightsAndPreferences`, and `ConvertibleConversionRight`'s SAFE/Note mechanisms land on `ConvertibleNote` — but the *warrant* variant's five heterogeneous mechanisms describe warrant economics that Carta's `WarrantIssuanceTransaction` does not carry, and have no single Carta destination — see the `conversion_mechanism` note below.)
- `type` is the `WARRANT_CONVERSION_RIGHT` discriminator const drawn from OCF's `ConversionRightType` enum (`CONVERTIBLE_CONVERSION_RIGHT` / `WARRANT_CONVERSION_RIGHT` / `STOCK_CLASS_CONVERSION_RIGHT`; it overrides the parent `ConversionRight.type`, which `$ref`s that enum). It selects which OCF conversion-right subtype is in play. Carta has no "conversion right type" enum or analog — warrant-ness is implied positionally by being a `WarrantIssuanceTransaction` rather than recorded as a typed discriminator — so this is `no-equivalent` rather than `enum-remap` (there is no Carta enum to remap onto; `WarrantCancellationReason` is an unrelated cancellation-reason enum, not a conversion-right-type enum).
- `conversion_mechanism` is a `oneOf` over five heterogeneous OCF mechanism types: `CustomConversionMechanism` (free-text `custom_conversion_description`), `PercentCapitalizationConversionMechanism` (`converts_to_percent` + `capitalization_definition`/`capitalization_definition_rules`), `FixedAmountConversionMechanism` (`converts_to_quantity`), `ValuationBasedConversionMechanism` (`valuation_type`, `valuation_amount`, capitalization-definition rules), and `SharePriceBasedConversionMechanism` (`discount`, `discount_percentage`, `discount_amount`). It is a polymorphic *container*, not a leaf, so it has no single Carta field. Unlike the stock-class variant, there is no single Carta `$def` that is the home for these five mechanisms: Carta's `WarrantIssuanceTransaction` records only exercise/purchase price, quantity, target `shareClassId` and dates — it has no slot for a percent-of-capitalization grant, a valuation-cap formula, a fully-diluted capitalization definition, or a future-round price-discount. The handful of convertible-style economic terms that *do* have Carta homes (e.g. a discount percentage or a valuation/price amount) live on `#/$defs/ConvertibleNote` / `#/$defs/ConvertibleIssuanceTransaction`, which model *convertibles*, not warrants, and are mapped one level down in the per-mechanism mapping files (`PercentCapitalizationConversionMechanism.mapping.md`, `ValuationBasedConversionMechanism.mapping.md`, `SharePriceBasedConversionMechanism.mapping.md`, etc.). At THIS wrapper level — and for a warrant specifically — the property as a whole has no Carta target, and the structural/event logic it carries (capitalization-definition inclusion rules, valuation formula type, custom free-text mechanics) is OCF conversion state-machine that Carta does not model, so `no-equivalent`.
- `converts_to_future_round` is a boolean flag for convertibility into a future, as-yet-undetermined stock class (e.g. Founder Preferred). Carta records no "converts into a not-yet-defined future round" flag — its warrant and convertible records reference concrete instruments and terms only — so `no-equivalent`.
- `converts_to_stock_class_id` is the identifier of the known destination stock class. Carta's `WarrantIssuanceTransaction.shareClassId` identifies the share class the warrant is *over* (the class it issues), not a *source-security → conversion-target* pointer, and no Carta record carries a "the share class this right converts into" reference. There is no Carta field for the conversion-target id, so `no-equivalent`. (Consistent with `StockParent.mapping.md` and the two sibling conversion-right mappings, where OCF's cross-security lineage references have no single Carta home.)
- OCF objects/types that `$ref` this type: it is enumerated (alongside its sibling conversion-right types) as a `oneOf` option by the OCF conversion-*trigger* types (`AutomaticConversionOnDateTrigger`, `AutomaticConversionOnConditionTrigger`, `ElectiveConversionAtWillTrigger`, `ElectiveConversionOnConditionTrigger`, `ElectiveConversionInDateRangeTrigger`, `UnspecifiedConversionTrigger`) and via the `ConversionTrigger` primitive. Those triggers are themselves OCF conversion state-machine constructs; at the object level the warrant economics they govern land on `#/$defs/WarrantIssuanceTransaction` (exercise/purchase price, quantity, target share class, dates), while the trigger/mechanism wrapper logic and discriminator are dropped.

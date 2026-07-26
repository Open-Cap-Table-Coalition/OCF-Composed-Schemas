---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_rights/ConvertibleConversionRight.schema.json
ocf_object_type: null
ocf_title: Type - Convertible Conversion Rights
ocf_kind: type
required_fields:
  - conversion_mechanism
  - conversion_mechanism
target_standard: Carta
target_version: "v1alpha1 (2026-04-30)"
status: complete
last_generated: 2026-05-18
---

# Type - Convertible Conversion Rights → Carta

> Type representation of a conversion right from a convertible into another non-plan security

## OCF schema

Source: [`ConvertibleConversionRight.schema.json`](./ConvertibleConversionRight.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_rights/ConvertibleConversionRight.schema.json",
  "title": "Type - Convertible Conversion Rights",
  "description": "Type representation of a conversion right from a convertible into another non-plan security",
  "type": "object",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/types/conversion_rights/ConversionRight.schema.json"
    }
  ],
  "properties": {
    "type": {
      "const": "CONVERTIBLE_CONVERSION_RIGHT"
    },
    "conversion_mechanism": {
      "oneOf": [
        {
          "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/SAFEConversionMechanism.schema.json"
        },
        {
          "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/NoteConversionMechanism.schema.json"
        },
        {
          "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/CustomConversionMechanism.schema.json"
        },
        {
          "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/PercentCapitalizationConversionMechanism.schema.json"
        },
        {
          "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/FixedAmountConversionMechanism.schema.json"
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
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/conversion_rights/ConvertibleConversionRight.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | select | split | combine | enum-remap | union-map | computed | unmappable | TODO
status: complete

fields:
  type:
    kind: unmappable
    target: null
    reason: no-equivalent
    values:
      CONVERTIBLE_CONVERSION_RIGHT: null
  conversion_mechanism:
    kind: union-map
    cases:
      - source_schema: "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/SAFEConversionMechanism.schema.json"
        mapping:
          kind: split
          target:
            - "#/$defs/ConvertibleNote/properties/discountPercentage"
            - "#/$defs/ConvertibleNote/properties/priceCap"
            - "#/$defs/ConvertibleIssuanceTransaction/properties/discountPercentage"
            - "#/$defs/ConvertibleIssuanceTransaction/properties/valuationCap"
      - source_schema: "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/NoteConversionMechanism.schema.json"
        mapping:
          kind: split
          target:
            - "#/$defs/ConvertibleNote/properties/discountPercentage"
            - "#/$defs/ConvertibleNote/properties/priceCap"
            - "#/$defs/ConvertibleNote/properties/interestRate"
            - "#/$defs/ConvertibleNote/properties/interestAccrualPeriod"
            - "#/$defs/ConvertibleNote/properties/interestCompoundingPeriod"
            - "#/$defs/ConvertibleNote/properties/dayCountBasis"
            - "#/$defs/ConvertibleIssuanceTransaction/properties/discountPercentage"
            - "#/$defs/ConvertibleIssuanceTransaction/properties/valuationCap"
            - "#/$defs/ConvertibleIssuanceTransaction/properties/interestRate"
            - "#/$defs/ConvertibleIssuanceTransaction/properties/interestAccrualPeriod"
            - "#/$defs/ConvertibleIssuanceTransaction/properties/interestCompoundingPeriod"
            - "#/$defs/ConvertibleIssuanceTransaction/properties/dayCountBasis"
      - source_schema: "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/CustomConversionMechanism.schema.json"
        mapping:
          kind: unmappable
          target: null
          reason: no-equivalent
      - source_schema: "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/PercentCapitalizationConversionMechanism.schema.json"
        mapping:
          kind: unmappable
          target: null
          reason: no-equivalent
      - source_schema: "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/FixedAmountConversionMechanism.schema.json"
        mapping:
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
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_rights%2FConvertibleConversionRight.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_rights%2FConvertibleConversionRight.mapping.md&title=%5BMapping+question%5D+ConvertibleConversionRight) |
| `type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_rights%2FConvertibleConversionRight.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_rights%2FConvertibleConversionRight.mapping.md&title=%5BMapping+question%5D+ConvertibleConversionRight%3A+type&property_path=type) |
| `conversion_mechanism` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_rights%2FConvertibleConversionRight.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_rights%2FConvertibleConversionRight.mapping.md&title=%5BMapping+question%5D+ConvertibleConversionRight%3A+conversion_mechanism&property_path=conversion_mechanism) |
| `converts_to_future_round` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_rights%2FConvertibleConversionRight.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_rights%2FConvertibleConversionRight.mapping.md&title=%5BMapping+question%5D+ConvertibleConversionRight%3A+converts_to_future_round&property_path=converts_to_future_round) |
| `converts_to_stock_class_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_rights%2FConvertibleConversionRight.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_rights%2FConvertibleConversionRight.mapping.md&title=%5BMapping+question%5D+ConvertibleConversionRight%3A+converts_to_stock_class_id&property_path=converts_to_stock_class_id) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- **Bucket 1 (type-to-type, with mirrored Carta homes).** `ConvertibleConversionRight` is OCF's polymorphic *conversion-right wrapper* for a convertible — a discriminated container (`type` + a `conversion_mechanism` `oneOf`) that bundles the conversion economics and logic/state-machine of a convertible together with its conversion target. Carta has no reusable `$def` literally named "conversion right," but a convertible's economic terms have two mirrored Carta homes: the persistent `#/$defs/ConvertibleNote` and the issuance event `#/$defs/ConvertibleIssuanceTransaction`. Both inline the discount, valuation/price cap, interest rate, accrual/compounding period, and day-count basis that this type's mechanisms carry; the note is the canonical home and the issuance transaction is the contextual alternate. Per the Carta structured-target surface ("Convertible economics → `#/$defs/ConvertibleNote/...`") and the directly analogous sibling `StockClassConversionRight.mapping.md` (whose single mechanism maps onto `ShareClassRightsAndPreferences`), this is bucket 1, not bucket 3: the `conversion_mechanism` payload is mapped to its Carta leaves and only the genuinely-absent structural fields are marked `unmappable`. (It is deliberately NOT treated like the sibling `WarrantConversionRight`, whose mechanisms describe *warrant* economics that Carta's `WarrantIssuanceTransaction` does not carry; here the relevant `oneOf` members are convertible mechanisms with clean convertible homes.)
- `type` is the `CONVERTIBLE_CONVERSION_RIGHT` discriminator const drawn from OCF's `ConversionRightType` enum (`CONVERTIBLE_CONVERSION_RIGHT` / `WARRANT_CONVERSION_RIGHT` / `STOCK_CLASS_CONVERSION_RIGHT`). It selects which OCF conversion-right subtype is in play. Carta has no "conversion right type" enum or analog — convertible-ness is implied positionally by being a `ConvertibleNote` rather than recorded as a typed discriminator — so this is `no-equivalent` rather than `enum-remap` (there is no Carta enum to remap onto).
- `conversion_mechanism` is a `oneOf` over five OCF mechanism types (`SAFEConversionMechanism`, `NoteConversionMechanism`, `CustomConversionMechanism`, `PercentCapitalizationConversionMechanism`, `FixedAmountConversionMechanism`). Those branches are mutually exclusive: one value is either a SAFE mechanism or a Note mechanism (or one of the three other mechanism types), never both. The mapping therefore uses the branch-aware `union-map` operator, with one exact case for every source `$ref`; it is not a plain `split`. The SAFE case fans its two economic terms to the Carta homes `ConvertibleNote.discountPercentage` / `priceCap` and the mirrored `ConvertibleIssuanceTransaction.discountPercentage` / `valuationCap`. The Note case fans those same terms plus interest rate, accrual period, compounding period, and day-count basis to the corresponding leaves on both Carta homes. The nested `SAFEConversionMechanism.mapping.md` and `NoteConversionMechanism.mapping.md` files remain the field-level source of truth for which properties supply those leaves; this wrapper mapping records which mutually-exclusive mechanism branch is allowed to supply them. The `CustomConversionMechanism`, `PercentCapitalizationConversionMechanism`, and `FixedAmountConversionMechanism` cases are explicit `unmappable` branches because their mechanism-specific economics have no Carta equivalent. Thus a SAFE cannot acquire Note-only interest fields, and a Note cannot acquire SAFE-only terms by accidental sibling fan-out; the branch discriminator is applied before the target fan-out.
- `converts_to_future_round` is a boolean flag for convertibility into a future, as-yet-undetermined stock class (e.g. Founder Preferred). Carta records no "converts into a not-yet-defined future round" flag — its convertible/preferred records reference concrete instruments and terms — so `no-equivalent`.
- `converts_to_stock_class_id` is the identifier of the known destination stock class. Carta's `ConvertibleNote` / `ConvertibleIssuanceTransaction` carry no pointer to a target share class, and `ShareClassRightsAndPreferences` records the conversion economics OF the preferred class itself (`conversionRatio`, `conversionPrice`) rather than a *source-security → destination-stock-class* reference. There is no Carta field for the conversion-target id, so `no-equivalent`. (This is also consistent with `StockParent.mapping.md`, where OCF's generic cross-security lineage references have no single Carta home.)
- OCF objects that `$ref` this type: it is referenced (alongside its sibling conversion-right types) only by the OCF conversion-*trigger* types (`AutomaticConversionOnDateTrigger`, `AutomaticConversionOnConditionTrigger`, `ElectiveConversionAtWillTrigger`, `ElectiveConversionOnConditionTrigger`, `ElectiveConversionInDateRangeTrigger`, `UnspecifiedConversionTrigger`) and via the `ConversionRight` primitive. Those triggers are themselves OCF conversion state-machine constructs; at the object level the convertible economics that the `conversion_mechanism` carries land on `#/$defs/ConvertibleNote` / `#/$defs/ConvertibleIssuanceTransaction` (the discount, cap, interest, accrual/compounding, and day-count leaves mapped above), while the trigger/mechanism wrapper *logic* — the discriminator, the future-round flag, the conversion-target pointer, and the trigger state machine — is dropped.

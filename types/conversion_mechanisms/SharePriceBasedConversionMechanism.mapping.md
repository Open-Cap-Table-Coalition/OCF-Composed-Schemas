---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/SharePriceBasedConversionMechanism.schema.json
ocf_object_type: null
ocf_title: Conversion Mechanism - Share-Price-Based Conversion Mechanism
ocf_kind: type
required_fields:
  - type
  - description
  - type
target_standard: Carta
target_version: "v1alpha1 (2026-04-30)"
status: complete
last_generated: 2026-05-18
---

# Conversion Mechanism - Share-Price-Based Conversion Mechanism → Carta

> Sets forth inputs and conversion mechanism based on price per share of a future round (with potential discounts)

## OCF schema

Source: [`SharePriceBasedConversionMechanism.schema.json`](./SharePriceBasedConversionMechanism.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/SharePriceBasedConversionMechanism.schema.json",
  "title": "Conversion Mechanism - Share-Price-Based Conversion Mechanism",
  "description": "Sets forth inputs and conversion mechanism based on price per share of a future round (with potential discounts)",
  "type": "object",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/types/conversion_mechanisms/ConversionMechanism.schema.json"
    }
  ],
  "properties": {
    "type": {
      "const": "PPS_BASED_CONVERSION"
    },
    "description": {
      "type": "string",
      "description": "A description of the specifics of the conversion - e.g. The Holder is entitled, during the Exercise Period, to purchase from the Company such number of Preferred Shares as are equal to $100,000 divided by the Exercise Price. 'Exercise Price' shall mean 80% of the price per share paid by the investors in the next Qualified Financing."
    },
    "discount": {
      "type": "boolean",
      "description": "True if the conversion shares should be based on a discount off the price-per-share in the next elligible financing"
    },
    "discount_percentage": {
      "description": "If the conversion price is base on a percent discount off the price-per-share of the next elligible financing, what is the discount percent",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Percentage.schema.json"
    },
    "discount_amount": {
      "description": "If the resulting conversion shares is based on a fixed amount discount off the price-per-share of the next eilligible financing, what is the discount amount (in currency)",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Monetary.schema.json"
    }
  },
  "oneOf": [
    {
      "properties": {
        "discount": {
          "const": true
        }
      },
      "required": [
        "discount_percentage"
      ],
      "not": {
        "required": [
          "discount_amount"
        ]
      }
    },
    {
      "properties": {
        "discount": {
          "const": true
        }
      },
      "required": [
        "discount_amount"
      ],
      "not": {
        "required": [
          "discount_percentage"
        ]
      }
    },
    {
      "properties": {
        "discount": {
          "const": false
        }
      },
      "not": {
        "required": [
          "discount_percentage",
          "discount_amount"
        ]
      }
    }
  ],
  "required": [
    "type",
    "description",
    "type"
  ],
  "additionalProperties": false,
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/conversion_mechanisms/SharePriceBasedConversionMechanism.schema.json"
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
    reason: ocf-internal
  description:
    kind: unmappable
    target: null
    reason: no-equivalent
  discount:
    kind: unmappable
    target: null
    reason: no-equivalent
  discount_percentage:
    kind: unmappable
    target: null
    reason: no-equivalent
  discount_amount:
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
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FSharePriceBasedConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FSharePriceBasedConversionMechanism.mapping.md&title=%5BMapping+question%5D+SharePriceBasedConversionMechanism) |
| `type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FSharePriceBasedConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FSharePriceBasedConversionMechanism.mapping.md&title=%5BMapping+question%5D+SharePriceBasedConversionMechanism%3A+type&property_path=type) |
| `description` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FSharePriceBasedConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FSharePriceBasedConversionMechanism.mapping.md&title=%5BMapping+question%5D+SharePriceBasedConversionMechanism%3A+description&property_path=description) |
| `discount` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FSharePriceBasedConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FSharePriceBasedConversionMechanism.mapping.md&title=%5BMapping+question%5D+SharePriceBasedConversionMechanism%3A+discount&property_path=discount) |
| `discount_percentage` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FSharePriceBasedConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FSharePriceBasedConversionMechanism.mapping.md&title=%5BMapping+question%5D+SharePriceBasedConversionMechanism%3A+discount_percentage&property_path=discount_percentage) |
| `discount_amount` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FSharePriceBasedConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FSharePriceBasedConversionMechanism.mapping.md&title=%5BMapping+question%5D+SharePriceBasedConversionMechanism%3A+discount_amount&property_path=discount_amount) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- **Bucket (3) — no target in the effective consumer context.** `SharePriceBasedConversionMechanism` is the "price-per-share of the next round, less a discount" mechanism, but the concrete OCF subtype that admits it is `WarrantConversionRight`, not `ConvertibleConversionRight`. The shared `ConversionRight` primitive has a broader `oneOf`, but the concrete `ConvertibleConversionRight` schema narrows its own `conversion_mechanism` union and excludes this branch. Carta's warrant family has no term-level field for a future-round price discount, and routing it to `ConvertibleNote.discountPercentage` would change a warrant into a convertible. Therefore `discount_percentage` is explicitly `unmappable` here. The convertible-note discount mapping remains correctly owned by `NoteConversionMechanism` and `SAFEConversionMechanism`.
- **Context rule.** A future mapping that proves this mechanism is being used by a genuinely convertible source may add a context-specific route to `ConvertibleNote` / `ConvertibleIssuanceTransaction`; this reusable type mapping must not claim that target globally because its effective current consumer is the warrant-right branch.
- **Effective consumer routing.** The raw primitive reference is not sufficient evidence of a convertible target: concrete subtypes narrow that union. Here the effective current consumer is `WarrantConversionRight`, whose mapping intentionally drops the conversion mechanism because Carta has no equivalent warrant term. The price-per-share logic, discount presence flag, and fixed-dollar alternative therefore remain unmappable.
- `type` (const `"PPS_BASED_CONVERSION"`) → **unmappable / ocf-internal.** This is the OCF discriminator constant that selects which `ConversionMechanism` variant is present inside a `ConversionRight`/`ConversionTrigger`. It is pure OCF scaffolding, not a data value. Carta carries no conversion-mechanism `type` tag — there is no `ConversionMechanismType`-style enum in the bundle (`carta-enums.json` enumerates `Convertible*`/`Warrant*` terms but nothing that enumerates mechanism kinds), because Carta does not model the OCF conversion-mechanism object family as such; the "this is a price-per-share-based conversion" fact is implicit in how the convertible's terms are stored. Treated as `ocf-internal` (the same class as `object_type` and the other mechanism discriminators, e.g. `FixedAmountConversionMechanism.type`), not `no-equivalent`.
- `description` (free-text) → **unmappable / no-equivalent.** This is human-readable prose describing the conversion specifics (often verbatim instrument language — e.g. "Exercise Price shall mean 80% of the price per share paid by the investors in the next Qualified Financing"). Carta records the resulting numeric terms (the discount), but has no free-text/legal-prose field on `ConvertibleNote` / `ConvertibleIssuanceTransaction` or elsewhere in which to store a conversion-mechanism narrative, so the description is dropped. Same disposition as `NoteConversionMechanism.capitalization_definition` (free-text → no-equivalent).
- `discount` (boolean) → **unmappable / no-equivalent.** This is a *presence flag* — "is the conversion priced at a discount off the next round's PPS?" In Carta the discount is recorded by storing a value in `discountPercentage` (or leaving it absent), so the existence of a discount is implied by the presence of that value; there is no separate boolean to carry. The flag itself has no Carta field and is not needed once the discount value is mapped, so it is `no-equivalent`. (It also participates in the OCF `oneOf` that enforces "percentage XOR amount when `discount` is true" — that structural constraint is OCF-internal validation logic with no Carta counterpart.)
- `discount_percentage` (OCF `Percentage`) → **unmappable / no-equivalent in the effective warrant context.** Although the scalar resembles a convertible-note discount, the surrounding OCF union identifies this mechanism as a warrant-right mechanism. Carta has no warrant field for a discount off the price per share of a future round, and `ConvertibleNote.discountPercentage` is not a valid fallback target.
- `discount_amount` (OCF `Monetary`) → **unmappable / no-equivalent.** This is a *fixed dollar* discount off the next round's price-per-share (per the OCF `oneOf`, it is the alternative to `discount_percentage`). Carta's convertible model expresses the discount only as a percentage/`Decimal` (`discountPercentage`); it has **no fixed-money discount field** — a scan of the bundle finds no `discountAmount`/`discountMoney`/fixed-discount property on `ConvertibleNote`, `ConvertibleIssuanceTransaction`, or anywhere else. The other `Money` fields on the convertible objects are distinct economic terms (`priceCap`/`valuationCap`, `conversionTrigger`, `principal`, `interest`, `cashPaid`), and `ShareClassRightsAndPreferences.conversionPrice`/`originalIssuePrice` are *prices*, not a *discount off a future price* — routing a fixed-dollar discount onto any of those would misrepresent it, so it is left unmappable rather than force-fit. Because Carta only models a percentage discount, an instrument that states its discount as a fixed currency amount cannot be carried losslessly; if the next-round PPS is known the importer could derive an equivalent `discountPercentage`, but that derivation is out of band and OCF does not supply the PPS here.
- No Carta term is carried from this mechanism. The unmappable fields are genuinely absent from Carta's effective warrant surface, not compressed; the similarly shaped convertible-note field belongs to a different concrete source context.
</content>
</invoke>

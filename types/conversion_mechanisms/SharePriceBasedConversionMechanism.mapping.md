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
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
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
    kind: rename
    target: "#/$defs/ConvertibleNote/properties/discountPercentage"
  discount_amount:
    kind: unmappable
    target: null
    reason: no-equivalent
```

## Notes / open questions

- **Bucket (1) — structured OCF type with a single, unambiguous Carta home.** `SharePriceBasedConversionMechanism` is the "price-per-share of the next round, less a discount" conversion mechanism — the classic discount-off-next-financing term shared by SAFEs and convertible notes. Carta models exactly that discount term as a field on its convertible objects (`#/$defs/ConvertibleNote/properties/discountPercentage`, mirrored by `#/$defs/ConvertibleIssuanceTransaction/properties/discountPercentage`), so the one economic input this mechanism actually contributes to Carta has a clear, well-posed home. That makes this bucket-1 (map the term that lands, mark `unmappable` only the genuinely-absent ones), not bucket-2: the destination is a single concrete Carta field, not a scatter of unrelated bare scalars. This is consistent with `types/conversion_mechanisms/NoteConversionMechanism.mapping.md`, where `conversion_discount` (the same OCF `Percentage` discount) maps to the same `ConvertibleNote.discountPercentage`.
- **Object-level routing of the OCF references.** This type is `$ref`'d by `primitives/types/conversion_rights/ConversionRight.schema.json` and by `types/conversion_rights/WarrantConversionRight.schema.json` (both via the shared conversion-right / `ConversionMechanism` primitive plumbing). At the object level those conversion rights attach to a convertible/warrant security, which Carta represents as `ConvertibleNote` / `ConvertibleIssuanceTransaction` (and the warrant issuance objects). The discount carried here lands on `discountPercentage`; the rest of the mechanism (the price-per-share-of-next-round logic, the discount-vs-no-discount switch, and any fixed dollar discount) has no slot on those objects and drops out of the Carta snapshot.
- `type` (const `"PPS_BASED_CONVERSION"`) → **unmappable / ocf-internal.** This is the OCF discriminator constant that selects which `ConversionMechanism` variant is present inside a `ConversionRight`/`ConversionTrigger`. It is pure OCF scaffolding, not a data value. Carta carries no conversion-mechanism `type` tag — there is no `ConversionMechanismType`-style enum in the bundle (`carta-enums.json` enumerates `Convertible*`/`Warrant*` terms but nothing that enumerates mechanism kinds), because Carta does not model the OCF conversion-mechanism object family as such; the "this is a price-per-share-based conversion" fact is implicit in how the convertible's terms are stored. Treated as `ocf-internal` (the same class as `object_type` and the other mechanism discriminators, e.g. `FixedAmountConversionMechanism.type`), not `no-equivalent`.
- `description` (free-text) → **unmappable / no-equivalent.** This is human-readable prose describing the conversion specifics (often verbatim instrument language — e.g. "Exercise Price shall mean 80% of the price per share paid by the investors in the next Qualified Financing"). Carta records the resulting numeric terms (the discount), but has no free-text/legal-prose field on `ConvertibleNote` / `ConvertibleIssuanceTransaction` or elsewhere in which to store a conversion-mechanism narrative, so the description is dropped. Same disposition as `NoteConversionMechanism.capitalization_definition` (free-text → no-equivalent).
- `discount` (boolean) → **unmappable / no-equivalent.** This is a *presence flag* — "is the conversion priced at a discount off the next round's PPS?" In Carta the discount is recorded by storing a value in `discountPercentage` (or leaving it absent), so the existence of a discount is implied by the presence of that value; there is no separate boolean to carry. The flag itself has no Carta field and is not needed once the discount value is mapped, so it is `no-equivalent`. (It also participates in the OCF `oneOf` that enforces "percentage XOR amount when `discount` is true" — that structural constraint is OCF-internal validation logic with no Carta counterpart.)
- `discount_percentage` (OCF `Percentage`) → `#/$defs/ConvertibleNote/properties/discountPercentage` (Carta `Decimal`). **Direct rename.** OCF's `Percentage` is a decimal-fraction string in `[0, 1]` (e.g. `0.20` for a 20% discount, per the type's `pattern`/description) and Carta's `discountPercentage` is a `Decimal`; the same fraction transfers with no rescaling, only a numeric-to-string serialization. Note the OCF semantics: the value is the *discount rate* off the next round's PPS (a `0.20` discount ⇒ pay 80% of PPS), matching how Carta's `discountPercentage` is used on the note. `ConvertibleIssuanceTransaction.discountPercentage` (also `Decimal`) is the equivalent alternate destination for the same value on the issuance event.
- `discount_amount` (OCF `Monetary`) → **unmappable / no-equivalent.** This is a *fixed dollar* discount off the next round's price-per-share (per the OCF `oneOf`, it is the alternative to `discount_percentage`). Carta's convertible model expresses the discount only as a percentage/`Decimal` (`discountPercentage`); it has **no fixed-money discount field** — a scan of the bundle finds no `discountAmount`/`discountMoney`/fixed-discount property on `ConvertibleNote`, `ConvertibleIssuanceTransaction`, or anywhere else. The other `Money` fields on the convertible objects are distinct economic terms (`priceCap`/`valuationCap`, `conversionTrigger`, `principal`, `interest`, `cashPaid`), and `ShareClassRightsAndPreferences.conversionPrice`/`originalIssuePrice` are *prices*, not a *discount off a future price* — routing a fixed-dollar discount onto any of those would misrepresent it, so it is left unmappable rather than force-fit. Because Carta only models a percentage discount, an instrument that states its discount as a fixed currency amount cannot be carried losslessly; if the next-round PPS is known the importer could derive an equivalent `discountPercentage`, but that derivation is out of band and OCF does not supply the PPS here.
- No partial/lossy mapping is claimed beyond `discount_percentage`'s serialization (fraction → `Decimal` string, no scaling). The unmappable fields are genuinely absent from Carta's surface, not compressed; the only economic value this mechanism carries that Carta can store is the percentage discount.
</content>
</invoke>

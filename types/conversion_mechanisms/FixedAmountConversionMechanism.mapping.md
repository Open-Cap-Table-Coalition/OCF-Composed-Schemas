---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/FixedAmountConversionMechanism.schema.json
ocf_object_type: null
ocf_title: Conversion Mechanism - Fixed Amount
ocf_kind: type
required_fields:
  - converts_to_quantity
  - type
  - type
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-05-18
---

# Conversion Mechanism - Fixed Amount → Carta

> Describes how a security converts into a fixed amount of a stock class

## OCF schema

Source: [`FixedAmountConversionMechanism.schema.json`](./FixedAmountConversionMechanism.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/FixedAmountConversionMechanism.schema.json",
  "title": "Conversion Mechanism - Fixed Amount",
  "description": "Describes how a security converts into a fixed amount of a stock class",
  "type": "object",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/types/conversion_mechanisms/ConversionMechanism.schema.json"
    }
  ],
  "properties": {
    "type": {
      "const": "FIXED_AMOUNT_CONVERSION"
    },
    "converts_to_quantity": {
      "description": "How many shares of target Stock Class does this security convert into?",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Numeric.schema.json"
    }
  },
  "additionalProperties": false,
  "required": [
    "converts_to_quantity",
    "type",
    "type"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/conversion_mechanisms/FixedAmountConversionMechanism.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
status: complete
coverage: 2/2

fields:
  type:
    kind: unmappable
    target: null
    reason: no-equivalent
  converts_to_quantity:
    kind: unmappable
    target: null
    reason: no-equivalent
```

## Notes / open questions

- **Bucket 3 (absent).** `FixedAmountConversionMechanism` is one of OCF's conversion-mechanism variants — it states, as a forward-looking *term* of a convertible/warrant conversion right, that the security converts into a **fixed absolute number of target stock-class shares** (`converts_to_quantity`), independent of price, ratio, valuation, or principal. Carta has no analogous reusable type and, more importantly, **no field anywhere that records a conversion mechanism's declared fixed-share-count term.** Carta models convertible/warrant conversion economics only as *price/ratio/valuation* terms and records *realized* quantities only after an event. So both fields are unmappable. (Contrast `types/Ratio.mapping.md`, which is bucket 1 only because Carta *does* expose a single clear term-level home, `ShareClassRightsAndPreferences.conversionRatio`; there is no equivalent landing spot for a fixed absolute quantity, so this mechanism falls through to bucket 3.)

- `type` (const `"FIXED_AMOUNT_CONVERSION"`) → `unmappable` / `no-equivalent`. This is the discriminator that selects which conversion-mechanism variant is present inside an OCF `ConversionRight` (here, the fixed-share-count mechanism). Carta has **no** conversion-mechanism enum to remap it onto — there is no `ConversionMechanismType`/`Conversion*`/`Mechanism` enum anywhere in the bundle (`carta-enums.json` has `Convertible*` and `Warrant*` enums but nothing enumerating mechanism kinds), because Carta does not model the OCF conversion-mechanism object family at all; the mechanism kind is only implied by which destination object the terms land on. The reason is **`no-equivalent`, not `ocf-internal`**: unlike a structural object discriminator such as `objects/Issuer.mapping.md`'s `object_type` (pure OCF plumbing → `ocf-internal`), this const carries genuine *which-mechanism* semantics that Carta simply omits. This matches the sibling bucket-1 mechanisms `types/conversion_mechanisms/RatioConversionMechanism.mapping.md` and `PercentCapitalizationConversionMechanism.mapping.md`, which classify the mechanism `type` const as `no-equivalent` for exactly this reason.

- `converts_to_quantity` (a `Numeric` — "how many shares of target Stock Class does this security convert into?") → `unmappable` / `no-equivalent`. I confirmed Carta has no term-level home for this:
  - Carta's stock-class conversion economics live on `#/$defs/ShareClassRightsAndPreferences` (`originalIssuePrice`, `conversionPrice`, `conversionRatio`, `multiplier`, `participating`, `participationCap`). These express conversion as a **ratio/price**, never as a fixed absolute share count, so `converts_to_quantity` cannot be stored there without inventing a denominator that OCF does not supply.
  - Carta's convertible terms (`#/$defs/ConvertibleNote`, `#/$defs/ConvertibleIssuanceTransaction`) carry `principal`, `valuationCap`/`priceCap`, `discountPercentage`, `conversionTrigger` (a `Money` threshold), `interestRate`, and date fields — all economic *inputs*, none of them a pre-declared count of resulting shares.
  - Every realized Carta `quantity`/`*Quantity`/`resulting*` field I surveyed (e.g. `WarrantExerciseTransaction.quantity`/`resultingSecurityId`, `ConvertibleNote.canceledQuantity`, `OptionExerciseTransaction.quantity`, `Certificate.quantity`) is a **realized transaction or holding amount** — the outcome recorded *after* an issuance/exercise/cancellation/conversion event, not the conversion right's stated fixed-amount term. Routing the OCF term onto a post-event `quantity` would misrepresent a forward-looking instruction as a settled fact and is semantically wrong, so it is left unmappable rather than force-fit.
  - The strongest near-miss candidate considered and rejected is **`#/$defs/WarrantIssuanceTransaction/properties/quantity`** (`Decimal`, on "the initial issuance of a warrant"). It is *not* a valid home for `converts_to_quantity`, for two independent reasons: (a) **wrong concept** — it is the size of the warrant *block being issued* (how many warrant units / underlying shares the warrant covers), a property of the warrant security itself, whereas `converts_to_quantity` is the *conversion mechanism's* declared output (how many target-class shares a conversion *produces*); these coincide only in the degenerate 1:1 case and OCF deliberately separates the issued warrant from its conversion mechanism, so equating them would invent an identity OCF does not assert. (b) **only half the consumers** — `FixedAmountConversionMechanism` is `$ref`'d by **both** `WarrantConversionRight` **and** `ConvertibleConversionRight`; even if one accepted the warrant conflation, the convertible-note side (`ConvertibleNote`/`ConvertibleIssuanceTransaction`) has **no** issuance-quantity field at all (its only quantity is `canceledQuantity`, a realized cancellation), so the type as a whole has no single Carta home for this field. A type-level mapping must hold for every consumer; this one does not. Hence `no-equivalent`.

- Where the OCF objects that `$ref` this mechanism route at the object level: `FixedAmountConversionMechanism` is referenced from `types/conversion_rights/ConvertibleConversionRight.schema.json` and `types/conversion_rights/WarrantConversionRight.schema.json` (via the shared `primitives/types/conversion_rights/ConversionRight.schema.json` and the `ConversionMechanism` primitive). At the object level those conversion rights attach to Carta's `ConvertibleNote`/`ConvertibleIssuanceTransaction` and `WarrantIssuanceTransaction`, where Carta records the convertible/warrant's *price-and-trigger* terms and then the *realized* `quantity` once an exercise/conversion transaction occurs. The OCF "convert into exactly N shares" instruction has no slot in either place, so it drops out of the Carta snapshot; see those conversion-right mappings for the full object-level disposition.

- No lossy/partial mapping is claimed here: unlike `Ratio` (which is *compressed* into one Carta `Decimal`), nothing in this type is partially carried — Carta simply has no representation of a fixed-share-count conversion term, so both fields are genuinely `no-equivalent` rather than mapped-with-loss.

---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/adjustment/StockClassConversionRatioAdjustment.schema.json
ocf_object_type: TX_STOCK_CLASS_CONVERSION_RATIO_ADJUSTMENT
ocf_title: Object - Stock Class Conversion Ratio Adjustment Transaction
ocf_kind: object
required_fields:
  - new_ratio_conversion_mechanism
  - id
  - object_type
  - date
  - stock_class_id
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-05-18
---

# Object - Stock Class Conversion Ratio Adjustment Transaction → Carta

> Object describing the conversion ratio adjustment of a stock class that has a RatioConversionMechanism conversion mechanism where there was an actual repricing due to a down-round. The actual determination of the new conversion ratio / conversion price is calculated outside of OCF, so the specific mechanism - e.g. broad-based weighted-average anti-dilution protection vs. full ratchet anti-dilution protection.

## OCF schema

Source: [`StockClassConversionRatioAdjustment.schema.json`](./StockClassConversionRatioAdjustment.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/adjustment/StockClassConversionRatioAdjustment.schema.json",
  "title": "Object - Stock Class Conversion Ratio Adjustment Transaction",
  "description": "Object describing the conversion ratio adjustment of a stock class that has a RatioConversionMechanism conversion mechanism where there was an actual repricing due to a down-round. The actual determination of the new conversion ratio / conversion price is calculated outside of OCF, so the specific mechanism - e.g. broad-based weighted-average anti-dilution protection vs. full ratchet anti-dilution protection.",
  "type": "object",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/Object.schema.json"
    },
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/Transaction.schema.json"
    },
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/StockClassTransaction.schema.json"
    }
  ],
  "properties": {
    "id": {
      "description": "Identifier for the object",
      "type": "string"
    },
    "comments": {
      "description": "Unstructured text comments related to and stored for the object",
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "object_type": {
      "const": "TX_STOCK_CLASS_CONVERSION_RATIO_ADJUSTMENT"
    },
    "date": {
      "description": "Date on which the transaction occurred",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "stock_class_id": {
      "description": "Identifier of the StockClass object, a subject of this transaction",
      "type": "string"
    },
    "new_ratio_conversion_mechanism": {
      "description": "New conversion ratio mechanism describing new conversion price and conversion ratio in effect following a repricing - based on original issue price to new conversion price (provided in this transaction). For 2-for-1 split the numerator of the ratio is 2 and the denominator is 1.",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/RatioConversionMechanism.schema.json"
    }
  },
  "additionalProperties": false,
  "required": [
    "new_ratio_conversion_mechanism",
    "id",
    "object_type",
    "date",
    "stock_class_id"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/adjustment/StockClassConversionRatioAdjustment.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
status: complete

fields:
  id:
    kind: unmappable
    target: null
    reason: ocf-internal
  comments:
    kind: unmappable
    target: null
    reason: ocf-internal
  object_type:
    kind: unmappable
    target: null
    reason: ocf-internal
    values:
      TX_STOCK_CLASS_CONVERSION_RATIO_ADJUSTMENT: null
  date:
    kind: unmappable
    target: null
    reason: no-equivalent
  stock_class_id:
    kind: rename
    target: "#/$defs/ShareClass/properties/id"
  new_ratio_conversion_mechanism:
    kind: split
    target:
      - "#/$defs/ShareClassRightsAndPreferences/properties/conversionRatio"
      - "#/$defs/ShareClassRightsAndPreferences/properties/conversionPrice"
```

## Ask a mapping question

Use a link below to open a prefilled GitHub issue. The issue can be copied into the auditable checklist in `## Notes / open questions`.

<details>
<summary>Open a prefilled issue for a property</summary>

<!-- mapping-question-links:start -->
| Source property | Action |
| --- | --- |
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fadjustment%2FStockClassConversionRatioAdjustment.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fadjustment%2FStockClassConversionRatioAdjustment.mapping.md&title=%5BMapping+question%5D+StockClassConversionRatioAdjustment) |
| `id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fadjustment%2FStockClassConversionRatioAdjustment.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fadjustment%2FStockClassConversionRatioAdjustment.mapping.md&title=%5BMapping+question%5D+StockClassConversionRatioAdjustment+%2F+id&property_path=id) |
| `comments` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fadjustment%2FStockClassConversionRatioAdjustment.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fadjustment%2FStockClassConversionRatioAdjustment.mapping.md&title=%5BMapping+question%5D+StockClassConversionRatioAdjustment+%2F+comments&property_path=comments) |
| `object_type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fadjustment%2FStockClassConversionRatioAdjustment.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fadjustment%2FStockClassConversionRatioAdjustment.mapping.md&title=%5BMapping+question%5D+StockClassConversionRatioAdjustment+%2F+object_type&property_path=object_type) |
| `date` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fadjustment%2FStockClassConversionRatioAdjustment.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fadjustment%2FStockClassConversionRatioAdjustment.mapping.md&title=%5BMapping+question%5D+StockClassConversionRatioAdjustment+%2F+date&property_path=date) |
| `stock_class_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fadjustment%2FStockClassConversionRatioAdjustment.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fadjustment%2FStockClassConversionRatioAdjustment.mapping.md&title=%5BMapping+question%5D+StockClassConversionRatioAdjustment+%2F+stock_class_id&property_path=stock_class_id) |
| `new_ratio_conversion_mechanism` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fadjustment%2FStockClassConversionRatioAdjustment.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fadjustment%2FStockClassConversionRatioAdjustment.mapping.md&title=%5BMapping+question%5D+StockClassConversionRatioAdjustment+%2F+new_ratio_conversion_mechanism&property_path=new_ratio_conversion_mechanism) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- Bucket: **n/a-object** (`ocf_kind: object`). This is an OCF *transaction* object, so it would normally map its properties onto the corresponding Carta transaction plus the security/state object it touches. The blocking fact is that **Carta has no adjustment transaction** of any kind: confirmed against the bundle, Carta's transaction surface is entirely security-level (`CertificateIssuance/CancellationTransaction`, the `Option`/`Warrant`/`Rsa`/`Rsu`/`Sar`/`Piu`/`Phantom`/`Convertible` issuance/exercise/cancellation/transfer families) — there is no `StockClassConversionRatioAdjustment`, no down-round/anti-dilution repricing event, and no generic "amend a share class" transaction. This matches the context note that Carta has no equivalent for OCF adjustment (authorized-shares/pool/**ratio**) transactions.
- Unlike its sibling `IssuerAuthorizedSharesAdjustment` (where Carta had nowhere to even store the *result*), this adjustment's economic *result* — the new conversion ratio and conversion price for the share class — **does** have a home in Carta state: `ShareClass.preferredShareClassDetails` → `PreferredShareClassDetails.rightsAndPreferences` → `ShareClassRightsAndPreferences.{conversionRatio (Decimal), conversionPrice (Money)}`. So the *event* is unmappable, but the *post-event share-class state* is partially mappable. The mapping therefore lands the economic payload on that rights-and-preferences structure (Carta records terms/state, not OCF's adjustment-event history).
- `stock_class_id` (required; FK to the OCF `StockClass` being repriced) → **rename** to `#/$defs/ShareClass/properties/id`. Carta identifies share classes by `ShareClass.id` (and as `shareClassId` foreign keys elsewhere); this is the class whose `rightsAndPreferences` the new ratio/price update. Caveat: Carta has no adjustment-transaction host, so in practice this FK selects *which* `ShareClass` to overwrite rather than naming a subject on a transaction record.
- `new_ratio_conversion_mechanism` (required; OCF `RatioConversionMechanism` carrying `ratio`, `conversion_price`, `rounding_type`, `type`) → **split** onto `#/$defs/ShareClassRightsAndPreferences/properties/conversionRatio` and `.../conversionPrice`, the two economic terms the context explicitly routes there ("a conversion ratio -> ShareClassRightsAndPreferences.conversionRatio"). Mapping details and losses:
    - `ratio` (OCF `Ratio` = `{numerator, denominator}` numeric pair) → `conversionRatio` (Carta `Decimal`). **Unit/shape transform required:** OCF expresses the ratio as a quotient of two numerics (e.g. numerator 2 / denominator 1 for a 2-for-1), whereas Carta wants a single scalar `Decimal`, so a consumer must compute `numerator / denominator`. The two-part structure (and the ability to represent it exactly as a fraction) is lossy once flattened to a decimal.
    - `conversion_price` (OCF `Monetary` = `{amount, currency}`) → `conversionPrice` (Carta `Money`). Money→Money is a clean per-field correspondence (`amount`→value, `currency`→currency code) per the `Monetary`→`Money` precedent.
    - `rounding_type` (OCF `RoundingType` enum: `CEILING` | `FLOOR` | `NORMAL`) is **dropped** — `ShareClassRightsAndPreferences` has no fractional-share rounding field, and Carta carries no rounding policy for conversions anywhere in the bundle. This is a genuine loss but does not by itself make the whole property unmappable.
    - `type` (const `RATIO_CONVERSION`) is OCF's mechanism discriminator with no Carta analogue; Carta does not record *which* conversion-mechanism family produced the ratio, only the resulting numeric terms. Dropped.
- Field-by-field justification for the unmappables:
    - `date` (OCF `Date`; when the repricing took effect): **no-equivalent**. With no host adjustment transaction in Carta there is no `*Datetime` slot to carry the event date, and `ShareClassRightsAndPreferences` is undated state — it records the *current* ratio/price, not *when* it changed. (Granularity aside: even given a host, OCF uses a calendar `Date` while Carta transaction timestamps are `Iso8601CompleteCalendarDateTime`.)
    - `id`, `comments`, `object_type`: **ocf-internal** OCF object scaffolding. `id` is OCF's identifier (Carta assigns its own server-side); `comments` has no Carta slot; `object_type` is OCF's discriminator constant (`TX_STOCK_CLASS_CONVERSION_RATIO_ADJUSTMENT`) — Carta types transactions positionally per endpoint and, in any case, has no adjustment transaction to remap it to, so `values` is `null`.
- Net: the conversion-ratio adjustment *event* (down-round repricing / anti-dilution mechanism) is not modeled by Carta, but its resulting economic terms (new conversion ratio + conversion price) are written through to the share class's `ShareClassRightsAndPreferences`; the rounding policy, mechanism type, the OCF `Ratio` two-part shape, the effective date, and the event identity are all lost.

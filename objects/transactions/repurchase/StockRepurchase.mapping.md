---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/repurchase/StockRepurchase.schema.json
ocf_object_type: TX_STOCK_REPURCHASE
ocf_title: Object - Stock Repurchase Transaction
ocf_kind: object
required_fields:
  - id
  - object_type
  - date
  - security_id
  - price
  - quantity
target_standard: Carta
target_version: "v1alpha1 (2026-04-30)"
status: complete
last_generated: 2026-05-18
---

# Object - Stock Repurchase Transaction → Carta

> Object describing a stock repurchase transaction

## OCF schema

Source: [`StockRepurchase.schema.json`](./StockRepurchase.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/repurchase/StockRepurchase.schema.json",
  "title": "Object - Stock Repurchase Transaction",
  "description": "Object describing a stock repurchase transaction",
  "type": "object",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/Object.schema.json"
    },
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/Transaction.schema.json"
    },
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/SecurityTransaction.schema.json"
    },
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/repurchase/Repurchase.schema.json"
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
      "const": "TX_STOCK_REPURCHASE"
    },
    "date": {
      "description": "Date on which the transaction occurred",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "security_id": {
      "description": "Identifier for the security (stock, plan security, warrant, or convertible) by which it can be referenced by other transaction objects. Note that while this identifier is created with an issuance object, it should be different than the issuance object's `id` field which identifies the issuance transaction object itself. All future transactions on the security (e.g. acceptance, transfer, cancel, etc.) must reference this `security_id` to qualify which security the transaction applies to.",
      "type": "string"
    },
    "price": {
      "description": "Repurchase price per share of the stock",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Monetary.schema.json"
    },
    "quantity": {
      "description": "Number of shares of stock repurchased",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Numeric.schema.json"
    },
    "consideration_text": {
      "description": "Unstructured text description of consideration provided in exchange for security repurchase",
      "type": "string"
    },
    "balance_security_id": {
      "description": "Identifier for the security that holds the remainder balance (for partial repurchases)",
      "type": "string"
    }
  },
  "additionalProperties": false,
  "required": [
    "id",
    "object_type",
    "date",
    "security_id",
    "price",
    "quantity"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/repurchase/StockRepurchase.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
# routing: route_by_property (downstream join). A StockRepurchase carries only
# security_id and NO discriminator, so the repurchased stock's family is undecidable
# from the record alone: it is resolved by joining security_id back to the
# StockIssuance and reading that issuance's issuance_type. Carta has no repurchase
# transaction at all, so the repurchase event is unmappable in both stock families
# (RSA / FOUNDERS_STOCK); only the remainder security's lineage (balance_security_id)
# round-trips. See docs/polymorphic-transaction-routing.md §2.2/§4.3.
status: complete

route_by_property:
  lookup_by:
    key: security_id
    through:
      mapping: ../issuance/StockIssuance.mapping.md
      on_property: issuance_type
  exhaustive: true

# shared: every source property. Carta has no repurchase transaction in either
# family, so the repurchase event fields are unmappable. The exception is
# balance_security_id: the partial-repurchase remainder is a stock security whose
# precededBy.securities records the repurchased-from security, so it carries a
# per-variant target map { Rsa / Default: pointer }.
shared:
  id:                  { kind: unmappable, target: null, reason: ocf-internal }
  comments:            { kind: unmappable, target: null, reason: no-equivalent }
  object_type:         { kind: unmappable, target: null, reason: ocf-internal }
  date:                { kind: unmappable, target: null, reason: no-equivalent }
  security_id:         { kind: unmappable, target: null, reason: ocf-internal }
  price:               { kind: unmappable, target: null, reason: no-equivalent }
  quantity:            { kind: unmappable, target: null, reason: no-equivalent }
  consideration_text:  { kind: unmappable, target: null, reason: no-equivalent }
  balance_security_id:
    kind: computed                 # lineage: the post-repurchase remainder security precededBy
    target:
      Rsa:     "#/$defs/RestrictedStockAwardPrecededBy/properties/securities"
      Default: "#/$defs/CertificatePrecededBy/properties/securities"

variants:

  Rsa:
    when: [RSA]
    primary_targets: null
    fields: {}

  Default:
    when: [FOUNDERS_STOCK]
    primary_targets: null
    fields: {}

 ```

## Ask a mapping question

Use a link below to open a prefilled GitHub issue. The issue can be copied into the auditable checklist in `## Notes / open questions`.

<details>
<summary>Open a prefilled issue for a property</summary>

<!-- mapping-question-links:start -->
| Source property | Action |
| --- | --- |
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Frepurchase%2FStockRepurchase.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Frepurchase%2FStockRepurchase.mapping.md&title=%5BMapping+question%5D+StockRepurchase) |
| `id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Frepurchase%2FStockRepurchase.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Frepurchase%2FStockRepurchase.mapping.md&title=%5BMapping+question%5D+StockRepurchase%3A+id&property_path=id) |
| `comments` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Frepurchase%2FStockRepurchase.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Frepurchase%2FStockRepurchase.mapping.md&title=%5BMapping+question%5D+StockRepurchase%3A+comments&property_path=comments) |
| `object_type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Frepurchase%2FStockRepurchase.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Frepurchase%2FStockRepurchase.mapping.md&title=%5BMapping+question%5D+StockRepurchase%3A+object_type&property_path=object_type) |
| `date` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Frepurchase%2FStockRepurchase.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Frepurchase%2FStockRepurchase.mapping.md&title=%5BMapping+question%5D+StockRepurchase%3A+date&property_path=date) |
| `security_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Frepurchase%2FStockRepurchase.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Frepurchase%2FStockRepurchase.mapping.md&title=%5BMapping+question%5D+StockRepurchase%3A+security_id&property_path=security_id) |
| `price` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Frepurchase%2FStockRepurchase.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Frepurchase%2FStockRepurchase.mapping.md&title=%5BMapping+question%5D+StockRepurchase%3A+price&property_path=price) |
| `quantity` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Frepurchase%2FStockRepurchase.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Frepurchase%2FStockRepurchase.mapping.md&title=%5BMapping+question%5D+StockRepurchase%3A+quantity&property_path=quantity) |
| `consideration_text` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Frepurchase%2FStockRepurchase.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Frepurchase%2FStockRepurchase.mapping.md&title=%5BMapping+question%5D+StockRepurchase%3A+consideration_text&property_path=consideration_text) |
| `balance_security_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Frepurchase%2FStockRepurchase.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Frepurchase%2FStockRepurchase.mapping.md&title=%5BMapping+question%5D+StockRepurchase%3A+balance_security_id&property_path=balance_security_id) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- **Join-dependent (downstream), and unmappable in every family.** A `StockRepurchase`
  carries no discriminator — only `security_id` — so the repurchased stock's family
  (`RSA` vs `FOUNDERS_STOCK`) is undecidable from the record alone. An importer must
  resolve `issuance_type` from the joined `StockIssuance` first (the two-pass
  requirement, docs/polymorphic-transaction-routing.md §2.2), which is why this is a
  `route_by_property` mapping rather than a plain single-target one. The routing here
  is structurally honest: **Carta has no repurchase transaction in either family**, so
  both variants have `primary_targets: null` and the repurchase *event* itself
  (`date` / `price` / `quantity` / `consideration_text`) stays `unmappable`. The one
  exception is `balance_security_id` — the remainder security after a partial
  repurchase is an ordinary stock security whose lineage *does* round-trip (see below).
- **No Carta repurchase verb exists.** Carta's transaction surface has no
  `RepurchaseTransaction` and no repurchase `$def` on the `RestrictedStockAward` or the
  plain `Certificate` family; a buyback is not representable as its own Carta event.
  (A repurchase *could* be approximated as a `CertificateCancellationTransaction` with
  the `CERTIFICATE_CANCELLATION_REASON_REPURCHASED` reason, but that is a
  family-agnostic certificate cancellation, not a per-family route off the repurchased
  security, so it is not a faithful target for this routed object — see the open
  question below.) Because the entire family is unmappable, every field — including the
  ones that would have homes on a cancellation tx (`date`, `quantity`) — is
  `no-equivalent` here.
- **`security_id`** is the join key (`route_by_property.lookup_by.key`); it routes the family by
  joining back to the issuance, it is not itself a stored Carta field, so it is
  `ocf-internal`.
- **`price` / `consideration_text` have no home.** OCF records the repurchase price
  *per share* (`Monetary`) and a free-text `consideration_text`; Carta has no
  per-family repurchase property for the money paid in a buyback or for free-form
  consideration, so both are `no-equivalent`. (Even the cancellation-tx approximation
  carries no `Money` slot.)
- **`date` / `quantity`** describe when the buyback happened and how many shares were
  repurchased. Neither stock family exposes a repurchase event to land them on, so both
  are `no-equivalent` rather than renames.
- **`balance_security_id` → lineage on the remainder security** (kind `computed`).
  After a *partial* repurchase the un-repurchased shares live on a remainder security,
  and in both stock families that remainder is itself a Carta stock security — an
  `RestrictedStockAward` for `Rsa`, a plain `Certificate` for `Default` — each of which
  carries a `precededBy.securities` array (`RestrictedStockAwardPrecededBy` /
  `CertificatePrecededBy`). The importer writes the repurchased-from `security_id` into
  that remainder security's `precededBy.securities`, so this reverse lineage edge
  round-trips **losslessly** even though the repurchase event has no Carta home. It is
  `computed` (importer-derived placement onto the remainder security the repurchase
  *references*), not a `rename`, and lands per family via a per-variant target map.
- **`id`, `comments`, `object_type`.** Standard OCF object scaffolding: `id` and
  `object_type` are `ocf-internal` (Carta assigns ids; the routed object type is the
  join's concern, not a stored field), and `comments` has no Carta slot
  (`no-equivalent`).
- Open question / round-trip: since neither family can record the repurchase, an
  OCF→Carta→OCF round-trip recovers nothing of a `StockRepurchase`. If buybacks must
  survive, the export convention "materialise a repurchase as a
  `CERTIFICATE_CANCELLATION_REASON_REPURCHASED` certificate cancellation" (and read it
  back as a repurchase) would have to live in the tooling — it is not a per-family
  schema target and so is out of scope for this routed mapping. See
  docs/polymorphic-transaction-routing.md §4.3.

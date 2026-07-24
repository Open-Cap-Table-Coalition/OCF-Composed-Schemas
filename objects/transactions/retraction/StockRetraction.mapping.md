---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/retraction/StockRetraction.schema.json
ocf_object_type: TX_STOCK_RETRACTION
ocf_title: Object - Stock Retraction Transaction
ocf_kind: object
required_fields:
  - id
  - object_type
  - date
  - security_id
  - reason_text
target_standard: Carta
target_version: "v1alpha1 (2026-04-30)"
status: complete
last_generated: 2026-05-18
---

# Object - Stock Retraction Transaction → Carta

> Object describing a retraction of a stock security

## OCF schema

Source: [`StockRetraction.schema.json`](./StockRetraction.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/retraction/StockRetraction.schema.json",
  "title": "Object - Stock Retraction Transaction",
  "description": "Object describing a retraction of a stock security",
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
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/retraction/Retraction.schema.json"
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
      "const": "TX_STOCK_RETRACTION"
    },
    "date": {
      "description": "Date on which the transaction occurred",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "security_id": {
      "description": "Identifier for the security (stock, plan security, warrant, or convertible) by which it can be referenced by other transaction objects. Note that while this identifier is created with an issuance object, it should be different than the issuance object's `id` field which identifies the issuance transaction object itself. All future transactions on the security (e.g. acceptance, transfer, cancel, etc.) must reference this `security_id` to qualify which security the transaction applies to.",
      "type": "string"
    },
    "reason_text": {
      "description": "Reason for the retraction",
      "type": "string"
    }
  },
  "additionalProperties": false,
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/retraction/StockRetraction.schema.json",
  "required": [
    "id",
    "object_type",
    "date",
    "security_id",
    "reason_text"
  ]
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
# routing: route_by_property (downstream join). This retraction carries only
# security_id and NO discriminator, so the stock family (RSA vs founders/plain
# certificate) is undecidable from the record alone: it is resolved by joining
# security_id back to the StockIssuance and reading that issuance's issuance_type.
# Both families resolve to the SAME conclusion here — Carta has no retraction
# transaction in any stock family — so every variant is all-unmappable.
# See docs/polymorphic-transaction-routing.md §2.2/§4.3.
status: complete

route_by_property:
  lookup_by:
    key: security_id
    through:
      mapping: ../issuance/StockIssuance.mapping.md
      on_property: issuance_type
  exhaustive: true

# shared: every source property. All six are unmappable in BOTH families (there is
# no Carta retraction transaction to land on), so none needs a per-variant target
# map — each is a plain { kind: unmappable, target: null }.
shared:
  id:          { kind: unmappable, target: null, reason: ocf-internal }
  comments:    { kind: unmappable, target: null, reason: no-equivalent }
  object_type: { kind: unmappable, target: null, reason: ocf-internal }
  date:        { kind: unmappable, target: null, reason: no-equivalent }
  security_id: { kind: unmappable, target: null, reason: ocf-internal }
  reason_text: { kind: unmappable, target: null, reason: no-equivalent }

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
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fretraction%2FStockRetraction.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fretraction%2FStockRetraction.mapping.md&title=%5BMapping+question%5D+StockRetraction) |
| `id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fretraction%2FStockRetraction.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fretraction%2FStockRetraction.mapping.md&title=%5BMapping+question%5D+StockRetraction%3A+id&property_path=id) |
| `comments` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fretraction%2FStockRetraction.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fretraction%2FStockRetraction.mapping.md&title=%5BMapping+question%5D+StockRetraction%3A+comments&property_path=comments) |
| `object_type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fretraction%2FStockRetraction.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fretraction%2FStockRetraction.mapping.md&title=%5BMapping+question%5D+StockRetraction%3A+object_type&property_path=object_type) |
| `date` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fretraction%2FStockRetraction.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fretraction%2FStockRetraction.mapping.md&title=%5BMapping+question%5D+StockRetraction%3A+date&property_path=date) |
| `security_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fretraction%2FStockRetraction.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fretraction%2FStockRetraction.mapping.md&title=%5BMapping+question%5D+StockRetraction%3A+security_id&property_path=security_id) |
| `reason_text` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fretraction%2FStockRetraction.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fretraction%2FStockRetraction.mapping.md&title=%5BMapping+question%5D+StockRetraction%3A+reason_text&property_path=reason_text) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- **Join-dependent (downstream), but all routes converge.** One OCF `StockRetraction`
  carries no discriminator, only `security_id`, so the stock family is fixed at
  issuance and recovered by joining `security_id` back to the `StockIssuance` and
  reading its `issuance_type` (`RSA` → `Rsa`; `FOUNDERS_STOCK` / absent → `Default`) —
  the two-pass requirement, see [`docs/polymorphic-transaction-routing.md`](../../../docs/polymorphic-transaction-routing.md) §2.2. Unlike a cancellation,
  every family resolves to the same answer here: **Carta has no retraction
  transaction in any stock family**, so `primary_targets` is `null` for both variants
  and there are no mappable fields.
- **Carta has no retraction transaction.** Carta's stock-transaction surface is the
  `Certificate*Transaction` family (`CertificateIssuanceTransaction`,
  `CertificateCancellationTransaction`) plus the RSA variants; none models a
  retraction. A retraction (`primitives/objects/transactions/retraction/Retraction.schema.json`,
  composed here via `allOf`) *withdraws a previously-recorded transaction* — a
  data-correction/reversal against the ledger — whereas a cancellation is a real
  corporate event that retires an outstanding security. Carta records only resulting
  ledger state, not OCF's transaction-by-transaction event log with reversals, so a
  retraction is dropped entirely on import; the faithful behavior is *not replaying*
  the retracted transaction in the first place.
- Per-field justification (all six unmappable in both families):
    - `security_id`: the `route_by_property.lookup_by.key` join key. It routes the family back to
      the issuance; it is not itself a stored Carta field on any retraction tx (none
      exists). `ocf-internal`.
    - `reason_text`: free-text reason for the retraction. Carta has no free-text reason
      field on any transaction — the only `reason`-named fields are closed enums
      (`CertificateCancellationReason`, etc.) scoped to cancellation semantics — so
      free-text → enum is unmappable, not a rename. `no-equivalent`.
    - `object_type` (const `TX_STOCK_RETRACTION`): OCF scaffolding identifying the
      transaction concept; Carta assigns transaction kinds structurally and has no
      retraction transaction onto which to remap it. `ocf-internal`.
    - `date`: OCF records the calendar date the retraction took effect; with no Carta
      retraction transaction there is no `effectiveDatetime`-style slot to carry it
      (and note the date-vs-datetime granularity gap). `no-equivalent`.
    - `id`, `comments`: OCF object scaffolding — `id` is OCF's own identifier (Carta
      assigns identifiers server-side) and `comments` has no Carta slot. `ocf-internal`
      / `no-equivalent`.
- Consistency: the sibling retraction transactions (`ConvertibleRetraction`,
  `EquityCompensationRetraction`, `PlanSecurityRetraction`, `WarrantRetraction`) share
  the identical 6-field shape and the same "Carta has no retraction" conclusion, so all
  five should route all-unmappable in the same way.

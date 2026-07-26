---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/cancellation/ConvertibleCancellation.schema.json
ocf_object_type: TX_CONVERTIBLE_CANCELLATION
ocf_title: Object - Convertible Cancellation Transaction
ocf_kind: object
required_fields:
  - amount
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

# Object - Convertible Cancellation Transaction → Carta

> Object describing a cancellation of a convertible security

## OCF schema

Source: [`ConvertibleCancellation.schema.json`](./ConvertibleCancellation.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/cancellation/ConvertibleCancellation.schema.json",
  "title": "Object - Convertible Cancellation Transaction",
  "description": "Object describing a cancellation of a convertible security",
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
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/cancellation/Cancellation.schema.json"
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
      "const": "TX_CONVERTIBLE_CANCELLATION"
    },
    "date": {
      "description": "Date on which the transaction occurred",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "security_id": {
      "description": "Identifier for the security (stock, plan security, warrant, or convertible) by which it can be referenced by other transaction objects. Note that while this identifier is created with an issuance object, it should be different than the issuance object's `id` field which identifies the issuance transaction object itself. All future transactions on the security (e.g. acceptance, transfer, cancel, etc.) must reference this `security_id` to qualify which security the transaction applies to.",
      "type": "string"
    },
    "balance_security_id": {
      "description": "Identifier for the security that holds the remainder balance (for partial cancellations)",
      "type": "string"
    },
    "reason_text": {
      "description": "Reason for the cancellation",
      "type": "string"
    },
    "amount": {
      "description": "Amount of monetary value cancelled",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Monetary.schema.json"
    }
  },
  "additionalProperties": false,
  "required": [
    "amount",
    "id",
    "object_type",
    "date",
    "security_id",
    "reason_text"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/cancellation/ConvertibleCancellation.schema.json"
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
      TX_CONVERTIBLE_CANCELLATION: null
  date:
    kind: rename
    target:
      - "#/$defs/ConvertibleCancellationTransaction/properties/effectiveDatetime"
      - "#/$defs/ConvertibleNote/properties/canceledDatetime"
  security_id:
    kind: rename
    target: "#/$defs/ConvertibleTransactionItem/properties/securityId"
  balance_security_id:
    kind: unmappable
    target: null
    reason: no-equivalent
  reason_text:
    kind: computed
    target: "#/$defs/ConvertibleCancellationTransaction/properties/reason"
  amount:
    kind: rename
    target: "#/$defs/ConvertibleCancellationTransaction/properties/principal"
```

## Ask a mapping question

Use a link below to open a prefilled GitHub issue. The issue can be copied into the auditable checklist in `## Notes / open questions`.

<details>
<summary>Open a prefilled issue for a property</summary>

<!-- mapping-question-links:start -->
| Source property | Action |
| --- | --- |
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fcancellation%2FConvertibleCancellation.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fcancellation%2FConvertibleCancellation.mapping.md&title=%5BMapping+question%5D+ConvertibleCancellation) |
| `id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fcancellation%2FConvertibleCancellation.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fcancellation%2FConvertibleCancellation.mapping.md&title=%5BMapping+question%5D+ConvertibleCancellation%3A+id&property_path=id) |
| `comments` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fcancellation%2FConvertibleCancellation.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fcancellation%2FConvertibleCancellation.mapping.md&title=%5BMapping+question%5D+ConvertibleCancellation%3A+comments&property_path=comments) |
| `object_type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fcancellation%2FConvertibleCancellation.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fcancellation%2FConvertibleCancellation.mapping.md&title=%5BMapping+question%5D+ConvertibleCancellation%3A+object_type&property_path=object_type) |
| `date` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fcancellation%2FConvertibleCancellation.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fcancellation%2FConvertibleCancellation.mapping.md&title=%5BMapping+question%5D+ConvertibleCancellation%3A+date&property_path=date) |
| `security_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fcancellation%2FConvertibleCancellation.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fcancellation%2FConvertibleCancellation.mapping.md&title=%5BMapping+question%5D+ConvertibleCancellation%3A+security_id&property_path=security_id) |
| `balance_security_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fcancellation%2FConvertibleCancellation.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fcancellation%2FConvertibleCancellation.mapping.md&title=%5BMapping+question%5D+ConvertibleCancellation%3A+balance_security_id&property_path=balance_security_id) |
| `reason_text` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fcancellation%2FConvertibleCancellation.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fcancellation%2FConvertibleCancellation.mapping.md&title=%5BMapping+question%5D+ConvertibleCancellation%3A+reason_text&property_path=reason_text) |
| `amount` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fcancellation%2FConvertibleCancellation.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fcancellation%2FConvertibleCancellation.mapping.md&title=%5BMapping+question%5D+ConvertibleCancellation%3A+amount&property_path=amount) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- This is an OCF transaction object (`ocf_kind: object`), so it is `n/a-object`: its own properties map directly to fields of the corresponding Carta object, `#/$defs/ConvertibleCancellationTransaction` ("A cancellation transaction for a convertible note."). That Carta transaction object is intentionally minimal — it exposes only three properties: `effectiveDatetime`, `reason`, and `principal`. The convertible reference is supplied not by the transaction object but by its enclosing `#/$defs/ConvertibleTransactionItem` (which groups a note's issuance + cancellations and carries `securityId`), so OCF's `security_id` lands there; the rest of OCF's transaction scaffolding and bookkeeping has no home.
- `date` → `effectiveDatetime` and `ConvertibleNote.canceledDatetime` (rename). The transaction timestamp records when the cancellation occurred, while the note-level timestamp records when the holding was canceled. Granularity differs: OCF `date` is a calendar **date** (`types/Date.schema.json`, `YYYY-MM-DD`), while Carta's datetime fields are `#/$defs/Iso8601CompleteCalendarDateTime` (full date-times). Loading OCF into Carta requires widening the date to a datetime (e.g. midnight UTC on the OCF date); reading Carta back into OCF requires truncating to the date. Same date↔datetime caveat applies to every OCF transaction.
- `amount` → `ConvertibleCancellationTransaction.principal` (rename). OCF `amount` is `types/Monetary.schema.json` and Carta `principal` is `#/$defs/Money`; both carry an amount + currency. For a full cancellation these coincide with the note principal; for a partial cancellation the value is a cancellation delta, so the principal interpretation remains approximate. It does not populate the note-level `cashPaid`: that field is the issuance cash amount and is sourced from `ConvertibleIssuance.investment_amount`.
- `reason_text` → `reason` (computed, lossy). OCF `reason_text` is **free text** ("Reason for the cancellation"); Carta `reason` is the closed 2-value enum `#/$defs/ConvertibleCancellationReason` = {`CONVERTIBLE_CANCELLATION_REASON_CANCELED`, `CONVERTIBLE_CANCELLATION_REASON_CONVERTED`}. Because the OCF property is not itself an enum, this is not a clean `enum-remap`; it requires classifying the free-text reason into one of Carta's two buckets (and the original prose is dropped). Default to `..._CANCELED` unless the text clearly indicates a conversion to equity, in which case use `..._CONVERTED`. Conversion is interesting here: in OCF a convertible that converts is typically modelled with a `TX_CONVERTIBLE_CANCELLATION` (cancelling the note) alongside the resulting issuance, so the `..._CONVERTED` value is reachable; whether OCF data populates `reason_text` with enough signal to pick it is a per-dataset question.
- `security_id` → `#/$defs/ConvertibleTransactionItem/properties/securityId` (rename). OCF `security_id` is the foreign key identifying the convertible the cancellation acts on ("Identifier for the security ... by which it can be referenced by other transaction objects"). The Carta `ConvertibleCancellationTransaction` `$def` itself carries no security reference (it exposes only `effectiveDatetime`, `reason`, `principal`), but Carta does not orphan the cancellation: `#/$defs/ConvertibleTransactionItem` ("A convertible note with its full transaction history. Groups all lifecycle events (issuance, cancellation) for a single convertible note.") holds the cancellations in its `cancellations` array and carries the `securityId` ("The identifier of the convertible note") that links the whole item — including each cancellation — to its convertible. That `ConvertibleTransactionItem.securityId` is the precise home for OCF's `security_id`, exactly paralleling `StockCancellation` → `#/$defs/CertificateTransactionItem/properties/securityId` and `EquityCompensationCancellation` → `#/$defs/OptionGrant/properties/securityId`. (The same UUID also appears on `#/$defs/ConvertibleNote/properties/securityId`; the transaction-item link is chosen as the closer, per-transaction-grouping analogue.) `WarrantCancellation` differs only because Carta's warrant lifecycle is modelled without an equivalent transaction-item grouping in this snapshot, so its `security_id` stays unmappable.
- `balance_security_id` → unmappable / `no-equivalent`. This OCF field names the new security that holds the remainder balance after a **partial** cancellation. Carta's cancellation transaction models neither partial-balance splitting nor a pointer to a successor security, so there is no field for it.
- `id`, `comments`, `object_type` → unmappable / `ocf-internal`. These are OCF object scaffolding: `id` is OCF's internal object identifier, `comments` is free-form annotation, and `object_type` is the discriminant const `TX_CONVERTIBLE_CANCELLATION` (Carta encodes the transaction kind by *which* `$def` is used, not by a stored value). The single `object_type` value `TX_CONVERTIBLE_CANCELLATION` maps to `null` for the same reason. This matches the `objects/Issuer.mapping.md` precedent for `id`/`comments`/`object_type`.
- Net mapping: all three Carta `ConvertibleCancellationTransaction` fields have an OCF source — `effectiveDatetime` ← `date`, `principal` ← `amount`, `reason` ← `reason_text` (lossy) — while the cancellation date populates `ConvertibleNote.canceledDatetime`; the note's `cashPaid` comes from issuance `investment_amount`. `security_id` lands on the enclosing `#/$defs/ConvertibleTransactionItem/properties/securityId`. The remaining unmapped OCF fields are either internal scaffolding (`id`, `comments`, `object_type`) or partial-balance/successor-security data (`balance_security_id`) Carta does not record here.

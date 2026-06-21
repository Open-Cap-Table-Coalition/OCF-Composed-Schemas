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
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: complete
coverage: 9/9

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
    kind: enum-remap
    target: "#/$defs/CertificateCancellationTransaction/properties/reason"
    values:
      TX_STOCK_REPURCHASE: CERTIFICATE_CANCELLATION_REASON_REPURCHASED
  date:
    kind: rename
    target: "#/$defs/CertificateCancellationTransaction/properties/effectiveDatetime"
  security_id:
    kind: rename
    target: "#/$defs/CertificateTransactionItem/properties/securityId"
  price:
    kind: unmappable
    target: null
    reason: no-equivalent
  quantity:
    kind: rename
    target: "#/$defs/CertificateCancellationTransaction/properties/quantity"
  consideration_text:
    kind: unmappable
    target: null
    reason: no-equivalent
  balance_security_id:
    kind: unmappable
    target: null
    reason: no-equivalent
```

## Notes / open questions

- **Carta has no dedicated stock-repurchase transaction; a repurchase is recorded as a certificate *cancellation* tagged with the `REPURCHASED` reason.** OCF models a buyback as a first-class transaction object (`TX_STOCK_REPURCHASE`) carrying a repurchase price-per-share and consideration. Carta's transaction surface has no `RepurchaseTransaction` and no repurchase `$def`; instead `CertificateTransactionItem` groups exactly two lifecycle events (`issuance` + `cancellations[]`), and a repurchase is materialised as a `CertificateCancellationTransaction` whose `reason` is `CertificateCancellationReason.CERTIFICATE_CANCELLATION_REASON_REPURCHASED` ("The certificate shares were repurchased by the issuer."). So the *event* has a home (the cancellation record), but its *economic* fields (price, consideration) do not — Carta's cancellation transaction records only datetime/reason/quantity/termination-forfeiture datetimes, no money. This object is `ocf_kind: object`, so the 3-bucket type policy does not apply; an OCF transaction maps to its corresponding Carta transaction, which here is the repurchase-reasoned certificate cancellation. The fields that have a genuine home are mapped; the price/consideration/balance fields are `no-equivalent`.
- `date` → `CertificateCancellationTransaction.effectiveDatetime`. OCF's repurchase `date` is the date the buyback occurred; in Carta the buyback is the cancellation of the repurchased certificate, whose `effectiveDatetime` is that date. **Date-vs-datetime granularity gap:** OCF `date` is a calendar `Date` (`YYYY-MM-DD`, `types/Date.schema.json`) while `effectiveDatetime` is `Iso8601CompleteCalendarDateTime`, so a (UTC) time-of-day must be synthesised on export and is dropped on import.
- `security_id` → `CertificateTransactionItem.securityId`. OCF `security_id` identifies the stock security being repurchased. Carta keys the cancellation to a certificate via its enclosing `CertificateTransactionItem.securityId` ("The identifier of the certificate"); the `CertificateCancellationTransaction` itself carries no security reference, so the item-level `securityId` is the queryable home for the repurchased-security link. (For a *partial* repurchase, OCF leaves the surviving balance on a separate `balance_security_id`; see below.)
- `quantity` → `CertificateCancellationTransaction.quantity`. OCF's `quantity` is the number of shares repurchased; the Carta cancellation `quantity` (`Decimal`) is the number of shares removed from the certificate by the repurchase. Type note: OCF `Numeric` → Carta `Decimal`; both are arbitrary-precision decimal strings, no transform. For a full repurchase this equals the certificate's outstanding quantity; for a partial repurchase it is the repurchased slice and the remainder is a separate certificate (see `balance_security_id`).
- `price` → unmappable / `no-equivalent`. OCF records the repurchase price *per share* as a `Monetary` (`{amount, currency}` → would map to Carta `Money` if a target existed). But Carta's `CertificateCancellationTransaction` has **no price/`Money` field at all** — it stores only datetime/reason/quantity/termination data. `Certificate.pricePerShare` (`Money`) exists, but it is the *issuance* price the certificate was originally bought at, not the price the issuer pays to buy the shares back; routing the repurchase price there would overwrite/contradict the issue price. There is no Carta property for the consideration paid in a buyback, so the repurchase price has no home.
- `consideration_text` → unmappable / `no-equivalent`. Free-form description of the consideration given for the repurchase. Carta has no general per-transaction notes/consideration field, and the cancellation transaction carries no such slot, so this is `no-equivalent`.
- `balance_security_id` → unmappable / `no-equivalent`. For a *partial* repurchase OCF points at the security holding the unrepurchased remainder. Carta has no remainder/split linkage on `CertificateCancellationTransaction` or `Certificate`: a partial repurchase would appear as a cancellation of part of the certificate, leaving (or re-issuing) the balance as its own certificate, with no Carta property tying the cancellation to "the certificate holding the leftover balance." This is consistent with the `balance_security_id` treatment on the completed `StockConversion`/`ConvertibleConversion` mappings — Carta records no balance-security back-reference for any partial event.
- `object_type` → **enum-remap** → `CertificateCancellationTransaction.reason`, with `TX_STOCK_REPURCHASE` → `CERTIFICATE_CANCELLATION_REASON_REPURCHASED`. This is the field that carries the "this was a repurchase" signal across the boundary. Carta has **no repurchase transaction type**; instead a repurchase is materialised as a `CertificateCancellationTransaction` whose `reason` is the `CERTIFICATE_CANCELLATION_REASON_REPURCHASED` member of `CertificateCancellationReason` ("The certificate shares were repurchased by the issuer."). Because the OCF discriminator `const` resolves to a single source value and the Carta `reason` enum has a member that means exactly "repurchased", the OCF object-type constant has a genuine, semantically-precise home — so it is mapped rather than dropped as `ocf-internal`. (This diverges deliberately from the `TX_STOCK_CONVERSION → null` treatment in `StockConversion`: there the conversion is modelled on the *issuance* side of a new certificate and the cancellation `reason` is not the destination, whereas here the entire event **is** the cancellation, so its `reason` member is the correct target.)
- `id`, `comments` → unmappable / `ocf-internal`. Standard OCF object scaffolding. `id` is OCF's own object identifier (Carta assigns server-side ids); `comments` has no Carta slot. Both are OCF-internal and have no Carta target.
- Open question / round-trip: because Carta reconstructs a repurchase from a certificate cancellation carrying the `REPURCHASED` reason — and drops the repurchase price and consideration entirely — an OCF→Carta→OCF round-trip cannot recover the original `TX_STOCK_REPURCHASE` price/`consideration_text`/`balance_security_id`. Recovering even the *event* requires the convention "treat a `CERTIFICATE_CANCELLATION_REASON_REPURCHASED` cancellation as a repurchase." This pairing/identity convention and the lost economics are export-tooling concerns, not expressible in the schema.

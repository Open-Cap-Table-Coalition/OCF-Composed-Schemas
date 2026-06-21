---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/reissuance/StockReissuance.schema.json
ocf_object_type: TX_STOCK_REISSUANCE
ocf_title: Object - Stock Re-issuance Transaction
ocf_kind: object
required_fields:
  - id
  - object_type
  - date
  - security_id
  - resulting_security_ids
target_standard: Carta
target_version: "v1alpha1 (2026-04-30)"
status: complete
last_generated: 2026-05-18
---

# Object - Stock Re-issuance Transaction → Carta

> Object describing a re-issuance of stock

## OCF schema

Source: [`StockReissuance.schema.json`](./StockReissuance.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/reissuance/StockReissuance.schema.json",
  "title": "Object - Stock Re-issuance Transaction",
  "description": "Object describing a re-issuance of stock",
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
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/reissuance/Reissuance.schema.json"
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
      "const": "TX_STOCK_REISSUANCE"
    },
    "date": {
      "description": "Date on which the transaction occurred",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "security_id": {
      "description": "Identifier for the security (stock, plan security, warrant, or convertible) by which it can be referenced by other transaction objects. Note that while this identifier is created with an issuance object, it should be different than the issuance object's `id` field which identifies the issuance transaction object itself. All future transactions on the security (e.g. acceptance, transfer, cancel, etc.) must reference this `security_id` to qualify which security the transaction applies to.",
      "type": "string"
    },
    "resulting_security_ids": {
      "title": "Security Reissuance - Resulting Security ID Array",
      "description": "Identifier of the new security (or securities) issuance resulting from a reissuance",
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "split_transaction_id": {
      "title": "Id of stock class split transaction",
      "description": "When stock is reissued as a result of a stock split, this field contains id of the respective stock class split transaction. It is not set otherwise.",
      "type": "string"
    },
    "reason_text": {
      "title": "Reason for stock reissuance",
      "description": "Free-form human-readable reason for stock reissuance",
      "type": "string"
    }
  },
  "additionalProperties": false,
  "required": [
    "id",
    "object_type",
    "date",
    "security_id",
    "resulting_security_ids"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/reissuance/StockReissuance.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: complete
coverage: 8/8

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
      TX_STOCK_REISSUANCE: null
  date:
    kind: rename
    target: "#/$defs/CertificateIssuanceTransaction/properties/issueDatetime"
  security_id:
    kind: rename
    target: "#/$defs/CertificateIssuanceTransaction/properties/precededBySecurityId"
  resulting_security_ids:
    kind: rename
    target: "#/$defs/Certificate/properties/securityId"
  split_transaction_id:
    kind: unmappable
    target: null
    reason: no-equivalent
  reason_text:
    kind: unmappable
    target: null
    reason: no-equivalent
```

## Notes / open questions

- **Carta DOES model balance reissuance — as a re-issued certificate carrying the `BALANCE_REISSUED` provenance reason, not as a standalone "reissuance transaction."** OCF's `TX_STOCK_REISSUANCE` records the replacement of one existing stock position (`security_id`) with one or more newly-issued positions (`resulting_security_ids`) — a balance-housekeeping event (e.g. re-lotting the remainder of a partially-transacted certificate) with no net economic change to the cap table. Carta materialises exactly this concept as an ordinary `CertificateIssuanceTransaction` whose resulting `Certificate.precededBy.reason` is `CertificatePrecededByReason.CERTIFICATE_PRECEDED_BY_REASON_BALANCE_REISSUED`, described in the bundle verbatim as *"The certificate was issued representing the remainder of a certificate that had been partially transacted."* (For restricted stock the same concept exists as `RestrictedStockAwardPrecededByReason.RESTRICTED_STOCK_AWARD_PRECEDED_BY_REASON_BALANCE_REISSUED`.) So a reissuance is not unmappable: each resulting (replacement) security is a Carta `Certificate` issued via a `CertificateIssuanceTransaction`, with the retired source position recorded as that issuance's `precededBySecurityId`. This is the same fan-out pattern as the sibling `StockConversion` mapping, which Carta reconstructs from the `SHARE_CLASS_CONVERTED` / `BALANCE_REISSUED` reason codes. (This object is `ocf_kind: object`, so the 3-bucket *type* policy does not apply; an OCF transaction maps to its corresponding Carta transaction(s) and the security objects they reference.)
- `date` → `CertificateIssuanceTransaction.issueDatetime`. The reissuance date is the date the replacement certificate is issued, which Carta carries as the issuance transaction's `issueDatetime`. **Date-vs-datetime:** OCF `date` is a calendar `Date` (`types/Date.schema.json`, `YYYY-MM-DD`, = `Iso8601CompleteCalendarDate`) while `issueDatetime` is `Iso8601CompleteCalendarDateTime`, so a (UTC) time-of-day is synthesised on export and dropped on import. Pointed at the issuance side because that is where `precededBySecurityId` (the source-security link) also lives, keeping the date and the provenance link on one record.
- `security_id` → `CertificateIssuanceTransaction.precededBySecurityId`. OCF `security_id` is the source stock position being retired and replaced. Carta records that predecessor on the resulting certificate's issuance transaction as `precededBySecurityId` (*"the identifier of the security that preceded this certificate"*), paired with the `BALANCE_REISSUED` preceded-by reason. This is the explicit, queryable home for the predecessor reference; the full predecessor list is also mirrored structurally on `Certificate.precededBy.securities[]` (`PrecededBySecurity.id`), but `precededBySecurityId` is the single scalar slot Carta exposes on the issuance event itself.
- `resulting_security_ids` → `Certificate/properties/securityId`. OCF allows a reissuance to fan out into *one or more* resulting securities (array). Each resulting security in Carta is a `Certificate`, identified by `Certificate.securityId`. This is an **array→scalar fan-out**: OCF's single array maps to one `securityId` per re-issued certificate; Carta has no single field holding the *set* of resulting securities for a reissuance, so a reissuance producing N lots becomes N Carta `CertificateIssuanceTransaction`s, each carrying its own `precededBySecurityId` back to the same source and each resulting `Certificate.precededBy.reason = BALANCE_REISSUED`. (Note: `Certificate.precededBy` / `PrecededBySecurity.id` holds the *predecessor* security id, not the resulting certificate's own id, so `securityId` — not `precededBy` — is the correct home for the *resulting* security ids.) The same-named singular `resultingSecurityId` on `OptionExerciseTransaction` / `RsuSettlementTransaction` / `SarExerciseTransaction` / `WarrantExerciseTransaction` / `WarrantTransferTransaction` is **deliberately not used**: it means "the single security produced when a *derivative* is exercised/settled/transferred," which would assert an exercise/settlement/transfer that did not occur (and is singular, dropping all but one resulting lot). The resulting-stock home is the `Certificate` itself, exactly as in the `StockConversion` precedent.
- `split_transaction_id` — unmappable / `no-equivalent`. When the reissuance is the consequence of a stock-class split, OCF back-references the originating `TX_STOCK_CLASS_SPLIT` here. Carta has no stock-split transaction at all and no preceded-by reason for a split (the `CertificatePrecededByReason` set is share-reserve / option-exercised / RSU-settled / debt-converted / warrant-exercised / share-class-converted / transferred / balance-reissued — there is no `..._SPLIT` member), so this cross-transaction link to a non-existent Carta split transaction has no representable endpoint. The reissuance itself still maps (via `BALANCE_REISSUED`); only the *back-pointer to the split that caused it* is lost. (The only `split` token in the bundle is `OptionGrant.isoNsoSplit`, the ISO/NSO allocation of an option grant, which is unrelated.)
- `reason_text` — unmappable / `no-equivalent`. Free-form human-readable justification for the reissuance. Carta encodes the *reason* for a reissuance as a structured enum value (`CERTIFICATE_PRECEDED_BY_REASON_BALANCE_REISSUED`), not as free text, and exposes no per-transaction / per-certificate notes, memo, or comment string anywhere in the bundle (`Certificate`, `CertificateIssuanceTransaction`, and `CertificatePrecededBy` have no free-text field). The structured "this is a reissuance" semantics are captured by the preceded-by reason code; the arbitrary OCF prose has no home.
- `id`, `comments`, `object_type` — unmappable / `ocf-internal`. Standard OCF object scaffolding. `id` is OCF's own object identifier (Carta assigns server-side ids); `object_type` is the fixed discriminator `TX_STOCK_REISSUANCE` — Carta types transactions positionally per endpoint and has no reissuance *transaction type*; its nearest analogue is the `BALANCE_REISSUED` preceded-by reason code (a property value, not a discriminator), so this const has no enum target and the `values:` block maps it to `null`; `comments` has no Carta slot.
- Open question: because Carta reconstructs a reissuance from a `CertificateIssuanceTransaction` whose resulting certificate carries the `BALANCE_REISSUED` reason and a `precededBySecurityId` back to the retired source, a round-trip OCF→Carta→OCF cannot recover a single `TX_STOCK_REISSUANCE` object deterministically without a convention for grouping the N resulting issuances that share one source + the `BALANCE_REISSUED` reason. This grouping/identity convention is an export-tooling concern, not expressible in the schema.


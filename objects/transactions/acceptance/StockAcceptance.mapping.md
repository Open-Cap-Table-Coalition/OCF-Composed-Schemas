---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/acceptance/StockAcceptance.schema.json
ocf_object_type: TX_STOCK_ACCEPTANCE
ocf_title: Object - Stock Acceptance Transaction
ocf_kind: object
required_fields:
  - id
  - object_type
  - date
  - security_id
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-05-18
---

# Object - Stock Acceptance Transaction → Carta

> Object describing a stock acceptance transaction

## OCF schema

Source: [`StockAcceptance.schema.json`](./StockAcceptance.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/acceptance/StockAcceptance.schema.json",
  "title": "Object - Stock Acceptance Transaction",
  "description": "Object describing a stock acceptance transaction",
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
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/acceptance/Acceptance.schema.json"
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
      "const": "TX_STOCK_ACCEPTANCE"
    },
    "date": {
      "description": "Date on which the transaction occurred",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "security_id": {
      "description": "Identifier for the security (stock, plan security, warrant, or convertible) by which it can be referenced by other transaction objects. Note that while this identifier is created with an issuance object, it should be different than the issuance object's `id` field which identifies the issuance transaction object itself. All future transactions on the security (e.g. acceptance, transfer, cancel, etc.) must reference this `security_id` to qualify which security the transaction applies to.",
      "type": "string"
    }
  },
  "additionalProperties": false,
  "required": [
    "id",
    "object_type",
    "date",
    "security_id"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/acceptance/StockAcceptance.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: complete
coverage: 5/5

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
      TX_STOCK_ACCEPTANCE: null
  date:
    kind: unmappable
    target: null
    reason: no-equivalent
  security_id:
    kind: unmappable
    target: null
    reason: no-equivalent
```

## Notes / open questions

- **Bucket: n/a-object.** This is an OCF transaction object (`ocf_kind: object`), so the question is not "does Carta have an analogous reusable type" but "does Carta model this transaction, and where do its fields land on the corresponding Carta object." For stock acceptance, the answer is that Carta does not model the event at all: every field is unmappable.
- **Carta has no acceptance transaction.** Carta's transaction set is a closed, smaller list than OCF's. Enumerating every Carta `*Transaction` $def in the bundle: Certificate{Issuance,Cancellation}, Convertible{Issuance,Cancellation}, Option{Issuance,Exercise,Cancellation}, Warrant{Issuance,Exercise,Cancellation,Transfer}, Rsa{Issuance,Cancellation}, Rsu{Issuance,Settlement,Cancellation}, Sar{Issuance,Exercise,Cancellation}, Phantom/Piu{Issuance,Cancellation}. There is no `StockAcceptanceTransaction`, no generic `AcceptanceTransaction`, and no acceptance-shaped item in the `*TransactionItem` containers. OCF's acceptance (a stakeholder's affirmative acceptance of an already-issued security) has no transaction-level home in Carta.
- **Stock's Carta security object carries no acceptance field either.** An OCF stock security maps to Carta's `Certificate` (issued via `CertificateIssuanceTransaction`). `Certificate`'s fields are `id`, `securityId`, `shareClassId`, `vestingScheduleTemplateId`, `issuerId`, `stakeholderId`, `shareClassName`, `issueDate`, `quantity`, `securityLabel`, `pricePerShare`, `canceledDate`, `canceledQuantity`, `returnedToPoolQuantity`, `returnedToTreasuryQuantity`, `lastModifiedDatetime`, `precededBy` — none of which records a stakeholder acceptance date. So even folding the acceptance into the stock security (the strategy that works for some equity-comp securities) is not available here.
- **Carta DOES expose an acceptance date — but only on three OTHER security objects, none of which is stock.** `OptionGrant.stakeholderAcceptanceDate`, `RestrictedStockAward.stakeholderAcceptanceDate`, and `RestrictedStockUnit.stakeholderAcceptanceDate` (each `$ref Iso8601CompleteCalendarDate`), plus `Interest.acceptanceDate` (`$ref Iso8601CompleteCalendarDateTime`). These are inlined on the equity-comp/convertible-style securities, not on `Certificate`. Routing a *stock* acceptance into one of them would be a category error (wrong security type), so `date` is `no-equivalent` for StockAcceptance specifically. (The sibling `EquityCompensationAcceptance` / `ConvertibleAcceptance` mappings are where those Carta fields legitimately come into play; StockAcceptance has no analogous slot.)
- **`date` → unmappable / no-equivalent.** OCF `date` is a calendar `Date` recording when the stock acceptance occurred. Carta has nowhere to store a stock acceptance date (no acceptance transaction, no `Certificate.acceptanceDate`). Note also the general granularity mismatch in this corpus: OCF transaction dates are calendar DATES while Carta's transaction/security timestamps are `Iso8601CompleteCalendarDateTime`/`...Date` — moot here since there is no target at all.
- **`security_id` → unmappable / no-equivalent.** This is the foreign key tying the acceptance to the accepted stock security. Carta `securityId` foreign keys exist (e.g. on `Certificate`/`CertificateIssuanceTransaction`/`CertificateTransactionItem`), but they identify the security on its issuance/cancellation records, not on an acceptance record. With no Carta acceptance object to attach to, there is no Carta `securityId` slot for this transaction; the reference is dropped along with the event.
- **`id`, `comments`, `object_type` → unmappable / ocf-internal.** Standard OCF object scaffolding. `id` is OCF's own object identifier (Carta assigns its own server-side ids); `comments` has no Carta slot; `object_type` is OCF's discriminator constant (`TX_STOCK_ACCEPTANCE`) and Carta types positionally per endpoint rather than via a discriminator. `object_type` is recorded as `ocf-internal` (not `enum-remap`) because the only Carta enum even adjacent to stock issuance, `CertificateIssuanceReason`, has no acceptance member and this constant identifies the transaction kind rather than a value to be remapped.

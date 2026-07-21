---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/transfer/WarrantTransfer.schema.json
ocf_object_type: TX_WARRANT_TRANSFER
ocf_title: Object - Warrant Transfer Transaction
ocf_kind: object
required_fields:
  - quantity
  - id
  - object_type
  - date
  - security_id
  - resulting_security_ids
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-05-18
---

# Object - Warrant Transfer Transaction → Carta

> Object describing a transfer or secondary sale of a warrant security

## OCF schema

Source: [`WarrantTransfer.schema.json`](./WarrantTransfer.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/transfer/WarrantTransfer.schema.json",
  "title": "Object - Warrant Transfer Transaction",
  "description": "Object describing a transfer or secondary sale of a warrant security",
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
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/transfer/Transfer.schema.json"
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
      "const": "TX_WARRANT_TRANSFER"
    },
    "date": {
      "description": "Date on which the transaction occurred",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "security_id": {
      "description": "Identifier for the security (stock, plan security, warrant, or convertible) by which it can be referenced by other transaction objects. Note that while this identifier is created with an issuance object, it should be different than the issuance object's `id` field which identifies the issuance transaction object itself. All future transactions on the security (e.g. acceptance, transfer, cancel, etc.) must reference this `security_id` to qualify which security the transaction applies to.",
      "type": "string"
    },
    "consideration_text": {
      "description": "Unstructured text description of consideration provided in exchange for security transfer",
      "type": "string"
    },
    "balance_security_id": {
      "description": "Identifier for the security that holds the remainder balance (for partial transfers)",
      "type": "string"
    },
    "resulting_security_ids": {
      "title": "Security Transfer - Resulting Security ID Array",
      "description": "Array of identifiers for new security (or securities) created as a result of the transaction",
      "type": "array",
      "items": {
        "type": "string"
      },
      "minItems": 1,
      "uniqueItems": true
    },
    "quantity": {
      "description": "Quantity of non-monetary security units transferred",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Numeric.schema.json"
    }
  },
  "additionalProperties": false,
  "required": [
    "quantity",
    "id",
    "object_type",
    "date",
    "security_id",
    "resulting_security_ids"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/transfer/WarrantTransfer.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
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
    reason: no-equivalent
    values:
      TX_WARRANT_TRANSFER: null
  date:
    kind: rename
    target: "#/$defs/WarrantTransferTransaction/properties/transferredDatetime"
  security_id:
    kind: rename
    target: "#/$defs/WarrantTransactionItem/properties/securityId"
  consideration_text:
    kind: unmappable
    target: null
    reason: no-equivalent
  balance_security_id:
    kind: unmappable
    target: null
    reason: no-equivalent
  resulting_security_ids:
    kind: rename
    target: "#/$defs/WarrantTransferTransaction/properties/resultingSecurityId"
  quantity:
    kind: rename
    target: "#/$defs/WarrantTransferTransaction/properties/quantity"
```

## Notes / open questions

- **Carta models warrant transfers, so this object is largely mappable — unlike the sibling `WarrantRetraction` (no Carta equivalent).** A warrant's lifecycle in Carta lives on `WarrantTransactionItem` (`#/$defs/WarrantTransactionItem`), which groups the warrant's `issuance`, `exercises[]`, `transfers[]`, and `cancellations[]`. Each entry of `transfers[]` is a `WarrantTransferTransaction` (`#/$defs/WarrantTransferTransaction`) with exactly four fields: `transferredDatetime`, `quantity`, `resultingSecurityId`, and `resultingSecurityLabel`. The OCF transfer fields route to that transaction, and the transferred warrant's identity routes to the parent item.
- `quantity` → `WarrantTransferTransaction.quantity`. Both are decimal counts of non-monetary warrant units transferred (OCF `types/Numeric`; Carta `#/$defs/Decimal`). Direct rename.
- `date` → `WarrantTransferTransaction.transferredDatetime`. **Granularity difference:** OCF records a calendar `Date` (`YYYY-MM-DD`), while Carta's field is an `Iso8601CompleteCalendarDateTime` (`#/$defs/Iso8601CompleteCalendarDateTime`), i.e. a full datetime. Writing OCF→Carta requires widening the date to a datetime (e.g. appending a midnight/`T00:00:00Z` time component); reading back loses the time-of-day. Same date-vs-datetime caveat called out across the transaction precedents.
- `security_id` → `WarrantTransactionItem.securityId`. In OCF, `security_id` identifies the *source* warrant being transferred. Carta's `WarrantTransferTransaction` itself carries no `securityId` — the warrant identity sits one level up on the containing `WarrantTransactionItem` (whose `securityId` is described as "the identifier of the warrant"), and the transfer transaction is nested inside that warrant's `transfers[]` array. So this is a `rename` onto the parent item's `securityId`; the transfer is positionally associated with that warrant by containment rather than carrying its own foreign key.
- `resulting_security_ids` → `WarrantTransferTransaction.resultingSecurityId`. **Cardinality narrowing (lossy):** OCF allows an *array* of resulting security IDs (`minItems: 1`, `uniqueItems: true`) to model a transfer fanning out into multiple new warrants; Carta exposes a single scalar `resultingSecurityId` ("the identifier of the new warrant created as a result of the transfer"). The common one-to-one transfer maps cleanly (`resulting_security_ids[0]` → `resultingSecurityId`); a one-to-many OCF split-on-transfer cannot be fully represented and would have to be modeled in Carta as multiple transfer transactions. Marked `rename` (not `split`, which is for one OCF field fanning out to ≥2 *distinct* Carta properties — here OCF fans *in* to one Carta field). Carta's companion `resultingSecurityLabel` (human-readable label of the new warrant, e.g. "W-8") has no OCF source field and is simply left unpopulated; it is a Carta-side display convenience, not an OCF concept.
- `consideration_text` — OCF's free-text description of consideration paid in the secondary sale/transfer. **No Carta home:** a full-text scan of the bundle for `consideration` returns nothing, and `WarrantTransferTransaction` has no price/consideration/cash field (contrast `WarrantExerciseTransaction`, which does carry payment fields — transfers in Carta are recorded as pure quantity moves). Marked `no-equivalent`.
- `balance_security_id` — OCF's identifier for the security holding the remainder after a *partial* transfer. **No Carta home:** Carta's transfer transaction records only the resulting (transferred-out) warrant via `resultingSecurityId`; there is no field for the residual/balance security left with the transferor. In Carta the remaining balance is implicit in the source warrant's updated quantity rather than a referenced security object. Marked `no-equivalent`.
- `object_type` is the OCF discriminator constant `TX_WARRANT_TRANSFER`. Carta types transactions *positionally* — a transfer is a transfer by virtue of appearing in `WarrantTransactionItem.transfers[]`, and `WarrantTransferTransaction` carries no `object_type`/type-discriminator field. There is therefore no Carta enum to remap onto, so this is `no-equivalent` (not `enum-remap`); the single OCF enum value `TX_WARRANT_TRANSFER` is listed and maps to `null`. (Same treatment as the retraction/cancellation precedents.)
- `id` and `comments` are OCF object scaffolding from the `Object` primitive. `id` is OCF's own object identifier (Carta assigns identifiers server-side and the relevant security identifiers are `resultingSecurityId`/`securityId`, not the transaction-object id); `comments` has no Carta slot on any transaction. Both are `ocf-internal`, matching the Issuer/Document/WarrantRetraction precedents.
- **Stakeholder/recipient not modeled here:** OCF's `WarrantTransfer` does not name the transferee (the new holder) — the recipient is implied by who holds the `resulting_security_ids` warrant. Carta surfaces a holder via `WarrantTransactionItem.stakeholderId` ("the identifier of the current holder of the warrant"), but since OCF carries no transferee field on this object there is nothing to map there; noted for completeness, not counted as a field.
- **Coverage:** all nine source properties are explicitly accounted for: 5 fields map (`date`, `security_id`, `resulting_security_ids`, `quantity` to the transfer/item structure; plus the parent-item routing for `security_id`), 4 are unmappable (`id`/`comments` ocf-internal; `object_type`/`consideration_text`/`balance_security_id` no-equivalent). Of the nine source properties, four mappable renames carry the substantive transfer data; the two genuine data losses are the consideration text and the partial-transfer balance reference, plus the array→scalar narrowing on resulting securities.

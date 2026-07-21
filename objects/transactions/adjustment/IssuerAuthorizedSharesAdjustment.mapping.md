---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/adjustment/IssuerAuthorizedSharesAdjustment.schema.json
ocf_object_type: TX_ISSUER_AUTHORIZED_SHARES_ADJUSTMENT
ocf_title: Object - Issuer Authorized Shares Adjustment Transaction
ocf_kind: object
required_fields:
  - new_shares_authorized
  - id
  - object_type
  - date
  - issuer_id
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-05-18
---

# Object - Issuer Authorized Shares Adjustment Transaction → Carta

> Object describing an event to change the number of authorized shares at the issuer level.

## OCF schema

Source: [`IssuerAuthorizedSharesAdjustment.schema.json`](./IssuerAuthorizedSharesAdjustment.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/adjustment/IssuerAuthorizedSharesAdjustment.schema.json",
  "title": "Object - Issuer Authorized Shares Adjustment Transaction",
  "description": "Object describing an event to change the number of authorized shares at the issuer level.",
  "type": "object",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/Object.schema.json"
    },
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/Transaction.schema.json"
    },
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/IssuerTransaction.schema.json"
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
      "const": "TX_ISSUER_AUTHORIZED_SHARES_ADJUSTMENT"
    },
    "date": {
      "description": "Date on which the transaction occurred",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "issuer_id": {
      "description": "Identifier of the Issuer object, a subject of this transaction",
      "type": "string"
    },
    "new_shares_authorized": {
      "description": "The new number of shares authorized for this issuer as of the event of this transaction",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Numeric.schema.json"
    },
    "board_approval_date": {
      "description": "Date on which the board approved the change to the issuer",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "stockholder_approval_date": {
      "description": "Date on which the stockholders approved the change to the issuer",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    }
  },
  "additionalProperties": false,
  "required": [
    "new_shares_authorized",
    "id",
    "object_type",
    "date",
    "issuer_id"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/adjustment/IssuerAuthorizedSharesAdjustment.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
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
      TX_ISSUER_AUTHORIZED_SHARES_ADJUSTMENT: null
  date:
    kind: unmappable
    target: null
    reason: no-equivalent
  issuer_id:
    kind: unmappable
    target: null
    reason: no-equivalent
  new_shares_authorized:
    kind: unmappable
    target: null
    reason: no-equivalent
  board_approval_date:
    kind: unmappable
    target: null
    reason: no-equivalent
  stockholder_approval_date:
    kind: unmappable
    target: null
    reason: no-equivalent
```

## Notes / open questions

- Bucket: **n/a-object** (`ocf_kind: object`). This is an OCF *transaction* object, so it would normally map its own properties onto the corresponding Carta transaction + the security object it references. The blocking fact here is that **Carta has no corresponding transaction**: the entire OCF authorized-shares adjustment event has no Carta home, so every field is unmappable.
- Carta's transaction set is entirely **security-level** (per the `=== CARTA TRANSACTION/SECURITY SURFACE ===` inventory and confirmed against the bundle): `CertificateIssuanceTransaction` / `CertificateCancellationTransaction`, `OptionIssuanceTransaction` / `OptionExerciseTransaction` / `OptionCancellationTransaction`, `ConvertibleIssuanceTransaction` / `ConvertibleCancellationTransaction`, the Warrant / RSA / RSU / SAR / PIU / Phantom families, etc. Each Carta transaction hangs off a security (`shareClassId`, `equityPlanId`, `precededBySecurityId`, …) and an `*Datetime`. **None** of them is an issuer-charter-level event, and Carta has no `IssuerAuthorizedSharesAdjustment`, no adjustment family at all, and no generic "amend authorized shares" transaction. This matches the context note that Carta has no equivalent for OCF adjustment (authorized-shares/pool/ratio) transactions.
- There is also no issuer-level *state* field that this transaction's result could be written to. Carta's `Issuer` (`id`, `legalName`, `doingBusinessAsName`, `website`) and the near-identical `Corporation` carry **no** authorized-shares count. `CapitalizationTableSummary` tracks only `fullyDilutedShares` and `outstandingShares` (plus `cashRaised`) — never *authorized* shares. The only `authorized*` fields in the whole bundle are `ShareClass.authorizedShareCount` and `OptionPoolSummary.authorizedShares` (both bare `Decimal`), which are per-share-class / per-pool counts, not the issuer-wide corporate-charter total that this OCF transaction sets. So there is no Carta field that holds the post-event issuer-level authorized total either.
- Field-by-field justification:
    - `new_shares_authorized` (`Numeric`; the required payload of the event — the new issuer-level authorized total as of this transaction): **no-equivalent**. No Carta object or transaction stores an issuer-wide authorized-shares figure (see above), and Carta records no event by which it would change.
    - `date` (OCF `Date`; date the adjustment took effect): **no-equivalent**. With no host transaction in Carta, there is no `*Datetime` slot to carry it. (Note the granularity mismatch that would apply even if a host existed: OCF uses a calendar `Date`, whereas Carta transaction timestamps are `Iso8601CompleteCalendarDateTime`.)
    - `issuer_id` (FK to the OCF `Issuer` being amended): **no-equivalent**. Carta has an `Issuer.id` and uses `issuerId` as a foreign key on several objects, but it has no issuer-scoped transaction to attach this FK to, so there is no Carta field to receive it.
    - `board_approval_date`, `stockholder_approval_date` (governance approval dates for the charter amendment): **no-equivalent**. Carta models board approval only as `BoardApproval` attached to *security/grant* issuance (e.g. option grants), not to issuer-level charter amendments, and has no stockholder-approval concept at all. Neither approval date has a home on any issuer-level structure.
    - `id`, `comments`, `object_type`: **ocf-internal** OCF object scaffolding. `id` is OCF's identifier (Carta assigns its own server-side); `comments` has no Carta slot; `object_type` is OCF's discriminator constant (`TX_ISSUER_AUTHORIZED_SHARES_ADJUSTMENT`), which Carta does not need (it types transactions positionally per endpoint) — and in any case there is no Carta transaction type to remap it to, so `values` is `null`.
- Net: this is one of the OCF transactions the context flags as expected to be "mostly unmappable/no-equivalent." Here it is **fully** unmappable — both the event itself and the resulting issuer-level authorized-shares state are outside Carta's modeled surface.

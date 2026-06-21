---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/conversion/StockConversion.schema.json
ocf_object_type: TX_STOCK_CONVERSION
ocf_title: Object - Stock Conversion Transaction
ocf_kind: object
required_fields:
  - quantity_converted
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

# Object - Stock Conversion Transaction → Carta

> Object describing a conversion of stock

## OCF schema

Source: [`StockConversion.schema.json`](./StockConversion.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/conversion/StockConversion.schema.json",
  "title": "Object - Stock Conversion Transaction",
  "description": "Object describing a conversion of stock",
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
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/conversion/Conversion.schema.json"
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
      "const": "TX_STOCK_CONVERSION"
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
      "title": "Security Conversion - Resulting Security ID Array",
      "description": "Identifier for the security (or securities) that resulted from the conversion",
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "balance_security_id": {
      "description": "Identifier for the security that holds the remainder balance (for partial conversions)",
      "type": "string"
    },
    "quantity_converted": {
      "description": "Quantity of non-monetary security units converted",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Numeric.schema.json"
    }
  },
  "additionalProperties": false,
  "required": [
    "quantity_converted",
    "id",
    "object_type",
    "date",
    "security_id",
    "resulting_security_ids"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/conversion/StockConversion.schema.json"
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
      TX_STOCK_CONVERSION: null
  date:
    kind: rename
    target: "#/$defs/CertificateIssuanceTransaction/properties/issueDatetime"
  security_id:
    kind: rename
    target: "#/$defs/CertificateIssuanceTransaction/properties/precededBySecurityId"
  resulting_security_ids:
    kind: rename
    target: "#/$defs/Certificate/properties/securityId"
  balance_security_id:
    kind: rename
    target: "#/$defs/Certificate/properties/securityId"
  quantity_converted:
    kind: rename
    target: "#/$defs/CertificateCancellationTransaction/properties/quantity"
```

## Notes / open questions

- **Carta has no stock-conversion transaction.** OCF treats a stock-class conversion as a first-class transaction object (`TX_STOCK_CONVERSION`) that points at the converted security and the securities it became. Carta's transaction surface is issuance/cancellation only — there is no `StockConversionTransaction`, no conversion `$def` of any kind for certificates, and no transaction-type discriminator value for a conversion (Carta's `CertificateTransactionItem` groups exactly two lifecycle events: `issuance` and `cancellations[]`). Instead, Carta records the *same economic event* as a pair of ordinary certificate transactions: the converted (source) certificate is **cancelled** and a **new certificate is issued** for the resulting share class. Both the cancellation-reason and issuance-reason enums carry a dedicated `..._SHARE_CLASS_CONVERTED` member (`CertificateCancellationReason.CERTIFICATE_CANCELLATION_REASON_SHARE_CLASS_CONVERTED`, `CertificateIssuanceReason.CERTIFICATE_ISSUANCE_REASON_SHARE_CLASS_CONVERTED`), and the resulting certificate's provenance is recorded by `CertificateIssuanceTransaction.precededBySecurityId` / `Certificate.precededBy` (`CertificatePrecededByReason.CERTIFICATE_PRECEDED_BY_REASON_SHARE_CLASS_CONVERTED`). So this single OCF object fans out across two Carta transactions plus the resulting `Certificate` (and, for a partial conversion, a second re-issued `Certificate` carrying the `BALANCE_REISSUED` reason for the remainder); there is no one Carta object that holds all of its fields, and the conversion is **inferred** from the `SHARE_CLASS_CONVERTED` / `BALANCE_REISSUED` reason codes rather than stored as a typed event. The per-field mappings below name the Carta property that genuinely carries each datum on whichever of those records is its natural home.
- `date` → `CertificateIssuanceTransaction.issueDatetime`. OCF's conversion `date` is the date the conversion occurred; in Carta the conversion is materialised by issuing the resulting certificate, whose issue datetime is that same date. Two caveats: (a) **date-vs-datetime** — OCF `date` is a calendar `Date` (`Iso8601CompleteCalendarDate`-equivalent) while `issueDatetime` is `Iso8601CompleteCalendarDateTime`, so a (UTC) time-of-day must be synthesised on export and is dropped on import; (b) the same date also belongs on the source certificate's `CertificateCancellationTransaction.effectiveDatetime` — both Carta records carry the conversion date, and there is no single conversion-level date field. Pointed at the issuance side because that is where `precededBySecurityId` (the source-security link) also lives.
- `security_id` → `CertificateIssuanceTransaction.precededBySecurityId`. OCF `security_id` identifies the security being converted (the source stock). On the Carta side that source security is referenced by the resulting certificate's issuance transaction as `precededBySecurityId` ("the identifier of the security that preceded this certificate"), paired with `CertificatePrecededByReason.CERTIFICATE_PRECEDED_BY_REASON_SHARE_CLASS_CONVERTED`. (It is the *same* id that the source certificate's `CertificateCancellationTransaction` operates on; Carta keys the cancellation by the security being cancelled rather than by a stored field, so the issuance-side `precededBySecurityId` is the explicit, queryable home for the converted-security reference.)
- `resulting_security_ids` → `Certificate/properties/securityId`. OCF allows a conversion to produce *one or more* resulting securities (array). Each resulting security in Carta is a `Certificate`, identified by `Certificate.securityId`. This is an **array→scalar fan-out**: OCF's single array maps to one `securityId` per issued resulting certificate; Carta has no single field holding the *set* of resulting securities for a conversion. If a stock conversion ever yields more than one resulting security, it becomes multiple Carta certificate issuances (each with its own `precededBySecurityId` back to the same source).
- `quantity_converted` → `CertificateCancellationTransaction.quantity`. OCF's `quantity_converted` is the number of *source* units consumed by the conversion. The natural Carta home is the source certificate's cancellation `quantity` (the units removed from the converted security), not the resulting certificate's issuance `quantity` — for a stock-class conversion at a 1:1 ratio those coincide, but OCF's stock-conversion object carries no conversion ratio, so the resulting-certificate quantity is not guaranteed equal and the *converted* count is unambiguously the cancelled-from-source count. (Type note: OCF `Numeric` → Carta `Decimal`; both are arbitrary-precision decimal strings, no transform.)
- `balance_security_id` → `Certificate/properties/securityId` (the *balance* certificate, distinguished by reason `BALANCE_REISSUED`). For a *partial* conversion, OCF records a separate security holding the unconverted remainder. Carta materialises that remainder as its own re-issued `Certificate`, and the dedicated reason code `CertificatePrecededByReason.CERTIFICATE_PRECEDED_BY_REASON_BALANCE_REISSUED` ("the certificate was issued representing the remainder of a certificate that had been partially transacted") is exactly this concept; the same value also exists as `CertificateIssuanceReason`/`CertificatePrecededByReason` members on the bundle. The balance security's own id is therefore the balance certificate's `Certificate.securityId` — the *same* property that `resulting_security_ids` targets, so the two are disambiguated purely by the preceded-by/issuance reason on the issuing transaction: the converted-share certificate carries `SHARE_CLASS_CONVERTED`, the remainder certificate carries `BALANCE_REISSUED`. (`Certificate.precededBy` / `PrecededBySecurity.id` holds the *predecessor* (source) security id, not the balance certificate's own id, so `securityId` — not `precededBy` — is the correct home for `balance_security_id` itself.) The only loss is that Carta has no single field linking a conversion to "its" balance certificate; the link is reconstructed from `precededBySecurityId` + the `BALANCE_REISSUED` reason, exactly as the conversion itself is reconstructed.
- `id`, `comments`, `object_type` → unmappable / `ocf-internal`. Standard OCF object scaffolding. `id` is OCF's own object identifier (Carta assigns server-side ids); `object_type` is the fixed discriminator `TX_STOCK_CONVERSION` (Carta types transactions positionally per endpoint and has no conversion discriminator at all — its nearest analogue is the `SHARE_CLASS_CONVERTED` reason codes, not a transaction type, so this const has no enum target and `values:` maps to null); `comments` has no Carta slot.
- Open question: because Carta reconstructs a stock conversion from a cancel+issue pair joined by `SHARE_CLASS_CONVERTED` reason codes and `precededBySecurityId`, a round-trip OCF→Carta→OCF cannot recover the original single `TX_STOCK_CONVERSION` object deterministically without a convention for pairing the two Carta transactions (e.g., matching `precededBySecurityId` on the issuance to the cancelled source security and requiring both reason codes to be `SHARE_CLASS_CONVERTED`). This pairing/identity convention is an export-tooling concern, not expressible in the schema.

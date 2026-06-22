---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/issuance/StockIssuance.schema.json
ocf_object_type: TX_STOCK_ISSUANCE
ocf_title: Object - Stock Issuance Transaction
ocf_kind: object
required_fields:
  - stock_class_id
  - share_price
  - quantity
  - stock_legend_ids
  - id
  - object_type
  - date
  - security_id
  - security_law_exemptions
  - stakeholder_id
  - custom_id
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-05-18
---

# Object - Stock Issuance Transaction → Carta

> Object describing a stock issuance transaction by the issuer and held by a stakeholder

## OCF schema

Source: [`StockIssuance.schema.json`](./StockIssuance.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/issuance/StockIssuance.schema.json",
  "title": "Object - Stock Issuance Transaction",
  "description": "Object describing a stock issuance transaction by the issuer and held by a stakeholder",
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
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/issuance/Issuance.schema.json"
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
      "const": "TX_STOCK_ISSUANCE"
    },
    "date": {
      "description": "Date on which the transaction occurred",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "security_id": {
      "description": "Identifier for the security (stock, plan security, warrant, or convertible) by which it can be referenced by other transaction objects. Note that while this identifier is created with an issuance object, it should be different than the issuance object's `id` field which identifies the issuance transaction object itself. All future transactions on the security (e.g. acceptance, transfer, cancel, etc.) must reference this `security_id` to qualify which security the transaction applies to.",
      "type": "string"
    },
    "custom_id": {
      "description": "A custom ID for this security (e.g. CN-1.)",
      "type": "string"
    },
    "stakeholder_id": {
      "description": "Identifier for the stakeholder that holds legal title to this security",
      "type": "string"
    },
    "board_approval_date": {
      "description": "Date of board approval for the security",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "stockholder_approval_date": {
      "description": "Date on which the stockholders approved the security",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "consideration_text": {
      "description": "Unstructured text description of consideration provided in exchange for security issuance",
      "type": "string"
    },
    "security_law_exemptions": {
      "title": "Security Issuance - Security Exemption Array",
      "description": "List of security law exemptions (and applicable jurisdictions) for this security",
      "type": "array",
      "items": {
        "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/SecurityExemption.schema.json"
      }
    },
    "stock_class_id": {
      "description": "Identifier of the stock class for this stock issuance",
      "type": "string"
    },
    "stock_plan_id": {
      "description": "Identifier of StockPlan the Stock was issued from (in the case of RSAs or Stock issued from a plan).",
      "type": "string"
    },
    "share_numbers_issued": {
      "description": "Range(s) of the specific share numbers included in this issuance. This is different from a certificate number you might include in the `custom_id` field or the `security_id` created in this issuance. This field should be used where, for whatever reason, shares are not fungible and you must track, with each issuance, *which* specific share numbers are included in the issuance - e.g. share numbers 1 - 100 and 250-300.",
      "type": "array",
      "items": {
        "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/ShareNumberRange.schema.json"
      }
    },
    "share_price": {
      "description": "The price per share paid for the stock by the holder",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Monetary.schema.json"
    },
    "quantity": {
      "description": "Number of shares issued to the stakeholder",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Numeric.schema.json"
    },
    "vesting_terms_id": {
      "description": "Identifier of the VestingTerms to which this security is subject. If neither `vesting_terms_id` or `vestings` are present then the security is fully vested on issuance.",
      "type": "string"
    },
    "vestings": {
      "title": "Stock Issuance - Vestings Array",
      "description": "List of exact vesting dates and amounts for this security. When `vestings` array is present then `vesting_terms_id` may be ignored.",
      "type": "array",
      "minItems": 1,
      "items": {
        "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Vesting.schema.json"
      }
    },
    "cost_basis": {
      "description": "The cost basis for this particular stock",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Monetary.schema.json"
    },
    "stock_legend_ids": {
      "title": "Stock Issuance - Stock Legend ID Array",
      "description": "List of stock legend ids that apply to this stock",
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "issuance_type": {
      "description": "Optional field to flag certain special types of issuances (like RSAs)",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/StockIssuanceType.schema.json"
    }
  },
  "additionalProperties": false,
  "required": [
    "stock_class_id",
    "share_price",
    "quantity",
    "stock_legend_ids",
    "id",
    "object_type",
    "date",
    "security_id",
    "security_law_exemptions",
    "stakeholder_id",
    "custom_id"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/issuance/StockIssuance.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
# routing: discriminator (issuance-time) — issuance_type routes an RSA to Carta's
# RestrictedStockAward family; FOUNDERS_STOCK / absent is a plain Certificate.
# shared: fields common to both variants. A field whose Carta home differs by
# variant carries a per-variant target map { Rsa/Default: pointer }; the validator
# enforces the keys stay in sync with the variant set.
status: complete

discriminator:
  field: issuance_type
  exhaustive: true

shared:
  id:                        { kind: unmappable, target: null, reason: ocf-internal }
  comments:                  { kind: unmappable, target: null, reason: no-equivalent }
  object_type:               { kind: unmappable, target: null, reason: ocf-internal }
  date:
    kind: rename
    target:
      Rsa:     "#/$defs/RsaIssuanceTransaction/properties/issueDatetime"
      Default: "#/$defs/CertificateIssuanceTransaction/properties/issueDatetime"
  security_id:
    kind: rename
    target:
      Rsa:     "#/$defs/RestrictedStockAward/properties/securityId"
      Default: "#/$defs/Certificate/properties/securityId"
  custom_id:
    kind: rename
    target:
      Rsa:     "#/$defs/RestrictedStockAward/properties/securityLabel"
      Default: "#/$defs/Certificate/properties/securityLabel"
  stakeholder_id:
    kind: rename
    target:
      Rsa:     "#/$defs/RestrictedStockAward/properties/stakeholderId"
      Default: "#/$defs/Certificate/properties/stakeholderId"
  stockholder_approval_date: { kind: unmappable, target: null, reason: no-equivalent }
  consideration_text:        { kind: unmappable, target: null, reason: no-equivalent }
  security_law_exemptions:   { kind: unmappable, target: null, reason: no-equivalent }
  stock_class_id:
    kind: rename
    target:
      Rsa:     "#/$defs/RestrictedStockAward/properties/shareClassId"
      Default: "#/$defs/Certificate/properties/shareClassId"
  stock_plan_id:
    kind: rename
    target:
      Rsa:     "#/$defs/RsaIssuanceTransaction/properties/equityPlanId"
      Default: "#/$defs/CertificateIssuanceTransaction/properties/equityPlanId"
  share_numbers_issued:      { kind: unmappable, target: null, reason: no-equivalent }
  quantity:
    kind: rename
    target:
      Rsa:     "#/$defs/RsaIssuanceTransaction/properties/quantity"
      Default: "#/$defs/CertificateIssuanceTransaction/properties/quantity"
  vesting_terms_id:
    kind: rename
    target:
      Rsa:     "#/$defs/RsaIssuanceTransaction/properties/vestingScheduleTemplateId"
      Default: "#/$defs/CertificateIssuanceTransaction/properties/vestingScheduleTemplateId"
  stock_legend_ids:          { kind: unmappable, target: null, reason: no-equivalent }

variants:

  Rsa:
    when: [RSA]
    primary_targets:
      - "#/$defs/RsaIssuanceTransaction"
      - "#/$defs/RestrictedStockAward"
    fields:
      board_approval_date: { kind: rename, target: "#/$defs/RestrictedStockAward/properties/boardApprovalDate" }
      share_price:         { kind: rename, target: "#/$defs/RestrictedStockAward/properties/pricePerShare" }
      cost_basis:          { kind: rename, target: "#/$defs/RsaIssuanceTransaction/properties/acquisitionCost" }
      vestings:            { kind: rename, target: "#/$defs/RestrictedStockAward/properties/vestingEvents" }
      issuance_type:       { kind: unmappable, target: null, reason: no-equivalent }

  Default:
    when: [FOUNDERS_STOCK]
    primary_targets:
      - "#/$defs/CertificateIssuanceTransaction"
      - "#/$defs/Certificate"
    fields:
      board_approval_date: { kind: unmappable, target: null, reason: no-equivalent }
      share_price:         { kind: rename, target: "#/$defs/Certificate/properties/pricePerShare" }
      cost_basis:          { kind: rename, target: "#/$defs/CertificateIssuanceTransaction/properties/acquisitionCost" }
      vestings:            { kind: unmappable, target: null, reason: no-equivalent }
      issuance_type:       { kind: unmappable, target: null, reason: no-equivalent }

coverage:
  Rsa: 21/21
  Default: 21/21
```

## Notes / open questions

- **Polymorphic by `issuance_type`.** An RSA is, in OCF, a `StockIssuance` flagged
  `issuance_type: RSA` (actually-issued stock with a repurchase/forfeiture right) — see
  [`docs/type-mapping-policy.md`](../../../../docs/type-mapping-policy.md). Carta promotes it to a
  dedicated `RestrictedStockAward` security. This mapping routes `RSA` → `RsaIssuanceTransaction` +
  `RestrictedStockAward`; everything else (`FOUNDERS_STOCK`, and `issuance_type` **absent**, which
  the importer treats as the `Default` route) → `CertificateIssuanceTransaction` + `Certificate`.
  See [`docs/polymorphic-transaction-routing.md`](../../../../docs/polymorphic-transaction-routing.md).
- **Per-variant divergence.** `board_approval_date` and `vestings` (explicit event array) exist on
  `RestrictedStockAward` but **not** on `Certificate` (which carries only
  `vestingScheduleTemplateId`), so they are RSA-only; `share_price`/`cost_basis` land on the
  resolved family's security/transaction object.
- **`shared:` fields use per-variant target maps where the home diverges** (`date`/`security_id`/
  `custom_id`/`stakeholder_id`/`stock_class_id`/`stock_plan_id`/`quantity`/`vesting_terms_id`): each
  is a `target: { Rsa/Default: pointer }` map landing on the resolved family's transaction/security
  object. Both families carry every divergent field (unlike SAR in `EquityCompensationIssuance`), so
  no `null` columns are needed; the validator enforces the keys stay in sync with the variant set.
- **Genuinely unmappable.** `share_numbers_issued` (no Carta range type), `stock_legend_ids`
  (OCF-required; no Carta legend store), and `issuance_type` itself (no Carta field records the
  RSA/founders flavor; `CertificateIssuanceReason` is a *why-issued* enum, a different concept) have
  no Carta home in either variant.

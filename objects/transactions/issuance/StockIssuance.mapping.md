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
target_version: "v1alpha1 (2026-06-22)"
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
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
# routing: route_by_property (local) — issuance_type routes an RSA to Carta's
# RestrictedStockAward family; FOUNDERS_STOCK / absent is a plain Certificate.
# shared: fields common to both variants. A field whose Carta home differs by
# variant carries a per-variant target map { Rsa/Default: pointer or pointer list }; the validator
# enforces the keys stay in sync with the variant set.
status: complete

route_by_property:
  on_property: issuance_type
  exhaustive: true

shared:
  id:                        { kind: unmappable, target: null, reason: ocf-internal }
  comments:                  { kind: unmappable, target: null, reason: no-equivalent }
  object_type:               { kind: unmappable, target: null, reason: ocf-internal }
  date:
    kind: rename
    target:
      Rsa:
        - "#/$defs/RsaIssuanceTransaction/properties/issueDatetime"
        - "#/$defs/RestrictedStockAward/properties/issueDate"
      Default:
        - "#/$defs/CertificateIssuanceTransaction/properties/issueDatetime"
        - "#/$defs/Certificate/properties/issueDate"
  security_id:
    kind: rename
    target:
      Rsa:
        - "#/$defs/RsaTransactionItem/properties/securityId"
        - "#/$defs/RestrictedStockAward/properties/id"
        - "#/$defs/RestrictedStockAward/properties/securityId"
      Default:
        - "#/$defs/CertificateTransactionItem/properties/securityId"
        - "#/$defs/Certificate/properties/id"
        - "#/$defs/Certificate/properties/securityId"
  custom_id:
    kind: rename
    target:
      Rsa:
        - "#/$defs/RsaTransactionItem/properties/securityLabel"
        - "#/$defs/RestrictedStockAward/properties/securityLabel"
      Default:
        - "#/$defs/CertificateTransactionItem/properties/securityLabel"
        - "#/$defs/Certificate/properties/securityLabel"
  stakeholder_id:
    kind: rename
    target:
      Rsa:
        - "#/$defs/RsaTransactionItem/properties/stakeholderId"
        - "#/$defs/RestrictedStockAward/properties/stakeholderId"
      Default:
        - "#/$defs/CertificateTransactionItem/properties/stakeholderId"
        - "#/$defs/Certificate/properties/stakeholderId"
  stockholder_approval_date: { kind: unmappable, target: null, reason: no-equivalent }
  consideration_text:        { kind: unmappable, target: null, reason: no-equivalent }
  security_law_exemptions:
    kind: unmappable
    target: null
    reason: target-definition-removed
  stock_class_id:
    kind: rename
    target:
      Rsa:
        - "#/$defs/RsaIssuanceTransaction/properties/shareClassId"
        - "#/$defs/RestrictedStockAward/properties/shareClassId"
      Default:
        - "#/$defs/CertificateIssuanceTransaction/properties/shareClassId"
        - "#/$defs/Certificate/properties/shareClassId"
  stock_plan_id:
    kind: rename
    target:
      Rsa:     "#/$defs/RsaIssuanceTransaction/properties/equityPlanId"
      Default: "#/$defs/CertificateIssuanceTransaction/properties/equityPlanId"
  share_numbers_issued:      { kind: unmappable, target: null, reason: no-equivalent }
  quantity:
    kind: rename
    target:
      Rsa:
        - "#/$defs/RsaIssuanceTransaction/properties/quantity"
        - "#/$defs/RestrictedStockAward/properties/quantity"
      Default:
        - "#/$defs/CertificateIssuanceTransaction/properties/quantity"
        - "#/$defs/Certificate/properties/quantity"
  vesting_terms_id:
    kind: rename
    target:
      Rsa:
        - "#/$defs/RsaIssuanceTransaction/properties/vestingScheduleTemplateId"
        - "#/$defs/RestrictedStockAward/properties/vestingScheduleTemplateId"
      Default:
        - "#/$defs/CertificateIssuanceTransaction/properties/vestingScheduleTemplateId"
        - "#/$defs/Certificate/properties/vestingScheduleTemplateId"
  stock_legend_ids:          { kind: unmappable, target: null, reason: no-equivalent }

variants:

  Rsa:
    when: [RSA]
    primary_targets:
      - "#/$defs/RsaIssuanceTransaction"
      - "#/$defs/RsaTransactionItem"
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
      - "#/$defs/CertificateTransactionItem"
      - "#/$defs/Certificate"
    fields:
      board_approval_date: { kind: unmappable, target: null, reason: no-equivalent }
      share_price:         { kind: rename, target: "#/$defs/Certificate/properties/pricePerShare" }
      cost_basis:          { kind: rename, target: "#/$defs/CertificateIssuanceTransaction/properties/acquisitionCost" }
      vestings:
        kind: unmappable
        target: null
        reason: no-equivalent
        note: >-
          Carta's Certificate has no vestingEvents array (only vestingScheduleTemplateId),
          so OCF's explicit vesting events have no home for founders/certificate stock — the
          template ref still maps via vesting_terms_id. RSA keeps both (RestrictedStockAward
          carries vestingEvents). Carta-side asymmetry: Certificate is the only security object
          without an events array.
      issuance_type:       { kind: unmappable, target: null, reason: no-equivalent }

 ```

## Ask a mapping question

Use a link below to open a prefilled GitHub issue. The issue can be copied into the auditable checklist in `## Notes / open questions`.

<details>
<summary>Open a prefilled issue for a property</summary>

<!-- mapping-question-links:start -->
| Source property | Action |
| --- | --- |
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fissuance%2FStockIssuance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fissuance%2FStockIssuance.mapping.md&title=%5BMapping+question%5D+StockIssuance) |
| `id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fissuance%2FStockIssuance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fissuance%2FStockIssuance.mapping.md&title=%5BMapping+question%5D+StockIssuance%3A+id&property_path=id) |
| `comments` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fissuance%2FStockIssuance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fissuance%2FStockIssuance.mapping.md&title=%5BMapping+question%5D+StockIssuance%3A+comments&property_path=comments) |
| `object_type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fissuance%2FStockIssuance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fissuance%2FStockIssuance.mapping.md&title=%5BMapping+question%5D+StockIssuance%3A+object_type&property_path=object_type) |
| `date` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fissuance%2FStockIssuance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fissuance%2FStockIssuance.mapping.md&title=%5BMapping+question%5D+StockIssuance%3A+date&property_path=date) |
| `security_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fissuance%2FStockIssuance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fissuance%2FStockIssuance.mapping.md&title=%5BMapping+question%5D+StockIssuance%3A+security_id&property_path=security_id) |
| `custom_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fissuance%2FStockIssuance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fissuance%2FStockIssuance.mapping.md&title=%5BMapping+question%5D+StockIssuance%3A+custom_id&property_path=custom_id) |
| `stakeholder_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fissuance%2FStockIssuance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fissuance%2FStockIssuance.mapping.md&title=%5BMapping+question%5D+StockIssuance%3A+stakeholder_id&property_path=stakeholder_id) |
| `board_approval_date` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fissuance%2FStockIssuance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fissuance%2FStockIssuance.mapping.md&title=%5BMapping+question%5D+StockIssuance%3A+board_approval_date&property_path=board_approval_date) |
| `stockholder_approval_date` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fissuance%2FStockIssuance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fissuance%2FStockIssuance.mapping.md&title=%5BMapping+question%5D+StockIssuance%3A+stockholder_approval_date&property_path=stockholder_approval_date) |
| `consideration_text` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fissuance%2FStockIssuance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fissuance%2FStockIssuance.mapping.md&title=%5BMapping+question%5D+StockIssuance%3A+consideration_text&property_path=consideration_text) |
| `security_law_exemptions` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fissuance%2FStockIssuance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fissuance%2FStockIssuance.mapping.md&title=%5BMapping+question%5D+StockIssuance%3A+security_law_exemptions&property_path=security_law_exemptions) |
| `stock_class_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fissuance%2FStockIssuance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fissuance%2FStockIssuance.mapping.md&title=%5BMapping+question%5D+StockIssuance%3A+stock_class_id&property_path=stock_class_id) |
| `stock_plan_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fissuance%2FStockIssuance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fissuance%2FStockIssuance.mapping.md&title=%5BMapping+question%5D+StockIssuance%3A+stock_plan_id&property_path=stock_plan_id) |
| `share_numbers_issued` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fissuance%2FStockIssuance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fissuance%2FStockIssuance.mapping.md&title=%5BMapping+question%5D+StockIssuance%3A+share_numbers_issued&property_path=share_numbers_issued) |
| `share_price` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fissuance%2FStockIssuance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fissuance%2FStockIssuance.mapping.md&title=%5BMapping+question%5D+StockIssuance%3A+share_price&property_path=share_price) |
| `quantity` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fissuance%2FStockIssuance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fissuance%2FStockIssuance.mapping.md&title=%5BMapping+question%5D+StockIssuance%3A+quantity&property_path=quantity) |
| `vesting_terms_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fissuance%2FStockIssuance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fissuance%2FStockIssuance.mapping.md&title=%5BMapping+question%5D+StockIssuance%3A+vesting_terms_id&property_path=vesting_terms_id) |
| `vestings` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fissuance%2FStockIssuance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fissuance%2FStockIssuance.mapping.md&title=%5BMapping+question%5D+StockIssuance%3A+vestings&property_path=vestings) |
| `cost_basis` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fissuance%2FStockIssuance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fissuance%2FStockIssuance.mapping.md&title=%5BMapping+question%5D+StockIssuance%3A+cost_basis&property_path=cost_basis) |
| `stock_legend_ids` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fissuance%2FStockIssuance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fissuance%2FStockIssuance.mapping.md&title=%5BMapping+question%5D+StockIssuance%3A+stock_legend_ids&property_path=stock_legend_ids) |
| `issuance_type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fissuance%2FStockIssuance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fissuance%2FStockIssuance.mapping.md&title=%5BMapping+question%5D+StockIssuance%3A+issuance_type&property_path=issuance_type) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- Route by `issuance_type`: RSA → `RsaIssuanceTransaction`/`RestrictedStockAward`; FOUNDERS_STOCK → `CertificateIssuanceTransaction`/`Certificate`. Shared identity, date, holder/class/plan references, quantity, vesting-template, price, and cost basis populate the selected family.
- RSA board approval and vesting events map to the award; those fields have no target for founders' stock. Security-law exemptions are explicitly excluded because `Compliance` was removed. The retained `Certificate` and `RestrictedStockAward` definitions now require `id` and `issuerId` in addition to the fields already mapped from the issuance; `id` is the security identity and `issuerId` must come from issuer context.
- Share-number ranges, stock legend links, stockholder approval, consideration, and unsupported issuance fields are dropped for this pinned target bundle; OCF scaffolding is not copied. Carta's separate Draft Issuer certificate input has a `legend` string, but it is not part of this issuance target and does not establish a `StockLegendTemplate` mapping.

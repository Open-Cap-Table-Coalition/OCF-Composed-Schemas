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
target_version: "v1alpha1 (2026-04-30)"
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
status: complete
coverage: 21/21

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
      TX_STOCK_ISSUANCE: null
  date:
    kind: rename
    target: "#/$defs/Certificate/properties/issueDate"
  security_id:
    kind: rename
    target: "#/$defs/Certificate/properties/securityId"
  custom_id:
    kind: rename
    target: "#/$defs/Certificate/properties/securityLabel"
  stakeholder_id:
    kind: rename
    target: "#/$defs/Certificate/properties/stakeholderId"
  board_approval_date:
    kind: unmappable
    target: null
    reason: no-equivalent
  stockholder_approval_date:
    kind: unmappable
    target: null
    reason: no-equivalent
  consideration_text:
    kind: unmappable
    target: null
    reason: no-equivalent
  security_law_exemptions:
    kind: unmappable
    target: null
    reason: no-equivalent
  stock_class_id:
    kind: rename
    target: "#/$defs/Certificate/properties/shareClassId"
  stock_plan_id:
    kind: rename
    target: "#/$defs/CertificateIssuanceTransaction/properties/equityPlanId"
  share_numbers_issued:
    kind: unmappable
    target: null
    reason: no-equivalent
  share_price:
    kind: rename
    target: "#/$defs/Certificate/properties/pricePerShare"
  quantity:
    kind: rename
    target: "#/$defs/Certificate/properties/quantity"
  vesting_terms_id:
    kind: rename
    target: "#/$defs/Certificate/properties/vestingScheduleTemplateId"
  vestings:
    kind: unmappable
    target: null
    reason: no-equivalent
  cost_basis:
    kind: unmappable
    target: null
    reason: no-equivalent
  stock_legend_ids:
    kind: unmappable
    target: null
    reason: no-equivalent
  issuance_type:
    kind: unmappable
    target: null
    reason: no-equivalent
    values:
      RSA: null
      FOUNDERS_STOCK: null
```

## Notes / open questions

- **Carta home = `Certificate` (the security) + `CertificateIssuanceTransaction` (the event).** OCF's `TX_STOCK_ISSUANCE` records the initial issuance of stock to a stakeholder. Carta models exactly this pair: `#/$defs/CertificateIssuanceTransaction` ("The issuance transaction for a certificate. Represents the initial issuance of stock.") is the transaction event, and `#/$defs/Certificate` ("A certificate is a record of ownership of a company's shares.") is the resulting security record. As with the exercise-transaction precedents (`WarrantExercise`, `EquityCompensationExercise`), OCF carries the issued security's standing economics (quantity, price, dates, class/stakeholder/vesting references) *on the issuance transaction object itself*, whereas Carta splits them: the durable per-security values live on `Certificate`, and only the few issuance-event-specific fields (`issueDatetime`, `equityPlanId`, `issuanceReason`, `precededBySecurityId`, etc.) live on `CertificateIssuanceTransaction`. The field map therefore lands most properties on `Certificate` and routes `stock_plan_id` to the transaction object. This object is `ocf_kind: object`, so the 3-bucket type policy does not apply — an OCF transaction maps to its corresponding Carta transaction/security objects.
- `date` → `#/$defs/Certificate/properties/issueDate`: OCF `date` is the transaction date (`types/Date.schema.json`, calendar `YYYY-MM-DD`). `Certificate.issueDate` is `#/$defs/Iso8601CompleteCalendarDate` — a calendar **date**, so this is an exact-granularity match (no date→datetime widening needed). I deliberately target `Certificate.issueDate` rather than `CertificateIssuanceTransaction.issueDatetime` (`Iso8601CompleteCalendarDateTime`): the latter would force padding OCF's date with a placeholder time-of-day, whereas `issueDate` preserves OCF's granularity exactly. A serializer populating the transaction object's `issueDatetime` would copy the same date and pad the time.
- `security_id` → `#/$defs/Certificate/properties/securityId`: OCF's `security_id` is the stable identifier minted for the issued security and referenced by all later transactions on it. `Certificate.securityId` is documented as the UUID used to cross-reference with the List Transactions API — i.e. the same role. Straight rename. (Note Carta also has `Certificate.id`, a *separate* certificate identifier; the cross-referencing key is `securityId`, which is the correct counterpart to OCF `security_id`.)
- `custom_id` → `#/$defs/Certificate/properties/securityLabel`: OCF `custom_id` is the human-facing label for the security (e.g. `CS-1`). `Certificate.securityLabel` ("The label representing this security (certificate)") is the matching human-readable label. Rename.
- `stakeholder_id` → `#/$defs/Certificate/properties/stakeholderId`: holder of legal title in both. Straight rename (foreign key to the stakeholder).
- `stock_class_id` → `#/$defs/Certificate/properties/shareClassId`: OCF "stock class" is Carta "share class"; `Certificate.shareClassId` is the per-certificate share-class foreign key. Rename.
- `stock_plan_id` → `#/$defs/CertificateIssuanceTransaction/properties/equityPlanId`: OCF `stock_plan_id` identifies the `StockPlan` the stock was issued from (RSAs / plan-issued stock). Carta's plan linkage for an issuance lives on the issuance transaction as `equityPlanId` ("The identifier of the equity plan from which the certificate was issued"). This is the one field that lands on the transaction object rather than the `Certificate`. Rename (OCF stock-plan id ↔ Carta equity-plan id).
- `share_price` → `#/$defs/Certificate/properties/pricePerShare`: OCF `share_price` is `types/Monetary.schema.json` (amount + currency); `Certificate.pricePerShare` is `#/$defs/Money` (the Carta Monetary analogue). Same concept (price per share paid). The `Monetary`→`Money` field renames are handled by the dedicated `types/Monetary` mapping; here it is a straight property rename.
- `quantity` → `#/$defs/Certificate/properties/quantity`: OCF `quantity` is `types/Numeric.schema.json` (a stringified decimal share count); `Certificate.quantity` is `#/$defs/Decimal`. Same concept (shares issued), representation change only (numeric-string ↔ Decimal).
- `vesting_terms_id` → `#/$defs/Certificate/properties/vestingScheduleTemplateId`: OCF `vesting_terms_id` references the `VestingTerms` governing the security; `Certificate.vestingScheduleTemplateId` references "the vesting schedule template used by this certificate." Both are a reference to a reusable vesting-schedule definition, so this is the correct rename. (Carta has no inline per-certificate vesting-events array on `Certificate`; see `vestings` below.)
- `board_approval_date` → unmappable / `no-equivalent`: Carta records a `boardApprovalDate` **only** on `OptionGrant`, `RestrictedStockAward`, and `RestrictedStockUnit` — not on `Certificate` or `CertificateIssuanceTransaction`. A plain stock issuance lands on `Certificate`, which has no board-approval field, so this date has nowhere to go. (If the OCF issuance is in fact an RSA — `issuance_type: RSA` — a consumer might instead route the whole record to Carta's `RestrictedStockAward`, which *does* carry `boardApprovalDate`; but for the general `Certificate`-bound stock issuance modeled here there is no home.)
- `stockholder_approval_date` → unmappable / `no-equivalent`: no `stockholderApproval`/`stockholderApprovalDate` field exists anywhere in the Carta bundle (the only approval-date concept Carta exposes is `boardApprovalDate`, on grants/RSA/RSU). Dropped.
- `consideration_text` → unmappable / `no-equivalent`: OCF's free-text description of consideration provided for the issuance. Carta has no consideration/notes/text field on `Certificate` or `CertificateIssuanceTransaction` (the token "consideration" does not appear in the bundle), and `CertificateIssuanceTransaction.acquisitionCost` (`Money`) is a structured amount, not a free-text narrative — so the unstructured text cannot be losslessly parked there. Dropped.
- `security_law_exemptions` → unmappable / `no-equivalent`: OCF stores an **array** of `SecurityExemption` objects (each a free-text `description` + free-text `jurisdiction`) attached to the issuance. Carta's only securities-exemption concept is `Compliance.federalExemption`, a single `FederalExemption` **enum** value (`RULE_701`, `REG_D_506_B`, …) describing a *stakeholder's* compliance posture — and `Compliance` is an **orphan** type in this snapshot (`#/$defs/Compliance` is not `$ref`'d by any object, including `Certificate`/`CertificateIssuanceTransaction`). Three independent mismatches make this unmappable: (a) no per-issuance exemption field exists on the issuance/security objects; (b) OCF's free-text `description`/`jurisdiction` could not be enum-remapped onto Carta's closed `FederalExemption` enum without lossy guessing; (c) OCF carries an array of exemptions per issuance vs. Carta's single scalar. Dropped at the issuance level.
- `share_numbers_issued` → unmappable / `no-equivalent`: OCF's optional array of explicit share-number ranges (for non-fungible share tracking, e.g. shares 1–100). Carta has no share-number / certificate-range concept anywhere in the bundle (no `shareNumber*` fields); it tracks only aggregate `quantity` on the `Certificate`. Dropped.
- `vestings` → unmappable / `no-equivalent`: OCF's optional inline array of exact vesting dates+amounts for this specific security. `Certificate` exposes only `vestingScheduleTemplateId` (a reference to a reusable template) — it has **no** inline per-certificate vesting-events array, so the explicit one-off vesting schedule cannot be attached to the issued certificate. (Carta does model inline `vestingEvents`/`vestingSchedule` arrays, but only on `OptionGrant`/`RestrictedStockAward`/`RestrictedStockUnit`, not on `Certificate`.) `vesting_terms_id` (the template-reference path) maps; this enumerated-schedule path does not.
- `cost_basis` → unmappable / `no-equivalent`: OCF's per-stock tax cost basis (`Monetary`). No `costBasis` field exists anywhere in the Carta bundle, and `CertificateIssuanceTransaction.acquisitionCost` is the *total acquisition cost of the issuance*, not the holder's tax cost basis per share — different concept, so it is not a safe target. Dropped.
- `stock_legend_ids` → unmappable / `no-equivalent`: OCF's array of references to stock-legend objects applied to the shares. Carta has no stock-legend concept (no `legend*` tokens in the bundle). Dropped.
- `issuance_type` → unmappable / `no-equivalent`: OCF's `StockIssuanceType` enum (`RSA`, `FOUNDERS_STOCK`) flags a special character of the issuance. Carta has no equivalent flag on `Certificate`/`CertificateIssuanceTransaction`. The superficially-similar `CertificateIssuanceTransaction.issuanceReason` (`CertificateIssuanceReason` enum) describes *where the shares came from* (`ISSUED_FROM_SHARE_RESERVE`, `OPTION_EXERCISED`, `DEBT_CONVERTED`, …), not whether the stock is a restricted-stock award or founders' stock — so neither `RSA` nor `FOUNDERS_STOCK` has a member to remap onto, and an enum-remap onto `issuanceReason` would assert an unrelated provenance. Both values route to `null`. (Carta does model restricted-stock awards as a distinct `RestrictedStockAward` object; representing an OCF `issuance_type: RSA` faithfully would mean routing the entire record to `RestrictedStockAward` rather than `Certificate` — an object-level routing choice, not a field remap on this issuance.)
- `id`, `comments`, `object_type` → `ocf-internal`: standard OCF object scaffolding. `id` is OCF's transaction-object identifier (Carta assigns its own server-side keys; note `Certificate.id`/`securityId` identify the *security*, not this issuance transaction); `comments` is OCF's free-text array with no Carta slot; `object_type` is the OCF discriminator const `TX_STOCK_ISSUANCE`, which Carta does not need because it types transactions positionally per endpoint (`values.TX_STOCK_ISSUANCE: null`).
- **Unused Carta fields.** On `CertificateIssuanceTransaction`: `issueDatetime` (we target `Certificate.issueDate` to preserve date granularity), `quantity`/`acquisitionCost` (OCF carries these via `Certificate.quantity`/`pricePerShare`; `acquisitionCost` total has no OCF source here), `shareClassId`/`vestingScheduleTemplateId` (duplicated on `Certificate`, which is where we land them), `issuanceReason` and `precededBySecurityId` (provenance fields with no OCF counterpart on a plain issuance). On `Certificate`: `id`, `issuerId`, `shareClassName`, `canceledDate`/`canceledQuantity`, `returnedToPoolQuantity`/`returnedToTreasuryQuantity`, `lastModifiedDatetime`, and `precededBy` have no OCF source on this issuance object (cancellation/return/lineage state is recorded by *other* OCF transactions, and `issuerId` is supplied by the enclosing OCF cap-table context, not this transaction).

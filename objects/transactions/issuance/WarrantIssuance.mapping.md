---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/issuance/WarrantIssuance.schema.json
ocf_object_type: TX_WARRANT_ISSUANCE
ocf_title: Object - Warrant Issuance Transaction
ocf_kind: object
required_fields:
  - exercise_triggers
  - purchase_price
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

# Object - Warrant Issuance Transaction → Carta

> Object describing warrant issuance transaction by the issuer and held by a stakeholder

## OCF schema

Source: [`WarrantIssuance.schema.json`](./WarrantIssuance.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/issuance/WarrantIssuance.schema.json",
  "title": "Object - Warrant Issuance Transaction",
  "description": "Object describing warrant issuance transaction by the issuer and held by a stakeholder",
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
      "const": "TX_WARRANT_ISSUANCE"
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
    "quantity": {
      "description": "Quantity of shares the warrant is exercisable for",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Numeric.schema.json"
    },
    "exercise_price": {
      "description": "The exercise price of the warrant",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Monetary.schema.json"
    },
    "purchase_price": {
      "description": "Actual purchase price of the warrant (sum up purported value of all consideration, including in-kind)",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Monetary.schema.json"
    },
    "exercise_triggers": {
      "title": "Warrant Issuance - Exercise Trigger Array",
      "description": "In event the Warrant can convert due to trigger events (e.g. Maturity, Next Qualified Financing, Change of Control, at Election of Holder), what are the terms?",
      "type": "array",
      "items": {
        "anyOf": [
          {
            "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_triggers/AutomaticConversionOnConditionTrigger.schema.json"
          },
          {
            "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_triggers/AutomaticConversionOnDateTrigger.schema.json"
          },
          {
            "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_triggers/ElectiveConversionAtWillTrigger.schema.json"
          },
          {
            "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_triggers/ElectiveConversionInDateRangeTrigger.schema.json"
          },
          {
            "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_triggers/ElectiveConversionOnConditionTrigger.schema.json"
          },
          {
            "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_triggers/UnspecifiedConversionTrigger.schema.json"
          }
        ]
      }
    },
    "warrant_expiration_date": {
      "description": "What is expiration date of the warrant (if applicable)",
      "$comment": "This may not be necessary as it can be expressed with the exercise_triggers",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "vesting_terms_id": {
      "description": "Identifier of the VestingTerms to which this security is subject. If neither `vesting_terms_id` or `vestings` are present then the security is fully vested on issuance.",
      "type": "string"
    },
    "vestings": {
      "title": "Warrant Issuance - Vestings Array",
      "description": "List of exact vesting dates and amounts for this security. When `vestings` array is present then `vesting_terms_id` may be ignored.",
      "type": "array",
      "minItems": 1,
      "items": {
        "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Vesting.schema.json"
      }
    },
    "quantity_source": {
      "description": "If quantity is provided, use this to specify where the number came from - e.g. was it a fixed value from the instrument (`INSTRUMENT_FIXED`), a human estimate (`HUMAN_ESTIMATED`), etc. If quantity is provided and this field is not, this is assumed to be `UNSPECIFIED`",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/QuantitySourceType.schema.json",
      "default": "UNSPECIFIED"
    }
  },
  "additionalProperties": false,
  "required": [
    "exercise_triggers",
    "purchase_price",
    "id",
    "object_type",
    "date",
    "security_id",
    "security_law_exemptions",
    "stakeholder_id",
    "custom_id"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/issuance/WarrantIssuance.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
status: complete
coverage: 19/19

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
      TX_WARRANT_ISSUANCE: null
  date:
    kind: rename
    target: "#/$defs/WarrantIssuanceTransaction/properties/issueDatetime"
  security_id:
    kind: rename
    target: "#/$defs/WarrantTransactionItem/properties/securityId"
  custom_id:
    kind: rename
    target: "#/$defs/WarrantTransactionItem/properties/securityLabel"
  stakeholder_id:
    kind: rename
    target: "#/$defs/WarrantTransactionItem/properties/stakeholderId"
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
    kind: computed
    target: "#/$defs/Compliance/properties/federalExemption"
  quantity:
    kind: rename
    target: "#/$defs/WarrantIssuanceTransaction/properties/quantity"
  exercise_price:
    kind: rename
    target: "#/$defs/WarrantIssuanceTransaction/properties/exercisePrice"
  purchase_price:
    kind: rename
    target: "#/$defs/WarrantIssuanceTransaction/properties/purchasePrice"
  exercise_triggers:
    kind: unmappable
    target: null
    reason: no-equivalent
  warrant_expiration_date:
    kind: rename
    target: "#/$defs/WarrantIssuanceTransaction/properties/expirationDatetime"
  vesting_terms_id:
    kind: rename
    target: "#/$defs/WarrantIssuanceTransaction/properties/vestingScheduleTemplateId"
  vestings:
    kind: unmappable
    target: null
    reason: no-equivalent
  quantity_source:
    kind: unmappable
    target: null
    reason: no-equivalent
    values:
      HUMAN_ESTIMATED: null
      MACHINE_ESTIMATED: null
      UNSPECIFIED: null
      INSTRUMENT_FIXED: null
      INSTRUMENT_MAX: null
      INSTRUMENT_MIN: null
```

## Notes / open questions

- **Bucket: n/a-object.** This is an OCF transaction object (`ocf_kind: object`), so it maps its properties directly onto the corresponding Carta object rather than being bucket-classified as a reusable type. The clear Carta home is `#/$defs/WarrantIssuanceTransaction` ("The issuance transaction for a warrant. Represents the initial issuance of a warrant."), whose economic fields are `issueDatetime`, `quantity`, `exercisePrice`, `purchasePrice`, `shareClassId`, `vestingScheduleTemplateId`, and `expirationDatetime`.
- **Structural model: OCF flat transactions vs. Carta warrant-nested items.** OCF emits the issuance as a standalone transaction object keyed by its own `id` and referencing the security by `security_id`. Carta instead nests the issuance under the warrant it belongs to: `#/$defs/WarrantTransactionItem` ("A warrant with its full transaction history") carries the warrant's identity (`securityId`, `stakeholderId`, `securityLabel`) and holds the single `issuance` record (`WarrantIssuanceTransaction`) plus the `exercises[]`, `transfers[]`, and `cancellations[]` arrays. That is why the *identity* fields (`security_id`, `custom_id`, `stakeholder_id`) route to `WarrantTransactionItem` while the *economic* fields route to `WarrantIssuanceTransaction`. A consumer building Carta data creates one `WarrantTransactionItem` per warrant and places this OCF transaction in its `issuance` slot.
- **`date` -> `issueDatetime` (granularity change).** OCF `date` is a calendar DATE (`types/Date.schema.json`, `YYYY-MM-DD`). Carta's `issueDatetime` is `#/$defs/Iso8601CompleteCalendarDateTime` — a full date-time. The mapping is lossy in the time-of-day direction: OCF carries no time component, so producing the Carta value requires padding with a zero/placeholder time (e.g. midnight). Same applies to `warrant_expiration_date` -> `expirationDatetime` below.
- **`custom_id` -> `securityLabel`.** OCF's `custom_id` is the human-readable per-security identifier (e.g. "CN-1"); Carta's `WarrantTransactionItem.securityLabel` is exactly that ("The human-readable label for the warrant (e.g. \"W-3\")"). OCF's machine `security_id` is kept distinct and routes to `WarrantTransactionItem.securityId`.
- **`quantity` / `exercise_price` / `purchase_price` -> `WarrantIssuanceTransaction` (clean renames).** OCF `quantity` (`types/Numeric.schema.json`) -> Carta `quantity` (`Decimal`); OCF `exercise_price` (`types/Monetary.schema.json`) -> Carta `exercisePrice` (`Money`); OCF `purchase_price` (`Monetary`) -> Carta `purchasePrice` (`Money`). The Monetary->Money and Numeric->Decimal correspondences are the standard bucket-1 type renames (see `types/Monetary.mapping.md`).
- **`vesting_terms_id` -> `vestingScheduleTemplateId`.** Both reference a vesting-schedule definition by id rather than inlining vesting events. OCF's `vesting_terms_id` points at a `VestingTerms` object; Carta's `vestingScheduleTemplateId` ("The identifier of the vesting schedule template. May be absent if the warrant has no vesting schedule.") plays the identical role on the warrant issuance.
- **`vestings` (unmappable / no-equivalent).** OCF lets a security inline an explicit array of exact vesting dates/amounts (`types/Vesting.schema.json`) as an *alternative* to `vesting_terms_id`. Carta's `WarrantIssuanceTransaction` only exposes the by-reference `vestingScheduleTemplateId`; it has no inline per-date vesting-event array on the warrant issuance, so an OCF warrant that uses `vestings` instead of a template has no place to land its explicit schedule. (Carta models inline vesting events elsewhere, e.g. `OptionGrant.vestingEvents`, but the warrant issuance surface offers no such field.)
- **`exercise_triggers` (unmappable / no-equivalent).** OCF carries an array of conversion/exercise-trigger objects (`AutomaticConversionOnConditionTrigger`, `AutomaticConversionOnDateTrigger`, `ElectiveConversionAtWillTrigger`, `ElectiveConversionInDateRangeTrigger`, `ElectiveConversionOnConditionTrigger`, `UnspecifiedConversionTrigger`) describing the full event-logic state machine under which the warrant becomes exercisable (maturity, next qualified financing, change of control, at election of holder, AND/OR conditions, date ranges, etc.). Carta records warrant *terms* as flat fields and does not model this trigger state machine; the only term it surfaces from that bundle is the expiration date (handled separately via `warrant_expiration_date` -> `expirationDatetime`). The structural/event-logic content (conditions, trigger dates, capitalization-definition references, MFN, AND/OR composition) has no Carta counterpart and is dropped. This is the same "Carta records terms, not OCF's full conversion-trigger state machine" gap noted on the convertible/warrant conversion mappings.
- **`security_law_exemptions` -> `Compliance.federalExemption` (computed).** OCF carries an ARRAY of structured `SecurityExemption` objects, each `{description (free text), jurisdiction (free text)}`, on the warrant transaction. Carta's only security-law surface is the single, closed `FederalExemption` enum on `#/$defs/Compliance/properties/federalExemption`. As on the sibling convertible/equity-comp issuance mappings, this field DOES have a home and is mapped `computed` (not `unmappable`), with a lossy export transform: (a) the OCF array must collapse to one value (Carta records a single federal exemption, not a list); (b) each OCF `description` is free text that must be classified into a `FederalExemption` member (e.g. a Reg D 506(b) description -> `REG_D_506_B`; with no clean member it falls to `OTHER`/`NON_US`); (c) the OCF `jurisdiction` free text has no Carta slot and is dropped (Carta's federal exemption is implicitly US-federal; non-US jurisdictions route to `NON_US`). It is `computed` rather than `enum-remap` because the OCF source is free text with no source enum to enumerate value-by-value. Note that `Compliance` is a stakeholder-compliance object in Carta and is not nested under `WarrantIssuanceTransaction`/`WarrantTransactionItem` (no Carta def `$ref`s `Compliance`), so even the surviving value is denormalized away from the warrant transaction onto the holder's `Compliance` record — consistent with how `ConvertibleIssuance`/`EquityCompensationIssuance` route the same field. (`StockIssuance` currently leaves it `unmappable`; the convertible/equity-comp/warrant treatment is the more complete one.)
- **`board_approval_date` / `stockholder_approval_date` (unmappable / no-equivalent).** OCF records governance-approval dates on the security. Carta has a `boardApprovalDate` ONLY on `#/$defs/OptionGrant` (equity-comp grants); neither `WarrantIssuanceTransaction` nor `WarrantTransactionItem` carries a board-approval field, and there is no stockholder-approval field anywhere in the Carta bundle. Both approval dates are therefore dropped for warrants.
- **`consideration_text` (unmappable / no-equivalent).** OCF stores an unstructured free-text description of the consideration provided in exchange for the issuance. Carta's `WarrantIssuanceTransaction`/`WarrantTransactionItem` have no consideration/notes/text slot (their fields are listed above), so the narrative has no home and is dropped. The structured `purchasePrice` captures the numeric value but not the free-text consideration description.
- **`quantity_source` (unmappable / no-equivalent).** OCF's `QuantitySourceType` enum (`HUMAN_ESTIMATED`, `MACHINE_ESTIMATED`, `UNSPECIFIED`, `INSTRUMENT_FIXED`, `INSTRUMENT_MAX`, `INSTRUMENT_MIN`) is provenance metadata describing where the `quantity` value came from. Carta has no quantity-provenance concept anywhere in the bundle (no `quantitySource`-style field on the warrant issuance or elsewhere), so every enum value maps to null and the field is dropped.
- **`id`, `comments`, `object_type` (ocf-internal).** Standard OCF object scaffolding. `id` is OCF's own transaction-object identifier (Carta keys the warrant via `WarrantTransactionItem.securityId` and assigns its own ids server-side); `comments` is OCF's free-text array with no Carta slot; `object_type` is the OCF discriminator const `TX_WARRANT_ISSUANCE` — Carta types positionally (the record's place in `WarrantTransactionItem.issuance` already identifies it as the warrant's issuance), so there is nothing to remap the const onto (`values.TX_WARRANT_ISSUANCE: null`).
- **Carta fields with no OCF source.** `WarrantIssuanceTransaction.shareClassId` ("The identifier of the share class associated with the warrant") has no counterpart on OCF's `WarrantIssuance` transaction — OCF's warrant issuance does not name a share class on the transaction itself (any underlying-class linkage lives on referenced security/warrant terms, not on this object). It is simply absent from the OCF source side and so does not appear in the field map.

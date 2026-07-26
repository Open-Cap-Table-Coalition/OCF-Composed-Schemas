---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/issuance/ConvertibleIssuance.schema.json
ocf_object_type: TX_CONVERTIBLE_ISSUANCE
ocf_title: Object - Convertible Issuance Transaction
ocf_kind: object
required_fields:
  - convertible_type
  - investment_amount
  - conversion_triggers
  - seniority
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

# Object - Convertible Issuance Transaction → Carta

> Object describing convertible instrument issuance transaction by the issuer and held by a stakeholder

## OCF schema

Source: [`ConvertibleIssuance.schema.json`](./ConvertibleIssuance.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/issuance/ConvertibleIssuance.schema.json",
  "title": "Object - Convertible Issuance Transaction",
  "description": "Object describing convertible instrument issuance transaction by the issuer and held by a stakeholder",
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
      "const": "TX_CONVERTIBLE_ISSUANCE"
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
    "investment_amount": {
      "description": "Amount invested and outstanding on date of issuance of this convertible",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Monetary.schema.json"
    },
    "convertible_type": {
      "description": "What kind of convertible instrument is this (of the supported, enumerated types)",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/ConvertibleType.schema.json"
    },
    "conversion_triggers": {
      "title": "Convertible - Conversion Trigger Array",
      "description": "In event the convertible can convert due to trigger events (e.g. Maturity, Next Qualified Financing, Change of Control, at Election of Holder), what are the terms?",
      "type": "array",
      "minItems": 1,
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
    "pro_rata": {
      "description": "What pro-rata (if any) is the holder entitled to buy at the next round?",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Numeric.schema.json"
    },
    "seniority": {
      "description": "If different convertible instruments have seniorty over one another, use this value to build a seniority stack, with 1 being highest seniority and equal seniority values assumed to be equal priority",
      "type": "integer"
    }
  },
  "additionalProperties": false,
  "required": [
    "convertible_type",
    "investment_amount",
    "conversion_triggers",
    "seniority",
    "id",
    "object_type",
    "date",
    "security_id",
    "security_law_exemptions",
    "stakeholder_id",
    "custom_id"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/issuance/ConvertibleIssuance.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | select | split | sequential_transform | combine | enum-remap | computed | unmappable | TODO
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
    reason: ocf-internal
    values:
      TX_CONVERTIBLE_ISSUANCE: null
  date:
    kind: rename
    target:
      - "#/$defs/ConvertibleIssuanceTransaction/properties/issueDatetime"
      - "#/$defs/ConvertibleNote/properties/issueDatetime"
  security_id:
    kind: rename
    target:
      - "#/$defs/ConvertibleTransactionItem/properties/securityId"
      - "#/$defs/ConvertibleNote/properties/securityId"
  custom_id:
    kind: rename
    target:
      - "#/$defs/ConvertibleTransactionItem/properties/securityLabel"
      - "#/$defs/ConvertibleNote/properties/securityLabel"
  stakeholder_id:
    kind: rename
    target:
      - "#/$defs/ConvertibleTransactionItem/properties/stakeholderId"
      - "#/$defs/ConvertibleNote/properties/stakeholderId"
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
  investment_amount:
    kind: rename
    target: "#/$defs/ConvertibleIssuanceTransaction/properties/principal"
  convertible_type:
    kind: enum-remap
    target: "#/$defs/NoteBlock/properties/noteType"
    values:
      NOTE: CONVERTIBLE_DEBT
      SAFE: SAFE
      CONVERTIBLE_SECURITY: CONVERTIBLE_EQUITY
  conversion_triggers:
    kind: sequential_transform
    steps:
      - kind: select
        policy: first_trigger_with_economic_terms
        source: "/conversion_right"
      - kind: apply_mapping
        mapping: types/conversion_rights/ConvertibleConversionRight.mapping.md
        targets:
          - "#/$defs/ConvertibleIssuanceTransaction/properties/conversionTrigger"
          - "#/$defs/ConvertibleIssuanceTransaction/properties/discountPercentage"
          - "#/$defs/ConvertibleIssuanceTransaction/properties/valuationCap"
          - "#/$defs/ConvertibleIssuanceTransaction/properties/interestRate"
          - "#/$defs/ConvertibleIssuanceTransaction/properties/interestAccrualPeriod"
          - "#/$defs/ConvertibleIssuanceTransaction/properties/interestCompoundingPeriod"
          - "#/$defs/ConvertibleIssuanceTransaction/properties/dayCountBasis"
          - "#/$defs/ConvertibleNote/properties/conversionTrigger"
          - "#/$defs/ConvertibleNote/properties/discountPercentage"
          - "#/$defs/ConvertibleNote/properties/priceCap"
          - "#/$defs/ConvertibleNote/properties/interestRate"
          - "#/$defs/ConvertibleNote/properties/interestAccrualPeriod"
          - "#/$defs/ConvertibleNote/properties/interestCompoundingPeriod"
          - "#/$defs/ConvertibleNote/properties/dayCountBasis"
  pro_rata:
    kind: unmappable
    target: null
    reason: no-equivalent
  seniority:
    kind: unmappable
    target: null
    reason: no-equivalent
```

## Ask a mapping question

Use a link below to open a prefilled GitHub issue. The issue can be copied into the auditable checklist in `## Notes / open questions`.

<details>
<summary>Open a prefilled issue for a property</summary>

<!-- mapping-question-links:start -->
| Source property | Action |
| --- | --- |
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fissuance%2FConvertibleIssuance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fissuance%2FConvertibleIssuance.mapping.md&title=%5BMapping+question%5D+ConvertibleIssuance) |
| `id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fissuance%2FConvertibleIssuance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fissuance%2FConvertibleIssuance.mapping.md&title=%5BMapping+question%5D+ConvertibleIssuance%3A+id&property_path=id) |
| `comments` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fissuance%2FConvertibleIssuance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fissuance%2FConvertibleIssuance.mapping.md&title=%5BMapping+question%5D+ConvertibleIssuance%3A+comments&property_path=comments) |
| `object_type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fissuance%2FConvertibleIssuance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fissuance%2FConvertibleIssuance.mapping.md&title=%5BMapping+question%5D+ConvertibleIssuance%3A+object_type&property_path=object_type) |
| `date` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fissuance%2FConvertibleIssuance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fissuance%2FConvertibleIssuance.mapping.md&title=%5BMapping+question%5D+ConvertibleIssuance%3A+date&property_path=date) |
| `security_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fissuance%2FConvertibleIssuance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fissuance%2FConvertibleIssuance.mapping.md&title=%5BMapping+question%5D+ConvertibleIssuance%3A+security_id&property_path=security_id) |
| `custom_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fissuance%2FConvertibleIssuance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fissuance%2FConvertibleIssuance.mapping.md&title=%5BMapping+question%5D+ConvertibleIssuance%3A+custom_id&property_path=custom_id) |
| `stakeholder_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fissuance%2FConvertibleIssuance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fissuance%2FConvertibleIssuance.mapping.md&title=%5BMapping+question%5D+ConvertibleIssuance%3A+stakeholder_id&property_path=stakeholder_id) |
| `board_approval_date` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fissuance%2FConvertibleIssuance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fissuance%2FConvertibleIssuance.mapping.md&title=%5BMapping+question%5D+ConvertibleIssuance%3A+board_approval_date&property_path=board_approval_date) |
| `stockholder_approval_date` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fissuance%2FConvertibleIssuance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fissuance%2FConvertibleIssuance.mapping.md&title=%5BMapping+question%5D+ConvertibleIssuance%3A+stockholder_approval_date&property_path=stockholder_approval_date) |
| `consideration_text` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fissuance%2FConvertibleIssuance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fissuance%2FConvertibleIssuance.mapping.md&title=%5BMapping+question%5D+ConvertibleIssuance%3A+consideration_text&property_path=consideration_text) |
| `security_law_exemptions` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fissuance%2FConvertibleIssuance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fissuance%2FConvertibleIssuance.mapping.md&title=%5BMapping+question%5D+ConvertibleIssuance%3A+security_law_exemptions&property_path=security_law_exemptions) |
| `investment_amount` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fissuance%2FConvertibleIssuance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fissuance%2FConvertibleIssuance.mapping.md&title=%5BMapping+question%5D+ConvertibleIssuance%3A+investment_amount&property_path=investment_amount) |
| `convertible_type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fissuance%2FConvertibleIssuance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fissuance%2FConvertibleIssuance.mapping.md&title=%5BMapping+question%5D+ConvertibleIssuance%3A+convertible_type&property_path=convertible_type) |
| `conversion_triggers` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fissuance%2FConvertibleIssuance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fissuance%2FConvertibleIssuance.mapping.md&title=%5BMapping+question%5D+ConvertibleIssuance%3A+conversion_triggers&property_path=conversion_triggers) |
| `pro_rata` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fissuance%2FConvertibleIssuance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fissuance%2FConvertibleIssuance.mapping.md&title=%5BMapping+question%5D+ConvertibleIssuance%3A+pro_rata&property_path=pro_rata) |
| `seniority` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fissuance%2FConvertibleIssuance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fissuance%2FConvertibleIssuance.mapping.md&title=%5BMapping+question%5D+ConvertibleIssuance%3A+seniority&property_path=seniority) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- **Object-level routing.** This OCF transaction is the initial issuance of a convertible instrument. Carta models the convertible lifecycle as a `ConvertibleTransactionItem` whose `issuance` is a `ConvertibleIssuanceTransaction` and whose holding/terms live on the parent `ConvertibleNote` (the same two-object pair the `ConvertibleConversion` mapping routes its cancellation through). So this object maps to the issuance transaction, the enclosing transaction item, and the `ConvertibleNote` it issues: identity/holder fields and duplicated lifecycle/economic terms are deliberately replicated where Carta exposes both a transaction-level and security-level slot.
- `date`: OCF's transaction date (the issuance event) maps to both `ConvertibleIssuanceTransaction.issueDatetime` and `ConvertibleNote.issueDatetime`. **Granularity note:** OCF `date` is a calendar `Date` (`YYYY-MM-DD`); Carta's `issueDatetime` is an `Iso8601CompleteCalendarDateTime`, so a time component must be synthesized on export.
- `security_id`: the OCF identifier by which all later transactions reference this convertible → both `ConvertibleTransactionItem.securityId` and `ConvertibleNote.securityId` ("the UUID of the convertible note … cross-reference with the List Transactions API"). The parent copy is the transaction-history join/placement key; the note copy is the security object's identity. `ConvertibleIssuanceTransaction` itself carries no security id because it is positioned inside the parent item's `issuance` slot.
- `custom_id`: OCF's human-readable security label (e.g. `CN-1`) → both `ConvertibleTransactionItem.securityLabel` and `ConvertibleNote.securityLabel` ("the label representing this security (convertible note)"). This is the closest Carta analogue to OCF's custom display id; it is not the server UUID (`securityId`).
- `stakeholder_id`: holder of legal title → both `ConvertibleTransactionItem.stakeholderId` and `ConvertibleNote.stakeholderId` ("the identifier of the stakeholder holding the convertible note"). The parent copy keeps the transaction item self-describing while the note copy remains the security-level holder field.
- `investment_amount`: OCF's `Monetary` principal invested and outstanding at issuance → `ConvertibleIssuanceTransaction.principal` (`Money`). The context surface also lists `ConvertibleIssuanceTransaction.principal` as the convertible-issuance principal home, and `ConvertibleCancellationTransaction.principal` mirrors it on cancellation. (`ConvertibleNote` exposes `cashPaid`/`interest`, not principal, so the transaction-level `principal` is the correct home.) Both sides are amount-with-currency, so the OCF `Monetary {amount, currency}` maps field-for-field onto Carta `Money`.
- `security_law_exemptions` → **computed** to `Compliance.federalExemption`. OCF carries an **array** of structured `SecurityExemption` objects, each `{description (free text), jurisdiction (free text)}`. Carta's only security-law surface is the single, closed `FederalExemption` **enum** on `Compliance.federalExemption`. The mapping is lossy and requires a transform on export: (a) the OCF array must collapse to a single value (Carta records one federal exemption, not a list); (b) each OCF `description` is free text that must be classified into a `FederalExemption` member (e.g. a Reg D 506(b) description → `REG_D_506_B`), with no clean member it falls to `OTHER`/`NON_US`; (c) the OCF `jurisdiction` free-text has no Carta slot and is dropped (Carta's federal exemption is implicitly US-federal; non-US jurisdictions would map to `NON_US`). Because the OCF source is free text (no source enum to enumerate value-by-value), this is `computed`, not `enum-remap`. Note also that `Compliance` is a *stakeholder-compliance* object in Carta, not a per-issuance field, so even the surviving value is denormalized away from the transaction.
- `convertible_type` → **enum-remap** to `NoteBlock.noteType` (the `NoteType` enum, reached via `ConvertibleNote.noteBlock` → `NoteBlock.noteType`). OCF distinguishes `NOTE` / `SAFE` / `CONVERTIBLE_SECURITY`; Carta DOES carry an instrument-type discriminator — the `NoteType` enum `{DEBT, CONVERTIBLE_DEBT, CONVERTIBLE_EQUITY, SAFE, ASA}` on the note block every `ConvertibleNote` belongs to. Value mapping: `SAFE → SAFE` (exact); `NOTE → CONVERTIBLE_DEBT` (an interest-bearing convertible note is convertible debt — the note-centric fields `interestRate`/`interestAccrualPeriod`/`dayCountBasis`/`maturityDatetime` are exactly the debt terms); `CONVERTIBLE_SECURITY → CONVERTIBLE_EQUITY` (OCF's catch-all non-note, non-SAFE convertible security; Carta's `CONVERTIBLE_EQUITY` is the closest non-debt, non-SAFE convertible member). Carta's `DEBT` (straight, non-convertible debt) and `ASA` (advance subscription agreement) have no OCF `convertible_type` counterpart and are unused. **Granularity note:** `noteType` lives on the shared `NoteBlock` (a grouping above the individual note), so the value is denormalized off the per-issuance transaction onto the block.
- `conversion_triggers` → **sequential transform**: select the first trigger carrying convertible economic terms under policy `first_trigger_with_economic_terms`, take its nested `conversion_right`, then apply [`ConvertibleConversionRight.mapping.md`](../../../types/conversion_rights/ConvertibleConversionRight.mapping.md). This gives the mapping DSL an explicit pipeline for the nested `NoteConversionMechanism` terms: `interest_rates[].rate` (first applicable rate), accrual period, compounding type, and day-count convention populate the corresponding `ConvertibleIssuanceTransaction` and `ConvertibleNote` fields. The existing discount/cap/threshold fan-out is retained, with `valuationCap` on the issuance transaction and `priceCap` on the note. Additional trigger graph structure, trigger dates, ordering, MFN, and capitalization-definition details remain outside Carta's model.
- **Accrued interest is a separate gap.** Carta's `ConvertibleNote.interest` is a `Money` balance, while OCF's note mechanism supplies a rate schedule rather than an accrued amount. The rate cannot be copied into that Money slot; calculating it would require principal, accrual windows, day-count/compounding rules, and an as-of date.
- [ ] `conversion_triggers[].trigger_date` / `conversion_triggers[].end_date`: When the source metadata explicitly identifies a trigger or date-window boundary as the instrument's maturity, should that date populate `ConvertibleNote.maturityDatetime` (and the mirrored issuance-transaction slot)?
  - Target: ConvertibleNote.maturityDatetime
  - Asked by: @johnscrudato
  - Answer: Open: `trigger_date` is also used for scheduled conversion and `end_date` for elective conversion windows, so a generic date-to-maturity mapping would be semantically unsafe. A conditional “explicitly maturity” policy may be appropriate.
  - Answered by: —
- [ ] `conversion_triggers[].trigger_date` / `conversion_triggers[].end_date`: If the source metadata explicitly identifies a maturity event, should the same date also populate the mirrored issuance transaction field?
  - Target: ConvertibleIssuanceTransaction.maturityDatetime
  - Asked by: @johnscrudato
  - Answer: Open: same semantic guard as the note-level field; the source date must be identified as maturity rather than a scheduled conversion or elective-window boundary.
  - Answered by: —
- [ ] `conversion_triggers[].conversion_right.conversion_mechanism.interest_rates[].rate`: Should an external accrued-interest calculation populate Carta `ConvertibleNote.interest`, or is the intended mapping limited to the rate terms (`interestRate`, accrual period, compounding period, and day-count basis)?
  - Target: ConvertibleNote.interest
  - Asked by: @johnscrudato
  - Answer: Open: the OCF source contains no accrued `Money` amount or as-of date, so direct mapping to Carta's `interest` balance is not currently justified.
  - Answered by: —
- `pro_rata` → **unmappable / no-equivalent.** OCF records the holder's pro-rata participation right at the next round (`Numeric`). Carta's `ConvertibleNote` / `ConvertibleIssuanceTransaction` expose no pro-rata / follow-on / participation-right field; the concept is absent from the convertible model, so it is dropped.
- `seniority` → **unmappable / no-equivalent.** OCF uses an integer rank to build a seniority stack across convertibles. Carta's convertible objects carry no seniority/priority/rank field (the only ordering-ish concept, `changeInControlPercent`, is unrelated), so the seniority stack cannot be represented.
- `board_approval_date`, `stockholder_approval_date`: **unmappable / no-equivalent.** Carta's convertible issuance/note objects record only the economic and lifecycle datetimes (`issueDatetime`, `maturityDatetime`, `conversionDatetime`, `canceledDatetime`); there is no board- or stockholder-approval date anywhere on the convertible objects.
- `consideration_text`: **unmappable / no-equivalent.** OCF's free-text consideration description has no slot on either the issuance transaction or the note (the only monetary fields are typed `Money`/`Decimal`), so the prose is dropped.
- `id`, `comments`, `object_type`: OCF object scaffolding. `id` is OCF's own identifier (Carta assigns ids server-side and positions the issuance inside `ConvertibleTransactionItem`); `comments` has no Carta slot; `object_type` is a positional discriminator (`TX_CONVERTIBLE_ISSUANCE`) Carta does not store as a field — its placement as the `issuance` member of `ConvertibleTransactionItem` is the discriminator, not a mappable value, so the `values` entry is null.

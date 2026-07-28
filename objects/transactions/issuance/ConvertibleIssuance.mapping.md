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
target_version: "v1alpha1 (2026-06-22)"
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
      - "#/$defs/ConvertibleNote/properties/id"
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
    kind: unmappable
    target: null
    reason: target-definition-removed
  investment_amount:
    kind: rename
    target:
      - "#/$defs/ConvertibleIssuanceTransaction/properties/principal"
      - "#/$defs/ConvertibleNote/properties/cashPaid"
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
        policy: first_convertible_trigger_with_economic_terms
        source: "/conversion_right"
        where:
          path: "/type"
          equals: CONVERTIBLE_CONVERSION_RIGHT
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

- `ConvertibleIssuance` maps to `ConvertibleIssuanceTransaction`, `ConvertibleTransactionItem`, and `ConvertibleNote`: date, security/stakeholder identity, custom label, and investment amount populate the corresponding records.
- `convertible_type` remaps to the note type; the first conversion right with economic terms is transformed into conversion, discount, valuation-cap, interest, and interest-period fields. Security-law exemptions are explicitly excluded because `Compliance` was removed. The June 22 `ConvertibleNote` also requires `id`, `issuerId`, `interest`, and `noteBlock`; `id` is sourced from the security identity, while issuer context and the missing accrued-interest/note-block container remain explicit Carta-side requirements.
- Approval dates, consideration, `pro_rata`, and `seniority` have no target. `id`, `comments`, and `object_type` are OCF scaffolding.

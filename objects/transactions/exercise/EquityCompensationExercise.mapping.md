---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/exercise/EquityCompensationExercise.schema.json
ocf_object_type: null
ocf_title: Object - Equity Compensation Exercise Transaction
ocf_kind: object
required_fields:
  - quantity
  - id
  - object_type
  - date
  - security_id
  - resulting_security_ids
target_standard: Carta
target_version: "v1alpha1 (2026-06-22)"
status: complete
last_generated: 2026-05-18
---

# Object - Equity Compensation Exercise Transaction → Carta

> Object describing equity compensation exercise transaction

## OCF schema

Source: [`EquityCompensationExercise.schema.json`](./EquityCompensationExercise.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/exercise/EquityCompensationExercise.schema.json",
  "title": "Object - Equity Compensation Exercise Transaction",
  "description": "Object describing equity compensation exercise transaction",
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
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/exercise/Exercise.schema.json"
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
      "enum": [
        "TX_PLAN_SECURITY_EXERCISE",
        "TX_EQUITY_COMPENSATION_EXERCISE"
      ],
      "description": "This is done to avoid a breaking change as we work towards a bigger restructure of the equity types in v2.0.0. `TX_PLAN_SECURITY_EXERCISE` will be deprecated in v2.0.0"
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
      "description": "Unstructured text description of consideration provided in exchange for security exercise",
      "type": "string"
    },
    "resulting_security_ids": {
      "title": "Security Exercise - Resulting Security ID Array",
      "description": "Identifier for the security (or securities) that resulted from the exercise",
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "quantity": {
      "description": "Quantity of shares exercised",
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
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/exercise/EquityCompensationExercise.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
# routing: route_by_property (downstream join). This exercise carries only
# security_id and NO discriminator, so the Carta exercise family is undecidable
# from the record alone: it is resolved by joining security_id back to the
# EquityCompensationIssuance and reading that issuance's compensation_type.
# Options/SARs exercise; an OCF exercise against an RSU is semantically invalid
# (RSUs settle via Release, they are not exercised) so the Rsu family has no
# Carta exercise tx and is wholly unmappable here.
# See docs/polymorphic-transaction-routing.md §2.2/§4.3.
status: complete

route_by_property:
  lookup_by:
    key: security_id
    through:
      mapping: ../issuance/EquityCompensationIssuance.mapping.md
      on_property: compensation_type
  exhaustive: true

# shared: fields whose Carta home differs by family carry a per-variant target map
# { Option/Rsu/Sar: pointer or pointer list }. Rsu and Sar are null on every routed field —
# the June 22 bundle has no exercise transaction target for either family.
shared:
  id:                 { kind: unmappable, target: null, reason: ocf-internal }
  comments:           { kind: unmappable, target: null, reason: no-equivalent }
  object_type:        { kind: unmappable, target: null, reason: no-equivalent }
  security_id:
    kind: rename
    target:
      Option:
        - "#/$defs/OptionTransactionItem/properties/securityId"
        - "#/$defs/OptionGrant/properties/id"
        - "#/$defs/OptionGrant/properties/securityId"
      Sar:    null
      Rsu:    null
  consideration_text: { kind: unmappable, target: null, reason: no-equivalent }
  date:
    kind: rename
    target:
      Option:
        - "#/$defs/OptionExerciseTransaction/properties/sharesAcquiredDatetime"
        - "#/$defs/Exercise/properties/exerciseDate"
      Sar:    null
      Rsu:    null
  quantity:
    kind: rename
    target:
      Option:
        - "#/$defs/OptionExerciseTransaction/properties/quantity"
        - "#/$defs/Exercise/properties/quantity"
        - "#/$defs/OptionGrant/properties/exercisedQuantity"
      Sar:    null
      Rsu:    null
  resulting_security_ids:
    kind: computed                 # result identity plus lineage on each resulting certificate
    target:
      Option:
        - "#/$defs/Certificate/properties/id"
        - "#/$defs/Certificate/properties/securityId"
        - "#/$defs/CertificatePrecededBy/properties/securities"
        - "#/$defs/Exercise/properties/certificateId"
      Sar:
        - "#/$defs/Certificate/properties/id"
        - "#/$defs/Certificate/properties/securityId"
        - "#/$defs/CertificatePrecededBy/properties/securities"
      Rsu:    null

variants:

  Option:
    when: [OPTION, OPTION_NSO, OPTION_ISO]
    primary_targets:
      - "#/$defs/OptionExerciseTransaction"
      - "#/$defs/OptionTransactionItem"
    fields: {}

  Rsu:
    when: [RSU]
    primary_targets: null
    fields: {}

  Sar:
    when: [CSAR, SSAR]
    primary_targets: null
    fields: {}

 ```

## Ask a mapping question

Use a link below to open a prefilled GitHub issue. The issue can be copied into the auditable checklist in `## Notes / open questions`.

<details>
<summary>Open a prefilled issue for a property</summary>

<!-- mapping-question-links:start -->
| Source property | Action |
| --- | --- |
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fexercise%2FEquityCompensationExercise.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fexercise%2FEquityCompensationExercise.mapping.md&title=%5BMapping+question%5D+EquityCompensationExercise) |
| `id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fexercise%2FEquityCompensationExercise.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fexercise%2FEquityCompensationExercise.mapping.md&title=%5BMapping+question%5D+EquityCompensationExercise%3A+id&property_path=id) |
| `comments` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fexercise%2FEquityCompensationExercise.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fexercise%2FEquityCompensationExercise.mapping.md&title=%5BMapping+question%5D+EquityCompensationExercise%3A+comments&property_path=comments) |
| `object_type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fexercise%2FEquityCompensationExercise.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fexercise%2FEquityCompensationExercise.mapping.md&title=%5BMapping+question%5D+EquityCompensationExercise%3A+object_type&property_path=object_type) |
| `date` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fexercise%2FEquityCompensationExercise.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fexercise%2FEquityCompensationExercise.mapping.md&title=%5BMapping+question%5D+EquityCompensationExercise%3A+date&property_path=date) |
| `security_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fexercise%2FEquityCompensationExercise.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fexercise%2FEquityCompensationExercise.mapping.md&title=%5BMapping+question%5D+EquityCompensationExercise%3A+security_id&property_path=security_id) |
| `consideration_text` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fexercise%2FEquityCompensationExercise.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fexercise%2FEquityCompensationExercise.mapping.md&title=%5BMapping+question%5D+EquityCompensationExercise%3A+consideration_text&property_path=consideration_text) |
| `resulting_security_ids` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fexercise%2FEquityCompensationExercise.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fexercise%2FEquityCompensationExercise.mapping.md&title=%5BMapping+question%5D+EquityCompensationExercise%3A+resulting_security_ids&property_path=resulting_security_ids) |
| `quantity` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fexercise%2FEquityCompensationExercise.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fexercise%2FEquityCompensationExercise.mapping.md&title=%5BMapping+question%5D+EquityCompensationExercise%3A+quantity&property_path=quantity) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- **Join-dependent.** Resolve `compensation_type` by joining `security_id` to the
  related `EquityCompensationIssuance`; route options to `OptionExerciseTransaction`.
  RSU and SAR exercise targets are absent from the June 22 bundle.
- **RSUs route through a different source object.** An RSU settlement is modeled
  by `EquityCompensationRelease`, which maps to Carta's RSU settlement objects;
  the `Rsu` variant is null only in this exercise mapping because Carta has no
  RSU exercise target.
- **Mapped fields.** `date`, `quantity`, and `resulting_security_ids` map to the
  resolved exercise family; `security_id` anchors the parent transaction/grant.
  `resulting_security_ids` is computed onto certificate lineage because Carta's
  transaction-level result pointer is scalar.
- **Unmapped fields.** `id`, `comments`, `object_type`, and `consideration_text`
  have no equivalent Carta field; Carta-only exercise metadata remains unpopulated.
- **Carta `OptionExercise` needs clarification.** The pinned Carta bundle defines
  `OptionExercise` as a top-level object with request/workflow-oriented fields such as
  `state` (`PENDING`, `COMPLETE`, `CANCELED`), tax withholding, and money movement. This
  mapping instead routes the realized OCF exercise to the nested
  `OptionExerciseTransaction` (and related `Exercise`, grant, and certificate structures),
  which is why the inverse explorer currently labels `OptionExercise` as having no
  standalone OCF record. That may be correct if `OptionExercise` is a request/workflow
  object distinct from a completed exercise transaction, but the target schema and routing
  documentation also describe an option exercise as producing an `OptionExercise` record.
  Carta should clarify the lifecycle and intended data/API role of `OptionExercise` versus
  `OptionExerciseTransaction`/`Exercise`, and whether a completed OCF
  `EquityCompensationExercise` should populate `OptionExercise` in addition to the realized
  transaction structures.

- [ ] Is Carta `OptionExercise` intended to represent an exercise request/workflow, including pending or canceled state, tax withholding, and money movement, distinct from the completed exercise transaction represented by `OptionExerciseTransaction`/`Exercise`? If so, should a completed OCF `EquityCompensationExercise` map only to the realized transaction structures, or should it also populate `OptionExercise`?
  - Target: OptionExercise.state
  - Asked by: @johnscrudato
  - Answer: Open: confirm the lifecycle, API/data role, and intended mapping relationship between Carta `OptionExercise`, `OptionExerciseTransaction`, and `Exercise`.
  - Answered by: —

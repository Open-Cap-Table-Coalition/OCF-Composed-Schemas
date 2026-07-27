---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/exercise/WarrantExercise.schema.json
ocf_object_type: TX_WARRANT_EXERCISE
ocf_title: Object - Warrant Exercise Transaction
ocf_kind: object
required_fields:
  - trigger_id
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

# Object - Warrant Exercise Transaction → Carta

> Object describing a warrant exercise transaction

## OCF schema

Source: [`WarrantExercise.schema.json`](./WarrantExercise.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/exercise/WarrantExercise.schema.json",
  "title": "Object - Warrant Exercise Transaction",
  "description": "Object describing a warrant exercise transaction",
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
      "const": "TX_WARRANT_EXERCISE"
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
    "trigger_id": {
      "description": "What is the id of the warrant's exercise trigger that resulted in this exercise",
      "type": "string"
    }
  },
  "additionalProperties": false,
  "required": [
    "trigger_id",
    "id",
    "object_type",
    "date",
    "security_id",
    "resulting_security_ids"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/exercise/WarrantExercise.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
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
      TX_WARRANT_EXERCISE: null
  date:
    kind: rename
    target: "#/$defs/WarrantExerciseTransaction/properties/sharesAcquiredDatetime"
  security_id:
    kind: rename
    target: "#/$defs/WarrantTransactionItem/properties/securityId"
  consideration_text:
    kind: unmappable
    target: null
    reason: no-equivalent
  resulting_security_ids:
    kind: select
    target: "#/$defs/WarrantExerciseTransaction/properties/resultingSecurityId"
    policy: first_resulting_security_id
  trigger_id:
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
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fexercise%2FWarrantExercise.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fexercise%2FWarrantExercise.mapping.md&title=%5BMapping+question%5D+WarrantExercise) |
| `id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fexercise%2FWarrantExercise.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fexercise%2FWarrantExercise.mapping.md&title=%5BMapping+question%5D+WarrantExercise%3A+id&property_path=id) |
| `comments` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fexercise%2FWarrantExercise.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fexercise%2FWarrantExercise.mapping.md&title=%5BMapping+question%5D+WarrantExercise%3A+comments&property_path=comments) |
| `object_type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fexercise%2FWarrantExercise.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fexercise%2FWarrantExercise.mapping.md&title=%5BMapping+question%5D+WarrantExercise%3A+object_type&property_path=object_type) |
| `date` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fexercise%2FWarrantExercise.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fexercise%2FWarrantExercise.mapping.md&title=%5BMapping+question%5D+WarrantExercise%3A+date&property_path=date) |
| `security_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fexercise%2FWarrantExercise.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fexercise%2FWarrantExercise.mapping.md&title=%5BMapping+question%5D+WarrantExercise%3A+security_id&property_path=security_id) |
| `consideration_text` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fexercise%2FWarrantExercise.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fexercise%2FWarrantExercise.mapping.md&title=%5BMapping+question%5D+WarrantExercise%3A+consideration_text&property_path=consideration_text) |
| `resulting_security_ids` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fexercise%2FWarrantExercise.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fexercise%2FWarrantExercise.mapping.md&title=%5BMapping+question%5D+WarrantExercise%3A+resulting_security_ids&property_path=resulting_security_ids) |
| `trigger_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fexercise%2FWarrantExercise.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fexercise%2FWarrantExercise.mapping.md&title=%5BMapping+question%5D+WarrantExercise%3A+trigger_id&property_path=trigger_id) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- **Bucket: n/a-object.** This is an OCF transaction object (`ocf_kind: object`), so it maps its properties directly onto the corresponding Carta object rather than being bucket-classified as a reusable type. The clear Carta home is `#/$defs/WarrantExerciseTransaction` ("An exercise transaction for a warrant. Represents the conversion of warrant rights into shares."). In Carta's model these exercise records are not free-standing transactions: they live in the `exercises[]` array of `#/$defs/WarrantTransactionItem` (Carta's per-warrant container, `Warrant.exercises -> array of WarrantExerciseTransaction`). That structural difference is why some OCF fields route to the parent `WarrantTransactionItem` rather than to `WarrantExerciseTransaction` itself.
- **Structural model: OCF flat transactions vs. Carta warrant-nested items.** OCF emits each exercise as a standalone transaction object that references its warrant by `security_id`. Carta instead nests the exercise under the warrant it belongs to. So OCF's `security_id` (the identifier of the warrant being exercised) maps to `#/$defs/WarrantTransactionItem/properties/securityId` ("The identifier of the warrant"), i.e. the parent container's key, not a field on the exercise record. A consumer building Carta data must group OCF warrant exercises by `security_id` and append each to the matching `Warrant.exercises[]`.
- **`date` -> `sharesAcquiredDatetime` (granularity change).** OCF `date` is a calendar DATE (`types/Date.schema.json`, `YYYY-MM-DD`). Carta's `sharesAcquiredDatetime` is `#/$defs/Iso8601CompleteCalendarDateTime` — a full date-time. The mapping is lossy in the time-of-day direction: OCF carries no time component, so producing the Carta value requires padding with a zero/placeholder time (e.g. midnight). Semantically both denote when the exercise occurred / shares were acquired.
- **`resulting_security_ids` -> `resultingSecurityId` (cardinality change).** OCF allows an ARRAY of resulting security IDs (a single exercise can in principle yield multiple resulting securities). Carta's `WarrantExerciseTransaction.resultingSecurityId` is a SINGLE string. The mapping makes the reduction explicit with policy `first_resulting_security_id`; any additional IDs have no Carta home because Carta has no array form.
- **`consideration_text` (unmappable / no-equivalent).** OCF stores an unstructured free-text description of the consideration paid for the exercise. Carta's `WarrantExerciseTransaction` has no consideration/notes/text slot at all (its fields are `sharesAcquiredDatetime`, `quantity`, `withheldQuantity`, `settledQuantity`, `resultingSecurityId`, `resultingSecurityType`, `resultingSecurityLabel`). There is no structured price/cash field on the warrant exercise either, so the consideration narrative cannot be parked anywhere — it is dropped.
- **`trigger_id` (unmappable / no-equivalent).** OCF links the exercise back to the specific warrant exercise-trigger (from the warrant's `exercise_triggers` state machine) that fired. Carta records the warrant's exercise terms as plain fields and does not model an exercise-trigger state machine, so it has no trigger identifier to reference. This is the same "Carta records terms, not OCF's full conversion/exercise-trigger state machine" gap seen on convertible/warrant conversion mappings — the event-logic linkage has no Carta counterpart.
- **`id`, `comments`, `object_type` (ocf-internal).** Standard OCF object scaffolding. `id` is OCF's own object identifier (Carta assigns its own keys server-side and does not carry an id on the nested `WarrantExerciseTransaction`); `comments` is OCF's free-text array with no Carta slot; `object_type` is the OCF discriminator const `TX_WARRANT_EXERCISE` — Carta types positionally (the record's place in `Warrant.exercises[]` already identifies it as a warrant exercise), so there is nothing to remap the const onto (`values.TX_WARRANT_EXERCISE: null`).
- **Carta fields with no OCF source.** `WarrantExerciseTransaction.quantity`, `withheldQuantity`, and `settledQuantity` (the share-count economics of the exercise, all `Decimal`) and the `resultingSecurityType` / `resultingSecurityLabel` companions have no counterpart on OCF's `WarrantExercise` object — OCF carries quantity on the referenced issuance/warrant security, not on the exercise transaction. These are simply absent from the OCF source side and so do not appear in the field map.
- [ ] `resulting_security_ids`: Given that OCF allows one warrant exercise to produce multiple resulting securities while Carta `WarrantExerciseTransaction.resultingSecurityId` is scalar, should one OCF `WarrantExercise` be expanded into one `WarrantExerciseTransaction` per resulting security ID under the same `WarrantTransactionItem.exercises[]`, rather than retaining the current `first_resulting_security_id` reduction?
  - Target: WarrantExerciseTransaction.resultingSecurityId
  - Asked by: @johnscrudato
  - Answer: Open: confirm whether the intended cardinality-preserving export is a one-to-many split into nested exercise records, copying the shared exercise fields to each record and assigning one resulting security ID to each.
  - Answered by: —

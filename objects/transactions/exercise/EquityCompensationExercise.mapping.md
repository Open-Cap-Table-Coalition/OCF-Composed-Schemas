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
target_version: "v1alpha1 (2026-04-30)"
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
# { Option/Rsu/Sar: pointer or pointer list }. Rsu is null on every routed field — an OCF exercise
# against an RSU has no Carta exercise transaction to land on.
shared:
  id:                 { kind: unmappable, target: null, reason: ocf-internal }
  comments:           { kind: unmappable, target: null, reason: no-equivalent }
  object_type:        { kind: unmappable, target: null, reason: no-equivalent }
  security_id:
    kind: rename
    target:
      Option:
        - "#/$defs/OptionTransactionItem/properties/securityId"
        - "#/$defs/OptionGrant/properties/securityId"
      Sar:    "#/$defs/SarTransactionItem/properties/securityId"
      Rsu:    null
  consideration_text: { kind: unmappable, target: null, reason: no-equivalent }
  date:
    kind: rename
    target:
      Option:
        - "#/$defs/OptionExerciseTransaction/properties/sharesAcquiredDatetime"
        - "#/$defs/Exercise/properties/exerciseDate"
      Sar:    "#/$defs/SarExerciseTransaction/properties/sharesAcquiredDatetime"
      Rsu:    null
  quantity:
    kind: rename
    target:
      Option:
        - "#/$defs/OptionExerciseTransaction/properties/quantity"
        - "#/$defs/Exercise/properties/quantity"
        - "#/$defs/OptionGrant/properties/exercisedQuantity"
      Sar:    "#/$defs/SarExerciseTransaction/properties/quantity"
      Rsu:    null
  resulting_security_ids:
    kind: computed                 # result identity plus lineage on each resulting certificate
    target:
      Option:
        - "#/$defs/Certificate/properties/securityId"
        - "#/$defs/CertificatePrecededBy/properties/securities"
        - "#/$defs/Exercise/properties/certificateId"
      Sar:
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
    primary_targets:
      - "#/$defs/SarExerciseTransaction"
      - "#/$defs/SarTransactionItem"
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

- **Join-dependent (downstream).** One OCF `EquityCompensationExercise` fans out by
  the instrument family fixed at issuance: an exercise of an option grant lands on
  `OptionExerciseTransaction`, an exercise of a SAR on `SarExerciseTransaction`. The
  record itself carries no discriminator, only `security_id`, so an importer must
  resolve `compensation_type` from the joined `EquityCompensationIssuance` first (the
  two-pass requirement, docs/polymorphic-transaction-routing.md §2.2/§4.3).
- **Rsu is wholly unmappable.** An RSU is *settled* (`Release`), not *exercised*; an
  OCF exercise whose `security_id` resolves to a `RSU` compensation type is
  semantically invalid and has no Carta exercise transaction to receive it. The `Rsu`
  variant therefore has `primary_targets: null` and every routed field is `null` for it.
- **`date` / `quantity` / `resulting_security_ids`** are the mappable fields; each
  lands on the resolved family's exercise tx and, for Option exercises, the nested grant/result
  records:
  - `date` → `sharesAcquiredDatetime`. OCF `date` is a calendar date (`types/Date`,
    `YYYY-MM-DD`); Carta's `sharesAcquiredDatetime` is a full datetime
    (`Iso8601CompleteCalendarDateTime`) — the standard OCF-date → Carta-datetime
    granularity widening; the same "shares acquired on exercise" event.
  - `quantity` → exercise-transaction `quantity`, nested `Exercise.quantity`, and
    `OptionGrant.exercisedQuantity`. OCF `types/Numeric` (stringified decimal) → Carta
    `Decimal`; the same realized quantity is retained at event and aggregate levels.
  - `resulting_security_ids` → **lineage on the resulting security** (kind `computed`).
    An exercise produces shares — a Carta `Certificate` — and each resulting
    certificate records its origin in `Certificate.precededBy.securities` (a
    `PrecededBySecurity` array). The OCF *array* therefore round-trips **losslessly**
    as a set of reverse lineage edges: the importer writes the exercised grant's
    `security_id` into every resulting certificate's `precededBy.securities`. This is
    `computed` (importer-derived placement onto records the exercise *references*), not
    a `rename` — Carta's tx-level scalar `resultingSecurityId` is only a lossy
    convenience pointer (a single id), whereas `precededBy.securities` carries the full
    set, so in any snapshot the complete lineage forest stays traceable. The nested
    `Exercise.certificateId` target is the deterministic first result for the
    single-result exercise record; the certificate identity and lineage targets retain
    the full array. (Cash-settled
    SARs settle to `cashAcquired` and produce no resulting security.)
- **`security_id`** is the join key (`route_by_property.lookup_by.key`) and, for the valid Option
  and SAR routes, is copied to the resolved parent `*TransactionItem.securityId`. For Option it is
  also copied to `OptionGrant.securityId`, which anchors the nested `Exercise` record inside
  `exercises[]`; the RSU route remains null because RSUs settle via Release rather than Exercise.
- **`consideration_text` has no home.** OCF stores free text describing consideration;
  the nearest Carta concept is `exerciseMethod`, a constrained enum describing *how*
  the exercise was funded (CASH / CASHLESS / …), not a free-text description — free
  text → enum is unmappable, not a rename.
- **`object_type`** (`TX_PLAN_SECURITY_EXERCISE` / `TX_EQUITY_COMPENSATION_EXERCISE`)
  is the OCF record discriminator; Carta types the exercise positionally by family, so
  there is no per-record type field to remap onto. **`id`** identifies the OCF object
  (Carta's same-named `id` is the *exercise request* id — semantically different) and
  **`comments`** has no Carta slot.
- **Unused Carta fields:** on the routed exercise txs, `exerciseMethod`, `recordType`,
  `resultingSecurityType`, and `resultingSecurityLabel` have no OCF source field here
  and are left unpopulated.

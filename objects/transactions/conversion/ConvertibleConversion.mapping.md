---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/conversion/ConvertibleConversion.schema.json
ocf_object_type: TX_CONVERTIBLE_CONVERSION
ocf_title: Object - Convertible Conversion Transaction
ocf_kind: object
required_fields:
  - reason_text
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

# Object - Convertible Conversion Transaction → Carta

> Object describing a conversion of a convertible security

## OCF schema

Source: [`ConvertibleConversion.schema.json`](./ConvertibleConversion.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/conversion/ConvertibleConversion.schema.json",
  "title": "Object - Convertible Conversion Transaction",
  "description": "Object describing a conversion of a convertible security",
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
      "const": "TX_CONVERTIBLE_CONVERSION"
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
    "reason_text": {
      "description": "Reason for the conversion",
      "type": "string"
    },
    "quantity_converted": {
      "description": "Quantity of security units converted",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Numeric.schema.json"
    },
    "balance_security_id": {
      "description": "Identifier for the convertible that holds the remainder balance (for partial conversions)",
      "type": "string"
    },
    "trigger_id": {
      "description": "What is the id of the convertible's conversion trigger that resulted in this conversion",
      "type": "string"
    },
    "capitalization_definition": {
      "description": "If this conversion event and its `quantity_converted` value was based on the company's capitalization, please specify what stock classes, stock plans and securities were aggregated to calculate the capitalization value used in the calculation (e.g. if it was based on \"fully diluted\" capitalization, please provide details on how this was calculated using the capitalization type datastructure).",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/CapitalizationDefinition.schema.json"
    }
  },
  "additionalProperties": false,
  "required": [
    "reason_text",
    "trigger_id",
    "id",
    "object_type",
    "date",
    "security_id",
    "resulting_security_ids"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/conversion/ConvertibleConversion.schema.json"
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
      TX_CONVERTIBLE_CONVERSION: null
  date:
    kind: rename
    target: "#/$defs/ConvertibleCancellationTransaction/properties/effectiveDatetime"
  security_id:
    kind: rename
    target:
      - "#/$defs/ConvertibleTransactionItem/properties/securityId"
      - "#/$defs/ConvertibleNote/properties/securityId"
  resulting_security_ids:
    kind: unmappable
    target: null
    reason: no-equivalent
  reason_text:
    kind: unmappable
    target: null
    reason: no-equivalent
  quantity_converted:
    kind: rename
    target: "#/$defs/ConvertibleNote/properties/canceledQuantity"
  balance_security_id:
    kind: unmappable
    target: null
    reason: no-equivalent
  trigger_id:
    kind: unmappable
    target: null
    reason: no-equivalent
  capitalization_definition:
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
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fconversion%2FConvertibleConversion.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fconversion%2FConvertibleConversion.mapping.md&title=%5BMapping+question%5D+ConvertibleConversion) |
| `id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fconversion%2FConvertibleConversion.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fconversion%2FConvertibleConversion.mapping.md&title=%5BMapping+question%5D+ConvertibleConversion%3A+id&property_path=id) |
| `comments` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fconversion%2FConvertibleConversion.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fconversion%2FConvertibleConversion.mapping.md&title=%5BMapping+question%5D+ConvertibleConversion%3A+comments&property_path=comments) |
| `object_type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fconversion%2FConvertibleConversion.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fconversion%2FConvertibleConversion.mapping.md&title=%5BMapping+question%5D+ConvertibleConversion%3A+object_type&property_path=object_type) |
| `date` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fconversion%2FConvertibleConversion.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fconversion%2FConvertibleConversion.mapping.md&title=%5BMapping+question%5D+ConvertibleConversion%3A+date&property_path=date) |
| `security_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fconversion%2FConvertibleConversion.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fconversion%2FConvertibleConversion.mapping.md&title=%5BMapping+question%5D+ConvertibleConversion%3A+security_id&property_path=security_id) |
| `resulting_security_ids` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fconversion%2FConvertibleConversion.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fconversion%2FConvertibleConversion.mapping.md&title=%5BMapping+question%5D+ConvertibleConversion%3A+resulting_security_ids&property_path=resulting_security_ids) |
| `reason_text` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fconversion%2FConvertibleConversion.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fconversion%2FConvertibleConversion.mapping.md&title=%5BMapping+question%5D+ConvertibleConversion%3A+reason_text&property_path=reason_text) |
| `quantity_converted` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fconversion%2FConvertibleConversion.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fconversion%2FConvertibleConversion.mapping.md&title=%5BMapping+question%5D+ConvertibleConversion%3A+quantity_converted&property_path=quantity_converted) |
| `balance_security_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fconversion%2FConvertibleConversion.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fconversion%2FConvertibleConversion.mapping.md&title=%5BMapping+question%5D+ConvertibleConversion%3A+balance_security_id&property_path=balance_security_id) |
| `trigger_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fconversion%2FConvertibleConversion.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fconversion%2FConvertibleConversion.mapping.md&title=%5BMapping+question%5D+ConvertibleConversion%3A+trigger_id&property_path=trigger_id) |
| `capitalization_definition` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fconversion%2FConvertibleConversion.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fconversion%2FConvertibleConversion.mapping.md&title=%5BMapping+question%5D+ConvertibleConversion%3A+capitalization_definition&property_path=capitalization_definition) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- **Carta has no convertible-conversion transaction type.** Carta's convertible-note lifecycle (`ConvertibleTransactionItem`) is modeled with exactly two event kinds: `issuance` (`ConvertibleIssuanceTransaction`) and `cancellations[]` (`ConvertibleCancellationTransaction`). A conversion is recorded as a **cancellation of the note** carrying `reason = CONVERTIBLE_CANCELLATION_REASON_CONVERTED` (the `ConvertibleCancellationReason` enum's other value is `..._CANCELED`), and the equity that results is recorded separately as its own Certificate/issuance. There is no `TX_CONVERTIBLE_CONVERSION` analogue and no object that links the note's disappearance to the new shares. So this OCF transaction routes, at the object level, to a *converted* `ConvertibleCancellationTransaction` inside the enclosing `ConvertibleTransactionItem`, plus the resulting share issuance; the per-field mapping below targets the cancellation transaction and replicates the security join key onto both the transaction item and the parent `ConvertibleNote`.
- `date`: OCF's transaction date (the conversion event date) maps to `ConvertibleCancellationTransaction.effectiveDatetime`. **Granularity note:** OCF `date` is a calendar `Date` (`YYYY-MM-DD`); Carta's `effectiveDatetime` is an `Iso8601CompleteCalendarDateTime`, so an arbitrary/zero time component must be synthesized on export. The parent `ConvertibleNote.conversionDatetime` is the same instant denormalized onto the note; either is an acceptable home, but `effectiveDatetime` is the transaction-level field that corresponds to the OCF transaction's own `date` and is therefore the primary target.
- `security_id`: the OCF identifier of the convertible being converted. This is a foreign key to the convertible security; in Carta it is replicated onto `ConvertibleTransactionItem.securityId` (the transaction-history placement/join key) and `ConvertibleNote.securityId` (described as "the UUID of the convertible note … cross-reference with the List Transactions API"). `ConvertibleCancellationTransaction` itself carries no security id — the cancellation is positioned inside its note's `cancellations[]` array — so the two enclosing identity fields pin down *which* security this transaction acts on and where its cancellation belongs.
- `quantity_converted`: OCF records the number of convertible units converted (`Numeric`). Carta's only quantity field in the convertible lifecycle is `ConvertibleNote.canceledQuantity` (`Decimal`), which on a converted cancellation is the amount of the note removed by the conversion. **Unit/partial-conversion note:** OCF convertibles are frequently principal-denominated, in which case `quantity_converted` is a principal/unit amount rather than a share count; Carta exposes no separate "converted quantity," so the converted portion lands in `canceledQuantity`. For a *full* conversion this equals the issued amount; for a partial conversion it is the converted slice and the remainder lives on a separate balance note (see `balance_security_id`).
- `resulting_security_ids`: **unmappable / no-equivalent.** OCF links the conversion to the security/securities created by it. Carta's `ConvertibleCancellationTransaction` has only `effectiveDatetime`, `reason`, `principal` — no field referencing the resulting equity. The resulting shares are a wholly separate `Certificate`/issuance with no back-pointer to the canceled note, so this cross-event linkage cannot be expressed in the Carta convertible model.
- `reason_text`: **unmappable / no-equivalent.** OCF's `reason_text` is free text. Carta's cancellation `reason` is a closed enum (`ConvertibleCancellationReason`) with no free-text companion; the only thing it encodes is *that* the cancellation was a conversion (`..._CONVERTED`), which is the object-type discriminator here, not OCF's narrative reason. There is no field to carry the prose, so it is dropped. (Modeling note: the *act* of choosing `..._CONVERTED` is what selects this transaction's Carta home; it is not a value-level mapping of `reason_text`.)
- `balance_security_id`: **unmappable / no-equivalent.** For partial conversions OCF points at the convertible holding the remaining balance. Carta has no remainder/split linkage on `ConvertibleCancellationTransaction` or `ConvertibleNote`; a partial conversion would appear as a cancellation of part of the note with no recorded reference to the surviving balance note. No home exists.
- `trigger_id`: **unmappable / no-equivalent.** This is a foreign key into the convertible's conversion-trigger objects (OCF's conversion-mechanism / trigger state machine, with `EARLIER_OF`/`LATER_OF`, conditions, trigger dates, MFN, etc.). Carta records convertible *terms* (`priceCap`, `discountPercentage`, `conversionTrigger` amount, `changeInControlPercent`, interest terms) but not OCF's full conversion-trigger graph, and certainly not a per-trigger identifier; there is nothing to reference. (Carta's `conversionTrigger` is a `Money` threshold amount, not an identifiable trigger object, so it is not a home for this FK.)
- `capitalization_definition`: **unmappable / no-equivalent.** OCF can attach a `CapitalizationDefinition` describing exactly which share classes / plans / securities were aggregated (e.g. a "fully diluted" basis) to compute `quantity_converted`. Carta models no capitalization-basis structure anywhere in the convertible lifecycle (consistent with the all-unmappable treatment of `CapitalizationDefinition` elsewhere), so this calculation provenance is dropped.
- `id`, `comments`, `object_type`: OCF object scaffolding. `id` is OCF's own identifier (Carta assigns its own ids server-side and positions transactions inside `ConvertibleTransactionItem.cancellations[]`); `comments` has no Carta slot; `object_type` is a positional discriminator (`TX_CONVERTIBLE_CONVERSION`) that Carta does not store as a field — the equivalent discriminator in Carta is the cancellation `reason = ..._CONVERTED`, not a mappable value, so the `values` entry is null.

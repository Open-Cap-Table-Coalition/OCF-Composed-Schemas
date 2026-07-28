---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/cancellation/ConvertibleCancellation.schema.json
ocf_object_type: TX_CONVERTIBLE_CANCELLATION
ocf_title: Object - Convertible Cancellation Transaction
ocf_kind: object
required_fields:
  - amount
  - id
  - object_type
  - date
  - security_id
  - reason_text
target_standard: Carta
target_version: "v1alpha1 (2026-04-30)"
status: complete
last_generated: 2026-05-18
---

# Object - Convertible Cancellation Transaction → Carta

> Object describing a cancellation of a convertible security

## OCF schema

Source: [`ConvertibleCancellation.schema.json`](./ConvertibleCancellation.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/cancellation/ConvertibleCancellation.schema.json",
  "title": "Object - Convertible Cancellation Transaction",
  "description": "Object describing a cancellation of a convertible security",
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
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/cancellation/Cancellation.schema.json"
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
      "const": "TX_CONVERTIBLE_CANCELLATION"
    },
    "date": {
      "description": "Date on which the transaction occurred",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "security_id": {
      "description": "Identifier for the security (stock, plan security, warrant, or convertible) by which it can be referenced by other transaction objects. Note that while this identifier is created with an issuance object, it should be different than the issuance object's `id` field which identifies the issuance transaction object itself. All future transactions on the security (e.g. acceptance, transfer, cancel, etc.) must reference this `security_id` to qualify which security the transaction applies to.",
      "type": "string"
    },
    "balance_security_id": {
      "description": "Identifier for the security that holds the remainder balance (for partial cancellations)",
      "type": "string"
    },
    "reason_text": {
      "description": "Reason for the cancellation",
      "type": "string"
    },
    "amount": {
      "description": "Amount of monetary value cancelled",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Monetary.schema.json"
    }
  },
  "additionalProperties": false,
  "required": [
    "amount",
    "id",
    "object_type",
    "date",
    "security_id",
    "reason_text"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/cancellation/ConvertibleCancellation.schema.json"
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
      TX_CONVERTIBLE_CANCELLATION: null
  date:
    kind: rename
    target:
      - "#/$defs/ConvertibleCancellationTransaction/properties/effectiveDatetime"
      - "#/$defs/ConvertibleNote/properties/canceledDatetime"
  security_id:
    kind: rename
    target: "#/$defs/ConvertibleTransactionItem/properties/securityId"
  balance_security_id:
    kind: unmappable
    target: null
    reason: no-equivalent
  reason_text:
    kind: computed
    target: "#/$defs/ConvertibleCancellationTransaction/properties/reason"
  amount:
    kind: rename
    target: "#/$defs/ConvertibleCancellationTransaction/properties/principal"
```

## Ask a mapping question

Use a link below to open a prefilled GitHub issue. The issue can be copied into the auditable checklist in `## Notes / open questions`.

<details>
<summary>Open a prefilled issue for a property</summary>

<!-- mapping-question-links:start -->
| Source property | Action |
| --- | --- |
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fcancellation%2FConvertibleCancellation.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fcancellation%2FConvertibleCancellation.mapping.md&title=%5BMapping+question%5D+ConvertibleCancellation) |
| `id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fcancellation%2FConvertibleCancellation.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fcancellation%2FConvertibleCancellation.mapping.md&title=%5BMapping+question%5D+ConvertibleCancellation%3A+id&property_path=id) |
| `comments` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fcancellation%2FConvertibleCancellation.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fcancellation%2FConvertibleCancellation.mapping.md&title=%5BMapping+question%5D+ConvertibleCancellation%3A+comments&property_path=comments) |
| `object_type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fcancellation%2FConvertibleCancellation.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fcancellation%2FConvertibleCancellation.mapping.md&title=%5BMapping+question%5D+ConvertibleCancellation%3A+object_type&property_path=object_type) |
| `date` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fcancellation%2FConvertibleCancellation.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fcancellation%2FConvertibleCancellation.mapping.md&title=%5BMapping+question%5D+ConvertibleCancellation%3A+date&property_path=date) |
| `security_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fcancellation%2FConvertibleCancellation.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fcancellation%2FConvertibleCancellation.mapping.md&title=%5BMapping+question%5D+ConvertibleCancellation%3A+security_id&property_path=security_id) |
| `balance_security_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fcancellation%2FConvertibleCancellation.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fcancellation%2FConvertibleCancellation.mapping.md&title=%5BMapping+question%5D+ConvertibleCancellation%3A+balance_security_id&property_path=balance_security_id) |
| `reason_text` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fcancellation%2FConvertibleCancellation.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fcancellation%2FConvertibleCancellation.mapping.md&title=%5BMapping+question%5D+ConvertibleCancellation%3A+reason_text&property_path=reason_text) |
| `amount` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fcancellation%2FConvertibleCancellation.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fcancellation%2FConvertibleCancellation.mapping.md&title=%5BMapping+question%5D+ConvertibleCancellation%3A+amount&property_path=amount) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- `date` maps to `ConvertibleCancellationTransaction.effectiveDatetime` and the note's `canceledDatetime`; `amount` maps to transaction `principal`. `security_id` anchors the parent `ConvertibleTransactionItem`.
- Free-text `reason_text` is classified into Carta's cancellation enum. `balance_security_id` has no target; `id`, `comments`, and `object_type` are OCF scaffolding. OCF calendar dates widen to Carta datetimes.

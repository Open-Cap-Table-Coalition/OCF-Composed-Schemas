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
    target:
      - "#/$defs/ConvertibleCancellationTransaction/properties/effectiveDatetime"
      - "#/$defs/ConvertibleNote/properties/conversionDatetime"
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

- `date` maps to the cancellation step's effective datetime and the note's `conversionDatetime`; `security_id` anchors the parent item and note. `quantity_converted` maps to the note's `canceledQuantity`.
- Carta has no standalone convertible-conversion event or target for `resulting_security_ids`, `balance_security_id`, `trigger_id`, `capitalization_definition`, or `reason_text`. `id`, `comments`, and `object_type` are OCF scaffolding.

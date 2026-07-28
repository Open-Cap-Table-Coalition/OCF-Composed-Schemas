---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_triggers/AutomaticConversionOnDateTrigger.schema.json
ocf_object_type: null
ocf_title: Type - Automatic Conversion on Date Trigger
ocf_kind: type
required_fields:
  - trigger_id
  - trigger_date
  - type
  - conversion_right
  - type
  - trigger_id
  - conversion_right
target_standard: Carta
target_version: "v1alpha1 (2026-04-30)"
status: complete
last_generated: 2026-05-18
---

# Type - Automatic Conversion on Date Trigger → Carta

> Type representation of an automatic trigger on a date.

## OCF schema

Source: [`AutomaticConversionOnDateTrigger.schema.json`](./AutomaticConversionOnDateTrigger.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_triggers/AutomaticConversionOnDateTrigger.schema.json",
  "title": "Type - Automatic Conversion on Date Trigger",
  "description": "Type representation of an automatic trigger on a date.",
  "type": "object",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/types/conversion_triggers/ConversionTrigger.schema.json"
    }
  ],
  "properties": {
    "type": {
      "const": "AUTOMATIC_ON_DATE"
    },
    "trigger_id": {
      "description": "Id for this conversion trigger, unique within list of ConversionTriggers in parent convertible issuance's `conversion_triggers` field.",
      "type": "string"
    },
    "nickname": {
      "description": "Human-friendly nickname to describe the conversion right",
      "type": "string"
    },
    "trigger_description": {
      "description": "Long-form description of the trigger",
      "type": "string"
    },
    "conversion_right": {
      "description": "When the conditions of the trigger are met, how does the convertible convert?",
      "oneOf": [
        {
          "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_rights/ConvertibleConversionRight.schema.json"
        },
        {
          "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_rights/WarrantConversionRight.schema.json"
        },
        {
          "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_rights/StockClassConversionRight.schema.json"
        }
      ]
    },
    "trigger_date": {
      "description": "Date on which trigger occurs automatically (if it hasn't already occured)",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    }
  },
  "additionalProperties": false,
  "required": [
    "trigger_id",
    "trigger_date",
    "type",
    "conversion_right",
    "type",
    "trigger_id",
    "conversion_right"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/conversion_triggers/AutomaticConversionOnDateTrigger.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
status: complete

fields:
  type:
    kind: unmappable
    target: null
    reason: no-equivalent
    values:
      AUTOMATIC_ON_DATE: null
  trigger_id:
    kind: unmappable
    target: null
    reason: no-equivalent
  nickname:
    kind: unmappable
    target: null
    reason: no-equivalent
  trigger_description:
    kind: unmappable
    target: null
    reason: no-equivalent
  conversion_right:
    kind: unmappable
    target: null
    reason: no-equivalent
  trigger_date:
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
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_triggers%2FAutomaticConversionOnDateTrigger.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_triggers%2FAutomaticConversionOnDateTrigger.mapping.md&title=%5BMapping+question%5D+AutomaticConversionOnDateTrigger) |
| `type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_triggers%2FAutomaticConversionOnDateTrigger.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_triggers%2FAutomaticConversionOnDateTrigger.mapping.md&title=%5BMapping+question%5D+AutomaticConversionOnDateTrigger%3A+type&property_path=type) |
| `trigger_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_triggers%2FAutomaticConversionOnDateTrigger.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_triggers%2FAutomaticConversionOnDateTrigger.mapping.md&title=%5BMapping+question%5D+AutomaticConversionOnDateTrigger%3A+trigger_id&property_path=trigger_id) |
| `nickname` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_triggers%2FAutomaticConversionOnDateTrigger.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_triggers%2FAutomaticConversionOnDateTrigger.mapping.md&title=%5BMapping+question%5D+AutomaticConversionOnDateTrigger%3A+nickname&property_path=nickname) |
| `trigger_description` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_triggers%2FAutomaticConversionOnDateTrigger.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_triggers%2FAutomaticConversionOnDateTrigger.mapping.md&title=%5BMapping+question%5D+AutomaticConversionOnDateTrigger%3A+trigger_description&property_path=trigger_description) |
| `conversion_right` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_triggers%2FAutomaticConversionOnDateTrigger.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_triggers%2FAutomaticConversionOnDateTrigger.mapping.md&title=%5BMapping+question%5D+AutomaticConversionOnDateTrigger%3A+conversion_right&property_path=conversion_right) |
| `trigger_date` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_triggers%2FAutomaticConversionOnDateTrigger.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_triggers%2FAutomaticConversionOnDateTrigger.mapping.md&title=%5BMapping+question%5D+AutomaticConversionOnDateTrigger%3A+trigger_date&property_path=trigger_date) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- Carta has no reusable conversion-trigger object or schedule field for this automatic trigger. The date, labels, conversion right, ID, and discriminator are unmappable.
- Carta's `conversionTrigger` Money field is an economic threshold, not this trigger object.

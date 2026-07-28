---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_triggers/AutomaticConversionOnConditionTrigger.schema.json
ocf_object_type: null
ocf_title: Type - Automatic Conversion on Condition Trigger
ocf_kind: type
required_fields:
  - trigger_id
  - trigger_condition
  - type
  - conversion_right
  - type
  - trigger_id
  - conversion_right
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-05-18
---

# Type - Automatic Conversion on Condition Trigger → Carta

> Type representation of automatic trigger on a tive or condition.

## OCF schema

Source: [`AutomaticConversionOnConditionTrigger.schema.json`](./AutomaticConversionOnConditionTrigger.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_triggers/AutomaticConversionOnConditionTrigger.schema.json",
  "title": "Type - Automatic Conversion on Condition Trigger",
  "description": "Type representation of automatic trigger on a tive or condition.",
  "type": "object",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/types/conversion_triggers/ConversionTrigger.schema.json"
    }
  ],
  "properties": {
    "type": {
      "const": "AUTOMATIC_ON_CONDITION"
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
    "trigger_condition": {
      "description": "Legal language describing what conditions must be satisfied for the conversion to take place (ideally, this should be excerpted from the instrument where possible)",
      "type": "string"
    }
  },
  "additionalProperties": false,
  "required": [
    "trigger_id",
    "trigger_condition",
    "type",
    "conversion_right",
    "type",
    "trigger_id",
    "conversion_right"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/conversion_triggers/AutomaticConversionOnConditionTrigger.schema.json"
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
      AUTOMATIC_ON_CONDITION: null
  trigger_id:
    kind: unmappable
    target: null
    reason: ocf-internal
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
  trigger_condition:
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
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_triggers%2FAutomaticConversionOnConditionTrigger.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_triggers%2FAutomaticConversionOnConditionTrigger.mapping.md&title=%5BMapping+question%5D+AutomaticConversionOnConditionTrigger) |
| `type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_triggers%2FAutomaticConversionOnConditionTrigger.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_triggers%2FAutomaticConversionOnConditionTrigger.mapping.md&title=%5BMapping+question%5D+AutomaticConversionOnConditionTrigger%3A+type&property_path=type) |
| `trigger_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_triggers%2FAutomaticConversionOnConditionTrigger.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_triggers%2FAutomaticConversionOnConditionTrigger.mapping.md&title=%5BMapping+question%5D+AutomaticConversionOnConditionTrigger%3A+trigger_id&property_path=trigger_id) |
| `nickname` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_triggers%2FAutomaticConversionOnConditionTrigger.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_triggers%2FAutomaticConversionOnConditionTrigger.mapping.md&title=%5BMapping+question%5D+AutomaticConversionOnConditionTrigger%3A+nickname&property_path=nickname) |
| `trigger_description` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_triggers%2FAutomaticConversionOnConditionTrigger.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_triggers%2FAutomaticConversionOnConditionTrigger.mapping.md&title=%5BMapping+question%5D+AutomaticConversionOnConditionTrigger%3A+trigger_description&property_path=trigger_description) |
| `conversion_right` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_triggers%2FAutomaticConversionOnConditionTrigger.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_triggers%2FAutomaticConversionOnConditionTrigger.mapping.md&title=%5BMapping+question%5D+AutomaticConversionOnConditionTrigger%3A+conversion_right&property_path=conversion_right) |
| `trigger_condition` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_triggers%2FAutomaticConversionOnConditionTrigger.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_triggers%2FAutomaticConversionOnConditionTrigger.mapping.md&title=%5BMapping+question%5D+AutomaticConversionOnConditionTrigger%3A+trigger_condition&property_path=trigger_condition) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- Carta has no reusable conversion-trigger object. The condition, labels, conversion right, and discriminator have no target; the local `trigger_id` is OCF-internal.
- Carta's `conversionTrigger` Money field is a financing threshold, not a target for this structured trigger.

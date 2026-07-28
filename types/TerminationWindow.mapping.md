---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/TerminationWindow.schema.json
ocf_object_type: null
ocf_title: Type - Termination Window
ocf_kind: type
required_fields:
  - reason
  - period
  - period_type
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-05-18
---

# Type - Termination Window → Carta ExercisePeriods

> Type representation of a termination window

## OCF schema

Source: [`TerminationWindow.schema.json`](./TerminationWindow.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/TerminationWindow.schema.json",
  "title": "Type - Termination Window",
  "description": "Type representation of a termination window",
  "type": "object",
  "properties": {
    "reason": {
      "description": "What cause of termination is this window for?",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/TerminationWindowType.schema.json"
    },
    "period": {
      "description": "The length of the period in this termination window (in number of periods of type period_type)",
      "type": "integer"
    },
    "period_type": {
      "description": "The type of period being measured (e.g. days or month)",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/PeriodType.schema.json"
    }
  },
  "additionalProperties": false,
  "required": [
    "reason",
    "period",
    "period_type"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/TerminationWindow.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
status: complete

fields:
  reason:
    kind: split
    target:
      - "#/$defs/ExercisePeriods/properties/voluntaryTerminationCount"
      - "#/$defs/ExercisePeriods/properties/voluntaryTerminationPeriod"
      - "#/$defs/ExercisePeriods/properties/involuntaryTerminationCauseCount"
      - "#/$defs/ExercisePeriods/properties/involuntaryTerminationCausePeriod"
      - "#/$defs/ExercisePeriods/properties/involuntaryTerminationCount"
      - "#/$defs/ExercisePeriods/properties/involuntaryTerminationPeriod"
      - "#/$defs/ExercisePeriods/properties/deathExerciseCount"
      - "#/$defs/ExercisePeriods/properties/deathExercisePeriod"
      - "#/$defs/ExercisePeriods/properties/disabilityExerciseCount"
      - "#/$defs/ExercisePeriods/properties/disabilityExercisePeriod"
      - "#/$defs/ExercisePeriods/properties/retirementExerciseCount"
      - "#/$defs/ExercisePeriods/properties/retirementExercisePeriod"
    routes:
      VOLUNTARY_OTHER:
        period: "#/$defs/ExercisePeriods/properties/voluntaryTerminationCount"
        period_type: "#/$defs/ExercisePeriods/properties/voluntaryTerminationPeriod"
      VOLUNTARY_GOOD_CAUSE: null
      VOLUNTARY_RETIREMENT:
        period: "#/$defs/ExercisePeriods/properties/retirementExerciseCount"
        period_type: "#/$defs/ExercisePeriods/properties/retirementExercisePeriod"
      INVOLUNTARY_OTHER:
        period: "#/$defs/ExercisePeriods/properties/involuntaryTerminationCount"
        period_type: "#/$defs/ExercisePeriods/properties/involuntaryTerminationPeriod"
      INVOLUNTARY_DEATH:
        period: "#/$defs/ExercisePeriods/properties/deathExerciseCount"
        period_type: "#/$defs/ExercisePeriods/properties/deathExercisePeriod"
      INVOLUNTARY_DISABILITY:
        period: "#/$defs/ExercisePeriods/properties/disabilityExerciseCount"
        period_type: "#/$defs/ExercisePeriods/properties/disabilityExercisePeriod"
      INVOLUNTARY_WITH_CAUSE:
        period: "#/$defs/ExercisePeriods/properties/involuntaryTerminationCauseCount"
        period_type: "#/$defs/ExercisePeriods/properties/involuntaryTerminationCausePeriod"
  period:
    kind: split
    target:
      - "#/$defs/ExercisePeriods/properties/voluntaryTerminationCount"
      - "#/$defs/ExercisePeriods/properties/involuntaryTerminationCauseCount"
      - "#/$defs/ExercisePeriods/properties/involuntaryTerminationCount"
      - "#/$defs/ExercisePeriods/properties/deathExerciseCount"
      - "#/$defs/ExercisePeriods/properties/disabilityExerciseCount"
      - "#/$defs/ExercisePeriods/properties/retirementExerciseCount"
  period_type:
    kind: enum-remap
    target: "#/$defs/ExercisePeriod"
    values:
      DAYS: EXERCISE_PERIOD_DAY
      MONTHS: EXERCISE_PERIOD_MONTH
      YEARS: EXERCISE_PERIOD_YEAR
```

## Ask a mapping question

Use a link below to open a prefilled GitHub issue. The issue can be copied into the auditable checklist in `## Notes / open questions`.

<details>
<summary>Open a prefilled issue for a property</summary>

<!-- mapping-question-links:start -->
| Source property | Action |
| --- | --- |
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FTerminationWindow.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FTerminationWindow.mapping.md&title=%5BMapping+question%5D+TerminationWindow) |
| `reason` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FTerminationWindow.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FTerminationWindow.mapping.md&title=%5BMapping+question%5D+TerminationWindow%3A+reason&property_path=reason) |
| `period` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FTerminationWindow.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FTerminationWindow.mapping.md&title=%5BMapping+question%5D+TerminationWindow%3A+period&property_path=period) |
| `period_type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FTerminationWindow.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FTerminationWindow.mapping.md&title=%5BMapping+question%5D+TerminationWindow%3A+period_type&property_path=period_type) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- A list of OCF windows pivots into Carta's fixed `ExercisePeriods` count/period pair selected by `reason`. `period_type` remaps to the shared exercise-period enum.
- `VOLUNTARY_GOOD_CAUSE` has no Carta bucket, and duplicate windows for one reason collide; the YAML routes these cases explicitly rather than silently merging them.

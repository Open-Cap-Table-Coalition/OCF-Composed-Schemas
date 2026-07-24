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

- Bucket (1) type-to-type. OCF `TerminationWindow` has one unambiguous Carta home:
  `#/$defs/ExercisePeriods` (reached on the option grant via
  `#/$defs/EquityCompensationIssuance...` → `exercisePeriods`). Both schemas model the
  same concept — how long a holder may exercise vested options after they leave, broken
  out **per termination reason**. So this is not a bucket-2 "no single home" type; it is a
  structured type that maps field-for-field into ExercisePeriods.
- **Shape mismatch (the load-bearing point).** OCF carries a *list* of `TerminationWindow`
  objects (`EquityCompensationIssuance.termination_exercise_windows` is an array), each one
  a `{reason, period, period_type}` triple. Carta does **not** model a list; instead
  `ExercisePeriods` is a single object with a **fixed, reason-keyed pair of fields**
  (`<reason>Count` + `<reason>Period`) for each supported cause. Mapping is therefore a
  *pivot*: each OCF window is routed by its `reason` into the matching Carta count/period
  pair. `reason` is the discriminator that selects the pair; `period` fills that pair's
  `…Count`; `period_type` fills that pair's `…Period`.
- **`reason` (split + discriminator).** Modeled as a `split` because the single OCF value
  governs *which* Carta count/period pair is populated — both halves of the chosen pair.
  The `routes:` map records the complete OCF→Carta branch, naming the source field that
  populates each member of the selected pair:
  - `VOLUNTARY_OTHER` → `voluntaryTermination*` (Carta's generic voluntary bucket).
  - `VOLUNTARY_RETIREMENT` → `retirementExercise*`.
  - `INVOLUNTARY_OTHER` → `involuntaryTermination*` (Carta's generic involuntary bucket).
  - `INVOLUNTARY_WITH_CAUSE` → `involuntaryTerminationCause*` (Carta's "for cause" bucket).
  - `INVOLUNTARY_DEATH` → `deathExercise*`.
  - `INVOLUNTARY_DISABILITY` → `disabilityExercise*`.
  - `VOLUNTARY_GOOD_CAUSE` → **no Carta bucket** (value `null`). Carta distinguishes
    *involuntary* "with cause" (`involuntaryTerminationCause*`) but has no slot for a
    *voluntary* "good reason / good cause" resignation. This window's `period`/`period_type`
    have no faithful Carta destination; routing it into `voluntaryTermination*` would
    overwrite the generic voluntary window, so it is best dropped or escalated rather than
    silently merged. This is the only lossy reason value.
- **`period` (split).** The integer count fans out to whichever of the six Carta `…Count`
  fields the window's `reason` selects (hence a `split` across all six count properties).
  Only one is written per OCF window; the rest stay unset (and, per Carta's docs, inherit
  from the equity plan).
- **`period_type` (enum-remap).** All six Carta `…Period` fields share the
  `#/$defs/ExercisePeriod` enum, so the value remapping is captured once against that enum:
  `DAYS`→`EXERCISE_PERIOD_DAY`, `MONTHS`→`EXERCISE_PERIOD_MONTH`, `YEARS`→`EXERCISE_PERIOD_YEAR`.
  The actual destination property among the six (`…Period`) is selected by `reason`, exactly
  as for `period`. The enum-remap target is the shared `ExercisePeriod` enum rather than any
  one `…Period` property because the per-reason routing is already expressed on `reason`.
- **Collisions / many-to-one.** Because Carta has one pair per reason, two OCF windows with
  the same `reason` (or `VOLUNTARY_OTHER` + `VOLUNTARY_GOOD_CAUSE`, which would both want the
  generic voluntary bucket) cannot both be represented; the last write wins. OCF's array is
  strictly more expressive here, so a producer should de-duplicate windows by reason before
  emitting Carta.
- **Mapping completeness.** All three source properties have a home, with no
  unmappable entries; the only genuine loss is the `VOLUNTARY_GOOD_CAUSE` reason value, noted
  above as `null` in the `reason` routes map.

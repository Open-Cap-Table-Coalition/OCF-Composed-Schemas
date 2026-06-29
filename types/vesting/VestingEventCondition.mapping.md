---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/vesting/VestingEventCondition.schema.json
ocf_object_type: null
ocf_title: Type - Vesting Event Condition
ocf_kind: type
required_fields:
  - event_id
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-06-29
---

# Type - Vesting Event Condition → Carta

> The named-event axis of a VestingStatement: a gating event (referenced by `event_id`) that must fire before the statement releases. Its firing is recorded by a v2 vesting-event transaction. Present ⟺ the statement is gated.

## OCF schema

Source: [`VestingEventCondition.schema.json`](./VestingEventCondition.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/vesting/VestingEventCondition.schema.json",
  "title": "Type - Vesting Event Condition",
  "description": "The named-event axis of a VestingStatement: a gating event (referenced by `event_id`) that must fire before the statement releases. Its firing is recorded by a v2 vesting-event transaction. Present ⟺ the statement is gated.",
  "type": "object",
  "properties": {
    "event_id": {
      "description": "Identifier of the gating event. Matches `event_id` on a v2 vesting-event transaction.",
      "type": "string",
      "minLength": 1
    }
  },
  "required": [
    "event_id"
  ],
  "additionalProperties": false,
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/vesting/VestingEventCondition.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
# unmappable reason vocabulary: no-equivalent | excluded-from-snapshot | out-of-scope | ocf-internal
status: complete
coverage: 1/1

fields:
  event_id:
    kind: rename
    target: "#/$defs/PerformanceCondition/properties/name"
```

## Notes / open questions

- **`event_id` → the condition's `name`.** A gated `VestingStatement` carries a `VestingEventCondition`, which Carta models as a period-level `performanceCondition` (`#/$defs/VestingPeriod/properties/performanceCondition`, a `PerformanceCondition`). The OCF `event_id` — the identifier the gating v2 vesting-event transaction fires against — corresponds to that condition's `name`, the only field that carries the gate's identity. So the whole type collapses to this single rename.
- **No event-firing/status round-trip.** OCF records *whether/when* the named event fired on a separate v2 vesting-event transaction, not here. Carta's `PerformanceCondition.status` / `evaluationDate` and the `VestingPeriod.performanceCondition` boolean flags live on different objects and are populated from those firing events, so they are out of scope for this type-level name mapping (this type only names the gate).
- The pre-#227 `canonical/vesting/` layer mapped this same event gate by name; this mapping preserves that — `event_id` is the gate's identity and lands on `PerformanceCondition.name`.

# Schema source / provenance

The composed OCF schemas in this repository (`enums/`, `files/`, `objects/`,
`primitives/`, `types/`) are derived from a specific upstream release of the
Open Cap Format (OCF):

| | |
| --- | --- |
| **Upstream** | [Open-Cap-Table-Coalition / Open-Cap-Format-OCF](https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF) |
| **Version** | `1.2.1-unstable` |
| **Applied** | 2026-06-29 |

## What "unstable" means

The `1.2.1-unstable` variant is the upstream schema set with two deliberate
deviations from the stable release:

- **`pending_deprecation` schemas omitted** — 14 schemas marked `pending_deprecation`
  upstream are not emitted here. They can be re-added as the upstream schema evolves.
- **Alpha/beta preferred over stable** — where an object ships both a stable form
  and a newer alpha/beta form, the latest alpha/beta form is used (the version
  dispatchers are collapsed to their alpha/beta version).

The most visible consequence in this set is the **vesting model**: the legacy
condition/trigger vesting types were dropped in favor of the newer
`statements`-based `VestingTerms`, backed by `VestingStatement`,
`VestingScheduleSegment`, `VestingScheduleCliff`, and `VestingEventCondition`.

## Why this is recorded here

The schema files do **not** encode their source version: every `$id` and
`$comment` points at `.../Open-Cap-Format-OCF/main/schema/...` (i.e. `main`, not a
version tag), so the version is not recoverable from the files themselves.

Regenerating this set against a different upstream version (e.g. `1.2.0` or
`1.2.0-stable`) would produce a **different** set of schemas — and therefore
different mappings. If you re-run the composition against another version, update
this file to match what you pulled from.

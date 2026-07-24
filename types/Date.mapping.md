---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json
ocf_object_type: null
ocf_title: Type - Date
ocf_kind: type
required_fields: []
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-05-18
---

# Type - Date → Carta

> Type represention of an ISO-8601 date, e.g. 2022-01-28

## OCF schema

Source: [`Date.schema.json`](./Date.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json",
  "title": "Type - Date",
  "description": "Type represention of an ISO-8601 date, e.g. 2022-01-28",
  "type": "string",
  "format": "date",
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/Date.schema.json",
  "properties": {},
  "required": []
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
status: complete

fields: {}
```

## Ask a mapping question

Use a link below to open a prefilled GitHub issue. The issue can be copied into the auditable checklist in `## Notes / open questions`.

<details>
<summary>Open a prefilled issue for a property</summary>

<!-- mapping-question-links:start -->
| Source property | Action |
| --- | --- |
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FDate.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FDate.mapping.md&title=%5BMapping+question%5D+Date) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- OCF `Type - Date` is a bare scalar (`type: string`, `format: date`) with zero
  `properties`, so there is no per-field mapping table here
  and the type-level correspondence is documented below (same pattern as
  `types/Md5.mapping.md`).
- Carta DOES model this concept. The faithful target is
  `#/$defs/Iso8601CompleteCalendarDate`, whose single string member
  `#/$defs/Iso8601CompleteCalendarDate/properties/value` is constrained to the
  exact same lexical form as OCF Date — `[0-9]{4}-[0-9]{2}-[0-9]{2}` (a 10-char
  ISO-8601 complete calendar date, e.g. `2022-01-28`). This is a 1:1 lexical
  match: an OCF Date string drops straight into that `value` field with no
  transformation. `Iso8601CompleteCalendarDate` is the canonical date type used
  throughout the Carta bundle (referenced 34 times — every `issueDate`,
  `vestingStartDate`, `boardApprovalDate`, `terminationDate`, etc. is typed by
  it), confirming it is the intended home for OCF date values.
- Note the structural difference, which is why the wrapper type (not a bare
  string) is the correspondent: OCF Date is the JSON string itself, whereas
  Carta wraps the string in a one-member object (`{ "value": "2022-01-28" }`).
  Mappings of OCF objects whose fields `$ref` this Date type (e.g. issuance
  `date`, `board_approval_date`, vesting/exercise dates) therefore target the
  relevant `Iso8601CompleteCalendarDate`-typed property on the corresponding
  Carta object and carry the OCF date string into that object's `value`.
- Carta also defines a separate structured `#/$defs/Date` (integer
  `year`/`month`/`day`, supporting partial dates such as a year-only or
  month/day anniversary). It is referenced only once in the bundle and accepts
  shapes OCF Date cannot express. It is the wrong correspondent for OCF's
  complete ISO-8601 date and is recorded here only for completeness; the
  representative target for OCF Date is `Iso8601CompleteCalendarDate`.
- For datetimes (OCF `DateTime`, out of scope for this file), Carta's parallel
  `#/$defs/Iso8601CompleteCalendarDateTime` is the analogous wrapper (a
  `value` string constrained to
  `[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(?:\.[0-9]{1,3})?Z`,
  referenced 53 times across the bundle). It carries a time-of-day component
  OCF Date cannot express, so it is not the correspondent for OCF Date.

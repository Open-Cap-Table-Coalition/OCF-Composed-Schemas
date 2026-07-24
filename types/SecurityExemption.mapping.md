---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/SecurityExemption.schema.json
ocf_object_type: null
ocf_title: Type - Security Exemption
ocf_kind: type
required_fields:
  - description
  - jurisdiction
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-05-18
---

# Type - Security Exemption → Carta

> Type representation of a securities issuance exemption that includes an unstructured description and a country code for ease of processing and analysis

## OCF schema

Source: [`SecurityExemption.schema.json`](./SecurityExemption.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/SecurityExemption.schema.json",
  "title": "Type - Security Exemption",
  "description": "Type representation of a securities issuance exemption that includes an unstructured description and a country code for ease of processing and analysis",
  "type": "object",
  "properties": {
    "description": {
      "description": "Description of an applicable security law exemption governing the issuance",
      "type": "string"
    },
    "jurisdiction": {
      "description": "Jurisdiction of the applicable law. This is a free-text field as there is no known enumeration of all global legal jurisdictions, but please try to use ISO 3166-1 alpha-2, if appropriate. Otherwise, we rely on implementers to choose an appropriate value here.",
      "type": "string"
    }
  },
  "additionalProperties": false,
  "required": [
    "description",
    "jurisdiction"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/SecurityExemption.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
status: complete

fields:
  description:
    kind: computed
    target: "#/$defs/Compliance/properties/federalExemption"
  jurisdiction:
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
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FSecurityExemption.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FSecurityExemption.mapping.md&title=%5BMapping+question%5D+SecurityExemption) |
| `description` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FSecurityExemption.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FSecurityExemption.mapping.md&title=%5BMapping+question%5D+SecurityExemption+%2F+description&property_path=description) |
| `jurisdiction` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FSecurityExemption.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FSecurityExemption.mapping.md&title=%5BMapping+question%5D+SecurityExemption+%2F+jurisdiction&property_path=jurisdiction) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- Bucket: type-to-type (1). OCF's `SecurityExemption` is a structured securities-law exemption type, and Carta has one unambiguous home for the concept: `#/$defs/Compliance/properties/federalExemption` (a `FederalExemption` enum). That is exactly the destination called out in the methodology (`SecurityExemption.description -> Compliance.federalExemption`), so this is bucket-1, not bucket-2 — we map the field that has a home and only mark the genuinely-absent field unmappable.
- `description` → `#/$defs/Compliance/properties/federalExemption`. The kind is `computed`, **not** `rename` and **not** `enum-remap`:
  - It is not `enum-remap` because `enum-remap` requires the OCF *source* property to be enum-typed (the validator demands a `values:` map keyed by source enum members). Here the OCF source is a **free-text string** (`"type": "string"`, no `$ref` to an OCF enum), so there is no fixed source value-set to remap onto Carta's `FederalExemption` members.
  - It is not `rename` because `rename` denotes a value-preserving copy. This mapping is **lossy and requires a classification transform at materialization time**: OCF stores the exemption as prose (e.g. "Sold pursuant to Rule 506(b) of Regulation D"), whereas Carta stores a single coded enum value (`REG_D_506_B`, `RULE_701`, `SECTION_4_A_2`, `REG_S`, `REG_CF`, … or `OTHER`). An importer must parse / classify the free-text description into one of the `FederalExemption` members and fall back to `OTHER` (or `NON_US` for non-U.S. exemptions) when no member matches. The derived-from-source-via-transform shape is why `computed` is used, consistent with the precedent in `types/Ratio.mapping.md` and `objects/Document.mapping.md` (both stretch the vocabulary to `computed` when the target value is produced by a transform rather than copied).
  - The mapping is lossy and not round-trippable: the original prose cannot be reconstructed from Carta because the enum discards the unstructured detail. Carta's `FederalExemption` is also effectively US-federal-centric (only `SECTION_756` / `SCHEDULE_11A` are GBR, with `NON_US` as the catch-all), so non-US exemptions generally collapse to `NON_US` / `OTHER`.
- `jurisdiction` → unmappable (`no-equivalent`). The `Compliance` object that hosts `federalExemption` has no field for the **jurisdiction of the exemption itself**; the `FederalExemption` enum is implicitly US-federal and carries no separate jurisdiction slot. Carta does define a `Jurisdiction` type, but it is semantically unrelated: it is the tax-withholding jurisdiction (city / country-subdivision / country used to compute tax withholding on an option exercise, referenced by `TaxWithholding.jurisdiction`), not the jurisdiction whose securities law supplies the exemption. `Compliance.countryOfResidency` / `stateOfResidency` describe the *stakeholder's* residency, not the *exemption's* governing jurisdiction, so they are not a valid home either. There is therefore no Carta field for this OCF property and the jurisdiction context is dropped on import.
- Object-level routing: OCF `SecurityExemption` is `$ref`'d (as an array `security_law_exemptions`) by the issuance transactions `objects/transactions/issuance/StockIssuance`, `EquityCompensationIssuance`, `ConvertibleIssuance`, and `WarrantIssuance`. Carta has no per-issuance exemption collection; the exemption concept lives on the stakeholder-level `Compliance.federalExemption`. Because Carta exposes a single scalar enum while OCF allows a *list* of exemptions per issuance, only one exemption can be represented faithfully and any additional list entries are lossy at the object level — to be resolved when those issuance objects are mapped.
```

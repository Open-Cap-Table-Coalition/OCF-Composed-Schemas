# Codex instructions

## Mapping questions

When adding or reviewing an OCF-to-Carta mapping, use the existing `## Notes / open questions`
section for auditable questions. Keep the questions as ordinary GitHub Markdown task-list items;
do not invent question IDs.

```md
- [ ] `source_property.path`: What needs clarification?
  - Asked by: @github-user
  - Answer: Pending confirmation from the relevant owners.
  - Answered by: —

- [x] `source_property.path`: What was decided?
  - Asked by: @github-user
  - Answer: The decision and its rationale.
  - Answered by: @github-user
```

Rules:

- The property path is optional. When present, it is a source-side path from the mapping's
  sibling schema; dotted paths and JSON-pointer-like paths are supported.
- Every question must have non-empty `Asked by`, `Answer`, and `Answered by` metadata. An open
  question may use `—` for `Answered by`; a checked question must name the answerer.
- Keep answered questions in the mapping Markdown for the GitHub audit trail. The inverse report
  intentionally shows only unchecked questions, beneath the Carta property reached by the
  related mapping edge. Mapping-level questions appear under `(mapping questions)`.
- Do not hand-edit generated reports. Add or answer the question in the upstream mapping file,
  then regenerate or rerun the report.
- Malformed question headers, metadata, answers, or property paths are CI errors.

After changing mapping questions or their parser/reporting behavior, run:

```bash
npm run mapping:validate
npm run mapping:inverse
npm run typecheck
npm run lint
npm test -- --runInBand
```

For the complete mapping DSL and validation contract, read
[`docs/mapping-validation.md`](./docs/mapping-validation.md).

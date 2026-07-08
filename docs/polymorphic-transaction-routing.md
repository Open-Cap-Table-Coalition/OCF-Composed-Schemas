# Polymorphic Transaction Routing: OCF → Carta Per-Instrument Families

Design + as-built notes for extending the `.mapping.md` convention to express how one OCF *polymorphic* transaction routes onto Carta's *dedicated* per-instrument transaction and security families. The design is **implemented in this PR** — the additive validator (`validatePolymorphicMapping`), the `--verbose` route report, per-variant target maps (§4.8), and migrated `EquityCompensationIssuance` / `StockIssuance` mappings. Every Carta type and field named below was confirmed against the pinned bundle `target-schema/Carta.schema.json`; every parser/validator claim against `scripts/lib/{mapping-validator,mapping-parser}.ts`. Where no Carta home exists, that gap is called out rather than papered over.

---

## 1. The problem

OCF encodes instrument identity as a **discriminator field inside one shared transaction type**. Carta encodes it as **dedicated transaction + security families per instrument**. The current convention assumes a 1:1 object correspondence — one OCF schema file maps to one Carta target object via a single `fields:` map — and that assumption is exactly what breaks.

### 1.1 What the current format is

The parser (`mapping-parser.ts`) extracts the frontmatter block and **exactly one** ```yaml``` fence under `## Mapping` (it throws `MappingParseError` if `blocks.length !== 1`). The validator (`mapping-validator.ts`) reads one `fields:` map of `<ocf property> → { kind, target, values?, reason? }`, where:

| kind | meaning | target shape |
|---|---|---|
| `rename` | field → one Carta field | string `#/$defs/.../properties/...` |
| `split` | field → ≥2 Carta fields | array of ≥2 strings |
| `combine` | several OCF fields → one Carta field | string |
| `enum-remap` | rewrite a field's enum **value** | string + `values:` map |
| `computed` | derived | string |
| `unmappable` | no Carta home | `null` (+ optional `reason:`) |
| `TODO` | not yet mapped | `"TODO"` |

Coverage is a single scalar matched by `/^(\d+)\/(\d+)$/`: numerator = non-`TODO` entries, denominator = source property count. In `complete`/`reviewed` status every source property must appear in `fields:`.

### 1.2 The three things this format structurally cannot say

| Gap | Concrete instance | Why the format can't express it |
|---|---|---|
| **Object-level fan-out by discriminator** | `EquityCompensationIssuance.compensation_type` ∈ {OPTION, OPTION_NSO, OPTION_ISO, RSU, CSAR, SSAR} routes one OCF tx to 3 Carta families | `enum-remap` rewrites a *field value*; it cannot switch the *target object*. There is one `target` per field and one Carta `$def` per file. |
| **Cross-record JOIN dependency** | `EquityCompensationExercise` carries only `security_id` — its family lives on the *issuance* record, not on itself | The discriminator is not a property of the record being mapped, so there is no field to hang any kind on. |
| **Behavioral verb divergence** | The same OCF "exercise" verb becomes `OptionExerciseTransaction` for options, `SarExerciseTransaction` for SARs, but `RsuSettlementTransaction` for RSUs — RSUs *settle*, they do not exercise | A different Carta *transaction type* with a different field set is an object-selection decision, not a field rename; the kind vocabulary has no slot for it. |

### 1.3 The two concrete discriminators (issuance level)

| OCF transaction | Discriminator | Values | OCF `anyOf` field-coupling |
|---|---|---|---|
| `EquityCompensationIssuance` | `compensation_type` (**required**) | OPTION, OPTION_NSO, OPTION_ISO, RSU, CSAR, SSAR | OPTION* **require** `exercise_price`; CSAR/SSAR **require** `base_price`; RSU branch adds no constraint. (The `anyOf` only *requires* the opposite price per branch; it never *forbids* a field — both prices remain structurally permitted on every value.) |
| `StockIssuance` | `issuance_type` (**optional**) | RSA, FOUNDERS_STOCK, *absent* | none enforced |
| `ConvertibleIssuance` | `convertible_type` (required) | NOTE, SAFE, CONVERTIBLE_SECURITY | none — single Carta family (the easy contrast case) |

The OCF `anyOf` is not incidental: by *requiring* a different price field per branch it is schema-level evidence that the field set genuinely differs per discriminator value, which is precisely why a single flat `fields:` map cannot be correct for all of them at once. (It is a soft signal, not a hard partition: the `anyOf` only adds `required`s, so an OPTION record may still legally carry `base_price` and an RSU may carry either price. The routing below relies on the *Carta* family shape, not on OCF forbidding anything.)

---

## 2. Routing model

### 2.1 Issuance-level routing graph

Each row is `(discriminator value) → (Carta transaction, Carta security object)`. Every Carta type cited is present in the index.

| OCF tx | Discriminator value | → Carta transaction | → Carta security object |
|---|---|---|---|
| EquityCompensationIssuance | OPTION / OPTION_NSO / OPTION_ISO | `OptionIssuanceTransaction` | `OptionGrant` |
| EquityCompensationIssuance | RSU | `RsuIssuanceTransaction` | `RestrictedStockUnit` |
| EquityCompensationIssuance | CSAR / SSAR | `SarIssuanceTransaction` | **none** (no SAR security `$def`; §6) |
| StockIssuance | RSA | `RsaIssuanceTransaction` | `RestrictedStockAward` |
| StockIssuance | FOUNDERS_STOCK / *absent* | `CertificateIssuanceTransaction` | `Certificate` |
| ConvertibleIssuance | NOTE / SAFE / CONVERTIBLE_SECURITY | `ConvertibleIssuanceTransaction` | `ConvertibleNote` |

Notes grounded in the bundle:
- The OPTION* → `OptionGrant.stockOptionType` step (OCF `OptionType`/`compensation_type` → Carta `StockOptionType`) is the *only* place where today's `enum-remap` applies. Everything else is object-level routing — the format's blind spot.
- CSAR vs SSAR (cash- vs stock-settled) **collapse to one** `SarIssuanceTransaction`; Carta has no settlement-mode field to carry the distinction, so it is lost.
- `ConvertibleIssuance` needs **no** object-level routing: one family, and `convertible_type` is a `NoteBlock.noteType` enum-remap. It fits the *current* format unchanged — the backward-compatibility demonstrator.

### 2.2 Downstream propagation — the JOIN

The instrument family is fixed at issuance. Every downstream `EquityCompensation*` transaction carries only `security_id` and **no** discriminator (verified per file), so its Carta family is undecidable from the record alone:

| OCF transaction | Fields present | Discriminator? |
|---|---|---|
| `EquityCompensationExercise` | security_id, quantity, resulting_security_ids, consideration_text | none |
| `EquityCompensationCancellation` | security_id, quantity, reason_text, balance_security_id | none |
| `EquityCompensationRelease` | security_id, settlement_date, release_price, quantity, resulting_security_ids | none |
| `EquityCompensationRetraction` | security_id, reason_text | none |
| `EquityCompensationAcceptance` | security_id | none |
| `EquityCompensationTransfer` | security_id, quantity, resulting_security_ids, balance_security_id | none |
| `EquityCompensationRepricing` | security_id, new_exercise_price | none |

The routing rule is a lookup the current format cannot encode at all:

```
family(tx) = route( issuances[ tx.security_id ].compensation_type )
```

i.e. `downstream.security_id == issuance.security_id` → read `issuance.compensation_type` → apply §2.1. This is a two-pass requirement: the converter must hold **all issuances indexed** before emitting any downstream tx. A `.mapping.md` is static, instance-free text, so the validator can check the routing's *shape* (the cases cover the enum) but never its *referential resolvability*. The convention must therefore *declare* the join, not pretend to perform it.

### 2.3 Behavioral splits (verb divergence)

The key consequence of §2.2: one OCF verb maps to different Carta *transaction types* — sometimes a categorically different operation.

| OCF verb | Resolved family | Carta transaction | Note |
|---|---|---|---|
| Exercise | Option | `OptionExerciseTransaction` | options exercise (produces an `OptionExercise` record + resulting `Certificate`) |
| Exercise | SAR | `SarExerciseTransaction` | SARs exercise, cash-settled (`cashAcquired`) |
| Exercise | RSU | **none** (invalid) | **RSUs do NOT exercise — they settle.** An OCF *exercise* against an RSU is semantically invalid ⇒ unmappable; RSU settlement is reached via the *Release* verb (next row), which targets `RsuSettlementTransaction`. |
| Release | RSU | `RsuSettlementTransaction` (settlement record `RestrictedStockUnitSettlement`) | OCF release ≈ Carta RSU settlement. `RsuSettlementTransaction` has no price field; `release_price` lands on `RestrictedStockUnitSettlement.settlementPrice` (a distinct `$def`) |
| Release | Option / SAR | **none** | options/SARs do not "release" — unmappable for those families |
| Cancellation | Option / RSU / SAR / RSA / Certificate | `OptionCancellationTransaction` / `RsuCancellationTransaction` / `SarCancellationTransaction` / `RsaCancellationTransaction` / `CertificateCancellationTransaction` | **one OCF cancellation fans out to 5 Carta tx types**, each with its own `*CancellationReason` enum |
| Repricing | Option / SAR | (mutation of `OptionGrant.exercisePrice`) | only price-bearing families; no Carta "repricing" tx exists |
| Transfer | any equity-comp family | **none** | only `WarrantTransferTransaction` exists |
| Retraction | any | **none** | Carta has no retraction tx in any family |
| Acceptance | Option / RSU / RSA | (security field `stakeholderAcceptanceDate`) | not a tx; sets a date on the security object. Present on `OptionGrant` / `RestrictedStockUnit` / `RestrictedStockAward` only |
| Acceptance | SAR / Certificate (default stock) | **none** | no `stakeholderAcceptanceDate` on `Certificate`, and SAR has no security `$def`; unmappable for these families |

---

## 3. Per-variant field divergence (the crux)

The discriminator chooses a different transaction `$def` **and** a different security `$def`, so one OCF property lands at a different JSON Pointer per variant — and some OCF properties have a home in one family and none in another. The price fields the OCF `anyOf` *requires* per branch line up with the per-family Carta price slots, corroborating (not proving) the routing.

### 3.1 `EquityCompensationIssuance` field divergence

`✓` = mapped; `—` = no Carta home in that family. Targets verified against `OptionGrant`, `OptionIssuanceTransaction`, `RsuIssuanceTransaction`, `RestrictedStockUnit`, `SarIssuanceTransaction`.

| OCF field | Option (`OptionIssuanceTransaction`/`OptionGrant`) | RSU (`RsuIssuanceTransaction`/`RestrictedStockUnit`) | SAR (`SarIssuanceTransaction` only) |
|---|---|---|---|
| compensation_type | ✓ enum-remap → `OptionGrant.stockOptionType` (ISO/NSO/OTHER) | — (family implied; no type field) | — (family implied; CSAR/SSAR distinction lost) |
| option_grant_type | ✓ enum-remap → `stockOptionType` (deprecated, redundant) | — | — |
| quantity | ✓ `.quantity` | ✓ `.quantity` | ✓ `.quantity` |
| **exercise_price** | ✓ `OptionIssuanceTransaction.exercisePrice` (anyOf *requires* it here) | — (no price field on `RsuIssuanceTransaction`) | — (`SarIssuanceTransaction` has no separate exercise-price slot; SAR uses `base_price`) |
| **base_price** | — (no Carta home; options don't carry a base price) | — | ✓ `SarIssuanceTransaction.exercisePrice` (anyOf *requires* `base_price` here; OCF `base_price` → Carta `exercisePrice`) |
| **early_exercisable** | ✓ `OptionGrant.earlyExercisable` (**Option-only home**) | — | — |
| expiration_date | ✓ `.expirationDatetime` | — (**no expiration field on RSU**) | ✓ `.expirationDatetime` |
| date | ✓ `.issueDatetime` | ✓ `.issueDatetime` | ✓ `.issueDatetime` |
| security_id, stakeholder_id, custom_id, board_approval_date | ✓ on `OptionGrant` | ✓ on `RestrictedStockUnit` | partial — `SarTransactionItem` carries `securityId`/`securityLabel`/`stakeholderId`, but it is a tx-item wrapper, not a first-class security `$def`; `board_approval_date` has no home (§6.3) |
| stock_class_id / stock_plan_id | ✓ `.shareClassId` / `.equityPlanId` | ✓ | ✓ |
| vesting_terms_id | ✓ `.vestingScheduleTemplateId` | ✓ | ✓ |
| vestings | ✓ `OptionGrant.vestingEvents` | ✓ `RestrictedStockUnit.vestingEvents` | — (no SAR security obj) |
| termination_exercise_windows | ✓ `OptionGrant.exercisePeriods` | — (RSUs settle, no exercise periods) | — |
| stockholder_approval_date, consideration_text, security_law_exemptions, comments | — (absent in family) | — | — |

Cross-variant divergence flags: `exercise_price` (Option only); `base_price` (SAR only, → `exercisePrice`); `early_exercisable` (Option only); `expiration_date` (Option/SAR, not RSU); security-identity fields (Option/RSU, not SAR).

### 3.2 `StockIssuance` field divergence

| OCF field | RSA (`RsaIssuanceTransaction`/`RestrictedStockAward`) | Default — FOUNDERS_STOCK or absent (`CertificateIssuanceTransaction`/`Certificate`) |
|---|---|---|
| issuance_type | — (pure family router; no field) | ✓ enum-remap → `CertificateIssuanceTransaction.issuanceReason` |
| quantity | ✓ `.quantity` | ✓ `.quantity` |
| share_price | ✓ `RestrictedStockAward.pricePerShare` | ✓ `Certificate.pricePerShare` |
| cost_basis | ✓ `RsaIssuanceTransaction.acquisitionCost` | ✓ `CertificateIssuanceTransaction.acquisitionCost` |
| date / security_id / stakeholder_id / stock_class_id / stock_plan_id / custom_id | ✓ | ✓ |
| vesting_terms_id | ✓ `.vestingScheduleTemplateId` | ✓ `.vestingScheduleTemplateId` |
| vestings | ✓ `RestrictedStockAward.vestingEvents` | — (Certificate has only `vestingScheduleTemplateId`; explicit array has no home) |
| **board_approval_date** | ✓ `RestrictedStockAward.boardApprovalDate` | — (**no `boardApprovalDate` on `Certificate`**) |
| **share_numbers_issued** | — (no range field) | — |
| **stock_legend_ids** | — (OCF-REQUIRED; no Carta field) | — (OCF-REQUIRED; no Carta field) |
| stockholder_approval_date, consideration_text, security_law_exemptions, comments | — | — |

The sharp case: `issuance_type` is **structural** (a pure router, no field) in the RSA variant but **enum-remap** (into `issuanceReason`) in the default variant. The *same OCF field has a different kind per variant* — impossible to express with one `fields:` entry.

---

## 4. Proposed format convention

Two design constraints drive everything: (a) **backward compatibility** — a plain `fields:`-only file must validate exactly as today; (b) **one ```yaml``` fence** — the parser's hard `blocks.length === 1` invariant means all routing nests *inside* that single block. No multi-block parsing is introduced.

### 4.1 Two mutually exclusive shapes under `## Mapping`

| Shape | Trigger | Behavior |
|---|---|---|
| **Simple** (today) | `fields:` present, no `discriminator:`/`route_by_security:` | unchanged |
| **Polymorphic (issuance)** | `discriminator:` block + `variants:` map | per-variant field maps |
| **Polymorphic (downstream)** | `route_by_security:` block + `variants:` map | declares the JOIN; per-variant field maps |

### 4.2 Issuance routing keys

```yaml
discriminator:
  field: compensation_type     # must be an enum property of the source schema
  exhaustive: true             # every source enum value must be claimed by some variant
variants:
  Option:
    when: [OPTION, OPTION_NSO, OPTION_ISO]   # discriminator values routed here
    primary_targets:                          # the Carta family this variant materializes
      - "#/$defs/OptionIssuanceTransaction"
      - "#/$defs/OptionGrant"
    fields:                                   # SAME entry grammar as today
      quantity: { kind: rename, target: "#/$defs/OptionIssuanceTransaction/properties/quantity" }
shared:                                        # fields identical across all variants
  stakeholder_id: { kind: rename, target: "#/$defs/OptionGrant/properties/stakeholderId" }
```

- `discriminator.field` — the routing property; validator asserts it is enum-typed via `detectEnumValues`.
- `variants.<label>.when` — the enum values this variant claims. Across all variants these must **partition** the source enum (pairwise disjoint; with `exhaustive: true`, every value claimed).
- `variants.<label>.primary_targets` — the family roots (a list, because one OCF record fans out to a transaction *and* a security object). Each must resolve. For families with no security `$def` (SAR) the list holds only the transaction.
- `variants.<label>.fields` — a complete field map for that variant, using the *exact* existing entry grammar.
- `shared:` — fields common to every variant, expanded into each before coverage counting. A shared field whose *kind* is identical but whose Carta *home* differs by variant uses a per-variant target map (§4.8) instead of a single pointer; the rest carry one pointer (or `unmappable`) as usual.

### 4.3 Downstream routing keys

```yaml
# Example: EquityCompensationCancellation — the one downstream verb where all three
# families have a real Carta tx, so it shows the grammar without a verb-divergence caveat.
route_by_security:
  via: security_id                                    # FK on THIS transaction
  resolve: compensation_type                          # discriminator on the joined issuance
  resolve_enum: ".../enums/CompensationType.schema.json"  # registry $id of that enum, so routes are counted
  source_mapping: ../issuance/EquityCompensationIssuance.mapping.md
  exhaustive: true                                    # every CompensationType value must be routed (or unmappable)
variants:
  Option: { when: [OPTION, OPTION_NSO, OPTION_ISO], primary_targets: ["#/$defs/OptionCancellationTransaction"], fields: { ... } }
  Rsu:    { when: [RSU],  primary_targets: ["#/$defs/RsuCancellationTransaction"], fields: { ... } }
  Sar:    { when: [CSAR, SSAR], primary_targets: ["#/$defs/SarCancellationTransaction"], fields: { ... } }
```

For *Exercise* and *Release* the same grammar applies but some variants resolve to `unmappable` (RSUs settle rather than exercise; options/SARs do not release — §2.3).

`route_by_security:` declares "this mapping is **join-dependent**; an importer must resolve `resolve` from the referenced issuance first." The validator checks structure **and counts the routes**: `via` is a source property; `resolve`/`source_mapping` are present; and given `resolve_enum` (a registry `$id`) the variants' `when:` sets must **partition that enum** — with `exhaustive: true`, every instrument value is routed or explicitly marked unroutable, exactly like the issuance side. It deliberately does not *execute* the join (a real `security_id`'s resolvability is unprovable from static text).

### 4.4 Unmappable discriminator values

Expressed with existing vocabulary, not prose:

```yaml
variants:
  NoCartaHome:
    when: [SOME_VALUE]
    primary_targets: null
    kind: unmappable
    reason: no-equivalent
```

For `EquityCompensationIssuance` all six values route, so no unmappable variant is needed. **Phantom and Piu** Carta families simply never appear as a `primary_target` — the format provides no way to fabricate an OCF source for them, which is the honest outcome.

### 4.5 Coverage and validation per variant

Coverage generalizes from `X/N` to a per-variant map, while keeping a string form for simple files so the existing `/^(\d+)\/(\d+)$/` regex is untouched on the legacy path:

```yaml
coverage:
  Option: 23/23
  Rsu: 23/23
  Sar: 23/23
```

| Check | Mechanism (existing → extended) |
|---|---|
| Discriminator is enum-typed | `detectEnumValues(properties[discriminator.field], registry)` non-null |
| Variants partition the enum | union of `when` lists == source enum set, pairwise disjoint; `exhaustive` ⇒ no missing value (mirrors the values-completeness loop, validator ll. 340–342) |
| `primary_targets` resolve | `resolveJsonPointer` + `derefNode`; reject `true` exactly as `validateEntryTargets` does today |
| Per-variant field targets | run `validateEntryShape` / `validateValuesBlock` / `validateEntryTargets` **once per variant's `fields:`** — zero new target logic |
| Per-variant coverage | for `complete`/`reviewed`, every source property in `shared:` ∪ `variant.fields` for each variant; numerator == non-`TODO` count (reuses the strict loop, ll. 199–205, scoped per variant) |
| Join declared **and routes counted** | if `route_by_security:` present: `via` ∈ source properties; `resolve`/`source_mapping` non-empty; and given `resolve_enum` (a registry `$id`) the variants partition that enum just like the issuance side |

`--verbose` renders the routing line plus **each variant's per-field routes** as a nested tree
(`shared:` shown once), so the routes are auditable in CI output, not just pass/fail.

### 4.6 Minimal parser + validator changes

**Parser: zero structural change.** It already YAML-parses the one frontmatter block and the one `## Mapping` block. `discriminator`, `variants`, `route_by_security`, and a map-valued `coverage` all parse as ordinary YAML; the single-fence invariant holds because everything nests inside that fence.

**Validator: additive dispatch.** Concretely: in `validateMapping`, after parsing, branch — `discriminator`/`route_by_security` absent → existing path untouched; else → new `validatePolymorphicMapping`. Refactor (not rewrite) the per-field loop (ll. 207–227) into `validateFieldMap(fields, properties, strict, ...)` returning `nonTodoCount`; the simple path calls it once, the polymorphic path once per variant. `validateEntryShape`/`validateValuesBlock`/`validateEntryTargets` are reused **unchanged**. Add `validateDiscriminator` (enum check + partition/exhaustiveness) and generalize the coverage check (ll. 229–248) to accept either a string `X/N` or a `label → X/N` map. No change to `KIND_VOCABULARY`, `REASON_VOCABULARY`, `resolveJsonPointer`, `derefNode`, or `targetEnumValuesAt`. Estimated surface: ~3 helpers, one extract-refactor, one coverage branch.

### 4.7 Worked example — `EquityCompensationIssuance.mapping.md`

The proposed `## Mapping` block. Targets verified: `OptionIssuanceTransaction` has `{issueDatetime, quantity, stockOptionType, exercisePrice, equityPlanId, shareClassId, expirationDatetime, vestingScheduleTemplateId}`; `OptionGrant` carries `earlyExercisable`, `vestingEvents`, `exercisePeriods`, `boardApprovalDate`, `stakeholderId`, `securityId`, `securityLabel`; `RsuIssuanceTransaction` has no exercise/base price; `SarIssuanceTransaction` uses `exercisePrice` (no distinct base-price field). `StockOptionType` includes `ISO`, `NSO`, `OTHER`, `STOCK_OPTION_TYPE_INTL`.

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
# routing: discriminator (issuance-time) | route_by_security (downstream)
status: complete

discriminator:
  field: compensation_type
  exhaustive: true

shared:
  # Uniform across variants → single target. Fields whose Carta home diverges use a
  # per-variant target map { Option/Rsu/Sar: pointer|null } (§4.8); null = no home in
  # that variant (SAR has no security object). Abbreviated here; see the real file.
  id:                        { kind: unmappable, target: null, reason: ocf-internal }
  comments:                  { kind: unmappable, target: null, reason: no-equivalent }
  object_type:               { kind: unmappable, target: null, reason: ocf-internal }
  stockholder_approval_date: { kind: unmappable, target: null, reason: no-equivalent }
  consideration_text:        { kind: unmappable, target: null, reason: no-equivalent }
  security_law_exemptions:   { kind: unmappable, target: null, reason: no-equivalent }
  quantity:                                    # transaction-level: same prop, different family   # [1]
    kind: rename
    target:
      Option: "#/$defs/OptionIssuanceTransaction/properties/quantity"
      Rsu:    "#/$defs/RsuIssuanceTransaction/properties/quantity"
      Sar:    "#/$defs/SarIssuanceTransaction/properties/quantity"
  security_id:                                 # security-level: no SAR security object → null
    kind: rename
    target:
      Option: "#/$defs/OptionGrant/properties/securityId"
      Rsu:    "#/$defs/RestrictedStockUnit/properties/securityId"
      Sar:    null
  # …date, stock_plan_id, stock_class_id, vesting_terms_id likewise per-IssuanceTransaction;
  #   custom_id, stakeholder_id, board_approval_date, vestings likewise per-security (Sar: null).

variants:

  Option:
    when: [OPTION, OPTION_NSO, OPTION_ISO]
    primary_targets:
      - "#/$defs/OptionIssuanceTransaction"
      - "#/$defs/OptionGrant"
    fields:
      compensation_type:
        kind: enum-remap
        target: "#/$defs/OptionGrant/properties/stockOptionType"
        values: { OPTION: OTHER, OPTION_NSO: NSO, OPTION_ISO: ISO, RSU: null, CSAR: null, SSAR: null }
      option_grant_type:
        kind: enum-remap
        target: "#/$defs/OptionGrant/properties/stockOptionType"   # [2]
        values: { NSO: NSO, ISO: ISO, INTL: STOCK_OPTION_TYPE_INTL }
      exercise_price:    { kind: rename, target: "#/$defs/OptionIssuanceTransaction/properties/exercisePrice" }
      base_price:        { kind: unmappable, target: null, reason: no-equivalent }   # options never have a base price
      early_exercisable: { kind: rename, target: "#/$defs/OptionGrant/properties/earlyExercisable" }
      expiration_date:   { kind: rename, target: "#/$defs/OptionIssuanceTransaction/properties/expirationDatetime" }
      termination_exercise_windows: { kind: rename, target: "#/$defs/OptionGrant/properties/exercisePeriods" }

  Rsu:
    when: [RSU]
    primary_targets:
      - "#/$defs/RsuIssuanceTransaction"
      - "#/$defs/RestrictedStockUnit"
    fields:
      compensation_type:            { kind: unmappable, target: null, reason: no-equivalent }   # [4] RSU family implied; no type field
      option_grant_type:            { kind: unmappable, target: null, reason: no-equivalent }
      exercise_price:               { kind: unmappable, target: null, reason: no-equivalent }   # RSUs have no price
      base_price:                   { kind: unmappable, target: null, reason: no-equivalent }
      early_exercisable:            { kind: unmappable, target: null, reason: no-equivalent }
      expiration_date:              { kind: unmappable, target: null, reason: no-equivalent }   # no RSU expiration field
      termination_exercise_windows: { kind: unmappable, target: null, reason: no-equivalent }

  Sar:
    when: [CSAR, SSAR]
    primary_targets:
      - "#/$defs/SarIssuanceTransaction"
    fields:
      compensation_type:            { kind: unmappable, target: null, reason: no-equivalent }   # [3] CSAR/SSAR collapse
      option_grant_type:            { kind: unmappable, target: null, reason: no-equivalent }
      exercise_price:               { kind: unmappable, target: null, reason: no-equivalent }   # SAR uses base_price
      base_price:                   { kind: rename, target: "#/$defs/SarIssuanceTransaction/properties/exercisePrice" }
      early_exercisable:            { kind: unmappable, target: null, reason: no-equivalent }
      expiration_date:              { kind: rename, target: "#/$defs/SarIssuanceTransaction/properties/expirationDatetime" }
      termination_exercise_windows: { kind: unmappable, target: null, reason: no-equivalent }

coverage:
  Option: 23/23
  Rsu: 23/23
  Sar: 23/23

# Notes
# [1] shared: fields whose Carta home diverges use a per-variant target map (§4.8) — each variant
#     names its own object directly (Option→OptionGrant/OptionIssuanceTransaction, Rsu→Restricted-
#     StockUnit/RsuIssuanceTransaction, Sar→SarIssuanceTransaction; SAR security fields → null).
# [2] option_grant_type is OCF-deprecated and overlaps compensation_type; both land on stockOptionType.
#     The format lists both targets but cannot encode "compensation_type wins" — that is importer logic.
# [3] CSAR vs SSAR (cash- vs stock-settled) collapse to one SarIssuanceTransaction; no Carta field carries it.
# [4] RSU/SAR have no enum field for compensation_type — mark it unmappable (the family is implied by the
#     variant). This is distinct from the SHARED identity fields, which land on a different security object
#     per variant and are handled by per-variant target maps (§4.8), not by marking compensation_type.
```

### 4.8 Per-variant target maps (divergent shared homes)

A `shared:` field is common to every variant, but its Carta *home* often differs by variant — `quantity` lands on `OptionIssuanceTransaction` for options, `RsuIssuanceTransaction` for RSUs, `SarIssuanceTransaction` for SARs; `security_id` lands on `OptionGrant` vs `RestrictedStockUnit` and has **no** home for SARs. Rather than pin the field to one representative family, its `target:` is a **map keyed by variant label** instead of a single pointer:

```yaml
shared:
  quantity:                                    # transaction-level: same prop, three families
    kind: rename
    target:
      Option: "#/$defs/OptionIssuanceTransaction/properties/quantity"
      Rsu:    "#/$defs/RsuIssuanceTransaction/properties/quantity"
      Sar:    "#/$defs/SarIssuanceTransaction/properties/quantity"
  security_id:                                 # security-level: SAR has no security object
    kind: rename
    target:
      Option: "#/$defs/OptionGrant/properties/securityId"
      Rsu:    "#/$defs/RestrictedStockUnit/properties/securityId"
      Sar:    null     # = unmappable in this variant
```

Validator rules (the keys must **stay in sync** with the variant set):

| Rule | Error when violated |
|---|---|
| **Completeness** — an entry for every variant | `target map is missing variant "Sar"` |
| **No unknown keys** — every key is a real variant | `target map key "Rus" is not a variant (have: Option, Rsu, Sar)` |
| **Each value resolves or is null** | `target for variant "Sar" "#/$defs/X" does not resolve…` (a non-`#/…` value → `…must be a "#/..." pointer or null`) |

`null` = unmappable in that variant (still a covered, non-`TODO` entry, so per-variant `coverage` is unchanged). Map targets are allowed only on `rename`/`computed`/`combine` `shared:` entries — not on `enum-remap` (route enum *values* in `variants.fields`) and not inside a variant's own `fields:` (already variant-specific). Keyed by **variant label**, not discriminator value, so the `Sar` variant — which claims both `CSAR` and `SSAR` — gets one entry, not two. `--verbose` renders each variant's own target (or `✗ unmappable`) beneath the field, so RSU/SAR name their own objects instead of borrowing a representative pointer.

Implemented in `validateSharedTargetMaps` (`scripts/lib/mapping-validator.ts`): it validates the maps once, then projects each into the per-variant effective field map (a `null`/absent value becomes an internal `unmappable` so coverage counts it and the per-field validator does not re-flag it). Backward compatible — a string/array/`null` `target:` keeps the legacy single-target path byte-for-byte.

---

### 4.9 Composite steps (one OCF verb → an ordered set of Carta transactions)

Some OCF transactions have **no single Carta target** because Carta records ledger *state*, not the event: a stock transfer is not a `*TransferTransaction` (there is none for certificates) but a **pair** of certificate events — cancel the source, issue the transferee's. `composite:` models that fold. It is orthogonal to variants: variants are **mutually exclusive** (pick one family), whereas composite steps are **additive** (all emitted, in declared order).

```yaml
route_by_security: { via: security_id, resolve: issuance_type, ... }   # family axis (kept)

composite:                                   # ordered steps, ALL emitted
  - step: cancel
    target:                                  # per-family Carta $def (diverges by family)
      Default: "#/$defs/CertificateCancellationTransaction"
      Rsa:     "#/$defs/RsaCancellationTransaction"
    const: { Default: { reason: CERTIFICATE_CANCELLATION_REASON_TRANSFERRED } }
  - step: issue
    target:
      Default: "#/$defs/CertificateIssuanceTransaction"
      Rsa:     "#/$defs/RsaIssuanceTransaction"
    const: { Default: { issuanceReason: CERTIFICATE_ISSUANCE_REASON_TRANSFERRED } }

shared:
  quantity:                                  # the payload that had no home now lands
    kind: rename
    target:                                  # per-STEP, then per-family (reuses §4.8's map shape)
      cancel: { Default: ".../CertificateCancellationTransaction/properties/quantity",
                Rsa:     ".../RsaCancellationTransaction/properties/quantity" }
      issue:  { Default: ".../CertificateIssuanceTransaction/properties/quantity",
                Rsa:     ".../RsaIssuanceTransaction/properties/quantity" }
```

**The step map reuses §4.8's `{ key: pointer }` shape**, keyed by step id instead of variant label — the two key spaces are disjoint, so a `target:` map is read as per-step when its keys are step ids and per-variant otherwise. A payload field's target may nest both axes (`{ step: { family: pointer } }`). The Core converter reduces the step dimension to one landing pointer per family (the `issue` step wins where it lands, else `cancel`); the full per-step maps are kept for the coverage/ledger docs.

`const:` captures the fixed Carta values a step always carries (the `*_TRANSFERRED` reason enums). It is validated against the step's `$def`: the property must exist and, if enum-typed, the value must be a member. `const` may be per-family (`{ Default: { reason: … } }`) — needed here because `RsaCancellationReason` has no `*_TRANSFERRED` member, so the RSA steps omit it.

Validator rules:

| Rule | Error when violated |
|---|---|
| **Non-empty ordered steps** | `composite: must declare at least one step` |
| **Unique step ids** | `composite step id "cancel" is declared more than once` |
| **Step target resolves** (per family) | `composite step "cancel" target for variant "Rsa" "#/$defs/X" does not resolve…` |
| **`const` field exists on the step $def** | `composite step "cancel" const.reason has no property "reason" on #/$defs/…` |
| **`const` enum value is a member** | `composite step "cancel" const.reason = "BOGUS" is not a member of the target enum…` |
| **Requires a polymorphic block** | `composite: is only supported alongside a route_by_security or discriminator + variants block` |

**Why it matters for Core.** Before, a stock transfer landed only lineage references → no payload → held out of Core (§3 non-degeneracy). With `composite:`, `quantity` lands on the step transactions — a real payload — so `StockTransfer` becomes Core-admissible. The generated membership ledger (`core/core-ledger.md`) gains a **Composite folds** section listing each composite entity and the Carta objects each step lands on, and `--verbose` renders the steps beneath the routing line. Implemented in `validateCompositeBlock` + `validateSharedTargetMaps` (`scripts/lib/mapping-validator.ts`) and projected by `variantFieldMaps` (`scripts/lib/core-corpus.ts`). Proven on `StockTransfer`; the sibling transfers (`ConvertibleTransfer`, `EquityCompensationTransfer`, `PlanSecurityTransfer`) are the same "cancel + reissue" shape.

---

## 5. Migration

Roughly ten mappings are affected. The convention is purely additive, so adoption is incremental and each file migrates independently. **Status:** the validator + `--verbose` report and the two issuance fan-outs (`EquityCompensationIssuance`, `StockIssuance`, both with per-variant target maps) are implemented in this PR; the downstream `route_by_security:` verbs below remain a roadmap.

| File | Today | Migrates to | Notes |
|---|---|---|---|
| `issuance/EquityCompensationIssuance.mapping.md` | `fields:` TODO stub | `discriminator: compensation_type` + 3 variants | the canonical fan-out (§4.7) |
| `issuance/StockIssuance.mapping.md` | `fields:` | `discriminator: issuance_type` + RSA / default variants | default branch = absent ⇒ Certificate |
| `issuance/ConvertibleIssuance.mapping.md` | `fields:` | **stays simple** | single family; no routing needed — proves backward-compat |
| `exercise/EquityCompensationExercise.mapping.md` | `fields:` | `route_by_security:` + Option/Sar (+ Rsu) | Option → `OptionExerciseTransaction`, SAR → `SarExerciseTransaction`; an exercise against an RSU is semantically invalid (RSUs settle via *Release*, §2.3) ⇒ Rsu variant = unmappable |
| `cancellation/EquityCompensationCancellation.mapping.md` | `fields:` | `route_by_security:` + 3+ variants | fans to Option/Rsu/Sar cancellation, each its own reason enum |
| `release/EquityCompensationRelease.mapping.md` | `fields:` | `route_by_security:` | RSU → `RsuSettlementTransaction`; Option/SAR variants = unmappable |
| `retraction/EquityCompensationRetraction.mapping.md` | `fields:` | `route_by_security:` (all-unmappable) | no Carta retraction tx anywhere |
| `acceptance/EquityCompensationAcceptance.mapping.md` | `fields:` | `route_by_security:` | Option/RSU/RSA set `stakeholderAcceptanceDate` on the security (not a tx); SAR/Certificate variants = unmappable (no such field) |
| `transfer/EquityCompensationTransfer.mapping.md` | `fields:` | `route_by_security:` (all-unmappable) | no equity-comp transfer tx (only Warrant) |
| `transfer/StockTransfer.mapping.md` | `route_by_security:` all-unmappable event | `route_by_security:` + `composite:` (cancel + issue) | **§4.9** — folds to Certificate/Rsa cancel + issue; `quantity`/`date` land, so it enters Core |
| `repricing/EquityCompensationRepricing.mapping.md` | `fields:` | `route_by_security:` | Option/SAR mutate `exercisePrice`; RSU = unmappable |

Adoption path:
1. **PR-1 (validator):** land the additive dispatch behind the existing `validateMapping` branch; legacy files are untouched and keep passing. Default `requireUnmappableReason: false` is preserved.
2. **PR-2 (easy case):** migrate `ConvertibleIssuance` — it stays simple, demonstrating the no-op path, plus add the first downstream all-unmappable file (`Retraction` or `Transfer`) to exercise `route_by_security:` structurally.
3. **PR-3 (issuance fan-out):** `EquityCompensationIssuance`, then `StockIssuance`.
4. **PR-4 (downstream verbs):** `Exercise`, `Cancellation`, `Release`, then the remaining all-unmappable files.

Because the dispatch is "discriminator/route_by_security absent ⇒ old path," no file changes behavior until it is rewritten, satisfying the backward-compatibility constraint.

---

## 6. Limits and open questions

### 6.1 What stays unexpressible

| Limit | Detail |
|---|---|
| **Resolvability is unprovable** | `route_by_security:` declares the join; a static `.mapping.md` can never verify that a real `security_id` resolves. Validation is shape-only. |
| **Coverage is per-variant only** | A field mapped in Option but unmappable in RSU has no single coverage number; the scalar `X/N` had to become a map. |
| **Cross-field precedence** | `compensation_type` and deprecated `option_grant_type` both target `stockOptionType`; the format lists both but cannot say which wins. Importer logic. |
| **Shared field, divergent *kind*** | Per-variant target maps (§4.8) **solve** the divergent-*home* case — a shared field of uniform kind landing on `OptionGrant` vs `RestrictedStockUnit` now names each directly. The residual: a field whose *kind* differs per variant (e.g. `StockIssuance.issuance_type`: a structural router in RSA but `enum-remap` in default, §3.2) cannot be `shared:` at all — it lives in each variant's `fields:` instead. |
| **One discriminator axis** | Routing is on a single field. `composite:` (§4.9) adds an orthogonal *additive* step axis (family × step, all steps emitted), but a second mutually-exclusive *discriminant* (type × settlement mode) would still need nested variants — undefined here. |
| **Lossy collapses are recorded, not repaired** | CSAR vs SSAR collapse; `OPTION` (unspecified) → `OTHER`. Visible as enum-remap values / `no-equivalent`, but lossy by Carta's design. |

### 6.2 Carta-side import assumptions

The model assumes Carta's importer (a) holds the full issuance set indexed so it can resolve `security_id → compensation_type` (the two-pass requirement), (b) materializes the per-family transaction *and* security object named in `primary_targets`, and (c) reconciles deprecated/overlapping OCF fields itself (e.g. `option_grant_type` vs `compensation_type`). The `.mapping.md` describes *intent*; the importer owns *execution*.

### 6.3 Discriminator values and families with no home

| Item | Status |
|---|---|
| **No SAR security `$def`** | Carta has the full SAR *transaction* family (`SarIssuanceTransaction`, `SarExerciseTransaction`, `SarCancellationTransaction`) but **no first-class SAR security object** like `OptionGrant`. The only SAR-level container is `SarTransactionItem` (a tx-item wrapper), which carries `securityId`/`securityLabel`/`stakeholderId` — so identity fields *could* land there — but it exposes no slot for `custom_id`, `board_approval_date`, `vestings`, or `termination_exercise_windows`. **As built, the `Sar` column marks all five security-level fields (`security_id`/`custom_id`/`stakeholder_id`/`board_approval_date`/`vestings`) `null`** rather than routing identity onto the tx-item wrapper — `SarTransactionItem` is not a security object. **Do not invent a SAR security `$def`.** |
| **CSAR vs SSAR** | Collapse to one `SarIssuanceTransaction`; the cash-vs-stock-settled distinction is not representable. |
| **`stock_legend_ids`, `share_numbers_issued`** | OCF carries them (the former REQUIRED); no Carta home in either `StockIssuance` variant. |
| **`early_exercisable`** | Option-only; unmappable for RSU and SAR. |
| **No-Carta-target verbs** | `EquityCompensationTransfer` (no equity-comp transfer tx), `EquityCompensationRetraction` (no retraction tx anywhere), `EquityCompensationRelease` for non-RSU families — all per-case `unmappable`. |
| **Phantom / Piu** | Carta-only families (`PhantomIssuanceTransaction`, `PiuIssuanceTransaction`, …). **No OCF discriminator value routes to them.** They are unreachable targets, not gaps in OCF coverage; the format never names them as `primary_targets`. |

---

*Verification basis: OCF schemas under `objects/transactions/{issuance,exercise,cancellation,release,retraction,acceptance,transfer,repricing}/`; enums `CompensationType`, `OptionType`, `StockIssuanceType`, `ConvertibleType`; Carta bundle `target-schema/Carta.schema.json`; validator `scripts/lib/mapping-validator.ts`; parser `scripts/lib/mapping-parser.ts`.*

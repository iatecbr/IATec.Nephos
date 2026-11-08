# Angular validation of `@iatec/nephos@5.0.0-rc.2`

This note has no translations: it is an internal validation record, not usage
documentation. See [`../../i18n.md`](../../i18n.md).

On 2026-11-07, `@iatec/nephos@5.0.0-rc.2` (installed from the private
`IATec.Community` feed) was used in a real Angular 22 app: every exported
component on its own route, plus four composed screens. Two reports came out of
it. This folder keeps both, rendered into English from the Portuguese originals
(`VALIDACAO.md` and `AUDITORIA-UX.md`), with no finding dropped, merged or
re-ranked.

## Status

- **Raw findings, with a triage proposal.** [`triage.md`](triage.md) sorts them by
  who can act (Figma and Indiane, code, documentation, outside the library).
  Indiane decides and opens the DSA tasks from Jira. These files carry **no DSA
  ID** on purpose: the IDs come from Jira, not from this repository.
- **Nothing here is a decision.** Every "suggested fix" is the validator's
  proposal. A finding about a token, a component sheet or a rule becomes a change
  only through the usual path in `AGENTS.md` and `CLAUDE.md` (for example, tokens
  come from Figma, through Claude in Figma).
- **Evidence is not in this repository** (see [Evidence](#evidence)).

## Files

| File | What it holds |
|---|---|
| [`validation.md`](validation.md) | DX, Angular integration and packaging: per-component verdicts, prioritized findings P0/P1/P2, packaging findings E1–E13, reproduction steps, what was not tested, the Phase B install result. |
| [`triage.md`](triage.md) | Triage of both reports: group A (Figma and Indiane, 16 themes), group B (code, in 19 batches), group C (documentation), group D (outside the library or to verify), what rc.2 already resolved, and the questions for Indiane and Elvys. Proposal only; no decision. |
| [`ux-audit.md`](ux-audit.md) | Layout and usability audit made with the `impeccable` skill: the top 10 findings, cross-cutting patterns, four composed screens, 41 components, notes from the batches. Each finding has a severity, a cause (`component`, `composition` or `both`), where, user impact and a suggestion. |

## What was validated

| Item | Value |
|---|---|
| Package | `@iatec/nephos@5.0.0-rc.2` from the `IATec.Community` feed; integrity `sha512-WFBsUJTvc7Lmw4SOv7r7urmU4x3Eyf06NqsfNqJ715KsG/NqIYj4H40CISF8Z78eDQjH0gigkcsB7I5PrRqC6w==` matches the `package-lock.json` of the validation app |
| App | Angular 22.2.6, standalone, lazy routes, zoneless, `strict` + `strictTemplates`, `--ssr=false`, `lit 3.3.3`, Font Awesome Pro 6.7.2 |
| Coverage | 41 component routes, 4 composed screens, 3 findings routes (48 routes); the audit covers 45 targets (41 components + 4 screens) at 1440, 1024, 768 and 375 px, light, dark and the `educacao` brand at 1024 |
| Phases | A: tarball of `origin/v/5.0.0` at `a3414a1` (labeled rc.1). B: install of rc.2 from the feed. C: the UX audit |

## Counts, as the sources state them

**`validation.md`**

| Item | Count |
|---|---|
| Verdicts | 19 makes sense, 22 makes sense with adjustments (including `nph-input`), 0 blocked: 41 components |
| P0 | 5 (numbered #1–#5) |
| P1 | 7 (numbered #6–#12) |
| P2 | 10 bullets (unnumbered) |
| Packaging findings | E1–E13 (13 rows) |
| Component sections | 41 (`nph-*`) |

**`ux-audit.md`**, the summary table as the source states it

| Severity | Entries |
|---|---|
| P0 | 0 |
| P1 | 29 (26 distinct: the dark-theme brand token defect appears 4 times) |
| P2 | 80 |
| Total | 109 |

Cause, for the 107 entries with a classified cause: component 74 (69%), both 28
(26%), composition 5 (5%). By batch (P1 / P2): U1 actions 4 / 15, U2 forms 1 / 16,
U3 selection and identity 4 / 8, U4 display 2 / 11, U5 data and overlays 7 / 13,
U6 navigation and screens 11 / 17.

### Where the sources and the brief disagree

These were found while checking the counts. They are reported, not resolved.

1. **Packaging findings go to E13, not E12.** `validation.md` has 13 rows. E13
   (`tokens.css` and `scrollbar.css` byte-identical between Phase A and rc.2) is
   an "OK" row, like E8, E9 and E10; E12 is resolved and E1 is partially resolved.
2. **The audit has 112 finding headings, not 109.** Counting the `####` headings
   of `ux-audit.md` directly gives 29 P1 + 83 P2 = 112. The summary table says
   80 P2 and 109. The 3 extra headings are the ones whose tag is not a plain
   `[P2]`: `[P2, composition]` (`tela-listagem`, focus after deleting) and two
   `[P2 / both]` (progress, empty). The Portuguese source counts the same way, so
   the gap is in the source's summary, not in the translation. The per-batch notes
   in `notes/` agree on U1, U2, U3 and U6 and give 13 (stated 11) for U4 and
   14 (stated 13) for U5, so the batch split of the 3 is not fully traceable.
   `ux-audit.md` keeps the source's summary table verbatim and all 112 headings.
3. **P2 in `validation.md` is a bullet list**, with no numbers: 10 top-level
   bullets, each with its own suggested fix.
4. **Small inconsistencies in the source are kept as written:** "48 routes" in
   the summary versus "40 lazy routes" in E10; "all 40 components" in E4 versus 41
   exported by rc.2; and, in the breadcrumb audit finding, the page width at 768 px
   is given as 782 px while the natural list width is 766 px and the container
   736 px.

## Evidence

The validation app is a **sibling local project with a local git repository and
no remote**: `Projects/IATec/Community/nephos-validacao-rc2/`. It holds the app
(`src/`), the screenshots (`shots/`, 43 MB) and the per-batch notes (`notes/`).
This repository has no evidence images, so none were copied.

References in the two reports use paths relative to that project:

- `shots/<name>.png` for the composed screens (for example
  `shots/cadastro-2-erros.png`) and `shots/componentes/` for a sample of
  component captures;
- `shots/auditoria/<slug>/` for the audit, with the widths `1440`, `1024`, `768`,
  `375`, `1024-dark`, `1024-educacao` and the `detalhe-*.jpg` files that back
  each finding; `shots/auditoria/metrics.json` holds the measured layout metrics;
- the route to open in the app is `/<slug>` for a component (for example
  `/tooltip`) and `/tela/<name>` for a composed screen; findings routes are
  under `/achados/`.

The last commit of the validation project when this record was made is `83044a1`
(2026-11-07). If the evidence needs to live in the repository later, that is a
separate decision: nothing in the repository's tooling accepts images as
evidence today.

## How to use this for triage

- Group by owner of the fix: package and build (`validation.md` §3 and P0 #2),
  component code (most P0/P1 items), tokens (the dark-theme brand contrast defect
  in `ux-audit.md` §2 item 1 and §6), component sheets and documentation (E1, E2,
  the sheet gaps called out per component) and the consumer side (the Angular
  value accessor and router patterns).
- A finding marked `composition` in the audit is a defect of the validation app's
  own markup and CSS, not of the library.
- The "Not verified" and "What was NOT tested" sections list what the validation
  did not cover: server-side rendering, a real screen reader, real touch devices,
  right-to-left layouts, `prefers-reduced-motion`, brands beyond `sistemas` and
  `educacao` in most batches.

## Provenance

| Source (outside this repository) | Rendered into |
|---|---|
| `VALIDACAO.md` (878 lines) | [`validation.md`](validation.md) |
| `AUDITORIA-UX.md` (1,318 lines) | [`ux-audit.md`](ux-audit.md) |
| `notes/` (per-batch notes) | not copied; the reports are the record |

Quoted labels, strings and measurements taken from the validation app's
Portuguese interface are kept verbatim in backticks, with an English gloss where
the meaning matters. They are test data, not repository text.

The component sheets in `fichas/` are English only, so any sentence the Portuguese
reports attribute to "the sheet" is the validator's paraphrase, translated back
into English here, not a quotation. The authoritative text is
`fichas/<name>.md` at the commit being triaged. One case was checked: the
breadcrumb sentence in P0 #4 does not exist in the current sheet, and
`validation.md` carries an editorial note saying so.

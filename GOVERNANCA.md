---
titulo: Governance and mandatory preflight for AI — Nephos
tipo: operational standard
versao: 1.3
data: 2026-08-25
status: vigente
origem: migrated from the work vault on 2026-08-24, to the `v/3.0.0` branch
leitura_obrigatoria: true
precedencia: 1
---

# Governance and mandatory preflight for AI — Nephos

> **Mandatory reading before any analysis, proposal, edit or implementation in Nephos.** Read only the sources that apply to the task. If the current source needed for a decision is missing, stop and ask for confirmation; do not fill gaps by inference. The absence of a prior implementation does not block a task whose authorized goal is to create that implementation.

## 1. Single source per subject

| Subject | Current source | Do not use as a source of the current rule |
|---|---|---|
| Precedence and working rule | This note | Session notes, meeting reports, scripts or studies |
| Token values and visual decision | Figma `DS-IA-NEPHOS 5.0`; the specific foundation note explains the use | The Obra kit as if it were a direct implementation, a literal value or an old example |
| Technical contract for code | `design.md`, at the root of this repository | Literal values, old examples or context notes |
| Token value in the repository | `src/tokens/source/*.tokens.json`, generated into `src/tokens/generated/tokens.css`; see [`docs/tokens.md`](docs/tokens.md) | The generated CSS, which is never a source; a literal value written by hand in a component |
| Technical decisions P01, P02, P03, P17, P19, P20, P21 and P62 | [`docs/decisoes-tecnicas.md`](docs/decisoes-tecnicas.md) | §9 and §10 of `design.md`, which point to this note; any text that still calls any of them a pending item |
| Order and evidence of the phases | Planning record kept by Indiane, **outside this repository**. The agent has no access to it: if the task depends on this order, stop and ask | A percentage without a formula or a historical checklist |
| Component scope | The P0 cut in `README.md`. The full v1 list was closed on 26-08-2026 — 75 public components in 6 waves — and is kept outside this repository | Any component list not published here |
| Delivered implementation | Branch, commit, PR and Storybook of this repository | A statement in a note without evidence in the repository |
| Sheet, variants, states and selection rule of a component | `fichas/<name>.md`, with the template at `fichas/_modelo.md` | A vault note, a Figma screenshot or Storybook text without a source |
| Accepted Figma documentation of a component | The `figma-docs-accepted` gate of the task in `docs/operacao/tarefas/<ID>.md`, with the evidence in `docs/operacao/evidencias/<ID>/` | A conversation, screenshot, verbal approval or Figma comment without versioned evidence |

In a conflict, the source on the corresponding row prevails. A historical source can only record what happened; it does not prescribe what to do now.

## 2. Current state

- Gate 0 and Phase 1 are **documentarily complete**; the visual evidence is in the Figma `DS-IA-NEPHOS 5.0`.
- The technical contract is `design.md` at the root of this repository.
- The foundations live in the Figma `DS-IA-NEPHOS 5.0` — `core`, `theme` and `semantic` variables, text styles and effect styles — and, in code, in `src/tokens/source/*.tokens.json`. The current list of icons is `icones_nucleo`, in `design.md`. This file does not record counts: consult the source.
- Icons: the package is **Font Awesome Pro** and **Classic** is the default family. **Duotone is allowed only in structural navigation** — menu, sidebar, navigation group, shortcut and location indicator. Outside navigation it remains forbidden: button, field, feedback, validation, alert, table and destructive action. Do not mix Duotone and Classic in the same navigation group. Light, Thin and Sharp remain forbidden. The license key lives in an environment variable and never enters the repository. *Decision by Indiane on 2026-08-24; replaces the previous rule, which forbade Duotone entirely.*
- The v1 cut has been closed since 26-08-2026: 75 public components, Waves 1 to 6. The implementation of each one remains subject to the component gate.
- **Implemented components on `v/5.0.0`**, with stories and tests: `nph-icon` since PR #6 (merge `437dd60`), `nph-label` since PR #10 (merge `e231eba`), `nph-tooltip` since PR #51 (merge `d4ff326`), `nph-spinner`, `nph-separator` and `nph-kbd` since PR #54 (merge `d01da7b`), and `nph-badge` and `nph-button` since PR #56 (merge `455ead8`). PR #7 recorded P21 (`8fe4271`) and PR #8 organized the Storybook navigation (`79187c0`). The source of this list is `src/components/` on `v/5.0.0`; the other components remain unimplemented.
- **Base token migration on 24-08-2026**, on the `feat/tokens-json` branch, checked against Figma token by token and mode by mode, with **zero divergences**. The following additions are in the Git history and in [`docs/tokens.md`](docs/tokens.md). The primitives of **P46** were left out by recorded decision. The other primitives remain **deferred** — deferred does **not** mean without a consumer. The text styles left the deferral on 27-08-2026 and the effect styles on 03-09-2026 — the elevation ones and the focus rings. The error ring is called **`focus-ring/invalid`**, and not `focus-ring/error`: the old name collided, in the generated CSS, with the color variable `focus/ring-error`, and Indiane decided on 03-09-2026 to rename the style, not the published color — see [`docs/tokens.md`](docs/tokens.md).
- The technical decisions **P01, P02, P03, P17, P19, P20 and P21 stopped being pending items on 24/08/2026 (P21 on 26/08/2026)** and are recorded in [`docs/decisoes-tecnicas.md`](docs/decisoes-tecnicas.md). **Elvys reviewed and approved all of them on 28/08/2026.** P62 (`nph-label`, typography and dimensions), recorded in the same note on 27/08/2026, was also reviewed by Elvys on 28/08/2026: he approved P62.1, P62.2 and P62.3 as recorded; for P62.4, he decided to migrate the generator from `px` to `rem`, **a migration implemented on 28-08-2026 and merged in PR #12**. **P62.5**, adopted by Indiane on 28-08-2026, keeps `core/radius` in `px`; its documentary evidence was reviewed by Copilot on 09-09-2026. They are current rules: follow them. To change any of them, explain the technical conflict, record a proposal and ask for human review.
- P17 fixes the canonical source by responsibility: **Figma** is the visual source; `design.md` is the human and agentic contract, not the generation file; the **JSON** is the versioned technical source of the audited values; the **CSS custom properties** are generated from the JSON and are not edited by hand. The generation tool, the extension namespace and the public attributes `data-nph-brand` and `data-nph-color-scheme` are fixed by **P20**. Only a value with verifiable evidence of reading Figma enters the JSON.

## 3. How to measure progress

Progress to delivery uses the eight phases with the same weight, without counting Gate 0 as a ninth phase:

`(F0 + F1 + F2 + F3 + F4 + F5 + F6 + F7) / 8`

Gate 0 is a condition for passing to Phase 0; it is never added again to the total percentage. An item can only be marked complete when it records: date, owner, evidence source and verifiable location. The plan's checkboxes measure only the plan itself, not the whole project.

## 4. Mandatory preflight

Before acting, the AI must:

1. Read this note, `README.md`, `design.md` and the component sheet, when applicable.
2. To state a visual value or rule, consult the Figma `DS-IA-NEPHOS 5.0` or ask for an export/verifiable confirmation when there is no access.
3. Identify the current source of each statement it intends to use.
4. Explicitly distinguish verified fact, current decision, proposal and pending item.
5. Check that the token, component and variant exist in the current source.
6. Stop and ask when a decision, a sheet needed for the task or a source of truth is missing, or when there is a conflict between current sources. The absence of a branch, commit or Storybook blocks only the **claim** that they exist; it does not block an authorized task to create them.
7. Update the affected sources simultaneously when a decision changes: contract, foundation note, plan/state and derived documentation.
8. On closing, record evidence, date, owner, changed decision and synchronized documents.

### The order of a component

A component does not start with the code. The sequence is **accepted Figma documentation → local code → final sheet → review and PR**, and it is enforced by the machine, not by the goodwill of whoever executes:

1. **Before any component code**, the documentation of the piece in the Figma `DS-IA-NEPHOS 5.0` must be accepted by Indiane and recorded in the task's `figma-docs-accepted` gate, with evidence in `docs/operacao/evidencias/<ID>/`. Without that, the task is not `ready` or `in-progress`: it is `blocked`.
2. **While the task is `ready` or `in-progress`**, local code without a sheet is allowed. A sheet required in the first commit becomes a form filled in blind; it leaves the practice.
3. **Before `in-review` and `done`**, the canonical sheet at `fichas/<piece>.md` must exist.

The verifier enforces the three moments in `V30`, `V28` and `V31` — see [`docs/operacao/README.md`](docs/operacao/README.md), §2b and §5b.

## 5. Safeguards against documentation errors

These rules were born from the audit of 21-08-2026 and are mandatory for every
AI that consults or changes this documentation:

1. **The current state beats history.** Use the **Current state** block and
   the canonical source of the subject to prescribe actions. Earlier sessions,
   reports, superseded lists and decisions marked as historical or superseded
   only explain the past; never create a current rule from them.
2. **Delegated is not closed.** A decision delegated to a person, to
   engineering or to legal stays open until the evidence required in the
   appropriate source is recorded. Do not declare it complete because there is
   an owner, an intention, a recommendation or a prior conversation.
3. **A pending item only closes with proof.** Before moving a pending item to
   closed, record the decision or evidence, date, owner and verifiable
   location. If the rule has independent parts, close only the proven part and
   keep the others open.
4. **Every scope change requires an impact analysis.** When creating, merging,
   removing or making a component internal, check and update, where
   applicable: current list, numbering, total of components, progress formula
   and denominator, remaining items, plan, contract and derived documents.
   Validate the count on the complete list, without counting a priority cut
   twice.
5. **Edit the right source before the copies.** Update the canonical source
   first. Historical or superseded documents only receive a supersession note
   when necessary so as not to contradict the current rule; do not rewrite the
   past or assume they have the same structure as the current source.
6. **A failed validation is not a validation.** If a search, script or check
   fails, investigate the cause, fix the method and run it again before
   declaring the result. Record only the checks that actually passed.

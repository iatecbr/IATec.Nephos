# Nephos — instructions for agents

> **Before creating or changing any UI, read and follow `GOVERNANCA.md` and
> `design.md`. Before using a component, open its sheet at
> `fichas/<name>.md`.**

> **This is the shared contract for all agents.** `CLAUDE.md` is not a mirror
> of this file: it adds only what is exclusive to Claude and points here for
> everything else. A rule that applies to any agent changes here, and only
> here.

## Mandatory preflight

Before analyzing, proposing, editing or implementing:

1. Read `GOVERNANCA.md`, `README.md`, `design.md`,
   `docs/decisoes-tecnicas.md`, the component sheet at `fichas/<name>.md` and
   the applicable foundation note. The sheet template is `fichas/_modelo.md`.
   When `product.md` exists with approved content, read it too. When
   `docs/operacao/` exists, open the indicated task and its evidence before
   any short session context.
2. Consult the Figma `DS-IA-NEPHOS 5.0` to state or change token values and
   visual decisions. Without access, ask for an export or a verifiable
   confirmation.
3. Declare the sources read, the applicable constraints, the gaps or
   conflicts, and the evidence that already exists in the repository.
4. Verify that every token, component, variant and state exists in the
   current source.
5. Stop and ask for confirmation when facing a decision gap, a required
   sheet, a missing source of truth or a conflict between current sources.

## Safeguards against documentation errors

1. The current state and the canonical source win over sessions, lists and
   historical or superseded decisions. History explains the past; it never
   creates a current rule.
2. A delegated decision stays open until it has verifiable evidence in the
   appropriate source. Do not declare it closed because there is an owner, a
   recommendation or a prior conversation.
3. Close a pending item only with a decision or evidence, a date, an owner and
   a verifiable location. Close only the part that is proven.
4. When creating, merging, removing or making a component internal, check the
   current list, numbering, total, progress formula, remaining items, plan,
   contract and derived documents. Count only the complete list; do not add
   P0 a second time.
5. Update the canonical source first. A historical or superseded document
   receives only a supersession note to avoid contradiction; do not rewrite
   it as a current rule.
6. If a check fails, fix the method and run it again before declaring a
   result.

## Branch and pull request flow — v5

- The current integration branch is `v/5.0.0`. For each deliverable, create a
  short branch from `origin/v/5.0.0`, with the prefix defined in
  `contributing.md`.
- The yardstick is risk. If the change, when wrong, breaks something or
  changes someone else's work, it goes through a pull request. If not, it goes
  by direct push to `v/5.0.0`. When in doubt, pull request.
- **Direct push to `v/5.0.0`**, after the proof passes:

  | Change | Proof before the push |
  |---|---|
  | Task and evidence record in `docs/operacao/` | `node scripts/verificar-operacao.mjs` exits 0 |
  | Token-only: `src/tokens/source/*.tokens.json`, the generated `tokens.css` and the token and count passages of the documentation | `npm run build:tokens`, `npm run test:tokens`, `npm test`, `npm run typecheck` and `npm run test:i18n` pass |
  | Text fix that does not change a rule: error, link, count or status | `git diff --check` exits 0; `npm run test:i18n` when the text has a translation |
  | Record of an already approved technical decision | `node scripts/verificar-operacao.mjs` exits 0 |

- **Pull request from the task branch to `v/5.0.0`**: component code, CSS,
  story and test; `scripts/`, including the token generator and the verifier;
  Storybook, dependency and configuration; agent or contribution rule
  (`AGENTS.md`, `CLAUDE.md`, `contributing.md`, `GOVERNANCA.md`); component
  sheet; new technical decision. In those four files, a count, link or status
  is a text fix and goes by direct push; changing what the rule commands goes
  through a pull request.
- Direct-push changes go together in a single push. Independent,
  already-validated pull request changes go in a batch pull request, with one
  commit per item.
- A new technical decision is reviewed in the pull request that brings it. The
  merge is the approval: after it, the decision is not left "awaiting review",
  and no review is requested on an already closed pull request.
- Elvys or Mauro review and merge. Do not merge your own pull request.
- When opening the pull request, request Mauro's review on GitHub in the same
  step: `gh pr edit <number> --add-reviewer maurocsjr`. That is the default.
  Another reviewer, only when Indiane indicates one.
- This convention holds until a versioned instruction replaces it. The default
  branch setting on GitHub does not change this integration target.

## Mandatory rules

- Every component is a Web Component written with Lit and with the `nph-`
  prefix.
- Components consume only semantic tokens; never literal values, `core/*` or
  `theme/*`.
- Use **Font Awesome Pro**. **Classic** is the default family: every content,
  action, state, feedback and direction icon. **Duotone is allowed only in
  structural navigation** — menu, sidebar, navigation group, shortcut and
  location indicator. Outside navigation, Duotone is forbidden: no button,
  field, feedback, validation, alert, table or destructive action. Never mix
  Duotone and Classic in the same navigation group. Light, Thin and Sharp
  remain forbidden. The license key lives in an environment variable and
  **never** enters the repository.
- For each component, first derive the structural reference from Obra in
  Figma, configure it with Nephos tokens and obtain visual approval. Only then
  implement in the repository. The full order is in **The order of a
  component**, below, and is enforced by the verifier.
- While the licensing of Obra CE/shadcn is under validation, use it only as a
  visual and structural reference; never copy code, assets, tokens or
  components into Nephos deliverables.
- Record the date, owner, evidence source, changed decision and synchronized
  documents on completion.
- Language: code (names, technical file names, comments, messages and test
  descriptions), sheets, the documentation of this repository and Storybook in
  English; Figma and the vault in Portuguese; commit, pull request and comment
  to reviewers in Portuguese. Contract keys, command-line flags, script names,
  files cited in commands recorded in `docs/operacao/` and public names do not
  change (P64, reviewed by Mauro on 30/09/2026; amendment of 02/10/2026
  approved by Mauro in PR #49; amendment of 06/10/2026; contract keys in
  `DSA-15`). In a story, the title, name, export and anchor are also
  identifiers in English, and all visible text comes from `.storybook/i18n/`
  (Storybook naming item of the amendment of 06/10/2026, in review in PR #56).
  The proof is `npm run test:naming`, on every change that touches
  `src/`, `stories/`, `.storybook/`, `scripts/` or the documentation; a new
  exception goes into `scripts/naming-exceptions.json` or into
  `scripts/language-exceptions.json` with its class, a new word goes into
  `scripts/naming-vocabulary.json`, and all three are reviewed in the PR.

## The order of a component

**Accepted Figma documentation → local code → final sheet → review and PR.**
It holds for every agent. A **component task** is one that declares
`owner: "claude-code"` and a filled-in `piece` in
`docs/operacao/tarefas/<ID>.md`.

1. **Before any component code**, the documentation of the piece in the Figma
   `DS-IA-NEPHOS 5.0` must be **accepted by Indiane** and recorded in the
   `figma-docs-accepted` gate, with `result: "passed"` and evidence in
   `docs/operacao/evidencias/<ID>/`. While the gate has not passed, the task
   stays `blocked` — it is not `ready` or `in-progress`, and no code
   starts.
2. **The evidence proves provenance**, not the taste of whoever accepted:
   `owner` `indiane`, `external_origin` `internal-allowed` with the URL
   or the frame ID in Figma, `date`, `author` and `converted_decision` naming
   the **frame** and the **`COMPONENT_SET`**. Restricted Figma content is
   **not** copied into the evidence: what goes in is the converted decision.
3. **While the task is `ready` or `in-progress`, local code without a sheet
   is allowed.** A sheet required in the first commit becomes a form filled in
   blind; the contract of the piece comes out of practice.
4. **Before `in-review` and `done`**, the canonical sheet at
   `fichas/<piece>.md` must exist, built from `fichas/_modelo.md`.

The verifier enforces the three moments: `V30` the gate, `V31` the provenance
of the evidence, `V28` the sheet. Full contract in
[`docs/operacao/README.md`](docs/operacao/README.md), §2b and §5b.

## Prohibitions

- NEVER implement Nephos with React, Vue, Angular, Svelte or another
  framework. They are consumption environments, not the authoring technology.
- NEVER use Tailwind or another utility CSS framework.
- NEVER install shadcn/ui, Radix or another component library. Obra is a
  visual and structural reference, not a code dependency.
- NEVER write literal color, spacing, radius, elevation, typography or motion
  values in component CSS.
- NEVER invent tokens, components, variants, states, combinations, progress
  metrics or product decisions.
- NEVER declare a branch, commit, Storybook, component or publication as
  existing without verifiable evidence in the repository.
- NEVER write component code before the `figma-docs-accepted` gate
  passes, nor take the task to `in-review` or `done` without the
  canonical sheet.

## Where the agent may write

| May write | Never writes |
|---|---|
| `src/components/<name>/` — implementation, CSS, story and test of the piece (P03) | `src/tokens/generated/` — generated by `npm run build:tokens` |
| `src/tokens/source/*.tokens.json` — only with evidence of reading Figma | `.npmrc` — local credential configuration, outside Git |
| `src/styles/` and `src/shared/` — P03 pattern; create only when the piece requires it | `storybook-static/` — build artifact |
| `fichas/<name>.md` — from `fichas/_modelo.md` | `.env` and variants — a secret never enters the repository |
| `.storybook/i18n/` — the language dictionaries, one `.json` file per language (`pt-BR.json`, `en.json`, `es.json`), gathered in `index.js` | `.claude/` and `.agents/` — local tools, ignored by Git |
| `scripts/` — generator and validations, always by recorded decision | Any file outside this repository |
| `docs/` and `stories/` | `src/shared/metadata/` — generated by `node scripts/verificar-operacao.mjs --gerar-metadata` (P63); never edit by hand |

Outside this list, stop and ask for authorization. Spreading files into a new
directory without a recorded decision is the same as inventing structure.

## Versions in use — look them up, do not assume

The model knows the version from its training, not the one in this
repository. Before using an API, check the version here and, when in doubt,
read the documentation for that version.

| Dependency | Version declared in `package.json` |
|---|---|
| `lit` | ^3.3.3 |
| `@fortawesome/pro-regular-svg-icons` and `pro-solid-svg-icons` | 6.7.2 (pinned) |
| `storybook` and `@storybook/web-components-vite` | ^10.5.10 |
| `style-dictionary` | ^5.5.2 |
| `vite` | ^8.2.2 |
| `vitest` and `@vitest/browser-playwright` | ^4.1.11 |
| `playwright` | ^1.62.1 |
| `typescript` | ^5.9.3 |
| `@fontsource/noto-sans` and `@fontsource/ibm-plex-mono` | ^5.3.0 |

Validated environment: Node 24.18.0 and npm 11.16.0. The package manager is
**npm**. When this table and `package.json` diverge, `package.json` wins — and
the table is wrong and must be corrected in the same PR.

## Current technical decisions

**P01, P02, P03, P17, P19, P20 and P21 are current decisions and must be
followed. Do not change, replace or reopen them without explaining the
technical conflict, recording a change proposal and requesting human
review.**

Status: *decision adopted by Indiane on 24/08/2026 (P21 on 26/08/2026) —
reviewed and approved by Elvys on 28/08/2026*. They hold for the current work.
P62 (`nph-label`, typography and dimensions, recorded on 27/08/2026) was also
reviewed by Elvys on 28/08/2026: he approved P62.1, P62.2 and P62.3 as
recorded; for P62.4 he resolved it by deciding to migrate the generator from
`px` to `rem` — **migration implemented on 28/08/2026 and merged in PR #12**.
**P62.5**, adopted by Indiane on 28/08/2026, keeps `core/radius` in `px` and
had its documentary evidence reviewed by Copilot on 09/09/2026: do not convert
the radius. See `docs/decisoes-tecnicas.md`. A later change requires a
concrete technical conflict, a recorded proposal and a human decision.

In summary, and without replacing a reading of the note: open Shadow DOM
(P01); CSS custom properties as the public API and `::part` for internal
parts, with internal classes outside the contract (P02); component, CSS, story
and test together in `src/components/<name>/` (P03); JSON as the source format
of the tokens and CSS custom properties as the generated format (P17);
`@storybook/web-components-vite` kept (P19); Style Dictionary v5 as the
generator, with `data-nph-brand` and `data-nph-color-scheme` as the public
theme contract (P20); and the technical plan for `nph-icon`, with the
component contract and the validation base (P21). When the CI workflow is
created, it will run the build on pull requests and make a private artifact
available (P19).

The technical tokens live in `src/tokens/source/*.tokens.json`, in the layers
`core`, `theme` and `semantic`, with the generated CSS in
`src/tokens/generated/tokens.css`: **never edit the generated CSS**. The
implemented components, with stories and tests, are `nph-icon` (PR #6),
`nph-label` (PR #10), `nph-tooltip` (PR #51), `nph-spinner`, `nph-separator`
and `nph-kbd` (PR #54), and `nph-badge` and `nph-button` (PR #56); the source
is `src/components/` on `v/5.0.0`. The component
sheets are canonical at `fichas/<name>.md`, with the template at
`fichas/_modelo.md`, since PR #13. **The CI workflow and publication remain
nonexistent.** The note records, in each decision, what was left out of scope.
P17 also fixes the canonical source by responsibility: Figma is the visual
source, `design.md` is the human and agentic contract, the JSON is the
technical source of audited values and the CSS is generated from the JSON,
never edited by hand. Facing a gap, stop and record the blocker.

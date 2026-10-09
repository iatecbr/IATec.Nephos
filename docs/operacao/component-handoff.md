# Component handoff — from Figma to code

This note tells whoever writes component code what to do when Indiane sends a
component to be coded. It is internal instruction, in English only, like the
rest of `docs/operacao/` (see [`../i18n.md`](../i18n.md)). Where it and
`AGENTS.md` diverge on **who** does a step, this note wins; on **how** the
step is done, `AGENTS.md` wins.

## Who does what

| Who | Does | Does not |
|---|---|---|
| Indiane | Decides the visual of components, blocks and templates; accepts each step in Figma; sends the component to code | — |
| Claude | Builds the component and its documentation in the Figma `DS-IA-NEPHOS 5.0`; after the end-to-end approval, takes **only the component's tokens** to `v/5.0.0` | Component code, story, test or sheet |
| Elvys (and his agent) | Component code, CSS, story, test and i18n; the sheet `fichas/<piece>.md` | New tokens or token values |
| Mauro | Reviews the pull requests (`maurocsjr`) | — |

## What "sent to code" guarantees

A component reaches code only after this order is complete, all in Figma:

**visual acceptance → Figma QA approved → Figma documentation approved →
textual audit approved → tokens on `v/5.0.0`.**

So, when Indiane sends a component, there is nothing left to wait for: the
documentation is final and every token the component needs is already in
`src/tokens/source/*.tokens.json`.

## What to do when a component arrives

1. **Preflight.** Follow the mandatory preflight in `AGENTS.md`.
2. **Read the source.** Open the component's page in the Figma
   `DS-IA-NEPHOS 5.0` (file `UuhW1qPkdkdQ6IAjOsxOua`). The documentation frame
   on that page is the source for variants, states, accessibility, usage and
   tokens. Figma is in Portuguese; what goes into the repository is in English.
3. **Open the task.** Create `docs/operacao/tarefas/<ID>.md` with
   `owner: "elvys"` and `piece: "nph-<name>"`. Record the
   `figma-docs-accepted` gate as `passed`, with the evidence in
   `docs/operacao/evidencias/<ID>/`: `owner` `indiane`, `external_origin`
   `internal-allowed`, the URL of the component's Figma page, the date of
   Indiane's message and a `converted_decision` naming the frame and the
   `COMPONENT_SET`. Run `node scripts/verificar-operacao.mjs`.
4. **Tokens: only the existing ones.** Consume only semantic tokens already on
   `v/5.0.0`. If a token is missing or its value differs from Figma, **stop**
   and tell Indiane. Do not create or change a token: tokens come from Figma,
   through Claude.
5. **Code.** `src/components/nph-<name>/` — component, CSS, story and test
   (P01, P02, P03), with the visible story text in `.storybook/i18n/`.
6. **Sheet.** `fichas/nph-<name>.md`, from `fichas/_modelo.md`, filled in from
   the Figma documentation. The sheet may come before the code: the Figma
   documentation is already accepted. Living text carries no person name, no
   date and no count of icons, variants or tokens.
7. **Proof.** `npm run build:tokens`, `npm run test:tokens`, `npm test`,
   `npm run typecheck`, `npm run test:i18n`, `npm run test:naming`,
   `npm run test:operacao`, `npm run build-storybook` and `git diff --check`
   exit 0.
8. **Pull request** from a short branch off `origin/v/5.0.0` to `v/5.0.0`,
   title and description in Portuguese, with
   `gh pr edit <number> --add-reviewer maurocsjr`.

If the Figma documentation and the tokens disagree, or something the code needs
is not in Figma, stop and ask Indiane. Do not fill the gap.

## Current queue

Figma approved end to end and tokens on `v/5.0.0`. Update this list by direct
push when a component is sent or delivered.

| Piece | Next |
|---|---|
| `nph-togglebutton` | Sheet first, then code |
| `nph-toggle-group` | Sheet first, then code |
| `nph-avatar` | Sheet first, then code |
| `nph-avatar-stack` | Sheet first, then code |
| `nph-skeleton` | Sheet first, then code |
| `nph-switch` | Sheet first, then code |
| `nph-input` | Code and sheet |
| `nph-checkbox` | Code and sheet |
| `nph-radio` | Code and sheet |
| `nph-field` | Code and sheet |

## Open items for this transition

- **Default branch.** GitHub still has `v/3.0.0` as the default branch; the
  work happens on `v/5.0.0`. Change it in *Settings → Branches* or with
  `gh repo edit iatecbr/IATec.Nephos --default-branch v/5.0.0`.
- **The verifier enforces the gate only for Claude.**
  `scripts/verificar-operacao.mjs` treats a task as a component task only when
  `owner` is `claude-code` (`V28`, `V30`, `V31`). A task with `owner: "elvys"`
  passes without the `figma-docs-accepted` gate. Extend the check to `elvys`.
- **`AGENTS.md` and `CLAUDE.md` still describe Claude as the author of
  component code.** Align them with the table above.

```json
{
  "task": "DSA-60",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/eloquent-ritchie-81c3fa",
  "start_sha": "8b49b0ce78dd46db4a60a989b481c06896a11500",
  "end_sha": null
}
```

## Goal of this pass
Make the hover of the secondary ghost `nph-button`, with text and icon only, read
`button/secondary-ghost-background-hover` and `icon-button/secondary-ghost-background-hover`, with
tests, stories and the spec updated, in the contract converted to text in the evidence of the
`figma-docs-accepted` gate.

## Sources opened
- `docs/operacao/tarefas/DSA-60.md` and `docs/operacao/evidencias/DSA-60/figma-docs-accepted-2026-10-29.md`
- `AGENTS.md`, `CLAUDE.md`, `GOVERNANCA.md`, `design.md` and `docs/operacao/component-handoff.md`
- `src/components/nph-button/` and `fichas/nph-button.md`
- `src/tokens/source/semantic.tokens.json`: `button/secondary-ghost-background-hover` and
  `icon-button/secondary-ghost-background-hover`

## Changes
- `src/components/nph-button/nph-button.css`: the secondary ghost hover reads
  `--nph-button-secondary-ghost-background-hover`, and the icon-only one
  `--nph-icon-button-secondary-ghost-background-hover`.
- `src/components/nph-button/nph-button.test.ts`: the matrix pair and new tests that tell the two
  tokens apart.
- `fichas/nph-button.md`, `src/shared/metadata/nph-button.json` (generated) and the `buttonDocs`
  states in `.storybook/i18n/`.

## Commands run
- `git merge --ff-only origin/v/5.0.0`
- Wait for the Copilot review of the pull request.
- `npm run build:tokens`, `test:tokens`, `test`, `typecheck`, `test:i18n`, `test:naming`,
  `test:spelling`, `test:operacao`, `build-storybook`, `build:lib`, `test:package` and
  `git diff --check` on the head of the pull request

## Result
In review in pull request #143, from the branch `feat/dsa-60-button-ghost-hover`.

## Evidence
The proof table is in the description of the pull request. `review-and-merge` waits for the
merge.

## Blocker
None. Outside this task: the `use` and `nao_use` of `color/muted` in `design.md` still cite
the ghost secondary hover; recorded in the pull request for Indiane.

## Next command
Wait for the Copilot review of the pull request.

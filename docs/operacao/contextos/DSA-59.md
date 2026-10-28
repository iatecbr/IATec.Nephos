```json
{
  "task": "DSA-59",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/unruffled-newton-6358b3",
  "start_sha": "21c81b01563c287e7a0d4b1152f73b0c6d4332bc",
  "end_sha": null
}
```

## Goal of this pass
Add the size `compact` to `nph-input`, the 28 px field, with tests, stories and the spec updated, in the
contract converted to text in the evidence of the `figma-docs-accepted` gate.

## Sources opened
- `docs/operacao/tarefas/DSA-59.md` and `docs/operacao/evidencias/DSA-59/documentacao-figma-aceita-2026-10-28.md`
- `AGENTS.md`, `CLAUDE.md`, `GOVERNANCA.md`, `design.md` and `docs/stories.md`
- `src/components/nph-input/` and `fichas/nph-input.md`
- P80 in `docs/decisoes-tecnicas.md`
- `src/tokens/source/semantic.tokens.json`: `input/height-compact` and `input/clear-padding-end`

## Changes
- `nph-input`: `size` takes `compact`, with `input/height-compact` and `input/clear-padding-end`.
- Tests, Validation and Docs stories, the three dictionaries, the sheet and its Metadata.
- P80, amendment of 28/10/2026.

## Commands run
- `git merge --ff-only origin/v/5.0.0`
- `npm ci`, `npm run build:tokens`, `npm run test:tokens` and `npm test` on the base: green
- `npm run build:tokens`, `test:tokens`, `test`, `typecheck`, `test:i18n`, `test:naming`,
  `test:spelling`, `test:operacao`, `build-storybook`, `build:lib`, `test:package` and
  `git diff --check` on the head of the pull request

## Result
In review in pull request #139, from the branch `claude/strange-goldberg-ae2bb1`.

## Evidence
The proof table is in the description of the pull request. `review-and-merge` waits for the
merge.

## Blocker
None.

## Next command
Wait for the Copilot review of the pull request.

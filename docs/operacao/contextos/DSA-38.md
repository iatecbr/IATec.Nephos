```json
{
  "task": "DSA-38",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/dsa-38-nph-textarea-4ada6c",
  "start_sha": "8ae0a5f68e29d8bcefd15a36f4064a81bc6caa1f",
  "end_sha": null
}
```

## Goal of this pass
Implement `nph-textarea` (component, CSS, stories, Docs page, tests, sheet, P93 and
Metadata) from the contract in the `figma-docs-accepted` evidence, with the form shape
of `nph-input` (P80) and the field–control contract of `nph-field` (P83).

## Sources opened
- `docs/operacao/tarefas/DSA-38.md` and its evidence
- `docs/operacao/component-handoff.md`, `docs/stories.md`, `fichas/_modelo.md`
- `design.md` — `layout/textarea-min-height`, `layout/textarea-max-height`,
  `layout/input-width`, `space/control-padding`, `space/inline`, `space/stack`,
  `text/body-md`, `text/caption`, the field colors and the focus tokens
- `src/components/nph-input/`, `src/components/nph-field/` and
  `src/components/nph-button/`
- `docs/decisoes-tecnicas.md` — P01, P02, P80, P83

## Changes
`nph-textarea` (component, CSS, tests with the real `nph-field` and `nph-button`), seven
Validation stories, the Docs page, the dictionaries in the three languages, the sheet and
its Metadata, and P93. The branch was synced with `v/5.0.0` once; the conflict was only in
the lists of `docs/decisoes-tecnicas.md`, resolved keeping P79 and P86 of the other tasks.
See the commits on the branch.

## Commands run
- `npm ci`; `npm run build:tokens`, `test:tokens`, `test`, `typecheck`, `test:i18n`,
  `test:operacao`, `test:naming`, `build-storybook`, `build:lib`, `test:package` and
  `git diff --check` on the head of the pull request.

## Result
In review in PR #111. Checked in Storybook: the three examples, the growth from 76 to
216 px with the scroll inside, and the footer in every state.

## Evidence
The proof table is in the description of PR #111. `review-and-merge` waits for the merge.

## Blocker
None. D-1 to D-5 wait for Indiane and do not block.

## Next command
Wait for the review of PR #111.

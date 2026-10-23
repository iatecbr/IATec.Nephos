```json
{
  "task": "DSA-28",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/dsa-28-nph-field-66625a",
  "start_sha": "d00c6ca550e6a0749490a6a67ea39941ee1fa470",
  "end_sha": null
}
```

## Goal of this pass
Implement `nph-field` (component, CSS, stories, Docs page, tests, sheet, P83 and
Metadata) from the contract in the `figma-docs-accepted` evidence, with the field–control
contract that the form controls of DSA-16, DSA-17, DSA-18, DSA-27 and DSA-41 implement.

## Sources opened
- `docs/operacao/tarefas/DSA-28.md` and its evidence
- `docs/operacao/component-handoff.md`, `docs/stories.md`, `fichas/_modelo.md`
- `design.md` — `layout/field-width`, `space/stack-tight`, `space/inline-tight`,
  `text/caption`, `text/body-md`, `color/muted-foreground`, `status/error`,
  `state/disabled-opacity`
- `src/components/nph-label/`, `src/components/nph-tooltip/`,
  `src/components/nph-toggle-group/` and `src/components/nph-togglebutton/`
- `docs/decisoes-tecnicas.md` — P01, P02, P21, P62, P72, P76, P77

## Changes
`nph-field` (component, CSS, tests with test stubs and with the real `nph-input`), seven
Validation stories, the Docs page, the dictionaries in the three languages, the sheet and
its Metadata, and P83 with the field–control contract. The branch was synced with
`v/5.0.0` four times; the conflicts were only in `docs/decisoes-tecnicas.md` and in the
dictionaries, resolved keeping the entries of the other tasks. See the commits on the branch.

## Commands run
- `npm ci`; `npm run build:tokens`, `test:tokens`, `test`, `typecheck`, `test:i18n`,
  `test:operacao`, `test:naming`, `build-storybook`, `build:lib`, `test:package` and
  `git diff --check` on the head of the pull request.

## Result
In review in PR #105. The single field uses the real `nph-input`; the options of a group
are demonstration elements that take the contract of P83.

## Evidence
The proof table is in the description of PR #105. `review-and-merge` waits for the merge.

## Blocker
None. D-1 to D-5 wait for Indiane and do not block.

## Follow-up
When `nph-checkbox` (DSA-17) and `nph-radio` (DSA-18) are merged, swap `demo-field-checkbox`
and `demo-field-radio` in `nph-field.demo.ts` for the real pieces and remove the note about
demonstration options from the Docs page and its dictionary entries.

## Next command
Wait for the review of PR #105.

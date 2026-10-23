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
The task moves to in progress with the pending decisions D-1 to D-4. The component, its
CSS, tests, stories and sheet follow in the next commits. See the commits on the branch.

## Commands run
- `npm ci`, then `npm run test:operacao` before the first commit.

## Result
In progress. Nothing delivered yet beyond the task state.

## Evidence
None recorded: `review-and-merge` waits for the PR.

## Blocker
None. D-1 to D-4 wait for Indiane and do not block.

## Next command
Commit the component, then the stories, the Docs page and the sheet.

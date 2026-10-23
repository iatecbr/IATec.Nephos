```json
{
  "task": "DSA-29",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/dsa-25-nph-avatar-stack-8e424e",
  "start_sha": "d2eaffb",
  "end_sha": null
}
```

## Goal of this pass
Implement `nph-select` and its option, `nph-option` (components, CSS, tests,
stories, Docs page, sheets, P91 and Metadata), from the contract in the
`figma-docs-accepted` evidence, with the form pattern of P80 and the field
contract of P83.

## Sources opened
- `docs/operacao/tarefas/DSA-29.md` and its evidence
- `docs/operacao/component-handoff.md`, `docs/stories.md`, `fichas/_modelo.md`
- `design.md` — the tokens named in the evidence
- `src/components/nph-input/` (P80), `src/components/nph-field/` (P83),
  `src/components/nph-tooltip/` (the top layer, P77), `src/components/nph-avatar/`
  and `src/components/nph-icon/`
- `docs/decisoes-tecnicas.md` — P01, P02, P03, P21, P77, P80, P83
- `vite.config.lib.ts`, `scripts/test-package.mjs` — one definition per folder,
  so the option has a folder of its own

## Changes
The task moves to in progress with the pending decisions D-1 to D-3. See the
commits on the branch.

## Commands run
- `npm ci`, then `npm run test:operacao` before the first commit.
- A throwaway spike in Chromium: the message of a disconnected
  `<select required>`, `ariaActiveDescendantElement` from the shadow root to a
  slotted option, slotted options in the top layer and `composedPath()` through
  the popover. All four held; the spike was not committed.

## Result
In progress.

## Evidence
None recorded: `review-and-merge` waits for the PR.

## Blocker
None. D-1 to D-3 wait for Indiane and do not block.

## Next command
Commit the components, then the stories, the Docs page and the sheets.

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
`nph-select` and `nph-option` (components, CSS, tests), nine Validation stories, the Docs
page, the dictionaries in the three languages, the two sheets and their Metadata, and P91.
The branch was synced with `v/5.0.0` twice; the conflicts were only in
`docs/decisoes-tecnicas.md` and in the dictionaries, resolved keeping the entries of the
other tasks. See the commits on the branch.

## Commands run
- `npm ci`; `npm run build:tokens`, `test:tokens`, `test`, `typecheck`, `test:i18n`,
  `test:operacao`, `test:naming`, `build-storybook`, `build:lib`, `test:package` and
  `git diff --check` on the head of the pull request.
- A throwaway spike in Chromium: the message of a disconnected `<select required>`,
  `ariaActiveDescendantElement` from the shadow root to a slotted option, slotted options
  in the top layer and `composedPath()` through the popover. All four held; the spike was
  not committed.

## Result
In review in PR #114.

## Evidence
The proof table is in the description of PR #114. `review-and-merge` waits for the merge.

## Blocker
None. D-1 to D-3 wait for Indiane and do not block.

## Next command
Wait for the review of PR #114.

```json
{
  "task": "DSA-45",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/dsa-45-nph-dropdown-menu-6256e3",
  "start_sha": "906f1cf",
  "end_sha": null
}
```

## Goal of this pass
Implement `nph-dropdown-menu` (component, CSS, tests, stories, Docs page, sheet,
P92 and Metadata) and the `right-from-bracket` icon of `nph-icon`, from the
contract in the `figma-docs-accepted` evidence.

## Sources opened
- `docs/operacao/tarefas/DSA-45.md` and its evidence
- `docs/operacao/component-handoff.md`, `docs/stories.md`, `fichas/_modelo.md`
- `design.md` — the tokens named in the evidence
- `src/components/nph-tooltip/` (the top layer, P77), `src/components/nph-select/`
  (the list, P91), `src/components/nph-checkbox/` (P81),
  `src/components/nph-switch/` (P79), `src/components/nph-badge/`,
  `src/components/nph-avatar/` and `src/components/nph-icon/`
- `docs/decisoes-tecnicas.md` — P01, P02, P03, P21, P77, P79, P81, P91
- `vite.config.lib.ts`, `scripts/test-package.mjs` — one definition per folder,
  so the items are data of the menu and not tags of their own

## Changes
- `nph-icon`: `right-from-bracket`, light and solid, in the glyph map, the list
  of names, the catalog demo and the action icon list of `design.md`.
- `nph-dropdown-menu`: component, CSS, tests, the shared demo frame, seven
  Validation stories, the Docs page, the dictionary in the three languages, the
  sheet, the Metadata and P92.
- D-2 now states what the code does: the motion of the `nph-select` list.
- Defects found and fixed before the PR, each with a regression test: a trigger
  rendered right after the menu was not found (the guard compared `null` with
  `null`); an empty group swallowed the separator of the next group; a click on
  the trigger to close reopened the menu (the `focusout` now ignores a move to
  the trigger).

## Commands run
- `npm ci`, then `npm run test:operacao` before the first commit.
- The full proof sequence, one at a time, on `680d6bc`: build:tokens,
  test:tokens, test (3148/3148), typecheck, test:i18n, test:operacao,
  build-storybook, build:lib, test:package (1191 checks, 26 components) and
  `git diff --check` exit 0; test:naming exits 1 with the known findings of the
  base only.
- A look at the static Storybook, light and dark: the examples, the item options
  with the solid hover and the Docs matrix.

## Result
In review: PR #118, reviewed by Copilot; Elvys merges.

## Evidence
None recorded: `review-and-merge` waits for the PR.

## Blocker
None. D-1 to D-6 wait for Indiane and do not block.

## Next command
Answer the Copilot review of PR #118 and run the proofs again after each commit.

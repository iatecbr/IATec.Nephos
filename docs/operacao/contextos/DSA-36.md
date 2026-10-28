```json
{
  "task": "DSA-36",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/dsa-36-brand-validation-337397",
  "start_sha": "7ccd1031b89a28b35417e7d5daf0976fee77c9cc",
  "end_sha": null
}
```

## Goal of this pass
Add a test that finds the brand-dependent tokens from `src/tokens/generated/tokens.css` and fails a component
that consumes one, directly or through another token, without a brand `Validation` story; and give each
component the test requires a `Validation` story with the seven brands of P20 in light and dark, each frame
carrying `data-nph-brand` and `data-nph-color-scheme` on the same element (D1).

## Sources opened
- `docs/operacao/tarefas/DSA-36.md` (D1) and `DSA-30.md` (D4)
- `AGENTS.md`, `CLAUDE.md`, `GOVERNANCA.md`, `design.md` and `docs/stories.md` §4.6 and §6.4
- `docs/decisoes-tecnicas.md` P20 and P67
- `src/tokens/generated/tokens.css`, `src/shared/tokens/tokens-cascade.test.ts` and `.storybook/preview.js`
- The `Validation` stories of the components in `src/components/`

## Changes
None yet.

## Commands run
- `git merge --ff-only origin/v/5.0.0`
- `npm ci`

## Result
The task is in progress on the branch `claude/dsa-36-brand-validation-337397`.

## Evidence
None yet. `review-and-merge` waits for the pull request.

## Blocker
None.

## Next command
`npm test`

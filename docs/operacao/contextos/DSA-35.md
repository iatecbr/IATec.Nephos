```json
{
  "task": "DSA-35",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/amazing-euclid-045eac",
  "start_sha": "a2f01724635181de592823419d7dd9d4819c2cb1",
  "end_sha": null
}
```

## Goal of this pass
Prove in a real browser that `import '@iatec/nephos/nph-<name>';` registers each component with its CSS,
`nph-label` included, through the `exports` field and the `dist/` that `npm run build:lib` writes, and add
the Usage section, with the markup and the import line, right after API on every `Docs` page (P70), with a
test that fails a page without it.

## Sources opened
- `docs/operacao/tarefas/DSA-35.md` and `DSA-30.md` (D2, the markup of the frames)
- `AGENTS.md`, `CLAUDE.md`, `GOVERNANCA.md`, `design.md` and `docs/stories.md` §4.10
- `docs/decisoes-tecnicas.md` P69, P70 and P75
- `package.json`, `vite.config.lib.ts`, `scripts/build-lib.mjs` and `scripts/test-package.mjs`
- `src/shared/docs/page.ts`, `sheet-lists.ts` and the `*.docs.stories.ts` pages

## Changes
None yet.

## Commands run
- `git merge --ff-only origin/v/5.0.0`
- `npm ci`

## Result
The task is in progress on the branch `claude/amazing-euclid-045eac`.

## Evidence
None yet. `review-and-merge` waits for the pull request.

## Blocker
None.

## Next command
`npm run build:lib`

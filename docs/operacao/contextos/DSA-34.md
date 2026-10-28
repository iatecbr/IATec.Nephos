```json
{
  "task": "DSA-34",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/dsa-34-docs-metadata-96729a",
  "start_sha": "78cdc6d05fc13256e861c20a75dff50c60f99cce",
  "end_sha": null
}
```

## Goal of this pass
Make every `Docs` page read `use_when` and `do_not_use_when` from `src/shared/metadata/<piece>.json`, with the
`pt-BR` and `es` translation of each item from `.storybook/i18n/` (D1), write the approved lists of
`nph-badge`, `nph-button`, `nph-icon` and `nph-label` into their sheets and generate the Metadata again (D2),
and add a test that fails a page whose lists differ from the Metadata.

## Sources opened
- `docs/operacao/tarefas/DSA-34.md` and `DSA-30.md`
- `AGENTS.md`, `CLAUDE.md`, `GOVERNANCA.md`, `design.md` and `docs/stories.md` §4.8 and §4.10
- `docs/decisoes-tecnicas.md` P63 and P71
- `src/shared/docs/page.ts` and `page.test.ts`
- `src/components/*/*.docs.stories.ts` and `*.docs.test.ts`
- `fichas/nph-badge.md`, `fichas/nph-button.md`, `fichas/nph-icon.md` and `fichas/nph-label.md`
- `.storybook/i18n/*.json`

## Changes
- The sheets of `nph-badge`, `nph-button`, `nph-icon` and `nph-label` take the approved lists (D2); `nph-button` with
  the later frame text of P86 and DSA-52 (Q1, D-1); the Metadata is generated again.
- `src/shared/docs/sheet-lists.ts`: the `useDontUse` block of every `Docs` page reads the Metadata, with the `pt-BR`
  and `es` translation of each item from the dictionary (D1).
- `src/shared/docs/sheet-lists.test.ts`: fails a page whose lists differ from the Metadata, an item without a
  translation and a list whose number of items differs.
- P71 annotation, `docs/stories.md` §4.8 and §4.10, `docs/i18n.md` and the rules in `.storybook/i18n/index.js`.

## Commands run
- `git merge --ff-only origin/v/5.0.0`
- `npm ci`
- `node scripts/verificar-operacao.mjs --gerar-metadata`
- `npx vitest run --project unit src/shared/docs/sheet-lists.test.ts`, with three induced violations that fail it

## Result
The task is in progress on the branch `claude/dsa-34-docs-metadata-96729a`.

## Evidence
None yet. `review-and-merge` waits for the pull request.

## Blocker
None.

## Next command
`npm run build:tokens`, then the other proof commands in sequence

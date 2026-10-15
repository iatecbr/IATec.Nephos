```json
{
  "id": "DSA-34",
  "goal": "Make each Docs page read use_when and do_not_use_when from the Metadata of its sheet, with a test that fails a page whose lists differ, after bringing the sheets level with the accepted frames (P71).",
  "phase": "F4",
  "approved_order": 360,
  "owner": "elvys",
  "state": "awaiting-decision",
  "piece": null,
  "dependencies": [
    "DSA-30"
  ],
  "gates": [
    {
      "id": "review-and-merge",
      "description": "The sheets, the generated Metadata, the Docs pages, the equality test and the dictionaries pass the proof commands and are merged into v/5.0.0.",
      "command": null,
      "evidence": null,
      "result": "pending",
      "verified_at": null,
      "verified_by": null
    }
  ],
  "blockers": [
    {
      "id": "B1",
      "what_blocks": "PR #84 (audit/storybook-impeccable) changes src/shared/docs/page.ts, .storybook/ and the dictionaries; starting before its merge means conflicts.",
      "owner": "elvys",
      "what_resolves": "PR #84 merged into v/5.0.0.",
      "opened_at": "2026-10-15"
    }
  ],
  "pending_decisions": [
    {
      "id": "D1",
      "question": "The Metadata is in English only (DSA-14), and docs/stories.md, §4.8, asks for every visible text in the three languages. How do the pt-BR and es Docs pages show the use and do-not-use lists?",
      "decider": "indiane",
      "opened_at": "2026-10-15"
    },
    {
      "id": "D2",
      "question": "Bringing a sheet level with the accepted frame keeps every item Indiane accepted. When an item of the sheet and an item of the frame say the same thing in other words, may they become one item, and who approves the merged list?",
      "decider": "indiane",
      "opened_at": "2026-10-15"
    }
  ],
  "evidence": [],
  "decision_refs": [
    "docs/decisoes-tecnicas.md#p71",
    "docs/decisoes-tecnicas.md#p63",
    "docs/operacao/tarefas/DSA-30.md, D1, answered by Indiane on 2026-10-15"
  ],
  "external_origin": null,
  "git_review": {
    "branch": null,
    "commit": null,
    "pr": null
  },
  "context": null,
  "updated_at": "2026-10-15"
}
```

# DSA-34 — Docs lists read from the Metadata

## Goal
Every `Docs` page shows the `use_when` and `do_not_use_when` of `src/shared/metadata/<piece>.json`, and a test fails the page that differs.

## How it is proved
**`review-and-merge`** passes when the sheets of `nph-badge`, `nph-button`, `nph-icon` and `nph-label` hold every item of their accepted frames; `node scripts/verificar-operacao.mjs --gerar-metadata` ran in the same commit and `V32` passes; the `useDontUse` block of each `Docs` page reads the Metadata; a test fails a page whose lists differ from the Metadata; `npm test`, `npm run typecheck`, `npm run test:i18n`, `npm run test:naming`, `npm run test:operacao`, `npm run build-storybook` and `git diff --check` exit 0; and the pull request is merged into `v/5.0.0`.

## What this task does not do
It does not create the Metadata tab in Storybook (P63). It does not edit `src/shared/metadata/` by hand. It does not remove an item that Indiane accepted.

## Sources
- `docs/decisoes-tecnicas.md` P63, P71
- `fichas/nph-badge.md`, `fichas/nph-button.md`, `fichas/nph-icon.md`, `fichas/nph-label.md`
- `src/shared/metadata/`
- `src/shared/docs/page.ts`, `useDontUse`
- `src/components/*/*.docs.stories.ts` and `*.docs.test.ts`
- `.storybook/i18n/*.json`
- `docs/stories.md` §4.8, §4.10

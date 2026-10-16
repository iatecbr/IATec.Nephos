```json
{
  "id": "DSA-34",
  "goal": "Make each Docs page read use_when and do_not_use_when from the Metadata of its sheet, with a test that fails a page whose lists differ, after bringing the sheets level with the accepted frames (P71).",
  "phase": "F4",
  "approved_order": 360,
  "owner": "elvys",
  "state": "blocked",
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
    },
    {
      "id": "B2",
      "what_blocks": "The merged use and do-not-use lists of nph-badge, nph-button, nph-icon and nph-label are not approved yet (D2).",
      "owner": "claude-figma",
      "what_resolves": "Indiane approves the merged list of each component, and its English text is added to this task.",
      "opened_at": "2026-10-16"
    }
  ],
  "pending_decisions": [],
  "evidence": [],
  "decision_refs": [
    "docs/decisoes-tecnicas.md#p71",
    "docs/decisoes-tecnicas.md#p63",
    "docs/operacao/tarefas/DSA-30.md, D1, answered by Indiane on 2026-10-15",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-16.md, Indiane answered D1 and D2 of DSA-34"
  ],
  "external_origin": null,
  "git_review": {
    "branch": null,
    "commit": null,
    "pr": null
  },
  "context": null,
  "updated_at": "2026-10-16"
}
```

# DSA-34 — Docs lists read from the Metadata

## Goal
Every `Docs` page shows the `use_when` and `do_not_use_when` of `src/shared/metadata/<piece>.json`, and a test fails the page that differs.

## Decisions answered
Indiane answered D1 and D2. The task waits for B1 and B2.

| ID | Answer | What the code does |
|---|---|---|
| D1 | The English lists come from the Metadata. The `pt-BR` and `es` pages take the translation of each item from `.storybook/i18n/pt-BR.json` and `es.json`. | Keys each translation to its Metadata item. A test fails when an item has no translation in `pt-BR` or `es`, or when the number of items differs from the Metadata. The sheet and the Metadata stay English only (DSA-14). |
| D2 | Two items that say the same thing may become one. Claude proposes the merged list of each component, Indiane approves it, and the approved list comes into this task in English (B2). | Writes the approved lists into the sheets and generates the Metadata again. It does not merge, reword or drop an item on its own. |

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

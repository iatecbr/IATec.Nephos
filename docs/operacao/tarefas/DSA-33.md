```json
{
  "id": "DSA-33",
  "goal": "Set text/body-lg in the text and list blocks of the Docs pages, and add Anatomy to the nph-button page and Anatomy and Examples to the nph-icon page from their accepted frames (DSA-30, D6 and D7).",
  "phase": "F4",
  "approved_order": 350,
  "owner": "elvys",
  "state": "ready",
  "piece": null,
  "dependencies": [
    "DSA-30"
  ],
  "gates": [
    {
      "id": "review-and-merge",
      "description": "page.ts, the nph-button and nph-icon Docs pages, their tests and the dictionaries pass the proof commands and are merged into v/5.0.0.",
      "command": null,
      "evidence": null,
      "result": "pending",
      "verified_at": null,
      "verified_by": null
    }
  ],
  "blockers": [],
  "pending_decisions": [],
  "evidence": [],
  "decision_refs": [
    "docs/stories.md, §4.10",
    "docs/operacao/tarefas/DSA-30.md, D6 and D7, answered by Indiane on 2026-10-15",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-16.md, Indiane answered D1 to D3 of DSA-33"
  ],
  "external_origin": null,
  "git_review": {
    "branch": null,
    "commit": null,
    "pr": null
  },
  "context": null,
  "updated_at": "2026-10-20"
}
```

# DSA-33 — Docs pages: body-lg and the model sections

## Goal
The `text` and `list` blocks of `src/shared/docs/page.ts` use `text/body-lg`, the `nph-button` `Docs` page has Anatomy, and the `nph-icon` `Docs` page has Anatomy and Examples, in the position of the model. The existing Examples of `nph-button` are checked against the frame `1197:5449`: its icon-only example uses `plus`, and the page uses `xmark`.

## Decisions answered
Indiane answered D1 to D3. B1 is closed: PR #84 is merged.

| ID | Answer | What the code does |
|---|---|---|
| D1 | The `header` summary stays `text/body-md`; only `text` and `list` take `text/body-lg`. The Figma model `1134:12862` and the frame `1197:5449` use `text/body-md` for the summary. | Changes the role of `text` and `list` only. |
| D2 | The `nph-icon` page goes out without the `magnifying-glass` example inside `nph-input`, and the page carries no note about it (§4.10: no process text on the page). DSA-16 adds the example when `nph-input` has code. | Adds the other two examples of the frame `1130:956`. |
| D3 | The Docs pages keep the order of `docs/stories.md`, §4.10, the order of `nph-badge`, `nph-label` and `nph-skeleton`. The frames keep their own order. | Places Anatomy after the sections of the component itself and Examples after Accessibility. Corrects the §4.10 sentence that says the page follows "the order and the sections" of the Figma frame: the page follows its sections, in the §4.10 order. |

## How it is proved
**`review-and-merge`** passes when `page.test.ts` proves the text role of `text` and `list`; the `Docs` tests of `nph-button` and `nph-icon` prove the Anatomy and Examples sections in the model order; the visible text is in the three dictionaries; `npm test`, `npm run typecheck`, `npm run test:i18n`, `npm run test:naming`, `npm run test:operacao`, `npm run build-storybook` and `git diff --check` exit 0; and the pull request is merged into `v/5.0.0`.

## What this task does not do
It does not change a token or a sheet. It does not add the Usage section (DSA-35) nor move the lists to the Metadata (DSA-34).

## Sources
- `docs/operacao/tarefas/DSA-30.md`, D6 and D7, with the converted Anatomy and Examples
- `design.md` §2b
- `docs/stories.md` §4.10
- `src/shared/docs/page.ts`, `page.test.ts`
- `src/components/nph-button/` and `src/components/nph-icon/` Docs stories and tests
- `.storybook/i18n/*.json`
- `docs/operacao/evidencias/DSA-03/`, `docs/operacao/evidencias/DSA-13/`

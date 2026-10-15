```json
{
  "id": "DSA-33",
  "goal": "Set text/body-lg in the text and list blocks of the Docs pages, and add Anatomy and Examples to the nph-button and nph-icon pages from their accepted frames (DSA-30, D6 and D7).",
  "phase": "F4",
  "approved_order": 350,
  "owner": "elvys",
  "state": "awaiting-decision",
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
      "question": "Does text/body-lg also apply to the header summary of the Docs page (docs/stories.md, §4.10, keeps text/body-md), or only to the text and list blocks?",
      "decider": "indiane",
      "opened_at": "2026-10-15"
    },
    {
      "id": "D2",
      "question": "The first nph-icon example of the frame 1130:956 shows magnifying-glass inside an nph-input, which has no code yet (DSA-16). Wait for nph-input, show the icon in another control, or leave this example out with a note?",
      "decider": "indiane",
      "opened_at": "2026-10-15"
    },
    {
      "id": "D3",
      "question": "In the accepted frames Anatomy is section 3 and Examples section 9, while docs/stories.md, §4.10, puts Anatomy after the sections of the component itself. Which order do the Docs pages follow?",
      "decider": "indiane",
      "opened_at": "2026-10-15"
    }
  ],
  "evidence": [],
  "decision_refs": [
    "docs/stories.md, §4.10",
    "docs/operacao/tarefas/DSA-30.md, D6 and D7, answered by Indiane on 2026-10-15"
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

# DSA-33 — Docs pages: body-lg and the model sections

## Goal
The `text` and `list` blocks of `src/shared/docs/page.ts` use `text/body-lg`, and the `nph-button` and `nph-icon` `Docs` pages have Anatomy and Examples in the position of the model.

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

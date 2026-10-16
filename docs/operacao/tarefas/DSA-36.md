```json
{
  "id": "DSA-36",
  "goal": "Give each component where the brand matters a Validation story with the seven brands in light and dark, with no brand global in the toolbar (DSA-30, D4).",
  "phase": "F4",
  "approved_order": 380,
  "owner": "elvys",
  "state": "blocked",
  "piece": null,
  "dependencies": [
    "DSA-30"
  ],
  "gates": [
    {
      "id": "review-and-merge",
      "description": "The brand Validation stories and their tests pass the proof commands and are merged into v/5.0.0.",
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
  "pending_decisions": [],
  "evidence": [],
  "decision_refs": [
    "docs/decisoes-tecnicas.md#p20",
    "docs/decisoes-tecnicas.md#p67",
    "docs/operacao/tarefas/DSA-30.md, D4, answered by Indiane on 2026-10-15",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-16.md, Indiane answered D1 of DSA-36"
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

# DSA-36 — Brand Validation stories

## Goal
Each component on the list has a `Validation` story with the seven brands of P20, in light and dark, each frame carrying `data-nph-brand` and `data-nph-color-scheme` on the same element.

## Decisions answered
Indiane answered D1. The task waits for B1.

| ID | Answer | What the code does |
|---|---|---|
| D1 | The brand matters for every component whose code consumes a token that resolves differently across the seven brands, directly or through another token. Today that is `nph-button` (primary color and focus), `nph-badge` (primary color) and `nph-label` (focus only). `nph-icon`, `nph-kbd`, `nph-separator`, `nph-skeleton`, `nph-spinner` and `nph-tooltip` look the same in the seven brands and stay out. A test fails when a component consumes such a token and has no brand `Validation` story. | Adds the brand `Validation` story to `nph-button`, `nph-badge` and `nph-label`. Adds the test, which finds the brand-dependent tokens from `src/tokens/generated/tokens.css`, so a new component joins the list when its code consumes one. |

## How it is proved
**`review-and-merge`** passes when each component on the list decided in D1 has the brand `Validation` story; a test fails a component that consumes a brand-dependent token and has no such story; the visible text comes from the three dictionaries; `npm test`, `npm run typecheck`, `npm run test:i18n`, `npm run test:naming`, `npm run test:operacao`, `npm run build-storybook` and `git diff --check` exit 0; and the pull request is merged into `v/5.0.0`.

## What this task does not do
It does not add a brand global to the toolbar or change the frame of `manager.js` (§6.4). It does not fix a contrast limit: that is a token, and tokens come from Figma.

## Sources
- `docs/decisoes-tecnicas.md` P20, P67
- `docs/stories.md` §4.6, §6.4
- `fichas/nph-button.md`, known limits
- `.storybook/preview.js`
- `src/shared/tokens/tokens-cascade.test.ts`

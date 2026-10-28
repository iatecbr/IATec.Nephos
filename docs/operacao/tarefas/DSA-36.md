```json
{
  "id": "DSA-36",
  "goal": "Give each component where the brand matters a Validation story with the seven brands in light and dark, with no brand global in the toolbar (DSA-30, D4).",
  "phase": "F4",
  "approved_order": 380,
  "owner": "elvys",
  "state": "in-progress",
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
  "blockers": [],
  "pending_decisions": [
    {
      "id": "D2",
      "question": "In the dark scheme, `color/primary-hover` resolves to `theme/brand-400-hover`, which is a darker shade in `gerencial`, `educacao`, `igrejas` and `rh`. Painted as text, it fails 4.5:1: the active item and the open group of `nph-sidebar-item` on `sidebar/panel-background` (`gerencial` 1.47, `educacao` 1.00, `igrejas` 1.86, `rh` 1.56) and the checked item of `nph-dropdown-menu` on the popover (`gerencial` 1.01, `educacao` 1.46, `igrejas` 1.38, `rh` 1.10); `sistemas`, `comercial` and `financeiro` pass above 5:1. Which token changes in Figma? Meanwhile the `Brands` stories of the two pieces carry a `color-contrast` exception, decided by Elvys on 2026-10-28, which leaves when the token is fixed.",
      "decider": "indiane",
      "opened_at": "2026-10-28"
    }
  ],
  "evidence": [],
  "decision_refs": [
    "docs/decisoes-tecnicas.md#p20",
    "docs/decisoes-tecnicas.md#p67",
    "docs/operacao/tarefas/DSA-30.md, D4, answered by Indiane on 2026-10-15",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-16.md, Indiane answered D1 of DSA-36"
  ],
  "external_origin": null,
  "git_review": {
    "branch": "claude/dsa-36-brand-validation-337397",
    "commit": null,
    "pr": null
  },
  "context": "docs/operacao/contextos/DSA-36.md",
  "updated_at": "2026-10-28"
}
```

# DSA-36 — Brand Validation stories

## Goal
Each component on the list has a `Validation` story with the seven brands of P20, in light and dark, each frame carrying `data-nph-brand` and `data-nph-color-scheme` on the same element.

## Decisions answered
Indiane answered D1. B1 is closed: PR #84 is merged.

| ID | Answer | What the code does |
|---|---|---|
| D1 | The brand matters for every component whose code consumes a token that resolves differently across the seven brands, directly or through another token. Today that is `nph-button` (primary color and focus), `nph-badge` (primary color) and `nph-label` (focus only). `nph-icon`, `nph-kbd`, `nph-separator`, `nph-skeleton`, `nph-spinner` and `nph-tooltip` look the same in the seven brands and stay out. A test fails when a component consumes such a token and has no brand `Validation` story. | Adds the brand `Validation` story to `nph-button`, `nph-badge` and `nph-label`. Adds the test, which finds the brand-dependent tokens from `src/tokens/generated/tokens.css`, so a new component joins the list when its code consumes one. |

## Pending decisions
D1 holds. The pieces on the list come out of the test; the pull request records them.

| ID | What the evidence gives | What is missing | What the code does meanwhile |
|---|---|---|---|
| D2 | In the dark scheme, `color/primary-hover` as text fails 4.5:1 in `gerencial`, `educacao`, `igrejas` and `rh`: `nph-sidebar-item` active and open labels (1.00 to 1.86) and the checked item of `nph-dropdown-menu` (1.01 to 1.46). | Which token changes in Figma. | The two `Brands` stories carry a `color-contrast` exception, decided by Elvys on 2026-10-28; it leaves when the token is fixed. |

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

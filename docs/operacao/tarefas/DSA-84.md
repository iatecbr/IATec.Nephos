```json
{
  "id": "DSA-84",
  "goal": "Fix at the source the dark contrast that DSA-81 did not cover (status/error-text, status/error, color/primary-border and theme/brand-text-dark on color/dialog), and give nph-scheduler its own tokens for the five measures the code derives from other tokens, by rule T9, first in Figma and then in the tokens.",
  "phase": "F4",
  "approved_order": 830,
  "owner": "claude-code",
  "state": "done",
  "piece": null,
  "dependencies": [
    "DSA-73",
    "DSA-77",
    "DSA-81"
  ],
  "gates": [
    {
      "id": "figma-preview-accepted",
      "description": "The previews F1 and F3 showed, in light and dark, the current and the candidate values with the contrast of each pair, and the design owner chose option 1 in both.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-84/figma-preview-accepted-2026-11-16.md",
      "result": "passed",
      "verified_at": "2026-11-16",
      "verified_by": "indiane"
    },
    {
      "id": "tokens-on-branch",
      "description": "The new dark aliases and the new tokens are in Figma and on v/5.0.0, with the build and the token tests passing.",
      "command": "node scripts/build-tokens.mjs && node scripts/test-invariance.mjs",
      "evidence": "docs/operacao/evidencias/DSA-84/figma-preview-accepted-2026-11-16.md",
      "result": "passed",
      "verified_at": "2026-11-16",
      "verified_by": "claude-code"
    }
  ],
  "blockers": [],
  "pending_decisions": [],
  "evidence": [
    "docs/operacao/evidencias/DSA-84/figma-preview-accepted-2026-11-16.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-16.md, Indiane chose the recommended option 1 on the 15 Figma previews (frame 6753:17854, page 988:6952, light and dark), among them F1 (DSA-73 D-1) and F3 (DSA-77 D-3), and released recording the answers and opening DSA-84 and DSA-85"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=6753-17854",
    "date": "2026-11-16",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "DSA-73 D-1 asked whether the foundation fixes at the source the colors that fall below the WCAG minimum on the dark dialog; DSA-77 D-3 asked whether the five derived measures of nph-scheduler get their own tokens. The design owner chose option 1 in both, on the previews F1 (6762:19442) and F3 (6763:19639)."
  },
  "git_review": { "branch": null, "commit": null, "pr": null },
  "context": null,
  "updated_at": "2026-11-16"
}
```

# DSA-84 — dark contrast on the dialog (rest of DSA-81) and nph-scheduler measure tokens

## Goal
In dark mode, the dialog surface `color/dialog` (#3C444F) is lighter than the popover, and four colors fall below the WCAG minimum on it: the error text and the error marker background of the stepper, the brand text in four brands and the current step ring in three brands (WCAG 1.4.3 and 1.4.11). And five measures of nph-scheduler have no token: the code derives them from other tokens, so changing `scheduler/event-min-height` would change the hour height and the month row with no warning.

## Steps
1. In Figma, measure every pair on `color/dialog` in the 7 brands and show the candidates in light and dark (F1 `6762:19442`, F3 `6763:19639`).
2. After her acceptance: change the dark aliases and create the tokens in Figma, by rule T9 (component → semantic → primitive; a new value enters the core first; name from general to specific, without the value in the name).
3. The same on `v/5.0.0`: `core.tokens.json`, `theme.tokens.json`, `semantic.tokens.json`, `tokens.css` and `design.md`.

## Result
Accepted on 2026-11-16. Values and contrast are in the evidence.
- Dark only: `status/error-text` → `core/danger/200`; `status/error` → `core/danger/300`; `color/primary-border` → `theme/brand-200` in the 7 brands; `theme/brand-text-dark` → `core/gerencial/100`, `core/comercial/200`, `core/financeiro/200` and `core/rh/100` in those four brands. Existing primitives only.
- New component tokens: `scheduler/hour-height`, `scheduler/mini-month-cell-size`, `scheduler/list-time-width`, `scheduler/list-time-width-compact` and `scheduler/month-row-min-height`. One new core value, `core/layout-width/list-time-compact` (72). `core/space/1200` and `core/space/1500` existed in Figma and enter the sources.
- Figma, the three token sources, `tokens.css` and `design.md` changed together.

## What this task does not do
It does not change the light values. It does not change any component: the nph-scheduler code starts to read its new tokens, and the mini-month cell goes from 28 to 36, in DSA-85. It does not bring `command/offset-top` and `core/layout-offset/top` (DSA-80 D-1): they are in Figma and wait in DSA-85 for the build to take a percentage.

## Sources
- `docs/operacao/evidencias/DSA-84/figma-preview-accepted-2026-11-16.md`
- `docs/operacao/tarefas/DSA-73.md` and `DSA-77.md`, section "Decisions answered on 2026-11-16 on the Figma previews"
- `docs/operacao/tarefas/DSA-81.md`
- WCAG 2.2, 1.4.3 Contrast (Minimum) and 1.4.11 Non-text Contrast

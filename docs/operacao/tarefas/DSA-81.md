```json
{
  "id": "DSA-81",
  "goal": "Lighten two semantic colors in dark mode so they meet contrast on the dialog surface: color/destructive-text to 4.5:1 on color/dialog, and focus/border to 3:1 on color/dialog in all 7 brands (Gerencial, Recursos Humanos and Igrejas were below it), keeping 3:1 on color/background and against the halo, reusing existing primitives with no new core value (rule T9), first in Figma and then in the tokens.",
  "phase": "F4",
  "approved_order": 800,
  "owner": "claude-code",
  "state": "done",
  "piece": null,
  "dependencies": [],
  "gates": [
    {
      "id": "figma-preview-accepted",
      "description": "The new dark values of color/destructive-text and focus/border (all 7 brands) were shown in Figma, light and dark, with the contrast of each pair, and accepted by the design owner.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-81/figma-preview-accepted-2026-11-13.md",
      "result": "passed",
      "verified_at": "2026-11-13",
      "verified_by": "indiane"
    },
    {
      "id": "tokens-on-branch",
      "description": "The changed dark values of the two semantics, pointing to existing primitives (no new core value), are in Figma and on v/5.0.0, with the build and the token tests passing.",
      "command": "node scripts/build-tokens.mjs && node scripts/test-invariance.mjs",
      "evidence": "docs/operacao/evidencias/DSA-81/figma-preview-accepted-2026-11-13.md",
      "result": "passed",
      "verified_at": "2026-11-13",
      "verified_by": "claude-code"
    }
  ],
  "blockers": [],
  "pending_decisions": [],
  "evidence": [
    "docs/operacao/evidencias/DSA-81/figma-preview-accepted-2026-11-13.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-12.md, nph-command, Pend. 12 and 13 answered: one foundation task lightens color/destructive-text and focus/border in dark, at the source, with no local override in the command"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=6067-3610",
    "date": "2026-11-12",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "In the nph-command root (6067:3610, page 1626:18), on the dark dialog surface color/dialog (#3C444F), the destructive item text color/destructive-text (core/danger/300) measures 3.62:1, below 4.5:1, and the field focus border focus/border measures 2.56:1 (Gerencial), 2.64:1 (Recursos Humanos) and 2.93:1 (Igrejas), below 3:1. The design owner decided to fix both at the source in one foundation task."
  },
  "git_review": { "branch": null, "commit": null, "pr": null },
  "context": null,
  "updated_at": "2026-11-13"
}
```

# DSA-81 — dark contrast of color/destructive-text and focus/border on the dialog

## Goal
In dark mode, two semantic colors fall below the WCAG minimum on the dialog surface `color/dialog` (#3C444F), which is lighter than the popover:

| Semantic | Dark today | On `color/dialog` | Target |
|---|---|---|---|
| `color/destructive-text` | `core/danger/300` | 3.62:1 (4.69:1 on `color/popover`) | 4.5:1 or more on `color/dialog` and on `color/popover` (WCAG 1.4.3) |
| `focus/border`, Gerencial | `theme/brand-300` | 2.56:1 | 3:1 or more on `color/dialog`, keeping 3:1 or more on `color/background` and against the halo (WCAG 1.4.11) |
| `focus/border`, Recursos Humanos | `theme/brand-300` | 2.64:1 | same |
| `focus/border`, Igrejas | `theme/brand-300` | 2.93:1 | same |

The fix is at the source, for every consumer, not a local override in a component.

## Steps
1. In Figma, read the current dark values and measure every neighbor pair (dialog, popover, background, card, halo) in the 7 brands.
2. Propose the new primitives in `core` (rule T9: a new value enters the core first; name from general to specific, without the value in the name) and the new dark alias of each semantic. Show them in Figma, light and dark, next to the nph-command root, the nph-dropdown-menu and the nph-input, with the contrast of each pair.
3. After her acceptance: create the primitives and change the dark aliases in Figma; then the same on `v/5.0.0` (`core.tokens.json`, `theme.tokens.json` or `semantic.tokens.json`, `tokens.css`), with the `use` of both semantics in `design.md` citing `color/dialog`.

## Result
Steps 2 and 3 planned new core primitives; none was needed.
Accepted on 2026-11-13 (preview `6312:15466`): `color/destructive-text` dark → `core/danger/200` (5.12:1 on `color/dialog`); `focus/border` dark → `theme/brand-200` in all 7 brands (4.27:1 to 7.59:1 on `color/dialog`). Both are existing primitives: no new core value. Figma, `semantic.tokens.json`, `tokens.css` and `design.md` changed together.

## What this task does not do
It does not change the light values. It does not change any component, and it adds no component token. The code needs no change: the components read the semantics.

## Sources
- WCAG 2.2, 1.4.3 contrast (minimum): https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
- WCAG 2.2, 1.4.11 non-text contrast: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- Radix Colors, scale use: https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale
- Atlassian color: https://atlassian.design/foundations/color
- Carbon color tokens: https://carbondesignsystem.com/elements/color/tokens/
- `docs/operacao/evidencias/DSA-80/figma-docs-accepted-2026-11-12.md` — accessibility and Pend. 12 and 13
- `design.md` — `color/destructive-text`, `focus/border`, `color/dialog`

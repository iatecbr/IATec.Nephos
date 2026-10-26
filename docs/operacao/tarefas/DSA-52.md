```json
{
  "id": "DSA-52",
  "goal": "Make the icon-only nph-button swap its icon from light to solid in hover-active, as the button with text already does, and bring the spec and P88 to the same rule.",
  "phase": "F4",
  "approved_order": 510,
  "owner": "elvys",
  "state": "ready",
  "piece": "nph-button",
  "dependencies": ["DSA-47", "DSA-43"],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "Indiane decided that the icon-only button also swaps the icon from light to solid in hover-active (D1 of DSA-47); recorded as evidence.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-52/figma-docs-accepted-2026-10-26.md",
      "result": "passed",
      "verified_at": "2026-10-26",
      "verified_by": "indiane"
    },
    {
      "id": "review-and-merge",
      "description": "Component, CSS, tests, stories, spec and P88 pass the proof commands and are merged into v/5.0.0.",
      "command": null,
      "evidence": null,
      "result": "pending",
      "verified_at": null,
      "verified_by": null
    }
  ],
  "blockers": [],
  "pending_decisions": [],
  "evidence": [
    "docs/operacao/evidencias/DSA-52/figma-docs-accepted-2026-10-26.md"
  ],
  "decision_refs": [
    "docs/decisoes-tecnicas.md#p88",
    "docs/operacao/tarefas/DSA-47.md, D1 answered by Indiane on 26-10-2026",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-26.md, Indiane answered D1: the icon-only button also swaps to solid in hover-active"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=2722-5358",
    "date": "2026-10-26",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "Decision D1 of DSA-47, answered by Indiane on 26-10-2026 on the preview frame `2722:5358` (page `Rascunho`): the icon-only button, COMPONENT_SET 498:15671, also swaps its icon from light to solid in hover-active, like the nph-button with text (COMPONENT_SET 461:13009). The rule, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": { "branch": null, "commit": null, "pr": null },
  "context": null,
  "updated_at": "2026-10-26"
}
```

# DSA-52 — nph-button: solid icon in hover-active, also in the icon-only button

## Goal
While the icon-only nph-button (`data-nph-icon-only`, the contract of the nph-icon-button,
DSA-43) is hovered or pressed, its icon draws the `solid` variant of `nph-icon`, in the
same color as before. DSA-47 did this only for the button with text.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate:
`docs/operacao/evidencias/DSA-52/figma-docs-accepted-2026-10-26.md`. It carries the rule
converted to text. There is no need to open Figma.

## What changes
- **Code:** in `src/components/nph-button/nph-button.ts`, the icon-only branch renders a
  single `light` icon with `glyph`. Render the `light` and `solid` pair, as `glyphPair`
  does for the button with text, and show one by the same hover-active condition in
  `nph-button.css`. How to do it is the implementer's choice; the visible result counts.
- **When:** hover-active only. At rest, in focus without hover, `disabled` and `loading`
  the icon stays `light`.
- **Tests and stories:** cover the variant per state for the icon-only button, as DSA-47
  did for the button with text.
- **Spec:** `fichas/nph-button.md`, state `hover-active` (around lines 152–153), says the
  icon-only button keeps its icon light. Change it to the new rule.
- **Decision record:** P88 in `docs/decisoes-tecnicas.md` names only the button with text.
  Amend it to cover the icon-only button too.
- **No new token.** The swap is a variant of `nph-icon`.

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS, tests,
stories, spec and P88 pass the proof commands in `docs/operacao/component-handoff.md` and
are merged into `v/5.0.0`.

## Relations with other tasks
- DSA-47 made the swap for the button with text; its D1 asked for this task.
- DSA-43 brought the icon-only button to the nph-icon-button contract.

## What this task does not do
It does not create a token or change a token value. It does not change the icon color,
size, shape or tooltip. It does not touch `nph-icon`. It does not change Figma.

## Sources
- `docs/operacao/evidencias/DSA-52/figma-docs-accepted-2026-10-26.md`
- `docs/operacao/tarefas/DSA-47.md`
- `src/components/nph-button/nph-button.ts`, `nph-button.css`, tests and stories
- `src/components/nph-icon/nph-icon.icons.ts` — `NPH_ICON_VARIANTS`
- `fichas/nph-button.md`, `docs/decisoes-tecnicas.md` (P88)

```json
{
  "id": "DSA-47",
  "goal": "Make the nph-button swap its start and end icons from the light variant to the solid variant while it is hovered or pressed, in the rule Indiane decided on 21-10-2026.",
  "phase": "F4",
  "approved_order": 470,
  "owner": "elvys",
  "state": "done",
  "piece": "nph-button",
  "dependencies": ["DSA-13"],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "Indiane decided that an action with an icon swaps the icon from light to solid in the hover-active state, and the rule is shown in Figma; recorded as evidence.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-47/figma-docs-accepted-2026-10-21.md",
      "result": "passed",
      "verified_at": "2026-10-21",
      "verified_by": "indiane"
    },
    {
      "id": "review-and-merge",
      "description": "Component, CSS, tests, stories and spec pass the proof commands and are merged into v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-47/review-and-merge-2026-10-24.md",
      "result": "passed",
      "verified_at": "2026-10-24",
      "verified_by": "claude-code"
    }
  ],
  "blockers": [],
  "pending_decisions": [],
  "evidence": [
    "docs/operacao/evidencias/DSA-47/figma-docs-accepted-2026-10-21.md",
    "docs/operacao/evidencias/DSA-47/review-and-merge-2026-10-24.md"
  ],
  "decision_refs": [
    "docs/decisoes-tecnicas.md#p88",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-21.md, Indiane: an action with an icon in the active state (hover/active) swaps the icon to solid; the rule goes to the components",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, Elvys writes component code and specs; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-26.md, Indiane answered D1: the icon-only button also swaps to solid in hover-active"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=461-13009",
    "date": "2026-10-21",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "In hover-active, the start and end icons of the nph-button (COMPONENT_SET 461:13009, page `NPH — Button`) use the solid variant; at rest, focus, disabled and loading they stay light. The use example is card 25 of the board 2478:1910. The rule, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": {
    "branch": "claude/dsa-47-nph-button-icone-solido-b4494c",
    "commit": "bb47fea7a0dc968f0931330f4ececbad90869393",
    "pr": "113"
  },
  "context": null,
  "updated_at": "2026-10-26"
}
```

# DSA-47 — nph-button: solid icon in hover-active

## Goal
While the nph-button is hovered or pressed, its start and end icons draw the
`solid` variant of `nph-icon`, in the same color as the text of the type and
emphasis. You can tell it exists in Storybook: hover a button with icons and the
icons fill in.

## What changes
- **When:** the hover-active state, the same condition that already changes the
  background and the text: `.control:not(:disabled):not([aria-disabled='true']):is(:hover, :active)`
  in `src/components/nph-button/nph-button.css`.
- **What:** `icon-start` and `icon-end` go from `variant` `light` (the `nph-icon`
  default) to `variant` `solid`. Both variants exist for every core name
  (`NPH_ICON_VARIANTS` in `src/components/nph-icon/nph-icon.icons.ts`).
- **Color:** unchanged. The icon keeps inheriting the text color of the type and
  emphasis, including the hover color (`--_fg-hover`).
- **What does not change:** at rest, in focus without hover, in `disabled` and in
  `loading` (the spinner takes the start icon's place) the icons stay `light`.
- **No new token.** The swap is a variant of `nph-icon`, not a color or size.
- How to swap the variant (CSS, two icons, or state in the component) is the
  implementer's choice; the visible result is what counts.

## Decisions answered
Indiane answered D1 on 2026-10-26.

| ID | Answer | What the code does |
|---|---|---|
| D1 | Option 1: the icon-only button (`data-nph-icon-only`; Figma set `nph-icon-button` 498:15671) also swaps its icon to `solid` in hover-active, the same rule as the button with text. At rest, in focus without hover, `disabled` and `loading` the icon stays `light`. Preview in Figma: `2722:5358`, page `Rascunho`. | The code applies the swap to the icon-only button too. The rule that applied only to the button with text stops being a limit. This change to the code is still to be made; this task is already merged without it. |

## How it is proved
**`figma-docs-accepted`** — passed: the rule decided by Indiane, converted to
text in the evidence. **`review-and-merge`** — the tests cover the variant per
state (rest `light`, hover-active `solid`, disabled and loading without the
swap); the stories show a button with icons in hover with the solid icon; the
spec `fichas/nph-button.md` says the rule, if it does not say it yet; the proof
commands in `docs/operacao/component-handoff.md` pass, and it is merged into
`v/5.0.0`.

## What this task does not do
It does not create a token or change a token value. It does not change the icon
color, size or the gap. It does not touch `nph-icon`.

## Sources
- `docs/operacao/evidencias/DSA-47/figma-docs-accepted-2026-10-21.md`
- `src/components/nph-button/nph-button.ts`, `nph-button.css`, tests and stories
- `src/components/nph-icon/nph-icon.icons.ts` — `NPH_ICON_VARIANTS`
- `fichas/nph-button.md`

```json
{
  "id": "DSA-47",
  "goal": "Make the nph-button swap its start and end icons from the light variant to the solid variant while it is hovered or pressed, in the rule Indiane decided on 21-10-2026.",
  "phase": "F4",
  "approved_order": 470,
  "owner": "elvys",
  "state": "in-review",
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
      "evidence": null,
      "result": "pending",
      "verified_at": null,
      "verified_by": null
    }
  ],
  "blockers": [],
  "pending_decisions": [
    {
      "id": "D1",
      "question": "The rule was applied in Figma to the nph-button with text (461:13009). The icon-only set (498:15671) keeps its icon light in every state. Does the icon-only button also swap to solid in hover-active? It does not block the task: until the answer, the code applies the swap only when the button has text.",
      "decider": "indiane",
      "opened_at": "2026-10-21"
    }
  ],
  "evidence": [
    "docs/operacao/evidencias/DSA-47/figma-docs-accepted-2026-10-21.md"
  ],
  "decision_refs": [
    "docs/decisoes-tecnicas.md#p88",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-21.md, Indiane: an action with an icon in the active state (hover/active) swaps the icon to solid; the rule goes to the components",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, Elvys writes component code and specs; Claude takes only tokens"
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
    "commit": "fc09b80d7af1407fb815e0352087827b7a4e135b",
    "pr": "113"
  },
  "context": "docs/operacao/contextos/DSA-47.md",
  "updated_at": "2026-10-23"
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

## Pending decisions
| ID | What the evidence gives | What is missing | What the code does with the answer |
|---|---|---|---|
| D1 | The swap in the button with text (461:13009). | Whether the icon-only button (498:15671, `data-nph-icon-only`) also swaps. | Until the answer, the swap applies only when the button has text; the answer turns it on or keeps it off for the icon only. |

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

```json
{
  "id": "DSA-93",
  "goal": "Move the keyboard focus of the nph-tree item to the focus of the list items: a 1 px border outside the row and a 4 px halo outside the border, as Figma has since 2026-11-18, with the tokens, the tests and the texts changed in the same work.",
  "phase": "F4",
  "approved_order": 920,
  "owner": "elvys",
  "state": "ready",
  "piece": "nph-tree",
  "dependencies": [
    "DSA-75"
  ],
  "gates": [
    {
      "id": "design-decision",
      "description": "The design owner decided that the nph-tree item takes the focus of the list items, and Figma has it in the item set, the tokens and the documentation.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-93/design-decision-2026-11-18.md",
      "result": "passed",
      "verified_at": "2026-11-18",
      "verified_by": "indiane"
    },
    {
      "id": "review-and-merge",
      "description": "The tokens, the CSS, the tests, the spec, the metadata, the Storybook texts and design.md change together, pass the proof commands and are merged into v/5.0.0.",
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
    "docs/operacao/evidencias/DSA-93/design-decision-2026-11-18.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, component code and specs belong to the code owner; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-18.md, the design owner approved option A of the preview: the nph-tree item takes the focus border and halo of the list items, and asked for a task for the code owner"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0",
    "date": "2026-11-18",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "In the set nph-tree / item (5485:350), the six variants with focus moved from a 2 px border inside the row to a 1 px border outside the row plus a 4 px halo outside the border; tree/focus-border-width and tree/focus-border-radius point to other semantic tokens, and tree/focus-halo, tree/focus-halo-width and tree/focus-halo-radius are new. The decision, the variants and the token table are in the evidence of the design-decision gate."
  },
  "git_review": { "branch": null, "commit": null, "pr": null },
  "context": null,
  "updated_at": "2026-11-18"
}
```

# DSA-93 — Focus of the `nph-tree` item as in the other list items

## Goal
With the keyboard, the `nph-tree` item shows the same focus as the item of the `nph-dropdown-menu`, the `nph-menubar` and the `nph-panel-menu`: a 1 px border outside the row and a 4 px halo outside the border. Today it shows a 2 px border inside the row, with no halo. The tokens, the tests and the texts change in the same work.

## Where the decision is
In the evidence of the `design-decision` gate: `docs/operacao/evidencias/DSA-93/design-decision-2026-11-18.md`. It carries the decision, the Figma variants, the token table and what the documentation says now. There is no need to open Figma.

## Why the tokens did not go first
The test "consumes every one of the twenty-five tree/* tokens" in `src/components/nph-tree/nph-tree.test.ts` counts the `--nph-tree-*` properties in `tokens.css` and asks the CSS to use each one. Three new tokens with no CSS would break it. So the tokens come with the code.

## What changes
### Tokens
In `src/tokens/source/semantic.tokens.json`, block `tree`:

| Token | Today | After |
|---|---|---|
| `focus-border` | `{focus.border}` | unchanged |
| `focus-border-width` | `{core.focus-width.sm}` | `{border.width}` |
| `focus-border-radius` | `{radius.control}` | `{focus.border-radius-control}` |
| `focus-halo` | — | new, `$type` `color`, `{focus.halo}` |
| `focus-halo-width` | — | new, `$type` `dimension`, `{focus.ring-width}` |
| `focus-halo-radius` | — | new, `$type` `dimension`, `{focus.radius-control-with-border}` |

Regenerate `src/tokens/generated/tokens.css`. No new `core` value: all six point to semantic tokens that already exist. They are the same semantic tokens of the `nph-collapsible` trigger (`collapsible/focus-*`), whose corner is also `radius/control`.

### CSS
`src/components/nph-tree/nph-tree.css`, the rule `.item:focus-visible::after`:

- **Border:** 1 px in `tree/focus-border`, outside the row: `inset: calc(-1 * var(--nph-tree-focus-border-width))`, corner `tree/focus-border-radius`.
- **Halo:** 4 px in `tree/focus-halo`, outside the border: `inset: calc(-1 * (border width + halo width))`, corner `tree/focus-halo-radius`.
- **Reference:** `.trigger:focus-visible::before` and `::after` in `src/components/nph-collapsible/nph-collapsible.css` draw the same pair with the same semantic tokens.
- **Rows next to the focused row:** the rows stack with no gap, so the focused row needs to stay above its neighbors (`z-index: 1`), as `.item:focus-visible` of the `nph-dropdown-menu`. Otherwise the next row covers the halo.
- **Selected with focus:** the bar is no longer covered. It stays visible inside the border, clipped by the corner of `.face`, as today.
- **Disabled with focus:** the border and the halo stay on top at full opacity (D-2 of DSA-75).
- **Comments:** the header comment ("inside the whole row (D-2 of the task)") and the comment over the rule change with it.

**Tree box:** `tree/padding` is 4 px. The 1 px border fits inside it. The halo goes 1 px past the box of the tree on the first and last rows and at the two ends of each row. The tree sets no `overflow`, and Figma draws it the same way. This task does not change `tree/padding`.

### Tests
In `src/components/nph-tree/nph-tree.test.ts`:

| Test | What changes |
|---|---|
| "consumes every one of the twenty-five tree/* tokens" | Twenty-eight tokens. |
| "the focus is a border of `tree/focus-border-width` in `focus/border`, drawn inside the whole row, with the corner of the item" | The border is outside the row: its box is the row plus the border width on each side. It also checks the halo: width `tree/focus-halo-width`, color `tree/focus-halo`, corner `tree/focus-halo-radius`, box the row plus border and halo on each side. The checks that the row has no `box-shadow` and no `outline` stay. |
| "on the selected item with focus the border covers the bar, …" | The bar stays visible inside the border. The checks on the background, the color and the weight stay. |
| "a disabled item with focus keeps the focus border on top at full opacity" | The same for the halo. |
| "the focus wins over the hover", "the error row takes the hover and the focus of an item" | They read the border color of `::after`. Follow the pseudo-element that draws the border, if it changes. |

Add a check that the focused row is above the next row, so its halo is not covered.

### Texts
Each text that says the focus is a border inside the row, or that it covers the bar, takes the new focus: a 1 px border outside the row and a 4 px halo outside it, with the bar visible inside.

- **`design.md`:**
  - `focus/border`, field `use`: "the focus border of the nph-tree item (tree/focus-border), drawn inside the row" becomes outside the row, with the halo.
  - `focus/halo`, `border/width`, `focus/ring-width`, `focus/border-radius-control` and `focus/radius-control-with-border`: add the `nph-tree` item (`tree/focus-halo`, `tree/focus-border-width`, `tree/focus-halo-width`, `tree/focus-border-radius`, `tree/focus-halo-radius`), as the `nph-collapsible` lines do.
  - `radius/control`: remove "and of its focus border (tree/focus-border-radius)".
  - `core/focus-width/sm`, field `por_decisao`: remove `tree/focus-border-width` from the list of 2 px borders inside an item.
  - `focus/ring-width`: the rich option sentence ends with "as tree/focus-border-width". Remove that comparison; the rich option part follows DSA-91.
- **`fichas/nph-tree.md`:** the focus in the YAML block (`token`, `changes_for_user`, `focus`) and in the tables (today lines 232, 233, 272, 293, 381, 426 and 463).
- **`src/shared/metadata/nph-tree.json`:** the same texts (today lines 203, 204, 251 and 275).
- **`.storybook/i18n/en.json`, `es.json`, `pt-BR.json`:** the two focus texts of the `nph-tree` (today lines 14162 and 14193 in the three files).
- **`docs/decisoes-tecnicas.md`:** P118 records that the focus border stays on top of the disabled item (D-2). Add a note that names DSA-93: the focus moved to the border and halo outside the row on 2026-11-18. The old text stays as history.

Before closing, search the repository for "inside the whole row", "drawn inside the row", "covers the bar", the same phrases in the pt-BR and es files, and `tree/focus`, to catch any text this list missed. Leave `docs/operacao/evidencias/` as it is (evidence is history).

## Order with DSA-91 and DSA-92
DSA-91 (`nph-rich-option`) also moves the focus of the rich option to the border and halo of the list items. DSA-92 changes the light `focus/border` color in `Sistemas`. Both touch `design.md` lines this task touches (`focus/border`, `focus/ring-width`, `core/focus-width/sm`); the one that lands later rebases its text on the other. Neither changes a `tree/*` token.

## How it is proved
**`design-decision`:** passed.

**`review-and-merge`:**
- the tokens, the CSS, the tests, the spec, the metadata, the Storybook texts and `design.md` change together;
- the whole test suite passes;
- the proof commands in `docs/operacao/component-handoff.md` exit 0;
- in Storybook, the focus shows the border and the halo in the seven brands, light and dark;
- the work is merged into `v/5.0.0`.

## What this task does not do
It does not change the colors of the focus, `tree/padding`, the hover, the selection or any other component. It does not change Figma. It does not build the Tree Select nor the Tree Table.

## Sources
- `docs/operacao/evidencias/DSA-93/design-decision-2026-11-18.md`
- `docs/operacao/tarefas/DSA-75.md`: the task that built the `nph-tree`, with D-2 (focus on the disabled item)
- `src/components/nph-collapsible/nph-collapsible.css` and `src/components/nph-dropdown-menu/nph-dropdown-menu.css`: the focus border and halo already in code
- Figma `DS-IA-NEPHOS 5.0`: set `nph-tree / item` (`5485:350`), documentation `5876:216753`
- WCAG 2.2, non-text contrast: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- `design.md`: rule 6 (focus border and halo), `focus/border`, `focus/halo`

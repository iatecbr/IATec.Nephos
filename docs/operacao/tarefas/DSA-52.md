```json
{
  "id": "DSA-52",
  "goal": "Make the icon-only nph-button swap its icon from light to solid in hover-active, as the button with text already does, and bring the spec and P88 to the same rule.",
  "phase": "F4",
  "approved_order": 510,
  "owner": "elvys",
  "state": "in-review",
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
      "description": "Component, CSS, tests, stories, dictionary, spec, Metadata and P88 pass the proof commands and are merged into v/5.0.0.",
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
  "git_review": { "branch": "claude/dsa-52-nph-button-so-icone-solido", "commit": "ec7bebaa9ea6339e5d9840feecdddf536d5724f9", "pr": "https://github.com/iatecbr/IATec.Nephos/pull/129" },
  "context": "docs/operacao/contextos/DSA-52.md",
  "updated_at": "2026-10-27"
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
  `nph-button.css`. Keep the icon-only size per `size` (`ICON_ONLY_ICON_SIZE`); `glyphPair`
  fixes `sm`. How to do it is the implementer's choice; the visible result counts.
- **When:** hover-active only. At rest, in focus without hover and `disabled` the icon
  stays `light`; in `loading` the spinner takes the icon's place.
- **Tests:** the test "icon only, on hover, keeps its single icon light (D1)" in
  `nph-button.test.ts` states the opposite of the new rule: invert it, do not only add
  one. Cover the variant per state for the icon-only button, as DSA-47 did for the button
  with text. The stories show an icon-only button in hover with the solid icon.
- **Comments:** update every comment that says the swap is only "with text": the JSDoc in
  `nph-button.ts`, the comment in `nph-button.css`, and in `nph-button.test.ts` the header
  (lines 5–6, "P88 adds the solid icon in hover-active, in the button with text") and the
  docstring of `visibleIcons` (lines 213–214, "with text, each icon is a light and solid
  pair").
- **Storybook dictionary:** `.storybook/i18n/en.json`, `pt-BR.json` and `es.json`, the
  `hover-active` text ("in the button with text the start and end icons turn solid"), and
  the description of the `Icons` story if it says the same.
- **Spec:** `fichas/nph-button.md` says the icon-only button keeps its icon light in three
  places: the `hover-active` state (around line 152, including its `changes_for_user` on
  line 153), the states table (around line 311, including its third column) and the history
  (around line 420). Change all three to the new rule. The `decision` field (around line
  224) names P88 as "of the button with text"; fix it too. Then regenerate the
  Metadata with `node scripts/verificar-operacao.mjs --gerar-metadata`; do not edit
  `src/shared/metadata/nph-button.json` by hand.
- **Decision record:** P88 in `docs/decisoes-tecnicas.md` names only the button with text
  (item 4, "Only in the button with text", and "Out of scope"). Cover the icon-only button,
  either editing P88 or adding a new decision that amends it; both are accepted in this
  repository. In P88, item 3 ("With text, each icon renders as a pair") and "Breaking
  changes" ("the shadow root of the button with text") also say it. If you add a new
  decision, add it to the index and to the list of single-source decisions at the top of the
  file. The amendment notes of P68 (the table line and the `Hover` item) say "in the
  button with text" and follow the same choice.
- **Sweep before you finish:** grep `src/components/nph-button/`, `fichas/nph-button.md`,
  `docs/decisoes-tecnicas.md`, `.storybook/i18n/` and `src/shared/metadata/` for "with text"
  and "keeps its icon light" next to the icon swap, and fix any statement the new rule makes
  false. The lists above are the known places, not the only ones.
- **No new token.** The swap is a variant of `nph-icon`.

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS, tests,
stories, dictionary, spec, Metadata and P88 pass the proof commands in `docs/operacao/component-handoff.md` and
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

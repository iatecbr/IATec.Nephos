```json
{
  "id": "DSA-92",
  "goal": "Move the light focus border of the `Sistemas` brand from tone 500 to tone 600 in the code, as decided on 2026-10-26 and already applied in Figma, with the tests and texts that pin the old 2.92:1 limit changed in the same work.",
  "phase": "F4",
  "approved_order": 910,
  "owner": "elvys",
  "state": "ready",
  "piece": null,
  "dependencies": [
    "DSA-17",
    "DSA-18",
    "DSA-27"
  ],
  "gates": [
    {
      "id": "foundation-decision",
      "description": "The design owner decided that the light focus border of the `Sistemas` brand uses tone 600, and Figma has that value in theme/brand-focus.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-92/foundation-decision-2026-10-26.md",
      "result": "passed",
      "verified_at": "2026-10-26",
      "verified_by": "indiane"
    },
    {
      "id": "review-and-merge",
      "description": "The token, the tests, the specs, the Storybook texts and design.md change together, pass the proof commands and are merged into v/5.0.0.",
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
    "docs/operacao/evidencias/DSA-92/foundation-decision-2026-10-26.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, component code and specs belong to the code owner; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-26.md, nph-pagination QA: the design owner approved option 1, the light focus border in `Sistemas` tone 600, for every component",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-18.md, the design owner asked for a foundation task for the code owner, with the token, the tests and the texts together"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0",
    "date": "2026-10-26",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "theme/brand-focus (VariableID:574:2), `Sistemas` mode, moved from core/sistemas/500 to core/sistemas/600 in Figma; the decision and the measures are in the evidence of the foundation-decision gate."
  },
  "git_review": { "branch": null, "commit": null, "pr": null },
  "context": null,
  "updated_at": "2026-11-18"
}
```

# DSA-92 — Light focus border in `Sistemas` tone 600

## Goal
In light mode of the `Sistemas` brand, `focus/border` measures at least 3:1 against the halo, as Figma already does. The token, the tests and the texts change in the same work, so nothing still pins the old limit of 2.92:1.

## Where the decision is
In the evidence of the `foundation-decision` gate: `docs/operacao/evidencias/DSA-92/foundation-decision-2026-10-26.md`. It carries the decision, the reason, the Figma value and the contrast measured in the seven brands. There is no need to open Figma.

## What changes
### Token
In `src/tokens/source/theme.tokens.json`, `brand-focus`: the `$value` and the `sistemas` mode go from `{core.sistemas.500}` to `{core.sistemas.600}`. The six other brands keep their values. Regenerate `src/tokens/generated/tokens.css`. No new token. Dark mode does not change: `focus/border` dark reads `theme/brand-200`.

### Tests that pin the old limit
With tone 600 no brand stays below 3:1 against the halo, so each of these tests turns into "no pair below 3:1" (an empty list), and the text checks go away or follow the new text:

| File | What it pins today |
|---|---|
| `src/components/nph-checkbox/nph-checkbox.test.ts`, test "known limit: focus/border under 3:1 against the halo is exactly the one design.md names" | The list `['sistemas light']` and the `design.md` phrase "in light mode, the border measures 2,92:1 against the halo" |
| `src/components/nph-radio/nph-radio.test.ts`, test "known limit: the focus border under 3:1 against the halo is exactly the light default brand" | The list `light ${DEFAULT_BRAND}` |
| `src/components/nph-switch/nph-switch.test.ts`, test "known limit: focus/border against focus/halo is under 3:1 only in the default brand, in light mode" | The list `light ${DEFAULT_BRAND}` |
| `src/components/nph-switch/nph-switch.docs.test.ts`, test "the accessibility section carries the known limit of the focus border" | The text `2.92` (en) or `2,92` (pt-BR and es) in the accessibility section |

The comments above these tests say the same limit; they change with them.

### Texts that cite the old value
Each text that says `focus/border` is below 3:1 in light `Sistemas`, or gives a measure of `focus/border` light in `Sistemas` made with tone 500, gets the new value (see "Measures to write"):

- `design.md`:
  - `focus/border`, field `use`: the sentence "Known limit: in `Sistemas`, in light mode, the border measures 2,92:1 against the halo…" goes away; the nph-rich-option card part ("the known `Sistemas` light limit (2.92:1)… against color/card 3.68:1 light") and the rich option ring part ("3.68:1 light… over color/popover, 3.43:1 light… over the hover layer") take the tone 600 measures.
  - `theme/brand-focus`: `valor_por_modo` says `core/sistemas/600` in `Sistemas`, `core/<vertical>/500` in five verticals and `core/educacao/700` in `Educacao`; `use` says why `Sistemas` uses 600 (tone 500 measured 2.92:1 against its halo).
  - `theme/brand-halo`, field `use`: the sentence "`Sistemas` does not reach 3:1 at any tone: 2,92:1 at 100, its best" goes away; with the border in 600, `Sistemas` meets 3:1 at tone 100 (4.26:1).
- `fichas/nph-checkbox.md`, `fichas/nph-radio.md`, `fichas/nph-switch.md`: the focus or contrast lines that name the 2.92:1 limit, in the YAML block and in the table. `fichas/nph-label.md`: the focus border measure (3.68:1 light) in the YAML block and in the table.
- `src/shared/metadata/nph-checkbox.json`, `nph-radio.json`, `nph-switch.json`, `nph-label.json`: the same texts as their specs.
- `.storybook/i18n/en.json`, `es.json`, `pt-BR.json`: the switch accessibility text and the radio text that cite 2.92:1 (2,92:1 in es and pt-BR), and any other string that cites the light focus border measure in `Sistemas`.
- `docs/decisoes-tecnicas.md`: the lines that record the 2.92:1 limit as current (today in P79 `nph-switch`, P81 `nph-checkbox` and P82 `nph-radio`). Write the change as a new note in each entry that names DSA-92; the old measure stays as history.

Before closing, search the repository for `2.92`, `2,92` and `3.68`, `3,68`, `3.43`, `3,43` next to `focus/border`, `focus border`, `brand-focus` or `Sistemas` to catch any text this list missed. Leave `docs/operacao/evidencias/` as it is: evidence is history.

### Measures to write
Light `Sistemas`, with `#2F68C5` (tone 600): against the halo `#D8E6FD` 4.26:1; against white (`color/background`, `color/card`, `color/popover`) 5.37:1; against the hover layer of the rich option 5.01:1 (the value the DSA-91 evidence gives for Figma). Measure again in the code after the change and write what the code gives; if a measure differs from these, the code value wins and the difference goes into the review evidence.

## Order with DSA-91
DSA-91 (`nph-rich-option`) writes the light `Sistemas` focus measures with the code value of tone 500 next to the value Figma reads. If DSA-92 lands first, the DSA-91 work uses the tone 600 measures. If DSA-91 lands first, its texts and tests with the tone 500 measures join the list above.

## How it is proved
**`foundation-decision`** — passed. **`review-and-merge`** — the token, the tests, the specs, the metadata, the Storybook texts and `design.md` change together; the whole test suite passes, not only the files above, because many component tests measure `focus/border`; the proof commands in `docs/operacao/component-handoff.md` exit 0; and the work is merged into `v/5.0.0`.

## What this task does not do
It does not change dark mode. It does not change `theme/brand-halo` or any other brand. It does not create a token. It does not change Figma. It does not give `focus/halo-error` a dark value: that is another foundation task (DSA-91, item 13).

## Sources
- `docs/operacao/evidencias/DSA-92/foundation-decision-2026-10-26.md`
- `docs/operacao/evidencias/DSA-91/figma-docs-accepted-2026-11-18.md`, section "Tokens": the code value next to the value Figma reads
- Figma `DS-IA-NEPHOS 5.0`, variable `theme/brand-focus` (`VariableID:574:2`)
- WCAG 2.2, non-text contrast: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- `design.md` — `focus/border`, `focus/halo`, `theme/brand-focus`, `theme/brand-halo`
- `docs/operacao/component-handoff.md`

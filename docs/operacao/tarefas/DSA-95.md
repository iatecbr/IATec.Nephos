```json
{
  "id": "DSA-95",
  "goal": "Move the outline of the option list of the nph-select, the nph-combobox and the nph-multi-combobox from color/input to the soft outline color/border-subtle, as Figma has since 2026-11-18, with the tests and the texts changed in the same work.",
  "phase": "F4",
  "approved_order": 940,
  "owner": "elvys",
  "state": "ready",
  "piece": null,
  "dependencies": [
    "DSA-29",
    "DSA-31",
    "DSA-46",
    "DSA-79"
  ],
  "gates": [
    {
      "id": "design-decision",
      "description": "The design owner decided that the option list of the nph-select, the nph-combobox and the nph-multi-combobox takes the soft outline color/border-subtle, and Figma has it in the list sets.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-95/design-decision-2026-11-18.md",
      "result": "passed",
      "verified_at": "2026-11-18",
      "verified_by": "indiane"
    },
    {
      "id": "review-and-merge",
      "description": "The CSS, the tests, the specs, the metadata and the Storybook texts change together, pass the proof commands and are merged into v/5.0.0.",
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
    "docs/operacao/evidencias/DSA-95/design-decision-2026-11-18.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, component code and specs belong to the code owner; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-16.md, nph-tree-select: the design owner moved the panel outline to the soft outline color/border-subtle",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-18.md, nph-tree-select approval page, item 4: the soft outline also on the option list of the nph-select, the nph-combobox and the nph-multi-combobox, in one task for the code owner"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=7174-35",
    "date": "2026-11-18",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "In the select list set (1357:137) and the combobox list set (1359:141, 7 variants), the stroke moved from color/input to color/border-subtle; the nph-multi-combobox uses the combobox list. The design owner approved item 4 of the nph-tree-select approval page, after a preview in light and dark (7174:35); the decision and the values are in the evidence of the design-decision gate."
  },
  "git_review": { "branch": null, "commit": null, "pr": null },
  "context": null,
  "updated_at": "2026-11-18"
}
```

# DSA-95 — Soft outline on the option list of the select family

## Goal
The option list of the `nph-select`, the `nph-combobox` (with its free text variant) and the `nph-multi-combobox` shows the soft outline `color/border-subtle`, the same as the `nph-tree-select` panel and the menus, in place of the strong field border `color/input`. Nothing else in the list changes.

## Where the decision is
In the evidence of the `design-decision` gate: `docs/operacao/evidencias/DSA-95/design-decision-2026-11-18.md`. It carries the decision, the reason with its sources, the Figma sets and the values before and after. There is no need to open Figma.

## What changes

### CSS
- `src/components/nph-select/nph-select.css`, `.list` (today line 207): `border: var(--nph-border-width) solid var(--nph-color-input)` → `var(--nph-color-border-subtle)`.
- `src/components/nph-combobox/nph-combobox.list.css`, `.list` (today line 29): the same. This file is shared by the `nph-combobox`, its free text variant (DSA-79) and the `nph-multi-combobox` (`nph-multi-combobox.ts` line 72 imports `comboboxListStyles`), so the three change together.
- The field keeps `color/input`: only the list changes. The rules of the field (`--_border` in `nph-select.css`, lines 41, 134 and 177) stay.
- In forced colors, the list border follows the system color the browser gives, as today.

### Tests
- `src/components/nph-select/nph-select.test.ts`, "the list: color/popover, border color/input, radius/container, elevation/dropdown" (today line 880, check at line 886): the title and the check read `--nph-color-border-subtle`.
- `src/components/nph-combobox/nph-combobox.test.ts`, "the list: color/popover, border color/input, radius/container, elevation/dropdown" (today line 1151): the same.
- `src/components/nph-select/nph-select.test.ts`, token contract (`describe('token contract')`, today lines 1263 to 1311): the test compares with `toEqual` the exact set of `var(--nph-*)` of the CSS; add `--nph-color-border-subtle` to the set (the field keeps `--nph-color-input`, so it stays). In `src/components/nph-combobox/nph-combobox.test.ts` (today line 1358) the contract checks by inclusion and does not break; add the name to its list if the spec names every token.
- If the `nph-multi-combobox` tests check the list border, the same. The checks of the field border (`color/input`, `color/input-hover`) stay.

### Texts
- `fichas/nph-select.md`: the list line in the YAML block (today line 212) and in the table (line 386): "border/width in color/border-subtle".
- `fichas/nph-combobox.md`: lines 373 and 618, the same.
- `fichas/nph-multi-combobox.md`: lines 274 and 485, the same.
- `src/shared/metadata/nph-select.json`, `nph-combobox.json` and `nph-multi-combobox.json`: generated from the specs; regenerate them with `node scripts/verificar-operacao.mjs --gerar-metadata`, do not edit them by hand.
- `.storybook/i18n/en.json`, `es.json` and `pt-BR.json`: the anatomy text "6. List" of the `nph-select` and of the `nph-combobox` ("color/popover, border color/input, …", today lines 4772 and 7470 of `en.json`, the same lines in the other two files).
- `design.md` already says it: `color/border-subtle` names the list of the three pieces, marked "DSA-95" (until this task lands, the code draws `color/input`), and `color/input` and `color/dropdown-border` send the list to `color/border-subtle`. When this task lands, drop the mark "DSA-95" from those lines.

Before closing, search the repository for "border color/input", "in color/input" next to "list", and `--nph-color-input` in the list rules, in the specs, stories, tests and the three translation files, to catch any text this list missed. Leave `docs/operacao/evidencias/` and the other tasks, such as DSA-29 and DSA-46, as they are (history).

## Why there is no token
The list uses the semantic straight today (`color/input`), and it keeps doing so with `color/border-subtle`, as Figma does. T9 asks a component token for the tokens created from now on; the existing ones do not change by it.

## Order with other tasks
- DSA-94 (`nph-tree-select`) draws its panel with `tree-select/panel-border` → `color/border-subtle`. It does not depend on this task, and this task does not depend on it.
- DSA-91 (`nph-rich-option`) changes the options inside the same lists, not the list border. The one that lands later rebases on the other in the same files.

## How it is proved
**`design-decision`:** passed.

**`review-and-merge`:**
- the CSS, the tests, the specs, the metadata and the Storybook texts change together;
- the whole test suite passes;
- the proof commands in `docs/operacao/component-handoff.md` exit 0;
- in Storybook, the list of the three pieces shows the soft outline in the seven brands, light and dark;
- the work is merged into `v/5.0.0`.

## What this task does not do
It does not create a token or change a token value. It does not change the field border, the list background, the corner, the shadow, the padding or the height. It does not change Figma. It does not change the distance between the field and the list (`space/inline-tight`, DSA-29 D1).

## Sources
- `docs/operacao/evidencias/DSA-95/design-decision-2026-11-18.md`
- `docs/operacao/evidencias/DSA-94/figma-docs-accepted-2026-11-18.md`, decision 4
- `docs/operacao/tarefas/DSA-29.md`, `DSA-31.md`, `DSA-46.md`, `DSA-79.md`
- Figma `DS-IA-NEPHOS 5.0`: `nph-select / lista` `1357:137`, `nph-combobox / lista` `1359:141`
- WCAG 2.2, non-text contrast: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- `design.md`: `color/border-subtle`, `color/input`, `color/dropdown-border`

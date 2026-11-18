```json
{
  "task": "DSA-95",
  "gate": "design-decision",
  "date": "2026-11-18",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=7174-35",
    "date": "2026-11-18",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The option list of the nph-select, the nph-combobox and the nph-multi-combobox leaves the strong field border color/input and takes the soft outline color/border-subtle, the same as the panel of the nph-tree-select. The design owner approved item 4 of the nph-tree-select approval page, as recommended, after a Figma preview in light and dark (appendix section K, preview 7174:35), with the words: in one task for the code owner. Figma was changed the same day."
  }
}
```

# DSA-95 — `design-decision`

## The decision
On 2026-11-16 the design owner corrected the panel of the `nph-tree-select`: its outline left the strong field border `color/input` for the soft outline `color/border-subtle`. On the approval page of the `nph-tree-select` (2026-11-18, item 4), she was asked whether the same soft outline also serves the option list of the `nph-select`, the `nph-combobox` and the `nph-multi-combobox`. She approved the recommendation: yes, in one task for the code owner.

## Why
- None of the 7 design systems read for the item repeats on the list the strong border of the field: the list is set apart from the page by the shadow and the background, as the menus of the Nephos already do (`color/dropdown-border` → `color/border-subtle`).
- The same family must show the same layer: the `nph-tree-select` panel and the lists of the field family now have one outline.
- WCAG 1.4.11 asks 3:1 on a border only when it is the only way to find the piece. The list has the `elevation/dropdown` shadow and the `color/popover` background, and each option carries its own contrast.

Sources: https://raw.githubusercontent.com/carbon-design-system/carbon/main/packages/styles/scss/components/list-box/_list-box.scss ; https://raw.githubusercontent.com/mantinedev/mantine/master/packages/@mantine/core/src/components/Popover/Popover.module.css ; https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/v4/registry/new-york-v4/ui/select.tsx ; https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html

## What Figma has today
- `nph-select / lista` (the select list set, `1357:137`): the stroke is `color/border-subtle` (it was `color/input`).
- `nph-combobox / lista` (the combobox list set, `1359:141`), its 7 variants (`1359:116`, `1359:138`, `1462:24305`, `1758:962`, `1758:1005`, `1758:1063`, `1758:1089`): the stroke is `color/border-subtle` (it was `color/input`).
- The `nph-multi-combobox` has no list of its own in Figma: it uses the combobox list.
- Instances: 21 of the select list and 87 of the combobox list, none overridden; they took the new outline from the main component.
- Nothing else changed: background `color/popover`, thickness `border/width`, corner `radius/container`, shadow `elevation/dropdown`, padding `space/inline-tight`, maximum height `layout/max-list-height`.
- The `color/border-subtle` description in Figma (`VariableID:4907:587`) now names the outline of the option list of the `nph-select`, the `nph-combobox` and the `nph-multi-combobox`; the `color/dropdown-border` description (`VariableID:2309:53969`) says the list takes `color/border-subtle` straight.

Preview of the approval, light and dark: appendix of the `nph-tree-select`, section K, preview `7174:35` (the select list before and after).

### Values
| | Light | Dark |
|---|---|---|
| Before, `color/input` | `#8F8F8F` (core/neutral/400) | `#9399A1` (core/surface/300) |
| After, `color/border-subtle` | `#F1F1F1` (core/neutral/50) | white 10% (core/alpha/white-10) |
| After, contrast over `color/popover` | 1.13:1 | 1.36:1 |

Decorative, as the outline of the `nph-popover`, the `nph-hover-card`, the menus and the `nph-tree-select` panel. No token was created: the list uses the semantic straight, as it does today with `color/input` (the rule T9 asks a component token only for new tokens; the existing ones do not change by it).

## Sources
- WORK BRAIN, `03 MEMÓRIA/diario/2026/2026-11-16.md` (the correction of the panel) and `2026-11-18.md` (the answer to item 4)
- Figma `DS-IA-NEPHOS 5.0`: `1357:137`, `1359:141`; the `nph-tree-select` appendix `7149:38729`, pending 1 (`7150:36`) and preview `7174:35`
- `docs/operacao/evidencias/DSA-94/figma-docs-accepted-2026-11-18.md`, decision 4
- WCAG 2.2, non-text contrast: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html

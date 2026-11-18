```json
{
  "id": "DSA-91",
  "goal": "Implement the nph-rich-option card, a form choice with a title and a description where the whole card checks the option, and the rich look of the nph-option with a description in the nph-select and nph-combobox list, in the contract accepted in Figma, and write the spec.",
  "phase": "F4",
  "approved_order": 900,
  "owner": "elvys",
  "state": "ready",
  "piece": "nph-rich-option",
  "dependencies": [
    "DSA-03",
    "DSA-11",
    "DSA-17",
    "DSA-18",
    "DSA-24",
    "DSA-27",
    "DSA-28",
    "DSA-29",
    "DSA-31",
    "DSA-46"
  ],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-rich-option documentation in Figma was accepted by the design owner, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-91/figma-docs-accepted-2026-11-18.md",
      "result": "passed",
      "verified_at": "2026-11-18",
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
      "id": "D-1",
      "question": "Card states combined with hover have no drawing: hover with error, hover with focus and hover on the disabled card. Recommended: hover only adds the hover layer and never changes the outline, so hover with error keeps the error outline and adds the layer, hover with focus keeps the focus outline and the halo and adds the layer, and the disabled card takes no hover (Radix radio cards and checkbox cards, Carbon tile, Primer ActionList; no source read has a card with an error, so hover with error is a deduction). Sources: https://raw.githubusercontent.com/radix-ui/themes/main/packages/radix-ui-themes/src/components/radio-cards.css, https://raw.githubusercontent.com/radix-ui/themes/main/packages/radix-ui-themes/src/components/checkbox-cards.css, https://raw.githubusercontent.com/carbon-design-system/carbon/main/packages/styles/scss/components/tile/_tile.scss, https://raw.githubusercontent.com/primer/react/main/packages/react/src/ActionList/ActionList.module.css. Until she answers, the code follows the recommendation, which is also the outline precedence of the nph-checkbox it holds (error, then focus, then hover, then rest; disabled always wins, fichas/nph-checkbox.md). It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-11-18"
    },
    {
      "id": "D-2",
      "question": "The shortcut of the card (nph-kbd) has no rule for the key itself. Recommended: it is only a visual hint; the product binds the key, and the card sets aria-keyshortcuts only when the product tells it the key; a key with no modifier works only with the focus in the group (shadcn dropdown menu shortcut, React Aria Menu keyboard shortcuts, MDN aria-keyshortcuts; the single-key rule is a deduction). Sources: https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/v4/registry/new-york-v4/ui/dropdown-menu.tsx, https://react-aria.adobe.com/Menu, https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-keyshortcuts. Until she answers, the code draws the nph-kbd as a hint and binds no key. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-11-18"
    },
    {
      "id": "D-3",
      "question": "On the disabled rich option with marker=checkbox the opacities add up: the box is the disabled nph-checkbox (0.5) inside the disabled option (0.5), 0.25 on screen, while the disabled card keeps its control at default under the card opacity only. Recommended: unify with the card, the box at default inside the disabled option, so only the option opacity applies (shadcn dropdown checkbox item; no system read adds two reductions). Alternative: the Primer and Carbon way, no opacity on the item and disabled colors on the box and the text, which changes the accepted look. Sources: https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/v4/registry/new-york-v4/ui/dropdown-menu.tsx, https://raw.githubusercontent.com/radix-ui/themes/main/packages/radix-ui-themes/src/components/checkbox-cards.css, https://raw.githubusercontent.com/primer/react/main/packages/react/src/ActionList/ActionList.module.css, https://raw.githubusercontent.com/carbon-design-system/carbon/main/packages/styles/scss/components/tile/_tile.scss, https://raw.githubusercontent.com/material-components/material-web/main/checkbox/internal/_checkbox.scss. Until she answers, the code follows the accepted Figma: the disabled box inside the option at 0.5. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-11-18"
    }
  ],
  "evidence": [
    "docs/operacao/evidencias/DSA-91/figma-docs-accepted-2026-11-18.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, component code and specs belong to the code owner; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-17.md and 2026-11-18.md, nph-rich-option: adjustment rounds with the corrections of the design owner (soft outline, no brand border on the checked card, hover layer at 50 percent, selected option with no background)",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-18.md, nph-rich-option: green light (visual acceptance) and the 17 approval items answered by the design owner in three rounds, all as recommended: documentation accepted, core/opacity/50, the rich option as an extension of the nph-select option with select/option-* tokens, description in 12 Regular, a 2 px keyboard ring on the active option, selected option with no background, radius 4, disabled option skipped, descriptions of four semantics, a task of its own for the plain select option and a foundation task for the dark error halo"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=6935-11785",
    "date": "2026-11-18",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-rich-option documentation frame (6935:11785, page 4128:26259) was accepted as the API and behavior specification of the nph-rich-option card and of the rich option of the nph-select and nph-combobox list, with the visual acceptance of the root (6910:6824). COMPONENT_SET nph-rich-option (6910:6828), 36 variants; COMPONENT_SET of the rich option (6910:7093), 40 variants. The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": { "branch": null, "commit": null, "pr": null },
  "context": null,
  "updated_at": "2026-11-18"
}
```

# DSA-91 — nph-rich-option, a choice with a title and a description

## Goal
Two pieces, in the contract accepted in Figma:

- The **card** `nph-rich-option` in `src/components/nph-rich-option/`, with CSS, tests, stories and the spec `fichas/nph-rich-option.md`: a form choice where the whole card checks the option, with a checkbox, radio or switch at its start, an optional icon, a title, an optional second line and an optional shortcut.
- The **rich option**: the rich look of the existing `nph-option` (`src/components/nph-option/`), with a description below the label, in the `nph-select` and `nph-combobox` list. It has no tag of its own (item 7). Its spec goes in `fichas/nph-option.md`, and `fichas/nph-rich-option.md` points to it.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate: `docs/operacao/evidencias/DSA-91/figma-docs-accepted-2026-11-18.md`. It carries the Figma documentation converted to text, with the 39 tokens, the anatomy part by part (with the token of each layer), the measured contrast, the default behavior, the combined states, the inherited decisions, the icon and image rules, the limits and the 17 decisions answered. There is no need to open Figma.

## Specification to follow closely

### Card
- **Parts and tokens**: as the anatomy of the evidence. Root: padding `rich-option/padding`, gap `rich-option/gap`, corner `rich-option/radius`, background `rich-option/background`, outline `rich-option/border-width` inside in `rich-option/border`, width `layout/rich-option-width`. Parts left to right, all aligned to the top: control, icon, texts, shortcut.
- **Control**: an `nph-checkbox`, `nph-radio` or `nph-switch` (default size), with no label of its own, aligned to the first line of the title. Figma draws it as a visual indicator of the card state. The title is the name and the second line the description (`aria-labelledby`, `aria-describedby`).
- **Icon**: optional, off by default; `nph-icon` `light` in a `rich-option/icon-size` box, in `rich-option/foreground`.
- **Texts**: title `text/label-md` in `rich-option/foreground`, it wraps; second line, optional and on by default, `text/caption` in `rich-option/description-foreground`, gap `rich-option/text-gap`.
- **Shortcut**: optional, off by default; `nph-kbd` at the end. Never with the switch.
- **Checked**: only the control changes. The outline stays `rich-option/border` (items 3 and 4); there is no checked border token.
- **Hover**: a layer under the content (for example `::before`), corner `rich-option/radius`, background `rich-option/background-hover` at the layer opacity `rich-option/background-hover-opacity` (0.5). The layer takes the opacity, never the whole card. The control shows its hover where the code can (open point below).
- **Focus**: the outline turns `rich-option/focus-border`, with a halo outside the card: `rich-option/focus-ring-width` in `rich-option/focus-halo`, corner `rich-option/focus-radius`. The control inside takes no ring of its own. As in the controls it holds, the focus shows only for keyboard users, not on a pointer click (`fichas/nph-checkbox.md`, "Feedback and focus"); the token description says the same ("with the keyboard focus").
- **Error**: the outline turns `rich-option/border-error`; the control stays at default. Error with focus: the same outline, with the halo in `rich-option/focus-halo-error`. The written message belongs to the `nph-field` of the group.
- **Disabled**: the whole card at `rich-option/disabled-opacity`, `aria-disabled`, no click, out of the Tab order and of the arrow keys, as the disabled `nph-checkbox`, `nph-radio` and `nph-switch` (the card follows the control it holds). Checked + disabled keeps the checked control; error + disabled shows only the disabled look (T11).
- **Group**: cards stack with `space/stack`, one control type per group; the label, the help and the error of the group come from the `nph-field` (DSA-28).

### Rich option (`nph-option` with the rich look)
- **What exists**: `nph-option` already has the label, `secondary`, `start` (`icon`, `avatar`, `dot`), `icon`, `src`, `status`, `marker` (`check` or `checkbox`) and `disabled`. This task adds the description and the rich look.
- **Parts and tokens**: root padding `select/option-padding`, gap `select/option-gap`, corner `select/option-radius`, the list width; parts centered on the vertical axis: box (with `marker=checkbox`), start, texts, check (with `marker=check`). Start icon in `select/option-icon-size`; avatar `nph-avatar` `sm`; dot `select/option-dot-size` centered in a `select/option-icon-size` box. Label line: label `text/label-md`, cut with an ellipsis (DSA-29 D3), then the secondary text, gap `select/option-label-gap`. Description below, `text/caption` (item 8), it wraps, gap `select/option-text-gap`. Check `nph-icon check` `light` in `select/option-marker-size`, color `select/option-marker`.
- **Colors**: label, start icon and dot `select/option-foreground`, in hover and active `select/option-foreground-hover`; secondary text `select/option-secondary-foreground`; description `select/option-description-foreground`. On the disabled option the secondary text and the description also take `select/option-foreground`, under the opacity of the whole option. A dot with no `status` follows the label color; a dot with a `status` keeps the colors of the nph-option D6.
- **Hover and active**: a layer under the content, corner `select/option-radius`, background `select/option-background-hover` at the layer opacity `select/option-background-hover-opacity` (0.5) (DSA-29 D5, softer than the plain option).
- **Keyboard ring** (item 9): only on the option active by the keyboard, a 2 px ring drawn inside the option, `select/option-focus-border`, thickness `select/option-focus-border-width`, corner `select/option-focus-border-radius`. The pointer hover has no ring. The layer alone measures 1.08:1 and 1.13:1; the ring is what meets 3:1 (3.68:1 light with the code value of `focus/border`, 7.88:1 dark; see the note on `focus/border` in the evidence).
- **Selected**: no background (a declared deviation from DSA-29 D8). With `marker=check`, the check; with `marker=checkbox`, the checked box (as P96 already does). Selected in hover or active takes the same layer, the ring when active by the keyboard, and keeps the check or the box; its label stays `select/option-foreground`, as the Figma composition (the same value as `select/option-foreground-hover`).
- **Disabled**: the whole option at `select/option-disabled-opacity`, `aria-disabled`; selected + disabled keeps only the check or the checked box, no background (a declared deviation from DSA-29 D-3). The list skips the disabled option (DSA-29, item 12).
- **Accessibility**: role `option` with the label as the name; the description is announced as the description of the option. Start icon, avatar and dot are decorative.

### Both
- **Keyboard and roles**: the default behavior table of the evidence. Card: the APG of the control it holds (radio group with one Tab stop and arrows that wrap; box and switch one Tab stop each; Enter does not check). Rich option: the listbox of the select and the combobox, focus on the field, `aria-activedescendant`.
- **Motion**: none of their own. The list motion stays as DSA-29 D2.
- **Icons**: `nph-icon` `light`; the weight never swaps. Decorative.
- **Images**: none of their own; the photo comes only through the `nph-avatar` (DSA-24).

## Open points for the code
- Three decisions are open with the design owner (`pending_decisions`, D-1 to D-3): card states combined with hover, the card shortcut key and the box opacity on the disabled rich option. The code follows the interim of each; none blocks the pull request.
- Event, aria, slot, property and console warning, following the APG and the Custom Elements Manifest.
- **Card API**: how the card gets its control type, checked state, name and value for the form, title, second line, icon and shortcut (properties, attributes or slots), and how a group of radio cards forms one group (as `nph-radio` does by `name`). The spec names them.
- **Who holds the role and the focus on the card**: Figma draws the control as a visual indicator and the focus around the whole card, with no ring on the control. One path: the card holds the role, the state and the focus, and the control is `inert` and hidden from the screen reader, as the box of the `nph-option` (P92); the other: the real control inside holds the focus and the card draws the focus with `:focus-within`, which needs a way to hide the ring of the control. The look does not change. The spec names the path.
- **Control hover on card hover (item 15)**: Figma draws the control in hover on card hover. In code the box and the track do not take their own hover from outside (DSA-45 D-3): a known limit until those pieces get an API. If the card draws the control as a visual indicator, the spec says whether it can pass the hover.
- **Card error**: how the card learns it is invalid (its own attribute or the `nph-field` of the group). The spec names it.
- **Card width**: `layout/rich-option-width` (320); on a narrow screen the group stacks in one column. Whether it is a fixed or a maximum width that shrinks with the container: the spec names it.
- **What turns the rich look on**: the rich option is not the option with a description. The Figma example "Assigning people" shows a rich option with its description off, in the same list. An attribute on the option or on the list turns the rich look on; the spec names it.
- **Keyboard or pointer**: the list must tell the option that the active option came from the keyboard, so only that option draws the ring. How it does it: the spec names it.
- **Description of the option**: how the description reaches the screen reader while the focus stays on the field (`aria-describedby` across the shadow root or another way). The spec names it.
- **Two looks in one list**: until the select task (item 10), a list may hold rich options and plain options: the combobox "create" row is a plain option (DSA-46 D-1). The plain option keeps today's look (full `color/accent`, `color/primary-surface` when selected with `marker=check`, no ring); the rich option follows this task. This difference was accepted by the design owner.
- The translation strings of any hidden text the spec adds: their keys and where they sit. The spec names them.

## Why it is ready
The 38 tokens (`rich-option/*` and `select/option-*`) and `core/opacity/50` came with this task and are on `v/5.0.0`: 33 aliases of semantics, 2 on the new primitive `core/opacity/50` and 3 straight to the core by decision (`select/option-padding` and `select/option-dot-size` on `core/space/200`, `select/option-focus-border-width` on `core/focus-width/sm`; the evidence says why for each). Four semantics gained a new description, with no value change. Every piece it uses is done: `nph-icon` (DSA-03), `nph-kbd` (DSA-11), `nph-checkbox` (DSA-17), `nph-radio` (DSA-18), `nph-avatar` (DSA-24), `nph-switch` (DSA-27), `nph-field` (DSA-28), `nph-select` and `nph-option` (DSA-29), `nph-multi-combobox` and the box marker (DSA-31), `nph-combobox` (DSA-46).

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS, tests, stories and spec pass the proof commands in `docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## What this task does not do
The code does not create a token or change a token value. It does not change Figma. It does not change the look of the plain `nph-select` and `nph-combobox` option (the selected background with `marker=check`, full hover, no ring, radius): that is a task of its own of the select, after its Figma (items 9, 10 and 11). It does not give `focus/halo-error` a dark value: that is a foundation task (item 13). It does not put a shortcut on the option: the shortcuts stay in the combobox footer (DSA-46 D-2).

## Sources
- Figma `DS-IA-NEPHOS 5.0`, page `4128:26259`, documentation frame `6935:11785`, root `6910:6824`, appendix `6935:12295` and the evidence of the `figma-docs-accepted` gate
- Component sets: nph-rich-option card `6910:6828`; rich option `6910:7093`; plain nph-select option `1357:136`
- WAI-ARIA APG, radio group: https://www.w3.org/WAI/ARIA/apg/patterns/radio/
- WAI-ARIA APG, checkbox: https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/
- WAI-ARIA APG, switch: https://www.w3.org/WAI/ARIA/apg/patterns/switch/
- WAI-ARIA APG, listbox: https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
- WAI-ARIA APG, combobox: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
- WAI-ARIA APG, focusability of disabled controls: https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#focusabilityofdisabledcontrols
- WCAG 2.2, non-text contrast: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- Custom Elements Manifest: https://github.com/webcomponents/custom-elements-manifest
- `design.md` — the tokens named in the evidence
- `fichas/nph-option.md`, `fichas/nph-select.md`, `fichas/nph-checkbox.md`, `fichas/nph-radio.md`, `fichas/nph-switch.md`, `fichas/nph-kbd.md`, `fichas/nph-avatar.md`, `fichas/nph-icon.md`

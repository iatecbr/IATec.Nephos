```json
{
  "id": "DSA-83",
  "goal": "Implement the nph-menubar, a bar of top items that each open an nph-dropdown-menu panel, in the contract accepted in Figma; move the focus border of the nph-dropdown-menu item to focus/border and use dropdown/submenu-offset in the nph-context-menu; and write the spec.",
  "phase": "F4",
  "approved_order": 820,
  "owner": "elvys",
  "state": "done",
  "piece": "nph-menubar",
  "dependencies": [
    "DSA-03",
    "DSA-13",
    "DSA-45",
    "DSA-69"
  ],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-menubar documentation in Figma was accepted by the design owner, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-83/figma-docs-accepted-2026-11-16.md",
      "result": "passed",
      "verified_at": "2026-11-16",
      "verified_by": "indiane"
    },
    {
      "id": "review-and-merge",
      "description": "Component, CSS, tests, stories and spec pass the proof commands and are merged into v/5.0.0, with the focus border of the nph-dropdown-menu item in focus/border and dropdown/submenu-offset in the nph-context-menu.",
      "command": "git merge-base --is-ancestor bc55cec201975a1891bd1b7e51d96ba60eb60db8 origin/v/5.0.0",
      "evidence": "docs/operacao/evidencias/DSA-83/review-and-merge-2026-11-17.md",
      "result": "passed",
      "verified_at": "2026-11-17",
      "verified_by": "claude-code"
    }
  ],
  "blockers": [],
  "pending_decisions": [
    {
      "id": "D-1",
      "question": "A top item that is open and in keyboard focus at once is reached by the arrows, with a panel open (the focus stays on the top item, APG), and Figma draws `hover-aberto` and `foco` apart. The code composes the two accepted looks: the background and the label of the open item, with the focus border and the halo. If the combination needs its own look, she decides. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-11-16"
    },
    {
      "id": "D-2",
      "question": "The accepted contract says Enter activates the item and closes the panel, also on a checkbox and a radio, and Space on those checks without closing; it says nothing about the pointer. The code closes on a click on a common item and on a single choice and keeps the panel open on a multiple choice, as nph-dropdown-menu and nph-context-menu do. If the click should follow the keys, she decides. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-11-16"
    },
    {
      "id": "D-3",
      "question": "The contract says that by click the panel opens with no item highlighted. The code opens it with the first item focused and the focus ring not shown, as nph-dropdown-menu and nph-context-menu do (P92, P113), so the arrows go on from the first item. If the panel should open with no focused item, she decides. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-11-16"
    },
    {
      "id": "D-4",
      "question": "The contract calls the panel an instance of nph-dropdown-menu. In code the panel is drawn by the nph-menubar itself, with the same dropdown tokens and the same look, because the unmodified nph-dropdown-menu cannot open a second panel beside an item, closes when the focus or the pointer goes to it, and has other differences from the keyboard contract (P126, which follows P113 for the nph-context-menu). If the panel must be a real instance of the nph-dropdown-menu, that menu changes first and it is her call. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-11-16"
    }
  ],
  "evidence": [
    "docs/operacao/evidencias/DSA-83/figma-docs-accepted-2026-11-16.md",
    "docs/operacao/evidencias/DSA-83/review-and-merge-2026-11-17.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, component code and specs belong to the code owner; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-14.md, nph-menubar: post-goal round with the corrections of the design owner (top item open and in hover on the primary palette; the panel is the approved nph-dropdown-menu)",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-16.md, nph-menubar: green light (visual acceptance), documentation accepted, and the 8 approval items answered as recommended: top item hover pair, focus/border on the nph-dropdown-menu item, solid submenu arrow in focus in Figma, dropdown/submenu-offset, narrow screen button, 4 px from the window edge in code, and the design rule for bar triggers"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=6432-8686",
    "date": "2026-11-16",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-menubar documentation frame (6432:8686, page 1626:15) was accepted as the API and behavior specification of nph-menubar, with the visual acceptance of the root (6410:7413). COMPONENT_SET nph-menubar (6410:7769), 2 variants, and COMPONENT_SET nph-menubar top item (6402:4299), 4 variants. The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": { "branch": "feat/dsa-83-menubar", "commit": "bc55cec201975a1891bd1b7e51d96ba60eb60db8", "pr": 178 },
  "context": null,
  "updated_at": "2026-11-17"
}
```

# DSA-83 — nph-menubar, menu bar

## Goal
The `nph-menubar` in `src/components/nph-menubar/`, with CSS, tests, stories and the spec `fichas/nph-menubar.md`, in the contract accepted in Figma: a row of top items (`"Arquivo"`, `"Editar"`, `"Exibir"`, `"Ajuda"`) in the header of a desktop application. Each top item opens a panel, which is an `nph-dropdown-menu`, with the commands of that menu. It follows the WAI-ARIA APG menubar pattern. In the same task, two changes in approved pieces, both decided by the design owner: the focus border of the `nph-dropdown-menu` item and the submenu gap token.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate: `docs/operacao/evidencias/DSA-83/figma-docs-accepted-2026-11-16.md`. It carries the Figma documentation converted to text, with the 9 tokens, the anatomy part by part (with the text style and the token of each layer), the default behavior, the combined states, the inherited decisions, the icon rules and the decisions answered. There is no need to open Figma.

## Specification to follow closely
- **Parts**: bar (no background, no border; `menubar/bar-gap` between top items); top item (`menubar/trigger-height`, `menubar/trigger-padding-x` on each side, the width hugs the label, `menubar/trigger-radius`, label in `text/label-md`); panel (an `nph-dropdown-menu` instance, `menubar/panel-offset` below the bar, aligned with the start of the open top item, default width 280 from the piece).
- **Top item states**: default (label `menubar/trigger-foreground`, no background); hover and open share one look (background `menubar/trigger-background-hover`, label `menubar/trigger-foreground-hover`); focus (border `focus/border` in `border/width` and halo `focus/halo`, no background); disabled (`state/disabled-opacity` on the whole item).
- **Roles and keys**: the APG menubar pattern, with the lines where the Radix Menubar differs adjusted to the APG (Tab leaves the bar; arrows wrap in the panel; a disabled item receives focus and does not run; Space checks without closing; Esc closes one level at a time). The full table is in the evidence, "Default behavior".
- **Submenu**: an item with the `submenu` property opens a second `nph-dropdown-menu` beside the panel, one level only, at `dropdown/submenu-offset`. The nph-dropdown-menu itself does not open a nested menu (P92): the nph-menubar opens the second panel and places it, as the nph-context-menu does with its own submenu; P92 does not change. The same holds for the narrow screen button and `"Mais"`.
- **Near the window edge**: the panel flips up, shifts sideways or shrinks and scrolls; the collision padding to the window edge is 4 (`core/space/100`), a code setting with no token (decided).
- **Narrow screen**: the application swaps the bar for a button with the `bars` icon (the `nph-button` without text) that opens one `nph-dropdown-menu` with the menus of the bar as submenus; the items of a menu that already has a submenu (e.g. `"Arquivo → Recentes"`) show under a group label, so it stays in one level. This does not follow DSA-62 D-1 (collapsed rows of the `nph-navigation-menu`), only for the menubar (decided). Mobile is out of v1.
- **Overflow**: the top items that do not fit go into a last top item `"Mais"` (a menuitem with `aria-haspopup` inside the bar), which opens an `nph-dropdown-menu` with them as submenus, in one level, as in the narrow screen.

## Changes in approved pieces (decided, part of this task)
- **Focus border of the `nph-dropdown-menu` item**: from `color/primary` to `focus/border` (`nph-dropdown-menu.css`, `.item:focus-visible::before`). `color/primary` falls below 3:1 on `color/popover` in dark in 4 brands (Gerencial 1.83:1, Recursos Humanos 1.94:1, Igrejas 2.28:1, `Educação` 2.57:1); with `focus/border` the lowest of the 7 brands and 2 themes is 4.32:1 (light, Comercial). The `nph-context-menu` uses the same item, so it changes too. No local override: the change is in the item. Update the focus rows (the `token` line, the `focus:` token list and the focus and contrast text) of `fichas/nph-dropdown-menu.md` and `fichas/nph-context-menu.md` to `focus/border`, with the new contrast.
- **Submenu gap**: `dropdown/submenu-offset` (4, `core/space/100`) is the gap between the panel and the open submenu in the `nph-context-menu` and the `nph-menubar` (the two pieces that open one; decided). In Figma the 4 px are only a position; in code the `nph-context-menu` submenu sits flush at the panel edge (0, as the Radix default), and the code adds `dropdown/submenu-offset`; the submenu row of `fichas/nph-context-menu.md` ("The submenu opens to the right of the item…") then names that gap.
- **Solid submenu arrow in focus**: in Figma the arrow of the item with submenu now turns solid in focus, as the code already does (DSA-69). Nothing changes in code.

## Open points for the code
- Event, aria, slot, property and console warning, following the APG and the Custom Elements Manifest.
- How the menus and their items are given to the component (one `nph-dropdown-menu` per top item, or data), and how a chosen item is reported.
- How the overflow is measured (which top items go into `"Mais"`, and when the narrow screen button replaces the bar): the breakpoint is the application's call or a component property. Also who renders the narrow screen button and opens its submenus, the nph-menubar or the application (decision 6 says the application swaps the bar).
- Top item open and in keyboard focus at once (the arrows switch menus and focus stays on the top item, APG): not drawn in Figma (`6402:4299` draws `hover-aberto` and `foco` apart); the combined look goes to the design owner in the next approval round, before the code ships it.
- How the texts come in, already translated: the top item labels, `"Mais"` and the accessible name of the narrow screen button.

## Why it is ready
The 8 `menubar/*` tokens and `dropdown/submenu-offset` came with this task and are on `v/5.0.0`: 7 aliases of existing semantics, and `menubar/panel-offset` and `dropdown/submenu-offset` straight to `core/space/100` by decision (no semantic names the distance to a floating layer; `space/inline-tight`, also 4, is the space inside a unit), as `navigation-menu/panel-offset` and `popover/offset`. No new value entered the core. Every piece it uses is done: `nph-icon` (DSA-03), `nph-button` (DSA-13), `nph-dropdown-menu` (DSA-45), `nph-context-menu` (DSA-69).

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS, tests, stories and spec pass the proof commands in `docs/operacao/component-handoff.md` and are merged into `v/5.0.0`, with the focus border of the `nph-dropdown-menu` item and the submenu gap of the `nph-context-menu`.

## What this task does not do
The code does not create a token or change a token value. It does not change Figma. It does not add a second submenu level, a compact size, a vertical bar or a mobile layout in v1. It does not change the gray open trigger of the `nph-dropdown-menu` (DSA-67 D-2) nor the ellipsis of the `nph-breadcrumb`.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, page `1626:15`, documentation frame `6432:8686`, root `6410:7413` and the evidence of the `figma-docs-accepted` gate
- Component sets: nph-menubar `6410:7769`; nph-menubar top item `6402:4299`; item of the nph-dropdown-menu `1365:57`
- WAI-ARIA APG, menubar: https://www.w3.org/WAI/ARIA/apg/patterns/menubar/
- WAI-ARIA APG, menubar editor example: https://www.w3.org/WAI/ARIA/apg/patterns/menubar/examples/menubar-editor/
- WAI-ARIA APG, focusability of disabled controls: https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#focusabilityofdisabledcontrols
- Radix Menubar: https://www.radix-ui.com/primitives/docs/components/menubar
- Floating UI: https://floating-ui.com/docs/flip ; https://floating-ui.com/docs/shift ; https://floating-ui.com/docs/size
- WCAG 2.2, non-text contrast: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- Custom Elements Manifest: https://github.com/webcomponents/custom-elements-manifest
- `design.md` — the tokens named in the evidence
- `fichas/nph-dropdown-menu.md`, `fichas/nph-context-menu.md`, `fichas/nph-navigation-menu.md`

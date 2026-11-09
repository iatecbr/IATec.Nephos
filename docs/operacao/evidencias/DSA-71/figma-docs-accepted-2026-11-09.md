```json
{
  "task": "DSA-71",
  "gate": "figma-docs-accepted",
  "date": "2026-11-09",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=3483-11200",
    "date": "2026-11-09",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "Indiane accepted the nph-tabs documentation frame (3483:11200, page 1626:14), with the Figma UX QA and the textual audit approved, and approved the 9 points of the approval page: documentation acceptance; label and line of the active tab on color/primary-text; counter of the active tab on theme/brand-200 in light and theme/brand-700 in dark, straight by decision; indicator width on core/focus-width/sm, straight by decision; a soft border on the active outline tab button (theme/brand-200 in light, core/alpha/white-15 in dark), straight by decision; the known limit of the solid tab button background in dark; the label on the text/label-md style, with no token of its own; the accessible name of the counter; the swap of the old instances before the cleanup. A finished component enters the first version. COMPONENT_SET nph-tabs (3472:9192), the list, 16 variants; the tab set (3472:8748), 30 variants; the counter set (3472:8747), 3 variants."
  }
}
```

# DSA-71 — `figma-docs-accepted`

The documentation of `nph-tabs` (frame `3483:11200`) was accepted in Figma on 2026-11-09, in the file `DS-IA-NEPHOS 5.0`, with the Figma UX QA and the textual audit approved. The tabs enter the first version of Nephos. Fifty `tabs/*` tokens came with this task and are on `v/5.0.0`, plus `core/alpha/white-15` (white at 15%), which Figma had and the code did not.

Three `tabs/*` tokens do not point to a semantic token, by decision:

- `tabs/indicator-width` points to `core/focus-width/sm` (2), as `navigation-menu/current-indicator-width` and `data-table/row-selected-indicator-width` do: no semantic token resolves to 2;
- `tabs/counter-background-active` points to `theme/brand-200` in light and `theme/brand-700` in dark, as `chip/counter-background` does: no semantic token has this pair;
- `tabs/button-outline-border-color-active` points to `theme/brand-200` in light and `core/alpha/white-15` in dark, a soft border: `color/border` and `color/border-subtle` are neutral in light, with no brand color. The border is decorative (below 3:1); the background and the label mark the active tab.

The label and the line of the active tab use `color/primary-text` (`theme/brand-700` in light, `theme/brand-text-dark` in dark), which meets 4.5:1 in the seven brands in both modes. No new semantic token. `core/alpha/white-15` is the only primitive added to the code, and it already existed in Figma.

The `use` of fourteen semantic tokens in `design.md` now names nph-tabs where the accepted Figma uses them: `color/muted`, `space/inline-tight`, `space/control-padding`, `radius/inner`, `color/muted-foreground`, `color/primary-text`, `color/border`, `focus/border`, `color/primary`, `color/primary-surface`, `color/secondary-light`, `color/secondary-foreground`, `color/background` and `control/height-compact`.

There is no command output. The acceptance is a human observation, recorded in the json block above with the frame URL and the component sets.

The rest of this file is the contract converted to text, so that whoever codes does not need to open Figma. Figma property and value names stay as they are in Figma (`estilo`, `segmentado`, `sublinhado`, `botão solid`, `botão light`, `botão outline`, `state`, `inativa`, `ativa`, `ativa-foco`, `rótulo`, `ícone início`, `contador`, `tag`, `abas`, `rolagem`, `tom`, `repouso`, `repouso-trilho`, `ativo`); the code API is in English. Figma sample texts are translated here.

## Purpose

A list of tabs that switches the content of a section of the same page, without leaving it. It varies by style (segmented, underline, solid, light or outline tab button), by state, and by label, start icon, counter and tag on the tab; the list varies by number of tabs and scrolling.

Use it to switch panels of the same context, such as the steps of a request or the parts of a record. It does not replace page navigation (nph-sidebar, nph-breadcrumb), steps in sequence (nph-stepper) or switching the view of the same list (nph-toggle-group).

## Tokens

| Token | Points to | Part |
|---|---|---|
| `tabs/list-background` | `color/muted` | Rail of the segmented style |
| `tabs/list-height` | `control/height-default` | Height of the segmented rail and of the tab button list |
| `tabs/list-padding` | `space/inline-tight` | Inner padding of the segmented rail |
| `tabs/list-gap` | `space/inline-tight` | Gap between tabs in the segmented and tab button styles; the underline has no gap |
| `tabs/list-radius` | `radius/control` | Corners of the segmented rail |
| `tabs/item-height` | `control/height-compact` | Height of the segmented tab, inside the rail |
| `tabs/underline-item-height` | `control/height-default` | Height of the underline tab |
| `tabs/item-padding-x` | `space/control-padding` | Side padding of the tab, every style |
| `tabs/item-padding-y` | `space/inline-tight` | Top and bottom padding of the tab, every style |
| `tabs/item-gap` | `space/inline` | Gap between icon, label, counter and tag |
| `tabs/item-radius` | `radius/inner` | Corners of the segmented tab |
| `tabs/item-foreground` | `color/muted-foreground` | Label of the inactive tab, every style |
| `tabs/item-foreground-hover` | `color/foreground` | Label in hover, segmented and underline |
| `tabs/item-foreground-active` | `color/primary-text` | Label of the active tab, segmented and underline |
| `tabs/item-background-active` | `color/background` | Card of the active segmented tab, with the `elevation/subtle` effect style |
| `tabs/item-disabled-opacity` | `state/disabled-opacity` | Opacity of the disabled tab, on the whole tab |
| `tabs/underline-border-color` | `color/border` | Base line of the underline list, under every tab |
| `tabs/underline-border-width` | `border/width` | Thickness of the base line |
| `tabs/indicator-color` | `color/primary-text` | Line of the active underline tab |
| `tabs/indicator-width` | `core/focus-width/sm` (2) | Thickness of the active line and of the hover line |
| `tabs/indicator-hover-color` | `color/border` | Line of the underline tab in hover |
| `tabs/focus-border-color` | `focus/border` | Focus border, every style |
| `tabs/focus-border-width` | `border/width` | Thickness of the focus border |
| `tabs/focus-ring-color` | `focus/halo` | Focus halo outside the border |
| `tabs/focus-ring-width` | `focus/ring-width` | Thickness of the halo |
| `tabs/focus-radius` | `focus/radius-inner-with-border` | Halo corners, segmented and underline |
| `tabs/focus-border-radius` | `focus/border-radius-inner` | Focus border corners, segmented and underline |
| `tabs/indicator-duration` | `motion/state-duration` | Change of the active tab and hover |
| `tabs/scroll-gap` | `space/inline-tight` | Gap between the scroll arrows and the tabs |
| `tabs/button-height` | `control/height-default` | Height of the tab in the tab button styles |
| `tabs/button-radius` | `radius/control` | Corners of the tab in the tab button styles |
| `tabs/button-background-hover` | `color/accent` | Background of the inactive tab in hover, tab button styles |
| `tabs/button-foreground-hover` | `color/foreground` | Label in hover, tab button styles |
| `tabs/button-solid-background-active` | `color/primary` | Background of the active solid tab |
| `tabs/button-solid-foreground-active` | `color/primary-foreground` | Label of the active solid tab |
| `tabs/button-light-background-active` | `color/primary-surface` | Background of the active light tab |
| `tabs/button-light-foreground-active` | `color/primary-on-surface` | Label of the active light tab |
| `tabs/button-outline-background-active` | `color/primary-surface` | Background of the active outline tab |
| `tabs/button-outline-foreground-active` | `color/primary-on-surface` | Label of the active outline tab |
| `tabs/button-outline-border-color-active` | `theme/brand-200` light, `core/alpha/white-15` dark | Border of the active outline tab |
| `tabs/button-outline-border-width` | `border/width` | Thickness of that border |
| `tabs/button-focus-radius` | `focus/radius-control-with-border` | Halo corners, tab button styles |
| `tabs/button-focus-border-radius` | `focus/border-radius-control` | Focus border corners, tab button styles |
| `tabs/counter-background` | `color/secondary-light` | Counter of an inactive tab, outside the rail |
| `tabs/counter-background-rail` | `color/background` | Counter of an inactive tab, inside the segmented rail |
| `tabs/counter-background-active` | `theme/brand-200` light, `theme/brand-700` dark | Counter of the active tab |
| `tabs/counter-foreground` | `color/secondary-foreground` | Number of the counter |
| `tabs/counter-padding-x` | `space/inline` | Side padding of the counter |
| `tabs/counter-padding-y` | `space/inline-tight` | Top and bottom padding of the counter |
| `tabs/counter-radius` | `radius/full` | Corners of the counter |

The label uses the `text/label-md` text style directly, with no `tabs/*` token (it becomes the `--nph-text-label-md-*` group, as in nph-badge); the counter number uses `text/label-sm`. The icon is nph-icon at `icon/size-sm`. The tag uses the tokens of nph-badge; the scroll arrows and the tooltip use the tokens of nph-icon-button and nph-tooltip. Widths hug the content, with no token.

## Anatomy

1. **List**: the `color/muted` rail in the segmented style; the `color/border` base line in the underline style; in the tab button styles, only the gap between tabs. It groups the tabs.
2. **Tab**: the clickable control. Each tab shows one panel.
3. **Start icon**: optional. nph-icon at `icon/size-sm`, before the label, on every tab or on none. Light at rest and in focus; solid in hover and when active.
4. **Label**: `text/label-md`, one line. A cut label shows the whole text in nph-tooltip.
5. **Counter**: optional. A piece of nph-tabs itself (`nph-tabs / contador`), after the label, with the number in `text/label-sm`. Background `color/background` inside the segmented rail, `color/secondary-light` outside it and `tabs/counter-background-active` on the active tab.
6. **Tag**: optional. nph-badge primary light, after the counter, with one word, such as "New". On the active light and outline tab button, it turns primary solid.
7. **Indicator**: segmented: a `color/background` card with `elevation/subtle`. Underline: the active line under the tab, in `color/primary-text`, at `tabs/indicator-width`. Tab button: `color/primary` background in solid and `color/primary-surface` in light and outline; in outline, with a soft border at `border/width`.
8. **Scroll arrows**: underline only, when the tabs do not fit: nph-icon-button at both ends.
9. **Panel**: the content of the active tab. It stays outside the piece, with the consumer.

The order inside the tab is fixed: icon, label, counter, tag.

## Properties

| Field | Rule |
|---|---|
| `estilo` (style) | `segmentado` (segmented), `sublinhado` (underline), `botão solid`, `botão light` or `botão outline`. Segmented is the default, for views inside a card or panel; underline for sections and long lists; tab button for short bars that need more weight. |
| `state` | `inativa`, `hover`, `foco`, `ativa`, `ativa-foco` and `disabled`. Only one active tab per list, in the primary palette. In the tab button styles, the inactive tab has no background and no border. |
| `rótulo` (label) | Short text, one or two words, on one line. |
| `ícone início` (start icon) | Turns on the icon before the label, on every tab or on none. Its style follows the state: light at rest and in focus, solid in hover and when active. |
| `contador` (counter) | Turns on the counter after the label, with the number. Its background follows the style and the state. |
| `tag` | Turns on the tag after the counter, with one short word, such as "New". |
| `abas` (tabs) | In the list: how many tabs the example shows. In use, the list takes the tabs it needs. |
| `rolagem` (scrolling) | Underline only: arrows at both ends when the tabs do not fit. |
| full width | Not a property: the instance fills its container and the tabs share the width. |
| size | Not a property: one size. |
| activation | Not a visual property: see Behavior. |

Counter (`nph-tabs / contador`): `tom` = `repouso` (inactive, outside the rail), `repouso-trilho` (inactive, inside the segmented rail), `ativo` (active).

## Behavior

Base: WAI-ARIA APG, Tabs pattern.

| Input | What it does |
|---|---|
| Tab | Enters the list on the active tab (the list is a single Tab stop); the next Tab goes to the panel. A panel with no focusable item takes the focus. |
| Left and right arrows | Move the focus to the previous and the next tab, wrapping from the last to the first and from the first to the last. A disabled tab is skipped. |
| Home and End | Focus on the first and the last enabled tab. |
| Activation | Automatic by default: a tab becomes active when it receives the focus from the arrows. When the panel is slow to load, manual activation: the arrows move the focus and only Enter or Space activate (APG). The choice is a property of the code. |
| Click or tap | Activates the tab and puts the focus on it. A click on the active tab does nothing. A disabled tab neither activates nor takes the focus. |
| Pointer and focus | Hover only paints; it does not move the focus or activate. |
| Esc and click outside | No action: the list opens no layer. Focus on open and close does not apply; after a tab change, the focus stays on the tab. |
| Window edge | Only the underline style scrolls, with the scroll arrows (nph-icon-button) at both ends when the tabs do not fit; the list does not wrap. The scroll arrows stay out of the Tab order and out of the screen reader, because the arrow keys already scroll the list; the tab that receives the focus scrolls into view, as in MUI Tabs. At an end, whether the arrow hides or is disabled is decided by the code. In the segmented and tab button styles, the usage rule asks for few tabs; overflow there is decided by the code. |
| Motion | The change of the active tab and the hover run on `tabs/indicator-duration`; with reduced motion, nothing moves (as DSA-62 D-3). |

Combined states (rule T11 of the design system): active + disabled keeps the active look under `tabs/item-disabled-opacity`; active + hover keeps the active look; active + focus is the `ativa-foco` variant.

Inherited decisions: a cut label shows the whole text in nph-tooltip, on hover and on focus, after `motion/hover-delay`, and a click cancels the wait (follows DSA-48 D1 and D2, DSA-57 D-3); the fixed order icon, label, counter, tag (follows DSA-57 D-5).

Icon and image: the icon is nph-icon at `icon/size-sm`, light at rest and in focus, solid in hover and when active; it comes from nph-icon itself, with no exported file. The component has no image.

Event, aria, slot, property and console warning stay with the code (Elvys), following the APG and the Custom Elements Manifest.

## Accessibility

| Criterion | Rule |
|---|---|
| contrast | The inactive label on `color/muted-foreground` meets WCAG AA (4.5:1) in light and dark, over the rail and over the background. The label and the line of the active tab use `color/primary-text`, which meets it in every brand, in light and dark. In the tab button, `color/primary-foreground` on `color/primary` and `color/primary-on-surface` on `color/primary-surface` meet it. In dark, the background of the active solid tab stays below 3:1 against the page in some brands (Gerencial 2.71, Recursos Humanos 2.88): an accepted limit, because the label (and the solid icon, when there is one) marks the active tab. The counter number meets AA at rest, in the rail and when active. The counter pill is decorative: over the tab button hover it almost disappears, and the number stays readable. |
| visible focus | The focused tab shows the `focus/border` border with the `focus/halo` halo outside, the same focus as nph-button, in every style. |
| color is not the only sign | The active tab has a card (segmented), a line (underline) or a background (tab button), and the icon turns solid, besides the text color. |
| target size | The whole tab is the target: `control/height-compact` in the segmented style and `control/height-default` in the underline and tab button styles, above 24 x 24. The arrows are nph-icon-button. |
| accessible name | The label is the name of the tab; the icon is decorative (`aria-hidden`). The counter number enters the name with hidden context text ("Pending, 12 items"), and the visible number is `aria-hidden`. |

## Usage

The tag and the properties come from the API in the repository; the code block enters when the component exists in code. Import: `import '@iatec/nephos/nph-tabs';`

## Relations and context

- Combines with nph-badge (tag), nph-icon (icon), nph-icon-button (arrows) and nph-tooltip (cut label). The counter is a piece of nph-tabs itself. The tab controls color, state and focus of the counter and the tag.
- Space: between tabs, `space/inline-tight` in the segmented and tab button styles and none in the underline; between icon, label, counter and tag, `space/inline`.
- Inside a card or panel, the list stays on top and the panel of the active tab right below.

## When to use

- To switch between parts of the same subject, on the same page, when the person sees one part at a time.
- Segmented: few tabs with short labels, inside a card or panel. Underline: top of a page or section, and when there are many tabs. Tab button: a short bar that needs more weight, on top of a panel.
- Turn on the counter when each tab counts items; the icon, when labels look alike; the tag, to mark a new tab.

## Required examples

Use cases, with instances only, in light and dark:

- Requests by step, with icon, counter and tag.
- Request detail inside a panel.
- Arrows at both ends, when the tabs do not fit.

## Do

- Use short, direct labels: the person finds the tab without reading everything.
- Always keep one tab active: the panel is never empty.
- Put an icon on every tab or on none: the list stays aligned.
- Order the tabs by use: the most used opens first.

## Do not

- Do not use tabs to go from one page to another: use nph-sidebar or nph-breadcrumb.
- Do not use them for steps in sequence, with next and back: use nph-stepper.
- Do not use them to switch the view of the same list: use nph-toggle-group.
- Do not use the segmented style with many tabs or long labels: use the underline.
- Do not put an icon on only some tabs: on every one or on none.

## Appendix points answered

| Point | Answer |
|---|---|
| Active label and line | `color/primary-text`. Before, `color/primary` stayed below 4.5:1 in dark in four brands: `Gerencial`, `Educação`, `Igrejas` and `Recursos Humanos`. |
| Active counter | `theme/brand-200` in light, `theme/brand-700` in dark, straight by decision, as `chip/counter-background`. |
| Indicator width | `core/focus-width/sm` (2), straight by decision. |
| Active outline border | `theme/brand-200` in light, `core/alpha/white-15` in dark, straight by decision; decorative. |
| Solid tab button in dark | The background limit is accepted; the label and the solid icon mark the active tab. |
| Label token | None: the `text/label-md` style directly. |
| Counter accessible name | The number enters the name with hidden context text; the visible number is `aria-hidden`. |
| Old component sets | The old instances in the sidebar draft were swapped for the new sets before the cleanup. |

```json
{
  "id": "DSA-99",
  "goal": "Implement the nph-popconfirm, a short confirmation anchored to a trigger that asks about the action the person just requested and offers Cancel and the verb of the result, in the default, warning and destructive types, the sm and md sizes and the four sides with or without the arrow, in the contract accepted in Figma, and write the spec.",
  "phase": "F4",
  "approved_order": 980,
  "owner": "elvys",
  "state": "done",
  "piece": "nph-popconfirm",
  "dependencies": [
    "DSA-03",
    "DSA-10",
    "DSA-13",
    "DSA-67"
  ],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-popconfirm documentation in Figma was accepted by the design owner, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-99/figma-docs-accepted-2026-11-19.md",
      "result": "passed",
      "verified_at": "2026-11-19",
      "verified_by": "indiane"
    },
    {
      "id": "review-and-merge",
      "description": "Component, CSS, tests, stories and spec pass the proof commands and are merged into v/5.0.0.",
      "command": "git merge-base --is-ancestor f119d610c4cf2e8b269e1b1813cf41efc3cf37fc origin/v/5.0.0",
      "evidence": "docs/operacao/evidencias/DSA-99/review-and-merge-2026-11-26.md",
      "result": "passed",
      "verified_at": "2026-11-26",
      "verified_by": "helifiora"
    }
  ],
  "blockers": [],
  "pending_decisions": [],
  "evidence": [
    "docs/operacao/evidencias/DSA-99/figma-docs-accepted-2026-11-19.md",
    "docs/operacao/evidencias/DSA-99/review-and-merge-2026-11-26.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, component code and specs belong to the code owner; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-16.md to 2026-11-18.md, nph-popconfirm: adjustment and post-night rounds with the corrections of the design owner (soft divider, width of about 302 and 372 px, frames that cut the element, example text by type)",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-19.md, nph-popconfirm: green light (visual acceptance) and the approval items 1 to 10 answered by the design owner, all as recommended (documentation accepted, two new core widths, the destructive icon on color/destructive-on-surface, three surface descriptions, the icon box radius in radius/inset, the md padding and the icon box padding straight to the core by decision, the scope by reversibility, alertdialog with no aria-modal and the Tab kept inside, the focus after a press outside, the nph-button focus fix in a task of its own)",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-22.md (22:06), D-1, D-2 and D-3 answered by the design owner in the chat, all with the recommended option 1 of the Figma previews 7910:22887, 7910:23035 and 7923:20292 (light and dark), after market research with sources"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=7389-104",
    "date": "2026-11-19",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-popconfirm documentation (7389:104, page 4128:35277) was accepted as the API and behavior specification of the nph-popconfirm, with the visual acceptance of the root (7222:3379). Component set 7222:3568, 42 variants. The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": { "branch": "feat/dsa-99-popconfirm", "commit": "2792e20e", "pr": 192 },
  "context": null,
  "updated_at": "2026-11-26"
}
```

# DSA-99 — nph-popconfirm, a short confirmation anchored to its trigger

## Goal
The `nph-popconfirm` in `src/components/nph-popconfirm/`, with CSS, tests, stories and the spec `fichas/nph-popconfirm.md`, in the contract accepted in Figma: a short confirmation anchored to a trigger, opened by click, Enter or Space, that asks a question about the action the person just requested and offers two ways out, Cancel and the verb of the result. It serves an action of low to medium risk tied to an item of the page: one that can be undone, even with effort, or that loses little (for example, it goes to the trash). It has the types default, warning and destructive, the sizes sm (default) and md, the sides bottom (default), top, right and left, the alignments start, center (default) and end, and the arrow off (default) or on. The icon and the description turn on and off.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate: `docs/operacao/evidencias/DSA-99/figma-docs-accepted-2026-11-19.md`. It carries the Figma documentation converted to text, with the 32 tokens, the anatomy part by part (with the token and the text style of each layer), the contrast, the default behavior, the combined states, the inherited decisions, the icon rules, the limits, what the nph-popconfirm asks of other pieces and the decisions answered. There is no need to open Figma.

## Specification to follow closely
- **Parts and tokens**: as the anatomy of the evidence. Bind every value to its `popconfirm/*` token, never to the semantic it points to. The trigger, Cancel and Confirm keep the tokens of the `nph-button`; the icon keeps its glyph from the `nph-icon`.
- **Surface**: background `popconfirm/background`, outline `popconfirm/border-width` in `popconfirm/border`, corner `popconfirm/radius`, the `elevation/dropdown` shadow (none in dark). Fixed width `popconfirm/width-sm` (304) in sm and `popconfirm/width-md` (372) in md, never wider than the window minus 32 px; the height follows the content. Nothing inside it is cut (no clipping, so the focus ring of a button is whole).
- **Content**: padding `popconfirm/padding-sm` (sm) or `popconfirm/padding-md` (md) on the four sides. Inside, a row: the icon box at the start, aligned to the top, then the text block at `popconfirm/icon-gap`. Text block: the title, then the description at `popconfirm/text-gap`, aligned to the start.
- **Icon** (optional, on by default): a box with `popconfirm/icon-box-padding` on the four sides and corner `popconfirm/icon-box-radius`, background by type (`popconfirm/icon-box-background`, `popconfirm/icon-box-background-warning`, `popconfirm/icon-box-background-destructive`); inside it an `nph-icon` solid, `circle-question` in the default type and `triangle-exclamation` in warning and destructive, size `popconfirm/icon-size-sm` (sm) or `popconfirm/icon-size-md` (md), color by type (`popconfirm/icon-foreground`, `popconfirm/icon-foreground-warning`, `popconfirm/icon-foreground-destructive`). The box measures 32 px in sm and 40 px in md. Decorative.
- **Title**: always visible, the question about the action: `text/heading-sm` in sm and `text/heading-md` in md, `popconfirm/title-foreground`. It wraps.
- **Description** (optional, on by default): the consequence, `text/body-md`, `popconfirm/description-foreground`. It wraps. With no description, the title is the whole message.
- **Footer**: below the content with no gap: the divider on top, from edge to edge, 1 px (`border/width`) in `popconfirm/divider`; then the actions band, padding `popconfirm/footer-padding-sm` (sm) or `popconfirm/footer-padding-md` (md), aligned to the end and centered vertically, Cancel (`nph-button` secondary solid) then Confirm (`nph-button` primary solid in default and warning, danger solid in destructive), `popconfirm/actions-gap` apart, both size default (36 px, `control/height-default`) in both sizes. See the open point on the divider color.
- **Trigger**: it belongs to the consumer and stays outside the component, as the `nph-popover` trigger; Figma draws it as an `nph-button` secondary solid with the verb of the action (an icon-only trigger follows DSA-47 D1). Open, it takes the hover-active look and carries `aria-expanded="true"` (the `nph-button` contract for a trigger with `aria-haspopup`).
- **Position**: without the arrow, the surface sits `popconfirm/offset` from the trigger, centered on it, on the resolved side (bottom by default). With the arrow, the tip of the arrow sits `popconfirm/offset` from the trigger and the surface one arrow height further (as the `nph-popover`, DSA-67 D-1); the surface aligns to the trigger by the start, the center or the end.
- **Arrow** (off by default): `popconfirm/arrow-width` by `popconfirm/arrow-height`, fill `popconfirm/background`, outline `popconfirm/border` in `popconfirm/border-width`, pointing to the trigger on the side that touches it; at `popconfirm/arrow-inset` from the corner in start and end, centered in center. On the right and left sides the base is vertical. The arrow overlaps the surface outline by 1 px so the two outlines join. Decorative.
- **Keyboard, focus and roles**: the default behavior table of the evidence. The surface is `role="alertdialog"` with no `aria-modal`, named by the title (`aria-labelledby`) and described by the description (`aria-describedby`). On open, the focus goes to Cancel in destructive and warning, to Confirm in default. Tab and Shift+Tab move only between Cancel and Confirm while it is open. Esc, Cancel and Confirm close and give the focus back to the trigger (or, if the trigger is gone, to the next logical element; see the API open point); a press outside closes as Cancel and leaves the focus where the person pressed. While Confirm loads, see Slow confirm.
- **Slow confirm**: Confirm takes the `nph-button` loading state and the surface stays open; on success it closes; on failure it stays open (if it was not closed during the wait, D-3) and the loading leaves. A repeated press on a loading Confirm does nothing: in loading the `nph-button` carries `aria-disabled` and the click stops counting (`fichas/nph-button.md`, semantics and the `loading` state), as the Ant Design action button (https://raw.githubusercontent.com/ant-design/ant-design/master/components/_util/ActionButton.tsx). Cancel stays enabled beside it, as drawn, and during the wait Cancel, Esc, a press outside and opening another layer close the layer as they do outside the wait (D-3, answered on 2026-11-22). The component does not undo the request already sent: the consumer hears Cancel with its source and decides what to do with it.
- **Actions that do not fit** (D-2, answered on 2026-11-22): when the two buttons do not fit side by side (a long or translated label, or a narrow window), they stack in a column, Confirm on top and Cancel below, each at the full width of the actions band, with `popconfirm/actions-gap` between them; the surface keeps its width and the label is never cut. Stacked, the Tab order follows the order on screen (Confirm, then Cancel); the initial focus by type does not change, and Tab and Shift+Tab still move only between the two buttons. A single label longer than the band stays outside this task: see the open point.
- **One layer at a time**: opening another nph-popconfirm, popover or menu closes the open one, also while Confirm loads (D-3). As the `nph-popover` (`fichas/nph-popover.md`, business rules): Esc closes only the nph-popconfirm and does not reach a dialog around it, and while the surface leaves it is inert. Inside an `nph-dialog` it is not part of the contract yet, as the `nph-popover`.
- **Near the window edge**: it flips to the opposite side when it does not fit; with the arrow, the arrow keeps pointing to the trigger. A window smaller than the layer: it stays beside the trigger and the window cuts it (DSA-68 D-4, open).
- **Motion**: enters in `popconfirm/enter-duration` and leaves in `popconfirm/exit-duration`; with reduced motion, no animation.
- **Texts**: the consumer writes the title, the description and the Confirm label for each use: the question in the title, the consequence in the description, the verb of the result on Confirm. Never Yes and No.

## Open points for the code
- Event, aria, slot, property and console warning, following the APG and the Custom Elements Manifest.
- **API**: how the trigger is linked (the `nph-popover` uses `for`), and how the type, size, side, alignment, arrow, icon and description switches, title, description, Confirm label and Cancel label reach the component; how the consumer hears Confirm and Cancel (with the source: Cancel, Esc, a press outside or another layer opening) and sets Confirm loading; and, when the trigger is gone (the item was deleted), how the consumer says where the focus goes, since the component cannot know the next row or the list title (an option, an event the consumer answers, or a fallback the spec names). The spec names them.
- **`nph-popconfirm` and `nph-popover`**: the nph-popconfirm is of the same family (surface, border, shadow, position, arrow, one layer at a time), with tokens of its own. How much code it shares with the `nph-popover` is the code owner's call. The differences are in the evidence ("What the nph-popconfirm asks of other pieces"): `alertdialog` instead of a non-modal `dialog`, the Tab kept between the two buttons, the initial focus by type, no close button, buttons of 36 px, the icon box.
- **Divider color**: `fichas/nph-separator.md` fixes the separator color at `color/border` (lines 37 and 41), and its CSS has no color hook. The accepted color is `popconfirm/divider` (`color/border-subtle`), thickness `border/width`. In Figma the divider is an `nph-separator` with the line color overridden. How the nph-popconfirm paints the line stays with the code, and the spec names the path: the nph-popconfirm sets the color of the separator it holds, or it draws its own 1 px line with `border/width`, as the `nph-popover` footer divider does. The color and the thickness do not change. The same case as DSA-89 and DSA-97.
- **Easing and what moves**: there is no `popconfirm/*` easing token in Figma (Figma does not animate), and Figma does not say what moves. The `nph-popover` uses `motion/enter-easing` and `motion/exit-easing` (`fichas/nph-popover.md`, tokens, motion). The spec names the easing and what animates, as the `nph-popover`; the code does not create a token.
- **While Confirm loads**: Figma draws Confirm loading with the layer open and Cancel beside it enabled, in its default state (root `7222:3379`, the two examples of Confirm loading); the appendix says only that it closes on success and stays open on failure. Cancel stays as drawn. D-3 was answered on 2026-11-22: Cancel, Esc, a press outside and opening another layer close the layer during the wait, and the consumer hears Cancel with its source. How the component tells the consumer that a closing happened during the wait (for example, the source on the cancel event) is the code owner's call; the spec names it.
- **Title element**: the `nph-popover` renders its title as an `h2`. The nph-popconfirm title names the alertdialog; whether it is a heading or plain text is the code's call. The look does not change (`text/heading-sm`, `text/heading-md`).
- **Screen readers**: the `alertdialog` with no `aria-modal` and the Tab kept inside (item 8) follows the PrimeNG ConfirmPopup code; its reading in NVDA, JAWS and VoiceOver has no read source. The spec records what was tested.
- **Press outside on an area with no focusable element** (item 9): where the focus stays is the browser's; it has no read source. The spec records it.
- **Focus contrast of Confirm in dark** (item 10): in dark, the focus border of the primary Confirm (default and warning) is below 3:1 against the surface in the brands Gerencial (1.83:1), `Educação` (2.57:1), Igrejas (2.28:1) and Recursos Humanos (1.94:1); 4.59:1 in the default brand. A WCAG 1.4.11 (AA) failure inherited from the `nph-button`; the fix goes to the `nph-button`, with a semantic `focus/border` per brand and scheme, separate from `color/primary`, in a task of its own. The nph-button spec names three brands at this limit; the Figma reading gives four (with `Educação`). D-1 was answered on 2026-11-22: the nph-popconfirm sets the hook the nph-button already offers, `--nph-button-focus-border`, to `focus/border` on its primary Confirm (default and warning types), as the nph-sidebar close button does; the danger Confirm and Cancel keep theirs. With `focus/border` the border measures 5.53:1 to 9.82:1 in the five brands read. The nph-button task of item 10 still fixes the button itself.
- **A single label longer than the band** (D-2): stacked, the label wraps inside the button, which grows in height, as answered on 2026-11-22 (no read source does it). The `nph-button` keeps its label on one line (`white-space: nowrap`, `src/components/nph-button/nph-button.css`), so this is a change of the nph-button in a task of its own; until then that case stays outside the contract, and this task does not change the nph-button.
- **The `nph-popover` focus rule** (item 9): the design owner decided that a press outside leaves the focus where the person pressed, in the nph-popconfirm and in the popover. The popover spec already says so (`fichas/nph-popover.md`, business rules); the DSA-67 task text (line 80, "the focus returns to the trigger") still says otherwise. The DSA-67 text changes with the nph-popover code, not in this task.

## Why it is ready
The `popconfirm/*` tokens came with this task and are on `v/5.0.0`: 22 alias semantics, `popconfirm/width-sm` and `popconfirm/width-md` on two new core widths (`core/layout-width/popconfirm-sm`, 304, and `-md`, 372), and 8 point straight to the core by decision (the evidence says why). No semantic changed value; four semantic descriptions changed in Figma and in `design.md` (items 3 to 5), and the `design.md` use of every other semantic the nph-popconfirm uses now cites it. Decisions D-1, D-2 and D-3 were answered on 2026-11-22. Every piece it uses is done: `nph-icon` (DSA-03), `nph-separator` (DSA-10), `nph-button` (DSA-13), `nph-popover` (DSA-67).

## Decisions answered on 2026-11-22
Indiane chose the recommended option 1 of each Figma preview (draft page, light and dark), after market research with sources.

| ID | Answer | What the code does |
|---|---|---|
| D-1 | Option 1 (node `7910:22887`): set the nph-button hook `--nph-button-focus-border` to `focus/border` on the primary Confirm. Primer, Atlassian, Carbon, Fluent and GOV.UK use one focus color for every control: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html , https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html , https://raw.githubusercontent.com/primer/primitives/main/src/tokens/component/focus.json5 , https://atlassian.design/components/focus-ring , https://raw.githubusercontent.com/microsoft/fluentui/master/packages/react-components/react-tabster/src/focus/createFocusOutlineStyle.ts , https://carbondesignsystem.com/elements/color/tokens/ , https://design-system.service.gov.uk/get-started/focus-states/ | What "Focus contrast of Confirm in dark" says. |
| D-2 | Option 1 (node `7910:23035`): stack, each button at the full width of the band, Confirm on top. Material and Apple put the confirming action on top of a stack, and Spectrum switches to vertical when a button does not fit: https://raw.githubusercontent.com/material-components/material-components-web/master/packages/mdc-dialog/README.md , https://developer.apple.com/tutorials/data/design/human-interface-guidelines/alerts.json , https://raw.githubusercontent.com/adobe/react-spectrum/main/packages/@adobe/react-spectrum/src/buttongroup/ButtonGroup.tsx . The full width has no read source; it is the design choice shown in the preview. | What "Actions that do not fit" and "A single label longer than the band" say. |
| D-3 | Option 1 (node `7923:20292`): Cancel stays enabled and closes during the wait; Esc, a press outside and another layer do the same. No confirmation bubble read locks the way out; in Ant Design and Arco, Cancel, Esc and a press outside close with OK loading: https://raw.githubusercontent.com/ant-design/ant-design/master/components/popconfirm/index.tsx , https://raw.githubusercontent.com/react-component/trigger/master/src/index.tsx , https://raw.githubusercontent.com/arco-design/arco-design/main/components/Popconfirm/index.tsx . Another layer follows by analogy, with no read source. | What "Slow confirm" and "While Confirm loads" say. The code already followed this recommendation. |

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS, tests, stories and spec pass the proof commands in `docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## What this task does not do
The code does not create a token or change a token value. It does not change Figma. It does not change the `nph-button` (the focus fix of item 10 is a task of its own), the `nph-separator` or the DSA-67 text. It sets `--nph-button-focus-border` on the primary Confirm (D-1) without changing the nph-button. It does not make a single label wrap inside the nph-button (D-2): that is a change of the nph-button in a task of its own. It does not cover a serious or irreversible action, or one that needs a long explanation: that goes to the `nph-dialog` with a danger button until the `nph-alert-dialog` comes back to the scope.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, page `4128:35277`, documentation frame `7389:104`, root `7222:3379`, appendix `7394:32` and the evidence of the `figma-docs-accepted` gate
- Component set: nph-popconfirm `7222:3568`
- WAI-ARIA APG, alert dialog: https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/
- WAI-ARIA APG, dialog (modal): https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- PrimeNG ConfirmPopup: https://raw.githubusercontent.com/primefaces/primeng/master/packages/primeng/src/confirmpopup/confirmpopup.ts
- Radix Popover: https://raw.githubusercontent.com/radix-ui/primitives/main/packages/react/popover/src/popover.tsx
- Floating UI, focus manager: https://floating-ui.com/docs/FloatingFocusManager
- Floating UI, flip and size: https://floating-ui.com/docs/flip · https://floating-ui.com/docs/size
- Semi Design, `Popconfirm`: https://semi.design/en-US/feedback/popconfirm
- WCAG 2.2, non-text contrast: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- WCAG 2.2, animation from interactions: https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html
- Custom Elements Manifest: https://github.com/webcomponents/custom-elements-manifest
- `design.md` — the tokens named in the evidence
- `fichas/nph-popover.md`, `fichas/nph-button.md`, `fichas/nph-separator.md`, `fichas/nph-icon.md`

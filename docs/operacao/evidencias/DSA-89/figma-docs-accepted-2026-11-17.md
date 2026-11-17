```json
{
  "task": "DSA-89",
  "gate": "figma-docs-accepted",
  "date": "2026-11-17",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=5237-3423",
    "date": "2026-11-17",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The design owner gave the visual acceptance of the nph-timeline (green page 1626:37, root 5226:2261), and its documentation frame (5237:3423) was accepted, with COMPONENT_SET nph-timeline item (5216:304) and COMPONENT_SET nph-timeline (5216:701). In a test round of 17-11 without the approval page, the 16 approval items were taken as recommended: (1) documentation 5237:3423 and appendix 5240:5360 accepted; (2) timeline/marker-size straight to core/icon-size/300; (3) timeline/dot-size straight to core/space/200; (4) timeline/connector-gap straight to core/space/100; (5) timeline/content-gap straight to core/space/300; (6) connector line on color/primary-border, pending on color/border; (7) pending outline on color/input; (8) marker background on color/primary-surface; (9) neutral marker icon on color/primary-on-surface; (10) tonal marker on every state; (11) status border description is a foundation task; (12) 1 px connector line on a whole pixel; (13) history in columns goes to the nph-table; (14) rich content is an nph-card base or section; (15) the Almoxarifado inventory is checked when the file key arrives; (16) descriptions of semantics and primitives only gain additions."
  }
}
```

# DSA-89 — `figma-docs-accepted`

The documentation of the nph-timeline (frame `5237:3423`, page `1626:37`) was accepted in Figma in the file `DS-IA-NEPHOS 5.0`, with the visual acceptance of the root `5226:2261`. The timeline is a vertical list of events in order, linked by a connector line. It shows where a process is or what happened to a record. Its tokens came with this task and are on `v/5.0.0`.

What changed in the tokens with this task:

- New component group `timeline/*`, 27 tokens in the semantic collection. 23 alias semantics (rule 2 of T9). Four point straight to the core by decision (rule 3 of T9), each with the semantic of the same value that does not serve:
  - `timeline/marker-size` → `core/icon-size/300` (24): no semantic of 24 has the function of a marker; `icon/size-lg` is a lone icon, and `space/overlay-padding`, `layout/gutter` and `layout/margin-default` are space. The same primitive as `stepper/marker-size`, the sibling marker. The marker column keeps the width of the `sm` avatar (`avatar/size-sm`, also 24).
  - `timeline/dot-size` → `core/space/200` (8): the semantics of 8 are space or radius (`space/inline`, `space/stack-snug`, `radius/container`, `focus/radius-inner`). The same primitive as `carousel/indicator-size`, the sibling dot.
  - `timeline/connector-gap` → `core/space/100` (4): `space/inline-tight` is side by side and `space/stack-tight` is a label and what it describes.
  - `timeline/content-gap` → `core/space/300` (12): `space/control-padding` belongs to a control and `space/inline-loose` to footer actions.
- No new semantic and no new primitive. No token has a new value or a new color.
- Descriptions with additions only, in Figma and in `design.md` (item 16): `color/primary` (the decorative history dot), `color/primary-border` (the connector line), `color/input` (an outline that needs 3:1 outside a field), `color/primary-surface` (the marker background), `color/primary-on-surface` (the marker icon; in Figma the variable also gained the icon scope), `core/icon-size/300` (the marker size, beside the nph-stepper), `core/space/100`, `core/space/200` and `core/space/300`.
- Extended `use` in `design.md`: `color/foreground`, `color/muted-foreground`, `color/subtle-foreground`, `color/primary`, `color/primary-border`, `color/primary-surface`, `color/primary-on-surface`, `color/input`, `border/width`, `status/error-surface`, `status/error-foreground`, `status/error-border`, `status/warning-surface`, `status/warning-foreground`, `status/warning-border`, `space/stack`, `space/stack-tight`, `icon/size-sm`, `radius/full`; the rule of `tokens_core_icon` and a note in `tokens_core_space` name the four straight aliases.
- Left out of this task: the description of `status/error-border` and `status/warning-border` in Figma still promises 3:1; aligning it with `design.md`, which does not, is a foundation task (item 11). It does not change any value.

There is no command output. The acceptance is a human observation, recorded in the json block above with the frame URL and the component sets.

The rest of this file is the contract converted to text, so that whoever codes does not need to open Figma. Figma property and value names stay as they are in Figma, between backticks. Where a point is not one of the 16 approval items, it follows the recommendation of the appendix, accepted with the documentation (item 1).

## Purpose

A vertical list of events in order, each with a marker, a title and a meta line, linked by a connector line. It shows where a process is or what happened to a record. It does not navigate.

Use it to follow the steps of a process, such as a request or an approval, and for the activity history of a record, with who did it and when. It does not replace the nph-stepper, which leads the person through the steps and numbers each one: the timeline records and does not navigate. It does not replace the nph-table: a history read in columns (date, who, what) goes to the table (item 13).

Selection in Figma: on the list, `tipo` (type: `processo` process, `historico` history) and `itens` (items: 3, 4, 5); on the item, `marcador` (marker: `ponto` dot, `circulo` circle, `avatar`), `estado` (state) and the booleans `trilho` (connector line), `descrição` (description) and `ação` (action).

## Component sets

| Set | Figma id | What it is |
|---|---|---|
| nph-timeline item set (`nph-timeline / item`) | `5216:304` | `marcador` × `estado`, 8 variants: dot neutral, circle neutral, circle completed, circle current, circle pending, circle error, circle warning, avatar neutral. Booleans: `trilho` (on), `descrição` (on), `ação` (off). Only the circle has the six states; dot and avatar stay neutral. |
| nph-timeline | `5216:701` | `tipo` × `itens`, 6 variants: process and history, with 3, 4 and 5 items. Default: process, 3 items. |

The state values in Figma: `neutro` neutral (default), `concluido` completed, `atual` current, `pendente` pending, `erro` error, `atencao` warning.

## Tokens

| Token | Points to | Light | Dark | Where |
|---|---|---|---|---|
| `timeline/marker-size` | `core/icon-size/300` | 24 | 24 | Marker column width, circle size, minimum height of the title row. Straight to core by decision |
| `timeline/dot-size` | `core/space/200` | 8 | 8 | History dot and the center dot of the current item. Straight to core by decision |
| `timeline/marker-icon-size` | `icon/size-sm` | 16 | 16 | nph-icon box inside the circle |
| `timeline/marker-radius` | `radius/full` | 9999 | 9999 | Corner of the circle, the dot and the center dot (not the avatar) |
| `timeline/connector-gap` | `core/space/100` | 4 | 4 | Above and below the connector line, so it does not touch the markers. Straight to core by decision |
| `timeline/content-gap` | `core/space/300` | 12 | 12 | Between the marker column and the text. Straight to core by decision |
| `timeline/item-gap` | `space/stack` | 16 | 16 | Below each item, while the connector line runs through it |
| `timeline/text-gap` | `space/stack-tight` | 4 | 4 | Between title, description and meta line |
| `timeline/action-gap` | `space/stack` | 16 | 16 | Between the text and the action |
| `timeline/title-foreground` | `color/foreground` | `core/base/black` | `core/neutral/100` | Item title, except pending |
| `timeline/title-foreground-pending` | `color/muted-foreground` | `core/neutral/600` | `core/surface/200` | Title of the pending item |
| `timeline/description-foreground` | `color/muted-foreground` | `core/neutral/600` | `core/surface/200` | Description, and the word of the pending item that says it is waiting |
| `timeline/meta-foreground` | `color/subtle-foreground` | `core/neutral/500` | `core/neutral/300` | Meta line (who and when) |
| `timeline/dot-background` | `color/primary` | `theme/brand-600` | `theme/brand-400` | History dot, decorative |
| `timeline/connector-border` | `color/primary-border` | `theme/brand-600` | `theme/brand-200` | Connector line of the neutral, completed, current, error, warning and avatar items, decorative |
| `timeline/marker-background` | `color/primary-surface` | `theme/brand-50` | `theme/brand-900` | Background of the neutral circle |
| `timeline/marker-foreground` | `color/primary-on-surface` | `theme/brand-600` | `theme/brand-100` | Icon of the neutral circle |
| `timeline/marker-background-primary` | `color/primary-surface` | `theme/brand-50` | `theme/brand-900` | Background of the completed and the current circle |
| `timeline/marker-foreground-primary` | `color/primary-on-surface` | `theme/brand-600` | `theme/brand-100` | Check of the completed circle and center dot of the current one |
| `timeline/marker-border-pending` | `color/input` | `core/neutral/400` | `core/surface/300` | Outline of the hollow pending circle, the graphic sign of the state |
| `timeline/marker-border-width` | `border/width` | 1 | 1 | Outline thickness of the pending, error and warning circles |
| `timeline/marker-background-error` | `status/error-surface` | `core/danger/50` | `core/danger/900` | Background of the error circle |
| `timeline/marker-foreground-error` | `status/error-foreground` | `core/danger/800` | `core/danger/100` | Error icon |
| `timeline/marker-border-error` | `status/error-border` | `core/danger/200` | `core/danger/400` | Discreet outline of the error circle |
| `timeline/marker-background-warning` | `status/warning-surface` | `core/warn/50` | `core/warn/900` | Background of the warning circle |
| `timeline/marker-foreground-warning` | `status/warning-foreground` | `core/warn/800` | `core/warn/100` | Warning icon |
| `timeline/marker-border-warning` | `status/warning-border` | `core/warn/200` | `core/warn/400` | Discreet outline of the warning circle |

In Figma the neutral circle and the completed circle use the same background and the same icon tone; only the icon drawing tells them apart (item 9). The two pairs of tokens stay separate so one can change without the other.

### Used directly or by instance

- Text styles: title `text/label-md`, on the current item `text/label-md-strong`; description `text/body-md`; meta line and the waiting word `text/caption`.
- The connector line is an nph-separator instance (vertical): thickness `border/width` and color from the item (`timeline/connector-border`); the pending item keeps the separator color, `color/border`. The default separator height (`layout/separator-height`) gives way to the item height.
- The avatar marker is an nph-avatar `sm` instance: `avatar/size-sm`, `avatar/radius-sm`, `color/muted` background, `color/border` outline, `user` icon in `color/muted-foreground` with no photo. No circle around it. Its connector line stays on `timeline/connector-border`.
- The icon is an nph-icon instance, `light` style, in the `timeline/marker-icon-size` box, with the color of the marker on the vector.
- The action is an nph-button instance: secondary, ghost, default size (`control/height-default`, `space/control-padding`, `space/inline-tight`, `radius/control`, label in `color/secondary-foreground`) and the button focus (focus border and halo).
- The loading and empty examples use nph-skeleton and nph-empty with their own tokens.
- Frame shell in Figma (not part of the piece): `color/background`, `color/muted`, `radius/surface`, `space/overlay-padding`, `space/stack`, `space/stack-snug`, `space/stack-tight`, `space/section`.

## Anatomy, read part by part in Figma

Read by script, variant by variant, after the token bindings (17-11). Base measures: item 360 × 84 with description; in the list the item without description is 60 high.

Item, common structure (the 8 variants):

1. **Item**: horizontal, start aligned, full width, height hugs the content; gap `timeline/content-gap` (12) between the marker column and the content.
2. **Marker column**: 24 wide (`timeline/marker-size`), vertical, children centered on the cross axis.
   - **Marker**: 24 × 24, at the top of the column, centered in it; the glyph is centered on both axes.
   - **Connector line box**: vertical, fills the remaining height, `timeline/connector-gap` (4) above and below; inside, the nph-separator (vertical, 1 px, full height). It links one marker to the next and is off on the last item.
3. **Content**: vertical, start aligned, full width; gap `timeline/action-gap` (16) between the text and the action; bottom padding `timeline/item-gap` (16).
   - **Text**: vertical, gap `timeline/text-gap` (4).
     - **Title row**: horizontal, children centered on the cross axis, minimum height `timeline/marker-size` (24), height hugs: the title sits in the middle of the marker; with two lines it grows without cutting.
       - **Title**: `timeline/title-foreground`, `text/label-md` (current `text/label-md-strong`; pending `timeline/title-foreground-pending`).
     - **Description**: `timeline/description-foreground`, `text/body-md`, optional (boolean `descrição`).
     - **Meta line**: horizontal, start aligned.
       - **Waiting word** (Figma text `Aguardando`): `timeline/description-foreground`, `text/caption`; shown only on the pending item, hidden on purpose on the others.
       - **Who and when**: `timeline/meta-foreground`, `text/caption`.
   - **Action**: nph-button secondary ghost default, optional (boolean `ação`, off by default), below the text.

Marker by variant:

- **Dot, neutral** (`5216:141`): a 24 × 24 frame with no fill; inside, the dot 8 × 8 (`timeline/dot-size`), corner `timeline/marker-radius`, fill `timeline/dot-background`.
- **Circle, neutral** (`5216:160`): size `timeline/marker-size`, corner `timeline/marker-radius`, fill `timeline/marker-background`; icon 16 × 16 (`comment`, light, the event type example) in `timeline/marker-foreground`.
- **Circle, completed** (`5216:181`): fill `timeline/marker-background-primary`; `check` icon, light, in `timeline/marker-foreground-primary`.
- **Circle, current** (`5216:202`): fill `timeline/marker-background-primary`; center dot 8 × 8 (`timeline/dot-size`), corner `timeline/marker-radius`, fill `timeline/marker-foreground-primary`. The title is strong.
- **Circle, pending** (`5216:221`): no fill; outline `timeline/marker-border-width` (1) in `timeline/marker-border-pending`; no glyph. The state is the hollow circle and the waiting word.
- **Circle, error** (`5216:239`): fill `timeline/marker-background-error`, outline `timeline/marker-border-width` in `timeline/marker-border-error`; `circle-xmark` icon, light, in `timeline/marker-foreground-error`.
- **Circle, warning** (`5216:260`): fill `timeline/marker-background-warning`, outline `timeline/marker-border-width` in `timeline/marker-border-warning`; `triangle-exclamation` icon, light, in `timeline/marker-foreground-warning`.
- **Avatar, neutral** (`5216:281`): nph-avatar `sm` with no photo, by instance, with its own tokens.

List (`5216:701`): vertical, start aligned, width and height hug, no gap of its own: the space between items is the `timeline/item-gap` of the item. Process, 3 items (`5216:305`): completed → current → pending; 4 and 5 items add a completed item at the top and a pending one at the end. History, 3 items (`5216:506`): dot neutral × 3; 4 and 5 repeat with more items. The last item has the connector line off. In the list the description boolean is off.

Order: the marker column comes at the start and the content after it; inside the content, from top to bottom, title, description, meta line and action.

Draw the connector line once per item, with the item token; Figma uses the separator instance to get the 1 px line.

## Accessibility

| Criterion | Rule |
|---|---|
| Contrast | Title (`timeline/title-foreground`), description (`timeline/description-foreground`) and meta line (`timeline/meta-foreground`) pass 4.5:1 in both themes and every brand; the lowest is 4.74:1 on the meta line (`Sistemas` brand, light). The marker glyph passes 3:1 over its surface: the lowest is 4.64:1 (`color/primary-on-surface` × `color/primary-surface`, `Educação` brand, light); neutral icon 4.78:1 light and 13.79:1 dark in the `Sistemas` brand; error icon 12.06:1 light and 13.41:1 dark; warning icon 10.80:1 light and 13.61:1 dark. The marker surface and the connector line are decorative and may stay below 3:1 against the background: the glyph and the text carry the meaning. The pending outline is the sign of the state and passes 3:1 against the background: 3.23:1 light and 6.58:1 dark. |
| Visible focus | The timeline takes no focus: it is not interactive. The focus is that of the action nph-button, by instance. Its focus border carries the 3:1 (4.32:1 at least, Comercial light); the halo around it is decoration (1.26:1 light, 2.33:1 dark). |
| Color is not the only cue | Each state has a sign besides color: the check on completed; the center dot and the strong title on current; the hollow circle and the waiting word on pending; `circle-xmark` on error; `triangle-exclamation` on warning. The error and warning outline is discreet: in light it stays below 3:1 against the background (error 1.93:1, warning 1.66:1; dark 5.01:1 and 6.70:1), and the icon carries the meaning. |
| Target size | The item is not clickable. The target is the action: nph-button default, `control/height-default` (the Figma example measures 108 × 36). |
| Accessible name | Ordered list (`ol` and `li`), named by the section title (`aria-labelledby`) or by `aria-label`, and the date in `time datetime`. Marker and connector line with `aria-hidden`; the item text tells the state and, when the title does not, a hidden text at the start of the item does. The current item has `aria-current="step"`, on the process type only. A list that gets live events announces the arrival in a short `aria-live="polite"` region, outside the list. |

Other measures read in the appendix: the connector line contrast against the background is 5.37:1 light and 8.98:1 dark (`color/primary-border`); on pending, `color/border` gives 1.69:1 light and 4.18:1 dark. Both are decorative.

## Properties, variants and states

| Field | Rule |
|---|---|
| `marcador` (item) | `ponto` dot is the default: the dense form of the history. `circulo` circle carries the state and the event type icon. `avatar` shows who did it, with the nph-avatar `sm`. |
| `estado` (item) | `neutro` neutral is the default. `concluido`, `atual`, `pendente`, `erro` and `atencao` exist on the circle; dot and avatar stay neutral. |
| `trilho` (item) | On by default. Turn it off on the last item of the list. |
| `descrição` (item) | On by default. Turn it off when the title is enough. |
| `ação` (item) | Off by default. On, it shows the nph-button secondary ghost default below the text, with a label from the context, such as "See details" (Figma text `Ver detalhes`). |
| `tipo` (list) | `processo` process is the default: circle items with the state of each step. `historico` history: dot items, neutral; for avatar or a circle with an icon, swap the marker on the item instance. |
| `itens` (list) | Number of items; the default is the smallest value. A longer list ends with a ghost nph-button "Show more" (Figma text `Ver mais`). |
| Not a property | The event type icon: swap on the nph-icon instance, `light` style. Texts and date: override. The waiting word is a layer of the pending item, hidden on the other states. Rich content below the text: an nph-card instance, base or section, never the clickable card when the item has an action (item 14). In the Figma example its place shows as a block skeleton. |

The item has no interaction state: no hover, pressed, focus, selected or disabled. Its states are status values, one per item.

## Relations and context

- Avatar marker: nph-avatar `sm` instance. The corner is the avatar one (`avatar/radius-sm`), with no circle around it.
- Icon: nph-icon instance, `light` style, in the `timeline/marker-icon-size` box. The color comes from the marker: `timeline/marker-foreground`, `timeline/marker-foreground-primary` or the status one.
- Connector line: nph-separator vertical instance; the thickness comes from it (`border/width`). The color comes from the item: `timeline/connector-border` on the neutral, completed, current, error and warning items, and `color/border`, from the separator, on the pending one.
- Action: nph-button secondary ghost default. Focus and target belong to the button. "See details" sits inside the item, in the text column; its label is indented by the ghost padding (`space/control-padding`, 12). "Show more" sits outside the items, at the end of the list, aligned to the marker column.
- Title row: minimum height equal to the marker column (`timeline/marker-size`) and a height that hugs the content. The title sits in the middle of the marker; with two lines it grows without cutting.
- Surface: the timeline sits on `color/background`. Inside a card it uses the same tokens.

## When to use

- Process: the steps of a flow, such as a request and an approval. Use the process type, with the state of each step.
- History: the events of a record, from the most recent to the oldest, with the absolute date and, if wanted, the relative one ("2 h ago"). Use the dot; the avatar when who did it matters; the neutral circle with an icon when the event type matters.
- Long list: show the most recent events and a ghost nph-button "Show more" at the end.
- Loading: nph-skeleton avatar `sm` and line in place of the items. No events: nph-empty, with a title and a description from the context.

## Required examples (in Figma, light and dark)

A declined approval process; a history by person, with an action; a history by event type.

## Do

- Turn off the connector line on the last item, so the line does not point to an event that does not exist.
- Write the state in the text (for example "Waiting", "Declined"), because the marker and the connector line are hidden from the screen reader.
- Use the circle with the event type icon when the type matters, because the icon tells what happened before the title is read.
- Put who and when on the meta line, because a separate date column takes width and breaks on a narrow screen.

## Do not

- Do not use the timeline to lead the person through steps they click: use the nph-stepper.
- Do not leave the connector line on the last item: turn off the `trilho` boolean.
- Do not mark the state by color without the glyph: use the circle with the state icon or with the center dot of the current item.
- Do not build the history in columns (date, who, what) inside the timeline: a history read in columns is a table, the nph-table.

## Default behavior (appendix, accepted with the documentation)

Base: WAI-ARIA APG. The APG has no timeline or list pattern: the native HTML list applies (`ol` and `li`). The Feed pattern does not apply: it loads on scroll, and the timeline loads through the "Show more" nph-button. No row departs from the APG.

| Subject | Rule |
|---|---|
| Structure | Ordered list (`ol` and `li`), with a name: `aria-labelledby` on the visible section title or, without a title, `aria-label`. "Show more" sits outside the list, after the `ol`. |
| Feed pattern | Does not apply: the timeline does not load on scroll and does not use `role="feed"`, `article` nor Page Down and Page Up. |
| Keyboard: Tab | Only the actions take Tab, in list order: "See details" of each item and, at the end, "Show more". Item, marker, connector line, text and date take no focus. |
| Keyboard: arrows | Do nothing: the list is not a composite widget. |
| Enter and Space | Those of the action nph-button. The item answers no key. |
| Esc | Does not apply: nothing opens. |
| Focus on open and close | Does not apply: the piece does not open or close, and it does not pull focus when the page loads. |
| Click outside | Does not apply. |
| Pointer and focus | The item has no hover, pressed or focus, and is not clickable. Hover and focus belong to the nph-button only. The item text stays selectable. |
| Window edge | There is no floating layer, so nothing flips. The list has no scroll of its own; title and description wrap, with no cut. |
| Screen reader: state | Marker and connector line with `aria-hidden`; the state goes in the item text. When the title does not tell the state, a hidden text goes at the start of the item: "Completed", "Current step", "Error" or "Warning" (the pending item already says it is waiting). The same for the event type, if the title does not tell it. |
| Screen reader: date | Date in `time datetime`, with the absolute date visible. The date takes no focus. |
| Current step | `aria-current="step"` on the `li` of the current item, on the process type only and on one item. On the history, no `aria-current`. |
| Live region | Only when the list gets events without the person acting: a short announcement apart, `aria-live="polite"`, outside the `ol` (for example "2 new events"). The whole list does not become a live region. |
| Show more | The earlier events go in at the end of the `ol`, before the button. Focus stays on "Show more", and the live region announces how many events came in. On the last batch the button goes away, and focus moves to the first new item, so it does not fall to the `body` (a Nephos choice: without the button focus needs a destination, and the first new item continues the reading where it stopped). |
| Loading | `aria-busy="true"` on the list; skeleton with `aria-hidden="true"`; a hidden "Loading" text outside the hidden node. |
| Empty | nph-empty in place of the list; no empty `ol` remains. |
| Motion | The piece does not animate. If the code animates the arrival of events, the motion goes away under `prefers-reduced-motion`. |
| Code | Event, aria, slot, property and console warning stay with the code owner, following the APG and the Custom Elements Manifest. |

The visible strings in Figma are Portuguese examples: the waiting word `Aguardando`, the action labels `Ver detalhes` and `Ver mais` (the appendix limits text says `Ver mais eventos`). The code uses its translation strings for them and for the hidden state texts.

## Combined states (T11)

The nph-timeline has no interaction state: the item is not selected, checked or disabled. The item states (neutral, completed, current, pending, error, warning) are status values, one per item, and do not combine with each other.

The only piece with an interaction state is the action, the nph-button, which follows T11 inside it. A disabled action on an item of any status: the item keeps marker, glyph, connector line and colors; only the button goes under `state/disabled-opacity`. Selected + disabled (DSA-29 D-3) and error + disabled (DSA-18 D7) do not apply to the item.

## Icon and image

| Piece | Weight and size | Rule and source |
|---|---|---|
| Marker icons: `comment` (event type, example), `check`, `circle-xmark`, `triangle-exclamation`; `user` on the avatar with no photo | nph-icon, `light`, in the `icon/size-sm` box (16) inside the 24 px marker | The weight stays `light` on every state and does not swap: the item has no hover, pressed or focus, and the contrast was measured with the light glyph (4.64:1 at least on neutral, completed and current). `solid` stays for when a case asks for more presence. The icon is decorative (`aria-hidden`): the item text tells the state and the type. |
| Avatar image | nph-avatar `sm`, 24 px | The photo is exported at 48 × 48 px (2x), square, cover crop centered on the face, with the avatar outline on top. With no photo, while it loads or if it fails, the `user` icon stays (DSA-24 D3). The name is on the meta line, so the avatar has no label and is hidden from the screen reader. |

Sources: MDN responsive images (https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images); `fichas/nph-icon.md` and `fichas/nph-avatar.md`; DSA-73 and DSA-88.

## Limits (in text; the matrix predates the limits row)

- Minimum: the smallest list is the 3-item variant; a single event uses the item with the connector line off (block 24 of the matrix).
- Maximum and many items: the variants go up to 5 items; a long list ends in the ghost nph-button "Show more" (block 26), which loads the earlier events.
- Long text: title and description wrap and the item grows in height, with no cut and no ellipsis; the connector line follows the item height.
- Empty: nph-empty with a title and a description from the context (block 18). Loading: nph-skeleton on the item grid (block 17).
- Short window: the list has no scroll of its own (height by content, no clipping); it scrolls with the page or the container.

## Connector line position (item 12)

In Figma the 1 px line sits at x 12 in a 24 px column (layers `5216:145` and `5216:224`): the line center falls at 12.5, half a pixel off the column center. In code, place the line at `left: 12px`, with no `transform`: a percentage translate creates a half pixel and blurs the line. The line stays sharp, half a pixel off center. The 1 px thickness stays, because thickness and color come from the nph-separator.

## Inherited decisions

- follows DSA-73 D-1: in dark, `color/primary-border` points to `theme/brand-200` in the 7 brands (foundation, DSA-84); the connector line inherits it with no change in the component.
- follows DSA-73 D-5 in part: the connector line follows the status and the pending item stays neutral (`color/border`), as in the nph-stepper. It diverges: on the timeline the line of the current, error and warning items is also on the brand color (item 6), because the timeline records and does not lead; the state is on the marker.
- follows DSA-73 D-4: a hover background only on a step that can be activated. The timeline item cannot be activated, so it has no hover.
- follows DSA-65 D-1 in part (process type): the list takes 2 items or more, with no ceiling of 7, because a long list ends in "Show more". A single event is the item with the connector line off.
- follows DSA-24 D1, D2, D3 and D4 (avatar marker): `user` icon `light`; size `sm` with `icon/size-sm`; the icon stays while the photo loads and when it fails; outline `border/width` in `color/border` over the photo.
- follows DSA-88 (nph-card, 17-11): image exported at 2x, cover crop; loading with `aria-busy="true"`, skeleton with `aria-hidden="true"` and a hidden "Loading" text; nothing interactive inside the clickable card, so a timeline with an action goes in the base or section card.
- follows DSA-62 D-3 (with reduced motion, nothing moves; cited in DSA-73 and DSA-88): if the code animates the arrival of events, the motion goes away under `prefers-reduced-motion`.
- does not apply: DSA-73 D-2 and D-3 (the timeline does not change shape on a narrow width) and DSA-65 D-2 (motion tokens). DSA-10 (nph-separator) and DSA-13 (nph-button) have no decision to inherit.

## Decisions answered (test round of 17-11, all as recommended)

1. Documentation `5237:3423` and appendix `5240:5360` accepted.
2. `timeline/marker-size` → `core/icon-size/300` (24), straight to core, the same primitive as `stepper/marker-size` (it pointed to `core/avatar-size/100`, also 24; the drawing does not change).
3. `timeline/dot-size` → `core/space/200` (8), straight to core, as `carousel/indicator-size`.
4. `timeline/connector-gap` → `core/space/100` (4), straight to core.
5. `timeline/content-gap` → `core/space/300` (12), straight to core.
6. Connector line: `timeline/connector-border` → `color/primary-border` on the neutral, completed, current, error, warning and avatar items; the pending item stays on `color/border`. No new semantic (a softer brand-200 line would open a foundation decision). Carbon and Mantine paint the travelled part with the strong brand color; the nph-stepper does the same.
7. Pending outline: `color/input` for good (3.23:1 light, 6.58:1 dark), with its description extended to "an outline that needs 3:1 outside a field". A marker border semantic of its own waits for a second component.
8. Marker background: `color/primary-surface` on the neutral, completed and current circles, with the nph-timeline added to its description, without rewriting today's uses.
9. Neutral circle icon: `color/primary-on-surface`, the same as the completed check; the Figma variable gained the icon scope. In dark, `color/primary` over the surface would fall to 2.86:1 in Gerencial.
10. Tonal marker on every state (light brand background with a strong icon), not solid: the solid one drops the icon to 1.49:1 in dark.
11. Status border below 3:1 in light: the timeline keeps it as a discreet outline, and the icon carries the meaning. Aligning the Figma description of `status/error-border` and `status/warning-border` is a foundation task, outside this component.
12. Connector line of 1 px from the nph-separator, placed on a whole pixel in code, with no translate (section above).
13. A history read in columns goes to the nph-table; the timeline stays stacked.
14. Rich content below the item text is an nph-card instance, base or section, never the clickable card when the item has an action. The Figma example keeps the block skeleton in this version; swapping it for an nph-card is a later Figma preview and does not change this contract.
15. The Almoxarifado inventory (node `925:33710` in the ACS.net file, without a key) is checked when the key arrives, without blocking the acceptance: the two types come from the v1 list and from the market.
16. Descriptions of semantics and primitives only gain nph-timeline additions, without rewriting today's uses.

The other points of the appendix (default behavior, combined states, icon and image, limits, inherited decisions) were not approval items: they follow the recommendation of the appendix, accepted with the documentation (item 1). No decision is open in the appendix.

## Hidden on purpose in Figma

- The waiting word: shown only on the pending item.
- The action (nph-button): hidden when the `ação` boolean is off.
- In the "wrong: state without a glyph" example of the documentation (instances `5239:859` light and `5239:913` dark of the completed item), the check (main component layer `5216:184`) is hidden by override to show the error.
- The inner caption of the focus example copy (`5238:63` light, `5238:114` dark): hidden so it does not repeat the outer caption.

## Sources

- Figma `DS-IA-NEPHOS 5.0`, page `1626:37`, documentation frame `5237:3423`, root `5226:2261`, appendix `5240:5360`
- Component sets: nph-timeline item set `5216:304`; nph-timeline `5216:701`
- WAI-ARIA APG, patterns: https://www.w3.org/WAI/ARIA/apg/patterns/
- WAI-ARIA APG, Feed: https://www.w3.org/WAI/ARIA/apg/patterns/feed/
- WAI-ARIA APG, keyboard interface: https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/
- WAI-ARIA 1.2, aria-current: https://www.w3.org/TR/wai-aria-1.2/#aria-current
- MDN, aria-current: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-current
- HTML, the time element: https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-time-element
- WCAG 2.2, info and relationships: https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html
- WCAG 2.2, use of color: https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html
- WCAG 2.2, non-text contrast: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- WCAG 2.2, focus appearance: https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html
- Primer, Timeline: https://primer.style/product/components/timeline/
- Primer, Timeline accessibility: https://primer.style/product/components/timeline/accessibility/
- Primer, Timeline CSS: https://raw.githubusercontent.com/primer/react/main/packages/react/src/Timeline/Timeline.module.css
- Carbon, progress indicator usage: https://carbondesignsystem.com/components/progress-indicator/usage/
- Carbon, progress indicator styles: https://raw.githubusercontent.com/carbon-design-system/carbon/main/packages/styles/scss/components/progress-indicator/_progress-indicator.scss
- Carbon, color tokens: https://carbondesignsystem.com/elements/color/tokens/
- Mantine, Timeline CSS: https://raw.githubusercontent.com/mantinedev/mantine/master/packages/@mantine/core/src/components/Timeline/Timeline.module.css
- Material 3, ColorScheme: https://developer.android.com/reference/kotlin/androidx/compose/material3/ColorScheme
- Material 3, color roles: https://m3.material.io/styles/color/roles
- PrimeNG, Timeline: https://primeng.dev/timeline
- MUI, Timeline: https://mui.com/material-ui/react-timeline/
- Ant Design 4, timeline style: https://raw.githubusercontent.com/ant-design/ant-design/4.x-stable/components/timeline/style/index.less
- Half-pixel blur with a percentage translate: https://www.bennadel.com/blog/3399-sanity-check-chrome-63-still-causes-blurry-borders-with-percentage-based-css-translation.htm
- Chronological activity feeds: https://www.aubergine.co/insights/a-guide-to-designing-chronological-activity-feeds
- ReUI, Timeline: https://reui.io/components/timeline
- Focus management: https://accessibility.arizona.edu/web-apps/focus-management
- MDN, responsive images: https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images
- Custom Elements Manifest: https://github.com/webcomponents/custom-elements-manifest
- `design.md` — the tokens named above
- `fichas/nph-separator.md`, `fichas/nph-icon.md`, `fichas/nph-avatar.md`, `fichas/nph-button.md`, `fichas/nph-skeleton.md`, `fichas/nph-empty.md`

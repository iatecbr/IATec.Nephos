```json
{
  "task": "DSA-78",
  "gate": "figma-docs-accepted",
  "date": "2026-11-12",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=6014-1688",
    "date": "2026-11-12",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The design owner accepted the visual of the nph-collapsible root (6005:482) and its documentation frame (6014:1688, page 4128:35275), with COMPONENT_SET nph-collapsible (6006:2250), and answered the open points of the appendix: the collapsible defines the anatomy and the values, and the accordion item later becomes an instance of the collapsible, after both are accepted, with nothing in the accordion changed now; the card appearance outline is color/border at border/width and the default appearance has no outline, a softer border in dark mode being a foundation task outside; space/inline, space/inline-tight and space/control-padding stay on the paddings; collapsible/content-padding-top is on space/stack-snug (8 px), so the focus ring does not touch the content; the other tokens only alias a semantic and the component enters v1. The specification, converted to text, is in this evidence."
  }
}
```

# DSA-78 — `figma-docs-accepted`

The documentation of the nph-collapsible (frame `6014:1688`, `4. DOCUMENTAÇÃO`, page `4128:35275`) was accepted in Figma in the file `DS-IA-NEPHOS 5.0`, with the visual acceptance of the root `6005:482`. The nph-collapsible is a trigger that opens and closes a block of content in the same place on the page. Open, the content pushes down what comes below and covers nothing. It starts closed. Its tokens came with this task and are on `v/5.0.0`.

What changed in the tokens with this task:

- New component group `collapsible/*`, in the semantic collection. Every token is an alias of an existing semantic token, the same in light and dark. None points straight to core and no new value entered the core (rule T9). Movement follows `panel-menu/expand-duration` and `panel-menu/expand-easing`: the piece grows in place, so `motion/expand-*`.
- Bindings outside the letter of the semantic description, by decision: `collapsible/trigger-padding-y` on `space/inline`, `collapsible/trigger-padding-y-compact` on `space/inline-tight`, `collapsible/content-padding-x` and `collapsible/content-padding-bottom` on `space/control-padding`. Nephos has no semantic for vertical padding and none for panel padding. The same pair is used by nph-navigation-menu, nph-notification and nph-table. The gap stays for a foundation task.
- `collapsible/content-padding-top` is on `space/stack-snug` (8 px), not on `space/stack-tight` (4 px), so the focus halo of the trigger does not touch the content.
- Extended `use` of semantic tokens in `design.md`, where the accepted Figma uses them.
- Left without a component token: the trigger of the button and preview types is an instance of the nph-button, with its own tokens, including focus and disabled; the icons are nph-icon instances; the text of the content slot is product content; the typography comes from text styles (`text/label-md`, `text/label-lg` in the large size, `text/body-sm` for the description, `text/body-md` for the content).

There is no command output. The acceptance is a human observation, recorded in the json block above with the frame URL and the component set.

The rest of this file is the contract converted to text, so that whoever codes does not need to open Figma. Figma property and value names stay as they are in Figma, between backticks. Names of the pieces in Portuguese are between backticks only here; in the prose they are in English.

## Purpose

A trigger that opens and closes a block of content in the same place on the page. Open, the content pushes down what comes below and covers nothing. It starts closed. It hides the detail few people need: advanced settings, long notes, the log of an import, the steps of a vertical step-by-step. The property selection is the type (`linha`, `botao`, `previa`), the appearance (`flush`, `cartao`), the indicator (`fim`, `inicio`), `size`, open (`aberto`) and `state`. Title, description and start icon are texts and options of the trigger.

It does not replace the nph-popover (a layer that floats over the page and closes on outside click), the tabs of the nph-tabs (a switch between panels of the same level) or the accordion (a group of sections with an opening rule between them). Error, warning and a pending required field are not hidden in closed content. In a closed step, the trigger shows the pending item in the description, in text (for example "2 fields missing").

## Component set

| Set | Figma id | What it is |
|---|---|---|
| nph-collapsible (`nph-collapsible`) | `6006:2250` | `tipo` (`linha`, `botao`, `previa`) × `aparencia` (`flush`, `cartao`) × `indicador` (`fim`, `inicio`) × `size` (`default`, `compact`, `large`) × `aberto` (`nao`, `sim`) × `state` (`default`, `hover`, `foco`, `disabled`); layer properties: description on or off, start icon on or off, swap of the start icon, title text and description text. |

The root is `6005:482`. The matrix of the variants is the `Matriz — nph-collapsible` section (`6014:1693`) of the documentation frame.

## Tokens

Each component token points to the semantic token that already has the function, the same in light and dark.

| Token | Points to | Where it is used, and why |
|---|---|---|
| `collapsible/trigger-height` | `control/height-default` | Minimum height of the trigger in the default size; with a description it grows by the vertical padding. |
| `collapsible/trigger-height-compact` | `control/height-compact` | Minimum height of the trigger on a dense screen. Not for touch: there the default or the large applies. |
| `collapsible/trigger-height-large` | `control/height-large` | Minimum height of the enlarged trigger, a touch target. |
| `collapsible/trigger-padding-x` | `space/control-padding` | Side padding of the trigger. |
| `collapsible/trigger-padding-y` | `space/inline` | Top and bottom padding of the trigger in the default and large sizes. By decision, outside the letter of the semantic description. |
| `collapsible/trigger-padding-y-compact` | `space/inline-tight` | Top and bottom padding of the trigger in the compact size. By decision, outside the letter of the semantic description. |
| `collapsible/trigger-gap` | `space/inline-tight` | Gap between icon, title and indicator in the trigger; it also separates the indent from the body in the content, so the content lines up with the title. |
| `collapsible/title-gap` | `space/stack-snug` | Gap between the title and the description. |
| `collapsible/trigger-radius` | `radius/control` | Corner of the trigger. |
| `collapsible/trigger-background-hover` | `color/accent` | Background of the trigger in hover. |
| `collapsible/title-foreground` | `color/foreground` | Color of the title. |
| `collapsible/description-foreground` | `color/muted-foreground` | Color of the optional description. |
| `collapsible/indicator-foreground` | `color/muted-foreground` | Color of the indicator arrow. |
| `collapsible/icon-foreground` | `color/muted-foreground` | Color of the optional start icon. |
| `collapsible/indicator-size` | `icon/size-sm` | Size of the indicator; also the width of the content indent when the indicator is at the start. |
| `collapsible/icon-size` | `icon/size-sm` | Size of the start icon; also the width of the content indent when the start icon is on. |
| `collapsible/content-padding-x` | `space/control-padding` | Side padding of the open content, aligned with the trigger. By decision, outside the letter of the semantic description. |
| `collapsible/content-padding-top` | `space/stack-snug` | Space between the trigger and the open content (8 px, not 4 px), so the focus halo does not touch the content. By decision. |
| `collapsible/content-padding-bottom` | `space/control-padding` | Bottom padding of the open content. By decision, outside the letter of the semantic description. |
| `collapsible/content-gap` | `space/stack` | Gap between the blocks of the content body. |
| `collapsible/preview-gap` | `space/stack-tight` | Gap between the cut text and the "Show more" button, in the preview type. |
| `collapsible/card-background` | `color/card` | Background of the card appearance. |
| `collapsible/card-border` | `color/border` | Outline of the card appearance. Not used in the default (flush) appearance, which has no outline. |
| `collapsible/card-border-width` | `border/width` | Thickness of the card outline. |
| `collapsible/card-radius` | `radius/surface` | Corner of the card appearance. |
| `collapsible/card-padding` | `space/container-padding` | Inner padding of the card appearance. |
| `collapsible/disabled-opacity` | `state/disabled-opacity` | Opacity of the whole disabled collapsible. |
| `collapsible/expand-duration` | `motion/expand-duration` | Duration of the content growth and of the arrow turn on open and close. |
| `collapsible/expand-easing` | `motion/expand-easing` | Curve of the content growth and of the arrow turn. |
| `collapsible/focus-border` | `focus/border` | Focus border of the trigger; it is the part that meets 3:1. |
| `collapsible/focus-border-width` | `border/width` | Thickness of the focus border. |
| `collapsible/focus-border-radius` | `focus/border-radius-control` | Corner of the focus border. |
| `collapsible/focus-halo` | `focus/halo` | Focus halo of the trigger; decoration. |
| `collapsible/focus-halo-width` | `focus/ring-width` | Thickness of the focus halo. |
| `collapsible/focus-halo-radius` | `focus/radius-control-with-border` | Corner of the focus halo, around the border. |

Binding rules: no token points straight to core (rule 3 of T9) and none brings a new value (rule 4). The focus tokens of the component follow the accepted precedent of `stepper/focus-border` and `stepper/focus-border-radius`; the halo corner is `focus/radius-control-with-border`, the same as the nph-button. In the card, the focus stays on the trigger, not on the whole card. The card outline measures 1.69:1 in light and 3.53:1 in dark on `color/card`. It is an area outline, not a control outline: WCAG 1.4.11 does not ask for 3:1 on it; the focus border of the trigger is the part that does. A softer white border in dark mode would need a new semantic for all cards: a foundation task, outside this one.

## Anatomy

From top to bottom and, in the trigger, from the start to the end. Read by script from every master of the set. `collapsible/` is shortened to `c/` in this section. The pieces by instance (nph-icon, nph-button) use their own tokens, except where it is said.

### Type line (flush and card appearance; indicator at the end and at the start; sizes default, compact and large)

1. **Root** — vertical, height hugs the content. The width is fixed only in the Figma frame; in code the root takes the width of its container. Disabled: `opacity = c/disabled-opacity` on the whole collapsible. Card: padding `c/card-padding`, corner `c/card-radius`, outline `c/card-border` of `c/card-border-width`, background `c/card-background`. Flush: no background, no outline, no padding.
2. **Trigger** — horizontal, aligned to the start and centered vertically, takes the full width. Gap `c/trigger-gap`, side padding `c/trigger-padding-x`, vertical padding `c/trigger-padding-y` (default and large) or `c/trigger-padding-y-compact` (compact), corner `c/trigger-radius`, minimum height `c/trigger-height`, `c/trigger-height-compact` or `c/trigger-height-large`. Hover: background `c/trigger-background-hover`, on the trigger only. Open: the background does not change. With the indicator at the end the order is start icon (optional), title and description, indicator. With the indicator at the start the order is indicator, start icon (optional), title and description.
3. **Start icon** — nph-icon, optional (boolean property, off by default; the icon can be swapped). Size `c/icon-size`, vector color `c/icon-foreground`.
4. **Title and description** — vertical, takes the rest, gap `c/title-gap`.
   - **Title** — text style `text/label-md` (default and compact) or `text/label-lg` (large), color `c/title-foreground`.
   - **Description** — optional (boolean, off by default), takes the full width. Text style `text/body-sm` in every size, color `c/description-foreground`.
5. **Indicator** — nph-icon. At the end: `chevron-down`, closed at 0 degrees and open at 180 degrees. At the start: `chevron-right`, closed at 0 degrees and open at -90 degrees, pointing down. Size `c/indicator-size`, color `c/indicator-foreground`.
6. **Focus border** — absolute layer over the trigger, in the focus state: outline `c/focus-border` of `c/focus-border-width`, corner `c/focus-border-radius`.
7. **Focus halo** — absolute layer outside the border: outline `c/focus-halo` of `c/focus-halo-width`, corner `c/focus-halo-radius`.
8. **Content** — only when open; horizontal, takes the full width. Gap `c/trigger-gap`, side padding `c/content-padding-x`, top `c/content-padding-top`, bottom `c/content-padding-bottom`.
   - **Indicator indent** — only with the indicator at the start; width `c/indicator-size`.
   - **Icon indent** — only with the start icon on; width `c/icon-size`.
   - **Body** — vertical, takes the rest, gap `c/content-gap`. The **content text** is an example of the slot: `text/body-md`, `color/foreground`; the slot is free and has no component token.

### Type button (flush and card appearance; size default; indicator at the end)

1. **Trigger** — an `nph-button` instance, secondary ghost, default size, hugs the width, with the end icon `chevron-down` (closed) or `chevron-up` (open). States of the button: default, hover-active, focus, disabled. Tokens of the nph-button, including focus and the disabled opacity.
2. **Content** — equal to the content of the line type, without the icon and indicator indents.

### Type preview (flush and card appearance; size default)

1. **Root** — vertical, gap `c/preview-gap` between the text and the button.
2. **Content** — vertical, side padding `c/content-padding-x`. The **content text** is `text/body-md`, cut at three lines when closed and whole when open.
3. **Trigger** — an `nph-button` instance, secondary ghost, default size, below the text and aligned to the start, with the text "Show more" or "Show less". Tokens of the nph-button.

### Movement

`c/expand-duration` and `c/expand-easing`: the growth of the content and the turn of the arrow on open and close. There is no layer for it in Figma.

## Properties

| Field | Rule |
|---|---|
| type (`tipo`) | `linha` (default): the trigger is the whole row, with title and chevron. `botao`: an `nph-button` secondary ghost with the chevron at the end, to open details from an action. `previa`: the text appears cut at three lines and the "Show more" button opens the rest. |
| appearance (`aparencia`) | `flush` (default): no outline, separated by space. `cartao`: background `color/card`, outline `color/border`, corner `radius/surface`, for a block that needs to stand out from the page. |
| indicator (`indicador`) | `fim` (default): `chevron-down` after the title, turns 180 degrees. `inicio`: `chevron-right` before the title, turns 90 degrees; for steps and levels. Valid for the line type; the button and preview types use the chevron of the nph-button. |
| `size` | `compact`, `default` (default) and `large` change the minimum height of the trigger; in the large size the title uses `text/label-lg`. Valid for the line type; the button and preview types use the nph-button in the default size. |
| open (`aberto`) | `nao` (default) and `sim`. Opening does not change the background: the chevron turns and the content shows. |
| `state` | `default`; `hover` (background `color/accent` on the trigger: the whole row in flush; in the card, a pill inset by the card padding); `foco` (focus border and halo); `disabled` (opacity `state/disabled-opacity` on the whole component). In the button and preview types, hover, focus and disabled are those of the nph-button. |
| description | Turns on the support line under the title, with the description text. Off by default. |
| start icon | Turns on the icon before the title; swap it in the start icon layer, with an `nph-icon` light. Open, the content indents to the title. |
| title text and description text | Texts of the trigger. The title says what opens, in few words. |
| outside the properties | The content is a free slot, filled in use. The label of the button (button type) and the pair "Show more" and "Show less" (preview type) are the text of the nph-button. The animation and the `aria-controls` link stay with the code. |

## Relations

Combines with the nph-button (trigger of the button and preview types) and the nph-icon (indicator and start icon). Any piece goes inside the content: text, fields, actions, nph-skeleton while loading. The collapsible controls the chevron, the hover background, the focus of the trigger and the open state; each piece of the content follows its own color and focus rules.

| Between | Space |
|---|---|
| trigger and content | `space/stack-snug`, no divider. |
| icon or indicator and title | `space/inline-tight`. |
| title and description | `space/stack-snug`. |
| items inside the content | `space/stack`. |
| card border and trigger and content | `space/container-padding`. |
| preview: text and button | `space/stack-tight`. |
| one collapsible and the next | `space/stack`, in the same column and the same width; separate by space, with no divider. |

## When to use

- Use the flush line in a form and in settings: the detail goes away without changing the rhythm of the page.
- Use the card when the block needs to stand out from the background, such as a summary section inside the page.
- Use the indicator at the start in steps or levels, such as the vertical step-by-step; the indicator at the end is for the rest.
- Use the button type when the detail sits below a paragraph or an action ("Show details").
- Use the preview type for a long text whose first part already helps: a log, a note, a description.
- For a group of sections with a rule between them (one open at a time), use the accordion.

## Do

- Write the title with the name of what opens ("Advanced settings"), because people decide to open by the title.
- Start closed, because the component exists to keep what few people use.
- Stack several at `space/stack`, with no divider, because space already separates and the screen stays lighter.
- Turn the description on when the title is not enough to decide, because it avoids opening for nothing.
- Keep the whole trigger clickable, because the larger target is easier to hit with a mouse and with a finger.
- In the preview, show a text whose beginning already informs, because who reads the beginning may not need to open.

## Do not

- Do not hide an error, a warning or a pending required field in closed content. Instead keep it in view, on the screen, next to the field or the summary; in a closed step, show the pending item in the trigger, by the description, in text.
- Do not remove the indicator or leave only a clickable icon. Instead use the line type, with the chevron and the whole trigger clickable.
- Do not use it for an action menu or a detail that floats over the page. Instead use the nph-popover or the nph-dropdown-menu.
- Do not put an outline on every row of a form. Instead use the flush appearance and separate by space.

## Accessibility

| Criterion | Rule |
|---|---|
| contrast | Title, description and content text pass 4.5:1 on `color/background` and on `color/card`, in both themes. The indicator and the start icon, in `color/muted-foreground`, pass 3:1 (an icon that helps to understand the state). Measured: `color/foreground` 21:1 in light and 12.45:1 in dark on `color/card`; `color/muted-foreground` lowest 5.11:1 (dark, on the hover `color/accent`). |
| visible focus | By keyboard, the trigger shows the border `focus/border`, which passes 3:1 in both themes (5.37:1 in light and 7.59:1 in dark on `color/card`; 4.63:1 and 4.68:1 on the hover), and the halo `focus/halo` outside it. In the card, the focus is on the trigger, not on the whole card. The halo is support; the border meets the contrast. |
| color is not the only signal | Open and closed are told apart by the direction of the chevron and by the content in view, not by color. The hover background does not mark open or closed. |
| touch target | The trigger takes the whole row. The height comes from the size: `control/height-compact` (28), `control/height-default` (36) and `control/height-large` (44), all above the 24 px of WCAG 2.5.8. On a touch screen, prefer default or large. |
| accessible name | The trigger is a `button` with `aria-expanded` and `aria-controls` pointing to the content. The name read is the title; the description, if any, enters as the accessible description (`aria-describedby` or text inside the button; the choice stays with the code). The indicator and the start icon are decorative (`aria-hidden`). In the button and preview types, the name is the label of the nph-button. |
| keyboard and movement | Tab reaches the trigger; Enter and Space open and close. Closed content leaves the Tab order. It opens and closes in `motion/expand-duration`; with reduced motion, it opens with no animation. |

## Behavior

Base: the Disclosure pattern of the WAI-ARIA APG. The trigger is a `button` with `aria-expanded` and `aria-controls`. No deviation from the APG.

| Situation | Behavior |
|---|---|
| Initial state | Closed (`aberto` = `nao`). |
| Tab | Reaches the trigger. Closed, the content leaves the Tab order; open, Tab goes from the trigger into the content. |
| Enter and Space | Open and close. The focus stays on the trigger. |
| Arrows, Home and End | No effect: the APG disclosure does not use them. In a group with a rule between sections, it is the accordion. |
| Focus on open | Stays on the trigger; it does not jump to the content. |
| Focus on close | Stays on the trigger, which is what closes. |
| Esc | No effect: the content is not a layer over the page. |
| Outside click | Does not close: the content is part of the page. |
| Pointer and focus | Hover paints the background of the trigger (`color/accent`) and does not move the focus or open. A click on any point of the trigger opens and closes. |
| Disabled | Does not open or close and leaves the Tab order (`button` disabled). Open and disabled, the content stays in view, faded. |
| Near the window edge | Does not apply: it opens in place and pushes down what comes below; it does not flip, shrink or cut. |
| Page search | Recommended: closed content with `hidden="until-found"`, so the browser opens the content when the search finds the text inside it; the trigger becomes open. |
| Movement | Grows in `motion/expand-duration` with `motion/expand-easing`; with `prefers-reduced-motion`, it opens and closes with no animation. |
| Preview type | The text appears cut; the nph-button carries `aria-expanded` and `aria-controls` to the text and swaps "Show more" for "Show less" when it opens. |
| Code | Event, aria, slot, property and console warning stay with the code, following the APG and the Custom Elements Manifest. |

Combined states (rule T11): the collapsible has no selected, checked or error state, so rules 1 and 2 of T11 do not apply directly.

- By analogy with rule 1 (the state stays, under the opacity): open and disabled keeps the turned chevron and the content in view, under `state/disabled-opacity` (variants `aberto` = `sim` with `state` = `disabled`).
- A pending item in a closed step (error, warning or required field): the trigger shows it in the description, in text (for example "2 fields missing"); the content stays closed until the person opens it.
- The rule asks for no new token.

## Icon and image

- Indicator: `nph-icon` `chevron-down` (indicator at the end) and `chevron-right` (at the start), weight light in every state and size, in `icon/size-sm`. On open it turns 180 degrees (end) or 90 degrees (start); it does not swap to solid.
- Start icon: `nph-icon` light in `icon/size-sm`, color `color/muted-foreground`; the default is `gear` and it is swapped for another light `nph-icon`.
- Button and preview types: the chevron is the end icon of the nph-button (`chevron-down` closed, `chevron-up` open, light), with the color and the size of the nph-button.
- Image: the component has none.

## Inherited decisions

- Follows in part DSA-62 D-3: the chevron of the indicator at the end turns 180 degrees on open and, with reduced motion, nothing moves. It does not follow the rest: the indicator at the start turns 90 degrees (APG) and the content grows in `motion/expand-*`, not in `motion/enter-*` or `motion/exit-*`, because it is not a layer that appears.
- Same pattern as DSA-62 D-1 (family link): at a narrow width the trigger is a collapsed row with the arrow; a touch opens the content below and turns the arrow.
- Follows DSA-53 D-4 (accepted in DSA-72): what opens content is a disclosure, with `aria-expanded` and `aria-controls`.
- Does not follow DSA-67 D-2 (open trigger of a popover and dropdown menu in `button/secondary-solid-background-hover`): in a disclosure the content opens in place and the open state is neutral. The button type, open, stays ghost, with only the chevron swapped to `chevron-up`.
- Dependency recorded in DSA-73: the vertical stepper waits for the nph-collapsible.

## Decisions answered

1. Visual acceptance of the root (`6005:482`).
2. Documentation accepted (`6014:1688`).
3. The collapsible defines the anatomy and the values; the accordion item later becomes an instance of the collapsible, after both are accepted; nothing in the accordion changes now (Radix builds Accordion on Collapsible; React Aria does the same with Disclosure).
4. Card appearance outline: `color/border` at `border/width`; the default appearance (flush) has no outline. A softer white border in dark mode would need a new semantic for all cards: a foundation task, outside.
5. Keep `space/inline`, `space/inline-tight` and `space/control-padding` for the paddings, by decision.
6. `collapsible/content-padding-top` on `space/stack-snug` (8 px, not 4 px), so the focus ring does not touch the content.
7. The other tokens only alias a semantic; the component enters v1.

The fill-container width of the description layer and the open background were already closed. No open pending item of the component.

## Outside this task

The vertical stepper waits for this component (DSA-73); it is not changed by this task. The accordion is not changed by this task: its item becomes an instance of the collapsible later, after both are accepted. A softer outline for every card in dark mode, and a semantic for vertical padding and for panel padding, are foundation tasks.

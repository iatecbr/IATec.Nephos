---
piece: nph-button
level: component
status: active
solves: >-
  Gives the person a clear target to start an action on the screen they are on, and
  communicates through the type and the emphasis the weight of that action.
use_when:
  - "Starting an action identified by text, such as save or send."
  - "Highlighting the main action of a block over the alternatives, through emphasis."
  - "A universal action without text, such as close or search, with an accessible name and its tooltip."
  - "In the actions column of a table, even when the action leads to another screen, such as view details."
do_not_use_when:
  - "The person goes to another destination — that is navigation, not action."
  - "Showing a field error — validation belongs to the field, in nph-field."
  - "An action with a consequence, such as delete or publish, with an icon only outside the actions column of a table — write the text."
  - "Labeling a state — use nph-badge."
api:
  severity:
    type: enum
    values: [primary, secondary, info, warn, help, danger, success]
    required: false
    default: primary
    reflects: true
    constraint: >-
      The Figma type. Choose by the meaning of the action, never by the color.
      Reflects because the internal CSS selects the color by it. A value outside the list
      draws nothing and emits console.error in development.
  emphasis:
    type: enum
    values: [solid, outline, light, ghost]
    required: false
    default: solid
    reflects: true
    constraint: >-
      The Figma emphasis: how much the action stands out. outline, light and ghost only
      exist in primary, secondary and danger; in the other types, only solid.
      A combination outside that draws nothing and emits console.error in
      development.
  size:
    type: enum
    values: [compact, default, large]
    required: false
    default: default
    reflects: true
    constraint: >-
      The default value default comes from P68, through T4: compact stays
      tied to the dense context. large meets the touch target
      of 44 px; compact is never the main target on a touch screen. A field and a
      button side by side use the same size. A value outside the list draws
      nothing and emits console.error in development.
  text:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      What happens on click, already localized by the consuming application. It is the
      accessible name. It stays on one line. Without text, the button is the icon-only button.
  icon-start:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      A name from the nph-icon core before the text, in icon/size-sm. It can
      coexist with icon-end. The property is iconStart. A name outside the core
      draws nothing and emits console.error in development.
  icon-end:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      A name from the nph-icon core after the text, in icon/size-sm. The
      property is iconEnd. A name outside the core draws nothing and emits
      console.error in development.
  label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      Accessible name of the icon-only button, mandatory in it: without label, the icon-only button
      draws nothing and emits console.error in development. It is also the text of the
      nph-tooltip the icon-only button renders, which names the native button
      (relation name, P86): the name is announced once. With text, it is not
      used. The name label comes from P68 and supersedes the
      aria-label of 02-09-2026.
  disabled:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      Turns the button off: it leaves the Tab order, does not fire a click and stays at
      state/disabled-opacity. It is not the only sign: state the reason in text
      when there is one.
  loading:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      The Figma loading state. The nph-spinner spinner takes the place of the start
      icon, the end icon disappears and the text stays. The button remains focusable and the click
      does not reach the consumer.
  shape:
    type: enum
    values: [square, circular]
    required: false
    default: square
    reflects: true
    constraint: >-
      The Figma forma of the icon-only button (P86): square on radius/control or circular
      on radius/full. The size and the touch target do not change, and the focus border and
      halo follow the corners. Reflects because the internal CSS selects the corners by it.
      With text, only square: circular with text, or a value outside the list, draws nothing
      and emits console.error in development.
variants:
  severity:
    axis: appearance
    choose_when: "By the meaning of the action, never by the color. primary: use for the main action of the block. secondary: use for the alternative action that accompanies the main one, such as Cancel next to Save. danger: use for an action that deletes, revokes or cannot be undone. info: use for an action tied to neutral information, such as a system notice or a contextual tip. warn: use for an action that requires care before proceeding. help: use for an action that opens help or guidance, such as an explanation, a tour or support content. success: use for an action that confirms something succeeded. info, warn, help and success exist only in solid."
    do_not_combine_with:
      - "primary: do not use next to another primary solid action in the same block."
      - "secondary: do not use as the only main action of the block."
      - "danger: do not use with an icon only outside the actions column of a table: write the text."
      - "info: do not use for an error, a risk or a confirmation."
      - "warn: do not use for an error that has already happened; for an action that deletes or cannot be undone, use danger."
      - "help: do not use to report a system state."
      - "success: do not use to label a permanent state, such as active: use nph-badge."
  emphasis:
    axis: appearance
    choose_when: "solid for the action with weight; outline when it accompanies the main one and needs to be delimited; light when the outline would weigh too much; ghost for a tertiary action."
    do_not_combine_with: ["outline, light or ghost in info, warn, help or success"]
  shape:
    axis: appearance
    choose_when: "Only in the icon-only button. square, the default, or circular: a choice of context, with no fixed rule. The shape changes neither the size nor the touch target."
    do_not_combine_with: ["circular with text: the button with text is square"]
  size:
    axis: size
    choose_when: "compact (28 px): use inside a table, toolbar or filter. default (36 px): use everywhere else; it is the default. large (44 px): use on a touch screen and in the main form; it meets the 44 px touch target."
    do_not_combine_with:
      - "compact: do not use as the main target on a touch screen, or with a different size from the field beside it."
      - "default: do not use with a different size from the field beside it."
      - "large: do not use with a different size from the field beside it."
states:
  default:
    token: "the background and the text of the type and the emphasis, in the tokens block"
    changes_for_user: "Rest. The color communicates the type of the action."
  hover-active:
    token: "the hover token of the pair: color/*-hover and status/*-hover in solid; *-surface-hover and *-on-surface-hover in outline and light; the surface of the type in ghost. The start and end icons switch from light to solid, in the same color as the text of the type"
    changes_for_user: "The surface changes and the start and end icons turn solid, which confirms that the target responds."
  focus:
    token: "border border/width in the color of the type (focus/border in secondary) and halo focus/ring-width in focus/halo or `focus/halo-<matiz>`; in the circular shape both follow radius/full"
    changes_for_user: "For keyboard users, a border in the color of the action and a halo outside mark the focus, without changing the size."
  disabled:
    token: state/disabled-opacity
    changes_for_user: "The whole button loses opacity, leaves the Tab order and stops responding."
  loading:
    token: "the spinner inherits the color of the pair's text; no token of its own"
    changes_for_user: "The spinner takes the place of the start icon, the text stays and the click stops counting."
business_rules: []
domain_errors: []
tokens:
  height: [control/height-compact, control/height-default, control/height-large]
  padding: space/control-padding
  icon_text_gap: space/inline-tight
  radius: [radius/control, radius/full]
  text: text/label-md
  icon: [icon/size-sm, icon/size-md, icon/size-lg]
  disabled: state/disabled-opacity
  focus: [border/width, focus/border-radius-control, focus/ring-width, focus/radius-control-with-border, focus/border, focus/halo, focus/halo-info, focus/halo-warn, focus/halo-help, focus/halo-danger, focus/halo-success]
  solid_primary: [color/primary, color/primary-hover, color/primary-foreground]
  solid_secondary: [color/secondary, color/secondary-hover, color/secondary-foreground]
  solid_status: [status/info, status/info-hover, status/warning, status/warning-hover, status/help, status/help-hover, status/success, status/success-hover, status/on-solid]
  solid_danger: [color/destructive, color/destructive-hover, color/destructive-foreground]
  light_primary: [color/primary-surface, color/primary-surface-hover, color/primary-on-surface, color/primary-on-surface-hover]
  light_secondary: [color/muted, color/secondary-surface-hover, color/secondary-light, color/secondary-light-hover, color/secondary-foreground]
  light_danger: [color/destructive-surface, color/destructive-surface-hover, color/destructive-on-surface, color/destructive-on-surface-hover]
ai_hints:
  - "An action that happens on the screen is nph-button. Going to another destination is navigation, not a button."
  - "Choose severity by the meaning of the action, never by the color."
  - "One main action per block, in primary solid; the action beside it goes in secondary solid. Outline is not the default."
  - "Set size large on a touch screen and the same size as the field beside it."
  - "Without text, fill in label: it is the accessible name and the text of the tooltip the button renders."
  - "An action with a consequence has text, except in the actions column of a table, where the icon-only button and its tooltip give the name."
  - "While the action takes time, use loading instead of turning the button off without explanation."
  - "Do not choose the icon color: it inherits the text color."
accessibility:
  semantics: "A native button inside the component, with type=button. Never a div with a click. In loading, the native button carries aria-disabled and aria-busy."
  accessible_name: "The visible text. Without text, the label, mandatory, which is also the text of the nph-tooltip the button renders: the tooltip names the native button through aria-labelledby, and the name is announced once. On touch the tooltip does not open, so the icon-only button has no visible name there, an accepted exception: the icon must be easy to recognize, and an ambiguous action uses a button with text."
  keyboard:
    - "Tab enters and leaves the button."
    - "Enter activates."
    - "Space activates."
    - "In the icon-only button, keyboard focus opens the tooltip at once and Esc closes it; Enter and Space leave it alone."
  focus: "Keyboard only: a border in the color of the type, flush, and a halo outside, without changing the size. The border is the indicator. Known limit: in dark mode, color/primary falls below 3:1 against the background in `Gerencial`, `Recursos Humanos` and `Igrejas`; it is an open item."
  contrast: "Text and icon pass 4.5:1 in every type and emphasis, in both schemes and in every brand; the lowest value is 4.64:1, in primary outline and light of the light scheme. The outline border passes 3:1. The focus border of primary has the limit described in `focus`."
  color_alternative: "The text says what happens on click; color is never the only sign of intent, focus or state."
invalid_combinations:
  - "outline, light or ghost in info, warn, help or success — the matrix does not have them."
  - "Icon only without label — the screen reader would announce only button."
  - "Two icons without text — they do not state the action."
  - "Icon only in an action with a consequence, such as delete or publish, outside the actions column of a table — write the text."
  - "circular with text — the button with text is square."
  - "compact as the main target on a touch screen — 28 px against the recommended 44 px."
relations:
  combines_with: [nph-icon, nph-spinner, nph-tooltip, nph-input, nph-field]
  parents: ["form", "action bar", "dialog footer"]
  children: [nph-icon, nph-spinner, nph-tooltip]
  complements_block: []
  appears_in: []
anti_patterns:
  - "Showing a field error on the button."
  - "Using the button to navigate to another destination."
  - "Enlarging the icon to give emphasis."
  - "Using color as the only sign of intent, focus or state."
  - "Removing or redrawing the focus."
  - "Mixing sizes between a button and a field side by side."
  - "Painting the button by hand or creating a type, emphasis or size outside the matrix."
sources:
  design_md: "design.md, control/height-*, space/control-padding, space/inline-tight, radius/control, radius/full, text/label-md, icon/size-*, state/disabled-opacity, focus/* and the color/* and status/* colors of the tokens block"
  decision: "P68 — API and semantics of nph-badge and nph-button, 05-10-2026; B1, B5 and B6 of the `Registro de decisões` (Decision log); solid hover on the hover tokens, 02-10-2026; default size default and the name label, in P68; solid icon in hover-active, 21-10-2026; P86 — shape and tooltip of the icon-only button, which amends P68"
  tests: "src/components/nph-button/nph-button.test.ts, nph-button.first-tooltip.test.ts and nph-button.docs.test.ts"
  usage_evidence: "pending — no approved screen consumes the button yet"
  storybook: "src/components/nph-button/nph-button.stories.ts and nph-button.docs.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, nph-button frame 1197:5449 and sets 461:13009 and 498:15671; nph-icon-button board 2122:1591, frame 2128:3953"
---

# nph-button

## Function

**The problem it solves:** gives the person a clear target to start an action on the screen
they are on, and communicates through the type and the emphasis the weight of that action.

**When to use:**

- To start an action identified by text, such as save or send.
- To highlight the main action of a block over the alternatives, through emphasis.
- Without text, for a universal action, such as close or search, with an accessible name and its
  tooltip.
- In the actions column of a table, even when the action leads to another screen, such as view
  details.

**When NOT to use:**

- **To go to another destination** — that is navigation, not action.
- **To show a field error** — validation belongs to the field, in `nph-field`.
- **Icon only in an action with a consequence**, such as delete or publish, outside the actions
  column of a table — write the text.
- **To label a state** — use `nph-badge`.

## Variants

**By appearance:** `severity` (the Figma type) and `emphasis` (the emphasis).

- `severity` is chosen **strictly** by the meaning of the action, never by the color.
  `info`, `warn`, `help` and `success` exist only in `solid`.

| `severity` | When to use | When not to use |
|---|---|---|
| `primary` | Use for the main action of the block. | Do not use next to another `primary` `solid` action in the same block. |
| `secondary` | Use for the alternative action that accompanies the main one, such as Cancel next to Save. | Do not use as the only main action of the block. |
| `danger` | Use for an action that deletes, revokes or cannot be undone. | Do not use with an icon only outside the actions column of a table: write the text. |
| `info` | Use for an action tied to neutral information, such as a system notice or a contextual tip. | Do not use for an error, a risk or a confirmation. |
| `warn` | Use for an action that requires care before proceeding. | Do not use for an error that has already happened; for an action that deletes or cannot be undone, use `danger`. |
| `help` | Use for an action that opens help or guidance, such as an explanation, a tour or support content. | Do not use to report a system state. |
| `success` | Use for an action that confirms something succeeded. | Do not use to label a permanent state, such as active: use `nph-badge`. |

- `emphasis`: `solid` for the action with weight; `outline` when it accompanies the main one and
  needs to be delimited; `light` when the outline would weigh too much; `ghost` for a tertiary action.
  `outline`, `light` and `ghost` exist **only** in `primary`, `secondary` and `danger`.

**By size:** `compact` (28), `default` (36, the default) and `large` (44). `large`
meets the touch target of 44 px. `compact` stays tied to a table, toolbar
or filter and is never the main target on a touch screen (T4).

| `size` | When to use | When not to use |
|---|---|---|
| `compact` (28 px) | Use inside a table, toolbar or filter. | Do not use as the main target on a touch screen, or with a different size from the field beside it. |
| `default` (36 px) | Use everywhere else; it is the default. | Do not use with a different size from the field beside it. |
| `large` (44 px) | Use on a touch screen and in the main form; it meets the 44 px touch target. | Do not use with a different size from the field beside it. |

**By density:** `not_applicable`.

**Without text:** the button is the icon-only button (the `nph-icon-button` set in Figma) — a box at
the control height, with the icon following the box: `sm` in `compact`, `md` in `default` and `lg`
in `large`. Its `shape` is `square` (the default, on `radius/control`) or `circular` (on
`radius/full`), a choice of context with no fixed rule; the shape changes neither the size nor the
touch target, and the focus border and halo follow the corners. With text, the button is square.

**Tooltip:** every icon-only button renders its own `nph-tooltip` next to the native button, with the
`label` as its text. It opens at once on keyboard focus and after `motion/hover-delay` on hover, never
on touch, and a disabled button gets none; in `loading` the button keeps the focus and the tooltip. The
tooltip names the button (`relation` `name`), so the action name is announced once.

**Do not combine with:** another `primary` `solid` action in the same block; `compact` as the main
target on a touch screen; a size different from the field beside it.

## States

| State | Token | What changes for the person |
|---|---|---|
| `default` | the background and the text of the type and the emphasis | Rest. The color communicates the type of the action |
| `hover-active` | `color/*-hover` and `status/*-hover` in `solid`; `*-surface-hover` and `*-on-surface-hover` in `outline` and `light`; the surface of the type in `ghost`. The start and end icons switch from `light` to `solid` (the `variant` of `nph-icon`), in the same color as the text of the type | The surface changes and the icons turn solid, which confirms that the target responds |
| `focus` | border `border/width` in the color of the type (`focus/border` in `secondary`) and halo `focus/ring-width` in `focus/halo` or `focus/halo-<matiz>`; in the circular shape both follow `radius/full` | A border in the color of the action and a halo outside mark the focus, without changing the size |
| `disabled` | `state/disabled-opacity` | The whole button loses opacity, leaves the Tab order and stops responding |
| `loading` | the spinner inherits the text color | The spinner takes the place of the start icon, the text stays and the click stops counting |

**Feedback and focus:** focus appears only for keyboard users and **is not removed**. The
border is the indicator; the halo is the second layer. Known limit: in dark mode,
`color/primary` falls below 3:1 against the background in `Gerencial`, `Recursos Humanos` and
`Igrejas`, an open item.

**Business rule the piece carries:** `not_applicable`. The button fires the action the
screen defines.

**Domain error states:** `not_applicable`. An error belongs to the field, never to the button.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | A native button inside the component, with `type=button`. Never a `div` with a click. In `loading`, the native button carries `aria-disabled` and `aria-busy` |
| Accessible name | The visible text. Without text, the `label`, mandatory, which is also the text of the tooltip: the tooltip names the native button and the name is announced once. On touch the tooltip does not open, an accepted exception: the icon must be easy to recognize, and an ambiguous action uses a button with text |
| Keyboard | Tab enters and leaves; Enter and Space activate. In the icon-only button, focus opens the tooltip at once and Esc closes it |
| Focus | Keyboard only: a border in the color of the type and a halo outside, without changing the size. In dark mode, the border of `primary` falls below 3:1 against the background in `Gerencial`, `Recursos Humanos` and `Igrejas` (open item of 02-10-2026) |
| Contrast | Text and icon pass 4.5:1 in every type and emphasis, in both schemes and in every brand; the lowest value is 4.64:1, in `primary` `outline` and `light` of the light scheme. The `outline` border passes 3:1 |
| Alternative to color | The text says what happens on click; color is never the only sign |

## Relations

**Combines with:** `nph-icon`, `nph-spinner`, `nph-tooltip`, `nph-input` and `nph-field`.

**What is the parent:** form, action bar and dialog footer.

**What is the child:** `nph-icon`, through `icon-start` and `icon-end`, `nph-spinner`, in
`loading`, and, in the icon-only button, `nph-tooltip`, with the `label`. The button has no slot.

**Which block this piece complements:** none yet.

**Appears in layouts:** none yet.

## Tokens, intent and AI hints

| Part | Token |
|---|---|
| Height | `control/height-compact`, `-default` or `-large` |
| Side padding | `space/control-padding` |
| Space between icon and text | `space/inline-tight` |
| Radius | `radius/control`; `radius/full` in the circular icon-only button |
| Text | `text/label-md`, the same in every size |
| Icon | `icon/size-sm` with text; `sm`, `md` or `lg` in the icon-only button |
| `solid` | `color/primary`, `color/secondary`, `status/<matiz>` or `color/destructive`, with the hover and the text of the pair |
| `outline` | the light surface of the type, with the border and the text in the same color, inside |
| `light` | the light surface of the type, without a border |
| `ghost` | no background at rest; the surface of the type on hover |
| Focus | `border/width`, `focus/border-radius-control`, `focus/ring-width`, `focus/radius-control-with-border`, `focus/border`, `focus/halo` and `focus/halo-<matiz>` |

**Usage restrictions:** the component does not choose height, color, radius or typography: everything
comes from a token. In a part of the screen with another brand,
`data-nph-brand` and `data-nph-color-scheme` go on the same element (P67). The limit L-b is
in P68: the `use` of some tokens in `design.md` does not cite this usage yet.

**AI hints:**

- An action that happens on the screen is `nph-button`. Going to another destination is navigation, not a
  button.
- Choose `severity` by the meaning of the action, never by the color.
- One main action per block, in `primary` `solid`; the action beside it goes in `secondary` `solid`. `outline` is not the default.
- Set `size` `large` on a touch screen and the same size as the field beside it.
- Without text, fill in `label`: it is the accessible name and the text of the tooltip.
- An action with a consequence has text, except in the actions column of a table, where the
  icon-only button and its tooltip give the name.
- While the action takes time, use `loading` instead of turning the button off without explanation.
- Do not choose the icon color: it inherits the text color.

## Examples

**Recommended case:** in the footer of a form, "Save" in `primary` `solid` next to
"Cancel" in `secondary` `solid`, both in `size` `default`.

**Alternative case:** "Delete account" in `danger` `solid`, always with text; and, for the
universal close action, the icon-only button `xmark` in `secondary` `ghost`, with `label` "Close";
the actions of a table row, in `compact`, as three `secondary` `ghost` icon-only buttons; and a
circular icon-only button in `primary` `solid`.

## Anti-patterns

- **Do not show a field error on the button** — validation belongs to `nph-field`.
- **Do not use the button to navigate** to another destination.
- **Do not enlarge the icon** to give emphasis.
- **Do not use color as the only sign** of intent, focus or state.
- **Do not remove or redraw the focus.**
- **Do not mix sizes** between a button and a field side by side.
- **Invalid combinations:** `outline`, `light` or `ghost` in `info`, `warn`, `help` or
  `success`; icon only without `label`; two icons without text; icon only in an action with a
  consequence outside the actions column of a table; `circular` with text; `compact` as the main
  target on a touch screen.
- **Do not create without a decision:** a type, emphasis, size or color outside the matrix.

## Sources and decisions

- **The repository `design.md`:** `control/height-*`, `space/control-padding`,
  `space/inline-tight`, `radius/control`, `radius/full`, `text/label-md`, `icon/size-*`,
  `state/disabled-opacity`, `focus/*` and the colors `color/*` and `status/*`.
- **The decision that originated it:** P68, of 05-10-2026; B1, B5 and B6 of the `Registro de decisões` (Decision log);
  the default `size` `default` and the name `label`, in P68;
  the solid hover on the hover tokens, which supersedes B4. The frame was accepted
  on 01-10-2026 and completed on 02-10-2026. On 21-10-2026, Indiane decided that
  an action with an icon in an active state switches the icon from light to
  solid: in `hover-active`, the start and end icons turn solid, in the same color
  as the text of the type. P86 adds the `shape` of the icon-only button and its tooltip, from the
  `nph-icon-button` board accepted in Figma, with the textual audit approved.
- **Tests:** `src/components/nph-button/nph-button.test.ts`, `nph-button.first-tooltip.test.ts` and
  `nph-button.docs.test.ts`.
- **Usage evidence:** pending — no approved screen consumes the button yet.
- **Storybook:** `src/components/nph-button/nph-button.stories.ts` (Validation) and
  `nph-button.docs.stories.ts` (Docs).
- **Figma:** `nph-button` frame (`1197:5449`) and sets `461:13009` and `498:15671`, and the
  `nph-icon-button` board (`2122:1591`, frame `2128:3953`), in `DS-IA-NEPHOS 5.0`.

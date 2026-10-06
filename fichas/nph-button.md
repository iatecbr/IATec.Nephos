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
  - "A universal action without text, such as close or search, with an accessible name."
do_not_use_when:
  - "The person goes to another destination — that is navigation, not action."
  - "Showing a field error — validation belongs to the field, in nph-field."
  - "An action with a consequence, such as delete or publish, with an icon only — write the text."
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
      The default value default is a decision by Indiane on 05-10-2026, through T4: compact stays
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
      draws nothing and emits console.error in development. With text, it is not
      used. The name label is a decision by Indiane on 05-10-2026 and supersedes the
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
variants:
  severity:
    axis: appearance
    choose_when: "By the meaning of the action: danger for what deletes or cannot be undone; primary for the main action."
    do_not_combine_with: ["another primary solid action in the same block"]
  emphasis:
    axis: appearance
    choose_when: "solid for the action with weight; outline when it accompanies the main one and needs to be delimited; light when the outline would weigh too much; ghost for a tertiary action."
    do_not_combine_with: ["outline, light or ghost in info, warn, help or success"]
  size:
    axis: size
    choose_when: "large on a touch screen and in the main form; compact inside a table, toolbar or filter; default everywhere else."
    do_not_combine_with: ["compact as the main target on a touch screen", "a size different from the field beside it"]
states:
  default:
    token: "the background and the text of the type and the emphasis, in the tokens block"
    changes_for_user: "Rest. The color communicates the type of the action."
  hover-active:
    token: "the hover token of the pair: color/*-hover and status/*-hover in solid; *-surface-hover and *-on-surface-hover in outline and light; the surface of the type in ghost"
    changes_for_user: "The surface changes and confirms that the target responds."
  focus:
    token: "border border/width in the color of the type (focus/border in secondary) and halo focus/ring-width in focus/halo or `focus/halo-<matiz>`"
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
  radius: radius/control
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
  - "One main action per block; the others go in outline, light or ghost."
  - "Set size large on a touch screen and the same size as the field beside it."
  - "Without text, fill in label; an action with a consequence always has text."
  - "While the action takes time, use loading instead of turning the button off without explanation."
  - "Do not choose the icon color: it inherits the text color."
accessibility:
  semantics: "A native button inside the component, with type=button. Never a div with a click. In loading, the native button carries aria-disabled and aria-busy."
  accessible_name: "The visible text. Without text, the label, mandatory."
  keyboard:
    - "Tab enters and leaves the button."
    - "Enter activates."
    - "Space activates."
  focus: "Keyboard only: a border in the color of the type, flush, and a halo outside, without changing the size. The border is the indicator. Known limit: in dark mode, color/primary falls below 3:1 against the background in `Gerencial`, `Recursos Humanos` and `Igrejas`; the open item belongs to Indiane since 02-10-2026."
  contrast: "Text and icon pass 4.5:1 in every type and emphasis, in both schemes and in every brand; the lowest value is 4.64:1, in primary outline and light of the light scheme. The outline border passes 3:1. The focus border of primary has the limit described in `focus`."
  color_alternative: "The text says what happens on click; color is never the only sign of intent, focus or state."
invalid_combinations:
  - "outline, light or ghost in info, warn, help or success — the matrix does not have them."
  - "Icon only without label — the screen reader would announce only button."
  - "Two icons without text — they do not state the action."
  - "Icon only in an action with a consequence, such as delete or publish — write the text."
  - "compact as the main target on a touch screen — 28 px against the recommended 44 px."
relations:
  combines_with: [nph-icon, nph-spinner, nph-input, nph-field]
  parents: ["formulário", "action bar", "dialog footer"]
  children: [nph-icon, nph-spinner]
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
  design_md: "design.md, control/height-*, space/control-padding, space/inline-tight, radius/control, text/label-md, icon/size-*, state/disabled-opacity, focus/* and the color/* and status/* colors of the tokens block"
  decision: "P68 — API and semantics of nph-badge and nph-button, 05-10-2026; B1, B5 and B6 of the `Registro de decisões` (Decision log); solid hover on the hover tokens, 02-10-2026; default size default and the name label, decisions by Indiane on 05-10-2026"
  tests: "src/components/nph-button/nph-button.test.ts and nph-button.docs.test.ts"
  usage_evidence: "pending — no approved screen consumes the button yet"
  storybook: "src/components/nph-button/nph-button.stories.ts and nph-button.docs.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, nph-button frame 1197:5449 and sets 461:13009 and 498:15671"
---

# nph-button

## Function

**The problem it solves:** gives the person a clear target to start an action on the screen
they are on, and communicates through the type and the emphasis the weight of that action.

**When to use:**

- To start an action identified by text, such as save or send.
- To highlight the main action of a block over the alternatives, through emphasis.
- Without text, for a universal action, such as close or search, with an accessible name.

**When NOT to use:**

- **To go to another destination** — that is navigation, not action.
- **To show a field error** — validation belongs to the field, in `nph-field`.
- **Icon only in an action with a consequence**, such as delete or publish — write the text.
- **To label a state** — use `nph-badge`.

## Variants

**By appearance:** `severity` (the Figma type) and `emphasis` (the emphasis).

- `severity` is chosen **strictly** by the meaning of the action, never by the color.
- `emphasis`: `solid` for the action with weight; `outline` when it accompanies the main one and
  needs to be delimited; `light` when the outline would weigh too much; `ghost` for a tertiary action.
  `outline`, `light` and `ghost` exist **only** in `primary`, `secondary` and `danger`.

**By size:** `compact` (28), `default` (36, the default) and `large` (44). `large`
meets the touch target of 44 px. `compact` stays tied to a table, toolbar
or filter and is never the main target on a touch screen (T4).

**By density:** `not_applicable`.

**Without text:** the button is the icon-only button — square, at the control height, with the icon
following the box: `sm` in `compact`, `md` in `default` and `lg` in `large`.

**Do not combine with:** another `primary` `solid` action in the same block; `compact` as the main
target on a touch screen; a size different from the field beside it.

## States

| State | Token | What changes for the person |
|---|---|---|
| `default` | the background and the text of the type and the emphasis | Rest. The color communicates the type of the action |
| `hover-active` | `color/*-hover` and `status/*-hover` in `solid`; `*-surface-hover` and `*-on-surface-hover` in `outline` and `light`; the surface of the type in `ghost` | The surface changes and confirms that the target responds |
| `focus` | border `border/width` in the color of the type (`focus/border` in `secondary`) and halo `focus/ring-width` in `focus/halo` or `focus/halo-<matiz>` | A border in the color of the action and a halo outside mark the focus, without changing the size |
| `disabled` | `state/disabled-opacity` | The whole button loses opacity, leaves the Tab order and stops responding |
| `loading` | the spinner inherits the text color | The spinner takes the place of the start icon, the text stays and the click stops counting |

**Feedback and focus:** focus appears only for keyboard users and **is not removed**. The
border is the indicator; the halo is the second layer. Known limit: in dark mode,
`color/primary` falls below 3:1 against the background in `Gerencial`, `Recursos Humanos` and
`Igrejas`, an open item of Indiane since 02-10-2026.

**Business rule the piece carries:** `not_applicable`. The button fires the action the
screen defines.

**Domain error states:** `not_applicable`. An error belongs to the field, never to the button.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | A native button inside the component, with `type=button`. Never a `div` with a click. In `loading`, the native button carries `aria-disabled` and `aria-busy` |
| Accessible name | The visible text. Without text, the `label`, mandatory |
| Keyboard | Tab enters and leaves; Enter and Space activate |
| Focus | Keyboard only: a border in the color of the type and a halo outside, without changing the size. In dark mode, the border of `primary` falls below 3:1 against the background in `Gerencial`, `Recursos Humanos` and `Igrejas` (open item of 02-10-2026) |
| Contrast | Text and icon pass 4.5:1 in every type and emphasis, in both schemes and in every brand; the lowest value is 4.64:1, in `primary` `outline` and `light` of the light scheme. The `outline` border passes 3:1 |
| Alternative to color | The text says what happens on click; color is never the only sign |

## Relations

**Combines with:** `nph-icon`, `nph-spinner`, `nph-input` and `nph-field`.

**What is the parent:** form, action bar and dialog footer.

**What is the child:** `nph-icon`, through `icon-start` and `icon-end`, and `nph-spinner`, in
`loading`. The button has no slot.

**Which block this piece complements:** none yet.

**Appears in layouts:** none yet.

## Tokens, intent and AI hints

| Part | Token |
|---|---|
| Height | `control/height-compact`, `-default` or `-large` |
| Side padding | `space/control-padding` |
| Space between icon and text | `space/inline-tight` |
| Radius | `radius/control` |
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
- One main action per block; the others go in `outline`, `light` or `ghost`.
- Set `size` `large` on a touch screen and the same size as the field beside it.
- Without text, fill in `label`; an action with a consequence always has text.
- While the action takes time, use `loading` instead of turning the button off without explanation.
- Do not choose the icon color: it inherits the text color.

## Examples

**Recommended case:** in the footer of a form, "Save" in `primary` `solid` next to
"Cancel" in `secondary` `outline`, both in `size` `default`.

**Alternative case:** "Delete account" in `danger` `solid`, always with text; and, for the
universal close action, the icon-only button `xmark` in `secondary` `ghost`, with `label` "Close".

## Anti-patterns

- **Do not show a field error on the button** — validation belongs to `nph-field`.
- **Do not use the button to navigate** to another destination.
- **Do not enlarge the icon** to give emphasis.
- **Do not use color as the only sign** of intent, focus or state.
- **Do not remove or redraw the focus.**
- **Do not mix sizes** between a button and a field side by side.
- **Invalid combinations:** `outline`, `light` or `ghost` in `info`, `warn`, `help` or
  `success`; icon only without `label`; two icons without text; icon only in an action with a
  consequence; `compact` as the main target on a touch screen.
- **Do not create without a decision:** a type, emphasis, size or color outside the matrix.

## Sources and decisions

- **The repository `design.md`:** `control/height-*`, `space/control-padding`,
  `space/inline-tight`, `radius/control`, `text/label-md`, `icon/size-*`,
  `state/disabled-opacity`, `focus/*` and the colors `color/*` and `status/*`.
- **The decision that originated it:** P68, of 05-10-2026; B1, B5 and B6 of the `Registro de decisões` (Decision log);
  the default `size` `default` and the name `label`, decided by Indiane on 05-10-2026;
  the solid hover on the hover tokens, decided by Indiane on 02-10-2026, which supersedes
  B4. The frame was accepted on 01-10-2026 and completed on 02-10-2026.
- **Tests:** `src/components/nph-button/nph-button.test.ts` and `nph-button.docs.test.ts`.
- **Usage evidence:** pending — no approved screen consumes the button yet.
- **Storybook:** `src/components/nph-button/nph-button.stories.ts` (Validation) and
  `nph-button.docs.stories.ts` (Docs).
- **Figma:** `nph-button` frame (`1197:5449`) and sets `461:13009` and `498:15671` in
  `DS-IA-NEPHOS 5.0`.

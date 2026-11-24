---
piece: nph-carousel
level: component
status: active
solves: >-
  Shows a short sequence of slides of the same kind, one part at a time, for the person to go through at their
  own pace with arrows, indicators or by dragging.
use_when:
  - "For a short sequence of similar content where seeing one slide at a time is enough, such as an image gallery, featured cards or welcome steps."
  - "Peek when you want to make clear there are more slides: the edge of the neighbor invites the person to move on. It is the recommended layout."
  - "One slide when one at a time is enough; several when seeing some slides at once helps to choose."
  - "With three to five slides, keep the indicators; with more than five, the indicators go off and the counter comes on."
  - "Keep slides of the same kind and the same height, so the strip does not jump when the slide changes."
  - "Put the text below the image, not over it: the contrast over a photo is not guaranteed."
  - "Store the slide from the nph-slide-change event and give it back through index when the position has to be kept."
do_not_use_when:
  - "For a list or grid where the person needs to see or compare everything: show the items together."
  - "To split a long list into pages: use nph-pagination."
  - "To switch between named sections of a page: use nph-tabs."
  - "To show the progress of a task: use nph-progress."
  - "For two slides: show both together, side by side or in a list; only without room use arrows and indicators with two items."
  - "For important content: a slide out of view is rarely seen."
  - "For automatic rotation, a vertical carousel, thumbnails or wrap-around: they do not exist in v1."
  - "Turning arrows and indicators off together, or leaving the sequence with no indicators and no counter."
api:
  layout:
    type: enum
    values: [single, several, peek]
    required: false
    default: single
    reflects: true
    constraint: >-
      The Figma property `layout`. single is one whole slide at a time, as wide as the carousel; several shows as
      many whole slides as fit the carousel width, at least one, and a slide keeps the width of its content and
      is never cut; peek shows the whole current slide and the edge of the neighbor, carousel/peek-size wide.
      Reflects because the internal CSS selects the slide width by it. A value outside the list, or padded
      with whitespace, draws nothing and emits console.error in development.
  index:
    type: number
    required: false
    default: "0"
    reflects: true
    constraint: >-
      The first slide in view, counted from zero. In single and peek it is the current slide. In several the
      current page is derived from it, and a resize never rewrites it nor fires the event. A number out of range shows the
      nearest slide, and the property keeps what was written. Setting it from code never fires nph-slide-change.
  hide-arrows:
    type: boolean
    required: false
    default: false
    reflects: false
    constraint: >-
      The Figma boolean `setas` is on by default, so the property turns both arrows off. The property is
      hideArrows. With the arrows off and the indicators off there is only dragging left, and the carousel
      warns in development.
  hide-indicators:
    type: boolean
    required: false
    default: false
    reflects: false
    constraint: >-
      The Figma boolean `indicadores` is on by default, so the property turns the indicators off. The
      property is hideIndicators. Turn counter on when the indicators are off.
  counter:
    type: boolean
    required: false
    default: false
    reflects: false
    constraint: >-
      The Figma boolean `contador`. Shows "position of total" after the next arrow. With more than five pages it
      comes on by itself, in the several layout counting pages.
  label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The accessible name of the region, already localized, such as Photo gallery. Without it, the host
      aria-label is used; without both the carousel warns in development.
  previous-label:
    type: string
    required: false
    default: "by the language"
    reflects: false
    constraint: >-
      The name and the tooltip of the previous arrow. Without it, the default of the lang nearest to the carousel
      (Portuguese, English or Spanish), such as Previous slide. The property is previousLabel.
  next-label:
    type: string
    required: false
    default: "by the language"
    reflects: false
    constraint: >-
      The name and the tooltip of the next arrow, such as Next slide. The property is nextLabel.
  indicators-label:
    type: string
    required: false
    default: "by the language"
    reflects: false
    constraint: >-
      The name of the group of indicators, such as Choose a slide. The property is indicatorsLabel.
  slide-label:
    type: string
    required: false
    default: "by the language"
    reflects: false
    constraint: >-
      The name of an indicator, a template with the placeholders position and total in curly braces, such as Slide
      2 of 5. The property is slideLabel.
  page-label:
    type: string
    required: false
    default: "by the language"
    reflects: false
    constraint: >-
      The name of an indicator in the several layout, where each one stands for a page, a template with the
      placeholder position, such as Go to page 2. The property is pageLabel.
  position-label:
    type: string
    required: false
    default: "by the language"
    reflects: false
    constraint: >-
      The text of the counter and the name of each slide, a template with the placeholders position and total, such
      as 2 of 5. The property is positionLabel.
  slot:
    type: "default slot"
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The slides: the direct element children of the carousel, two or more, with free content. The carousel puts
      each one in its own box by manual slot assignment and writes no attribute on it. A slide has no
      background, outline or radius of its own: the content brings them. A text or a comment between the slides is
      not a slide. The carousel takes the width of its container; a slide keeps its own height.
  nph-slide-change:
    type: event
    required: false
    default: "none"
    reflects: false
    constraint: >-
      Fired when the person changes the slide, by arrow, indicator, key or drag, once per change. It bubbles,
      crosses the shadow root and is not cancelable. detail.index is the first slide in view. Setting index from
      code, and a resize, never fire it.
variants:
  layout:
    axis: appearance
    choose_when: "peek to show there are more slides, the recommended layout; single when one at a time is enough; several when seeing some slides at once helps to choose."
    do_not_combine_with: []
  controls:
    axis: appearance
    choose_when: "Arrows and indicators for three to five slides. Counter instead of the indicators above five pages. Arrows alone, or indicators alone, only when one of them is enough."
    do_not_combine_with:
      - "arrows and indicators both off: only dragging is left."
states:
  indicator:
    token: "carousel/indicator-background, carousel/indicator-size, carousel/indicator-target-size, carousel/indicator-radius, carousel/indicator-target-radius"
    changes_for_user: "A dot in a 24 by 24 target. The targets touch."
  indicator-current:
    token: "carousel/indicator-background-current, carousel/indicator-width-current"
    changes_for_user: "A wider pill in the brand color. It is the cue besides the color, and it has no hover."
  indicator-hover:
    token: carousel/indicator-target-background-hover
    changes_for_user: "The target of the other indicators gets a background. Hover does not move focus nor change the slide."
  indicator-focus:
    token: "focus/border, border/width, focus/halo, focus/ring-width"
    changes_for_user: "By keyboard, a border outside the target and a halo beyond it, with no hover background."
  arrow:
    token: "the tokens of nph-button secondary solid circular, and carousel/control-foreground for the icon"
    changes_for_user: "The icon-only button with a chevron. Hover turns the chevron solid."
  arrow-disabled:
    token: "state/disabled-opacity, from nph-button"
    changes_for_user: "At the start the previous arrow and at the end the next one lose opacity and leave the Tab order."
  counter:
    token: "carousel/counter-foreground, text/label-md"
    changes_for_user: "The text position of total, after the next arrow."
business_rules:
  - "There is no wrap-around: the arrow on the side with no slide is disabled."
  - "In single and peek a position is a slide. In several it is a page, of as many whole slides as fit the carousel width; the last page is aligned to the end, so it always shows whole slides."
  - "In peek the current slide shows whole and the edge of the next one after it, in the middle and at the start; at the end, the edge of the previous one before it. The neighbor at the edge is out of view and inert."
  - "A slide out of view is inert: its content leaves the Tab order and the accessibility tree. In several every whole slide in view counts as in view."
  - "Above five pages the indicators go off and the counter comes on by itself; with a single page there is nothing to go through, so no controls bar is drawn."
  - "A resize changes the pages but never rewrites index and never fires the event."
  - "A drag or swipe moves one step per gesture: past a quarter of a step, or a flick faster than 0.4 px per millisecond over at least 10 px. A drag shorter than 6 px is a click. The click that follows a drag does not reach the content. A drag that starts in a text field is left to the field."
  - "The slide change uses motion/state-duration and motion/state-easing and is instant under prefers-reduced-motion."
  - "Right-to-left text mirrors the slide order, the arrows, the keys and the drag."
domain_errors: []
tokens:
  indicator: "carousel/indicator-background, carousel/indicator-background-current, carousel/indicator-size, carousel/indicator-width-current, carousel/indicator-radius"
  indicator_target: "carousel/indicator-target-size, carousel/indicator-target-radius, carousel/indicator-target-background-hover"
  focus: "focus/border, border/width, focus/halo, focus/ring-width"
  arrow: "carousel/control-foreground; the rest is nph-button secondary solid circular"
  counter: "carousel/counter-foreground, text/label-md"
  spacing: "carousel/slide-gap, carousel/control-gap, carousel/controls-offset, carousel/peek-size"
  motion: "motion/state-duration, motion/state-easing"
ai_hints:
  - "Use nph-carousel for a short sequence of similar content seen one part at a time; for a list the person must compare, show the items together."
  - "Put the slides as direct children of the carousel and give it a label, already localized."
  - "Prefer layout peek for featured content, layout single when one at a time is enough, layout several when seeing some slides at once helps to choose."
  - "Keep the slides the same height and put text below the image, never over it."
  - "Keep at least one of the arrows and the indicators on; with more than five slides the counter replaces the indicators by itself."
  - "Give the names already localized, or rely on the lang of the page; the templates take position and total."
  - "Read the slide from detail.index of nph-slide-change, store it and give it back through index; the component keeps nothing."
  - "Do not ask for automatic rotation, a vertical carousel, thumbnails or wrap-around: they do not exist in v1."
accessibility:
  semantics: "A region with aria-roledescription carousel and a name. The track is aria-live polite. The indicators are a tablist of native buttons with role tab, aria-selected and aria-controls; each slide is a tabpanel with aria-roledescription slide named position of total (a group when there are no indicators). A slide out of view is inert."
  accessible_name: "The region takes label or the host aria-label. The arrows take previous-label and next-label, which become the aria-label of the button and the tooltip text, with the icon hidden. Each indicator is named Slide N of total; in the several layout each one is named Go to page N. The tablist is named by indicators-label."
  keyboard:
    - "Tab: the previous arrow, the indicators as one stop on the current one, and the next arrow, in this order; the links and buttons of the slide in view follow the content order."
    - "Enter or Space on an arrow goes to the previous or the next position."
    - "Left and Right on an indicator move the focus and show the slide; Home and End go to the first and the last. In right-to-left text the arrows mirror."
    - "Click or tap on an indicator shows its slide."
    - "Drag or swipe on the track changes the slide, never the only way."
    - "Focus stays on the control used. A disabled arrow leaves the Tab order; when the focused arrow becomes disabled at an end, the focus moves to the current indicator, or to the other arrow when the indicators are off."
  focus: "The arrow shows the focus of nph-button. The indicator shows a focus/border border outside its target and a focus/halo halo beyond it, with no hover background. The border passes 3:1 over color/background, color/card and color/muted in every brand and both schemes."
  contrast: "The current indicator and the arrow icon pass 3:1 over the surfaces named in the accepted frame; the counter passes 4.5:1. The non-current indicator (color/marker) passes 3:1 over color/background and color/card in light and dark, and over color/muted and the hover color/accent in light; in dark it is 2.59:1 over color/muted and 1.93:1 over the hover color/accent, below 3:1, accepted with the choice of the softer dot. The current indicator over the hover background fails, so the current one has no hover. The disabled arrow is exempt."
  color_alternative: "The current indicator is wider than the others, besides the color. The arrow on the side with no slide is disabled. The counter says the position in text."
invalid_combinations:
  - "A layout that is not single, several or peek — the carousel draws nothing and emits console.error in development."
  - "Fewer than two slides — it still renders and warns in development."
  - "A carousel with no label and no aria-label — it still renders and warns in development."
  - "Arrows off and indicators off together, or indicators off with no counter — it still renders and warns in development."
  - "Automatic rotation, a vertical carousel, thumbnails or wrap-around — they do not exist in v1."
relations:
  combines_with: [nph-button, nph-icon, nph-image, nph-skeleton]
  parents: ["a page or a card"]
  children: ["the slides, with free content", "nph-image for media and nph-skeleton while the content loads"]
  complements_block: []
  appears_in: []
anti_patterns:
  - "Turning arrows and indicators off together: only dragging is left, which not everyone can do."
  - "Leaving the sequence with no indicators and no counter: the person does not know where they are."
  - "Putting text over the photo: the contrast over a photo is not guaranteed."
  - "Hiding important content in a carousel: a slide out of view is rarely seen."
  - "Slides of different heights: the strip jumps when the slide changes."
  - "Using the carousel for two slides, a list or a grid."
  - "Using it for progress or named sections, where nph-progress and nph-tabs are the choice."
sources:
  design_md: "design.md, the carousel/* tokens, focus/border, border/width, focus/halo, focus/ring-width, motion/state-duration, motion/state-easing and text/label-md"
  decision: "P129 — API and semantics of nph-carousel, 18-11-2026"
  tests: "src/components/nph-carousel/nph-carousel.test.ts and nph-carousel.docs.test.ts"
  usage_evidence: "none in code yet; the accepted frame shows an image gallery in peek, featured cards in several and a sequence with the counter"
  storybook: "src/components/nph-carousel/nph-carousel.stories.ts and nph-carousel.docs.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, nph-carousel documentation frame 5173:1429, root 5164:663, set 5165:1094, indicators set 5164:771 and indicator set 5164:687"
---

# nph-carousel

## Function

**The problem it solves:** shows a short sequence of slides of the same kind, one part at a time, for the
person to go through at their own pace. It follows the WAI-ARIA APG Carousel pattern, with the indicators as a
tab group. The slide takes any approved content and has no background, outline or radius of its own.

**When to use:**

- For a short sequence of similar content where one slide at a time is enough: image gallery, featured cards,
  welcome steps.
- Peek when you want to make clear there are more slides; one slide when one at a time is enough; several when
  seeing some slides at once helps to choose.
- With three to five slides, keep the indicators; with more than five, the indicators go off and the counter
  comes on.
- Keep slides of the same kind and the same height, and put the text below the image.
- Store the slide from `nph-slide-change` and give it back through `index` when the position has to be kept.

**When NOT to use:**

- **For a list or a grid where the person needs to compare everything** — show the items together.
- **To split a long list into pages** — use `nph-pagination`.
- **To switch between named sections** — use `nph-tabs`.
- **To show the progress of a task** — use `nph-progress`.
- **For two slides** — show both together; only without room use arrows and indicators with two items.
- **For important content** — a slide out of view is rarely seen.
- **For automatic rotation, a vertical carousel, thumbnails or wrap-around** — they do not exist in v1.

## Variants

| Variant | Values | Choose when |
|---|---|---|
| `layout` | `single` (default), `several`, `peek` | `peek` to show there are more slides, the recommended layout; `single` when one at a time is enough; `several` when seeing some slides at once helps to choose |
| Controls | arrows, indicators and counter, each on or off | Arrows and indicators for three to five slides; the counter instead of the indicators above five pages |

`layout` is the Figma property `layout` (`único`, `vários`, `espiada`); the position is the Figma `posição` (`início`,
`meio`, `fim`) and comes from `index`; the arrows, the indicators and the counter are the booleans `setas`,
`indicadores` and `contador`. In code the first two are turned off with `hide-arrows` and `hide-indicators`.

**By size and density:** `not_applicable`. The carousel takes the width of its container and the arrow has the default
control height.

**Do not combine with:** arrows and indicators both off.

## States

| State | Token | What changes for the person |
|---|---|---|
| Indicator | `carousel/indicator-background`, `carousel/indicator-size`, `carousel/indicator-target-size` | A dot in a 24 by 24 target; the targets touch |
| Current indicator | `carousel/indicator-background-current`, `carousel/indicator-width-current` | A wider pill in the brand color, with no hover |
| Hover | `carousel/indicator-target-background-hover` | The target of the other indicators gets a background; it does not move focus |
| Focus | `focus/border`, `border/width`, `focus/halo`, `focus/ring-width` | By keyboard, a border outside the target and a halo beyond it |
| Arrow | the tokens of `nph-button`, `carousel/control-foreground` | The icon-only button with a chevron, solid in hover |
| Disabled arrow | `state/disabled-opacity`, from `nph-button` | At the start the previous arrow, at the end the next one, loses opacity and leaves the Tab order |
| Counter | `carousel/counter-foreground`, `text/label-md` | The text position of total |

**Feedback and focus:** hover only paints the target of the non-current indicator and the arrow background; it does
not move focus nor change the slide. Focus stays on the control used. When the focused arrow becomes disabled at an
end, the focus moves to the current indicator, or to the other arrow when the indicators are off; it is never lost.

**Business rule the piece carries:**

- There is no wrap-around: the arrow on the side with no slide is disabled.
- In `single` and `peek` a position is a slide; in `several` it is a page of as many whole slides as fit the
  width, and the last page is aligned to the end so it shows whole slides.
- In `peek` the neighbor at the edge is out of view: it is `inert`, and a click on it changes nothing.
- A slide out of view is `inert`; in `several` every whole slide in view is in view.
- Above five pages the indicators go off and the counter comes on by itself; with a single page no controls bar
  is drawn.
- A resize changes the pages but never rewrites `index` and never fires the event.
- A drag or swipe moves one step: past a quarter of a step, or a flick over 0.4 px per millisecond and at least
  10 px. Under 6 px it is a click, and the click that follows a drag does not reach the content.
- The slide change uses `motion/state-duration` and `motion/state-easing`, and is instant with reduced motion.
- Right-to-left text mirrors the order, the arrows, the keys and the drag.

**Domain error states:** none.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | A `region` with `aria-roledescription="carousel"`; the track is `aria-live="polite"`; the indicators are a `tablist` of `tab` buttons with `aria-selected` and `aria-controls`; each slide is a `tabpanel` with `aria-roledescription="slide"` named "position of total" (a `group` without indicators); a slide out of view is `inert` |
| Accessible name | `label` or the host `aria-label` names the region; the arrows take `previous-label` and `next-label`; each indicator is "Slide N of total", or "Go to page N" in the several layout |
| Keyboard | Tab: previous arrow, indicators (one stop), next arrow; Left and Right on an indicator show the slide, Home and End go to the ends; Enter or Space on an arrow; the focus stays on the control used |
| Focus | The arrow shows the `nph-button` focus; the indicator shows a `focus/border` border and a `focus/halo` halo, with no hover background |
| Contrast | The current indicator and the arrow icon pass 3:1; the non-current indicator (`color/marker`) passes 3:1 over `color/background` and `color/card`, and over `color/muted` and the hover `color/accent` in light, and is 2.59:1 and 1.93:1 over those two in dark; the counter passes 4.5:1; the current indicator over the hover background fails, so it has no hover; the disabled arrow is exempt |
| Alternative to color | The current indicator is wider; the disabled arrow shows the end; the counter says the position in text |
| Touch target | The indicator target is `carousel/indicator-target-size`, 24 by 24; the arrow has the default control height |
| Alternative to dragging | Arrows and indicators move the slide with one tap, so at least one of the two stays on (WCAG 2.5.7) |
| Motion | The slide change is instant under `prefers-reduced-motion`; there is no automatic rotation |

Known limits:

- The arrow keeps the native `disabled` of `nph-button`, so it leaves the Tab order at the ends. The APG would keep it
  focusable; that needs a change to `nph-button` and waits for the design owner (D-1 of DSA-87).
- The strip moves with a transform, so the new slide enters the accessibility tree when its box stops being `inert`;
  the polite announcement depends on the screen reader reading that change.
- The track clips the slides along the line only. A control flush against the left or right edge of a slide has its
  focus ring clipped there, so the content brings its own padding.
- The icon color of the arrow is set through the internal foreground variable of `nph-button`, which has no public
  hook; a test reads the computed color, so a rename in the button fails it.

## Relations

**Combines with:** `nph-button`, the two arrows, and `nph-icon`, the chevrons; `nph-image` for media and
`nph-skeleton` while the content loads, as the example slide shows.

**What is the parent:** a page, or a card; the carousel has no background or outline.

**What is the child:** the slides, with free content.

**Which block this piece complements:** none.

**Appears in layouts:** none.

## Tokens, intent and AI hints

| Part | Token |
|---|---|
| Indicator | `carousel/indicator-background`, `carousel/indicator-background-current`, `carousel/indicator-size`, `carousel/indicator-width-current`, `carousel/indicator-radius` |
| Indicator target | `carousel/indicator-target-size`, `carousel/indicator-target-radius`, `carousel/indicator-target-background-hover` |
| Focus | `focus/border`, `border/width`, `focus/halo`, `focus/ring-width` |
| Arrow | `carousel/control-foreground`; the rest is `nph-button` secondary solid circular |
| Counter | `carousel/counter-foreground`, `text/label-md` |
| Spacing | `carousel/slide-gap`, `carousel/control-gap`, `carousel/controls-offset`, `carousel/peek-size` |
| Motion | `motion/state-duration`, `motion/state-easing` |

**Usage restrictions:** the width of a slide is not a token: in `single` and `peek` it comes from the carousel and in
`several` from the content. The carousel takes the width of its container and has no background or outline.

**AI hints:**

- Use `nph-carousel` for a short sequence of similar content seen one part at a time; for a list the person must
  compare, show the items together.
- Put the slides as direct children of the carousel and give it a `label`, already localized.
- Prefer `layout="peek"` for featured content, `single` when one at a time is enough, `several` when seeing some
  slides at once helps to choose.
- Keep the slides the same height and put the text below the image.
- Keep at least one of the arrows and the indicators on; above five slides the counter replaces the indicators by
  itself.
- Give the names already localized, or rely on the `lang` of the page.
- Read the slide from `detail.index` of `nph-slide-change`, store it and give it back through `index`.
- Do not ask for automatic rotation, a vertical carousel, thumbnails or wrap-around: they do not exist in v1.

## Examples

**Recommended case:** an image gallery in `peek`, in the middle of the sequence, with arrows and indicators. The
edge of the next slide invites the person to move on. Each slide is an `nph-image` of the `media` size, ratio 16:9,
and its text below it.

**Alternative case:** featured cards in `several`, at the start, with the previous arrow disabled; and a sequence with
more slides than the indicators hold, where the counter says "2 of 8" and, in `several`, counts pages.

## Anti-patterns

- **Do not turn arrows and indicators off together** — only dragging is left; keep one of them on.
- **Do not leave the sequence without indicators and without counter** — the person does not know where they are.
- **Do not put text over the photo** — put it below the image.
- **Do not hide important content in a carousel** — a slide out of view is rarely seen.
- **Do not mix slides of different heights** — the strip jumps when the slide changes.
- **Do not use it for two slides, a list or a grid** — show the items together.
- **Do not use it for progress or named sections** — use `nph-progress` or `nph-tabs`.

## Sources and decisions

- **The repository `design.md`:** the `carousel/*` tokens, `focus/border`, `border/width`, `focus/halo`,
  `focus/ring-width`, `motion/state-duration`, `motion/state-easing` and `text/label-md`.
- **The decision that originated it:** P129, of 18-11-2026.
- **Tests:** `src/components/nph-carousel/nph-carousel.test.ts` and `nph-carousel.docs.test.ts`.
- **Usage evidence:** none in code yet. The accepted frame shows an image gallery in peek, featured cards in
  several and a sequence with the counter.
- **Storybook:** `src/components/nph-carousel/nph-carousel.stories.ts` and `nph-carousel.docs.stories.ts`.
- **Figma:** the documentation frame `5173:1429`, the root `5164:663`, the set `5165:1094`, the indicators set
  `5164:771` and the indicator set `5164:687` in `DS-IA-NEPHOS 5.0`.

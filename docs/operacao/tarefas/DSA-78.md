```json
{
  "id": "DSA-78",
  "goal": "Implement the nph-collapsible, a trigger that opens and closes a block of content in place, in the line, button and preview types, in the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 770,
  "owner": "elvys",
  "state": "in-review",
  "piece": "nph-collapsible",
  "dependencies": [
    "DSA-03",
    "DSA-13",
    "DSA-43"
  ],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-collapsible documentation in Figma was accepted by the design owner, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-78/figma-docs-accepted-2026-11-12.md",
      "result": "passed",
      "verified_at": "2026-11-12",
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
      "question": "The nph-button hands aria-expanded to its native button only with aria-haspopup, which draws the open look that DSA-67 D-2 forbids here, and an id does not cross its shadow root. P121 writes aria-expanded and ariaControlsElements from outside, into the native button of the nph-button. Does nph-button gain a forward of aria-expanded and aria-controls without the open look? Recommended: yes, as P111 did for aria-haspopup, in its own task. It does not block this task: the collapsible works today.",
      "decider": "indiane",
      "opened_at": "2026-11-13"
    },
    {
      "id": "D-2",
      "question": "The preview type lifts the cut at three lines with no movement, because a cut of lines is not a size that can grow. Does Indiane confirm the reading, or draw the movement? Recommended: confirm. It does not block this task.",
      "decider": "indiane",
      "opened_at": "2026-11-13"
    },
    {
      "id": "D-3",
      "question": "The preview type draws its Show more button even when the text has fewer than three lines, since the documentation does not say otherwise. Does the button go away when nothing is cut? Recommended: keep it, so the piece does not measure the text and the page owns the choice of the type. It does not block this task.",
      "decider": "indiane",
      "opened_at": "2026-11-13"
    },
    {
      "id": "D-4",
      "question": "The accepted documentation asks for the content to grow in motion/expand-*, and design.md (movimento_regras) says to animate only opacity and transform, and not width, height or layout position. The collapsible follows the documentation and animates the rows of one grid. Does Indiane confirm the reading, or does the rule get an exception for the expansion of a disclosure? Recommended: an exception, because a disclosure that pushes down what comes below cannot grow with transform alone. It does not block this task.",
      "decider": "indiane",
      "opened_at": "2026-11-13"
    }
  ],
  "evidence": [
    "docs/operacao/evidencias/DSA-78/figma-docs-accepted-2026-11-12.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, component code and specs belong to the code owner; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-12.md, nph-collapsible: visual acceptance of the root, documentation accepted, and the points of the approval answered (the collapsible defines the anatomy and the values, and the accordion item later becomes an instance of it, after both are accepted, with nothing in the accordion changed now; card outline in color/border at border/width and no outline in the default appearance; paddings kept on space/inline, space/inline-tight and space/control-padding; collapsible/content-padding-top on space/stack-snug so the focus ring does not touch the content; the other tokens only alias a semantic and the component enters v1)"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=6014-1688",
    "date": "2026-11-12",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-collapsible documentation frame (6014:1688, page 4128:35275) was accepted as the API and behavior specification of the nph-collapsible, with the visual acceptance of the root (6005:482). COMPONENT_SET nph-collapsible (6006:2250). The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": { "branch": "feat/dsa-78-collapsible", "commit": null, "pr": 170 },
  "context": "docs/operacao/contextos/DSA-78.md",
  "updated_at": "2026-11-12"
}
```

# DSA-78 — the nph-collapsible

## Goal
The `nph-collapsible` exists (`src/components/nph-collapsible/`), with spec, tests and stories, in the contract accepted in Figma: a trigger that opens and closes a block of content in the same place on the page. Open, the content pushes down what comes below and covers nothing. It starts closed. It has the types line, button and preview, the appearances flush (the default) and card, the indicator at the end or at the start, and sizes compact, default and large.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate: `docs/operacao/evidencias/DSA-78/figma-docs-accepted-2026-11-12.md`. It carries the Figma documentation converted to text, with the tokens, the anatomy part by part with the text style and the token of each layer, the default behavior, the combined states, the inherited decisions, the icon rules and the decisions answered. There is no need to open Figma.

## Specification to follow closely
- **Parts**: the root (flush, or card with outline, background, corner and padding), the trigger (optional start icon, title, optional description, indicator, focus border and focus halo), the content (indent for the indicator and for the start icon, and the body) and, in the button and preview types, the trigger as an `nph-button` instance. Bind every value to its `collapsible/*` token, never to the semantic it points to.
- **Types and properties**: type line (default), button and preview; appearance flush (default) and card; indicator at the end (default) or at the start; size compact, default (default) and large; open no (default) or yes; state default, hover, focus and disabled; optional description and optional start icon (default `gear`, swappable for another light `nph-icon`). Size and indicator apply to the line type only; the button and preview types use the `nph-button` in the default size.
- **Disclosure**: the trigger is a `button` with `aria-expanded` and `aria-controls` pointing to the content; the name is the title, and the description is the accessible description. The indicator and the start icon are `aria-hidden`. Closed content leaves the Tab order. Recommended: closed content with `hidden="until-found"`, so the page search opens it.
- **Keyboard**: Tab reaches the trigger; Enter and Space open and close; the focus stays on the trigger on open and on close. Arrows, Home, End and Esc have no effect, and an outside click does not close. A group with an opening rule between sections is the accordion, not this component.
- **Movement**: the content grows and the arrow turns in `collapsible/expand-duration` with `collapsible/expand-easing`; with reduced motion, no animation. The arrow at the end turns 180 degrees; the arrow at the start turns 90 degrees to point down.
- **Hover and open**: hover paints the trigger in `collapsible/trigger-background-hover` (the whole row in flush; a pill inset by the card padding in the card). Open does not change the background. Disabled fades the whole component with `collapsible/disabled-opacity`; open and disabled keeps the content in view, faded.
- **Focus**: the focus border and the halo go on the trigger, not on the whole card.
- **Content spacing**: the content starts `collapsible/content-padding-top` (8 px) below the trigger, so the halo does not touch it. With the start icon or the indicator at the start, the content indents by the size of each part plus the gap.
- **Preview type**: the text is cut at three lines when closed and whole when open; the `nph-button` carries `aria-expanded` and `aria-controls` and swaps "Show more" for "Show less".
- **What stays without a token of the component**: the trigger of the button and preview types is an `nph-button` instance (its own tokens, including focus and disabled); the icons are `nph-icon`; the text of the content slot is product content; the typography comes from text styles (`text/label-md`, `text/label-lg` in the large size, `text/body-sm` for the description, `text/body-md` for the content).
- **Limits**: error, warning and a pending required field are not hidden in closed content; in a closed step the trigger shows the pending item in the description, in text. The component has no image.

## Open points for the code
- Event, aria, slot, property and console warning, following the APG and the Custom Elements Manifest.
- Whether the description enters as `aria-describedby` or as text inside the button.
- How the content slot is filled and how the open state is controlled and reported.
- How the page search reaches the closed content (`hidden="until-found"`).

## Why it is ready
The tokens (`collapsible/*`) came with this task and are on `v/5.0.0`. All of them are aliases of semantic tokens. No new value entered the core. The pieces used by instance are done: nph-icon (DSA-03) and nph-button (DSA-13, DSA-43).

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS, tests, stories and spec pass the proof commands in `docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## What this task does not do
The code does not create a token or change a token value. It does not change Figma. It does not change the accordion: the accordion item becomes an instance of the collapsible later, after both are accepted. It does not build the vertical stepper.

## Outside this task
The vertical stepper waits for this component, as DSA-73 records; it is built in its own task after the collapsible is merged. Nothing in DSA-73 changes here. A semantic token for vertical padding and for panel padding, and a softer outline for every card in dark mode, are foundation tasks.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, documentation frame `6014:1688`, root `6005:482` and the evidence of the `figma-docs-accepted` gate
- Component set: nph-collapsible `6006:2250`
- WAI-ARIA APG, Disclosure pattern: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
- Radix Accordion, built on Collapsible: https://raw.githubusercontent.com/radix-ui/primitives/main/packages/react/accordion/src/accordion.tsx
- React Aria Disclosure: https://react-spectrum.adobe.com/react-spectrum/Disclosure.html
- Atlassian tokens: https://atlassian.design/components/tokens/all-tokens
- shadcn theming: https://ui.shadcn.com/docs/theming
- Atlassian spacing: https://atlassian.design/foundations/spacing
- Carbon spacing: https://carbondesignsystem.com/elements/spacing/overview/
- Carbon accordion style: https://carbondesignsystem.com/components/accordion/style/
- WCAG 2.2, Focus Not Obscured (Minimum): https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html
- Custom Elements Manifest: https://github.com/webcomponents/custom-elements-manifest
- `design.md` — the tokens named in the evidence
- `fichas/_modelo.md`

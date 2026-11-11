```json
{
  "id": "DSA-73",
  "goal": "Implement the nph-stepper, which shows the steps of a process in order and which one is current, in the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 720,
  "owner": "elvys",
  "state": "in-progress",
  "piece": "nph-stepper",
  "dependencies": [
    "DSA-03",
    "DSA-48",
    "DSA-65"
  ],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-stepper documentation in Figma was accepted by Indiane, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-73/figma-docs-accepted-2026-11-10.md",
      "result": "passed",
      "verified_at": "2026-11-10",
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
      "question": "Should the foundation fix the brand and error colors on color/dialog in dark, for every component on a dialog? Inside a dialog, in dark, some fall below the contrast minimum (status/error-text 3.62, color/primary-text 4.02, focus/border and the current ring 2.56, error background 2.61). The stepper keeps its tokens. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-11-10"
    },
    {
      "id": "D-2",
      "question": "The accepted contract says the stepper becomes nph-progress below 600 px. 600 is not one of the four breakpoints of design.md (md 768, lg, xl, xxl) and a query takes no custom property, so the code writes 37.5rem in a container query on the stepper, which reads its own width and not the window. Do you confirm the value, or choose another? It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-11-11"
    },
    {
      "id": "D-3",
      "question": "On the narrow width the stepper draws nph-progress of the steps type, which shows the position only: a step with an error does not show as an error there. Do you confirm it, or ask for the error status of the progress when a step has one? It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-11-11"
    },
    {
      "id": "D-4",
      "question": "The balloon of a cut label on a pending step of the linear stepper needs a focusable span with no role, which is the reading of a rule the evidence marks open for confirmation, and the hover background paints only the steps that can be activated. Do you confirm the reading, or ask for another? It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-11-11"
    },
    {
      "id": "D-5",
      "question": "The page may give a step a status that its position does not say, such as a pending step before the current one. The Figma draws only the position, and the connector follows the position too (brand before the current step, neutral after it). Do you confirm it, or ask for the connector to follow the status of the steps? It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-11-11"
    }
  ],
  "evidence": [
    "docs/operacao/evidencias/DSA-73/figma-docs-accepted-2026-11-10.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, component code and specs belong to the code owner; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-10.md, nph-stepper: visual acceptance, Figma UX QA and textual audit approved, documentation accepted (item 1), and items 2 to 10 of the approval page approved (marker size, current ring width, completed connector, text column width and minimum connector width, current label on two lines, narrow width as nph-progress, vertical after nph-collapsible, two steps allowed, the other tokens only alias a semantic token)"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=5569-6530",
    "date": "2026-11-10",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-stepper documentation frame (5569:6530, page 1626:36) was accepted as the API and behavior specification of nph-stepper. COMPONENT_SET nph-stepper (5541:1622), 27 variants; the step set (5540:581), 13 variants. The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": { "branch": "feat/dsa-73-stepper", "commit": null, "pr": null },
  "context": "docs/operacao/contextos/DSA-73.md",
  "updated_at": "2026-11-11"
}
```

# DSA-73 — nph-stepper, the steps of a process

## Goal
The `nph-stepper` exists in `src/components/nph-stepper/`, with a spec, tests and stories, in the contract accepted in Figma: the steps of a process in order, from two to seven, with the current one marked, the completed ones, the pending ones and the ones with an error, linear by default and non-linear as an option.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate: `docs/operacao/evidencias/DSA-73/figma-docs-accepted-2026-11-10.md`. It carries the Figma documentation converted to text, with the tokens of each part, the default behavior, the limits and the answers to the appendix points. There is no need to open Figma.

## Specification to follow closely
- **Parts**: the step (marker, text column with label, description and "Optional", step area, focus) and the connector between two steps. The step statuses are pending, current, completed and error; the states are rest, hover, focus and disabled; the current step has rest only.
- **Marker**: 24 circle (`stepper/marker-size`). Pending: muted background, 1 px outline and the number. Current: a 2 px ring in `stepper/marker-border-current` and the number in `stepper/marker-foreground-current`. Completed: the check on `stepper/marker-background-complete`. Error: the triangle on `stepper/marker-background-error`.
- **Width**: the text column stops at `stepper/text-max-width` (160). The label stays on one line and is cut with an ellipsis, with the whole text in nph-tooltip; on the current step it wraps to up to two lines and is never cut. The description goes up to two lines. The connector fills the space between steps and never gets narrower than `stepper/connector-min-width` (24).
- **Keyboard and roles** (W3C multi-page forms tutorial, APG Link pattern): `nav` with `aria-label` and an ordered list; only the clickable steps enter Tab, in list order; Enter activates (Space too on a button); arrow keys do nothing; the current step carries `aria-current="step"` and stays out of Tab; a disabled step carries `aria-disabled="true"` and stays out of Tab; a pending step of the linear stepper with a cut label enters Tab only to open nph-tooltip (inferred from the linear rule and DSA-48, open for confirmation: a non-link, Enter does nothing, tooltip tied with `aria-describedby`); the status is hidden text at the start of each step; the marker is `aria-hidden`.
- **Linear and non-linear**: linear by default, with the completed steps and the steps with an error clickable; non-linear, the pending steps are clickable too. The page sets the current step, the status of each step and which steps are clickable; the stepper keeps no state.
- **Hover and focus**: hover paints `stepper/item-background-hover` on the pending and completed steps; on the error step it only underlines the label, with no background. A focused step has no hover background. Focus: `stepper/focus-border` and `stepper/focus-ring`, outside the step area.
- **Combined states** (rule T11): completed + disabled keeps the background and the check under `stepper/item-disabled-opacity`; error + disabled, disabled wins: the marker goes back to the pending one and the reason shows only when the description is on; current + disabled does not apply; status + hover keeps the look of the status.
- **Narrow width**: below 600 px the stepper becomes nph-progress of the steps type, with "Step 2 of 4" and the current label (DSA-65).
- **Inherited decisions**: follows DSA-65 D-1 (two steps or more; the documentation asks for three to seven; seven is the maximum), DSA-62 D-5 (current number on `color/primary-text`), DSA-62 D-3 (reduced motion), DSA-48 D1 and the DSA-71 behavior for the cut label tooltip (wait on hover, none on focus, a click cancels the wait), the DSA-66 evidence for the current text (stronger weight, here `text/label-md-strong`). Does not follow the DSA-71 tab model nor DSA-66 D-1 (no collapsing).
- **Behavior from the Figma appendix (section D), not in the documentation frame**: Space on a link scrolls the page as the browser does; on a step change, the page moves the focus to the heading of the new step and updates the page title; Esc closes the cut label tooltip without moving the focus; nph-tooltip flips when it does not fit (Floating UI flip).
- **Icon and image**: `check` and `triangle-exclamation` from nph-icon, light weight, at `stepper/marker-icon-size`; the weight does not change on hover or focus. The number is text, `text/label-sm`. No image.

## Open points for the code
- The API that sets the steps, their labels, descriptions, optional mark and status, and how a step becomes clickable (link or button).
- The vertical stepper: not in this task. It waits for nph-collapsible; in Figma it is a skeleton.
- The hidden status text ("Completed", "Pending", "With error"), the word "Optional" and "Step 2 of 4" of the narrow width: who provides and translates them.
- Where `aria-current="step"` sits when the current step is not a link (the list item or a span), and whether the description and "Optional" go into the accessible name or `aria-describedby` of the step; the reason of an error must be read.
- The connector stays out of the accessibility tree (decorative, `aria-hidden`, no list item of its own).
- A current label longer than two lines: the documentation says it wraps to up to two lines, with no cut; labels are one or two words, so this is a misuse. Open question: does a description cut at the second line open a tooltip, or must the error reason fit in two lines?
- Whether hover on a disabled step with a cut label opens nph-tooltip (keyboard does not reach it; the screen reader gets the whole name).
- How the cut of a label is detected and checked again on resize.
- How the switch to nph-progress below 600 px is done (container width or breakpoint) and whether the stepper renders nph-progress itself or the product does.
- The wrapping of a two-line current label next to one-line neighbors: the steps stay aligned to the top.
- Event, aria, slot, property and console warning, following the APG and the Custom Elements Manifest.

## Why it is ready
The 40 `stepper/*` tokens came with this task and are on `v/5.0.0`, with the new `core/layout-width/stepper-text` (160). `stepper/marker-size`, `stepper/marker-border-width-current`, `stepper/connector-min-width` and `stepper/text-max-width` go straight to core by decision; the others alias an existing semantic token. No new semantic token. The pieces inside are done: nph-icon (DSA-03), nph-tooltip (DSA-48) and nph-progress (DSA-65).

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS, tests, stories and spec pass the proof commands in `docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## What this task does not do
The code does not create a token or change a token value. It does not change Figma. It does not change nph-icon, nph-tooltip or nph-progress. It does not build the vertical stepper. It does not fix the dialog contrast (D-1).

## Sources
- Figma `DS-IA-NEPHOS 5.0`, page `NPH — Stepper` (`1626:36`), documentation frame `5569:6530`
- Component sets: `nph-stepper` `5541:1622`, the step set `5540:581`
- W3C, multi-page forms tutorial: https://www.w3.org/WAI/tutorials/forms/multi-page/
- WAI-ARIA APG, Link pattern: https://www.w3.org/WAI/ARIA/apg/patterns/link/
- MDN, `aria-current`: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-current
- Floating UI, flip: https://floating-ui.com/docs/flip
- `design.md` — the tokens named in the evidence
- `fichas/_modelo.md`

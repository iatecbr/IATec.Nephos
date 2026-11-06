```json
{
  "id": "DSA-65",
  "goal": "Implement the nph-progress, the bar that shows how much of a long process is done, in the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 640,
  "owner": "elvys",
  "state": "in-progress",
  "piece": "nph-progress",
  "dependencies": [
    "DSA-03"
  ],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-progress documentation in Figma was accepted by Indiane, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-65/figma-docs-accepted-2026-11-05.md",
      "result": "passed",
      "verified_at": "2026-11-05",
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
  "pending_decisions": [],
  "evidence": [
    "docs/operacao/evidencias/DSA-65/figma-docs-accepted-2026-11-05.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, component code and specs belong to the code owner; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-05.md, nph-progress: visual acceptance, Figma UX QA and textual audit approved, documentation accepted, the 11 points of the approval page approved (1400 ms loop, 4 x 4 end stop on both sizes, fluid width, gaps in space/inline-tight and space/stack-tight, radius straight to core)"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=4385-3186",
    "date": "2026-11-05",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-progress documentation frame (4385:3186, page 1626:26) was accepted as the API and behavior specification of nph-progress. Component sets: nph-progress (4368:1532), 36 variants, and the nph-progress segment set (4368:1185), 8 variants. The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": { "branch": "feat/dsa-65-progress", "commit": null, "pr": null },
  "context": "docs/operacao/contextos/DSA-65.md",
  "updated_at": "2026-11-06"
}
```

# DSA-65 — nph-progress, progress bar

## Goal
The `nph-progress` exists in `src/components/nph-progress/`, with a spec, tests and stories, in the contract accepted in Figma: determinate, indeterminate and steps types, md and sm sizes, active, success and error status, the optional label, value text and help text, and the status icon on success and error.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate: `docs/operacao/evidencias/DSA-65/figma-docs-accepted-2026-11-05.md`. It carries the Figma documentation converted to text, with the tokens of each part and of each state, and the answers to the appendix points. There is no need to open Figma.

## Specification to follow closely
- **Width**: fluid, 100% of the container, with a minimum of 48 px. There is no width token; the 280 px in Figma is only a sample.
- **Indeterminate loop**: one pass in `progress/loop-duration` (1400 ms) with `progress/loop-easing` (linear), left to right, entering from the left edge and never shown stopped in the middle. A segment one third of the track. It runs only while there is no value and gives way to determinate at the first real value.
- **End stop**: `progress/stop-size` (4 x 4) on both sizes, never taller than the bar; shown on every determinate value below 100.
- **Track gap**: below 100, `progress/track-gap` separates the indicator from the rest of the track, so the indicator is slightly shorter than the exact proportion. The exact value is the text one.
- **Not focusable**: the bar has no hover, pressed or focus state and no focus ring.

## Why it is ready
The 27 `progress/*` tokens came with this task and are on `v/5.0.0`, with `motion/loop-long-duration`, `motion/loop-long-easing` and one core primitive (`core/duration/loop-long`, 1400 ms). This also answers the open point of PF-15 on the duration of the indeterminate bar; `docs/tokens.md` still says that bar has no value, so update that paragraph with the spec. The piece inside is done: nph-icon (DSA-03).

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS, tests, stories and spec pass the proof commands in `docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## What this task does not do
It does not create a token or change a token value. It does not change nph-icon, nph-spinner or any other piece. It does not build nph-stepper, a task list or a summary card. It does not change Figma.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, page `NPH — Progress` (`1626:26`), documentation frame `4385:3186`
- Component sets: nph-progress `4368:1532`; nph-progress segment set `4368:1185`
- `design.md` — the tokens named in the evidence
- `fichas/_modelo.md`

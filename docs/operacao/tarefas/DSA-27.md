```json
{
  "id": "DSA-27",
  "goal": "Implement the nph-switch, the switch that turns a setting on or off with an immediate effect, with the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 250,
  "owner": "elvys",
  "state": "ready",
  "piece": "nph-switch",
  "dependencies": [],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-switch documentation in Figma was accepted by Indiane, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-27/documentacao-figma-aceita-2026-10-08.md",
      "result": "passed",
      "verified_at": "2026-10-08",
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
    "docs/operacao/evidencias/DSA-27/documentacao-figma-aceita-2026-10-08.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, Elvys writes component code and specs; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-19.md, D2, D4 and the label side of D1 read from the accepted Figma set; the wrap of D1 and D3 answered by Indiane"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1549-2",
    "date": "2026-10-08",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-switch frame (1549:2) was accepted as the API and behavior specification of the nph-switch. COMPONENT_SET 1548:56. The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": {
    "branch": null,
    "commit": null,
    "pr": null
  },
  "context": null,
  "updated_at": "2026-10-19"
}
```

# DSA-27 — nph-switch, the on/off switch

## Goal
The `nph-switch` exists in `src/components/nph-switch/`, with a spec,
tests and stories, in the contract accepted in Figma.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate:
`docs/operacao/evidencias/DSA-27/documentacao-figma-aceita-2026-10-08.md`. It
carries the Figma documentation converted to text. There is no need to open Figma.

## Decisions answered
D1 to D4 are answered; the answers are in the evidence of the
`figma-docs-accepted` gate, section "Decisions answered". D2, D4 and the label
side of D1 come from the accepted Figma set, read variant by variant; the
wrapping of D1 and D3 was answered by Indiane.

| ID | Answer | What the code does |
|---|---|---|
| D1 | The label sits after the track, `space/inline` from it. The label wraps to the available width; with two lines, the track sits at the top, aligned with the first line. | Sets the order, the gap, top alignment and wrapping. |
| D2 | The focus border is the track's own outline, `border/width` in `focus/border`, with `radius/full`. The halo is `focus/ring-width` in `focus/halo`, outside the track, also `radius/full`. With an error and focus, the outline stays `status/error` and the halo is `focus/halo-error`. | Sets the focus outline and halo with `radius/full`. |
| D3 | The change from off to on, and back, animates: the knob slides by transform, not by layout position, and the track fill and outline change over `motion/state-duration` with `motion/state-easing`. Under `prefers-reduced-motion`, the knob does not slide: it changes side with an opacity transition over `core/duration/100`; the color change also uses `core/duration/100`, so the color still changes. | Adds the transition on `motion/state`, with reduced motion. |
| D4 | The outline is `border/width`, drawn inside the track box. On: `color/primary-border` by default, on hover (fill `color/primary-hover`) and disabled. Off: no outline by default, on hover (fill `color/input-hover`) and disabled. Error: `status/error`, on or off. Focus: `focus/border`, on or off. | Sets the outline of the track in each state. |

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS,
tests, stories and spec pass the proof commands in
`docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## What this task does not do
It does not create a token or change a token value.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, frame `1549:2` and set `1548:56`
- `design.md` — the tokens named in the evidence
- `fichas/_modelo.md`

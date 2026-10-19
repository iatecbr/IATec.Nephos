```json
{
  "id": "DSA-22",
  "goal": "Implement the nph-togglebutton, the button that holds a boolean value, with the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 200,
  "owner": "elvys",
  "state": "in-review",
  "piece": "nph-togglebutton",
  "dependencies": [],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-togglebutton documentation in Figma was accepted by Indiane, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-22/documentacao-figma-aceita-2026-10-07.md",
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
  "pending_decisions": [
    {
      "id": "D7",
      "question": "The evidence of D6 asks core/duration/100 for reduced motion. The component cannot consume core/* (design.md, rule 4, and A57) and uses --nph-motion-hover-duration, the semantic alias with the same value, 100 ms. Does Indiane approve that substitution, or create a semantic alias for it? It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-10-19"
    }
  ],
  "evidence": [
    "docs/operacao/evidencias/DSA-22/documentacao-figma-aceita-2026-10-07.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, Elvys writes component code and specs; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-19.md, Indiane answered D6 of the nph-togglebutton"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1512-27498",
    "date": "2026-10-07",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-togglebutton board (1512:27498) was accepted as the API and behavior specification of the nph-togglebutton. COMPONENT_SET 1512:719. The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": { "branch": "claude/dsa-22-nph-togglebutton-60e852", "commit": null, "pr": "https://github.com/iatecbr/IATec.Nephos/pull/87" },
  "context": "docs/operacao/contextos/DSA-22.md",
  "updated_at": "2026-10-19"
}
```

# DSA-22 — nph-togglebutton, the button that holds a boolean value

## Goal
The `nph-togglebutton` exists in `src/components/nph-togglebutton/`, with a spec,
tests and stories, in the contract accepted in Figma.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate:
`docs/operacao/evidencias/DSA-22/documentacao-figma-aceita-2026-10-07.md`. It
carries the Figma documentation converted to text. There is no need to open Figma.

## Decisions answered
D1 to D5 are answered by the accepted set: radii, padding, gaps, width, focus
radii and the icon swap are in the evidence of the `figma-docs-accepted` gate,
section "Measures and focus read from the set". D6 is answered in the section
"Motion" of the same evidence.

| ID | Answer | What the code does |
|---|---|---|
| D6 | The off-to-on change animates on `motion/state`: background, border and colors, with the icons cross-fading by opacity. Under reduced motion, `core/duration/100`, and color still changes. | Adds a transition on `motion/state-duration` and `motion/state-easing`, with the reduced-motion rule. |

## Pending decisions
The evidence gives the whole contract, so the code can start: the task stays in progress. One point remains for Indiane; the code follows the semantic alias meanwhile, and the answer only adjusts one declaration.

| ID | What the evidence gives | What is missing | What the code does with the answer |
|---|---|---|---|
| D7 | D6: under reduced motion the change uses `core/duration/100`, and color still changes. | A component cannot consume `core/*` (`design.md`, rule 4, and A57). The semantic alias `motion/hover-duration` has the same value, 100 ms, but pairs with `motion/state-easing`, which touches A58. | Either keeps `--nph-motion-hover-duration`, or consumes the new semantic alias Indiane creates. |

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS,
tests, stories and spec pass the proof commands in
`docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## What this task does not do
It does not create a token or change a token value. It does not create a size
property.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, board `1512:27498` and set `1512:719`
- `design.md` — the tokens named in the evidence
- `fichas/_modelo.md`

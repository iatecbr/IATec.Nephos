```json
{
  "id": "DSA-66",
  "goal": "Implement the nph-breadcrumb, the trail that shows the path to the current page and leads back to each level above, in the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 650,
  "owner": "elvys",
  "state": "in-progress",
  "piece": "nph-breadcrumb",
  "dependencies": [
    "DSA-03",
    "DSA-26",
    "DSA-45"
  ],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-breadcrumb documentation in Figma was accepted by Indiane, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-66/figma-docs-accepted-2026-11-06.md",
      "result": "passed",
      "verified_at": "2026-11-06",
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
    "docs/operacao/evidencias/DSA-66/figma-docs-accepted-2026-11-06.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, component code and specs belong to the code owner; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-06.md, nph-breadcrumb: visual acceptance, Figma UX QA and textual audit approved, documentation accepted, the 12 points of the approval page approved (128 menu floor and 24 target as new core values, 280 menu ceiling straight to core, menu width that hugs the content only in the breadcrumb, link kept as an inner piece, loading as a rule only)"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=4512-4741",
    "date": "2026-11-06",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-breadcrumb documentation frame (4512:4741, page 1626:13) was accepted as the API and behavior specification of nph-breadcrumb. Component sets: nph-breadcrumb (4490:2886), 8 variants; the nph-breadcrumb item set (4490:2678), 4 variants; the nph-breadcrumb ellipsis set (4490:2697), 4 variants; the nph-breadcrumb separator component (1635:16). The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": { "branch": "feat/dsa-66-breadcrumb", "commit": null, "pr": null },
  "context": "docs/operacao/contextos/DSA-66.md",
  "updated_at": "2026-11-06"
}
```

# DSA-66 — nph-breadcrumb, path to the current page

## Goal
The `nph-breadcrumb` exists in `src/components/nph-breadcrumb/`, with a spec, tests and stories, in the contract accepted in Figma: the trail with 2, 3 or 4 levels or collapsed, with or without icons; the item as link or current page; the ellipsis button that opens the hidden levels in an nph-dropdown-menu; and the separator between levels.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate: `docs/operacao/evidencias/DSA-66/figma-docs-accepted-2026-11-06.md`. It carries the Figma documentation converted to text, with the tokens of each part and of each state, and the answers to the appendix points. There is no need to open Figma.

## Specification to follow closely
- **Hidden levels menu width**: it hugs the widest option, with `min-inline-size: var(--nph-breadcrumb-menu-min-width)` (128 px) and `max-inline-size: var(--nph-breadcrumb-menu-max-width)` (280 px); a label longer than the ceiling is cut with an ellipsis. A Figma frame shows one width at a time, so the hug between floor and ceiling lives in the code. It holds only in the breadcrumb for now; nph-dropdown-menu keeps its fixed 280 until a round of its own.
- **Ellipsis target**: the ellipsis button is `breadcrumb/ellipsis-target-size` (24 x 24), the WCAG 2.5.8 minimum.
- **One line**: the trail never wraps. On a narrow screen the page uses the collapsed trail.
- **Right-to-left writing**: the separator mirrors.
- **Loading**: no loading state in the piece; while the page loads, a line nph-skeleton takes the place of the trail.

## Why it is ready
The 22 `breadcrumb/*` tokens came with this task and are on `v/5.0.0`, with two new core primitives (`core/layout-width/menu-min`, 128, and `core/target-size/minimum`, 24) and five core primitives that Figma had and the code did not (`core/size/200`, `core/line-height/200`, `core/tracking/normal`, `core/weight/regular` and `core/weight/medium`). The pieces inside are done: nph-icon (DSA-03), nph-skeleton (DSA-26) and nph-dropdown-menu (DSA-45).

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS, tests, stories and spec pass the proof commands in `docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## What this task does not do
It does not create a token or change a token value. It does not change nph-dropdown-menu, nph-icon, nph-skeleton or any other piece it uses: the menu radius and the focus border of the menu item are reviewed in a round of nph-dropdown-menu itself. It does not build an nph-link. It does not change Figma.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, page `NPH — Breadcrumb` (`1626:13`), documentation frame `4512:4741`
- Component sets: nph-breadcrumb `4490:2886`; item set `4490:2678`; ellipsis set `4490:2697`; separator `1635:16`
- `design.md` — the tokens named in the evidence
- `fichas/_modelo.md`

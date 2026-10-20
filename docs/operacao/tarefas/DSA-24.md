```json
{
  "id": "DSA-24",
  "goal": "Implement the nph-avatar, which shows who the person is by photo or, without a photo, by the person icon, with the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 220,
  "owner": "elvys",
  "state": "in-review",
  "piece": "nph-avatar",
  "dependencies": [],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-avatar documentation in Figma was accepted by Indiane, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-24/documentacao-figma-aceita-2026-10-06.md",
      "result": "passed",
      "verified_at": "2026-10-06",
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
      "id": "D5",
      "question": "May the `use` text in design.md be widened for the tokens the avatar consumes beyond what it names today? These are avatar/radius-* (already also consumed by nph-skeleton, DSA-26 D2, and by the avatar-stack count, DSA-25), color/muted, color/muted-foreground, color/border (its do-not-use text says form field border) and icon/size-sm|md|lg (md says not inside a button with text; lg not on dense screens). It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-10-20"
    }
  ],
  "evidence": [
    "docs/operacao/evidencias/DSA-24/documentacao-figma-aceita-2026-10-06.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, Elvys writes component code and specs; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-19.md, Indiane answered D1 to D4 of the nph-avatar"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1434-30",
    "date": "2026-10-06",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-avatar frame (1434:30) was accepted as the API and behavior specification of the nph-avatar. COMPONENT_SET 1434:29. The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": {
    "branch": "claude/dsa-24-nph-avatar-9feadc",
    "commit": null,
    "pr": "https://github.com/iatecbr/IATec.Nephos/pull/90"
  },
  "context": "docs/operacao/contextos/DSA-24.md",
  "updated_at": "2026-10-20"
}
```

# DSA-24 — nph-avatar, the picture of a person

## Goal
The `nph-avatar` exists in `src/components/nph-avatar/`, with a spec,
tests and stories, in the contract accepted in Figma.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate:
`docs/operacao/evidencias/DSA-24/documentacao-figma-aceita-2026-10-06.md`. It
carries the Figma documentation converted to text. There is no need to open Figma.

## Decisions answered
D1 to D4 are answered; the answers and the measures read from Figma are in the
evidence of the `figma-docs-accepted` gate, sections "Measures and tokens" and
"Decisions answered".

| ID | Answer | What the code does |
|---|---|---|
| D1 | `nph-icon` `user`, style `light`. | Fixes the name and variant of the inner `nph-icon`. |
| D2 | `sm` takes `icon/size-sm`, `md` takes `icon/size-md`, `lg` takes `icon/size-lg`. | Sets the size of the inner `nph-icon` per avatar size. |
| D3 | While the photo loads, the person icon shows, as in `sem foto`. If the photo fails, the icon stays. | Renders the icon until the image loads, and keeps it on error. |
| D4 | `border/width` in `color/border`, inside the frame and drawn over the photo. | Draws the border above the image, so it stays visible. |

## Pending decisions
The evidence gives the whole contract, so the code can start: the task stays in progress. One point remains for Indiane; the code keeps working with the current tokens meanwhile, and the answer only touches the `design.md` text, never a token value.

| ID | What the evidence gives | What is missing | What the code does with the answer |
|---|---|---|---|
| D5 | The tokens the avatar consumes: `avatar/size-*`, `avatar/radius-*`, `color/muted`, `color/muted-foreground`, `color/border`, `border/width` and `icon/size-*`. | The `use` text in `design.md` does not name the avatar for `color/muted`, `color/muted-foreground`, `color/border` (its do-not-use text says form field border) and `icon/size-*` (`md`: not inside a button with text; `lg`: not on dense screens). `avatar/radius-*` says "only in nph-avatar", but `nph-skeleton` (DSA-26 D2) and the avatar-stack count (DSA-25) also consume it. | Nothing changes in the component: it keeps consuming these tokens. The answer decides whether `design.md` is widened, and the sheet quotes the final text. |

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS,
tests, stories and spec pass the proof commands in
`docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## What this task does not do
It does not create a token or change a token value.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, frame `1434:30` and set `1434:29`
- `design.md` — the tokens named in the evidence
- `fichas/_modelo.md`

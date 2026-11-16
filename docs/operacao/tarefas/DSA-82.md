```json
{
  "id": "DSA-82",
  "goal": "Apply in the code the answers Indiane gave on 2026-11-16 to the pending decisions of DSA-71 to DSA-80 that change the code, so the shipped components match the decided contract.",
  "phase": "F4",
  "approved_order": 810,
  "owner": "elvys",
  "state": "ready",
  "piece": null,
  "dependencies": [
    "DSA-13",
    "DSA-28",
    "DSA-48",
    "DSA-71",
    "DSA-73",
    "DSA-76",
    "DSA-79"
  ],
  "gates": [
    {
      "id": "review-and-merge",
      "description": "Each change in the table of this task is in the code, with tests, stories and specs updated, passes the proof commands and is merged into v/5.0.0.",
      "command": null,
      "evidence": null,
      "result": "pending",
      "verified_at": null,
      "verified_by": null
    }
  ],
  "blockers": [],
  "pending_decisions": [],
  "evidence": [],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, component code and specs belong to the code owner; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-09.md, Indiane asked for one new task with the code changes instead of reopening the done ones (DSA-70)",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-16.md, Indiane answered part of the pending decisions of DSA-71 to DSA-80 in the chat, delegated the technical rest to Claude (market research with sources), and released recording the answers in the tasks and opening this task"
  ],
  "external_origin": null,
  "git_review": { "branch": null, "commit": null, "pr": null },
  "context": null,
  "updated_at": "2026-11-16"
}
```

# DSA-82 — Apply the pending decisions answered on 2026-11-16

## Goal
Each change in the table below is in the code of its piece, with its tests, stories and spec. The answers live in the original tasks, section "Decisions answered on 2026-11-16", which stay as they are; this task carries the code work, so no done task is reopened.

## What changes
| Piece | Source | What the code does |
|---|---|---|
| nph-tooltip, nph-tabs | DSA-71 D-1 | nph-tooltip opens on the hover of an element that is not a Tab stop and on the focus the arrow keys give. The cut tab keeps `tabindex="-1"`: the code no longer gives it `tabindex="0"` under the pointer. |
| nph-stepper | DSA-73 D-4 | The cut label of a pending step of the linear stepper is a focusable element with a role and `aria-disabled`, not a span with no role; its balloon comes from the nph-tooltip change above. The hover background stays only on the steps that can be activated. |
| nph-tabs | DSA-71 D-2 | `scroll-previous-label` and `scroll-next-label` stay and override a default name (pt-BR `Rolar para a esquerda` and `Rolar para a direita`). The arrows draw with the default when the product gives no text; how the default is localized is the code owner's choice. |
| nph-button, nph-file-upload | DSA-74 D-2 | nph-button gains a description property that it forwards as `aria-describedby` inside its shadow root; the zone of nph-file-upload passes its rule and its reason to the Choose files button through it. |
| nph-file-upload, nph-field | DSA-74 D-4 | The reason of the error shows once, in the zone, in place of the rule. If nph-field draws its own message line under the zone, that line goes away; the message keeps describing the group. |
| nph-sidebar | DSA-76 D-3 | When the product sends a new current page, its parent groups open. A group the person closed stays closed only while the current page is the same. |
| docs | DSA-79 D-1 | P122 cites GOV.UK accessible-autocomplete as the support for "a click does not open the list"; the APG autocomplete example opens the list on click and is no longer cited for it. |
| docs | All the answers of 2026-11-16 | In `docs/decisoes-tecnicas.md`, the lines of P115 (DSA-71), P116 (DSA-72), P117 (DSA-73), P118 (DSA-75), P119 (DSA-74), P120 (DSA-77), P121 (DSA-78), P122 (DSA-79), P123 (DSA-80) and P124 (DSA-76) that still say a point waits for Indiane are updated for the points answered; the points still open keep the wording. |

## How it is proved
**`review-and-merge`** passes when each row of the table is in the code, with the tests and stories of each piece updated and its spec in `fichas/` saying the same; the proof commands in `docs/operacao/component-handoff.md` exit 0; and the work is merged into `v/5.0.0`.

## What this task does not do
It does not create or change a token. It does not answer the points still open in DSA-71 to DSA-80: they wait for previews in Figma and come in another task when answered. It does not change the gate `stroke-style-token` of DSA-74. DSA-74 is not a dependency: its code is already merged into `v/5.0.0` (PR 168) and it stays `in-review` only for that token gate, so the nph-file-upload rows start from the merged code.

## Sources
- `docs/operacao/tarefas/DSA-71.md`, `DSA-73.md`, `DSA-74.md`, `DSA-76.md` and `DSA-79.md`, sections "Decisions answered on 2026-11-16"
- `docs/operacao/component-handoff.md`
- `docs/decisoes-tecnicas.md` (P119, P122, P124)

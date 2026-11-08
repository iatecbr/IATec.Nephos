```json
{
  "id": "DSA-68",
  "goal": "Implement the nph-hover-card, the read-only preview card anchored to a link, in the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 670,
  "owner": "elvys",
  "state": "done",
  "piece": "nph-hover-card",
  "dependencies": [
    "DSA-03",
    "DSA-12",
    "DSA-24",
    "DSA-51"
  ],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-hover-card documentation in Figma was accepted by Indiane, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-68/figma-docs-accepted-2026-11-06.md",
      "result": "passed",
      "verified_at": "2026-11-06",
      "verified_by": "indiane"
    },
    {
      "id": "review-and-merge",
      "description": "Component, CSS, tests, stories and spec pass the proof commands and are merged into v/5.0.0.",
      "command": "git merge-base --is-ancestor 08aee1e2bc6446628e350314a075af21ba7b3ff5 origin/v/5.0.0",
      "evidence": "docs/operacao/evidencias/DSA-68/review-and-merge-2026-11-08.md",
      "result": "passed",
      "verified_at": "2026-11-08",
      "verified_by": "claude-code"
    }
  ],
  "blockers": [],
  "pending_decisions": [
    {
      "id": "D-1",
      "question": "The accepted Figma set has no slot for the avatar, the image and the badge of the three required examples (they are by instance). The code adds an optional slot media at the start of the card so the examples can be built with the real piece. Whether the slot exists, and where it sits in the card, needs her answer. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-11-07"
    },
    {
      "id": "D-2",
      "question": "The contract defines the arrow at 16 from the card corner and says nothing about how the card aligns to the link when there is no arrow. The code uses the same rule with and without the arrow, so the card does not move when the arrow is turned on. Whether the card without the arrow aligns another way, such as centered on the link, needs her answer. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-11-07"
    },
    {
      "id": "D-3",
      "question": "Point 9 of the contract names only the Gerencial brand for the contrast of the link in dark (2.71:1). The Brands story measured the link in color/primary below 4.5:1 in the dark scheme of other brands too (up to 3.81:1). The fix belongs to color/primary of each brand; the code does not change it and the Brands story carries the contrast exception. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-11-07"
    },
    {
      "id": "D-4",
      "question": "When no side fits the card in a window too short for it, the code keeps the card beside the link, never over it, so the link stays reachable, and the window cuts what does not fit; the card does not scroll, because the contract says the description wraps with no scrolling. Whether such a window needs another fallback, such as a maximum height with scrolling, needs her answer. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-11-07"
    }
  ],
  "evidence": [
    "docs/operacao/evidencias/DSA-68/figma-docs-accepted-2026-11-06.md",
    "docs/operacao/evidencias/DSA-68/review-and-merge-2026-11-08.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, component code and specs belong to the code owner; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-06.md, nph-hover-card: visual acceptance, Figma UX QA and textual audit approved, documentation accepted, the 10 points of the approval page approved (radius 14, offset 4, arrow tokens of the popover, width 320, color/subtle-foreground, 8 between texts, delays 600 and 300, relative time up to 30 days, clock icon); a finished component enters the first version"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=4422-2418",
    "date": "2026-11-06",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-hover-card documentation frame (4422:2418, page 4128:31754) was accepted as the API and behavior specification of nph-hover-card. Component set: nph-hover-card (4406:1105), 10 variants. The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": { "branch": "feat/dsa-68-hover-card", "commit": "08aee1e2bc6446628e350314a075af21ba7b3ff5", "pr": 157 },
  "context": null,
  "updated_at": "2026-11-08"
}
```

# DSA-68 — nph-hover-card, read-only preview anchored to a link

## Goal
The `nph-hover-card` exists in `src/components/nph-hover-card/`, with a spec, tests and stories, in the contract accepted in Figma: a read-only card that previews the destination of a link, opened by the pointer resting on the link or by keyboard focus, with an optional arrow on four sides and an optional meta line.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate: `docs/operacao/evidencias/DSA-68/figma-docs-accepted-2026-11-06.md`. It carries the Figma documentation converted to text, with the tokens of each part, and the answers to the appendix points. There is no need to open Figma.

## Specification to follow closely
- **Read only**: no button, link or field inside the card; the card takes no focus. Everything the card shows also exists at the destination.
- **Opening**: the pointer resting on the link opens the card after `hover-card/open-delay` (600 ms); it closes `hover-card/close-delay` (300 ms) after the pointer leaves the link and the card. Keyboard focus on the link opens it with no wait, and Esc closes it (WCAG 1.4.13).
- **Touch**: there is no hover on touch; tapping the link follows it to the destination.
- **Offset**: 4 from the link to the card, with and without the arrow (`hover-card/offset`); with the arrow, 4 to the arrow tip.
- **Meta time**: relative up to 30 days ("Updated today", "3 days ago"), then the full date; a time as "14:30"; the full date always in `title`.
- **Arrow and meta icon**: decorative (`aria-hidden`).

## Changes outside the new piece
- **design.md**: new `color/subtle-foreground` (third level of text) with a reciprocal `nao_use` on `color/muted-foreground`; `motion/hover-delay` gains a `nao_use` pointing to `hover-card/open-delay`. No other component changes on screen.

## Why it is ready
The 23 `hover-card/*` tokens came with this task and are on `v/5.0.0`, with one new semantic token (`color/subtle-foreground`) and one new core primitive (`core/duration/delay-long`, 600 ms). The pieces inside are done: nph-icon (DSA-03); and, in the required examples only, nph-badge (DSA-12), nph-avatar (DSA-24) and nph-image (DSA-51).

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS, tests, stories and spec pass the proof commands in `docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## What this task does not do
It does not create a token or change a token value. It does not load remote content into the card (out of the first version). It does not change Figma.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, page `NPH — Hover Card` (`4128:31754`), documentation frame `4422:2418`
- Component set: nph-hover-card `4406:1105`; examples `4406:1107`, `4406:1130` and `4406:1151`
- `design.md` — the tokens named in the evidence
- `fichas/_modelo.md`

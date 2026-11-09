```json
{
  "id": "DSA-45",
  "goal": "Implement the nph-dropdown-menu, the floating menu of secondary actions that opens attached to a button, with its item, group label, separator and profile header, in the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 460,
  "owner": "elvys",
  "state": "done",
  "piece": "nph-dropdown-menu",
  "dependencies": ["DSA-17", "DSA-27"],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-dropdown-menu documentation in Figma was accepted by Indiane, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-45/documentacao-figma-aceita-2026-10-21.md",
      "result": "passed",
      "verified_at": "2026-10-21",
      "verified_by": "indiane"
    },
    {
      "id": "review-and-merge",
      "description": "Menu, item, parts, the right-from-bracket icon in nph-icon, CSS, tests, stories and spec pass the proof commands and are merged into v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-45/review-and-merge-2026-10-26.md",
      "result": "passed",
      "verified_at": "2026-10-26",
      "verified_by": "claude-code"
    }
  ],
  "blockers": [],
  "pending_decisions": [
    {
      "id": "D-3",
      "question": "On item hover, the evidence asks the nph-checkbox box and the nph-switch track to take their own hover (unchecked: `color/input-hover`, for 3:1 on `color/primary-surface`). Both pieces hover only through `:hover` inside their own shadow root and have no way to force it. The code ships without the forced hover, as a known limit, with a follow-up task for an API in the two pieces. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-10-24"
    }
  ],
  "evidence": [
    "docs/operacao/evidencias/DSA-45/documentacao-figma-aceita-2026-10-21.md",
    "docs/operacao/evidencias/DSA-45/review-and-merge-2026-10-26.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, Elvys writes component code and specs; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-20.md, nph-dropdown-menu modernized: item hover in color/primary-surface, focus border and halo, color/dropdown-border only for the dropdown",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-21.md, nph-dropdown-menu visual acceptance, tag, switch and profile header, Figma UX QA approved, documentation accepted, textual audit approved, right-from-bracket icon and the 4 tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-21.md, solid icon in the active state: in the item hover, type default, start icon and submenu arrow turn solid in dropdown/item-hover-icon-foreground",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-09.md, Indiane answered lot 2 of the pending decisions (approval page of 2026-11-09, Figma frame 5404:10452); code changes in DSA-70"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1365-118",
    "date": "2026-10-21",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-dropdown-menu board (1365:118), with its `Documentação` frame (2365:3685), was accepted as the API and behavior specification of the nph-dropdown-menu. Menu 1365:63; item COMPONENT_SET 1365:57; parts 1365:58 (group label), 1365:60 (separator) and 2359:47364 (profile header). The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": {
    "branch": "claude/dsa-45-nph-dropdown-menu-6256e3",
    "commit": "4c4ff5a887c26f2257573082fb874d1ee7617475",
    "pr": "https://github.com/iatecbr/IATec.Nephos/pull/118"
  },
  "context": null,
  "updated_at": "2026-11-09"
}
```

# DSA-45 — nph-dropdown-menu, the floating menu of secondary actions

## Goal
The `nph-dropdown-menu` exists in `src/components/nph-dropdown-menu/`, with its
item, group label, separator and profile header, a spec, tests and stories, in
the contract accepted in Figma.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate:
`docs/operacao/evidencias/DSA-45/documentacao-figma-aceita-2026-10-21.md`. It
carries the Figma documentation converted to text, with the tokens of each part.
There is no need to open Figma.

## Why it is ready
The item uses the `nph-checkbox` (DSA-17) in multiple choice and the
`nph-switch` (DSA-27) in the switch option. B1 is closed: DSA-27 became `done`
after the merge of PR #108, and DSA-17 on 2026-10-24, after the merge of
PR #117. With every dependency `done`, the task is `ready`.

Every token it uses is on `v/5.0.0`: the 4 new tokens (3 semantic and 1
primitive) were taken to the token sources, to `tokens.css` and to `design.md`
together with this task, and `dropdown/item-hover-icon-foreground` was added on
2026-10-21 with the solid icon rule. The other pieces it uses are done: `nph-button`
(DSA-13), `nph-icon` (DSA-03), `nph-badge` (DSA-12), `nph-avatar` (DSA-24),
`nph-separator` (DSA-10) and `nph-spinner` (DSA-09).

## Included in this task: the right-from-bracket icon
The Sair (sign out) item uses `right-from-bracket`, new in the Figma `nph-icon`
catalog, light and solid. Add it to
`src/components/nph-icon/nph-icon.icons.ts` in the pattern of
`right-to-bracket`, from `@fortawesome/pro-light-svg-icons` and
`@fortawesome/pro-solid-svg-icons`. The evidence, section "Icons", says where
else the name goes.

## Decisions answered on 2026-11-09 (lot 2)
Indiane answered D-1, D-2, D-4, D-5 and D-6 on the approval page of 2026-11-09 (Figma frame `5404:10452`, lot 2 of the pending decisions). D-3 stays open: it is a technical choice of the code.

| ID | Answer | What the code does |
|---|---|---|
| D-1 | Accepted: `space/inline-tight` (4 px) between the trigger and the open menu, as the nph-select list (shadcn and Primer default). | Nothing changes. |
| D-2 | Accepted: the menu fades and slides `space/inline-tight` on enter (`motion/enter-*`) and on exit (`motion/exit-*`), as shipped. | Nothing changes. |
| D-4 | Option 2 of the approval page: a small size of nph-switch, with a track that fits the 20 px slot, so every row keeps its height. The small size was drawn in Figma and comes with its own tokens. | Changes in DSA-70. The spec is in "D-4: the small nph-switch" below. |
| D-5 | Accepted: only the checked item of single choice takes the brand text color, `text/label-md` and the check, as the accepted Figma draws it; the other items of the group stay common. | Nothing changes. |
| D-6 | Exception to the code: the pointer over an item moves the keyboard focus to it, and the keyboard goes on from that item (Radix: the highlighted item is the focused item). | Changes in DSA-70. |

## D-4: the small nph-switch (Figma documentation accepted on 2026-11-09)
Indiane chose option 1 of the Figma preview frame `5433:13774` (track 32 by 16)
and accepted the `nph-switch` documentation with the small size (board
`1549:2`). This section is the contract; there is no need to open Figma.

**What changes in the code.** The `nph-switch` gains a small size. In the
switch slot of the item (`interruptor`), the item uses the small `nph-switch`,
without a label. The slot stays 20 px high, the track no longer overflows it
and the row keeps its height in every size of the item. The name of the size
API (attribute and values) is a choice of the code; in Figma it is the variant
`tamanho` = `padrão` (default) | `pequeno` (small).

| Part | Default size | Small size |
|---|---|---|
| Track | 40 by 24: `switch/track-width` by `icon/size-lg` | 32 by 16: `switch/track-width-sm` by `switch/track-height-sm` |
| Knob | 16: `icon/size-sm` | 12: `switch/thumb-size-sm` |
| Gap between track and knob | 4: `space/inline-tight` | 2: `switch/track-padding-sm` |
| Label, when shown | `text/label-md`, `space/inline` from the track | the same; the piece is 20 high and the track is vertically centered |

**Tokens (T9: component → semantic → primitive; new values first in core).**

| Token | Points to | Value |
|---|---|---|
| `switch/track-width-sm` | `core/layout-width/switch-track-sm` (new) | 32 |
| `switch/track-height-sm` | `icon/size-sm` | 16 |
| `switch/thumb-size-sm` | `core/icon-size/50` (new) | 12 |
| `switch/track-padding-sm` | `core/space/50` | 2 |

**What stays the same in both sizes.** Colors, states (default, hover, focus,
error, error-focus, disabled), focus border and halo, `radius/full` and
`border/width`. The knob travel follows the same rule: track width minus knob
minus twice the gap.

**When to use.** Small only inside the `nph-dropdown-menu` item, whose switch
slot is 20 px high. Everywhere else, the default size. Do not use the small
size outside the menu item: alone, its target is below 24 by 24 (WCAG 2.5.8).
Inside the item, the whole row is the target, above 24 by 24 in every size.

**Accessible name.** In the item, the switch has no label. The name read
comes from the item label, as the evidence of the `figma-docs-accepted` gate
already says (section "Accessibility", row "Accessible name").

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — menu, item, parts,
the icon, CSS, tests, stories and spec pass the proof commands in
`docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## Pending decisions
The evidence gives the contract, so the code can start. This table keeps the
defaults given at handoff. Indiane answered D-1, D-2, D-4, D-5 and D-6 on
2026-11-09 (section "Decisions answered on 2026-11-09 (lot 2)"); only D-3 stays
open, and the code follows its default meanwhile.

| ID | What the evidence gives | What is missing | What the code does meanwhile |
|---|---|---|---|
| D-1 | The menu opens attached to a button. | The distance between the trigger and the menu. | `space/inline-tight`, as the list of `nph-select`. |
| D-2 | Opening and closing belong to code. | The motion. | Fade and a slide of `space/inline-tight` on `motion/enter-*` and `motion/exit-*`, as the list of `nph-select`. |
| D-3 | On item hover, the box and the track take their own hover. | A way to force the hover of `nph-checkbox` and `nph-switch` from outside. | Ships without it, as a known limit; a follow-up task gives the two pieces an API. |
| D-4 | The switch sits in a 20 px slot. | The switch track is 24 high and has no size. | Superseded by the answer of 2026-11-09: the slot uses the small nph-switch (section "D-4: the small nph-switch"). |
| D-5 | Single choice highlights text and icon in `color/primary-hover`. | Whether it is every item of the group or the checked one. | The checked item only, with the check. |
| D-6 | Hover paints the item. | Whether the pointer moves the keyboard focus. | Superseded by the answer of 2026-11-09: the pointer over an item moves the keyboard focus to it (changes in DSA-70). |

## Relations with other tasks
- The menu opens from an `nph-button` (DSA-13, done), which stays outside the
  component.
- The hover of the item changed from `color/accent` to `color/primary-surface`.
  `design.md` carries the new rule.
- Solid icon in the active state (Indiane, 2026-10-21): on the item, `tipo`
  default, `state` hover, the start icon and the submenu arrow switch from
  light to solid and use `dropdown/item-hover-icon-foreground` (alias of
  `color/primary`, 4.78:1 in light and 6.26:1 in dark on
  `color/primary-surface`). The label keeps `color/popover-foreground`. The
  destructive item stays in `color/destructive-on-surface`. The evidence,
  section "Solid icon in hover", carries the rule.

## What this task does not do
The code creates no token and changes no token value; the D-4 tokens are already on `v/5.0.0`. It does not change Figma.
Positioning, opening, closing, keyboard and events are technical proposals for
the PR.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, board `1365:118`, menu `1365:63`, item set
  `1365:57` and parts `1365:58`, `1365:60` and `2359:47364`
- `design.md` — the tokens named in the evidence
- `fichas/_modelo.md`

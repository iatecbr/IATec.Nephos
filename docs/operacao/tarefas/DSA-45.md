```json
{
  "id": "DSA-45",
  "goal": "Implement the nph-dropdown-menu, the floating menu of secondary actions that opens attached to a button, with its item, group label, separator and profile header, in the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 460,
  "owner": "elvys",
  "state": "in-progress",
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
      "question": "The evidence does not give the distance between the trigger and the open menu. The code uses `space/inline-tight`, as the list of nph-select (DSA-29, D1). It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-10-24"
    },
    {
      "id": "D-2",
      "question": "The evidence does not give the motion of opening and closing. The code fades the menu in on `motion/enter-*` and out on `motion/exit-*`, sliding `space/inline-tight`, as the list of nph-select (DSA-29, D2). It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-10-24"
    },
    {
      "id": "D-3",
      "question": "On item hover, the evidence asks the nph-checkbox box and the nph-switch track to take their own hover (unchecked: `color/input-hover`, for 3:1 on `color/primary-surface`). Both pieces hover only through `:hover` inside their own shadow root and have no way to force it. The code ships without the forced hover, as a known limit, with a follow-up task for an API in the two pieces. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-10-24"
    },
    {
      "id": "D-4",
      "question": "The nph-switch track is `icon/size-lg` high and has no size; the evidence puts it in a 20 px slot. The code keeps the slot at `icon/size-md`, with the track centered and overflowing it, so the row keeps its height. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-10-24"
    },
    {
      "id": "D-5",
      "question": "The evidence says single choice highlights text and icon in `color/primary-hover` with `text/label-md`. The code reads it as the checked item only, which also shows the check; an unchecked item of the group stays as the common item. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-10-24"
    },
    {
      "id": "D-6",
      "question": "The evidence does not say whether the pointer over an item moves the keyboard focus. The code keeps hover as paint only; the focus moves by keyboard. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-10-24"
    }
  ],
  "evidence": [
    "docs/operacao/evidencias/DSA-45/documentacao-figma-aceita-2026-10-21.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, Elvys writes component code and specs; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-20.md, nph-dropdown-menu modernized: item hover in color/primary-surface, focus border and halo, color/dropdown-border only for the dropdown",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-21.md, nph-dropdown-menu visual acceptance, tag, switch and profile header, Figma UX QA approved, documentation accepted, textual audit approved, right-from-bracket icon and the 4 tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-21.md, solid icon in the active state: in the item hover, type default, start icon and submenu arrow turn solid in dropdown/item-hover-icon-foreground"
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
    "commit": null,
    "pr": null
  },
  "context": "docs/operacao/contextos/DSA-45.md",
  "updated_at": "2026-10-24"
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

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — menu, item, parts,
the icon, CSS, tests, stories and spec pass the proof commands in
`docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## Pending decisions
The evidence gives the contract, so the code can start. Six points remain for
Indiane; the code follows the stated default meanwhile, and each answer only
adjusts one rule.

| ID | What the evidence gives | What is missing | What the code does meanwhile |
|---|---|---|---|
| D-1 | The menu opens attached to a button. | The distance between the trigger and the menu. | `space/inline-tight`, as the list of `nph-select`. |
| D-2 | Opening and closing belong to code. | The motion. | Fade and a slide of `space/inline-tight` on `motion/enter-*` and `motion/exit-*`, as the list of `nph-select`. |
| D-3 | On item hover, the box and the track take their own hover. | A way to force the hover of `nph-checkbox` and `nph-switch` from outside. | Ships without it, as a known limit; a follow-up task gives the two pieces an API. |
| D-4 | The switch sits in a 20 px slot. | The switch track is 24 high and has no size. | Slot at `icon/size-md`, track centered and overflowing it. |
| D-5 | Single choice highlights text and icon in `color/primary-hover`. | Whether it is every item of the group or the checked one. | The checked item only, with the check. |
| D-6 | Hover paints the item. | Whether the pointer moves the keyboard focus. | Hover paints only; the focus moves by keyboard. |

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
It does not create a token or change a token value. It does not change Figma.
Positioning, opening, closing, keyboard and events are technical proposals for
the PR.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, board `1365:118`, menu `1365:63`, item set
  `1365:57` and parts `1365:58`, `1365:60` and `2359:47364`
- `design.md` — the tokens named in the evidence
- `fichas/_modelo.md`

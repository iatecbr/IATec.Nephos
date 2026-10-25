```json
{
  "id": "DSA-45",
  "goal": "Implement the nph-dropdown-menu, the floating menu of secondary actions that opens attached to a button, with its item, group label, separator and profile header, in the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 460,
  "owner": "elvys",
  "state": "ready",
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
  "pending_decisions": [],
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
  "git_review": { "branch": null, "commit": null, "pr": null },
  "context": null,
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

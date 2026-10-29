```json
{
  "id": "DSA-61",
  "goal": "Make nph-togglebutton and nph-toggle-group follow the contract accepted in Figma on 2026-10-29: the three sizes, the new rest, hover and checked states on the togglebutton/* tokens, the solid icon on checked and on hover, and one icon at most; and update both specs.",
  "phase": "F4",
  "approved_order": 600,
  "owner": "elvys",
  "state": "ready",
  "piece": "nph-togglebutton",
  "dependencies": [],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-togglebutton and nph-toggle-group documentation in Figma, with the size and the new states, was accepted by Indiane, with the Figma UX QA and the textual audit approved, and its three tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-61/figma-docs-accepted-2026-10-29.md",
      "result": "passed",
      "verified_at": "2026-10-29",
      "verified_by": "indiane"
    },
    {
      "id": "review-and-merge",
      "description": "Component, CSS, tests, stories and specs of nph-togglebutton and nph-toggle-group pass the proof commands and are merged into v/5.0.0.",
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
    "docs/operacao/evidencias/DSA-61/figma-docs-accepted-2026-10-29.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, component code and specs belong to the code owner; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-27.md, take the states of the nph-toolbar preview to the masters of nph-button, nph-icon-button and nph-togglebutton; size property on nph-togglebutton and nph-toggle-group; component tokens by T9",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-29.md, the checked state stays as drawn (background and label color, no semibold and no stroke), option A of the preview; nph-togglebutton and nph-toggle-group documentation accepted"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1512-27498",
    "date": "2026-10-29",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-togglebutton board frame (1512:27498) and the nph-toggle-group board frame (1580:61) were accepted as the specification of both pieces with the size and the new states. Component sets: nph-togglebutton (1512:719), 108 variants; nph-toggle-group (1580:60), 6 variants. The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": { "branch": null, "commit": null, "pr": null },
  "context": null,
  "updated_at": "2026-10-29"
}
```

# DSA-61 — nph-togglebutton and nph-toggle-group, size and new states

## Goal
In `src/components/nph-togglebutton/` and `src/components/nph-toggle-group/`, both pieces follow the contract accepted in Figma on 2026-10-29: the sizes `compact`, `default` and `large`, the new rest, hover and checked states, and the icon rules. Tests, stories and both specs are updated.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate: `docs/operacao/evidencias/DSA-61/figma-docs-accepted-2026-10-29.md`. It carries the Figma documentation of both pieces converted to text, with the tokens of each part. There is no need to open Figma.

## Why it is ready
The 3 `togglebutton/*` tokens came with this task and are on `v/5.0.0`:

- `togglebutton/background-hover` → `{color.accent}`.
- `togglebutton/background-checked` → `{color.primary-surface-hover}`.
- `togglebutton/background-checked-hover` → `{theme.brand-200}` in light and `{theme.brand-700}` in dark.

No core primitive was added. nph-togglebutton is done (DSA-22) and nph-toggle-group is done (DSA-23); this task changes them to the new contract.

What the code does not do yet, read on `v/5.0.0`:

- **Size.** The togglebutton has one height, `control/height-default`, and the group has no size. Figma asks for 28, 36 and 44 px in both.
- **Rest and checked look.** The track has a `color/muted` background and border, and the checked inner area is raised with `elevation/subtle` and a `color/primary-border` outline. Figma asks for no background and no border when unchecked, and a flat `togglebutton/background-checked` background when checked.
- **Hover background.** Today only the label color changes on hover. Figma adds `togglebutton/background-hover` (unchecked) and `togglebutton/background-checked-hover` (checked).
- **Icon size and style.** The icon is always `nph-icon size="sm"`, in the default `light` style. Figma asks for `sm`, `md` or `lg` by size in the icon-only piece, and the `solid` style when checked and on hover.
- **One icon at most.** `icon-start` and `icon-end` both default to `auto` today, so a piece with text shows two icons. Figma allows one only; `icon-start` is the default.

With this task on `v/5.0.0`, B2 of DSA-55 is closed, and DSA-55 depends on this task.

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS, tests, stories and specs pass the proof commands in `docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## What this task does not do
It does not create a token or change a token value. It does not change the focus ring, the invalid border, the disabled opacity, the label text role or the accessible name rules. It does not add a selection mode, a disabled or an invalid state to the group. It does not change nph-button, nph-icon-button, nph-switch, nph-checkbox or nph-toolbar. It does not change Figma.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, page `🎨NPH — ToggleButton` (`1503:2`), board `1512:27498`
- Page `🎨NPH — Toggle Group` (`1580:4`), board `1580:61`
- Component sets: nph-togglebutton `1512:719`, nph-toggle-group `1580:60`
- `design.md` — the tokens named in the evidence
- `fichas/nph-togglebutton.md`, `fichas/nph-toggle-group.md`

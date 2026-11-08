```json
{
  "id": "DSA-69",
  "goal": "Implement the nph-context-menu, the menu of actions opened at the point of the right click, in the contract accepted in Figma, apply the accepted changes to the shared pieces of nph-dropdown-menu, and write the spec.",
  "phase": "F4",
  "approved_order": 680,
  "owner": "elvys",
  "state": "in-progress",
  "piece": "nph-context-menu",
  "dependencies": [
    "DSA-03",
    "DSA-17",
    "DSA-45"
  ],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-context-menu documentation in Figma was accepted by Indiane, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-69/figma-docs-accepted-2026-11-06.md",
      "result": "passed",
      "verified_at": "2026-11-06",
      "verified_by": "indiane"
    },
    {
      "id": "review-and-merge",
      "description": "Component, CSS, tests, stories and spec pass the proof commands and are merged into v/5.0.0, with the nph-dropdown-menu and nph-icon changes.",
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
    "docs/operacao/evidencias/DSA-69/figma-docs-accepted-2026-11-06.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, component code and specs belong to the code owner; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-06.md, nph-context-menu: visual acceptance, Figma UX QA and textual audit approved, documentation accepted, the 11 points of the approval page approved (radius 12 and 8, outline on color/border-subtle, dropdown/separator, color/destructive-text, solid icon on highlight in nph-dropdown-menu, compact destructive item, no context-menu tokens, arrow-pointer in nph-icon, cleanup, notification/error-action-foreground unchanged); a finished component enters the first version"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=4838-27591",
    "date": "2026-11-06",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-context-menu documentation frame (4838:27591, page 4128:17776) was accepted as the API and behavior specification of nph-context-menu. Component set: nph-context-menu (4819:15828), 12 variants. The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": { "branch": "feat/dsa-69-context-menu", "commit": null, "pr": null },
  "context": "docs/operacao/contextos/DSA-69.md",
  "updated_at": "2026-11-06"
}
```

# DSA-69 — nph-context-menu, actions at the point of the right click

## Goal
The `nph-context-menu` exists in `src/components/nph-context-menu/`, with a spec, tests and stories, in the contract accepted in Figma: a menu of the actions of the object under the pointer, opened at the point of the right click, built from the item, the group label and the separator of nph-dropdown-menu. The accepted changes to those shared pieces land in `nph-dropdown-menu` in the same task.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate: `docs/operacao/evidencias/DSA-69/figma-docs-accepted-2026-11-06.md`. It carries the Figma documentation converted to text, with the tokens of each part, the changes to nph-dropdown-menu and nph-icon, and the answers to the appendix points. There is no need to open Figma.

## Specification to follow closely
- **Opening**: the `contextmenu` event (right click, Shift+F10, Menu key); on touch, a long press of about 700 ms. The panel opens with its top left corner at the point of the click and changes side on collision.
- **Keyboard**: focus on the first item when opened by keyboard; arrows, Home, End, letter search; right arrow opens the submenu, left arrow closes it; Enter and Space activate; Esc closes and returns the focus to the object that opened the menu.
- **Roles**: `menu`, `menuitem`, `menuitemcheckbox`, `menuitemradio` with `aria-checked`; `aria-haspopup` and `aria-expanded` on the item with a submenu; icon and arrow `aria-hidden`; the shortcut in `aria-keyshortcuts`.
- **Never the only path**: every action of the menu also exists on the screen.
- **Sizes**: default and compact, one size per menu; the compact size also takes the destructive item.

## Changes outside the new piece
- **nph-dropdown-menu**: panel radius `dropdown/panel-radius` (12) and item radius `dropdown/item-radius` (8), with the item focus border `dropdown/item-focus-border-radius` and halo `dropdown/item-focus-halo-radius`; separator line `dropdown/separator`; the destructive item on `dropdown/item-destructive-foreground`, and in hover `dropdown/item-destructive-hover-foreground` over `dropdown/item-destructive-hover-background`; the start icon solid on highlight (hover, focus, open submenu) in every type, selection and size, back to light at rest and disabled; a compact destructive item. Its tests, stories and spec (`fichas/nph-dropdown-menu.md`, tokens and states) follow.
- **nph-icon**: the `arrow-pointer` icon, light and solid.
- **Outline**: `color/dropdown-border` now resolves to `color/border-subtle`. The nph-navigation-menu panel and the loading nph-notification change color with it, with no code change.
- **design.md**: `color/destructive-text` and the eight `dropdown/*` tokens are new; the descriptions of `radius/container`, `radius/surface`, `radius/overlay`, `radius/inner`, `focus/border-radius-inner`, `color/border-subtle`, `color/dropdown-border` and `color/destructive` were rewritten.

## Why it is ready
The eight `dropdown/*` tokens came with this task and are on `v/5.0.0`, with one new semantic token (`color/destructive-text`) and the new target of `color/dropdown-border`. The pieces inside are done: nph-icon (DSA-03), nph-checkbox (DSA-17) and nph-dropdown-menu (DSA-45).

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS, tests, stories and spec pass the proof commands in `docs/operacao/component-handoff.md` and are merged into `v/5.0.0`, together with the nph-dropdown-menu and nph-icon changes.

## What this task does not do
It does not create a token or change a token value. It does not create `context-menu/*` tokens. It does not change Figma.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, page `NPH — Context Menu` (`4128:17776`), documentation frame `4838:27591`
- Component set: nph-context-menu `4819:15828`; nph-dropdown-menu item set `1365:57`, separator `1365:60`, panel `1365:63`; nph-icon `248:143`
- `design.md` — the tokens named in the evidence
- `fichas/_modelo.md`

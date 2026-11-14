```json
{
  "id": "DSA-80",
  "goal": "Implement the nph-command, a command palette in a dialog with a search field, a list of commands by group and a footer of keyboard hints, in the contract accepted in Figma, add to the nph-dialog the option it needs, and write the spec.",
  "phase": "F4",
  "approved_order": 790,
  "owner": "elvys",
  "state": "in-progress",
  "piece": "nph-command",
  "dependencies": [
    "DSA-03",
    "DSA-09",
    "DSA-10",
    "DSA-11",
    "DSA-16",
    "DSA-40",
    "DSA-44",
    "DSA-45",
    "DSA-46"
  ],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-command documentation in Figma was accepted by the design owner, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-80/figma-docs-accepted-2026-11-12.md",
      "result": "passed",
      "verified_at": "2026-11-12",
      "verified_by": "indiane"
    },
    {
      "id": "review-and-merge",
      "description": "Component, CSS, tests, stories and spec pass the proof commands and are merged into v/5.0.0, with the nph-dialog option.",
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
      "question": "The accepted documentation recommends the panel near the top of the window (about 16% of its height) so it does not jump while the list filters, and says there is no token for that offset. The code keeps the panel centered, as the nph-dialog does, because a literal would break the token rule. Does Indiane confirm the centered panel until a token for the offset exists, or send the token? Recommended: confirm, and bring the offset as a token in the next token round. It does not block this task.",
      "decider": "indiane",
      "opened_at": "2026-11-14"
    },
    {
      "id": "D-2",
      "question": "The accepted text says the panel hugs its content up to 560, and Figma draws every variant at 560. The code keeps the width at the 560 ceiling (command/max-width) while the list filters, so the panel does not change width with each key. Does Indiane confirm, or does the panel hug its content? Recommended: confirm. It does not block this task.",
      "decider": "indiane",
      "opened_at": "2026-11-14"
    },
    {
      "id": "D-3",
      "question": "DSA-46 D-3 puts the rest of a searched label in color/muted-foreground. On a destructive command that would turn the part that was not searched gray and take the signal from the label, so the code keeps the destructive color on the rest and only the searched stretch is heavier. Does Indiane confirm, or is the rest muted there too? Recommended: confirm. It does not block this task.",
      "decider": "indiane",
      "opened_at": "2026-11-14"
    }
  ],
  "evidence": [
    "docs/operacao/evidencias/DSA-80/figma-docs-accepted-2026-11-12.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, component code and specs belong to the code owner; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-11.md, nph-command: Proposal 1 accepted (soft dialog panel without outline, large field in focus, groups separated by space, shortcut as text, footer of hints with nph-kbd)",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-12.md, nph-command: visual acceptance of the root with the two changes (lines in color/dialog-separator, radius 10), documentation accepted, and the open points answered as recommended (Pend. 2, 3, 5, 9, 10, 14, 15); Pend. 12 and 13 go to one foundation task (DSA-81); a finished component enters the first version"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=6076-4910",
    "date": "2026-11-12",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-command documentation frame (6076:4910, page 1626:18) was accepted as the API and behavior specification of nph-command, with the visual acceptance of the root (6067:3610). COMPONENT_SET nph-command (6068:3936), 5 variants. The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": { "branch": "feat/dsa-80-command", "commit": null, "pr": null },
  "context": "docs/operacao/contextos/DSA-80.md",
  "updated_at": "2026-11-14"
}
```

# DSA-80 — nph-command, command palette

## Goal
The `nph-command` in `src/components/nph-command/`, with CSS, tests, stories and the spec `fichas/nph-command.md`, in the contract accepted in Figma: a command palette in a dialog. The person opens it with Ctrl+K (⌘K on Mac), types, sees only the commands that match and runs one with Enter.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate: `docs/operacao/evidencias/DSA-80/figma-docs-accepted-2026-11-12.md`. It carries the Figma documentation converted to text, with the 15 tokens, the anatomy part by part (with the text style and the token of each layer), the default behavior, the combined states, the inherited decisions, the icon rules and the decisions answered. There is no need to open Figma.

## Specification to follow closely
- **Two changes from the reference kit, both decided**: the two lines (field → list, list → footer) are the `nph-separator` in `command/divider` (`color/dialog-separator`), not `color/border` as DSA-46 D-2 said; the panel corner is `command/radius` (`radius/overlay`, 10), not 12 to 16.
- **Parts**: panel (`command/background`, `command/radius`, `command/max-width` as a ceiling, `elevation/modal`, no border in light or dark); search row with `command/search-padding` around an `nph-input` large in focus; line; list (`command/list-padding`, `command/list-max-height`, scrolls); items and group labels of the `nph-dropdown-menu`; line; hint footer (`command/footer-padding`, `command/footer-gap`, each hint `nph-kbd` + word at `command/hint-gap`, word in `text/caption` and `command/footer-foreground`).
- **Line color**: the `nph-separator` spec says its line is always `color/border`; the command follows the same path as the `nph-dialog`, which overrides `--nph-color-border` with `--nph-color-dialog-separator` only on its own separator (`nph-dialog.ts`); here the override is `command/divider`.
- **Hint footer**: it is part of the dialog content, not the dialog footer area (that one is for action buttons).
- **States of content**: results, groups, search (typed stretch in `command/highlight-weight`), empty (`nph-empty`, its own padding), loading (`nph-spinner` + "Buscando…" in `text/body-sm` and `command/status-foreground`, row padding `command/state-padding`, gap `command/status-gap`). Footer on by default.
- **Dialog**: mount on the `nph-dialog`, named "Paleta de comandos". It needs these options there (evidence, Pend. 2): a title for screen readers only; no padding; no close button (Esc, Enter, the open key and a veil click close); a veil click closes (today it does not); new close origins in `nph-close` `detail.source` (open key, command run, veil).
- **Roles and keys**: field `role="combobox"`, list `role="listbox"`, group `role="group"` named by its label, item `role="option"`, shortcut `aria-hidden`; Up, Down, Home, End, Enter, Esc closes the dialog and returns focus, Tab trapped. The 1st result is active while typing (DSA-46 D-5). A disabled item is skipped by keys and pointer.
- **Item icon at rest**: gray, as the approved item (`color/muted-foreground`); solid on the active item.

## Open points for the code
- Event, aria, slot, property and console warning, following the APG and the Custom Elements Manifest.
- How the commands are given (items, groups, shortcut text), how running a command is reported, and the matching rule of the filter (contains or fuzzy, case and accents).
- Whether Down wraps from the last item to the first (the contract stops there, as cmdk; wrapping is the code's call).
- The names and API of the new `nph-dialog` options, and whether the panel sits near the top (about 16% of the window, as Nord) instead of the vertical center; there is no token for that offset.
- How `command/background`, `command/radius` and `command/max-width` reach the dialog window: today their values match the default (md) nph-dialog; the path is the code's call.
- The width: the accepted text says the panel hugs its content up to 560, and Figma draws every variant at 560; whether the width stays at the ceiling while the list filters (so it does not jump), down to the window minimum.
- Whether the active item also gets `aria-selected="true"`; whether the footer keys are `aria-hidden` (the words already say the action); whether the list uses the `scrollbar/*` style; who turns the shortcut text into ⌘ on Mac; how the highlight works if the filter is fuzzy (several stretches); whether the hint footer hides on touch screens or a narrow window.
- Whether the field is the `nph-input` element or a native input with its look: `aria-activedescendant` does not cross a shadow root.
- Who listens to the global Ctrl+K / ⌘K: the component or the application, and how to avoid the browser shortcut.
- How the texts come in, already translated, as in the nph-dialog: the dialog name, "Buscar comando…", "Buscando…", the hint words, the empty state and the announcement of the number of results.
- Where a group such as "Recentes" comes from: data of the consumer, not of the component.

## Why it is ready
The 15 `command/*` tokens came with this task and are on `v/5.0.0`, all aliases of existing semantics. No new value entered the core. Every piece it uses is done: `nph-icon` (DSA-03), `nph-spinner` (DSA-09), `nph-separator` (DSA-10), `nph-kbd` (DSA-11), `nph-input` (DSA-16), `nph-empty` (DSA-40), `nph-dialog` (DSA-44), `nph-dropdown-menu` (DSA-45), `nph-combobox` (DSA-46).

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS, tests, stories and spec pass the proof commands in `docs/operacao/component-handoff.md` and are merged into `v/5.0.0`, with the `nph-dialog` option.

## What this task does not do
The code does not create a token or change a token value. It does not change Figma. It does not change the `nph-dropdown-menu`, the `nph-input` or the `nph-empty`. It does not fix the dark contrast of the destructive item (3.62:1 on the dialog) nor of the field focus border in 3 brands: that is DSA-81, at the source, with no local override here. No submenu, nested pages, multiple selection or sizes in v1.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, page `1626:18`, documentation frame `6076:4910`, root `6067:3610` and the evidence of the `figma-docs-accepted` gate
- Component set: nph-command `6068:3936`; item of the nph-dropdown-menu `1365:63`
- WAI-ARIA APG, combobox: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
- WAI-ARIA APG, listbox: https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
- WAI-ARIA APG, modal dialog: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- cmdk: https://github.com/pacocoursey/cmdk
- shadcn/ui command: https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/v4/registry/new-york-v4/ui/command.tsx
- Nord command menu: https://nordhealth.design/components/command-menu
- Custom Elements Manifest: https://github.com/webcomponents/custom-elements-manifest
- `design.md` — the tokens named in the evidence
- `fichas/nph-dialog.md`, `fichas/nph-dropdown-menu.md`, `fichas/nph-combobox.md`

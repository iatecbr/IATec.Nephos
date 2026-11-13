```json
{
  "id": "DSA-79",
  "goal": "Add the free text variant to the nph-combobox, a field without the arrow whose typed text is the value and whose list only suggests, in the contract accepted in Figma, and update its spec.",
  "phase": "F4",
  "approved_order": 780,
  "owner": "elvys",
  "state": "ready",
  "piece": "nph-combobox",
  "dependencies": [
    "DSA-03",
    "DSA-46"
  ],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The documentation of the nph-combobox free text variant in Figma was accepted by the design owner, with the Figma UX QA and the textual audit approved, and its token is on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-79/figma-docs-accepted-2026-11-12.md",
      "result": "passed",
      "verified_at": "2026-11-12",
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
    "docs/operacao/evidencias/DSA-79/figma-docs-accepted-2026-11-12.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, component code and specs belong to the code owner; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-12.md, nph-combobox free text: visual acceptance of the root, documentation accepted, and the two open points answered (while typing no suggestion is active, Down activates the first one and Enter with no active suggestion keeps the text; with no suggestion the list closes without the nph-empty and the screen reader hears \"no suggestions\"); combobox/free-text-padding-end only aliases space/control-padding"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=6047-3760",
    "date": "2026-11-12",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The documentation frame of the nph-combobox free text variant (6047:3760, page 4128:28570) was accepted as the API and behavior specification of that variant, with the visual acceptance of the root (6040:2120). COMPONENT_SET nph-combobox free text (6040:3286). The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": { "branch": null, "commit": null, "pr": null },
  "context": null,
  "updated_at": "2026-11-12"
}
```

# DSA-79 — nph-combobox, free text variant

## Goal
The `nph-combobox` in `src/components/nph-combobox/` accepts free text, with tests, stories and the spec updated, in the contract accepted in Figma: a field without the arrow that accepts any text and suggests values from a list. The typed text is the value; the list only helps to fill in faster.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate: `docs/operacao/evidencias/DSA-79/figma-docs-accepted-2026-11-12.md`. It carries the Figma documentation converted to text, with the token, the inherited tokens, the anatomy part by part, the default behavior, the combined states, the inherited decisions, the icon rules and the decisions answered. There is no need to open Figma.

## Specification to follow closely
- **Parts**: the field is the nph-combobox field without the divider and the arrow zone; its end padding is `combobox/free-text-padding-end`, with and without the clear button. Start icon, text and clear X keep the nph-combobox tokens. The list is the nph-combobox list, built once (DSA-31 D2).
- **Properties**: `size` default and large; `state` default, hover, focus, error, error with focus, disabled, focus on clear and open; start magnifying glass (default) or another light `nph-icon` (default globe); content placeholder, value or typing; clear on by default.
- **Combobox with list**: `role="combobox"` with `aria-autocomplete="list"`, `aria-expanded`, `aria-controls` and `aria-activedescendant`; the list is `role="listbox"` and each suggestion `role="option"`. The magnifying glass and the start icon are `aria-hidden`; the X is a button with a name.
- **Keyboard**: while typing, no suggestion is active. Down activates the first one and, with the list closed, also opens it; Up, with the list closed, opens it and activates the last one; Alt+Down opens without activating; Enter picks the active suggestion and, with no active suggestion, keeps the text and closes the list; Esc closes the list and, with it closed, clears the text (DSA-46 D-4).
- **Value**: Tab, leaving the field and an outside click close the list and keep the typed text as the value; it is never replaced by a suggestion without Enter or a click.
- **No suggestion**: the list closes, without the nph-empty, and an `aria-live` region says "no suggestions". No "no option found" message and no "+ Create …" row in this variant.
- **What stays as in the nph-combobox**: highlight of the typed part (`text/highlight-weight`, rest in `color/muted-foreground`), active suggestion in `color/accent`, pointer makes a suggestion active (DSA-45 D-6), list `space/inline-tight` below and above near the window edge (DSA-29 D-2), movement in `motion/enter-*` and `motion/exit-*` (DSA-45 D-2), loading with `aria-busy`.
- **Combined states**: error + disabled, disabled wins; a suggestion equal to the text and disabled keeps `color/primary-surface` and the check under `state/disabled-opacity` (DSA-29 D-3).
- **Limits**: no start avatar, no read only, no image.

## Open points for the code
- Event, aria, slot, property and console warning, following the APG and the Custom Elements Manifest.
- How the variant is chosen on the element (an attribute of the nph-combobox), and how the value is reported when it is not in the list.
- Minimum characters before suggesting and the number of suggestions in view (about 10).

## Why it is ready
The token `combobox/free-text-padding-end` came with this task and is on `v/5.0.0`, an alias of `space/control-padding`. No new value entered the core. The nph-combobox (DSA-46) and the nph-icon (DSA-03) are done.

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS, tests, stories and spec pass the proof commands in `docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## What this task does not do
The code does not create a token or change a token value. It does not change Figma. It does not change the nph-combobox with the arrow: its create row (D-1), its first suggestion active while typing (D-5) and its empty list stay as they are.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, page `4128:28570`, documentation frame `6047:3760`, root `6040:2120` and the evidence of the `figma-docs-accepted` gate
- Component set: nph-combobox free text `6040:3286`; nph-combobox `1359:115`
- WAI-ARIA APG, combobox with list autocomplete: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-list/
- GOV.UK accessible autocomplete: https://github.com/alphagov/accessible-autocomplete
- MUI Autocomplete, free solo: https://mui.com/material-ui/react-autocomplete/
- Mantine Autocomplete: https://mantine.dev/core/autocomplete/
- Custom Elements Manifest: https://github.com/webcomponents/custom-elements-manifest
- `design.md` — the tokens named in the evidence
- `fichas/nph-combobox.md`

```json
{
  "task": "DSA-47",
  "gate": "figma-docs-accepted",
  "date": "2026-10-21",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=461-13009",
    "date": "2026-10-21",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "Rule decided by Indiane on 21-10-2026: an action with an icon in the active state (hover/active) swaps the icon from light to solid. In the nph-button, frame `NPH — Button` and COMPONENT_SET nph-button (461:13009), the start and end icons use solid in state hover-active and light in the other states. Use example: card 25 of the board 2478:1910."
  }
}
```

# DSA-47 — `figma-docs-accepted`

On 21-10-2026 Indiane decided that an action with an icon, in the active state
(hover and active), swaps the icon from `light` to `solid`, and that the rule goes
to the components. In the nph-button this is the `hover-active` state.

There is no command output. The decision is a human observation, recorded with the
date, the authorship, the set and the use example.

## The rule, converted to text

| `state` in Figma | Start icon | End icon |
|---|---|---|
| `default` | light | light |
| `hover-active` | **solid** | **solid** |
| `foco` (focus) | light | light |
| `disabled` | light | light |
| `carregando` (loading) | the spinner takes its place | light |

- The icon color does not change: it follows the text of the type (`tipo`) and
  emphasis (`enfase`), including the hover color.
- No new token: `light` and `solid` are the `variant` property of `nph-icon`
  (`NPH_ICON_VARIANTS` in `src/components/nph-icon/nph-icon.icons.ts`).

## What Figma shows, and its limit

Read on 21-10-2026 by the Figma API, file `UuhW1qPkdkdQ6IAjOsxOua`, set
`461:13009` (240 variants; `tipo`, `enfase`, `size`, `state`):

- `Ícone início` and `Ícone fim` are instance-swap properties
  (`⮑ ícone início`, `⮑ ícone fim`), with the default `nome=plus, estilo=light`.
- The default of an instance-swap property is the same for the whole set. So the
  component cannot swap to solid per state: the icons stay `light` in all 48
  variants of each state. This is a limit of Figma, not a different decision.
- The rule is shown in the use example: card 25 of the board `2478:1910`, where
  the open "Ações" button, in `hover-active`, draws `chevron-down` in `solid`.

The icon-only set `nph-button — so icone` (`498:15671`) keeps `light` in every
state. Whether it also swaps is decision D1 of the task.

## Source of the decision

WORK BRAIN — `03 MEMÓRIA/diario/2026/2026-10-21.md`: rule of the solid icon in the
active state; decision that it goes to the components.

```json
{
  "task": "DSA-52",
  "gate": "figma-docs-accepted",
  "date": "2026-10-26",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=2722-5358",
    "date": "2026-10-26",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "Decision D1 of DSA-47, answered by Indiane on 26-10-2026 on the preview frame `2722:5358` (page `Rascunho`), in light and dark: the icon-only button, COMPONENT_SET 498:15671 (the icon-only nph-icon-button board), also swaps its icon from light to solid in hover-active, the same rule as the nph-button with text (COMPONENT_SET 461:13009). The rule, converted to text, is in this evidence."
  }
}
```

# DSA-52 — `figma-docs-accepted`

On 26-10-2026 Indiane answered D1 of DSA-47 ("does the icon-only button also swap to
solid on hover?") with yes. The rule decided on 21-10-2026 for the button with text
(evidence of DSA-47) now covers the icon-only button too.

There is no command output. The decision is a human observation, recorded with the
date, the authorship and the set.

## The rule, converted to text

| State of the icon-only button | Icon |
|---|---|
| rest (`default`) | light |
| `hover-active` | **solid** |
| focus without hover | light |
| `disabled` | light |
| `loading` | the spinner takes the icon's place |

- The icon color does not change: it follows the text color of the type and emphasis,
  including the hover color.
- No new token: `light` and `solid` are the `variant` property of `nph-icon`
  (`NPH_ICON_VARIANTS` in `src/components/nph-icon/nph-icon.icons.ts`).
- The condition is the same that changes the background and the text:
  `.control:not(:disabled):not([aria-disabled='true']):is(:hover, :active)`.
- Nothing else about the icon-only button changes (shape, tooltip, sizes, accessible name).

## What Figma shows, and its limit

The preview frame `2722:5358` showed the proposal in light and dark. The set
`498:15671` keeps `light` in every state, because the default of an instance-swap
property is the same for the whole set; this is a limit of Figma, not a different
decision. The code is the place where the swap is implemented.

## Source of the decision

WORK BRAIN — `03 MEMÓRIA/diario/2026/2026-10-26.md`: D1 of DSA-47 answered yes: the icon-only button also swaps to solid in hover-active.

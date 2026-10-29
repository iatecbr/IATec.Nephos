```json
{
  "task": "DSA-60",
  "gate": "figma-docs-accepted",
  "date": "2026-10-29",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=461-13009",
    "date": "2026-10-27",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "On the nph-button board frame (1197:5449) and the nph-icon-button board frame (2122:1591), Indiane decided to take the states of the nph-toolbar preview to the masters of nph-button and nph-icon-button. The hover of the secondary ghost emphasis moves from color/muted to color/accent, through two new component tokens. COMPONENT_SET nph-button (461:13009) and nph-icon-button (498:15671)."
  }
}
```

# DSA-60 — `figma-docs-accepted`

On 2026-10-27 Indiane decided that the hover of the secondary ghost buttons follows the hover of the nph-toolbar, which she accepted on that preview. In Figma, the masters of `nph-button` (`461:13009`) and `nph-icon-button` (`498:15671`) were changed that day. The documentation boards of both pieces did not change: their text does not name the ghost hover color.

There is no command output. The decision is a human observation, recorded in the json block above with the component set URL.

## What changed

| Piece | Variants | Fill in `hover-active` | Before |
|---|---|---|---|
| `nph-button` | `tipo=secondary`, `enfase=ghost`, the three sizes | `button/secondary-ghost-background-hover` | `color/muted` |
| `nph-icon-button` | `tipo=secondary`, `enfase=ghost`, the three sizes, both shapes | `icon-button/secondary-ghost-background-hover` | `color/muted` |

Both tokens came with this task and are on `v/5.0.0`:

- `button/secondary-ghost-background-hover` → `{color.accent}`.
- `icon-button/secondary-ghost-background-hover` → `{color.accent}`.

`color/accent` is `core/surface/50` in light and `core/surface/600` in dark. No core primitive was added.

## What did not change

- The rest state of the secondary ghost: no background.
- The primary ghost hover (`color/primary-surface`) and the danger ghost hover (`color/destructive-surface`).
- Text and icon colors, focus ring, disabled and loading.
- The solid icon in `hover-active`, which is DSA-52 (`done`).

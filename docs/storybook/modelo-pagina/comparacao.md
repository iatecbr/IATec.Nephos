# Comparison — content page template × Figma prototype

Structural and token comparison of the story
`Componentes › nph-icon › Docs › Documentação` with the prototype approved in
Figma. It is not a pixel-by-pixel comparison.

## Reference

| Mode | Figma | Exported file |
|---|---|---|
| Light | [`1181:703`](https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1181-703), page `1181:821`, inside block `1181:608` | `figma-claro.png` (1x, 1280 wide) |
| Dark | [`1181:978`](https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1181-978), page `1181:1096`, inside block `1181:608` | `figma-escuro.png` (1x, 1280 wide) |

The Storybook screenshots (`storybook-claro.png` and `storybook-escuro.png`)
were captured in a 1280-wide viewport, with the bottom panel closed, and
reduced by the capture tool to 800 wide.

## What matches

| Point | Figma | Storybook |
|---|---|---|
| Order of the blocks | header, index, sections | same |
| Section title | `text/heading-md` with a line below | same (measured: size, line height and weight match the token) |
| Text | `text/body-md`, reading width | same |
| Demonstration | border only, no background | same (computed background transparent, border in `--nph-color-border`) |
| Table | header in `text/label-sm`, term in `text/code` | same |
| Note | `status/info-*` | same, and `status/warning-*` on invalid input |
| When to use | `status/success-*` and `status/error-*` cards side by side | same |
| Source | `text/caption` footer with a thin line | same |
| Dark mode | `escuro` mode of the `semantic` collection | `data-nph-color-scheme="dark"` |

## Divergences, with the reason

| Divergence | Reason |
|---|---|
| The h1 uses `text/heading-lg`, and not `heading-xl` | `design.md`: the screen title is `heading-lg`; a section is `heading-md` |
| The `variant` row says that `solid` exists for all names | the current `nph-icon` sheet; the prototype still carried the old rule, restricted to `star` |
| The "This page is derived" notice appears as a note, at the top | the prototype did not show the notice; the process text was removed, and only the rule of precedence of the sources remained |
| The page has all the sections (Core, Color, Invalid input, Anti-patterns, References) | the prototype showed a sample of the sections |
| The "When to use" cards have a title | they name each list for the reader and for the screen reader |
| API rows that are not identifiers ("Slots and events", "Interaction") come out as text, not in a code font | the table uses a code font only for identifiers |
| The demonstration caption says "the approved sizes" | live text carries no count |
| The toolbar has Storybook's native buttons | the prototype simplified the toolbar |

```json
{
  "task": "DSA-110",
  "gate": "foundation-decision",
  "date": "2026-11-23",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=7735-2",
    "date": "2026-11-23",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "Points of the nph-split-button accepted with the proposals (green light on the page, 2026-11-22) and kept with no veto on the approval of 2026-11-23: Pend. 2, 7, 12 and 13."
  }
}
```

# DSA-110 — `foundation-decision`

## The decision
On 2026-11-22 the design owner accepted the `nph-split-button` proposals with the green light on the page, and on 2026-11-23 she kept them with no veto on the approval. Four of them ask the `nph-button` for something it does not do today:

- **Pend. 2 — junction of the parts:** 2 px between the main part and the arrow, with 4 px inner corners (`split-button/inner-radius`, on `radius/inner`, item 6). Source: https://m3.material.io/components/split-button/specs
- **Pend. 7 — focus over the gap:** the part with focus is on top of its neighbor, and the halo covers the 2 px gap. With item 6, the focus corners at the junction are 5 px (`split-button/focus-border-inner-radius`) and 9 px (`split-button/focus-halo-inner-radius`). Source: https://raw.githubusercontent.com/microsoft/fluentui/master/packages/react-components/react-button/stories/src/SplitButton/SplitButtonAccessibilitySpec.mdx
- **Pend. 12 — single focus color:** focus border in `split-button/focus-border` (`focus/border`) and halo in `split-button/focus-halo` (`focus/halo`), on both parts and in every type. In the code, the border goes through the hook `--nph-button-focus-border` (P116, item 8); the halo asks for a new hook. Source: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- **Pend. 13 — tooltip of the arrow with the menu open:** the tooltip stays hidden while the menu is open and does not reopen when the focus comes back to the arrow; it comes back only on a new hover or a new keyboard focus. In the code, the rule lives in the icon-only `nph-button` with `aria-haspopup` and `aria-expanded`, so it holds for every icon-only button that opens a menu. Source: https://raw.githubusercontent.com/primer/react/main/packages/react/src/Button/IconButton.tsx

## What the code has today (read on `v/5.0.0`)
- `src/components/nph-button/nph-button.css`: the four corners in `--nph-radius-control`; the focus border in `--nph-focus-border-radius-control` and the halo in `--nph-focus-radius-control-with-border`, with no hook for a side.
- `fichas/nph-button.md`, focus: "The one public hook is the custom property `--nph-button-focus-border`"; the halo does not change.
- `fichas/nph-tooltip.md`, business rules: "Keyboard focus on the element opens the balloon at once"; no rule for an open menu.

## In Figma
The root `7735:2` and the documentation `7995:6038`, section 4, show the junction corners and the focus of each part, in secondary, primary and danger, light and dark.

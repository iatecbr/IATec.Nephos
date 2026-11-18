```json
{
  "task": "DSA-93",
  "gate": "design-decision",
  "date": "2026-11-18",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0",
    "date": "2026-11-18",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The keyboard focus of the nph-tree item leaves the 2 px border drawn inside the row and takes the focus of the list items: a 1 px border in focus/border outside the row and a 4 px halo in focus/halo outside the border, as on the item of the nph-dropdown-menu, the nph-menubar and the nph-panel-menu. The design owner approved option A of a Figma preview in light and dark, and Figma was changed the same day."
  }
}
```

# DSA-93 — `design-decision`

## The decision
On 2026-11-18 the design owner saw that the focus of the `nph-tree` item did not follow the focus of the other list items. The item of the `nph-dropdown-menu`, the `nph-menubar` and the `nph-panel-menu` shows a 1 px border outside the row and a 4 px halo outside the border. The `nph-tree` item showed only a 2 px border drawn inside the row, with no halo.

She asked to move the tree to the same focus. On a Figma preview in light and dark (draft page, frame `7306:25254`: today next to option A), she approved option A in the chat.

## Why
The same kind of piece, an item in a list moved by the arrows, must show the same focus in every component: the same widths and colors. The 2 px border inside the row was the only exception among the list items. The corners follow the corner of each item: the tree item has `radius/control` (6), so its focus takes 7 and 11, as the `nph-collapsible` trigger, while the dropdown item takes 9 and 13 around its own corner.

## What Figma has today
### The item
In the set `nph-tree / item` (`5485:350`), the six variants with focus: `5485:64`, `5485:92`, `5485:162`, `5485:190`, `5485:280` and `5485:308` (focus and selected with focus, in the closed branch, the open branch and the leaf).

- **Focus border:** 1 px, in `tree/focus-border`, 1 px outside the row (a 280 × 36 row gets a 282 × 38 border), with corner 7.
- **Focus halo:** 4 px, in `tree/focus-halo`, outside the border (290 × 46), with corner 11.
- **Selected with focus:** the selection bar stays visible inside the border, clipped by the corner of the item, as before. The border no longer covers the bar.
- **Disabled with focus:** the border and the halo draw on top of the faded item, at full opacity. Nothing changes from D-2 of DSA-75 except the shape of the focus.
- **Rows next to the focused row:** the rows stack with no gap, so the border and the halo pass over the next and the previous rows.
- **Scroll to the edge:** the documentation keeps the rule that the row that scrolls to the edge of the container shows the focus border whole.

### The tokens
| Figma variable | Before | After |
|---|---|---|
| `tree/focus-border` (`VariableID:5896:53`) | `focus/border` | `focus/border`, unchanged |
| `tree/focus-border-width` (`VariableID:5896:54`) | `core/focus-width/sm` (2) | `border/width` (1) |
| `tree/focus-border-radius` (`VariableID:5896:55`) | `radius/control` (6) | `focus/border-radius-control` (7) |
| `tree/focus-halo` (`VariableID:7311:32`) | did not exist | `focus/halo` |
| `tree/focus-halo-width` (`VariableID:7311:33`) | did not exist | `focus/ring-width` (4) |
| `tree/focus-halo-radius` (`VariableID:7311:34`) | did not exist | `focus/radius-control-with-border` (11) |

Every token points to a semantic token with the same job, so no new `core` value was needed. The same semantic tokens already serve the focus of the `nph-collapsible` trigger (`collapsible/focus-*`), whose item also has the corner `radius/control`. The values are the same in light and dark: only the colors of `focus/border` and `focus/halo` change by mode, and they did not change.

### The documentation
The `nph-tree` documentation frame (`5876:216753`) was changed in the same work:

- the anatomy item 6 now reads "focus border and halo", with the border 1 px outside and the halo outside it;
- the accessibility rule of the visible focus;
- the selected state line;
- the captions and the example of the disabled item with focus in the usage demo, in light and dark.

The sentence that kept the border inside "because a ring outside would be cut by the neighbor" is gone. The focused row now goes over its neighbors.

## Sources
- WORK BRAIN, `03 MEMÓRIA/diario/2026/2026-11-18.md`: the request of the design owner (12:2x), the preview (12:4x), the approval (12:5x) and the Figma change (13:1x)
- Figma `DS-IA-NEPHOS 5.0`, page `NPH — Tree`: set `5485:350`, documentation `5876:216753`; draft page, preview `7306:25254`
- The reference focus: item of the `nph-dropdown-menu`, Figma `2311:55545`
- WCAG 2.2, non-text contrast: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html

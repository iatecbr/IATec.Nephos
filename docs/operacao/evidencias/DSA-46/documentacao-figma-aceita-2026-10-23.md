```json
{
  "task": "DSA-46",
  "gate": "figma-docs-accepted",
  "owner": "indiane",
  "date": "2026-10-23",
  "source": "Figma DS-IA-NEPHOS 5.0, board 1370:113",
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1370-113",
    "date": "2026-10-23",
    "author": "indiane",
    "converted_decision": "The nph-table documentation frame (2584:66651) in board 1370:113 with COMPONENT_SET (1370:113) was accepted with all 9 parts, properties, variants and states. The specification, converted to text, is in this evidence."
  },
  "verification": {
    "visual_qa": "approved, 2 rodadas, Opus and Sonnet",
    "textual_audit": "approved, rodada 7, Opus and Sonnet",
    "verified_by": "indiane"
  }
}
```

# nph-table

## 1. Purpose

A table to read and compare data in rows and columns, with caption, header, cells, and footer. Rows can expand to show details or sub-levels.

**Selection:** nph-table is chosen by size, border, and header.

## 2. Description

Use to display data that people read and compare, such as payments, lists, or transactions. The component organizes tabular information in a clear, scannable format.

## 3. Anatomy

### Parts

1. **Caption** — Optional. Title above the table with description and total in nph-badge secondary. In code, it is the caption element.

2. **Header** — Column title in text/heading-xs, over table/header-background.

3. **Cell** — Data in text, in table/foreground. Text aligned left; numbers aligned right.

4. **Composite cell** — Content built with other components: avatar, badge, icon, thumbnail, link, button, actions, and rating.

5. **Footer** — Column total or subtotal, with the same background and typography as the header.

6. **Border and scrollable area** — Optional. Border in table/border and radius in table/radius; the body scrolls up to table/body-max-height.

7. **Chevron** — nph-icon-button ghost compact that expands a row or level.

8. **Expanded item** — Photo in table/thumbnail-size-large, name, description, values.

9. **Empty body** — nph-empty in place of rows, with the header still visible.

## 4. Accessibility

| Criterion | Rule |
|---|---|
| **Contrast** | Text and links pass WCAG AA level (1.4.3) over background. Font colors meet minimum 4.5:1 ratio. |
| **Visible focus** | The scrollable area and truncated text cell receive the focus ring. The ring is the same style as other focusable elements. |
| **Color is not the only signal** | Status has shape and name in addition to color. Badges always have text label. |
| **Touch target** | The chevron and dropdown icon menu are 28 by 28. Edit and delete buttons within cells meet 44 by 44 on touch devices. |
| **Accessible name** | Caption is the table title (caption element). Status icon, Edit button, and dropdown label are announced by screen reader. Truncated text is announced when focused. |

## 5. Properties and Variants

| Property | Rule |
|---|---|
| **size** | default or large. Default uses table/row-height; large uses table/row-height-large for touch or reading with more space. |
| **Border** | none or with. With draws the border in table/border at table/border-width and applies radius in table/radius for a standalone table on the page. |
| **Fixed header** | no or yes. Yes when the body scrolls up to table/body-max-height and the header stays in view. |
| **Focus** | no or yes. Shows the focus ring on the scrollable area. The ring is the same as other interactive elements. |
| **Caption** | Toggles the title above the table. Description and total are in the caption with secondary badge styling. |
| **Content (composite cell)** | two-line text, avatar, badge, actions, category, loading, icon, or rating. |
| **State (cell and composite cell)** | default, hover, and range. Hover paints the entire row in table/row-background-hover. |
| **Grid** | no or yes. Yes enables vertical lines between columns in table/border. |
| **Alignment** | Left for text, right for numbers. Header and footer follow the column alignment. |
| **Expanding row** | Chevron has parts (body, header, indent) and open state (no, yes). Closed points right; open points down. Expanded item has item, value, and badge parts. |
| **Tree** | Level 1, 2, or 3 and open state (no, yes, no children). Each level indents by table/expand-indent plus table/cell-gap; no children preserves chevron space. |
| **Two-level header** | Group title uses the same header component, above the columns. Allows grouping of related columns. |
| **Not a property** | Column width adjusts in use. Status icon color is determined by status value, not a separate property. |

## 6. Usage

**Code:**
```
<nph-table></nph-table>
```

**Import:**
```
import '@iatec/nephos/nph-table';
```

## 7. Relations and Context

- The composite cell receives other components: nph-avatar md, nph-badge, nph-icon-button, nph-button, nph-dropdown-menu, nph-skeleton, and nph-empty.
- The cell controls the row background on hover and range, and applies disabled state when row is disabled.
- The three-dot icon opens nph-dropdown-menu with other actions; Delete is always shown with a destructive style.
- With no results, the empty body carries nph-empty in place of rows, with header still visible.
- Sorting, selection, filtering, and pagination are handled by nph-data-table as a wrapper component.
- Spacing: the cell uses table/cell-padding-inline on sides and table/cell-padding-block on top and bottom; the header and footer use the same padding.

## 8. When to Use

- To read and compare data in rows and columns, such as extracts, reports, or lists.
- Use border when the table is standalone on the page. Use border-less when the table is part of a larger layout or nested within another component.
- Fixed header when the list is long within a panel; the header stays visible as rows scroll.
- Two-level header to group columns of the same aspect, like quarters or categories within a metric.
- Expanding row for detail that does not fit in the row, like expanded payment details or full description.
- Tree up to three levels for hierarchy, such as organizational units, category trees, or nested structures.
- Size large on touch screen or for reading with more air; default for dense displays.
- For sorting, selection, filtering, or pagination, use nph-data-table as a wrapper.

## 9. Examples

- Items grouped by category with total in footer.
- Order with expandable row showing item and photo.
- Table with caption, total, and focus on scrollable area.

## 10. Do

- Align text left and number right, with header and footer following the column.
- Use a dash when data is missing — the person understands no value is present.
- Cut long text only with tooltip and focus on the cell — if space is too short, truncate.
- With two or more actions, show the frequent one in view and hide the rest in the three-dot menu.
- Use caption with description and total on standalone table — it orients the reader.
- Use fixed header when the body scrolls — the column titles stay in view.

## 11. Don't

- Do not leave the cell empty when data is missing; use the text dash or placeholder.
- Do not align numbers left; use right alignment — consistency aids scanning.
- Do not write an action as a link; use nph-button in the cell for better affordance.

## Tokens in Each Part

### Table Tokens

| Token | Usage |
|---|---|
| **table/row-height** | Default row height in pixels. |
| **table/row-height-large** | Large row height for touch or spacious layouts. |
| **table/header-background** | Background color of header row. |
| **table/foreground** | Text color of cells. |
| **table/border** | Border color for table outline and grid lines. |
| **table/border-width** | Width of borders in pixels. |
| **table/radius** | Corner radius for table when border is enabled. |
| **table/body-max-height** | Maximum height of table body before scrolling is enabled. |
| **table/row-background-hover** | Background color on row hover. |
| **table/row-background-range** | Background color for selected or highlighted rows. |
| **table/cell-padding-inline** | Left and right padding inside cells. |
| **table/cell-padding-block** | Top and bottom padding inside cells. |
| **table/cell-gap** | Gap between cell content and borders. |
| **table/expand-indent** | Indentation per level in tree structure. |
| **table/thumbnail-size-large** | Size of thumbnail images in expanded items. |

### Image Tokens

| Token | Usage |
|---|---|
| **image/landscape** | Generic landscape image for table rows. |
| **image** | Generic image placeholder for cell content. |

### Referenced Component Tokens

Components used within nph-table may reference:
- **text/heading-xs** — Header text style.
- **nph-avatar** sizing and spacing.
- **nph-badge** (secondary) — Caption badge styling.
- **nph-button** — Action button styles within cells.
- **nph-icon-button** — Chevron and icon button states.
- **nph-dropdown-menu** — Menu styling for actions.
- **nph-empty** — Empty state presentation.
- **nph-skeleton** — Loading state animation.

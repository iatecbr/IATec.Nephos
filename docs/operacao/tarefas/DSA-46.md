```json
{
  "id": "DSA-46",
  "goal": "Implement the nph-table, the table to read and compare data in rows and columns, with its design documentation accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 231,
  "owner": "elvys",
  "state": "ready",
  "piece": "nph-table",
  "dependencies": [],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-table documentation in Figma was accepted by Indiane, with the Figma UX QA approved and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-46/documentacao-figma-aceita-2026-10-23.md",
      "result": "passed",
      "verified_at": "2026-10-23",
      "verified_by": "indiane"
    }
  ],
  "blockers": [],
  "pending_decisions": [],
  "evidence": [
    "docs/operacao/evidencias/DSA-46/documentacao-figma-aceita-2026-10-23.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-23.md, nph-table approved end-to-end",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-22.md, QA and textual audits completed"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1370-113",
    "date": "2026-10-23",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-table board (1370:113) with COMPONENT_SET (1370:113) was accepted with all 9 parts, properties, variants and states. The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": {
    "branch": null,
    "commit": null,
    "pr": null
  },
  "context": null,
  "updated_at": "2026-10-23"
}
```

# DSA-46 — nph-table, the table to read and compare data

## Goal

The `nph-table` exists in `src/components/nph-table/`, with a spec, tests and stories, in the contract accepted in Figma.

## Where the contract is

In the evidence of the `figma-docs-accepted` gate: `docs/operacao/evidencias/DSA-46/documentacao-figma-aceita-2026-10-23.md`. It carries the Figma documentation converted to text. There is no need to open Figma.

## What the Figma board shows

Board 1370:113 is the root nph-table component with:
- 9 parts: caption, header, cell, composite cell, footer, border and scrollable area, chevron, expanded item, empty body
- 7 properties: size (default or large), border (none or with), fixed header (no or yes), focus (no or yes), caption (toggle), composite cell content (7 types), grid (no or yes), alignment (left or right), expanding row, tree levels (1, 2, 3)
- States: default, hover, range (selected row), stripe (alternating row background)
- Composite cell with 7 content types: two-line text, avatar, badge, actions, category, loading, icon, rating
- Expandable rows with chevron and sub-levels (tree up to 3 levels)
- Two-level header with grouping
- 112 base variants across sizes, borders, header states

## Decisions answered

All decisions are answered in the Figma board 1370:113 and the evidence file. Key decisions (from diarios 22-10 and 23-10):
- table/focus-ring-width: 2 px (new core token, reference core/focus-width/sm)
- color/table-header: new semantic token (claro: core/surface/25, escuro: core/surface/800) for header background separate from table/header-background
- Link text underline only in link variants, not in all composite cells
- Thumbnail image (part 8) uses table/thumbnail-size-large with nph-image, no icon tag

## Tokens to add

Tokens from the nph-table documentation are ready in `src/tokens/source/semantic.tokens.json` and `src/tokens/source/core.tokens.json`:

### Table tokens (15)
- table/row-height — Default row height
- table/row-height-large — Large row height for touch or spacious layouts
- table/header-background — Background color of header row
- table/foreground — Text color of cells
- table/border — Border color for table outline and grid lines
- table/border-width — Width of borders
- table/radius — Corner radius for table when border is enabled
- table/body-max-height — Maximum height of table body before scrolling
- table/row-background-hover — Background color on row hover
- table/row-background-range — Background color for selected or highlighted rows
- table/cell-padding-inline — Left and right padding inside cells
- table/cell-padding-block — Top and bottom padding inside cells
- table/cell-gap — Gap between cell content and borders
- table/expand-indent — Indentation per level in tree structure
- table/thumbnail-size-large — Size of thumbnail images in expanded items

### Image tokens (3)
- image/size-lg — Large image size for table item photos
- image/radius-lg — Corner radius for images
- image/media-width — Width of media container

### New semantic token (1)
- color/table-header — Header background, separate from generic table/header-background

### New core token (1)
- core/focus-width/sm — 2 px for table focus ring (reference as table/focus-ring-width semantic)

### Related tokens (already exist)
- text/heading-xs — Header text style
- table/row-striped-background — Alternating row background
- table/muted-background — Muted row or cell background
- focus/border — Focus border style
- focus/ring-width (4 px for other components, 2 px for table via table/focus-ring-width)

## What is ready in Figma

- Visual acceptance: approved (22-10, decision of Indiane)
- QA of Figma: approved, 2 rodadas, subagents Opus and Sonnet (22-10)
- Textual audit: approved, rodada 7, subagents Opus and Sonnet (23-10), 0 open decisions
- Composite cells with avatar md, badge secondary, icon-button, button, dropdown-menu, rating, skeleton, and empty
- Expanded items with photos from nph-image using table/thumbnail-size-large in cover mode
- All colors, spacings, focus ring and line heights mapped to tokens
- Documentation in 11 sections (purpose, description, anatomy, accessibility, properties, variants, relations, when to use, examples, do, don't) with accessibility requirements (WCAG AA contrast, visible focus, touch targets 28×28 for chevron, 44×44 for actions)

## What code needs to do

1. Component in `src/components/nph-table/nph-table.ts` or `.tsx`
2. CSS with tokens: no hardcoded colors, sizes, or spacing
3. Accessibility: semantic HTML (table, caption, thead, tbody, tr, td), focus ring on scrollable area, aria-label for chevron and actions, status announced by name and shape not color only
4. States: default, hover (row background with table/row-background-hover), range (row background with table/row-background-range), stripe (alternating with table/row-striped-background or table/muted-background), disabled
5. Properties: size (default uses table/row-height, large uses table/row-height-large), border (none or with table/border, table/border-width, table/radius), fixed header (yes freezes header at table/body-max-height), focus ring (yes shows on scrollable area), caption, composite cell content (7 types), grid (yes adds vertical lines), alignment (text left, numbers right), expanding row (chevron, indent by table/expand-indent + table/cell-gap), tree levels (1, 2, 3)
6. Story in Storybook showing all variants and states
7. Tests for rendering, accessibility (contrast, focus, touch targets, semantic HTML), and interactions
8. Spec in `fichas/nph-table.md` (owner: Elvys)

## Checklist before the pull request

See `docs/operacao/tarefas/<other>.md` for the pull request checklist (proof commands, CI, Storybook comparison, QA, merge).

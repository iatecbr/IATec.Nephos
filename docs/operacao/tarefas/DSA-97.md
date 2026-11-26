```json
{
  "id": "DSA-97",
  "goal": "Implement the nph-accordion, a list of sections with a title that the person opens and closes in place, in the grouped, separated and flush appearances, with the multiple and single expansion, in the contract accepted in Figma, and write the spec.",
  "phase": "F4",
  "approved_order": 960,
  "owner": "elvys",
  "state": "done",
  "piece": "nph-accordion",
  "dependencies": [
    "DSA-03",
    "DSA-10",
    "DSA-12",
    "DSA-24",
    "DSA-51",
    "DSA-78"
  ],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-accordion documentation in Figma was accepted by the design owner, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-97/figma-docs-accepted-2026-11-19.md",
      "result": "passed",
      "verified_at": "2026-11-19",
      "verified_by": "indiane"
    },
    {
      "id": "review-and-merge",
      "description": "Component, CSS, tests, stories and spec pass the proof commands and are merged into v/5.0.0.",
      "command": "git merge-base --is-ancestor 7da6d8df43fee2f042a600ed0df4dcd82c5b30cc origin/v/5.0.0",
      "evidence": "docs/operacao/evidencias/DSA-97/review-and-merge-2026-11-26.md",
      "result": "passed",
      "verified_at": "2026-11-26",
      "verified_by": "helifiora"
    }
  ],
  "blockers": [],
  "pending_decisions": [],
  "evidence": [
    "docs/operacao/evidencias/DSA-97/figma-docs-accepted-2026-11-19.md",
    "docs/operacao/evidencias/DSA-97/review-and-merge-2026-11-26.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, component code and specs belong to the code owner; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-14.md to 2026-11-17.md, nph-accordion: adjustment rounds with the corrections of the design owner (soft style, start media, tag and status, a 2 px gap between the title and the description)",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-19.md, nph-accordion: green light (visual acceptance) and the approval items answered by the design owner in three rounds: items 1 to 9 and 11 as recommended (documentation accepted, three tokens straight to the core by decision, the soft border, two extensions of function and one exception, the start media, tag and status moving to the nph-collapsible in an adjustment of its own, hidden until found, four technical points); item 10 with no answer"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=7428-43770",
    "date": "2026-11-19",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-accordion documentation (7428:43770, page 1626:29) was accepted as the API and behavior specification of the nph-accordion, with the visual acceptance of the root (7227:25867). Accordion set 7227:26169, 18 variants; item set 7227:26332, 48 variants; start set 7227:26993, 24 variants. The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": { "branch": "feat/dsa-97-accordion", "commit": "eab7749c", "pr": 191 },
  "context": null,
  "updated_at": "2026-11-26"
}
```

# DSA-97 — nph-accordion, sections that open and close in place

## Goal
The `nph-accordion` in `src/components/nph-accordion/`, with CSS, tests, stories and the spec `fichas/nph-accordion.md`, in the contract accepted in Figma: a list of sections with a title that the person opens and closes to see the content of each one, without leaving the screen. Open, the content pushes down what comes below and covers nothing. It has the appearances grouped (default), separated and flush, the expansion multiple (default) and single, and the sizes default, compact and large. Each item has a trigger with the title and, when the section needs it, start media, a tag next to the title, a status at the end and the indicator.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate: `docs/operacao/evidencias/DSA-97/figma-docs-accepted-2026-11-19.md`. It carries the Figma documentation converted to text, with the 23 tokens, the anatomy part by part (with the token and the text style of each layer), the measured contrast, the default behavior, the combined states, the inherited decisions, the icon and image rules, the limits, what the accordion asks of other pieces and the decisions answered. There is no need to open Figma.

## Specification to follow closely
- **Parts and tokens**: as the anatomy of the evidence. Bind every value to its `accordion/*` token, or to the `collapsible/*` token the evidence names for the item, never to the semantic it points to.
- **Container**: grouped: background `accordion/background`, outline `accordion/border-width` in `accordion/border`, corner `accordion/radius`, padding `accordion/padding` on the four sides, shadow `elevation/raised`, items and dividers with `accordion/divider-spacing` above and below each divider. Separated: each item in its own block with the same background, outline, corner and padding, no shadow, `accordion/item-gap` between blocks, no divider. Flush: no background, outline, padding or shadow, the divider between items. No divider before the first item or after the last. Width: the container's; 560 is only the Figma example width.
- **Divider**: a 1 px horizontal line (`border/width`), color `accordion/divider`, the width of the item. In Figma it is the `nph-separator`; see the open point on its color.
- **Item, until the `nph-collapsible` adjustment (items 7 and 8)**: the accordion item is its own part, with the `collapsible/*` tokens for trigger, texts, indicator, hover, focus, disabled and content, and the `accordion/*` tokens for the start media, the tag, the status and the 2 px gap. Trigger: minimum height `collapsible/trigger-height-compact`, `collapsible/trigger-height` or `collapsible/trigger-height-large` by size; padding `collapsible/trigger-padding-x` and `collapsible/trigger-padding-y` (`-compact` in compact); parts centered vertically: start, text block (title line with title and tag; description below at `accordion/title-gap`), end status, indicator; with the indicator at the start: indicator, start, text block, end.
- **Start media** (optional, one type per list): icon (`nph-icon` light, `collapsible/icon-size`, `collapsible/icon-foreground`), tile (`nph-icon` light in `accordion/tile-icon-size`, `accordion/tile-icon-size-large` in large, color `accordion/tile-foreground`, on a box `accordion/tile-background`, corner `accordion/tile-radius`, padding `accordion/tile-padding-compact` in compact and `accordion/tile-padding` otherwise), avatar (`nph-avatar` sm, md, lg), image (`nph-image` xs, sm, md, 1:1), or status icon (`circle-check`, `triangle-exclamation`, `circle-xmark`, `clock`, light, `collapsible/icon-size`, color `accordion/status-*-icon`). Gap to the title `collapsible/trigger-gap` with the icon and the status icon, `accordion/media-gap` with tile, avatar and image. The media size follows the item size (24, 32, 40; image 48 in large).
- **Title, tag and description**: title `text/label-md` (`text/label-lg` in large), `collapsible/title-foreground`, it wraps; the tag `nph-badge` primary light at `accordion/tag-gap`, centered on the title line, which becomes 24 high; the description `text/body-sm`, `collapsible/description-foreground`, `accordion/title-gap` below the title line.
- **End status**: `nph-badge` light of the status (success, warning, error; secondary for pending), always with text. Indicator at the end: `collapsible/trigger-gap` before it (the right padding of the text block) and `accordion/end-gap` before the indicator. Indicator at the start: `collapsible/trigger-gap` before it (its own left padding) and nothing after it.
- **Indicator**: `nph-icon` `chevron-down` light at the end, turns 180 degrees on open; `chevron-right` light at the start, turns 90 degrees to point down. `collapsible/indicator-size`, `collapsible/indicator-foreground`. Decorative.
- **Hover and open**: hover paints only the trigger in `collapsible/trigger-background-hover`, a pill with `collapsible/trigger-radius`: inset by the container padding in grouped and separated, the full width in flush. Open does not change the background.
- **Focus**: only with the keyboard (`:focus-visible`), on the trigger, not on the container: border `collapsible/focus-border` (`collapsible/focus-border-width`, `collapsible/focus-border-radius`) and halo outside it `collapsible/focus-halo` (`collapsible/focus-halo-width`, `collapsible/focus-halo-radius`). The halo may cover the neighbor divider by 1 px; the border stays whole.
- **Content**: right below the trigger, padding `collapsible/content-padding-top`, `collapsible/content-padding-x`, `collapsible/content-padding-bottom`, body gap `collapsible/content-gap`; no indent for the start media; with the indicator at the start, an indent of the indicator size plus `collapsible/trigger-gap`. A free slot.
- **Disabled**: the whole item at `collapsible/disabled-opacity`, `disabled` on the button, out of the Tab order, it does not open. Open and disabled is only for a whole locked section: the content stays in view under the same opacity (T11, rule 1). The status stays in view under the same opacity. A disabled item takes no hover (the states are exclusive in Figma).
- **Open that does not close** (APG): the trigger takes `aria-disabled="true"` and stays in the Tab order; the item keeps the plain open look, with no opacity. It is not the open and disabled look.
- **Keyboard and roles**: the default behavior table of the evidence. Each trigger is a `button` with `aria-expanded` and `aria-controls`, the only child of a heading whose level comes from the page (`h3` by default, changeable). Tab and Shift+Tab go through the triggers; Enter and Space open and close; the focus stays on the trigger. Arrows, Home, End and Esc have no effect; an outside click does nothing. Content: `role="region"` with `aria-labelledby` on the trigger, except when more than about six panels can be open at once. Single expansion: opening one closes the other; the open one can close; all closed is allowed.
- **Accessible name** (item 11): title, then tag, short description and status, as text inside the button, in that order; no `aria-label` on the button. The long description goes to the content. Start media decorative (`aria-hidden` on the icon, `alt=""` on the image and the avatar); the status icon is decorative only when the end status tag is there, otherwise it carries a hidden text.
- **Direct link and page search** (item 9): closed content in `hidden="until-found"` (plain `hidden` when disabled); `beforematch` opens the item and sets `aria-expanded`; with no support, the item of the `#id` opens on load. The `nph-collapsible` already does the `until-found` part.
- **Motion**: the content grows and the indicator turns in `collapsible/expand-duration` with `collapsible/expand-easing` (on `motion/expand-*`), as the `nph-collapsible`; with reduced motion, no animation.
- **Images**: the start image is exported at 2x (48, 64 and 96 px), 1:1 crop filling the box (item 11).

## Open points for the code
- Event, aria, slot, property and console warning, following the APG and the Custom Elements Manifest.
- **API**: how the items are declared (a child element per item or another way), how the appearance, the expansion and the size of the accordion reach every item (the size never changes item by item), and how each item gets its title, description, start type and media, tag, status, indicator side, open and disabled state. The spec names them.
- **Item and `nph-collapsible`**: until the adjustment of items 7 and 8, the accordion item is its own part; how much code it shares with the `nph-collapsible` is the code owner's call. The look and the tokens do not change. The differences from the collapsible today are in the evidence ("What the accordion asks of other pieces"): description inside the button name, heading, start media, tag and status, the open that does not close, and the 2 px gap.
- **Divider color**: `fichas/nph-separator.md` fixes the separator color at `color/border`, and its CSS has no color hook. The accepted color is `accordion/divider` (`color/border-subtle`), thickness `border/width`. How the accordion paints the line stays with the code, and the spec names the path: the accordion sets the color of the separator it holds, or it draws its own 1 px line with `border/width`. The color and the thickness do not change. The same case as the `nph-timeline` connector line (DSA-89).
- **Short and long description**: what tells the item that the description is short (inside the button) or long (in the content): a property, a slot or a length rule. The spec names it.
- **Region and many panels**: how the code decides to drop `role="region"` when more than about six panels can be open at once (the multiple expansion with many items). The spec names it.
- **Status icon text**: the hidden text of the start status icon when there is no end tag, and its translation keys. The spec names them.
- **Open that does not close**: how the product marks an item that cannot close (property or attribute), as the APG case, with `aria-disabled="true"` on the trigger. The spec names it.
- **Locked section** (item 11, research note): consider `aria-disabled` also on the whole locked section (open and disabled), so a screen reader user knows it exists; today it is `disabled` on the button, out of the Tab order. The spec says which.
- **Single expansion and the special items**: what the single expansion does (a) when more than one item is marked open (on load, or when the accordion changes from multiple to single), (b) with an item marked as not closing when another item opens, and (c) with an open and disabled item (a locked section) when another item opens. Figma draws at most one open item in the single expansion and none of these cases. In the APG, the single expansion closes the other panel, and the button of a visible panel that cannot close takes `aria-disabled`; it follows from the APG (a deduction, not its text) that opening another header closes that panel and moves `aria-disabled` to the new one. The spec names the rule for each case; the look does not change.
- **Browser support of `hidden="until-found"`**: check the compatibility table before the code (read on 2026-11-16: Chrome and Edge 102, Firefox 148, Safari 26.2 partly); the fallback opens the item of the `#id` on load.

## Why it is ready
The `accordion/*` tokens came with this task and are on `v/5.0.0`: 20 alias semantics, and `accordion/title-gap`, `accordion/tile-padding` and `accordion/tile-padding-compact` point straight to the core by decision (the evidence says why). No new value entered the core; no semantic changed value; six semantic descriptions gained the accordion. The item uses the `collapsible/*` tokens, already on `v/5.0.0` (DSA-78). Every piece it uses is done: `nph-icon` (DSA-03), `nph-separator` (DSA-10), `nph-badge` (DSA-12), `nph-avatar` (DSA-24), `nph-image` (DSA-51), `nph-collapsible` (DSA-78).

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS, tests, stories and spec pass the proof commands in `docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## What this task does not do
The code does not create a token or change a token value. It does not change Figma. It does not change the `nph-collapsible`: the start media, the tag and the status move to it, and `collapsible/title-gap` goes to 2, in an adjustment of its own with its own task, after its Figma (items 7 and 8); then the accordion item becomes an instance of it and `accordion/title-gap` leaves. It does not create a semantic of inner padding of a small piece: that is a foundation task (item 3).

## Sources
- Figma `DS-IA-NEPHOS 5.0`, page `1626:29`, documentation frame `7428:43770`, root `7227:25867`, appendix `7428:44347` and the evidence of the `figma-docs-accepted` gate
- Component sets: nph-accordion `7227:26169`; item `7227:26332`; start `7227:26993`
- WAI-ARIA APG, accordion: https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
- APG revision without arrow keys: https://github.com/w3c/aria-practices/pull/3434
- WAI-ARIA APG, names and descriptions: https://www.w3.org/WAI/ARIA/apg/practices/names-and-descriptions/
- WAI-ARIA APG, keyboard interface: https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/
- MDN, hidden until found: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/hidden
- GOV.UK accordion: https://design-system.service.gov.uk/components/accordion/
- W3C decorative images: https://www.w3.org/WAI/tutorials/images/decorative/
- WCAG 2.2, animation from interactions: https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html
- Custom Elements Manifest: https://github.com/webcomponents/custom-elements-manifest
- `design.md` — the tokens named in the evidence
- `fichas/nph-collapsible.md`, `fichas/nph-separator.md`, `fichas/nph-badge.md`, `fichas/nph-avatar.md`, `fichas/nph-image.md`, `fichas/nph-icon.md`

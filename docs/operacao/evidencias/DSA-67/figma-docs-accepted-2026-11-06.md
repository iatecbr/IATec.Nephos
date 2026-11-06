```json
{
  "task": "DSA-67",
  "gate": "figma-docs-accepted",
  "date": "2026-11-06",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=4749-5857",
    "date": "2026-11-06",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "Indiane accepted the nph-popover documentation frame (4749:5857, page 1626:23), with the Figma UX QA and the textual audit approved, and approved 12 of the 13 points of the approval page: documentation acceptance; color/border-subtle as a new semantic token for the soft border and divider of floating layers; status/error-text as a new semantic token for the validation error text of nph-field; space/inline-loose from 16 to 12, with pagination/group-gap kept at 16 straight on core; the 12 between title and content straight on core; the widths 240, 320 and 400 as new core values; the radius 14 straight on core; the 4 offset straight on core, with navigation-menu/panel-offset aligned to it; the arrow 16 x 8 with a 16 inset straight on core; compact footer buttons; the open trigger in the hover-active state with aria-expanded; the popover parts of its own, with no nph-card inside. She rejected keeping the popover out of the first version: it enters the first version now. COMPONENT_SET nph-popover (4727:1544), side x alignment x arrow x size, 15 variants."
  }
}
```

# DSA-67 — `figma-docs-accepted`

The documentation of `nph-popover` (frame `4749:5857`) was accepted in Figma on 2026-11-06, in the file `DS-IA-NEPHOS 5.0`, with the Figma UX QA and the textual audit approved. The popover enters the first version of Nephos. The piece needed 19 `popover/*` tokens, put on `v/5.0.0` together with this task, plus:

- two new semantic tokens: `color/border-subtle` (light `core/neutral/50` #f1f1f1, dark `core/alpha/white-10`), the soft border and divider of floating layers; and `status/error-text` (light `core/danger/600`, dark `core/danger/300` #ea7d7d), the validation error text over a neutral surface;
- three new core values: `core/layout-width/popover-sm` (240), `-md` (320) and `-lg` (400). By decision they are new: the existing 240, 320 and 400 are named after the separator, the field, the rich option and the dialog;
- `core/alpha/white-10`, which Figma had and the code did not;
- a new value for `space/inline-loose`: `core/space/300` (12) instead of `core/space/400` (16). It is the gap between the footer actions of dialog, alert and popover;
- `pagination/group-gap` now points straight to `core/space/400` (16), by decision, so the pagination does not change;
- `navigation-menu/panel-offset` now points straight to `core/space/100` (4), by decision, like `popover/offset`. The value does not change.

Six `popover/*` tokens point straight to core, by decision, besides the three widths: `popover/radius` (`core/radius/600`, 14), because `radius/container` resolves to 8 and the 14 comes from the soft style; `popover/header-gap` (`core/space/300`, 12), because `space/stack-snug` resolves to 8; `popover/offset` (`core/space/100`, 4), because `space/inline-tight` and `space/stack-tight` are gaps between items, not the distance to the anchor; `popover/arrow-width` and `popover/arrow-inset` (`core/space/400`, 16) and `popover/arrow-height` (`core/space/200`, 8), because no semantic token describes an arrow, and an arrow inset is not an inner margin. Every other `popover/*` token is an alias of a semantic token.

There is no command output. The acceptance is a human observation, recorded in the json block above with the frame URL and the component set.

The rest of this file is the contract converted to text, so that whoever codes does not need to open Figma. Figma property and value names stay as they are in Figma (`lado`, `alinhamento`, `seta`, `tamanho`, `descrição`, `corpo`, `fechar`, `rodapé`, `texto do título`, `texto da descrição`); the code API is in English. Figma sample texts are translated here.

## Purpose

A non-modal floating surface, anchored to a trigger and opened by click, Enter or Space. It gathers a title, a description and short controls without taking the person away from the page. It varies by side, alignment, arrow and size; description, body, close and footer turn the parts on and off. The footer is a band of its own, set apart from the content by a soft divider.

Use it to filter, choose a due date or rename something without leaving the page. It opens when the trigger is activated; it closes with Esc, a click outside, the close button or the footer action, and the focus goes back to the trigger. It does not replace nph-dropdown-menu (a list of commands) nor a modal dialog (a decision that blocks the page). For short text with no action, use a text next to the element.

## Tokens

| Token | Points to | Part |
|---|---|---|
| `popover/background` | `color/popover` | Surface and arrow fill |
| `popover/foreground` | `color/popover-foreground` | Title |
| `popover/description` | `color/muted-foreground` | Description |
| `popover/border` | `color/border-subtle` | Surface border and arrow outline |
| `popover/divider` | `color/border-subtle` | Divider between content and footer |
| `popover/border-width` | `border/width` (1) | Border, arrow outline and divider |
| `popover/radius` | `core/radius/600` (14) | Surface corners |
| `popover/padding` | `space/container-padding` (16) | Content inner margin |
| `popover/footer-padding` | `space/container-padding` (16) | Footer actions inner margin |
| `popover/header-gap` | `core/space/300` (12) | Between title, description and body |
| `popover/title-gap` | `space/inline` (8) | Between title and close button |
| `popover/footer-gap` | `space/inline-loose` (12) | Between the footer actions |
| `popover/width-sm` | `core/layout-width/popover-sm` (240) | Surface width, size sm |
| `popover/width-md` | `core/layout-width/popover-md` (320) | Surface width, size md (default) |
| `popover/width-lg` | `core/layout-width/popover-lg` (400) | Surface width, size lg |
| `popover/offset` | `core/space/100` (4) | Trigger to surface |
| `popover/arrow-width` | `core/space/400` (16) | Arrow base |
| `popover/arrow-height` | `core/space/200` (8) | Arrow height |
| `popover/arrow-inset` | `core/space/400` (16) | Arrow inset from the surface edge, with alignment start or end |

The shadow is the `elevation/dropdown` style, with no component token: diffuse in light, none in dark. Title and description use the core typography bound in Figma: title Noto Sans `core/size/300`, `core/line-height/300`, `core/weight/medium`; description `core/size/100`, `core/line-height/100`, `core/weight/regular`; both `core/tracking/normal`. Focus has no token of its own: each inner piece shows its own focus ring.

## Anatomy

1. **Trigger** — an nph-button instance, secondary solid. Open, it uses the `hover-active` state.
2. **Surface** — background `popover/background`, a very soft 1 px border in `popover/border` (light #f1f1f1; dark, translucent white), corners of 14 (`popover/radius`), a diffuse shadow in light and none in dark. The content has an inner margin of 16 (`popover/padding`). The surface does not clip what is inside, so the focus ring is not cut.
3. **Title** — always visible; it names the surface.
4. **Description** — optional (`descrição`), in `popover/description`.
5. **Body** — optional (`corpo`), an nph-field instance.
6. **Close** — optional (`fechar`), a compact ghost nph-icon-button with the `xmark` icon.
7. **Footer** — optional (`rodapé`), a band of its own below the content: a 1 px divider from edge to edge, in the border color (`popover/divider`, an nph-separator instance in Figma), and the actions, secondary solid and primary solid compact nph-button (28 tall), with 12 between them (`popover/footer-gap`), aligned to the end and with 16 around them (`popover/footer-padding`). In the code it is a single divider.
8. **Arrow** — optional (`seta=com`), it points to the trigger. Fill `popover/background`, outline `popover/border`, `popover/arrow-width` x `popover/arrow-height`, inset `popover/arrow-inset`. It is decorative.

In Figma the border, the arrow outline and the divider each have one layer per theme; both layers use the same token, so the code needs only one.

## Properties

| Figma property | Rule |
|---|---|
| `lado` (side) | `bottom` (default), `top`, `right` or `left`. Where the surface opens relative to the trigger. |
| `alinhamento` (alignment) | `start`, `center` (default) or `end`. How the surface aligns to the trigger on the chosen side. |
| `seta` (arrow) | `sem` (without, default) or `com` (with). With the arrow, the tip points to the trigger. |
| `tamanho` (size) | `sm` 240, `md` 320 (default) or `lg` 400 wide. It changes only the width: margins of 16, gaps and footer buttons stay the same, and the height follows the content. |
| Combinations | Without the arrow, the set varies only the size, and the code resolves the position. With the arrow, it varies side and alignment, at size md. |
| `descrição`, `corpo`, `fechar`, `rodapé` | Turn each part on and off. Description comes on; body, close and footer come off. The divider comes with the footer: without the footer there is no divider. |
| `texto do título`, `texto da descrição` | Surface texts. The title is always visible. |

Not properties:
- **Trigger**: an nph-button instance inside each variant. Open, the trigger uses the `hover-active` state.
- **Open and closed**: closed, only the trigger shows; open, the trigger and the surface show.
- **Color, border, divider and shadow**: they come from the surface and divider tokens and from the shadow style.

## Accessibility

| Criterion | Rule |
|---|---|
| Contrast | Title and description pass 4.5:1 over the surface in both themes. Border and divider are decorative: in light, #f1f1f1 over white is very soft, and the surface stands apart from the background by the shadow; in dark, by the lighter background. |
| Visible focus | The trigger, the close button, the field and the footer buttons show the focus ring of their own component. On Apply (primary solid), the focus border sits 1 px outside the fill, in the same color, and passes 3:1 against the surface in both themes; the halo around it is decoration, as in nph-button. The surface takes no ring. |
| Color is not the only signal | Open, the surface shows anchored to the trigger and the trigger carries `aria-expanded="true"`; the `hover-active` state of the trigger is an extra signal, not the only one. In light, the open trigger looks almost like the closed one. |
| Touch target | The trigger is 36 tall (`control/height-default`). The close button is 28 x 28 and the footer buttons are 28 tall (`control/height-compact`), above the 24 x 24 minimum. On a touch screen, the footer buttons go back to the default size, 36. |
| Accessible name | The surface is named by the title (`aria-labelledby`) and described by the description (`aria-describedby`). The trigger has text or `aria-label`. The close button carries `aria-label` "Close". The arrow is decorative (`aria-hidden`). The trigger carries `aria-haspopup`, `aria-expanded` and `aria-controls`. |

## Relations and context

It combines with nph-button (trigger and footer), nph-icon-button (close), nph-field (body) and nph-separator (footer divider). Body, close, divider and buttons come in by instance; title and description are text of the popover itself. The popover controls position, opening and focus; each inner piece controls its own color and state.

| Space | Token |
|---|---|
| Trigger to surface | 4 (`popover/offset`) |
| Inner margin | 16 (`popover/padding`) |
| Title to close | 8 (`popover/title-gap`) |
| Title to description or field | 12 (`popover/header-gap`) |
| Between the footer buttons | 12 (`popover/footer-gap`); the actions have 16 around them (`popover/footer-padding`) |

## When to use

Use it when the person needs to adjust or decide something short without losing their place on the page. Choose no arrow by default; use the arrow when the trigger sits among other elements and the link needs to be clear. The default size is md: use sm for a short title and description, md when the footer or a field comes in, and lg when the field needs more width. Turn the footer on when the action needs confirmation; the divider comes with it. Turn the close button on when there is no footer and the content asks for a visible way out besides Esc and a click outside, such as information to read calmly.

## Required examples

Three use cases, in light and dark:

1. Filter with confirmation: footer with Clear and Apply.
2. Short form: body with nph-field and footer.
3. Information with close, no footer, with the arrow.

## Do

- Write a short title that states the decision — it names the surface for the screen reader.
- Keep a single primary action, at the end of the footer — the main path stays clear.
- Prefer no arrow — the link to the trigger is already clear by proximity and the drawing is cleaner; use the arrow only when the trigger sits among other elements.
- Return the focus to the trigger on close — the person goes on from where they were.
- Keep the divider only between the content and the footer actions — it sets apart what is read from what is done, without weighing the surface.

## Do not

- Do not use two primary actions in the footer — use one primary solid and one secondary solid.
- Do not use an outlined trigger — use the secondary solid nph-button, with a tonal background.
- Do not use it for a short notice with no action — use a short text next to the element, with no floating surface.
- Do not use it for a decision that blocks the page — use a modal dialog.

## Appendix points answered

1. Inner margin: `space/container-padding` (16), in the content and in the actions.
2. Radius: `popover/radius` straight to `core/radius/600` (14), by decision.
3. Widths: 240, 320 and 400 in the new `core/layout-width/popover-sm`, `-md` and `-lg`.
4. Arrow: optional, off by default, 16 x 8, with a 16 inset, straight to core.
5. Offset: 4, `popover/offset` straight to `core/space/100`; `navigation-menu/panel-offset` aligned to the same core value.
6. Scope: the popover enters the first version now.
7. Popover inside a dialog: out of scope for now.
8. Border in dark: closed together with point 19.
9. Tokens: the ones above; the shadow stays in the `elevation/dropdown` style.
10. The trigger is a fixed nph-button instance, with no piece swap.
11. Shadow in dark: none; the elevation comes from the lighter surface.
12. The size changes only the width.
13. Widths in core: answered with point 3.
14. Trigger attributes: `aria-haspopup`, `aria-expanded` and `aria-controls`, in the code.
15. The popover parts are its own; no nph-card inside.
16. 12 between title and content: `popover/header-gap` straight to `core/space/300`.
17. Trigger emphasis: secondary solid.
18. Open trigger: `hover-active` state plus `aria-expanded="true"`, with no new nph-button variant.
19. Border and divider: `color/border-subtle`, one token for both themes.
20. Compact footer buttons (28); on a touch screen they go back to 36.
21. 12 between the footer actions: `space/inline-loose` now resolves to 12, so the nph-dialog footer also moves to 12; `pagination/group-gap` stays at 16 on core.
22. Error text in dark: the nph-field error message moves from `status/error` to `status/error-text`; light is unchanged, dark goes from 3.37:1 to 4.69:1 over the popover.

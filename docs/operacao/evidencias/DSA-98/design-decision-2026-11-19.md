```json
{
  "task": "DSA-98",
  "gate": "design-decision",
  "date": "2026-11-19",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-19.md",
    "date": "2026-11-19",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The design owner answered two open points of the motion rule after market research with sources: the motion exception of DSA-78 D-3 widens from the nph-collapsible content to disclosure content that grows in place (the nph-collapsible content, the panel of the nph-accordion item and the block of a group and of a subgroup of the nph-panel-menu), and the block of the nph-panel-menu is built with the nph-collapsible, so the panel-menu/expand-* tokens leave."
  }
}
```

# DSA-98 — `design-decision`

## The decisions
On 2026-11-19 the design owner answered two points that the review of DSA-78 D-3 left open. Both followed the recommendation of the market research of that day.

| Item | Answer | What the code does today |
|---|---|---|
| The motion rule | The exception widens to disclosure content that grows in place: the content of the `nph-collapsible`, the panel of the `nph-accordion` item and the block of a group and of a subgroup of the `nph-panel-menu` animate their grid rows in `motion/expand-*`; with reduced motion they open at once. Written in `design.md` with this task | — |
| The block of the panel menu | Built with the `nph-collapsible`, so there is one piece that grows in place; the `panel-menu/expand-*` tokens leave | `.block` in `nph-sidebar.css` animates `grid-template-rows` with its own `panel-menu/expand-duration` and `panel-menu/expand-easing`; it already follows the phase machine of the `nph-collapsible` (P121), in its own code |

## Why
- Mature systems share one disclosure piece between the accordion and the navigation submenu: Fluent 2 uses the same `Collapse` in `NavSubItemGroup` and in `AccordionPanel`; shadcn builds a collapsible sidebar group by wrapping it in `Collapsible`; the Radix accordion is built on the Radix collapsible.
- None of them writes a motion exception per component: the exception is the pattern.
- Chrome names the disclosure and the accordion as the typical use of animating to the natural height, and asks to turn it off with reduced motion.

## Sources
https://github.com/microsoft/fluentui/blob/master/packages/react-components/react-nav/library/src/components/NavSubItemGroup/useNavSubItemGroup.ts ; https://github.com/microsoft/fluentui/blob/master/packages/react-components/react-accordion/library/src/components/AccordionPanel/useAccordionPanel.ts ; https://ui.shadcn.com/docs/components/sidebar ; https://github.com/radix-ui/primitives/blob/main/packages/react/accordion/src/accordion.tsx ; https://developer.chrome.com/docs/css-ui/animate-to-height-auto ; https://web.dev/articles/animations-guide

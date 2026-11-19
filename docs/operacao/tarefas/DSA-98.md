```json
{
  "id": "DSA-98",
  "goal": "Build the block of the nph-panel-menu that grows in place with the nph-collapsible, so the panel menu and the collapsible share one disclosure piece and the panel-menu/expand-* tokens leave, with the tests, the spec and the stories changed in the same work.",
  "phase": "F4",
  "approved_order": 970,
  "owner": "elvys",
  "state": "ready",
  "piece": "nph-sidebar",
  "dependencies": [
    "DSA-76",
    "DSA-78"
  ],
  "gates": [
    {
      "id": "design-decision",
      "description": "The design owner widened the motion exception to disclosure content that grows in place and chose to build the block of the panel menu with the nph-collapsible, after market research with sources.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-98/design-decision-2026-11-19.md",
      "result": "passed",
      "verified_at": "2026-11-19",
      "verified_by": "indiane"
    },
    {
      "id": "review-and-merge",
      "description": "The component, the CSS, the tests, the spec and the stories change together, pass the proof commands and are merged into v/5.0.0.",
      "command": null,
      "evidence": null,
      "result": "pending",
      "verified_at": null,
      "verified_by": null
    }
  ],
  "blockers": [],
  "pending_decisions": [],
  "evidence": [
    "docs/operacao/evidencias/DSA-98/design-decision-2026-11-19.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, component code and specs belong to the code owner; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-19.md, the motion exception widened to disclosure content that grows in place, and the block of the panel menu built with the nph-collapsible"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-19.md",
    "date": "2026-11-19",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The motion exception of DSA-78 D-3 covers disclosure content that grows in place. The block of the nph-panel-menu is built with the nph-collapsible and its panel-menu/expand-* tokens leave. The decision and its sources are in the evidence of the design-decision gate."
  },
  "git_review": { "branch": null, "commit": null, "pr": null },
  "context": null,
  "updated_at": "2026-11-19"
}
```

# DSA-98 — the block of the panel menu built with the nph-collapsible

## Goal
The group and the subgroup of the `nph-panel-menu` open in place with their own code: `.block` in `nph-sidebar.css` animates `grid-template-rows` with `panel-menu/expand-duration` and `panel-menu/expand-easing`. The `nph-collapsible` does the same growth with `collapsible/expand-*`. On 2026-11-19 the design owner chose one disclosure piece for both.

## Where the decision is
The evidence of the `design-decision` gate has the answer, what the code does today, why and the sources. The motion rule of `design.md` ("Animate opacity and transform" and `movimento_regras.excecao`) already names the group of the panel menu in the exception.

## What changes
1. The block of a group and of a subgroup of the panel menu grows with a part it shares with the `nph-collapsible`: the grid track, the clip and the phase machine (P121). How much code it shares is the code owner's call. If it needs a new public part, attribute or slot of the `nph-collapsible`, stop and ask the design owner.
2. The growth of the block reads `collapsible/expand-duration` and `collapsible/expand-easing`. Both point to `motion/expand-*`, as the panel-menu tokens do, so the time and the curve do not change. The turn of the arrow keeps following the resolved time of the block, as today.
3. With reduced motion the block opens and closes at once, as today.
4. The look, the focus halo of the lines inside, `hidden` when closed and `inert` while it closes stay as they are.
5. The `panel-menu/expand-*` tokens leave the code: the CSS, the tests, the spec `fichas/nph-sidebar.md` (with the metadata generated again by `node scripts/verificar-operacao.mjs --gerar-metadata`), the Storybook texts (`.storybook/i18n`) and `docs/decisoes-tecnicas.md`.
6. The tokens leave `src/tokens/` in the same pull request, by Claude: when this task is `in-review`, Claude pushes to its branch the removal from the token source and the generated CSS, and from the `motion/expand-*` use texts of `design.md`. Until then, the test that every token of the panel-menu family is read (`nph-sidebar.test.ts`) fails on those two names; that is expected.

## How it is proved
- `npm run test:operacao`, `npm run test:naming`, `npm run test:tokens`.
- The block imports the part it shares with the `nph-collapsible`, and the phase tests run on that part.
- The unit tests of `nph-sidebar` keep passing for the panel menu: open, close, keyboard, reduced motion, and every token of the family read, after the token removal of item 6.
- At the merge, no `panel-menu/expand-*` reference is left in `src/`, `fichas/`, `.storybook/`, `docs/decisoes-tecnicas.md` or `design.md`.

## What this task does not do
It does not create a token or change a token value; the removal of item 6 is Claude's. It does not change Figma. It does not change the `nph-collapsible` contract nor the `nph-accordion`, which DSA-97 already specifies to grow as the collapsible.

## Sources
https://github.com/microsoft/fluentui/blob/master/packages/react-components/react-nav/library/src/components/NavSubItemGroup/useNavSubItemGroup.ts ; https://ui.shadcn.com/docs/components/sidebar ; https://github.com/radix-ui/primitives/blob/main/packages/react/accordion/src/accordion.tsx ; https://developer.chrome.com/docs/css-ui/animate-to-height-auto

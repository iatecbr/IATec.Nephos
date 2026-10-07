```json
{
  "task": "DSA-16",
  "worktree": "C:/dev/nephos-wt-lote-c",
  "start_sha": "455ead8",
  "end_sha": null
}
```

# DSA-16 — short context

## Goal of this pass
Build `nph-input` in Batch C, up to Storybook ready for the acceptance by Indiane.

## Sources opened
Figma `1195:532` and `622:18359`; `AGENTS.md`, `GOVERNANCA.md`, `design.md`, `docs/decisoes-tecnicas.md`, `docs/stories.md`, `docs/operacao/README.md`.

## Changes
`src/components/nph-input/`, `.storybook/i18n/`, P69 in `docs/decisoes-tecnicas.md`.

## Commands run
`npm run typecheck`, `npm test`, `npm run test:i18n`, `npm run test:naming`, `npm run build-storybook`, `npm run test:operacao`.

## Result
Code, stories and tests on the branch `feat/lote-c-input-checkbox-radio`.

## Evidence
`docs/operacao/evidencias/DSA-16/`.

## Blocker
None. The spec and the PR wait for the acceptance by Indiane in Storybook.

## Next command
`npm run storybook`, then the spec at `fichas/nph-input.md` after the acceptance.

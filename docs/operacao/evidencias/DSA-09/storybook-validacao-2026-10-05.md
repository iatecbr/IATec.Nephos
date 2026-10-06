```json
{
  "tarefa": "DSA-09",
  "gate": null,
  "data": "2026-10-05",
  "responsavel": "claude-codigo",
  "comando": "npx storybook dev -p 6022 --no-open; reading through getBoundingClientRect and getComputedStyle in the integrated browser",
  "codigo_de_saida": null,
  "sha": null,
  "origem_externa": null
}
```

# DSA-09 — `nph-spinner` in Storybook

Proof of the `Validação` stories opened in the integrated browser (Chromium), on the
branch `feat/lote-a-icon-spinner-separator-kbd`, before the commit that goes to
inspection. Each story was opened in the light and dark schemes, at 375 px and at 188 px
wide (the equivalent of zoom 2 at 375). No story scrolled horizontally.

This evidence is not a gate evidence. Its name does not follow `<gate>-<date>`.

| Story | Measurement | Color and semantics |
|---|---|---|
| `Tamanhos` | sm 16 x 16 and md 20 x 20, in both schemes, at 375 and at 188 px | inherited color: light rgb(0, 0, 0), dark rgb(227, 227, 227) |
| `Acessibilidade` | with text beside it: aria-hidden=true; without text: role=img, `aria-label=Salvando` | 16 x 16 |
| `Entrada invalida` | size=lg: 0 x 0, aria-hidden=true, no role | nothing drawn |

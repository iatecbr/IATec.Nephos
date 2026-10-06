```json
{
  "tarefa": "DSA-12",
  "gate": null,
  "data": "2026-10-05",
  "responsavel": "claude-codigo",
  "comando": "npx storybook dev -p 6023 --no-open; read through getComputedStyle and getBoundingClientRect in the integrated browser",
  "codigo_de_saida": null,
  "sha": null,
  "origem_externa": null
}
```

# DSA-12 — `nph-badge` in Storybook

Proof of the `Validação` stories and of the `Docs` page opened in the integrated
browser (Chromium), on the `feat/lote-b-badge-button` branch. The scheme was
switched at the root (`data-nph-color-scheme` on `html`), in the default brand.

This evidence is not a gate evidence. The name does not follow `<gate>-<data>`.

| Story | Measurement | Color |
|---|---|---|
| `Com ícone` | 24 high; 69.66 wide with `Selo` and the icon (Figma, which rounds the text, gives 70) | background, text and icon of each pair equal to the Figma read on the same day, in both schemes. E.g.: light `primary` `solid` `#2f68c5` and `#ffffff`; dark `success` `light` `#04210f` and `#d0eddb` |
| `Matriz`, `Com ícone`, `Duas palavras` | no horizontal scrolling at 375 and at 188 px | — |
| `Docs › Documentação` | no scrolling at 375 px; at 188 px it scrolls (212 wide), like the `Docs` page of `nph-icon` on the base, because of the tables and cards of `src/shared/docs/page.ts` | — |

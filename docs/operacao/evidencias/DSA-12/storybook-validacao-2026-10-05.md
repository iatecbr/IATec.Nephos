```json
{
  "tarefa": "DSA-12",
  "gate": null,
  "data": "2026-10-05",
  "responsavel": "claude-codigo",
  "comando": "npx storybook dev -p 6023 --no-open; leitura por getComputedStyle e getBoundingClientRect no navegador integrado",
  "codigo_de_saida": null,
  "sha": null,
  "origem_externa": null
}
```

# DSA-12 — `nph-badge` no Storybook

Prova das stories `Validação` e da pagina `Docs` abertas no navegador
integrado (Chromium), na branch `feat/lote-b-badge-button`. O esquema foi
trocado na raiz (`data-nph-color-scheme` no `html`), na marca padrao.

Esta evidência não é de gate. O nome não segue `<gate>-<data>`.

| Story | Medida | Cor |
|---|---|---|
| Com ícone | 24 de altura; 69,66 de largura com "Selo" e ícone (o Figma, que arredonda o texto, dá 70) | fundo, texto e ícone de cada par iguais ao Figma lido no mesmo dia, nos dois esquemas. Ex.: claro `primary` `solid` `#2f68c5` e `#ffffff`; escuro `success` `light` `#04210f` e `#d0eddb` |
| Matriz, Com ícone, Duas palavras | sem rolagem horizontal a 375 e a 188 px | — |
| Docs › Documentação | sem rolagem a 375 px; a 188 px rola (212 de largura), como a pagina Docs do `nph-icon` na base, por causa das tabelas e cartões de `src/shared/docs/page.ts` | — |

```json
{
  "tarefa": "DSA-10",
  "gate": null,
  "data": "2026-10-05",
  "responsavel": "claude-codigo",
  "comando": "npx storybook dev -p 6022 --no-open; leitura por getBoundingClientRect e getComputedStyle no navegador integrado",
  "codigo_de_saida": null,
  "sha": null,
  "origem_externa": null
}
```

# DSA-10 — `nph-separator` no Storybook

Prova das stories `Validação` abertas no navegador integrado (Chromium), na
branch `feat/lote-a-icon-spinner-separator-kbd`, antes do commit que vai para
inspeção. Cada story foi aberta nos esquemas claro e escuro, a 375 px e a 188 px
de largura (o equivalente a zoom 2 em 375). Nenhuma story rolou na horizontal.

Esta evidência não é de gate. O nome não segue `<gate>-<data>`.

| Story | Medida | Cor e semântica |
|---|---|---|
| Horizontal | 279,2 x 1 a 375 px e 92 x 1 a 188 px, preenche a largura | claro rgb(199, 199, 199), escuro rgb(111, 119, 130); aria-hidden=true |
| Vertical | 1 x 21,6 entre dois itens em flex em linha | mesmas cores; aria-hidden=true |

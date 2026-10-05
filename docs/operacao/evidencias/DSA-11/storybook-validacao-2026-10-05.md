```json
{
  "tarefa": "DSA-11",
  "gate": null,
  "data": "2026-10-05",
  "responsavel": "claude-codigo",
  "comando": "npx storybook dev -p 6022 --no-open; leitura por getBoundingClientRect e getComputedStyle no navegador integrado",
  "codigo_de_saida": null,
  "sha": null,
  "origem_externa": null
}
```

# DSA-11 — `nph-kbd` no Storybook

Prova das stories `Validação` abertas no navegador integrado (Chromium), na
branch `feat/lote-a-icon-spinner-separator-kbd`, antes do commit que vai para
inspeção. Cada story foi aberta nos esquemas claro e escuro, a 375 px e a 188 px
de largura (o equivalente a zoom 2 em 375). Nenhuma story rolou na horizontal.

Esta evidência não é de gate. O nome não segue `<gate>-<data>`.

| Story | Medida | Cor e semântica |
|---|---|---|
| Tecla | K 16,0 x 24; Esc 27,6 x 24; Shift 36,3 x 24; F2 22,0 x 24 | claro fundo rgb(227, 227, 227) e texto rgb(92, 92, 92); escuro fundo rgb(45, 51, 59) e texto rgb(183, 187, 193); sem role nem aria-hidden |
| Combinacao | Ctrl 30,1; Shift 36,3; P 15,7, todas com 24 de altura, lado a lado | mesmas cores |
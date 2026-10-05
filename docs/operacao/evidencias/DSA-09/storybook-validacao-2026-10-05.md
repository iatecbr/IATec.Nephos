```json
{
  "tarefa": "DSA-09",
  "gate": null,
  "data": "2026-10-05",
  "responsavel": "claude-codigo",
  "comando": "npx storybook dev -p 6022 --no-open; leitura por getBoundingClientRect e getComputedStyle no navegador integrado",
  "codigo_de_saida": null,
  "sha": null,
  "origem_externa": null
}
```

# DSA-09 — `nph-spinner` no Storybook

Prova das stories `Validação` abertas no navegador integrado (Chromium), na
branch `feat/lote-a-icon-spinner-separator-kbd`, antes do commit que vai para
inspeção. Cada story foi aberta nos esquemas claro e escuro, a 375 px e a 188 px
de largura (o equivalente a zoom 2 em 375). Nenhuma story rolou na horizontal.

Esta evidência não é de gate. O nome não segue `<gate>-<data>`.

| Story | Medida | Cor e semântica |
|---|---|---|
| Tamanhos | sm 16 x 16 e md 20 x 20, nos dois esquemas, a 375 e a 188 px | cor herdada: claro rgb(0, 0, 0), escuro rgb(227, 227, 227) |
| Acessibilidade | com texto ao lado: aria-hidden=true; sem texto: role=img, aria-label=Salvando | 16 x 16 |
| Entrada invalida | size=lg: 0 x 0, aria-hidden=true, sem role | nada desenhado |
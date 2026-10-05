```json
{
  "tarefa": "DSA-13",
  "gate": null,
  "data": "2026-10-05",
  "responsavel": "claude-codigo",
  "comando": "npx storybook dev -p 6023 --no-open; leitura por getComputedStyle e getBoundingClientRect no navegador integrado",
  "codigo_de_saida": null,
  "sha": null,
  "origem_externa": null
}
```

# DSA-13 — `nph-button` no Storybook

Prova das stories `Validação` e da pagina `Docs` abertas no navegador
integrado (Chromium), na branch `feat/lote-b-badge-button`. O esquema foi
trocado na raiz (`data-nph-color-scheme` no `html`), na marca padrao. O hover
e o foco foram lidos das variaveis internas resolvidas e conferidos pelos testes
com hover real e Tab.

Esta evidência não é de gate. O nome não segue `<gate>-<data>`.

| Story | Medida | Cor |
|---|---|---|
| Matriz | 36 de altura no `default` | repouso, hover, borda do `outline` e borda e halo do foco de cada par iguais ao Figma lido no mesmo dia, nos dois esquemas. Ex.: claro `primary` `solid` `#2f68c5`, hover `#234e94`, texto `#ffffff`, foco `#2f68c5` e `#b1cdfb`; escuro `info` `solid` `#359dd2`, hover `#67b5dd`, texto `#0f1114`, halo `#9acee9`; claro `secondary` `outline` `#e3e3e3`, borda e texto `#0f1114`, hover `#b7bbc1`, foco `#3b82f6` |
| Tamanhos | 28, 36 e 44 de altura; o só ícone é quadrado, com o ícone em `sm`, `md` e `lg` | — |
| Ícones, Desabilitado, Carregando | `disabled` em `state/disabled-opacity`; `loading` com o girador `sm` (e `md` no só ícone `default` e `large`) | — |
| Todas as de Validação | sem rolagem horizontal a 375 e a 188 px | — |
| Docs › Documentação | sem rolagem a 375 px; a 188 px rola (233 de largura), como a pagina Docs do `nph-icon` na base | — |

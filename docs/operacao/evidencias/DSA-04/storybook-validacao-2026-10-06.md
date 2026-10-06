```json
{
  "tarefa": "DSA-04",
  "gate": null,
  "data": "2026-10-06",
  "responsavel": "claude-codigo",
  "comando": "npx storybook dev -p 6013 --no-open; leitura por getComputedStyle e getBoundingClientRect no navegador integrado",
  "codigo_de_saida": null,
  "sha": "151b317",
  "origem_externa": null
}
```

# DSA-04 — `nph-label` no Storybook

Prova das stories `Validação` e da página `Docs` abertas no navegador
integrado (Chromium, `devicePixelRatio` 1,25), na branch
`feat/dsa04-nph-label-info`, na marca padrão. Os valores do Figma foram lidos
por `use_figma` no mesmo dia, no conjunto `374:6`, na linha "aberto" do quadro
`1194:1482` e nas variáveis, modos `claro` e `escuro` com o tema `Sistemas`.

Esta evidência não é de gate. O nome não segue `<gate>-<data>`.

| Story | O que foi medido | Storybook | Figma |
|---|---|---|---|
| Foco do gatilho, quadro claro (foco por Tab) | gatilho; raiz; texto até o gatilho; ícone | 24 × 24; 24; 4; 16, `#5c5c5c` | 24 × 24; 24; `space/inline-tight` 4; `icon/size-sm` 16, `color/muted-foreground` `#5c5c5c` |
| Foco do gatilho, quadro claro | borda e halo do foco | borda 26, `#3b82f6`, raio 7; halo 34, `#b1cdfb`, traço 4, raio 11 | borda 26 × 26, `focus/border` `#3b82f6`, raio 7; halo 34 × 34, `focus/halo` `#b1cdfb`, traço 4, raio 11 |
| Foco do gatilho, quadro escuro | ícone; borda; halo | `#b7bbc1`; `#89b4fa`, 26; `#b1cdfb`, 34 | `#b7bbc1`; `#89b4fa`; `#b1cdfb` |
| Aberto, esquema claro | balão aberto; distância; fundo e texto | `open`, `aria-expanded="true"`; x 0 e y 8 do rótulo; `#5c5c5c` e `#ffffff` | abaixo do rótulo, mesmo x, `space/inline` 8; `color/tooltip` `#5c5c5c` e `color/tooltip-foreground` `#ffffff` |
| Aberto, esquema escuro | fundo e texto | `#454545` e `#e3e3e3` | `#454545` e `#e3e3e3` |
| Docs › Documentação | seções em pt-BR, en e es | 1 a 10 do quadro e Referências, 13 rótulos e 4 gatilhos em cada idioma | seções 1 a 10 do quadro `1194:1482` |

A borda do foco é computada como `0.8px` com `devicePixelRatio` 1,25: o
navegador ajusta a borda de `border/width` (1 px) a um pixel do aparelho. A
caixa da borda continua com 26, como no Figma. Nos testes em Chromium, com
`devicePixelRatio` 1, a largura é 1 px.

Sem rolagem horizontal a 375 px nas stories e na Docs, conferido na inspeção
do código.

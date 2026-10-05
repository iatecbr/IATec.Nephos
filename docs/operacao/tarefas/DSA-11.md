```json
{
  "id": "DSA-11",
  "objetivo": "Implementar o nph-kbd, a tecla estatica de um atalho de teclado, com o contrato aceito no Figma.",
  "fase": "F4",
  "ordem_aprovada": 125,
  "responsavel": "claude-codigo",
  "estado": "pronta",
  "peca": "nph-kbd",
  "dependencias": [],
  "gates": [
    {
      "id": "documentacao-figma-aceita",
      "descricao": "A documentacao de nph-kbd no Figma foi aceita por Indiane e registrada como evidencia.",
      "comando": null,
      "evidencia": "docs/operacao/evidencias/DSA-11/documentacao-figma-aceita-2026-10-01.md",
      "resultado": "passou",
      "verificado_em": "2026-10-01",
      "verificado_por": "indiane"
    },
    {
      "id": "revisao-e-merge",
      "descricao": "Componente, CSS, testes, stories, ficha e decisao tecnica revisados por maurocsjr e mergeados na v/5.0.0.",
      "comando": null,
      "evidencia": null,
      "resultado": "pendente",
      "verificado_em": null,
      "verificado_por": null
    }
  ],
  "bloqueios": [],
  "decisoes_pendentes": [],
  "evidencias": [
    "docs/operacao/evidencias/DSA-11/documentacao-figma-aceita-2026-10-01.md",
    "docs/operacao/evidencias/DSA-11/storybook-validacao-2026-10-05.md"
  ],
  "referencias_de_decisao": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-02.md, combinacao e uma peca por tecla",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-05.md, recorte da primeira entrega (Lote A)"
  ],
  "origem_externa": {
    "classificacao": "interna-permitida",
    "url_ou_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1193-20",
    "data": "2026-10-01",
    "autoria": "indiane",
    "trecho": null,
    "decisao_convertida": "O frame nph-kbd (1193:20) foi aceito como especificacao de API e comportamento do nph-kbd. COMPONENT_SET: nenhum; COMPONENT unico 772:3, com a propriedade de texto tecla. Em 05-10-2026 Indiane aprovou o recorte da primeira entrega, com o Lote A num plano e num PR."
  },
  "revisao_git": { "branch": null, "commit": null, "pr": null },
  "contexto": null,
  "atualizado_em": "2026-10-05"
}
```

# DSA-11 — nph-kbd, a tecla

## Objetivo
Existe o `nph-kbd` em `src/components/nph-kbd/`, com ficha, testes e stories, no
contrato aceito no Figma: uma tecla estatica, escrita em texto, em `color/muted`
com borda `color/border`. A combinacao junta uma peca por tecla.

## Como se prova
**`documentacao-figma-aceita`** — o quadro `nph-kbd` (`1193:20`) do Figma
`DS-IA-NEPHOS 5.0` foi aceito por Indiane em 01-10-2026, com QA UX de Figma e
auditoria textual aprovados. A evidencia nomeia o frame e declara que nao ha
COMPONENT_SET: o componente e unico (`772:3`).

**`revisao-e-merge`** — componente, CSS, testes, stories, ficha e a decisao
tecnica passam pelos comandos de prova, sao revisados por `maurocsjr` e
mergeados na `v/5.0.0`.

## O que esta tarefa não faz
Nao cria interacao, foco, variante de estilo nem combinacao numa peca so.

## Fontes
- Figma `DS-IA-NEPHOS 5.0`, quadro `1193:20` e componente `772:3`
- `design.md` — `text/label-sm`, `color/muted`, `color/muted-foreground`,
  `color/border`, `border/width`, `radius/inner`, `space/inline-tight`
- `fichas/_modelo.md`

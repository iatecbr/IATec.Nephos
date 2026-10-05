```json
{
  "id": "DSA-09",
  "objetivo": "Implementar o nph-spinner, o girador de espera sem hora para acabar, com o contrato aceito no Figma.",
  "fase": "F4",
  "ordem_aprovada": 115,
  "responsavel": "claude-codigo",
  "estado": "pronta",
  "peca": "nph-spinner",
  "dependencias": ["DSA-03"],
  "gates": [
    {
      "id": "documentacao-figma-aceita",
      "descricao": "A documentacao de nph-spinner no Figma foi aceita por Indiane e registrada como evidencia.",
      "comando": null,
      "evidencia": "docs/operacao/evidencias/DSA-09/documentacao-figma-aceita-2026-10-01.md",
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
    "docs/operacao/evidencias/DSA-09/documentacao-figma-aceita-2026-10-01.md",
    "docs/operacao/evidencias/DSA-09/nph-icon-revalidado-2026-10-05.md",
    "docs/operacao/evidencias/DSA-09/storybook-validacao-2026-10-05.md"
  ],
  "referencias_de_decisao": [
    "docs/decisoes-tecnicas.md#p21",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-05.md, recorte da primeira entrega (Lote A)"
  ],
  "origem_externa": {
    "classificacao": "interna-permitida",
    "url_ou_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1195-22210",
    "data": "2026-10-01",
    "autoria": "indiane",
    "trecho": null,
    "decisao_convertida": "O frame nph-spinner (1195:22210) foi aceito como especificacao de API e comportamento do nph-spinner. COMPONENT_SET 281:11, variante size sm|md, padrao sm. Em 05-10-2026 Indiane aprovou o recorte da primeira entrega, com o Lote A (icon, spinner, separator, kbd) num plano e num PR."
  },
  "revisao_git": { "branch": null, "commit": null, "pr": null },
  "contexto": null,
  "atualizado_em": "2026-10-05"
}
```

# DSA-09 — nph-spinner, o girador

## Objetivo
Existe o `nph-spinner` em `src/components/nph-spinner/`, com ficha, testes e
stories, no contrato aceito no Figma: o `circle-notch` do `nph-icon` girando em
`motion/loop-*`, nos tamanhos `sm` e `md`, parado com movimento reduzido.

## Como se prova
**`documentacao-figma-aceita`** — o quadro `nph-spinner` (`1195:22210`) do Figma
`DS-IA-NEPHOS 5.0` foi aceito por Indiane em 01-10-2026, com QA UX de Figma e
auditoria textual aprovados. A evidencia nomeia o frame e o COMPONENT_SET
(`281:11`).

**`revisao-e-merge`** — componente, CSS, testes, stories, ficha e a decisao
tecnica passam pelos comandos de prova, sao revisados por `maurocsjr` e
mergeados na `v/5.0.0`.

A evidencia `nph-icon-revalidado-2026-10-05.md` registra que o `nph-icon`, que o
spinner consome, bate com o Figma aceito.

## O que esta tarefa não faz
Nao muda o `nph-icon`. Nao poe o girador dentro do `nph-button` (Lote B). Nao
cria tamanho `lg`, token novo nem indicador de progresso conhecido.

## Fontes
- Figma `DS-IA-NEPHOS 5.0`, quadro `1195:22210` e conjunto `281:11`
- `design.md` — `motion/loop-duration`, `motion/loop-easing`, `icon/size-*`
- `docs/decisoes-tecnicas.md` — P21
- `fichas/_modelo.md`, `fichas/nph-spinner.md`

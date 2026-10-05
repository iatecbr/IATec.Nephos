```json
{
  "id": "DSA-10",
  "objetivo": "Implementar o nph-separator, o divisor decorativo de uma linha, com o contrato aceito no Figma.",
  "fase": "F4",
  "ordem_aprovada": 120,
  "responsavel": "claude-codigo",
  "estado": "pronta",
  "peca": "nph-separator",
  "dependencias": [],
  "gates": [
    {
      "id": "documentacao-figma-aceita",
      "descricao": "A documentacao de nph-separator no Figma foi aceita por Indiane e registrada como evidencia.",
      "comando": null,
      "evidencia": "docs/operacao/evidencias/DSA-10/documentacao-figma-aceita-2026-10-01.md",
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
    "docs/operacao/evidencias/DSA-10/documentacao-figma-aceita-2026-10-01.md",
    "docs/operacao/evidencias/DSA-10/storybook-validacao-2026-10-05.md"
  ],
  "referencias_de_decisao": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-05.md, recorte da primeira entrega (Lote A)"
  ],
  "origem_externa": {
    "classificacao": "interna-permitida",
    "url_ou_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1196-674",
    "data": "2026-10-01",
    "autoria": "indiane",
    "trecho": null,
    "decisao_convertida": "O frame nph-separator (1196:674) foi aceito como especificacao de API e comportamento do nph-separator. COMPONENT_SET 762:6, variante orientacao horizontal|vertical, padrao horizontal. Em 05-10-2026 Indiane aprovou o recorte da primeira entrega, com o Lote A num plano e num PR."
  },
  "revisao_git": { "branch": null, "commit": null, "pr": null },
  "contexto": null,
  "atualizado_em": "2026-10-05"
}
```

# DSA-10 — nph-separator, o divisor

## Objetivo
Existe o `nph-separator` em `src/components/nph-separator/`, com ficha, testes e
stories, no contrato aceito no Figma: uma linha de `border/width` em
`color/border`, horizontal ou vertical, que preenche o conteiner e fica oculta do
leitor de tela.

## Como se prova
**`documentacao-figma-aceita`** — o quadro `nph-separator` (`1196:674`) do Figma
`DS-IA-NEPHOS 5.0` foi aceito por Indiane em 01-10-2026, com QA UX de Figma e
auditoria textual aprovados. A evidencia nomeia o frame e o COMPONENT_SET
(`762:6`).

**`revisao-e-merge`** — componente, CSS, testes, stories, ficha e a decisao
tecnica passam pelos comandos de prova, sao revisados por `maurocsjr` e
mergeados na `v/5.0.0`.

## O que esta tarefa não faz
Nao cria variante com texto, espessura ou cor nova. Nao serve de espacador nem de
borda de campo.

## Fontes
- Figma `DS-IA-NEPHOS 5.0`, quadro `1196:674` e conjunto `762:6`
- `design.md` — `border/width`, `color/border`, `layout/separator-*`
- `fichas/_modelo.md`

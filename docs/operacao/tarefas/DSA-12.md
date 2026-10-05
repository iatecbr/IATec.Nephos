```json
{
  "id": "DSA-12",
  "objetivo": "Implementar o nph-badge, o selo que rotula o estado ou a categoria de um item, com o contrato aceito no Figma.",
  "fase": "F4",
  "ordem_aprovada": 130,
  "responsavel": "claude-codigo",
  "estado": "em-revisao",
  "peca": "nph-badge",
  "dependencias": ["DSA-03"],
  "gates": [
    {
      "id": "documentacao-figma-aceita",
      "descricao": "A documentacao de nph-badge no Figma foi aceita por Indiane e registrada como evidencia.",
      "comando": null,
      "evidencia": "docs/operacao/evidencias/DSA-12/documentacao-figma-aceita-2026-10-02.md",
      "resultado": "passou",
      "verificado_em": "2026-10-02",
      "verificado_por": "indiane"
    },
    {
      "id": "revisao-e-merge",
      "descricao": "Componente, CSS, testes, stories, documentacao do Storybook, ficha e decisao tecnica revisados por maurocsjr e mergeados na v/5.0.0.",
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
    "docs/operacao/evidencias/DSA-12/documentacao-figma-aceita-2026-10-02.md",
    "docs/operacao/evidencias/DSA-12/storybook-validacao-2026-10-05.md"
  ],
  "referencias_de_decisao": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-05.md, recorte da primeira entrega (Lote B)",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-02.md, nph-badge sem hover"
  ],
  "origem_externa": {
    "classificacao": "interna-permitida",
    "url_ou_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1196-1100",
    "data": "2026-10-02",
    "autoria": "indiane",
    "trecho": null,
    "decisao_convertida": "O frame nph-badge (1196:1100) foi aceito como especificacao de API e comportamento do nph-badge. COMPONENT_SET 878:30, variantes tipo (primary, secondary, info, warn, help, danger, success) e enfase (solid, light), padrao primary e solid; texto e icone opcional. O aceite de 01-10-2026 foi completado em 02-10-2026 pela retirada do hover (o selo nao e clicavel)."
  },
  "revisao_git": { "branch": "feat/lote-b-badge-button", "commit": null, "pr": "56" },
  "contexto": null,
  "atualizado_em": "2026-10-05"
}
```

# DSA-12 — nph-badge, o selo

## Objetivo
Existe o `nph-badge` em `src/components/nph-badge/`, com ficha, testes, stories e
pagina de documentacao no Storybook, no contrato aceito no Figma: um selo de uma
ou duas palavras que rotula o estado ou a categoria de um item, com tipo, enfase
e icone opcional antes do texto. O selo nao recebe clique nem foco.

## Como se prova
**`documentacao-figma-aceita`** — o quadro `nph-badge` (`1196:1100`) do Figma
`DS-IA-NEPHOS 5.0` foi aceito por Indiane em 01-10-2026 e completado em
02-10-2026 pela retirada do hover, com QA UX de Figma e auditoria textual
aprovados em 02-10-2026. A evidencia nomeia o frame e o COMPONENT_SET
(`878:30`).

**`revisao-e-merge`** — componente, CSS, testes, stories, documentacao do
Storybook, ficha e decisao tecnica passam pelos comandos de prova, sao
revisados por `maurocsjr` e mergeados na `v/5.0.0`.

## O que esta tarefa não faz
Nao cria selo clicavel, com hover, com contagem ou so com icone.

## Fontes
- Figma `DS-IA-NEPHOS 5.0`, quadro `1196:1100` e conjunto `878:30`
- `design.md` — `text/label-sm`, `radius/full`, `space/control-padding`, `space/inline-tight`, `icon/size-sm` e as cores de `color/*` e `status/*`
- `fichas/_modelo.md`

```json
{
  "id": "DSA-08",
  "objetivo": "Implementar o nph-tooltip, o balao de ajuda aberto pelo gatilho info do nph-label, com o contrato aceito no Figma.",
  "fase": "F4",
  "ordem_aprovada": 105,
  "responsavel": "claude-codigo",
  "estado": "concluida",
  "peca": "nph-tooltip",
  "dependencias": [],
  "gates": [
    {
      "id": "documentacao-figma-aceita",
      "descricao": "A documentacao de nph-tooltip no Figma foi aceita por Indiane e registrada como evidencia.",
      "comando": null,
      "evidencia": "docs/operacao/evidencias/DSA-08/documentacao-figma-aceita-2026-10-01.md",
      "resultado": "passou",
      "verificado_em": "2026-10-01",
      "verificado_por": "indiane"
    },
    {
      "id": "revisao-e-merge",
      "descricao": "Componente, CSS, testes, stories, ficha, P65 e regras do design.md revisados por maurocsjr e mergeados na v/5.0.0.",
      "comando": "git merge-base --is-ancestor 06af12539de95416ee816ca65f63298063e1bf6b origin/v/5.0.0",
      "evidencia": "docs/operacao/evidencias/DSA-08/revisao-e-merge-2026-10-06.md",
      "resultado": "passou",
      "verificado_em": "2026-10-06",
      "verificado_por": "claude-codigo"
    }
  ],
  "bloqueios": [],
  "decisoes_pendentes": [],
  "evidencias": [
    "docs/operacao/evidencias/DSA-08/documentacao-figma-aceita-2026-10-01.md",
    "docs/operacao/evidencias/DSA-08/revisao-e-merge-2026-10-06.md"
  ],
  "referencias_de_decisao": [
    "WORK BRAIN — 02 PROJETOS/DS-Agentico/Registro de decisões — Nephos.md, L11.5 a L11.7",
    "WORK BRAIN — 02 PROJETOS/DS-Agentico/Mapa de decisão — Nephos.md, item 48"
  ],
  "origem_externa": {
    "classificacao": "interna-permitida",
    "url_ou_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1237-5",
    "data": "2026-10-01",
    "autoria": "indiane",
    "trecho": null,
    "decisao_convertida": "O frame nph-tooltip (1237:5) foi aceito como especificacao de API e comportamento do nph-tooltip. COMPONENT_SET: nenhum; COMPONENT unico 1237:3, sem variantes. Em 05-10-2026 Indiane decidiu que o nph-tooltip entra em codigo antes da entrega de codigo da DSA-04."
  },
  "revisao_git": { "branch": "feat/dsa08-nph-tooltip", "commit": "06af125", "pr": "51" },
  "contexto": null,
  "atualizado_em": "2026-10-06"
}
```

# DSA-08 — nph-tooltip, o balao de ajuda

## Objetivo
Existe o `nph-tooltip` em `src/components/nph-tooltip/`, com ficha, testes e
stories, no contrato aceito no Figma: so texto, ate duas linhas, aberto apenas
pela ativacao do gatilho `info` do `nph-label`.

## Como se prova
**`documentacao-figma-aceita`** — o quadro `nph-tooltip` (`1237:5`) do Figma
`DS-IA-NEPHOS 5.0` foi aceito por Indiane em 01-10-2026, com QA UX de Figma e
auditoria textual aprovados. A evidencia nomeia o frame e declara que nao ha
COMPONENT_SET: o componente e unico (`1237:3`).

**`revisao-e-merge`** — componente, CSS, testes, stories, ficha, a decisao
tecnica P65 e as regras do `design.md` que citam o tooltip passam pelos
comandos de prova, sao revisados por `maurocsjr` e mergeados na `v/5.0.0`. A
evidencia registra branch, commit, PR, comando e resultado.

## O que esta tarefa não faz
Nao muda o `nph-label`: o gatilho, o foco e a abertura do balao sao da DSA-04.
Nao cria outros usos do balao, nao abre no hover e nao corta texto com mais de
duas linhas. Nao altera o Figma.

## Fontes
- `design.md`
- `docs/decisoes-tecnicas.md`
- `fichas/_modelo.md`
- `src/tokens/generated/tokens.css`
- `docs/operacao/README.md`
- `GOVERNANCA.md`, `AGENTS.md`, `CLAUDE.md`
- Figma `DS-IA-NEPHOS 5.0`, quadro `1237:5` e componente `1237:3`
- WORK BRAIN — `02 PROJETOS/DS-Agentico/Registro de decisões — Nephos.md`, L11

## Por que está `concluida`
O PR #51 trouxe o componente, os testes, as stories, a ficha canônica
`fichas/nph-tooltip.md` com a Metadata, a decisão técnica P65 e as regras do
`design.md`. `maurocsjr` aprovou e fez o merge em 05-10-2026 (`d4ff326`). A
evidência do gate `revisao-e-merge` foi registrada em 06-10-2026.

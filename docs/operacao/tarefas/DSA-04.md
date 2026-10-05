```json
{
  "id": "DSA-04",
  "objetivo": "Acrescentar ao nph-label o gatilho de informacao (info e infoLabel), com foco visivel e abertura do nph-tooltip, no contrato aceito no Figma.",
  "fase": "F4",
  "ordem_aprovada": 110,
  "responsavel": "claude-codigo",
  "estado": "bloqueada",
  "peca": "nph-label",
  "dependencias": ["DSA-07", "DSA-08"],
  "gates": [
    {
      "id": "documentacao-figma-aceita",
      "descricao": "A documentacao de nph-label no Figma, com info, foco e a linha aberto, foi aceita por Indiane e registrada como evidencia.",
      "comando": null,
      "evidencia": "docs/operacao/evidencias/DSA-04/documentacao-figma-aceita-2026-10-01.md",
      "resultado": "passou",
      "verificado_em": "2026-10-01",
      "verificado_por": "indiane"
    },
    {
      "id": "tokens-conferidos-com-figma",
      "descricao": "Os tokens de theme e semantic do Figma, e os primitivos que os resolvem, estao no tokens.css gerado com o mesmo alias e valor.",
      "comando": "node docs/operacao/evidencias/DSA-04/conferir-tokens-figma.cjs",
      "evidencia": "docs/operacao/evidencias/DSA-04/tokens-conferidos-com-figma-2026-10-05.md",
      "resultado": "passou",
      "verificado_em": "2026-10-05",
      "verificado_por": "claude-codigo"
    },
    {
      "id": "revisao-e-merge",
      "descricao": "Componente, CSS, testes, stories, ficha, P62.6 e regras do design.md revisados por maurocsjr e mergeados na v/5.0.0.",
      "comando": null,
      "evidencia": null,
      "resultado": "pendente",
      "verificado_em": null,
      "verificado_por": null
    }
  ],
  "bloqueios": [
    {
      "id": "B1",
      "o_que_trava": "DSA-08 sem merge: o nph-tooltip ainda nao existe em codigo.",
      "dono": "maurocsjr",
      "o_que_resolve": "Revisao e merge do PR do nph-tooltip (DSA-08) na v/5.0.0.",
      "aberto_em": "2026-10-05"
    },
    {
      "id": "B2",
      "o_que_trava": "DSA-07 sem merge, PR #49: os arquivos do nph-label mudam de nome interno nesse PR.",
      "dono": "maurocsjr",
      "o_que_resolve": "Revisao e merge do PR #49 na v/5.0.0.",
      "aberto_em": "2026-10-05"
    }
  ],
  "decisoes_pendentes": [],
  "evidencias": [
    "docs/operacao/evidencias/DSA-04/documentacao-figma-aceita-2026-10-01.md",
    "docs/operacao/evidencias/DSA-04/tokens-conferidos-com-figma-2026-10-05.md"
  ],
  "referencias_de_decisao": [
    "docs/decisoes-tecnicas.md#p62",
    "WORK BRAIN — 02 PROJETOS/DS-Agentico/Registro de decisões — Nephos.md, L8 a L11"
  ],
  "origem_externa": {
    "classificacao": "interna-permitida",
    "url_ou_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1194-1482",
    "data": "2026-10-01",
    "autoria": "indiane",
    "trecho": null,
    "decisao_convertida": "O frame nph-label (1194:1482) e o COMPONENT_SET 374:6 foram aceitos com info, infoLabel, foco do gatilho e a linha aberto. infoLabel vazio omite o gatilho (decisao de 01-10-2026). Em 05-10-2026 Indiane decidiu que o nph-tooltip (DSA-08) entra em codigo antes desta entrega."
  },
  "revisao_git": { "branch": "feat/dsa04-nph-label-info", "commit": null, "pr": null },
  "contexto": null,
  "atualizado_em": "2026-10-05"
}
```

# DSA-04 — gatilho de informacao do nph-label

## Objetivo
O `nph-label` aceita `info` e `infoLabel` (`info-label`). Com os dois
preenchidos, mostra o gatilho de informacao, com foco visivel, que abre o
`nph-tooltip` com o texto de `info`. Sem `info`, o rotulo e o de hoje.

## Como se prova
**`documentacao-figma-aceita`** — o quadro `nph-label` (`1194:1482`) e o
COMPONENT_SET `374:6` foram aceitos por Indiane em 01-10-2026, com QA UX de
Figma e auditoria textual aprovados.

**`tokens-conferidos-com-figma`** — `node
docs/operacao/evidencias/DSA-04/conferir-tokens-figma.cjs` sai 0: os tokens
de foco, de tooltip e os demais que o Figma tinha e o codigo nao estao no
`tokens.css` gerado com o mesmo alias e valor.

**`revisao-e-merge`** — componente, CSS, testes, stories, ficha, a decisao
tecnica P62.6 e as regras do `design.md` passam pelos comandos de prova, sao
revisados por `maurocsjr` e mergeados na `v/5.0.0`.

## O que esta tarefa não faz
Nao implementa o `nph-tooltip` (DSA-08). Nao renomeia nem deprecia `focus/ring`
e `focus/ring-error`. Nao muda `nph-field` nem `nph-input`. Nao altera o Figma.

## Fontes
- `fichas/nph-label.md`
- `src/components/nph-label/`
- `design.md`
- `docs/decisoes-tecnicas.md`
- `docs/operacao/README.md`
- `GOVERNANCA.md`, `AGENTS.md`, `CLAUDE.md`
- Figma `DS-IA-NEPHOS 5.0`, quadro `1194:1482` e COMPONENT_SET `374:6`
- WORK BRAIN — `02 PROJETOS/DS-Agentico/Registro de decisões — Nephos.md`, L8 a L11

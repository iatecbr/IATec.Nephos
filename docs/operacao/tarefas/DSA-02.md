```json
{
  "id": "DSA-02",
  "objetivo": "Registrar no contrato tecnico os usos aprovados de status/error e space/inline-tight para campos de formulario.",
  "fase": "F1",
  "ordem_aprovada": 90,
  "responsavel": "claude-codigo",
  "estado": "concluida",
  "peca": null,
  "dependencias": [],
  "gates": [
    {
      "id": "revisao-e-merge",
      "descricao": "O PR #33 foi revisado por maurocsjr e mergeado na v/5.0.0; o commit 8903873 e ancestral do merge 8e11751.",
      "comando": "git merge-base --is-ancestor 89038735f968a1abbcc629cdde02097d3041454a origin/v/5.0.0",
      "evidencia": "docs/operacao/evidencias/DSA-02/revisao-e-merge-2026-09-14.md",
      "resultado": "passou",
      "verificado_em": "2026-09-14",
      "verificado_por": "copilot"
    }
  ],
  "bloqueios": [],
  "decisoes_pendentes": [],
  "evidencias": [
    "docs/operacao/evidencias/DSA-02/revisao-e-merge-2026-09-14.md"
  ],
  "referencias_de_decisao": [],
  "origem_externa": {
    "classificacao": "interna-permitida",
    "url_ou_id": "WORK BRAIN — 03 MEMÓRIA/decisoes/2026-09-03-tres-decisoes-visuais-do-nph-input.md; 03 MEMÓRIA/agentes/2026-09.md, registro de 2026-09-03 sobre space/inline",
    "data": "2026-09-03",
    "autoria": "indiane",
    "trecho": null,
    "decisao_convertida": "status/error cobre borda de campo invalido e space/inline-tight cobre o par icone e texto dentro de controle; em 09-09-2026 Indiane autorizou migrar DSA-02 para docs/operacao/tarefas/ como ciclo comparavel do M6."
  },
  "revisao_git": {
    "branch": "docs/dsa02-status-error-inline-tight",
    "commit": "89038735f968a1abbcc629cdde02097d3041454a",
    "pr": "33"
  },
  "contexto": null,
  "atualizado_em": "2026-09-14"
}
```

# DSA-02 — registrar usos de token em campo

## Objetivo
O contrato tecnico registra que `status/error` cobre a borda de campo invalido e
`space/inline-tight` cobre o par icone e texto dentro de um controle.

## Como se prova
**`revisao-e-merge`** — os usos aprovados sao registrados sem alterar valor, alias,
nome CSS ou `nao_use` dos tokens; a alteracao passa pelos testes aplicaveis, revisao
e merge na branch padrao. A evidencia deve registrar branch, commit, PR, comando
executado e resultado.

## O que esta tarefa não faz
Nao altera valores ou aliases, nao cria token e nao muda os escopos de Figma de
`status/error`. A ampliacao de `STROKE_COLOR` continua sendo uma alteracao separada
no Figma, ja autorizada pela Indiane.

## Fontes
- `design.md`
- `docs/tokens.md`
- `docs/operacao/README.md`
- `GOVERNANCA.md`, `AGENTS.md`, `CLAUDE.md`
- WORK BRAIN — `03 MEMÓRIA/decisoes/2026-09-03-tres-decisoes-visuais-do-nph-input.md`
- WORK BRAIN — `03 MEMÓRIA/agentes/2026-09.md`, registro de 2026-09-03 sobre `space/inline`

## Por que está `concluida`
O PR #33 foi revisado por Mauro (`maurocsjr`) e mergeado na `v/5.0.0` em
14-09-2026, no merge commit `8e11751`. O commit `8903873`, que registrou os
usos aprovados, é ancestral da branch padrão depois do merge. O único gate está
`passou`, com evidência local, data e responsável, e não há contexto ativo.

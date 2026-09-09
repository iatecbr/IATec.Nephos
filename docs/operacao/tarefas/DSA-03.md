```json
{
  "id": "DSA-03",
  "objetivo": "Alinhar a ficha e a arte versionada de nph-icon a decisao I7 sobre circle-info no estilo solid.",
  "fase": "F4",
  "ordem_aprovada": 80,
  "responsavel": "claude-codigo",
  "estado": "pronta",
  "peca": "nph-icon",
  "dependencias": [],
  "gates": [
    {
      "id": "revisao-e-merge",
      "descricao": "A ficha e a arte de circle-info solid estao revisadas e mergeadas na branch padrao.",
      "comando": null,
      "evidencia": null,
      "resultado": "pendente",
      "verificado_em": null,
      "verificado_por": null
    }
  ],
  "bloqueios": [],
  "decisoes_pendentes": [],
  "evidencias": [],
  "referencias_de_decisao": [],
  "origem_externa": {
    "classificacao": "interna-permitida",
    "url_ou_id": "WORK BRAIN — 02 PROJETOS/DS-Agentico/Registro de decisões — Nephos.md, I7",
    "data": "2026-09-08",
    "autoria": "indiane",
    "trecho": null,
    "decisao_convertida": "A decisao I7 permite circle-info no estilo solid; em 09-09-2026 Indiane autorizou migrar DSA-03 para docs/operacao/tarefas/ como ciclo comparavel do M6."
  },
  "revisao_git": {
    "branch": null,
    "commit": null,
    "pr": null
  },
  "contexto": null,
  "atualizado_em": "2026-09-09"
}
```

# DSA-03 — alinhar nph-icon a I7

## Objetivo
A ficha de `nph-icon` e a arte versionada de `circle-info` registram a decisao I7:
`regular` continua padrao, e `circle-info` pode usar `solid` pelo motivo aprovado.

## Como se prova
**`revisao-e-merge`** — a ficha e a arte de `circle-info` no estilo `solid` passam
pelos testes aplicaveis, sao revisadas e mergeadas na branch padrao. A evidencia deve
registrar branch, commit, PR, comando executado e resultado.

## O que esta tarefa não faz
Nao libera `solid` para outros nomes, nao altera a API de `nph-label` e nao inicia
`nph-field`. Qualquer novo nome ou estado exige motivo coerente e decisao registrada.

## Fontes
- `fichas/nph-icon.md`
- `src/components/nph-icon/`
- `docs/operacao/README.md`
- `GOVERNANCA.md`, `AGENTS.md`, `CLAUDE.md`
- WORK BRAIN — `02 PROJETOS/DS-Agentico/Registro de decisões — Nephos.md`, I7

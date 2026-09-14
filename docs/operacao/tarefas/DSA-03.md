```json
{
  "id": "DSA-03",
  "objetivo": "Alinhar os contratos e a arte de nph-icon a decisao I7 sobre circle-info no estilo solid.",
  "fase": "F4",
  "ordem_aprovada": 80,
  "responsavel": "claude-codigo",
  "estado": "pronta",
  "peca": "nph-icon",
  "dependencias": [],
  "gates": [
    {
      "id": "documentacao-figma-aceita",
      "descricao": "A documentacao de nph-icon no Figma foi aceita por Indiane e registrada como evidencia.",
      "comando": null,
      "evidencia": "docs/operacao/evidencias/DSA-03/documentacao-figma-aceita-2026-09-14.md",
      "resultado": "passou",
      "verificado_em": "2026-09-14",
      "verificado_por": "indiane"
    },
    {
      "id": "revisao-e-merge",
      "descricao": "Ficha, contratos, arte, testes e Storybook de circle-info solid estao revisados e mergeados na branch padrao.",
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
    "docs/operacao/evidencias/DSA-03/documentacao-figma-aceita-2026-09-14.md"
  ],
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
  "atualizado_em": "2026-09-14"
}
```

# DSA-03 — alinhar contratos de nph-icon a I7

## Objetivo
A ficha, os contratos tecnicos, a arte versionada, os testes e o Storybook de
`nph-icon` registram a decisao I7: `regular` continua padrao, e `circle-info`
pode usar `solid` pelo motivo aprovado.

## Como se prova
**`documentacao-figma-aceita`** — a documentacao de `nph-icon` no Figma
`DS-IA-NEPHOS 5.0` e aceita por Indiane, e a aceitacao entra em
`docs/operacao/evidencias/DSA-03/`, com a URL ou o ID do frame, a data, a autoria
e a decisao convertida, nomeando o frame e o COMPONENT_SET. Enquanto este gate
nao passar, a tarefa fica `bloqueada` e nenhum codigo de componente comeca.

**`revisao-e-merge`** — ficha, `design.md`, `docs/decisoes-tecnicas.md`, arte,
testes, Storybook e seus dicionarios passam pelos testes aplicaveis, sao revisados e
mergeados na branch padrao. A evidencia deve registrar branch, commit, PR, comando
executado e resultado.

## O que esta tarefa não faz
Nao libera `solid` para outros nomes, nao altera a API de `nph-label` e nao inicia
`nph-field`. A atualizacao da Fundacao de icones no WORK BRAIN fica para o Copilot
depois da entrega verificavel. Qualquer novo nome ou estado exige motivo coerente e
decisao registrada.

## Fontes
- `fichas/nph-icon.md`
- `src/components/nph-icon/`
- `.storybook/i18n/pt-BR.js`, `.storybook/i18n/en.js`, `.storybook/i18n/es.js`
- `design.md`
- `docs/decisoes-tecnicas.md`
- `docs/operacao/README.md`
- `GOVERNANCA.md`, `AGENTS.md`, `CLAUDE.md`
- WORK BRAIN — `02 PROJETOS/DS-Agentico/Registro de decisões — Nephos.md`, I7

## Por que está `pronta`
Indiane aceitou o frame `Documentacao — nph-icon` (`346:4`) em 14-09-2026. O
gate `documentacao-figma-aceita` passou, com evidencia local no formato da
§5b, e o bloqueio B1 saiu. O gate `revisao-e-merge` continua `pendente`: codigo
local pode comecar; a tarefa ainda nao foi entregue.

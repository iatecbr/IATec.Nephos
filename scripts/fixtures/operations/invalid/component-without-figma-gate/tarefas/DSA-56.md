```json
{
  "id": "DSA-56",
  "objetivo": "Exemplo de validacao do verificador operacional.",
  "fase": "F4",
  "ordem_aprovada": 10,
  "responsavel": "claude-codigo",
  "estado": "pronta",
  "peca": "nph-icon",
  "dependencias": [],
  "gates": [
    {
      "id": "arquivo-existe",
      "descricao": "O artefato previsto existe e esta versionado.",
      "comando": "npm run test:operacao",
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
  "origem_externa": null,
  "revisao_git": {
    "branch": null,
    "commit": null,
    "pr": null
  },
  "contexto": null,
  "atualizado_em": "2026-09-10"
}
```

# DSA-56 — componente elegivel sem documentacao Figma aceita

## Objetivo
Exemplo de validacao do verificador operacional.

## Como se prova
Rodando `node scripts/verificar-operacao.mjs --exemplos`, que valida esta arvore.
E tarefa de componente — responsavel `claude-codigo` com `peca` preenchida — e
esta em `pronta` sem declarar o gate `documentacao-figma-aceita`.

## O que esta tarefa nao faz
Nada alem de servir de entrada para o verificador.

## Fontes
- `docs/operacao/README.md`

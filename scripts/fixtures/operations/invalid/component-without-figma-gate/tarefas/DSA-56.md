```json
{
  "id": "DSA-56",
  "goal": "Exemplo de validacao do verificador operacional.",
  "phase": "F4",
  "approved_order": 10,
  "owner": "claude-code",
  "state": "ready",
  "piece": "nph-icon",
  "dependencies": [],
  "gates": [
    {
      "id": "file-exists",
      "description": "O artefato previsto existe e esta versionado.",
      "command": "npm run test:operacao",
      "evidence": null,
      "result": "pending",
      "verified_at": null,
      "verified_by": null
    }
  ],
  "blockers": [],
  "pending_decisions": [],
  "evidence": [],
  "decision_refs": [],
  "external_origin": null,
  "git_review": {
    "branch": null,
    "commit": null,
    "pr": null
  },
  "context": null,
  "updated_at": "2026-09-10"
}
```

# DSA-56 — componente elegivel sem documentacao Figma aceita

## Objetivo
Exemplo de validacao do verificador operacional.

## Como se prova
Rodando `node scripts/verificar-operacao.mjs --exemplos`, que valida esta arvore.
E tarefa de componente — responsavel `claude-code` com `piece` preenchida — e
esta em `ready` sem declarar o gate `figma-docs-accepted`.

## O que esta tarefa nao faz
Nada alem de servir de entrada para o verificador.

## Fontes
- `docs/operacao/README.md`

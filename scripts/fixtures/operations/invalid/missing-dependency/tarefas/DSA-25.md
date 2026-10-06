```json
{
  "id": "DSA-25",
  "goal": "Exemplo de validacao do verificador operacional.",
  "phase": "F4",
  "approved_order": 10,
  "owner": "claude-code",
  "state": "blocked",
  "piece": null,
  "dependencies": [
    "ZZ-99"
  ],
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
  "blockers": [
    {
      "id": "B1",
      "what_blocks": "Exemplo de bloqueio aberto, usado so como fixture.",
      "owner": "indiane",
      "what_resolves": "A decisao registrada que fecha o bloqueio.",
      "opened_at": "2026-09-02"
    }
  ],
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
  "updated_at": "2026-09-02"
}
```

# DSA-25 — dependencia inexistente

## Objetivo
Exemplo de validacao do verificador operacional.

## Como se prova
Rodando `node scripts/verificar-operacao.mjs --exemplos`, que valida esta arvore.

## O que esta tarefa nao faz
Nada alem de servir de entrada para o verificador.

## Fontes
- `docs/operacao/README.md`

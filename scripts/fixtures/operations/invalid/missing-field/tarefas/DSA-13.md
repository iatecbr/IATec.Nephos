```json
{
  "id": "DSA-13",
  "phase": "F4",
  "approved_order": 10,
  "owner": "claude-code",
  "state": "ready",
  "piece": null,
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
  "updated_at": "2026-09-02"
}
```

# DSA-13 — campo obrigatorio ausente

## Objetivo
Falta o campo objetivo no bloco de maquina, de proposito.

## Como se prova
O verificador reprova em V04.

## O que esta tarefa nao faz
Nada: e fixture invalida.

## Fontes
- `docs/operacao/README.md`

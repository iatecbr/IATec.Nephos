```json
{
  "id": "DSA-02",
  "goal": "Publicar o guia de desenvolvimento em docs/stories.md.",
  "phase": "F4",
  "approved_order": 40,
  "owner": "claude-code",
  "state": "ready",
  "piece": null,
  "dependencies": [],
  "gates": [
    {
      "id": "file-exists",
      "description": "docs/stories.md versionado no repositorio.",
      "command": "test -f docs/stories.md",
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

# DSA-02 — o minimo que passa

## Objetivo
Publicar o guia de desenvolvimento em docs/stories.md.

## Como se prova
Rodando `node scripts/verificar-operacao.mjs --exemplos`, que valida esta arvore.

## O que esta tarefa nao faz
Nao entrega o guia: e fixture do piso do schema, nao tarefa real.

## Fontes
- `docs/operacao/README.md`

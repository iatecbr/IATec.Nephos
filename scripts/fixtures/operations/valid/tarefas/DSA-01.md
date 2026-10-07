```json
{
  "id": "DSA-01",
  "goal": "Exercitar gate com evidencia e contexto curto ativo.",
  "phase": "F4",
  "approved_order": 20,
  "owner": "claude-code",
  "state": "in-progress",
  "piece": null,
  "dependencies": [],
  "gates": [
    {
      "id": "verifier",
      "description": "O verificador roda e sai com codigo 0.",
      "command": "npm run test:operacao",
      "evidence": "scripts/fixtures/operations/valid/evidencias/DSA-01/verificador-2026-09-02.md",
      "result": "passed",
      "verified_at": "2026-09-02",
      "verified_by": "claude-code"
    }
  ],
  "blockers": [],
  "pending_decisions": [],
  "evidence": [
    "scripts/fixtures/operations/valid/evidencias/DSA-01/verificador-2026-09-02.md"
  ],
  "decision_refs": [
    "docs/decisoes-tecnicas.md#p03"
  ],
  "external_origin": null,
  "git_review": {
    "branch": null,
    "commit": null,
    "pr": null
  },
  "context": "scripts/fixtures/operations/valid/contextos/DSA-01.md",
  "updated_at": "2026-09-02"
}
```

# DSA-01 — gate com evidencia e contexto ativo

## Objetivo
Exercitar gate com evidencia e contexto curto ativo.

## Como se prova
Rodando `node scripts/verificar-operacao.mjs --exemplos`, que valida esta arvore.

## O que esta tarefa nao faz
Nao entrega nada real: e fixture de gate provado e contexto curto.

## Fontes
- `docs/operacao/README.md`

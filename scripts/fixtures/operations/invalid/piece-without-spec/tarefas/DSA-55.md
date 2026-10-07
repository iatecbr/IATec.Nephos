```json
{
  "id": "DSA-55",
  "goal": "Exemplo de validacao do verificador operacional.",
  "phase": "F4",
  "approved_order": 10,
  "owner": "claude-code",
  "state": "in-review",
  "piece": "nph-inexistente",
  "dependencies": [],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "A documentacao do componente no Figma foi aceita por Indiane.",
      "command": null,
      "evidence": "scripts/fixtures/operations/invalid/piece-without-spec/evidencias/DSA-55/documentacao-figma-aceita-2026-09-10.md",
      "result": "passed",
      "verified_at": "2026-09-10",
      "verified_by": "indiane"
    }
  ],
  "blockers": [],
  "pending_decisions": [],
  "evidence": [
    "scripts/fixtures/operations/invalid/piece-without-spec/evidencias/DSA-55/documentacao-figma-aceita-2026-09-10.md"
  ],
  "decision_refs": [],
  "external_origin": null,
  "git_review": {
    "branch": "docs/exemplo-peca-sem-ficha",
    "commit": null,
    "pr": "999"
  },
  "context": null,
  "updated_at": "2026-09-10"
}
```

# DSA-55 — em revisao com peca e sem ficha

## Objetivo
Exemplo de validacao do verificador operacional.

## Como se prova
Rodando `node scripts/verificar-operacao.mjs --exemplos`, que valida esta arvore.
A documentacao Figma esta aceita e a tarefa entrou em revisao, entao a ficha
canonica passa a ser exigida — e `fichas/nph-inexistente.md` nao existe.

## O que esta tarefa nao faz
Nada alem de servir de entrada para o verificador.

## Fontes
- `docs/operacao/README.md`

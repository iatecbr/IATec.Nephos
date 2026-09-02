```json
{
  "id": "DSA-01",
  "objetivo": "Exercitar gate com evidencia e contexto curto ativo.",
  "fase": "F4",
  "ordem_aprovada": 20,
  "responsavel": "claude-codigo",
  "estado": "em-andamento",
  "peca": null,
  "dependencias": [],
  "gates": [
    {
      "id": "verificador",
      "descricao": "O verificador roda e sai com codigo 0.",
      "comando": "npm run test:operacao",
      "evidencia": "scripts/fixtures/operacao/validos/evidencias/DSA-01/verificador-2026-09-02.md",
      "resultado": "passou",
      "verificado_em": "2026-09-02",
      "verificado_por": "claude-codigo"
    }
  ],
  "bloqueios": [],
  "decisoes_pendentes": [],
  "evidencias": [
    "scripts/fixtures/operacao/validos/evidencias/DSA-01/verificador-2026-09-02.md"
  ],
  "referencias_de_decisao": [
    "docs/decisoes-tecnicas.md#p03"
  ],
  "origem_externa": null,
  "revisao_git": {
    "branch": null,
    "commit": null,
    "pr": null
  },
  "contexto": "scripts/fixtures/operacao/validos/contextos/DSA-01.md",
  "atualizado_em": "2026-09-02"
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

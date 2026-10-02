```json
{
  "id": "DSA-02",
  "objetivo": "Publicar o guia de desenvolvimento em docs/stories.md.",
  "fase": "F4",
  "ordem_aprovada": 40,
  "responsavel": "claude-codigo",
  "estado": "pronta",
  "peca": null,
  "dependencias": [],
  "gates": [
    {
      "id": "arquivo-existe",
      "descricao": "docs/stories.md versionado no repositorio.",
      "comando": "test -f docs/stories.md",
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
  "atualizado_em": "2026-09-02"
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

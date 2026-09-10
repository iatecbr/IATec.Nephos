```json
{
  "id": "DSA-04",
  "objetivo": "Exercitar componente com documentacao Figma aceita e ainda sem ficha canonica.",
  "fase": "F4",
  "ordem_aprovada": 60,
  "responsavel": "claude-codigo",
  "estado": "pronta",
  "peca": "nph-inexistente",
  "dependencias": [],
  "gates": [
    {
      "id": "documentacao-figma-aceita",
      "descricao": "A documentacao do componente no Figma foi aceita por Indiane.",
      "comando": null,
      "evidencia": "scripts/fixtures/operacao/validos/evidencias/DSA-04/documentacao-figma-aceita-2026-09-10.md",
      "resultado": "passou",
      "verificado_em": "2026-09-10",
      "verificado_por": "indiane"
    }
  ],
  "bloqueios": [],
  "decisoes_pendentes": [],
  "evidencias": [
    "scripts/fixtures/operacao/validos/evidencias/DSA-04/documentacao-figma-aceita-2026-09-10.md"
  ],
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

# DSA-04 — componente liberado para codigo, sem ficha ainda

## Objetivo
Exercitar a trava documental no caso que ela existe para permitir: a
documentacao Figma ja foi aceita, o codigo local pode comecar, e a ficha
canonica so sera cobrada em em-revisao.

## Como se prova
Rodando `node scripts/verificar-operacao.mjs --exemplos`, que valida esta arvore.
A V28 nao dispara porque o estado e pronta; a V30 nao dispara porque o gate
`documentacao-figma-aceita` passou; a V31 nao dispara porque a evidencia declara
a procedencia inteira.

## O que esta tarefa nao faz
Nao entrega nada real: e fixture da trava documental. A peca `nph-inexistente`
nao tem ficha de proposito.

## Fontes
- `docs/operacao/README.md`

---
peca: nph-exemplo
nivel: componente
status: vigente
criado: 2026-09-28
resolve: >-
  Primeira linha do bloco
  e a segunda linha.
api:
  texto:
    tipo: string
    obrigatoria: true
    padrao: "vazio"
    reflete: false
  cor: color/foreground
  slots: nenhum
variantes:
  variant:
    nao_combine_com: ["light, thin, sharp"]
relacoes:
  pai: [nph-button, "os controles que o contêm"]
  filho: []

tokens:
  cor: color/foreground
fontes:
  evidencia_de_uso: "branch v/3.0.0, PR #6, merge 437dd60"
  contagem: 17
  decisao: nulo
use_quando:
  - "Quando precisa: com dois-pontos."
  - texto sem aspas
---

# nph-exemplo

Fixture VALIDO da V32. Cobre os casos dificeis da gramatica: lista em linha
com virgula dentro de aspas, lista mista, `[]`, booleano, numero, data, `nulo`,
`#` dentro de aspas, `>-`, linha em branco entre chaves e a mesma chave em
mapas diferentes.

---

O `---` acima e do corpo e fica fora da leitura, assim como este `|` e este #.

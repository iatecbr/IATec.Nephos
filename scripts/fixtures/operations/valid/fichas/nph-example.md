---
piece: nph-example
level: component
status: active
created: 2026-09-28
solves: >-
  Primeira linha do bloco
  e a segunda linha.
api:
  text:
    type: string
    required: true
    default: "empty"
    reflects: false
  color: color/foreground
  slots: none
variants:
  variant:
    do_not_combine_with: ["light, thin, sharp"]
relations:
  parents: [nph-button, "os controles que o contêm"]
  children: []

tokens:
  color: color/foreground
sources:
  usage_evidence: "branch v/3.0.0, PR #6, merge 437dd60"
  contagem: 17
  decision: unset
use_when:
  - "Quando precisa: com dois-pontos."
  - texto sem aspas
---

# nph-example

Fixture VALIDO da V32. Cobre os casos dificeis da gramatica: lista em linha
com virgula dentro de aspas, lista mista, `[]`, booleano, numero, data, `unset`,
`#` dentro de aspas, `>-`, linha em branco entre chaves e a mesma chave em
mapas diferentes.

---

O `---` acima e do corpo e fica fora da leitura, assim como este `|` e este #.

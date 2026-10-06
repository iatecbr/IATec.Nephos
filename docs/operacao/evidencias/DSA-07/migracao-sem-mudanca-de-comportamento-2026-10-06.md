```json
{
  "tarefa": "DSA-07",
  "gate": "migracao-sem-mudanca-de-comportamento",
  "data": "2026-10-06",
  "responsavel": "claude-codigo",
  "comando": "npm run build:tokens && node scripts/verificar-operacao.mjs --gerar-metadata && git diff --quiet && node -e \"process.exit(require('child_process').execSync('git ls-files --others --exclude-standard').length?1:0)\" && npm run typecheck && npm test && npm run test:tokens && npm run test:i18n && npm run test:operacao && node scripts/verificar-operacao.mjs --exemplos && npm run build-storybook",
  "codigo_de_saida": 0,
  "sha": "183ff01522cd0fd8f0688242a8814763fda1a138",
  "origem_externa": null
}
```

# DSA-07 — `migracao-sem-mudanca-de-comportamento`

A migração da P64 entrou em dois PRs: o #42 (`scripts/`, merge `ea93ed3`) e o #49
(`src/`, `stories/` e `.storybook/`, merge `183ff01`). Para cada merge, os 11
passos do comando do gate rodaram no primeiro pai (antes) e no merge (depois),
numa cópia limpa da árvore, com a mesma `node_modules`. As saídas foram
comparadas depois de tirar tempo, caminho absoluto e cor.

| PR | Antes | Depois |
|---|---|---|
| #42 | `a30be89` | `ea93ed3` |
| #49 | `ffa91ce` | `183ff01` |

## Resultado

Nos quatro SHAs, os 11 passos saíram com código `0`. `git diff --quiet` saiu `0`
depois do `build:tokens` e do `--gerar-metadata`, e `git ls-files --others
--exclude-standard` saiu vazio: os artefatos gerados não mudaram e nenhum arquivo
novo apareceu.

| # | Passo | #42 | #49 |
|---|---|---|---|
| 1 | `npm run build:tokens` | igual | igual |
| 2 | `verificar-operacao.mjs --gerar-metadata` | contagem de tarefas (1) | igual |
| 3 | `git diff --quiet` | `0` / `0` | `0` / `0` |
| 4 | `git ls-files --others --exclude-standard` | vazio | vazio |
| 5 | `npm run typecheck` | igual | igual |
| 6 | `npm test` | 56 testes, antes e depois | 79 testes, antes e depois |
| 7 | `npm run test:tokens` | igual | renome (2) |
| 8 | `npm run test:i18n` | igual | igual |
| 9 | `npm run test:operacao` | contagem de tarefas (1) | igual |
| 10 | `verificar-operacao.mjs --exemplos` | igual | renome (2) |
| 11 | `npm run build-storybook` | igual | nome e tamanho do pacote (3) |

## Critério aplicado

"Sem mudança de comportamento" quer dizer, em cada passo: o mesmo código de
saída; o mesmo resultado de teste e de verificação (a contagem de testes e os
pares `esperado=… obtido=…`); e os mesmos artefatos versionados (`git diff
--quiet` em `0` e nenhum arquivo não rastreado). Diferença de texto que não muda
nenhum dos três é aceita e fica explicada abaixo: nome traduzido pela P64,
contagem de registro que o próprio PR acrescenta, e hash ou tamanho do pacote do
build.

## O que difere, e por quê

1. **#42, passos 2 e 9:** `7 tarefa(s) conferida(s)` passa a `8`. O #42 acrescenta
   `docs/operacao/tarefas/DSA-07.md` (`git diff --name-status a30be89 ea93ed3 --
   docs/operacao/`). A linha de resultado é a mesma.
2. **#49, passos 7 e 10:** só nomes de caso e de script traduzidos pela P64
   (`test-invariancia.mjs` → `test-invariance.mjs`, `a.mesmo-objeto` →
   `a.same-object`, `sombraA` → `shadowA`, `validos` → `valid`,
   `bloqueada-sem-bloqueio` → `blocked-without-blocker`, e os demais). Os pares
   `esperado=… obtido=…` são idênticos, e as linhas finais também:
   `RESULTADO: 1 arvore valida + 28 de 28 casos invalidos, cada um pelo codigo previsto.`
3. **#49, passo 11:** o build termina com `Storybook build completed successfully`
   nos dois. Mudam o hash do nome dos arquivos, o nome
   `em-construcao.stories` → `welcome.stories` e o tamanho em kB dos pacotes que
   tiveram identificadores renomeados (por exemplo, `iframe` 908,98 → 908,65 kB).

Nenhuma diferença muda comportamento: o código de saída, os resultados dos testes e
os artefatos versionados são os mesmos antes e depois de cada PR.

## Códigos de saída

| Passo | #42 antes | #42 depois | #49 antes | #49 depois |
|---|---|---|---|---|
| `1-build-tokens` | 0 | 0 | 0 | 0 |
| `2-gerar-metadata` | 0 | 0 | 0 | 0 |
| `3-git-diff` | 0 | 0 | 0 | 0 |
| `4-untracked` | 0 | 0 | 0 | 0 |
| `5-typecheck` | 0 | 0 | 0 | 0 |
| `6-test` | 0 | 0 | 0 | 0 |
| `7-test-tokens` | 0 | 0 | 0 | 0 |
| `8-test-i18n` | 0 | 0 | 0 | 0 |
| `9-test-operacao` | 0 | 0 | 0 | 0 |
| `10-exemplos` | 0 | 0 | 0 | 0 |
| `11-build-storybook` | 0 | 0 | 0 | 0 |

O passo 3 grava o código de `git diff --quiet`; o passo 4, a lista de
arquivos não rastreados (vazia nos quatro).

## Diferenças, saída normalizada

Normalização: sem cor ANSI, caminho do worktree trocado por `<worktree>`, tempo
por `<t>`, hora por `<hora>`, hash do nome de arquivo do build por `<hash>`, e
sem as linhas `Duration`, `Start at` e `Port … is in use`. Passo sem diferença
não aparece.

### PR #42, `2-gerar-metadata`

```diff
--- 42-antes/2-gerar-metadata
+++ 42-depois/2-gerar-metadata
@@ -4 +4 @@
-7 tarefa(s) conferida(s).
+8 tarefa(s) conferida(s).
```

### PR #42, `9-test-operacao`

```diff
--- 42-antes/9-test-operacao
+++ 42-depois/9-test-operacao
@@ -5 +5 @@
-7 tarefa(s) conferida(s).
+8 tarefa(s) conferida(s).
```

### PR #49, `7-test-tokens`

```diff
--- 49-antes/7-test-tokens
+++ 49-depois/7-test-tokens
@@ -3 +3 @@
-> node scripts/test-invariancia.mjs
+> node scripts/test-invariance.mjs
@@ -6,12 +6,12 @@
-PASSOU a.mesmo-objeto                       esperado=invariante obtido=invariante
-PASSOU a.valores-diferentes                 esperado=variante obtido=variante
-PASSOU a.objetos-distintos-ordem-trocada    esperado=invariante obtido=invariante
-PASSOU a.dimension-objetos-distintos        esperado=invariante obtido=invariante
-PASSOU a.alias-igual                        esperado=invariante obtido=invariante
-PASSOU a.alias-diferente                    esperado=variante obtido=variante
-PASSOU a.alias-de-marca                     esperado=invariante obtido=invariante
-PASSOU a.sem-modes                          esperado=invariante obtido=invariante
-PASSOU a.bezier-arrays-distintos            esperado=invariante obtido=invariante
-PASSOU a.bezier-diferente                   esperado=variante obtido=variante
-PASSOU a.shadow-ordem-trocada               esperado=invariante obtido=invariante
-PASSOU a.shadow-diferente                   esperado=variante obtido=variante
+PASSOU a.same-object                        esperado=invariante obtido=invariante
+PASSOU a.different-values                   esperado=variante obtido=variante
+PASSOU a.distinct-objects-swapped-order     esperado=invariante obtido=invariante
+PASSOU a.dimension-distinct-objects         esperado=invariante obtido=invariante
+PASSOU a.same-alias                         esperado=invariante obtido=invariante
+PASSOU a.different-alias                    esperado=variante obtido=variante
+PASSOU a.brand-alias                        esperado=invariante obtido=invariante
+PASSOU a.no-modes                           esperado=invariante obtido=invariante
+PASSOU a.bezier-distinct-arrays             esperado=invariante obtido=invariante
+PASSOU a.different-bezier                   esperado=variante obtido=variante
+PASSOU a.shadow-swapped-order               esperado=invariante obtido=invariante
+PASSOU a.different-shadow                   esperado=variante obtido=variante
@@ -25,3 +25,3 @@
-PASSOU sombraA !== sombraB (objetos realmente distintos)
-PASSOU canon(sombraA) === canon(sombraB) (ordem de chave nao importa, em qualquer profundidade)
-PASSOU canon(sombraA) !== canon(sombraC) (geometria diferente)
+PASSOU shadowA !== shadowB (objetos realmente distintos)
+PASSOU canon(shadowA) === canon(shadowB) (ordem de chave nao importa, em qualquer profundidade)
+PASSOU canon(shadowA) !== canon(shadowC) (geometria diferente)
```

### PR #49, `10-exemplos`

```diff
--- 49-antes/10-exemplos
+++ 49-depois/10-exemplos
@@ -2 +2 @@
-PASSOU  validos                        3 tarefa(s), nenhum erro
+PASSOU  valid                          3 tarefa(s), nenhum erro
@@ -6,28 +6,28 @@
-PASSOU  aguardando-sem-pergunta        esperado=V08 obtido=V08
-PASSOU  bloqueada-sem-bloqueio         esperado=V07 obtido=V07
-PASSOU  campo-faltando                 esperado=V04 obtido=V04
-PASSOU  chave-desconhecida             esperado=V03 obtido=V03
-PASSOU  componente-sem-gate-figma      esperado=V30 obtido=V30
-PASSOU  concluida-sem-evidencia        esperado=V06 obtido=V06
-PASSOU  contexto-muda-estado           esperado=V23 obtido=V23
-PASSOU  dependencia-ciclica            esperado=V12 obtido=V12
-PASSOU  dependencia-inexistente        esperado=V11 obtido=V11
-PASSOU  estado-invalido                esperado=V05 obtido=V05
-PASSOU  evidencia-figma-fora-do-diretorio esperado=V31 obtido=V31
-PASSOU  evidencia-figma-sem-procedencia esperado=V31 obtido=V31
-PASSOU  evidencia-inexistente          esperado=V16 obtido=V16
-PASSOU  ficha-aspa-no-meio             esperado=V32 obtido=V32
-PASSOU  ficha-bloco-recuo-irregular    esperado=V32 obtido=V32
-PASSOU  ficha-chave-ambigua            esperado=V32 obtido=V32
-PASSOU  ficha-escalar-ambiguo          esperado=V32 obtido=V32
-PASSOU  ficha-fora-do-subconjunto      esperado=V32 obtido=V32
-PASSOU  ficha-mapa-em-linha            esperado=V32 obtido=V32
-PASSOU  ficha-mapa-em-lista            esperado=V32 obtido=V32
-PASSOU  id-fora-do-padrao              esperado=V02 obtido=V02
-PASSOU  id-nao-bate                    esperado=V01 obtido=V01
-PASSOU  metadata-desatualizada         esperado=V32 obtido=V32
-PASSOU  metadata-sem-ficha             esperado=V32 obtido=V32
-PASSOU  ordem-duplicada                esperado=V29 obtido=V29
-PASSOU  peca-sem-ficha                 esperado=V28 obtido=V28
-PASSOU  pronta-com-dependencia-aberta  esperado=V09 obtido=V09
-PASSOU  restrita-com-trecho            esperado=V19 obtido=V19
+PASSOU  awaiting-without-question      esperado=V08 obtido=V08
+PASSOU  blocked-without-blocker        esperado=V07 obtido=V07
+PASSOU  missing-field                  esperado=V04 obtido=V04
+PASSOU  unknown-key                    esperado=V03 obtido=V03
+PASSOU  component-without-figma-gate   esperado=V30 obtido=V30
+PASSOU  done-without-evidence          esperado=V06 obtido=V06
+PASSOU  context-changes-state          esperado=V23 obtido=V23
+PASSOU  cyclic-dependency              esperado=V12 obtido=V12
+PASSOU  missing-dependency             esperado=V11 obtido=V11
+PASSOU  invalid-state                  esperado=V05 obtido=V05
+PASSOU  figma-evidence-outside-directory esperado=V31 obtido=V31
+PASSOU  figma-evidence-without-provenance esperado=V31 obtido=V31
+PASSOU  missing-evidence               esperado=V16 obtido=V16
+PASSOU  spec-quote-in-middle           esperado=V32 obtido=V32
+PASSOU  spec-block-irregular-indent    esperado=V32 obtido=V32
+PASSOU  spec-ambiguous-key             esperado=V32 obtido=V32
+PASSOU  spec-ambiguous-scalar          esperado=V32 obtido=V32
+PASSOU  spec-outside-subset            esperado=V32 obtido=V32
+PASSOU  spec-inline-map                esperado=V32 obtido=V32
+PASSOU  spec-map-in-list               esperado=V32 obtido=V32
+PASSOU  id-off-pattern                 esperado=V02 obtido=V02
+PASSOU  id-mismatch                    esperado=V01 obtido=V01
+PASSOU  stale-metadata                 esperado=V32 obtido=V32
+PASSOU  metadata-without-spec          esperado=V32 obtido=V32
+PASSOU  duplicate-order                esperado=V29 obtido=V29
+PASSOU  piece-without-spec             esperado=V28 obtido=V28
+PASSOU  ready-with-open-dependency     esperado=V09 obtido=V09
+PASSOU  restricted-with-excerpt        esperado=V19 obtido=V19
```

### PR #49, `11-build-storybook`

```diff
--- 49-antes/11-build-storybook
+++ 49-depois/11-build-storybook
@@ -39 +39 @@
-│  19.22 kB │ gzip:   5.30 kB
+│  19.22 kB │ gzip:   5.31 kB
@@ -41 +41 @@
-│  0.45 kB │ gzip:   0.20 kB
+│  0.45 kB │ gzip:   0.19 kB
@@ -51,3 +51,3 @@
-│  4.12 kB │ gzip:   1.16 kB
-│  storybook-static/assets/em-construcao.stories-<hash>.js
-│  4.96 kB │ gzip:   1.22 kB
+│  4.15 kB │ gzip:   1.17 kB
+│  storybook-static/assets/welcome.stories-<hash>.js
+│  4.97 kB │ gzip:   1.23 kB
@@ -57 +57 @@
-│  10.97 kB │ gzip:   1.95 kB
+│  10.89 kB │ gzip:   1.95 kB
@@ -59 +59 @@
-│  20.65 kB │ gzip:   5.09 kB
+│  20.37 kB │ gzip:   5.07 kB
@@ -63 +63 @@
-│  147.08 kB │ gzip:  34.30 kB
+│  147.06 kB │ gzip:  34.29 kB
@@ -65 +65 @@
-│  908.98 kB │ gzip: 256.94 kB
+│  908.65 kB │ gzip: 256.92 kB
```

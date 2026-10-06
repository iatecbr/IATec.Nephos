```json
{
  "task": "DSA-07",
  "gate": "migration-without-behavior-change",
  "date": "2026-10-06",
  "owner": "claude-code",
  "command": "npm run build:tokens && node scripts/verificar-operacao.mjs --gerar-metadata && git diff --quiet && node -e \"process.exit(require('child_process').execSync('git ls-files --others --exclude-standard').length?1:0)\" && npm run typecheck && npm test && npm run test:tokens && npm run test:i18n && npm run test:operacao && node scripts/verificar-operacao.mjs --exemplos && npm run build-storybook",
  "exit_code": 0,
  "sha": "183ff01522cd0fd8f0688242a8814763fda1a138",
  "external_origin": null
}
```

# DSA-07 — `migration-without-behavior-change`

The P64 migration came in two PRs: #42 (`scripts/`, merge `ea93ed3`) and #49
(`src/`, `stories/` and `.storybook/`, merge `183ff01`). For each merge, the 11
steps of the gate command ran on the first parent (before) and on the merge (after),
in a clean copy of the tree, with the same `node_modules`. The outputs were
compared after removing time, absolute path and color.

| PR | Before | After |
|---|---|---|
| #42 | `a30be89` | `ea93ed3` |
| #49 | `ffa91ce` | `183ff01` |

## Result

On the four SHAs, the 11 steps exited with code `0`. `git diff --quiet` exited `0`
after `build:tokens` and `--gerar-metadata`, and `git ls-files --others
--exclude-standard` came out empty: the generated artifacts did not change and no new
file appeared.

| # | Step | #42 | #49 |
|---|---|---|---|
| 1 | `npm run build:tokens` | same | same |
| 2 | `verificar-operacao.mjs --gerar-metadata` | task count (1) | same |
| 3 | `git diff --quiet` | `0` / `0` | `0` / `0` |
| 4 | `git ls-files --others --exclude-standard` | empty | empty |
| 5 | `npm run typecheck` | same | same |
| 6 | `npm test` | 56 tests, before and after | 79 tests, before and after |
| 7 | `npm run test:tokens` | same | rename (2) |
| 8 | `npm run test:i18n` | same | same |
| 9 | `npm run test:operacao` | task count (1) | same |
| 10 | `verificar-operacao.mjs --exemplos` | same | rename (2) |
| 11 | `npm run build-storybook` | same | bundle name and size (3) |

## Criterion applied

"No behavior change" means, in each step: the same exit code; the same test and
verification result (the test count and the `esperado=… obtido=…` (expected=… got=…)
pairs); and the same versioned artifacts (`git diff
--quiet` at `0` and no untracked file). A text difference that changes none of
the three is accepted and explained below: a name translated by P64, a
registry count that the PR itself adds, and the hash or size of the build
bundle.

## What differs, and why

1. **#42, steps 2 and 9:** `7 tarefa(s) conferida(s)` (task count) becomes `8`. #42 adds
   `docs/operacao/tarefas/DSA-07.md` (`git diff --name-status a30be89 ea93ed3 --
   docs/operacao/`). The result line is the same.
2. **#49, steps 7 and 10:** only case and script names translated by P64
   (`test-invariancia.mjs` → `test-invariance.mjs`, `a.mesmo-objeto` →
   `a.same-object`, `sombraA` → `shadowA`, `validos` → `valid`,
   `bloqueada-sem-bloqueio` → `blocked-without-blocker`, and the others). The
   `esperado=… obtido=…` pairs are identical, and so are the final lines:
   `RESULTADO: 1 arvore valida + 28 de 28 casos invalidos, cada um pelo codigo previsto.`
3. **#49, step 11:** the build ends with `Storybook build completed successfully`
   in both. The file name hash changes, the name
   `em-construcao.stories` → `welcome.stories` changes, and so does the size in kB of the bundles that
   had identifiers renamed (for example, `iframe` 908.98 → 908.65 kB).

No difference changes behavior: the exit code, the test results and
the versioned artifacts are the same before and after each PR.

## Exit codes

| Step | #42 before | #42 after | #49 before | #49 after |
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

Step 3 records the exit code of `git diff --quiet`; step 4, the list of
untracked files (empty in all four).

## Differences, normalized output

Normalization: no ANSI color, worktree path replaced by `<worktree>`, time
by `<t>`, hour by `<hora>`, build file name hash by `<hash>`, and
without the `Duration`, `Start at` and `Port … is in use` lines. A step with no difference
does not appear.

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

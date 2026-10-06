```json
{
  "id": "DSA-15",
  "goal": "Move the Portuguese contract keys (task, context and evidence JSON, spec YAML, Metadata and token JSON) to English, last in the language migration, without breaking anyone who reads them.",
  "phase": "F0",
  "approved_order": 150,
  "owner": "claude-code",
  "state": "ready",
  "piece": null,
  "dependencies": ["DSA-14"],
  "gates": [
    {
      "id": "keys-in-english",
      "description": "Every contract key covered by the decision is in English in the schema, in the files that use it and in the scripts that read it, and the verifier, the token build and the tests pass.",
      "command": "node scripts/verificar-operacao.mjs",
      "evidence": null,
      "result": "pending",
      "verified_at": null,
      "verified_by": null
    },
    {
      "id": "review-and-merge",
      "description": "Schema, scripts, specs, tokens and documentation that change are reviewed by maurocsjr and merged into v/5.0.0.",
      "command": null,
      "evidence": null,
      "result": "pending",
      "verified_at": null,
      "verified_by": null
    }
  ],
  "blockers": [],
  "pending_decisions": [],
  "evidence": [],
  "decision_refs": [
    "docs/decisoes-tecnicas.md#p64",
    "docs/decisoes-tecnicas.md#p63",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-06.md, contract keys migrate last, in a separate task",
    "Decision of 06-10-2026, by Indiane's delegation: the name map recorded in this task"
  ],
  "external_origin": null,
  "git_review": { "branch": null, "commit": null, "pr": null },
  "context": null,
  "updated_at": "2026-10-06"
}
```

# DSA-15 — Contract keys in English

## Goal
The contract keys that are still in Portuguese move to English: the keys of the
task, context and evidence JSON in `docs/operacao/`, the keys of the spec YAML in
`fichas/` (and so of the Metadata in `src/shared/metadata/`), and the keys and
modes of the token JSON. Whoever reads a contract finds a single language.

## Decision (06-10-2026, by Indiane's delegation)
The language decision of 06/10/2026 left the contract keys for last, in a task of
their own, because renaming a key breaks every reader of that contract at once.
The name map and the scope below were decided on 06-10-2026 under Indiane's
delegation, from the study of the contracts and of the scripts that read them.
Order 150 only puts the task in the queue and does not set priority.

**Scope.** All the contract keys of the task, context and evidence JSON, of the
spec YAML (and so of the Metadata) and of the token JSON extension, plus the
single-word enum values listed below. Text values (with a space) are not touched:
they are already English. Everything moves in one change, so that no reader sees
a mixed contract.

**What stays.** `id`, `gates`, `sha`, `gate` (the key), `worktree` and
`git_review.branch`, `commit` and `pr`; the phases `F0` to `F7`; the owner names
`indiane`, `claude-figma`, `copilot` and `elvys`; the keys of `design.md`, a
separate contract; the brand names of the tokens (`sistemas`, `gerencial`,
`educacao`, `comercial`, `financeiro`, `igrejas`, `rh`), which are public values
(P20); CLI flags and npm script names; the contract directories (`fichas/`,
`docs/operacao/tarefas/`, `evidencias/`, `contextos/`); and the evidence file
names, which keep the gate id of their time (P64).

**The map.**

**Operation (task, context and evidence JSON).**

- **Task keys:** `objetivo` → `goal`, `fase` → `phase`, `ordem_aprovada` → `approved_order`, `responsavel` → `owner`, `estado` → `state`, `peca` → `piece`, `dependencias` → `dependencies`, `bloqueios` → `blockers`, `decisoes_pendentes` → `pending_decisions`, `evidencias` → `evidence`, `referencias_de_decisao` → `decision_refs`, `origem_externa` → `external_origin`, `revisao_git` → `git_review`, `contexto` → `context`, `atualizado_em` → `updated_at`.
- **Gate keys:** `descricao` → `description`, `comando` → `command`, `evidencia` → `evidence`, `resultado` → `result`, `verificado_em` → `verified_at`, `verificado_por` → `verified_by`.
- **Blocker keys:** `o_que_trava` → `what_blocks`, `dono` → `owner`, `o_que_resolve` → `what_resolves`, `aberto_em` → `opened_at`.
- **Pending decision keys:** `pergunta` → `question`, `quem_decide` → `decider`.
- **External origin keys:** `classificacao` → `classification`, `url_ou_id` → `url_or_id`, `data` → `date`, `autoria` → `author`, `trecho` → `excerpt`, `decisao_convertida` → `converted_decision`.
- **Evidence keys:** `tarefa` → `task`, `data` → `date`, `responsavel` → `owner`, `comando` → `command`, `codigo_de_saida` → `exit_code`, `origem_externa` → `external_origin`.
- **Context keys:** `tarefa` → `task`, `sha_inicial` → `start_sha`, `sha_final` → `end_sha`.
- **Keys forbidden in the context:** `estado` → `state`, `fase` → `phase`, `ordem_aprovada` → `approved_order`, `prioridade` → `priority`, `escopo` → `scope`, `decisao` → `decision`.
- **States:** `pronta` → `ready`, `em-andamento` → `in-progress`, `aguardando-decisao` → `awaiting-decision`, `bloqueada` → `blocked`, `em-revisao` → `in-review`, `concluida` → `done`.
- **Queue label:** `aguarda-decisao` → `awaiting-decision`.
- **Gate results:** `pendente` → `pending`, `passou` → `passed`, `falhou` → `failed`.
- **Classifications:** `publica` → `public`, `interna-permitida` → `internal-allowed`, `interna-restrita` → `internal-restricted`, `desconhecida` → `unknown`.
- **Owner:** `claude-codigo` → `claude-code`.
- **Gate ids:** `documentacao-figma-aceita` → `figma-docs-accepted`, `revisao-e-merge` → `review-and-merge`, `tokens-conferidos-com-figma` → `tokens-checked-against-figma`, `convencao-registrada` → `convention-recorded`, `convencao-no-repositorio` → `convention-in-repository`, `metadata-em-ingles` → `metadata-in-english`, `chaves-em-ingles` → `keys-in-english`, `guia-publicado` → `guide-published`, `fichas-na-branch-padrao` → `specs-on-default-branch`, `blocos-e-ligacoes` → `blocks-and-links`, `migracao-sem-mudanca-de-comportamento` → `migration-without-behavior-change`, `revisao-registrada` → `review-recorded`, `pr-aberto` → `pr-opened`, `storybook-validacao` → `storybook-validation`.

**Spec YAML (and so the Metadata).**

- **Top keys:** `peca` → `piece`, `nivel` → `level`, `resolve` → `solves`, `use_quando` → `use_when`, `nao_use_quando` → `do_not_use_when`, `variantes` → `variants`, `estados` → `states`, `regras_de_negocio` → `business_rules`, `erros_de_dominio` → `domain_errors`, `dicas_para_ia` → `ai_hints`, `acessibilidade` → `accessibility`, `combinacoes_invalidas` → `invalid_combinations`, `relacoes` → `relations`, `anti_padroes` → `anti_patterns`, `fontes` → `sources`.
- **API keys:** `tipo` → `type`, `valores` → `values`, `obrigatoria` → `required`, `padrao` → `default`, `reflete` → `reflects`, `restricao` → `constraint`, `eventos` → `events`, `cor` → `color`.
- **Variant keys:** `eixo` → `axis`, `escolha_quando` → `choose_when`, `nao_combine_com` → `do_not_combine_with`.
- **State keys:** `muda_para_a_pessoa` → `changes_for_user`.
- **Accessibility keys:** `semantica` → `semantics`, `nome_acessivel` → `accessible_name`, `teclado` → `keyboard`, `foco` → `focus`, `contraste` → `contrast`, `alternativa_a_cor` → `color_alternative`.
- **Relation keys:** `combina_com` → `combines_with`, `pai` → `parents`, `filho` → `children`, `complementa_bloco` → `complements_block`, `aparece_em` → `appears_in`, `exige` → `requires`, `variacoes_aceitaveis` → `acceptable_variations`, `contexto_de_layout` → `layout_context`.
- **Source keys:** `decisao` → `decision`, `testes` → `tests`, `evidencia_de_uso` → `usage_evidence`.
- **Legacy keys:** `titulo` → `title`, `tipo` → `type`, `criado` → `created`, `atualizado` → `updated`, `leitura_obrigatoria` → `required_reading`, `precedencia` → `precedence`, `aplica_se_a` → `applies_to`.
- **Single-word values:** `componente` → `component`, `fundacao` → `foundation`, `bloco` → `block`, `rascunho` → `draft`, `vigente` → `active`, `descontinuado` → `deprecated`, `aparencia` → `appearance`, `tamanho` → `size`, `densidade` → `density`, `nao_se_aplica` → `not_applicable`, `pendente` → `pending`, `vazio` → `empty`, `nenhum` → `none`, `nulo` → `unset`.
- **State names:** `padrao` → `default`, `aberto` → `open`, `fechado` → `closed`, `girando` → `spinning`, `movimento-reduzido` → `reduced-motion`.
- **Token roles:** `conteiner` → `container`, `texto` → `text`, `icone` → `icon`, `altura` → `height`, `espaco_interno` → `padding`, `espaco_icone_texto` → `icon_text_gap`, `raio` → `radius`, `desabilitado` → `disabled`, `foco` → `focus`, `tamanho` → `size`, `cor` → `color`, `fundo` → `background`, `borda` → `border`, `espessura` → `thickness`, `duracao` → `duration`, `curva` → `easing`, `cor_solto` → `standalone_color`, `elevacao` → `elevation`, `largura_maxima` → `max_width`, `altura_maxima` → `max_height`, `cor_do_texto` → `text_color`, `cor_do_asterisco` → `asterisk_color`, `espaco_antes_do_asterisco` → `asterisk_gap`, `espaco_ate_o_gatilho` → `trigger_gap`, `gatilho` → `trigger`, `foco_do_gatilho` → `trigger_focus`, `espaco_ate_o_balao` → `tooltip_gap`, `solido_` → `solid_`, `leve_` → `light_`.

**Token JSON (`$extensions["com.iatec.nephos"]`).**

- **Keys:** `camada` → `layer`, `contagemEsperada` → `expectedCount`, `origem` → `origin`, `nota` → `note`, `nome` → `name`, `modos` → `modes`, `padrao` → `default`, `seletor` → `selector`, `valorPublico` → `publicValue`.
- **Placeholder:** `{modo}` → `{mode}`.
- **Modes:** `claro` → `light`, `escuro` → `dark`.

## How it is proved
**`keys-in-english`** — `node scripts/verificar-operacao.mjs` exits 0, with the
renamed keys in the schema and in every file that uses them; `npm run
build:tokens`, `npm run test:tokens`, `npm test` and `npm run test:naming` pass.

**`review-and-merge`** — what changes passes the proof commands, is reviewed by
`maurocsjr` and is merged into `v/5.0.0`.

## What this task does not do
It changes only key names and, as the amendment of 06/10/2026 to P64 says, the
enum values of the task, context and evidence JSON (such as `awaiting-decision`)
and the single-word values of the specs listed in the map; it changes no rule or
behaviour. It does not translate text, which the language migration already
covers. It does not change public names (`nph-*` tags, properties, custom
properties, `data-nph-*` attributes and brand names).

## Sources
- `docs/decisoes-tecnicas.md` — P63 and P64
- `docs/operacao/README.md`
- `scripts/verificar-operacao.mjs`, `scripts/spec-lib.mjs` and `scripts/build-tokens.mjs`
- `docs/operacao/tarefas/DSA-14.md`

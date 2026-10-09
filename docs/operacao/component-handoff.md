# Component handoff — from Figma to code

This note tells whoever writes component code what to do when Indiane sends a
component to be coded. It is internal instruction, in English only, like the
rest of `docs/operacao/` (see [`../i18n.md`](../i18n.md)). Where it and
`AGENTS.md` diverge on **who** does a step, this note wins; on **how** the
step is done, `AGENTS.md` and [`../stories.md`](../stories.md) win.

## Who does what

| Who | Does | Does not |
|---|---|---|
| Indiane | Decides the visual of components, blocks and templates; accepts each step in Figma; sends the component to code | — |
| Claude | Builds the component and its documentation in the Figma `DS-IA-NEPHOS 5.0`; after the end-to-end approval, takes **only the component's tokens** to `v/5.0.0`; when Indiane sends the component, opens its task and writes the Figma documentation as text in the evidence | Component code, story, test or sheet |
| Elvys (and his agent) | Component code, CSS, stories, test and Storybook dictionary; the sheet `fichas/<piece>.md`; reviews and merges his own pull requests | New tokens or token values |
| Mauro and Elvys | Review and merge the pull requests Claude opens | Mauro does not review Elvys's pull requests |

## What "sent to code" guarantees

A component reaches code only after this order is complete, all in Figma:

**visual acceptance → Figma QA approved → Figma documentation approved →
textual audit approved → tokens on `v/5.0.0`.**

So, when Indiane sends a component, there is nothing left to wait for: the
documentation is final and every token the component needs is already in
`src/tokens/source/*.tokens.json`.

## Where the status is

Each component sent to code has a task in `docs/operacao/tarefas/<ID>.md`, with
`owner: "elvys"`, the `piece` and its `state`. That is the status map of the
components. To see what is ready and in which order:

```bash
node scripts/verificar-operacao.mjs --proxima
```

The agent does not read Figma. The contract of the piece is in the evidence of the
task's `figma-docs-accepted` gate: the Figma documentation converted to text —
purpose, anatomy, properties, variants and states, accessibility, relations,
when to use, required examples, do and do not, with the tokens of each part.

## What to do when a component arrives

1. **Preflight.** Follow the mandatory preflight in `AGENTS.md`.
2. **Read the source.** Open the task and the evidence of its
   `figma-docs-accepted` gate. That evidence is the contract; Figma is not
   needed. Figma property names stay in Portuguese in the evidence; what goes
   into the repository is in English.
3. **Move the state.** When the work starts, the task goes to `in-progress`,
   with `docs/operacao/contextos/<ID>.md`; when the PR opens, to `in-review`,
   with `git_review`; after the merge, to `done`, with the `review-and-merge`
   gate passed. Run `node scripts/verificar-operacao.mjs` at each change.
4. **Tokens: only the existing ones.** Consume only semantic tokens already on
   `v/5.0.0`. If a token is missing or its value differs from Figma, **stop**
   and tell Indiane. Do not create or change a token: tokens come from Figma,
   through Claude.
5. **Code.** `src/components/nph-<name>/` — component, CSS, stories and test
   (P01, P02, P03).
6. **Storybook.** Follow the rules below.
7. **Sheet.** `fichas/nph-<name>.md`, from `fichas/_modelo.md`, filled in from
   the Figma documentation. The sheet may come before the code: the Figma
   documentation is already accepted. Living text carries no person name, no
   date and no count of icons, variants or tokens.
8. **Proof.** `npm run build:tokens`, `npm run test:tokens`, `npm test`,
   `npm run typecheck`, `npm run test:i18n`, `npm run test:naming`,
   `npm run test:operacao`, `npm run build-storybook` and `git diff --check`
   exit 0.
9. **Pull request** from a short branch off `origin/v/5.0.0` to `v/5.0.0`,
   title and description in Portuguese. Elvys reviews and merges it.

If the Figma documentation and the tokens disagree, or something the code needs
is not in Figma, stop and ask Indiane. Do not fill the gap.

## Storybook rules

The full rules, with source and limit, are in [`../stories.md`](../stories.md),
§4 and §6. In short:

1. **Two roles.** `Components/<piece>/Validation` proves the contract with the
   real component and is mandatory. `Components/<piece>/Docs` is the reading
   page and is not; it enters when there is something to offer.
2. **The `Docs` page copies the `nph-badge` page.** It is assembled from the
   blocks of `src/shared/docs/page.ts` and follows the order and the sections of
   the Figma documentation frame: `header`, labelled `matrix`, origin `note`,
   `index`, then When to use (one `useDontUse`), API, the component's own
   sections (Variants, Sizes, States, others), Anatomy, Accessibility, Examples
   and References. Each block closes with its `source`, except References.
3. **Coverage, not quantity.** Each variant and each state appears in some
   verifiable story; one story may cover more than one combination.
4. **Light and dark in the same story.** The scheme switches by
   `data-nph-color-scheme`; a story is never duplicated per mode.
5. **No hand-written visible text.** Every visible text — explanation,
   caption, section title and example content — is born in
   `.storybook/i18n/en.json` and is translated in `pt-BR.json` and `es.json`;
   the story reads it with `t(context)`. A story is never duplicated per
   language.
6. **Identifiers in English.** Title, story name, export and anchor are in
   English; the sidebar label comes from the `sidebar` key of the dictionary,
   in the three languages.
7. **Each file and each story say what they prove.** The file opens with the
   block that names what it proves and which decision it verifies; each story
   has one line saying what it proves.
8. **The frame is not a precedent.** The scenery around the demonstration does
   not hold for component CSS; a shared frame lives in a file that does not end
   in `.stories.ts`.
9. **Only `--nph-*` on the page.** No literal value, no process text — review
   state, approvers and pending items stay in the operational record.
10. **Nothing is decided in Storybook.** Every rule shown points to where it
    came from: the Figma frame and the sheet.

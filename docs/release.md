# Release of `@iatec/nephos` (release candidates)

This note has no translations: it is an internal instruction for those who
maintain the repository, not usage documentation. See [`i18n.md`](i18n.md).

It describes how a release candidate such as `5.0.0-rc.1` reaches the Azure
Artifacts feed. The pipeline definition is
[`../azure-pipelines.yml`](../azure-pipelines.yml).

## What the pipeline does

The structure follows the reference pipeline of `IATec.Nephos.Blocks.Angular`
(`projects/iatec/nephos-layout/azure-pipelines.yml`), without its code review
and SonarQube stages. It runs on the self-hosted pool `IATec-Builds-Agents-Linux`.

1. **Build**: installs dependencies, checks the generated tokens are committed,
   runs `build:lib`, `test:package` and `pack:check`, then `build-storybook`,
   and publishes `storybook-static/` as the pipeline artifact `storybook` (see
   [The Storybook artifact](#the-storybook-artifact)). On a tag build it
   asserts that the tag is `v<package.json version>`. It ends with `npm pack`
   and publishes the tarball as the pipeline artifact `npm-package`.
2. **Test** (in parallel with Build): typecheck, `test:naming`,
   `test:operacao`, `test:i18n` and the browser tests (Playwright Chromium).
3. **Publish** (tag builds, or a manual run with `publish: true`; never on a
   pull request): a plain job, with no Azure DevOps environment and no
   approval step, so pushing a `v5.*` tag is the release decision. Its
   credentials come from the variable group `nuget-credentials`, like the other
   stages. It publishes the **tarball validated in Build** with
   `npm publish --ignore-scripts` (Build already ran `test:package` and
   `pack:check`, and the Publish job has no `dist/` for the `prepublishOnly`
   hook). The dist-tag comes from the version: `-rc.N`
   goes to `rc`, a stable version goes to `latest`, any other prerelease is
   refused. It fails before publishing if that version already exists in the
   feed.

Pull requests to `v/5.0.0` run Build and Test only. A manual run publishes only
from a `v5.*` tag or from `v/5.0.0`.

Publish depends on Build succeeding, and Build runs the Storybook build before
`npm pack`. A broken Storybook therefore fails Build, and no version reaches the
feed from that run.

## The Storybook artifact

Every run of Build (a `v5.*` tag, a pull request to `v/5.0.0` or a manual run)
builds the static Storybook with `npm run build-storybook` and publishes the
folder `storybook-static/` as the pipeline artifact **`storybook`**. A run that
publishes a version therefore always carries the Storybook of the same commit.
This is the private CI artifact that P19 foresees; the pipeline does not host
it anywhere.

To get it:

- In Azure DevOps, open the run, then **Summary**, then the published
  artifacts, and download `storybook`; or
- with the Azure CLI: `az pipelines runs artifact download --run-id <id>
  --artifact-name storybook --path <folder>`.

The folder is a static site: serve it with any static file server (opening
`index.html` from disk does not load the stories). To get one without a new
tag, use **Run pipeline** on `v/5.0.0` and leave `publish` false.

Keep it internal. Public publishing stays out of scope (P19), and the static
build carries Font Awesome Pro artwork (the icon gallery of `nph-icon`), so
hosting it where people outside IATec can reach it is a license decision for
Indiane (`PO-001`), not a hosting choice.

The pipeline depends on the package configuration from PR #89
(`feat/npm-package-rc1`): `name`, `version`, `build:lib`, `test:package`,
`pack:check`, `prepublishOnly` and `publishConfig`.

## The `.npmrc` handling

`.npmrc` stays forbidden in the repository (`AGENTS.md`, `.gitignore`). The
file `.npmrc.pipeline` at the root is **not** a credential file: it is a
template with placeholders only, in the form `#{NAME}#`, and no real value may
ever be written to it. On the agent, each job copies it to `.npmrc`, the
`replacetokens` task fills the placeholders from pipeline variables, and the
last step of the job deletes `.npmrc`. This is the same mechanism as the
reference pipeline.

| Placeholder | Source |
|---|---|
| `NPM_IATEC_HOST_COMMUNITY`, `NPM_Username`, `Base64_Password`, `NPM_email` | Variable group `nuget-credentials` (the same variables the reference pipeline uses) |
| `FONTAWESOME_NPM_AUTH_TOKEN` | Secret variable in the variable group `nuget-credentials` (a secret variable on the pipeline also works) |

`NPM_IATEC_HOST_COMMUNITY` is the feed host and path without scheme, for
example `sda-iatec.pkgs.visualstudio.com/_packaging/IATec.Community`, so that
`https://<value>/npm/registry/` is the registry URL that `publishConfig` in
`package.json` also names.

## Prerequisites owned by people (Azure DevOps and GitHub)

These are set once, outside the repository. Nothing here can be done by the
pipeline file.

1. **Create the pipeline** in the Azure DevOps organization `sda-iatec`:
   Pipelines, New pipeline, GitHub, repository `iatecbr/IATec.Nephos`, existing
   YAML file `/azure-pipelines.yml`. This needs a GitHub service connection
   (Azure Pipelines GitHub app) with access to the repository. On the pipeline,
   keep "Make secrets available to builds of forks" disabled, because pull
   requests run Build and Test.
2. **Pool.** The pipeline must be authorized to use the agent pool
   `IATec-Builds-Agents-Linux`. The agents need outbound access to
   `npm.fontawesome.com` and to the feed. Test runs
   `npx playwright install chromium`, which downloads only the browser, without
   `--with-deps`: the agents have no passwordless sudo. The system libraries
   Chromium needs must already be installed on the agent (once, as root:
   `npx playwright install-deps chromium`).
3. **Extension** "Replace Tokens" (task `replacetokens@6`) installed in the
   organization, as in the reference pipeline.
4. **Variable group** `nuget-credentials` (Pipelines, Library) available to
   the pipeline and holding `NPM_IATEC_HOST_COMMUNITY`, `NPM_Username`,
   `Base64_Password` and `NPM_email`.
5. **Secret variable** `FONTAWESOME_NPM_AUTH_TOKEN` in the same variable group,
   marked secret (a secret variable on the pipeline, Pipeline, Edit,
   Variables, also works). The value is the Font Awesome Pro npm token
   (P19, item 6). It never enters the repository. Without it `npm ci` fails
   with 401 in every stage.
6. **Feed permission.** On the org-scoped feed `IATec.Community`, give
   `Project Collection Build Service (sda-iatec)` (and the project build
   service of the project that owns the pipeline) the role **Contributor**,
   which includes Feed Publisher. Without it `npm publish` fails with 403.

## Releasing a new rc

Azure Artifacts versions are **immutable**: a published version can never be
replaced, so every attempt needs a new `rc.N`.

1. Open a PR to `v/5.0.0` that bumps `version` in `package.json` to
   `5.0.0-rc.N`. Copilot reviews it and Elvys merges it.
2. After the merge, tag the **merge commit** and push the tag:

   ```bash
   git fetch origin
   git tag v5.0.0-rc.N <merge-commit-sha>
   git push origin v5.0.0-rc.N
   ```

3. The pipeline starts on the tag. Build and Test run, and Publish follows
   without an approval step when both pass.
4. Check the version in the feed (`npm view @iatec/nephos@5.0.0-rc.N --registry
   <feed>`, with a feed token) and install it in a scratch project.

If Build fails on the version guard, the tag does not match
`package.json`: fix the version through a PR and tag again with the right name.
If Publish says the version already exists, bump to the next `rc.N`.

To rerun without a new tag, use **Run pipeline** on the tag (or on `v/5.0.0`)
and set `publish` to true. A rerun of an already published version fails on
purpose.

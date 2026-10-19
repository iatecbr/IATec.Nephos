# Release of `@iatec/nephos` (release candidates)

This note has no translations: it is an internal instruction for those who
maintain the repository, not usage documentation. See [`i18n.md`](i18n.md).

It describes how a release candidate such as `5.0.0-rc.1` reaches the Azure
Artifacts feed. The pipeline definition is
[`../azure-pipelines.yml`](../azure-pipelines.yml).

## What the pipeline does

1. **Validate** (every run): installs dependencies, checks the generated tokens
   are committed, runs typecheck, `test:naming`, `test:operacao`, `test:i18n`
   and the browser tests, then `build:lib`, `test:package` and `pack:check`.
   On a tag build it asserts that the tag is `v<package.json version>`. It ends
   with `npm pack` and publishes the tarball as the pipeline artifact
   `npm-package`.
2. **Publish** (tag builds, or a manual run with `publish: true`): a deployment
   job on the environment `npm-iatec-community`, so the approval configured
   there gates it. It publishes the **tarball validated in stage 1** with
   `npm publish`. The dist-tag comes from the version: `-rc.N` goes to `rc`, a
   stable version goes to `latest`, any other prerelease is refused. It fails
   before publishing if that version already exists in the feed.

Pull requests never run the pipeline (`pr: none`). A manual run publishes only
from a `v5.*` tag or from `v/5.0.0`.

The pipeline depends on the package configuration from PR `feat/npm-package-rc1`
(`name`, `version`, `build:lib`, `test:package`, `pack:check`, `publishConfig`).

## Prerequisites owned by people (Azure DevOps and GitHub)

These are set once, outside the repository. Nothing here can be done by the
pipeline file.

1. **Create the pipeline** in the Azure DevOps organization `sda-iatec`:
   Pipelines, New pipeline, GitHub, repository `iatecbr/IATec.Nephos`, existing
   YAML file `/azure-pipelines.yml`. This needs a GitHub service connection
   (Azure Pipelines GitHub app) with access to the repository.
2. **Feed permission.** On the org-scoped feed `IATec.Community`, give
   `Project Collection Build Service (sda-iatec)` (and the project build
   service of the project that owns the pipeline) the role **Contributor**,
   which includes Feed Publisher. Without it `npm publish` fails with 403.
3. **Secret variable** `FONTAWESOME_NPM_AUTH_TOKEN` on the pipeline, marked
   secret (Pipeline, Edit, Variables). The value is the Font Awesome Pro npm
   token (P19, item 6). It never enters the repository.
4. **Environment** `npm-iatec-community` (Pipelines, Environments), with an
   **Approvals** check naming the people who may release.

## Releasing a new rc

Azure Artifacts versions are **immutable**: a published version can never be
replaced, so every attempt needs a new `rc.N`.

1. Open a PR to `v/5.0.0` that bumps `version` in `package.json` to
   `5.0.0-rc.N`. Mauro and Elvys review it.
2. After the merge, tag the **merge commit** and push the tag:

   ```bash
   git fetch origin
   git tag v5.0.0-rc.N <merge-commit-sha>
   git push origin v5.0.0-rc.N
   ```

3. The pipeline starts on the tag. Wait for Validate to pass.
4. Approve the Publish stage on the environment `npm-iatec-community`.
5. Check the version in the feed (`npm view @iatec/nephos@5.0.0-rc.N --registry
   <feed>`, with a feed token) and install it in a scratch project.

If Validate fails on the version guard, the tag does not match
`package.json`: fix the version through a PR and tag again with the right name.
If Publish says the version already exists, bump to the next `rc.N`.

To rerun without a new tag, use **Run pipeline** on the tag (or on `v/5.0.0`)
and set `publish` to true. A rerun of an already published version fails on
purpose.

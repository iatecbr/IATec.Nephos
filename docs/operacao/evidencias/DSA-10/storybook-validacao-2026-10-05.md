```json
{
  "task": "DSA-10",
  "gate": null,
  "date": "2026-10-05",
  "owner": "claude-code",
  "command": "npx storybook dev -p 6022 --no-open; reading through getBoundingClientRect and getComputedStyle in the integrated browser",
  "exit_code": null,
  "sha": null,
  "external_origin": null
}
```

# DSA-10 — `nph-separator` in Storybook

Proof of the `Validação` stories opened in the integrated browser (Chromium), on the
branch `feat/lote-a-icon-spinner-separator-kbd`, before the commit that goes to
inspection. Each story was opened in the light and dark schemes, at 375 px and at 188 px
wide (the equivalent of zoom 2 at 375). No story scrolled horizontally.

This evidence is not a gate evidence. Its name does not follow `<gate>-<date>`.

| Story | Measurement | Color and semantics |
|---|---|---|
| `Horizontal` | 279.2 x 1 at 375 px and 92 x 1 at 188 px, fills the width | light rgb(199, 199, 199), dark rgb(111, 119, 130); aria-hidden=true |
| `Vertical` | 1 x 21.6 between two items in a row flex | same colors; aria-hidden=true |

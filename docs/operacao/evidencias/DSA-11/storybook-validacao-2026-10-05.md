```json
{
  "task": "DSA-11",
  "gate": null,
  "date": "2026-10-05",
  "owner": "claude-code",
  "command": "npx storybook dev -p 6022 --no-open; reading through getBoundingClientRect and getComputedStyle in the integrated browser",
  "exit_code": null,
  "sha": null,
  "external_origin": null
}
```

# DSA-11 — `nph-kbd` in Storybook

Proof of the `Validação` stories opened in the integrated browser (Chromium), on the
branch `feat/lote-a-icon-spinner-separator-kbd`, before the commit that goes to
inspection. Each story was opened in the light and dark schemes, at 375 px and at 188 px
wide (the equivalent of zoom 2 at 375). No story scrolled horizontally.

This evidence is not a gate evidence. Its name does not follow `<gate>-<date>`.

| Story | Measurement | Color and semantics |
|---|---|---|
| `Tecla` | K 16.0 x 24; Esc 27.6 x 24; Shift 36.3 x 24; F2 22.0 x 24 | light background rgb(227, 227, 227) and text rgb(92, 92, 92); dark background rgb(45, 51, 59) and text rgb(183, 187, 193); no role nor aria-hidden |
| `Combinacao` | Ctrl 30.1; Shift 36.3; P 15.7, all 24 high, side by side | same colors |

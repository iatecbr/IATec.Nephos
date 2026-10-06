```json
{
  "task": "DSA-13",
  "gate": null,
  "date": "2026-10-05",
  "owner": "claude-code",
  "command": "npx storybook dev -p 6023 --no-open; read through getComputedStyle and getBoundingClientRect in the integrated browser",
  "exit_code": null,
  "sha": null,
  "external_origin": null
}
```

# DSA-13 — `nph-button` in Storybook

Proof of the `Validação` stories and of the `Docs` page opened in the integrated
browser (Chromium), on the `feat/lote-b-badge-button` branch. The scheme was
switched at the root (`data-nph-color-scheme` on `html`), in the default brand. Hover
and focus were read from the resolved internal variables and checked by the tests
with real hover and Tab.

This evidence is not a gate evidence. The name does not follow `<gate>-<data>`.

| Story | Measurement | Color |
|---|---|---|
| `Matriz` | 36 high in `default` | rest, hover, `outline` border and focus border and halo of each pair equal to the Figma read on the same day, in both schemes. E.g.: light `primary` `solid` `#2f68c5`, hover `#234e94`, text `#ffffff`, focus `#2f68c5` and `#b1cdfb`; dark `info` `solid` `#359dd2`, hover `#67b5dd`, text `#0f1114`, halo `#9acee9`; light `secondary` `outline` `#e3e3e3`, border and text `#0f1114`, hover `#b7bbc1`, focus `#3b82f6` |
| `Tamanhos` | 28, 36 and 44 high; the icon-only one is square, with the icon in `sm`, `md` and `lg` | — |
| `Ícones`, `Desabilitado`, `Carregando` | `disabled` in `state/disabled-opacity`; `loading` with the `sm` spinner (and `md` in the icon-only `default` and `large`) | — |
| All of `Validação` | no horizontal scrolling at 375 and at 188 px | — |
| `Docs › Documentação` | no scrolling at 375 px; at 188 px it scrolls (233 wide), like the `Docs` page of `nph-icon` on the base | — |

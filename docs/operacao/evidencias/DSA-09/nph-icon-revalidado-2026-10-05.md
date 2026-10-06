```json
{
  "tarefa": "DSA-09",
  "gate": null,
  "data": "2026-10-05",
  "responsavel": "claude-codigo",
  "comando": "node docs/operacao/evidencias/DSA-09/conferir-nph-icon-figma.cjs",
  "codigo_de_saida": 0,
  "sha": "7670786",
  "origem_externa": {
    "classificacao": "interna-permitida",
    "url_ou_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1130-956",
    "data": "2026-10-05",
    "autoria": "claude-codigo",
    "trecho": null,
    "decisao_convertida": "Set nph-icon (248:143) of the accepted frame 1130:956: property `nome` with 93 options and `estilo` regular|solid, checked against the code map."
  }
}
```

# DSA-09 — `nph-icon` revalidated against the accepted Figma

Support for DSA-09: `nph-spinner` draws `circle-notch` through `nph-icon`. This
evidence is not a gate evidence, so its name does not follow `<gate>-<date>`.

`nph-icon` entered the technical plan of Batch A to revalidate the code and the
spec sheet that predate the restart. The result is **no divergence**: nothing changes in the code.

## What was checked

| Point | Accepted Figma (`248:143`, board `1130:956`) | Code (`v/5.0.0`, `7670786`) | Result |
|---|---|---|---|
| Inventory | property `nome`, 93 options | 93 `glyph(...)` entries in `nph-icon.icons.ts` | equal, in both directions |
| Style | `estilo`: `regular`, `solid`; default `regular` | `variant`: `regular`, `solid`; absent means `regular` | equal |
| Size | not a variant; only `icon/size-sm`, `icon/size-md`, `icon/size-lg` | `size` `sm`, `md`, `lg`, each one in `--nph-icon-size-*` | equal |
| Color | inherits from the context | `currentColor` | equal |
| Focus | does not receive focus | no `tabindex`, SVG `focusable="false"` | equal |
| Accessible name | no visible text, accessible name; with text, `aria-hidden` | non-empty `label` → `role="img"` + `aria-label`; otherwise `aria-hidden` (`nph-icon.ts:146-161`) | equal |

## Command output

```text
figma: 93 nomes | codigo: 93 entradas glyph()
so no figma: nenhum
so no codigo: nenhum
repetidos no codigo: nenhum
estilos do figma ausentes no codigo: nenhum
```

Exit code: 0.

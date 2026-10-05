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
    "decisao_convertida": "Conjunto nph-icon (248:143) do quadro aceito 1130:956: propriedade nome com 93 opcoes e estilo regular|solid, conferidos contra o mapa do codigo."
  }
}
```

# DSA-09 — `nph-icon` revalidado contra o Figma aceito

Apoio à DSA-09: o `nph-spinner` desenha o `circle-notch` pelo `nph-icon`. Esta
evidência não é de gate, por isso o nome não segue `<gate>-<data>`.

O `nph-icon` entrou no plano técnico do Lote A para revalidar o código e a ficha
anteriores ao reinício. O resultado é **sem divergência**: nada muda no código.

## O que foi conferido

| Ponto | Figma aceito (`248:143`, quadro `1130:956`) | Código (`v/5.0.0`, `7670786`) | Resultado |
|---|---|---|---|
| Acervo | propriedade `nome`, 93 opções | 93 entradas `glyph(...)` em `nph-icon.icons.ts` | igual, nos dois sentidos |
| Estilo | `estilo`: `regular`, `solid`; padrão `regular` | `variant`: `regular`, `solid`; ausente vale `regular` | igual |
| Tamanho | não é variante; só `icon/size-sm`, `icon/size-md`, `icon/size-lg` | `size` `sm`, `md`, `lg`, cada um em `--nph-icon-size-*` | igual |
| Cor | herda do contexto | `currentColor` | igual |
| Foco | não recebe foco | sem `tabindex`, SVG `focusable="false"` | igual |
| Nome acessível | sem texto visível, nome acessível; com texto, `aria-hidden` | `label` não vazio → `role="img"` + `aria-label`; senão `aria-hidden` (`nph-icon.ts:146-161`) | igual |

## Saída do comando

```text
figma: 93 nomes | codigo: 93 entradas glyph()
so no figma: nenhum
so no codigo: nenhum
repetidos no codigo: nenhum
estilos do figma ausentes no codigo: nenhum
```

Código de saída: 0.

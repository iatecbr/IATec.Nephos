# Comparação — modelo de página de conteúdo × protótipo do Figma

Comparação estrutural e de token da story **Componentes › nph-icon › Docs ›
Documentação** com o protótipo aprovado no Figma. Não é comparação pixel a pixel.

## Referência

| Modo | Figma | Arquivo exportado |
|---|---|---|
| Claro | [`1181:703`](https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1181-703), página `1181:821`, dentro do bloco `1181:608` | `figma-claro.png` (1x, 1280 de largura) |
| Escuro | [`1181:978`](https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1181-978), página `1181:1096`, dentro do bloco `1181:608` | `figma-escuro.png` (1x, 1280 de largura) |

Os prints do Storybook (`storybook-claro.png` e `storybook-escuro.png`) foram
capturados em viewport de 1280 de largura, com o painel inferior fechado, e
reduzidos pela ferramenta de captura para 800 de largura.

## O que confere

| Ponto | Figma | Storybook |
|---|---|---|
| Ordem dos blocos | cabeçalho, índice, seções | igual |
| Título de seção | `text/heading-md` com linha embaixo | igual (medido: tamanho, entrelinha e peso batem com o token) |
| Texto | `text/body-md`, largura de leitura | igual |
| Demonstração | só borda, sem fundo | igual (fundo computado transparente, borda em `--nph-color-border`) |
| Tabela | cabeçalho em `text/label-sm`, termo em `text/code` | igual |
| Nota | `status/info-*` | igual, e `status/warning-*` na entrada inválida |
| Quando usar | cartões `status/success-*` e `status/error-*` lado a lado | igual |
| Fonte | rodapé `text/caption` com linha fina | igual |
| Modo escuro | modo `escuro` da coleção `semantic` | `data-nph-color-scheme="dark"` |

## Divergências, com o motivo

| Divergência | Motivo |
|---|---|
| O h1 usa `text/heading-lg`, e não `heading-xl` | `design.md`: o título da tela é `heading-lg`; seção é `heading-md` |
| A linha `variant` diz que `solid` existe para todos os nomes | a ficha `nph-icon` vigente; o protótipo ainda trazia a regra antiga, restrita a `star` |
| O aviso "Esta página é derivada" aparece como nota, no topo | o protótipo não mostrava o aviso; o texto de processo saiu, e ficou só a regra de precedência das fontes |
| A página tem todas as seções (Núcleo, Cor, Entrada inválida, Anti-padrões, Referências) | o protótipo mostrava uma amostra das seções |
| Os cartões de "Quando usar" têm título | dão nome a cada lista para quem lê e para o leitor de tela |
| Linhas da API que não são identificador ("Slots e eventos", "Interação") saem em texto, e não em fonte de código | a tabela usa fonte de código só para identificador |
| A legenda da demonstração diz "os tamanhos aprovados" | texto vivo não traz contagem |
| A barra de ferramentas tem os botões nativos do Storybook | o protótipo simplificou a barra |

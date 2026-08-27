/**
 * Paginas de leitura do `nph-icon`: documentacao e catalogo visual.
 *
 * Nenhuma das duas prova contrato — isso e papel de `Componentes/nph-icon/
 * Validacao` e dos testes. Aqui se le e se procura.
 *
 * A busca da galeria pertence a ESTA pagina, nao a API do componente: nenhum
 * atributo, propriedade, evento ou estilo do `nph-icon` foi criado para ela.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import './nph-icon';
import { NPH_ICON_NAMES, NPH_ICON_SIZES } from './nph-icon.icons';
import {
  CATEGORIAS,
  TOTAL_DO_NUCLEO,
  botao,
  campo,
  cartao,
  celula,
  celulaDeTabela,
  filtrarNomes,
  fonte,
  grade,
  legenda,
  pagina,
  prosa,
  secao,
  tabela,
} from './nph-icon.demo';

const meta: Meta = {
  title: 'Componentes/nph-icon/Docs',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj;

/*
 * `hidden` precisa vencer o `display` inline da moldura. Regra de cenario,
 * restrita a esta pagina.
 */
const regraDeOcultacao = html`
  <style>
    [hidden] {
      display: none !important;
    }
  </style>
`;

function linha(termo: string, descricao: TemplateResult | string): TemplateResult {
  return html`
    <tr>
      <th scope="row" style="${celulaDeTabela} font-family: monospace; white-space: nowrap;">
        ${termo}
      </th>
      <td style=${celulaDeTabela}>${descricao}</td>
    </tr>
  `;
}

function itens(lista: readonly string[]): TemplateResult {
  return html`
    <ul style="margin: 0; padding-left: var(--nph-space-container-padding);">
      ${lista.map((texto) => html`<li>${texto}</li>`)}
    </ul>
  `;
}

/**
 * Pagina de leitura. Todo bloco declara a origem da regra que mostra; nada
 * aqui e decidido nesta pagina.
 */
export const Documentacao: Story = {
  name: 'Documentação',
  render: () => html`
    <div style=${pagina}>
      <header style=${prosa}>
        <h1 style="margin: 0;">nph-icon</h1>
        <p>
          Disponibiliza um ícone do núcleo Nephos com tamanho, família e acessibilidade
          consistentes, sem introduzir cor ou arte fora do acervo aprovado.
        </p>
      </header>

      <div style=${cartao}>
        <strong>Esta página é derivada.</strong>
        <p style="margin: 0;">
          Em caso de divergência, prevalecem as fontes canônicas:
          <code>design.md</code> para o contrato técnico e
          <code>docs/decisoes-tecnicas.md</code> para as decisões P01, P02, P03, P17,
          P19, P20 e P21. A <code>ficha nph-icon</code> e o Figma
          <code>DS-IA-NEPHOS 5.0</code> completam o contrato do componente. Nenhuma
          regra é criada aqui.
        </p>
        <p style="margin: 0;">
          Estado documental: P01, P02, P03, P17, P19 e P20 são decisões adotadas pela
          Indiane em 24/08/2026; a P21 foi adotada em 26/08/2026, com aceitação formal
          de risco. Todas aguardam revisão de Elvys. A aprovação do Figma em 26-08-2026
          é visual e não substitui essa revisão.
        </p>
      </div>

      ${secao(
        'Quando usar',
        html`
          ${itens([
            'Um controle ou conteúdo precisa de um ícone existente no núcleo Nephos.',
            'O ícone reforça um rótulo, estado ou direção sem substituir a informação textual.',
          ])}
          ${fonte('ficha nph-icon')}
        `,
      )}

      ${secao(
        'Quando não usar',
        html`
          ${itens([
            'A ação é específica do domínio ou tem consequência: use rótulo textual junto ao ícone.',
            'O ícone solicitado não existe no núcleo: registre a lacuna e aguarde decisão.',
          ])}
          ${fonte('ficha nph-icon')}
        `,
      )}

      ${secao(
        'API pública aprovada',
        html`
          <table style=${tabela}>
            <tbody>
              ${linha(
                'name',
                `Obrigatório, em kebab-case e limitado aos ${TOTAL_DO_NUCLEO} ícones do núcleo Nephos.`,
              )}
              ${linha('variant', 'regular por padrão ou solid somente quando name=star.')}
              ${linha('size', 'sm, md ou lg; não aceita valor livre.')}
              ${linha(
                'label',
                'Ausente ou vazio torna o ícone decorativo e aplica aria-hidden. Valor não vazio fornece seu nome acessível.',
              )}
              ${linha('Slots e eventos', 'Não expõe slots nem eventos.')}
              ${linha(
                'Interação',
                'Não recebe foco, clique ou toque; o controle que o contém define a interação.',
              )}
              ${linha(
                'Cor e personalização',
                'Não expõe propriedade de cor nem ::part inicial; herda currentColor do contexto.',
              )}
            </tbody>
          </table>
          ${fonte('ficha nph-icon; design.md › contrato_nph_icon; docs/decisoes-tecnicas.md › P21')}
        `,
      )}

      ${secao(
        `Núcleo de ${TOTAL_DO_NUCLEO} ícones`,
        html`
          <p style="margin: 0;">
            O acervo é Font Awesome Pro e <strong>Classic</strong> é a família padrão.
            O catálogo completo, com busca, está em <strong>Icons Overview</strong>,
            nesta mesma pasta.
          </p>
          <table style=${tabela}>
            <tbody>
              ${CATEGORIAS.map((categoria) =>
                linha(categoria.titulo, `${categoria.icones.length} ícones`),
              )}
            </tbody>
          </table>
          <p style="margin: 0;">
            <code>solid</code> existe somente para <code>star</code>: Regular marca não
            favoritado, Solid marca favoritado. As demais combinações com solid não
            existem de propósito — nunca invente arte para preencher a matriz.
            Light, Thin e Sharp são proibidos. Duotone é permitido somente em navegação
            estrutural, sem misturar famílias no mesmo grupo, e ainda não tem arte
            disponível.
          </p>
          ${fonte(
            'design.md › icones_nucleo, icone_regras e icone_componente_figma',
          )}
        `,
      )}

      ${secao(
        'Tamanho',
        html`
          <p style="margin: 0;">
            O tamanho não é variante visual: vem de token semântico, e não existe valor
            livre. A caixa é sempre quadrada; o desenho é centralizado e escalado pela
            altura.
          </p>
          <div style="display: flex; align-items: center; gap: var(--nph-space-section);">
            ${NPH_ICON_SIZES.map(
              (tamanho) => html`
                <div style=${celula}>
                  <nph-icon name="gear" size=${tamanho}></nph-icon>
                  <span style=${legenda}>size="${tamanho}" — icon/size-${tamanho}</span>
                </div>
              `,
            )}
          </div>
          <table style=${tabela}>
            <tbody>
              ${linha(
                'icon/size-sm',
                'Dentro de controle, célula de tabela, campo, e ao lado de texto de 14px. Na dúvida, é este.',
              )}
              ${linha(
                'icon/size-md',
                'Item de menu, aba e ação de destaque, onde o sm fica pequeno ao lado do rótulo. Não use dentro de botão comum.',
              )}
              ${linha(
                'icon/size-lg',
                'Cabeçalho de seção, estado vazio e ícone que carrega significado sozinho. Não use em tela densa nem em lista.',
              )}
            </tbody>
          </table>
          <p style="margin: 0;">
            <code>eye</code>, <code>eye-slash</code> e <code>star</code> têm 18 de
            largura natural, acima dos 16 da caixa: a caixa normaliza altura e
            alinhamento, não largura. O desenho transborda centralizado, sem corte e sem
            reescala.
          </p>
          ${fonte(
            'design.md › tokens_icon, icone_regras.caixa e icones_terceira_leva.largura; docs/decisoes-tecnicas.md › P21',
          )}
        `,
      )}

      ${secao(
        'Cor',
        html`
          <p style="margin: 0;">
            A cor herda do contexto via <code>currentColor</code>. Não existe token de
            cor de ícone e a cor não é propriedade do componente. O espaço até o texto
            é <code>space/inline-tight</code> e pertence ao contêiner que compõe ícone e
            texto, não ao ícone.
          </p>
          ${fonte(
            'design.md › icone_regras.cor e icone_regras.espaco_ate_o_texto; docs/decisoes-tecnicas.md › P21',
          )}
        `,
      )}

      ${secao(
        'Acessibilidade',
        html`
          ${itens([
            'Com texto visível ao lado, o ícone é decorativo e recebe aria-hidden — senão o leitor de tela lê duas vezes.',
            'Sem texto visível, aria-label é obrigatório.',
            'Ícone significativo exige contraste 3:1 (WCAG 1.4.11).',
            'O ícone não é o alvo de toque: o alvo é o controle em volta, com control/height-large em tela de toque.',
            'O ícone isolado não recebe foco; o controle que o envolve define o teclado.',
            'Ícone e cor nunca são o único sinal de estado ou ação.',
          ])}
          ${fonte('design.md › icone_acessibilidade; ficha nph-icon')}
        `,
      )}

      ${secao(
        'Entrada inválida',
        html`
          <p style="margin: 0;">
            <code>name</code> fora do núcleo, <code>size</code> fora da lista aprovada ou
            <code>variant=solid</code> com outro nome não renderizam ícone e falham na
            validação de desenvolvimento. Não há fallback visual nem tamanho livre. O
            erro sai por <code>console.error</code> apenas em desenvolvimento.
          </p>
          <p style="margin: 0;">
            Os casos estão demonstrados em <strong>Validação › Entrada inválida</strong>.
          </p>
          ${fonte('ficha nph-icon; docs/decisoes-tecnicas.md › P21')}
        `,
      )}

      ${secao(
        'Anti-padrões',
        html`
          ${itens([
            'Não usar ícone sozinho para excluir, aprovar, publicar, exportar ou outra ação específica do domínio.',
            'Não usar o pacote, arquivo ou segredo do Font Awesome Pro em material versionado.',
            'Não criar variante visual apenas para preencher uma matriz.',
            'Não usar Duotone fora de navegação estrutural nem misturar Duotone e Classic no mesmo grupo.',
            'Não usar um name fora dos 34 ícones do núcleo Nephos.',
            'Não definir cor como propriedade; o ícone herda currentColor do contexto.',
          ])}
          ${fonte('ficha nph-icon')}
        `,
      )}

      ${secao(
        'Referências',
        html`
          ${itens([
            'design.md — contrato_nph_icon, icone_regras, icone_acessibilidade, tokens_icon, icones_nucleo.',
            'docs/decisoes-tecnicas.md — P01, P02, P03, P17, P19, P20 e P21.',
            'ficha nph-icon — função, variantes, estados, acessibilidade, tokens e anti-padrões.',
            'Figma DS-IA-NEPHOS 5.0 — página NPH — Icon (346:2), frames Componentes — nph-icon (346:3) e Documentação — nph-icon (346:4).',
            'Storybook — Icons Overview, nesta pasta; Validação, na pasta ao lado.',
          ])}
        `,
      )}
    </div>
  `,
};

function galeriaDe(alvo: EventTarget | null): HTMLElement | null {
  return alvo instanceof HTMLElement
    ? alvo.closest<HTMLElement>('[data-nph-galeria]')
    : null;
}

/**
 * Filtra a grade no navegador. O conjunto exibido vem sempre de
 * `filtrarNomes` sobre `NPH_ICON_NAMES`: e impossivel esta pagina mostrar um
 * icone que nao esteja no nucleo.
 */
function aplicarFiltro(galeria: HTMLElement, termo: string): void {
  const correspondentes = new Set<string>(filtrarNomes(NPH_ICON_NAMES, termo));

  for (const item of galeria.querySelectorAll<HTMLElement>('[data-nph-nome]')) {
    item.hidden = !correspondentes.has(item.dataset['nphNome'] ?? '');
  }

  for (const categoria of galeria.querySelectorAll<HTMLElement>('[data-nph-categoria]')) {
    categoria.hidden =
      categoria.querySelectorAll('[data-nph-nome]:not([hidden])').length === 0;
  }

  const vazio = galeria.querySelector<HTMLElement>('[data-nph-vazio]');
  if (vazio !== null) {
    vazio.hidden = correspondentes.size > 0;
  }

  /* O contador so muda de texto quando o numero muda: leitor de tela nao e mural. */
  const contador = galeria.querySelector<HTMLElement>('[data-nph-contador]');
  const total = String(correspondentes.size);
  if (contador !== null && contador.dataset['nphEncontrados'] !== total) {
    contador.dataset['nphEncontrados'] = total;
    contador.textContent = `${total} de ${TOTAL_DO_NUCLEO} ícones`;
  }
}

function aoBuscar(evento: Event): void {
  const alvo = evento.currentTarget;
  const galeria = galeriaDe(alvo);
  if (galeria === null || !(alvo instanceof HTMLInputElement)) {
    return;
  }
  aplicarFiltro(galeria, alvo.value);
}

function aoLimpar(evento: Event): void {
  const galeria = galeriaDe(evento.currentTarget);
  const busca = galeria?.querySelector<HTMLInputElement>('[data-nph-busca]') ?? null;
  if (galeria === null || busca === null) {
    return;
  }
  busca.value = '';
  aplicarFiltro(galeria, '');
  busca.focus();
}

/**
 * Catalogo visual dos icones do nucleo, com busca por nome.
 *
 * Cada item mostra o `nph-icon` SEM `label`, decorativo, ao lado do nome em
 * texto: com texto visivel ao lado, rotular o icone faria o leitor de tela ler
 * duas vezes.
 */
export const IconsOverview: Story = {
  name: 'Icons Overview',
  render: () => html`
    <div style=${pagina} data-nph-galeria>
      ${regraDeOcultacao}
      <header style=${prosa}>
        <h1 style="margin: 0;">Icons Overview</h1>
        <p style="margin: 0;">
          Os ${TOTAL_DO_NUCLEO} ícones aprovados do núcleo Nephos, agrupados pelas
          categorias do <code>design.md</code>. O contrato do componente está em
          <strong>Documentação</strong>.
        </p>
      </header>

      <div
        style="display: flex; align-items: flex-end; gap: var(--nph-space-inline); flex-wrap: wrap;"
      >
        <div style="display: flex; flex-direction: column; gap: var(--nph-space-stack-tight);">
          <label for="nph-icon-busca">Buscar ícone por nome</label>
          <input
            id="nph-icon-busca"
            data-nph-busca
            type="search"
            autocomplete="off"
            spellcheck="false"
            placeholder="ex.: chevron"
            aria-controls="nph-icon-grade"
            style=${campo}
            @input=${aoBuscar}
          />
        </div>
        <button type="button" style=${botao} @click=${aoLimpar}>Limpar</button>
      </div>

      <p
        data-nph-contador
        data-nph-encontrados=${TOTAL_DO_NUCLEO}
        role="status"
        aria-live="polite"
        style="${legenda} margin: 0;"
      >
        ${TOTAL_DO_NUCLEO} de ${TOTAL_DO_NUCLEO} ícones
      </p>

      <div
        id="nph-icon-grade"
        style="display: flex; flex-direction: column; gap: var(--nph-space-section);"
      >
        ${CATEGORIAS.map(
          (categoria) => html`
            <section
              data-nph-categoria
              style="display: flex; flex-direction: column; gap: var(--nph-space-stack-tight);"
            >
              <h3 style="margin: 0; font-size: 14px;">
                ${categoria.titulo} (${categoria.icones.length})
              </h3>
              <div style=${grade}>
                ${categoria.icones.map(
                  (nome) => html`
                    <div data-nph-nome=${nome} style=${celula}>
                      <nph-icon name=${nome} size="md"></nph-icon>
                      <span style=${legenda}>${nome}</span>
                    </div>
                  `,
                )}
              </div>
            </section>
          `,
        )}
      </div>

      <p data-nph-vazio hidden style=${legenda}>
        Nenhum ícone do núcleo corresponde à busca. Se o ícone que você precisa não
        está aqui, é lacuna: pergunte antes de acrescentar.
      </p>
    </div>
  `,
};

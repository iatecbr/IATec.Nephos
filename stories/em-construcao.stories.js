import { html } from 'lit';

/**
 * Pagina unica do shell inicial do Storybook.
 *
 * NAO e um componente do Nephos e nao deve virar um. O estilo abaixo e local,
 * provisorio e escrito com valores literais de proposito: os tokens do Nephos
 * ainda nao foram convertidos para codigo (P17, aberta). Nenhuma regra daqui
 * vale como precedente para componente do Design System.
 */
export default {
  title: 'Nephos — Em construção',
  parameters: {
    options: { showPanel: false },
  },
};

const estilo = `
  font-family: system-ui, sans-serif;
  line-height: 1.6;
  color: #1a1a1a;
  max-width: 46rem;
  margin: 0 auto;
  padding: 3rem 1.5rem;
`;

export const EmConstrucao = {
  name: 'Em construção',
  render: () => html`
    <main style=${estilo}>
      <p
        style="text-transform: uppercase; letter-spacing: .08em; font-size: .75rem; font-weight: 600; color: #6b6b6b; margin: 0 0 .5rem;"
      >
        IATec · Design System
      </p>

      <h1 style="font-size: 2rem; margin: 0 0 1rem;">Nephos — Em construção</h1>

      <p style="font-size: 1.125rem; margin: 0 0 2rem;">
        O Design System da IATec está em preparação.
        <strong>Nenhum componente foi implementado ainda.</strong>
      </p>

      <h2 style="font-size: 1rem; margin: 2rem 0 .5rem;">O que existe hoje</h2>
      <ul style="margin: 0; padding-left: 1.25rem;">
        <li>Este Storybook, como shell inicial, para confirmar que o ambiente roda.</li>
        <li>
          O contrato técnico das fundações, em <code>design.md</code>, migrado do
          trabalho feito no Figma.
        </li>
        <li>
          As instruções de agente, em <code>AGENTS.md</code> e <code>CLAUDE.md</code>.
        </li>
      </ul>

      <h2 style="font-size: 1rem; margin: 2rem 0 .5rem;">O que ainda não existe</h2>
      <ul style="margin: 0; padding-left: 1.25rem;">
        <li>Componentes <code>nph-*</code>.</li>
        <li>Tokens convertidos do Figma para código.</li>
        <li>Testes, pipeline e publicação.</li>
        <li>Estrutura definitiva de diretórios.</li>
      </ul>

      <h2 style="font-size: 1rem; margin: 2rem 0 .5rem;">Antes do primeiro componente</h2>
      <p style="margin: 0 0 .5rem;">
        Cinco decisões técnicas continuam <strong>pendentes</strong> e precisam da
        confirmação de Elvys:
      </p>
      <ul style="margin: 0; padding-left: 1.25rem;">
        <li><strong>P01</strong> — Shadow DOM: aberto, fechado ou sem shadow.</li>
        <li><strong>P02</strong> — como o CSS fica exposto: <code>::part</code>, custom properties ou classe global.</li>
        <li><strong>P03</strong> — diretórios de trabalho da branch <code>v/3.0.0</code>.</li>
        <li><strong>P17</strong> — formato de saída dos tokens: CSS custom properties, JSON ou os dois.</li>
        <li><strong>P19</strong> — detalhes de Storybook, testes e publicação.</li>
      </ul>

      <p
        style="margin: 2rem 0 0; padding-top: 1rem; border-top: 1px solid #e0e0e0; font-size: .875rem; color: #6b6b6b;"
      >
        Detalhes e escolhas provisórias de bootstrap estão no
        <code>README.md</code> do repositório.
      </p>
    </main>
  `,
};

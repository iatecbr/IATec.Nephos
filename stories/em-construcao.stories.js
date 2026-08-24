import { html } from 'lit';

/**
 * Pagina unica do shell inicial do Storybook.
 *
 * NAO e um componente do Nephos e nao deve virar um. O estilo abaixo e local,
 * provisorio e escrito com valores literais de proposito: os tokens do Nephos
 * ainda nao foram convertidos para codigo. O P17 ja decidiu o formato deles
 * (JSON como fonte, CSS custom properties como saida gerada), mas nenhum valor
 * entra no repositorio antes da auditoria Figma <-> documentacao. Nenhuma regra
 * daqui vale como precedente para componente do Design System.
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
        <li>Testes, workflow de CI e publicação.</li>
        <li>Os diretórios de <code>src/</code>, que só nascem com o primeiro componente.</li>
      </ul>

      <h2 style="font-size: 1rem; margin: 2rem 0 .5rem;">Decisões técnicas vigentes</h2>
      <p style="margin: 0 0 .5rem;">
        Cinco decisões orientam o trabalho a partir daqui. Status:
        <strong>decisão adotada pela Indiane em 24/08/2026, aguardando revisão
        de Elvys</strong>.
      </p>
      <ul style="margin: 0; padding-left: 1.25rem;">
        <li><strong>P01</strong> — componentes <code>nph-*</code> usarão Shadow DOM aberto.</li>
        <li><strong>P02</strong> — CSS custom properties como API pública; <code>::part</code> para partes internas; classes internas não são API.</li>
        <li><strong>P03</strong> — componente, CSS, story e teste juntos em <code>src/components/&lt;nome&gt;/</code>.</li>
        <li><strong>P17</strong> — JSON como formato-fonte dos tokens; CSS custom properties como formato gerado.</li>
        <li><strong>P19</strong> — manter <code>@storybook/web-components-vite</code>; build no CI em pull requests, como artefato privado.</li>
      </ul>

      <p
        style="margin: 2rem 0 0; padding-top: 1rem; border-top: 1px solid #e0e0e0; font-size: .875rem; color: #6b6b6b;"
      >
        O registro completo — motivo, escopo, impacto e o que ficou fora de
        escopo em cada uma — está em
        <code>docs/decisoes-tecnicas.md</code>.
      </p>
    </main>
  `,
};

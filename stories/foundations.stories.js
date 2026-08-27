import { html } from 'lit';

export default {
  title: 'Fundações/Visão geral',
  parameters: {
    layout: 'fullscreen',
  },
};

const page = `
  color: var(--nph-color-foreground);
  background: var(--nph-color-background);
  font-family: system-ui, sans-serif;
  min-height: 100vh;
  padding: var(--nph-space-section) var(--nph-space-container-padding);
`;

const content = `
  display: grid;
  gap: var(--nph-space-section);
  margin: 0 auto;
  max-width: 72rem;
`;

const card = `
  background: var(--nph-color-card);
  border: 1px solid var(--nph-color-border);
  border-radius: var(--nph-radius-control);
  color: var(--nph-color-card-foreground);
  padding: var(--nph-space-container-padding);
`;

const foundations = [
  ['Cor', 'Camadas core, theme e semantic, nos modos claro e escuro.'],
  ['Tipografia', 'Estilos de texto aprovados no Figma e documentados no contrato.'],
  ['Espaçamento e raio', 'Tokens semânticos para composição e controles.'],
  ['Ícones', 'Núcleo curado de 34 ícones Font Awesome Pro.'],
];

export const VisaoGeral = {
  name: 'Visão geral',
  render: () => html`
    <main style=${page}>
      <section style=${content}>
        <header>
          <p style="color: var(--nph-color-primary); font-weight: 700; margin: 0 0 var(--nph-space-stack-tight);">
            FUNDAÇÕES
          </p>
          <h1 style="font-size: 2rem; margin: 0;">Regras que mantêm o sistema coerente</h1>
          <p style="color: var(--nph-color-muted-foreground); line-height: 1.6; margin: var(--nph-space-stack) 0 0; max-width: 44rem;">
            As fundações definem os valores e as restrições que os componentes consomem.
            O Storybook mostra o resultado em código; o Figma continua sendo a fonte visual.
          </p>
        </header>

        <div style="display: grid; gap: var(--nph-space-stack); grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));">
          ${foundations.map(
            ([title, description]) => html`
              <article style=${card}>
                <h2 style="font-size: 1rem; margin: 0 0 var(--nph-space-stack-tight);">${title}</h2>
                <p style="color: var(--nph-color-muted-foreground); line-height: 1.5; margin: 0;">
                  ${description}
                </p>
              </article>
            `,
          )}
        </div>

        <aside style="${card} border-left: 4px solid var(--nph-color-primary);">
          <strong>Como usar esta área</strong>
          <p style="color: var(--nph-color-muted-foreground); line-height: 1.5; margin: var(--nph-space-stack-tight) 0 0;">
            Consulte o contrato em <code>design.md</code> antes de criar ou alterar um
            componente. Se a documentação não cobrir o caso, registre a lacuna em vez de
            criar token, variante ou regra nova.
          </p>
        </aside>
      </section>
    </main>
  `,
};

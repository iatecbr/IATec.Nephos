import { html } from 'lit';

export default {
  title: 'Comece aqui/Boas-vindas',
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

const sections = [
  {
    title: '1. Comece pelas fundações',
    text: 'Consulte cor, tipografia, espaço, raio e ícones antes de decidir a aparência de uma peça.',
    destination: 'Fundações/Visão geral',
  },
  {
    title: '2. Consulte o componente',
    text: 'Cada componente reúne estados, variantes, acessibilidade e exemplos executáveis.',
    destination: 'Componentes/nph-icon',
  },
  {
    title: '3. Registre uma lacuna',
    text: 'Se um caso não estiver documentado, não improvise API, token, variante ou comportamento.',
    destination: 'Ficha e Registro canônicos',
  },
];

export const BoasVindas = {
  name: 'Boas-vindas',
  render: () => html`
    <main style=${page}>
      <section style=${content}>
        <header
          style="${card} background: var(--nph-color-primary); border-color: var(--nph-color-primary); color: var(--nph-color-primary-foreground);"
        >
          <p style="font-size: .875rem; font-weight: 700; letter-spacing: .08em; margin: 0 0 var(--nph-space-stack-tight);">
            IATEC · DESIGN SYSTEM
          </p>
          <h1 style="font-size: 2.5rem; margin: 0;">Nephos</h1>
          <p style="font-size: 1.125rem; line-height: 1.6; margin: var(--nph-space-stack) 0 0; max-width: 42rem;">
            Catálogo de componentes e fundações para construir experiências consistentes,
            acessíveis e verificáveis.
          </p>
        </header>

        <section>
          <h2 style="font-size: 1.25rem; margin: 0 0 var(--nph-space-stack);">Como navegar</h2>
          <div style="display: grid; gap: var(--nph-space-stack); grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));">
            ${sections.map(
              (section) => html`
                <article style=${card}>
                  <h3 style="font-size: 1rem; margin: 0 0 var(--nph-space-stack-tight);">${section.title}</h3>
                  <p style="color: var(--nph-color-muted-foreground); line-height: 1.5; margin: 0;">
                    ${section.text}
                  </p>
                  <p style="color: var(--nph-color-primary); font-size: .875rem; font-weight: 700; margin: var(--nph-space-stack) 0 0;">
                    ${section.destination}
                  </p>
                </article>
              `,
            )}
          </div>
        </section>

        <aside style=${card}>
          <strong>Estado atual</strong>
          <p style="color: var(--nph-color-muted-foreground); line-height: 1.5; margin: var(--nph-space-stack-tight) 0 0;">
            Os tokens são gerados a partir da fonte auditada. O <code>nph-icon</code>
            está implementado e aguarda comparação visual entre Figma e Storybook antes
            do aceite final.
          </p>
        </aside>
      </section>
    </main>
  `,
};

/**
 * VALIDATION stories of `nph-tooltip`.
 *
 * Each story shows the open bubble with the Figma example content
 * (frame `1237:5`): one line and two lines. There is no explanatory text,
 * only the bubble text, which is content and arrives ready from the
 * application.
 *
 * The color scheme comes from the Storybook global selector, applied at the
 * page root.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import './nph-tooltip';

const meta: Meta = {
  title: 'Componentes/nph-tooltip/Validação',
};

export default meta;

type Story = StoryObj;

function frame(text: string): TemplateResult {
  return html`<div style="padding: var(--nph-space-section);">
    <nph-tooltip open text=${text}></nph-tooltip>
  </div>`;
}

export const OneLine: Story = {
  name: 'Uma linha',
  render: () => frame('Explica o que o campo pede.'),
};

export const TwoLines: Story = {
  name: 'Duas linhas',
  render: () => frame('Use o nome como está no documento, sem abreviar nem trocar a ordem.'),
};

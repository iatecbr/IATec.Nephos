/**
 * VALIDATION stories of `nph-label`.
 *
 * Each page proves a part of the approved contract (27-08-2026, 08-09-2026
 * and 01-10-2026): the `required` x `info` matrix of the set `374:6`, parity
 * with Figma in both color schemes, the focus and the open bubble of the
 * information trigger (frame `1194:1482`), the association with the control
 * and the absence of a state of the text's own.
 *
 * The dark frame switches `data-nph-color-scheme`, which is the public theme
 * contract set by P20. No story duplicates a component per mode: the same
 * piece is shown in both contexts.
 *
 * All visible text — section title, caption and the labels' example
 * content — comes from the language dictionary, under the `labelValidation`
 * key (`docs/i18n.md`, "Storybook"). The story reads `globals.locale`.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { userEvent } from 'storybook/test';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import './nph-label';

const meta: Meta = {
  title: 'Components/nph-label/Validation',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj;

interface GlobalsContext {
  globals?: Record<string, unknown>;
}

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined) {
  const locale = (context?.globals?.[LOCALE_GLOBAL] as string | undefined) ?? DEFAULT_LOCALE;
  return translations(locale).labelValidation;
}

type Texts = ReturnType<typeof t>;

/** Demo frame. Not valid as a precedent for component CSS. */
function page(content: TemplateResult): TemplateResult {
  return html`<div
    style="padding:32px;display:flex;flex-direction:column;gap:32px;background:var(--nph-color-background)"
  >
    ${content}
  </div>`;
}

function section(title: string, content: TemplateResult): TemplateResult {
  return html`<section style="display:flex;flex-direction:column;gap:12px">
    <h2
      style="margin:0;font-family:var(--nph-text-heading-sm-font-family);font-size:var(--nph-text-heading-sm-font-size);font-weight:var(--nph-text-heading-sm-font-weight);line-height:var(--nph-text-heading-sm-line-height);color:var(--nph-color-foreground)"
    >
      ${title}
    </h2>
    ${content}
  </section>`;
}

function caption(text: string): TemplateResult {
  return html`<p
    style="margin:0;font-family:var(--nph-text-body-sm-font-family);font-size:var(--nph-text-body-sm-font-size);line-height:var(--nph-text-body-sm-line-height);color:var(--nph-color-muted-foreground)"
  >
    ${text}
  </p>`;
}

/** Frame that fixes a color scheme, to compare light and dark side by side. */
function frame(scheme: 'light' | 'dark', content: TemplateResult): TemplateResult {
  return html`<div
    data-nph-color-scheme=${scheme}
    style="padding:24px;border-radius:var(--nph-radius-control);background:var(--nph-color-background);display:flex;flex-direction:column;gap:16px"
  >
    ${content}
  </div>`;
}

/** Label with the information trigger, with the example text from the dictionary. */
function withInfo(v: Texts, required = false): TemplateResult {
  return html`<nph-label
    text=${v.sampleText}
    ?required=${required}
    info=${v.info}
    info-label=${v.infoLabel}
  ></nph-label>`;
}

/** The combinations of `required` and `info`, in the order of the set `374:6`. */
function combinations(v: Texts): TemplateResult {
  return html`
    <nph-label text=${v.sampleText}></nph-label>
    <nph-label text=${v.sampleText} required></nph-label>
    ${withInfo(v)} ${withInfo(v, true)}
  `;
}

/**
 * The whole matrix: `required` x `info`. There is no layout or weight, and the
 * text has no state — focus belongs only to the information trigger.
 */
export const Matrix: Story = {
  name: 'Matrix',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return page(html`${section(v.matrixTitle, html`${caption(v.matrixCaption)} ${combinations(v)}`)}`);
  },
};

/**
 * Parity with Figma. The asterisk lightens by itself in dark mode because
 * `status/error` has one value per scheme; nothing is painted by hand.
 */
export const LightAndDarkMode: Story = {
  name: 'Light and dark mode',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return page(html`
      ${section(v.lightTitle, frame('light', combinations(v)))}
      ${section(v.darkTitle, frame('dark', combinations(v)))}
    `);
  },
};

/**
 * The reason the component does not use Shadow DOM. Clicking the label puts
 * the cursor in the field, and the screen reader announces the name on
 * reaching it.
 */
export const AssociationWithControl: Story = {
  name: 'Association with the control',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return page(html`
      ${section(
        v.associationTitle,
        html`
          ${caption(v.associationCaption)}
          <div style="display:flex;flex-direction:column;gap:var(--nph-space-stack-tight)">
            <nph-label for="name-field" text=${v.sampleText} required></nph-label>
            <input
              id="name-field"
              required
              style="font-family:var(--nph-text-body-md-font-family);font-size:var(--nph-text-body-md-font-size);height:var(--nph-control-height-default);border:1px solid var(--nph-color-border);border-radius:var(--nph-radius-control);padding-inline:var(--nph-space-control-padding);background:var(--nph-color-background);color:var(--nph-color-foreground)"
            />
          </div>
          ${caption(v.requiredLegend)}
        `,
      )}
    `);
  },
};

/**
 * What the label does NOT do. Error and disabled do not change the label: the
 * field shows both, and later `nph-field`.
 */
export const WhatTheLabelDoesNotDo: Story = {
  name: 'What the label does not do',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return page(html`
      ${section(v.errorTitle, html`${caption(v.errorCaption)} <nph-label text=${v.sampleText} required></nph-label>`)}
      ${section(
        v.disabledTitle,
        html`
          ${caption(v.disabledCaption)}
          <div style="opacity:var(--nph-state-disabled-opacity)">
            <nph-label text=${v.sampleText} required></nph-label>
          </div>
        `,
      )}
    `);
  },
};

/**
 * The trigger focus: `focus/border` border and `focus/halo` halo around the
 * 24 x 24 target (L9). It only shows through the keyboard: click the field
 * above and use Tab.
 */
export const TriggerFocus: Story = {
  name: 'Trigger focus',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return page(html`
      ${section(
        v.focusTitle,
        html`
          ${caption(v.focusCaption)}
          <input aria-label=${v.tabStartLabel} />
          ${frame('light', withInfo(v))} ${frame('dark', withInfo(v))}
        `,
      )}
    `);
  },
};

/**
 * The open bubble: `nph-tooltip` below the label, aligned to the start, at
 * `space/inline` (row `aberto` of the frame). It opens on click, Enter or
 * Space; it closes with Esc, a click outside or Tab out.
 */
export const Open: Story = {
  name: 'Open',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return page(html`
      ${section(
        v.openTitle,
        html`
          ${caption(v.openCaption)}
          <div style="padding-block-end:var(--nph-space-section)">${withInfo(v)}</div>
        `,
      )}
    `);
  },
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector<HTMLButtonElement>('nph-label .nph-label__info');
    if (trigger) {
      await userEvent.click(trigger);
    }
  },
};

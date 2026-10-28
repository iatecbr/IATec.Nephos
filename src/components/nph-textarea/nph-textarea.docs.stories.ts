/**
 * Reading page of `nph-textarea`.
 *
 * It does not prove the contract — that is the role of `Components/nph-textarea/Validation`
 * and of the tests. The content is transcribed from the frame accepted in Figma (`1632:24`,
 * documentation `1922:642`), from the spec sheet (`ficha`) and from P93; nothing is decided
 * here. The page follows the order of the `nph-badge` page: it opens with the labelled
 * matrix, and the two lists of "When to use" are the ones of the sheet. The set has no
 * variant axis and no size, so there is no Variants or Sizes section: States comes first,
 * then the sections of the piece itself, Footer and Height. The three required examples of
 * the frame close it, each in light and dark mode.
 *
 * Deferred, not fulfilled here, as on every Docs page:
 * - `text/body-lg` in `text` and `list` (DSA-33).
 *
 * The text comes from the language dictionary, in `.storybook/i18n/`, under the
 * `textareaDocs` key. The story is SINGLE: it reads `globals.locale` and looks up the
 * translation. Technical identifiers appear literally and are the same in any language.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, format, translations } from '../../../.storybook/i18n/index.js';
import '../nph-button/nph-button';
import './nph-textarea';
import { comment, inForm, inScheme, longText } from './nph-textarea.demo';
import type { CounterText, Scheme } from './nph-textarea.demo';
import { body, demo, header, index, list, matrix, note, section, source, table, text, usage } from '../../shared/docs/page';
import { sheetUseDontUse } from '../../shared/docs/sheet-lists';
import metadata from '../../shared/metadata/nph-textarea.json';

const meta: Meta = {
  title: 'Components/nph-textarea/Docs',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj;

interface GlobalsContext {
  globals?: Record<string, unknown>;
}

function localeOf(context: GlobalsContext | undefined): string {
  return (context?.globals?.[LOCALE_GLOBAL] as string | undefined) ?? DEFAULT_LOCALE;
}

/** Section ids: technical identifiers, the same in any language. */
const SECTIONS = {
  whenToUse: 'when-to-use',
  api: 'api',
  usage: 'usage',
  states: 'states',
  footer: 'footer',
  height: 'height',
  anatomy: 'anatomy',
  accessibility: 'accessibility',
  examples: 'examples',
  references: 'references',
} as const;

/** The limit of the examples, the one the frame shows (`0/280`). */
const LIMIT = 280;

/* Demo frame. Not a precedent for component CSS. */
const column = 'display: flex; flex-direction: column; align-items: flex-start; gap: var(--nph-space-stack-tight);';
const modes = 'display: flex; flex-wrap: wrap; gap: var(--nph-space-stack);';

/** The same example in light and in dark mode, side by side. */
function bothModes(d: Record<string, string>, content: () => TemplateResult): TemplateResult {
  const schemes: Array<[Scheme, string]> = [
    ['light', d.lightCaption as string],
    ['dark', d.darkCaption as string],
  ];
  return html`<div style=${modes}>${schemes.map(([scheme, caption]) => inScheme(scheme, caption, content()))}</div>`;
}

interface Attributes {
  value?: boolean;
  invalid?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  footer?: boolean;
}

/** Reading page, built with the blocks of `src/shared/docs/page.ts`. */
export const Documentation: Story = {
  name: 'Documentation',
  render: (_args, context: GlobalsContext) => {
    const d = translations(localeOf(context)).textareaDocs;
    const pair = ([term, rule]: [string, string]) => [term, rule] as const;
    const count: CounterText = (length, limit) => format(d.counterText, { length: String(length), limit: String(limit) });
    const piece = (attributes: Attributes): TemplateResult => {
      const value = attributes.value ? d.commentValue : '';
      return html`<nph-textarea
        label=${d.commentLabel}
        placeholder=${d.commentPlaceholder}
        value=${value}
        counter=${attributes.footer ? count(value.length, LIMIT) : ''}
        ?invalid=${attributes.invalid ?? false}
        ?readonly=${attributes.readOnly ?? false}
        ?disabled=${attributes.disabled ?? false}
        >${attributes.footer
          ? html`<nph-button slot="actions" emphasis="ghost" text=${d.attachText}></nph-button
              ><nph-button slot="actions" text=${d.sendText}></nph-button>`
          : ''}</nph-textarea
      >`;
    };
    const commentText = {
      label: d.commentLabel,
      placeholder: d.commentPlaceholder,
      attachText: d.attachText,
      sendText: d.sendText,
      counter: count,
      limit: LIMIT,
    };
    const formText = {
      label: d.descriptionLabel,
      help: d.descriptionHelp,
      placeholder: d.descriptionPlaceholder,
      counter: count,
      limit: LIMIT,
    };

    return html`
      <main style=${body}>
        ${header('nph-textarea', d.summary)}
        ${matrix(
          d.matrixLabel,
          ['footer: off', 'footer: on'],
          [
            { label: 'placeholder', cells: [piece({}), piece({ footer: true })] },
            { label: 'value', cells: [piece({ value: true }), piece({ value: true, footer: true })] },
            { label: 'invalid', cells: [piece({ value: true, invalid: true }), piece({ value: true, invalid: true, footer: true })] },
            { label: 'disabled', cells: [piece({ value: true, disabled: true }), piece({ value: true, disabled: true, footer: true })] },
          ],
        )}
        ${note('info', d.derivedTitle, d.derivedText)}
        ${index(d.onThisPage, [
          { id: SECTIONS.whenToUse, title: d.whenToUseTitle },
          { id: SECTIONS.api, title: d.apiTitle },
          { id: SECTIONS.usage, title: d.usageTitle },
          { id: SECTIONS.states, title: d.statesTitle },
          { id: SECTIONS.footer, title: d.footerTitle },
          { id: SECTIONS.height, title: d.heightTitle },
          { id: SECTIONS.anatomy, title: d.anatomyTitle },
          { id: SECTIONS.accessibility, title: d.accessibilityTitle },
          { id: SECTIONS.examples, title: d.examplesTitle },
          { id: SECTIONS.references, title: d.referencesTitle },
        ])}

        ${section(
          SECTIONS.whenToUse,
          d.whenToUseTitle,
          html`
            ${text(d.description)}
            ${sheetUseDontUse(metadata, localeOf(context), d)}
            ${text(d.relationsText)}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(
          SECTIONS.api,
          d.apiTitle,
          html`${table(d.apiHeader, d.api.map(pair))} ${source(d.sourceLabel, d.sourceApi)}`,
        )}

        ${section(
          SECTIONS.usage,
          d.usageTitle,
          html`${usage(d.usageHeader, d.usageMarkup, d.usageTag, ['nph-textarea'], d.usageImport)}
            ${source(d.sourceLabel, d.sourceUsage)}`,
        )}

        ${section(
          SECTIONS.states,
          d.statesTitle,
          html`
            ${table(d.statesHeader, d.states.map(pair))}
            ${demo(
              html`<div style=${column}>
                ${piece({ value: true })} ${piece({ value: true, invalid: true })} ${piece({ value: true, readOnly: true })}
                ${piece({ value: true, disabled: true })}
              </div>`,
              d.statesCaption,
            )}
            ${source(d.sourceLabel, d.sourceStates)}
          `,
        )}

        ${section(
          SECTIONS.footer,
          d.footerTitle,
          html`
            ${text(d.footerText)}
            ${demo(html`<div style=${column}>${comment({ ...commentText, value: d.commentValue })}</div>`, d.footerCaption)}
            ${table(d.footerHeader, d.footer.map(pair))}
            ${note('warning', d.readOnlyTitle, d.readOnlyText)}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(
          SECTIONS.height,
          d.heightTitle,
          html`
            ${text(d.heightText)}
            ${demo(
              html`<div style=${column}>
                <nph-textarea label=${d.commentLabel} placeholder=${d.commentPlaceholder}></nph-textarea>
                ${longText({ label: d.notesLabel, value: d.longValue })}
              </div>`,
              d.heightCaption,
            )}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(
          SECTIONS.anatomy,
          d.anatomyTitle,
          html`${table(d.anatomyHeader, d.anatomy.map(pair), 'text')} ${source(d.sourceLabel, d.sourceAnatomy)}`,
        )}

        ${section(
          SECTIONS.accessibility,
          d.accessibilityTitle,
          html`${table(d.accessibilityHeader, d.accessibility.map(pair), 'text')} ${source(d.sourceLabel, d.sourceAccessibility)}`,
        )}

        ${section(
          SECTIONS.examples,
          d.examplesTitle,
          html`
            ${demo(bothModes(d, () => comment(commentText)), d.exampleComment)}
            ${demo(bothModes(d, () => inForm(formText)), d.exampleForm)}
            ${demo(bothModes(d, () => longText({ label: d.notesLabel, value: d.longValue })), d.exampleLong)}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(SECTIONS.references, d.referencesTitle, list(d.references))}
      </main>
    `;
  },
};

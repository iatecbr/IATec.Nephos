/**
 * Reading page of `nph-field`.
 *
 * It does not prove the contract — that is the role of `Components/nph-field/Validation` and of
 * the tests. The content is transcribed from the frame accepted in Figma (`1194:21863`, set
 * `657:50`), from the spec sheet (`ficha`) and from P83; nothing is decided here. The page follows
 * the order of the `nph-badge` page: it opens with the labelled matrix, and the two lists of "When to
 * use" are the ones of the sheet. The three required examples of the frame close it, each in light
 * and dark mode.
 *
 * The control of a single field is the real `nph-input`; the options of a group are the stand-ins
 * of `nph-field.demo.ts`, which take the field contract of P83, until `nph-checkbox` and `nph-radio`
 * are merged.
 *
 * Deferred, not fulfilled here:
 * - `text/body-lg` in `text` and `list` (DSA-33).
 *
 * The text comes from the language dictionary, in `.storybook/i18n/`, under the `fieldDocs` key.
 * The story is SINGLE: it reads `globals.locale` and looks up the translation. Technical identifiers
 * appear literally and are the same in any language.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import './nph-field';
import { bothModes, field, group } from './nph-field.demo';
import { body, demo, header, index, list, matrix, note, section, source, table, text, usage } from '../../shared/docs/page';
import { sheetUseDontUse } from '../../shared/docs/sheet-lists';
import metadata from '../../shared/metadata/nph-field.json';

const meta: Meta = {
  title: 'Components/nph-field/Docs',
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
  group: 'group',
  relations: 'relations-and-context',
  anatomy: 'anatomy',
  accessibility: 'accessibility',
  examples: 'required-examples',
  references: 'references',
} as const;

/* Demo frame. Not a precedent for component CSS. */
const stack = 'display: flex; flex-direction: column; gap: var(--nph-space-stack);';

/** Reading page, assembled with the blocks from `src/shared/docs/page.ts`. */
export const Documentation: Story = {
  name: 'Documentation',
  render: (_args, context: GlobalsContext) => {
    const d = translations(localeOf(context)).fieldDocs;
    const pair = ([term, rule]: [string, string]) => [term, rule] as const;
    const modes = (content: () => TemplateResult): TemplateResult =>
      bothModes({ light: d.lightCaption as string, dark: d.darkCaption as string }, content);
    const cell = (required: boolean, info: boolean, error: boolean): TemplateResult =>
      field({
        label: d.email,
        required,
        info: info ? d.emailInfo : undefined,
        infoLabel: info ? d.emailInfoLabel : undefined,
        help: d.emailHelp,
        error: error ? d.emailError : undefined,
        value: error ? d.emailWrong : d.emailValue,
      });
    const row = (label: string, required: boolean, info: boolean) => ({
      label,
      cells: [cell(required, info, false), cell(required, info, true)],
    });

    return html`
      <main style=${body}>
        ${header('nph-field', d.summary)}
        ${matrix(
          d.matrixLabel,
          ['error=""', 'error="…"'],
          [
            row('required=false · info=false', false, false),
            row('required=true · info=false', true, false),
            row('required=false · info=true', false, true),
            row('required=true · info=true', true, true),
          ],
        )}
        ${note('info', d.derivedTitle, d.derivedText)}
        ${note('info', d.standInTitle, d.standInText)}
        ${index(d.onThisPage, [
          { id: SECTIONS.whenToUse, title: d.whenToUseTitle },
          { id: SECTIONS.api, title: d.apiTitle },
          { id: SECTIONS.usage, title: d.usageTitle },
          { id: SECTIONS.states, title: d.statesTitle },
          { id: SECTIONS.group, title: d.groupTitle },
          { id: SECTIONS.relations, title: d.relationsTitle },
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
            ${source(d.sourceLabel, d.sourceFrame)}
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
          html`${usage(d.usageHeader, d.usageMarkup, d.usageTag, ['nph-field', 'nph-input'], d.usageImport)}
            ${source(d.sourceLabel, d.sourceUsage)}`,
        )}

        ${section(
          SECTIONS.states,
          d.statesTitle,
          html`
            ${table(d.statesHeader, d.states.map(pair), 'text')}
            ${demo(
              html`<div style=${stack}>
                ${field({ label: d.email, help: d.emailHelp })}
                ${field({ label: d.email, help: d.emailHelp, error: d.emailError, value: d.emailWrong })}
                ${field({ label: d.bio, help: d.bioHelp, counter: d.counter })}
                ${field({ label: d.email, help: d.emailHelp, value: d.emailValue, disabled: true })}
              </div>`,
              d.statesCaption,
            )}
            ${source(d.sourceLabel, d.sourceFrame)}
          `,
        )}

        ${section(
          SECTIONS.group,
          d.groupTitle,
          html`
            ${text(d.groupText)}
            ${demo(
              html`<div style=${stack}>
                ${group({ kind: 'radio', label: d.payment, required: true, options: d.paymentOptions, checked: [0] })}
                ${group({ kind: 'checkbox', label: d.notifications, help: d.notificationsHelp, options: d.notificationsOptions })}
              </div>`,
              d.groupCaption,
            )}
            ${source(d.sourceLabel, d.sourceFrame)}
          `,
        )}

        ${section(
          SECTIONS.relations,
          d.relationsTitle,
          html`${list(d.relations)} ${source(d.sourceLabel, d.sourceFrame)}`,
        )}

        ${section(
          SECTIONS.anatomy,
          d.anatomyTitle,
          html`${table(d.anatomyHeader, d.anatomy.map(pair), 'text')} ${source(d.sourceLabel, d.sourceFrame)}`,
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
            ${demo(modes(() => field({ label: d.name, required: true, value: d.nameValue })), d.exampleRequired)}
            ${demo(modes(() => field({ label: d.email, help: d.emailHelp, error: d.emailError, value: d.emailWrong })), d.exampleError)}
            ${demo(
              modes(() => field({ label: d.email, info: d.emailInfo, infoLabel: d.emailInfoLabel, help: d.emailHelp })),
              d.exampleInfo,
            )}
            ${source(d.sourceLabel, d.sourceFrame)}
          `,
        )}

        ${section(SECTIONS.references, d.referencesTitle, list(d.references))}
      </main>
    `;
  },
};

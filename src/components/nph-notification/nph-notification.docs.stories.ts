/**
 * Reading page of `nph-notification`.
 *
 * It does not prove the contract — that is the role of `Components/nph-notification/Validation` and
 * of the tests. The content is transcribed from the documentation accepted in Figma (frame
 * `3442:10163`, set `3434:9035`), from the spec sheet (`ficha`) and from P108; nothing is decided
 * here. The page follows the order of the `nph-badge` page: it opens with the labelled matrix, and
 * the two lists of "When to use" are the ones of the sheet. The three required examples of the
 * documentation close it, each in light and dark mode.
 *
 * Deferred, not fulfilled here:
 * - the time bar is an `nph-skeleton` line until `nph-progress` is wired in (DSA-65);
 * - a text action that navigates would be an `nph-link`, which does not exist yet.
 *
 * The text comes from the language dictionary, in `.storybook/i18n/`, under the `notificationDocs`
 * key. The story is SINGLE: it reads `globals.locale` and looks up the translation. Technical
 * identifiers appear literally and are the same in any language.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import { STATIC_SEVERITIES, bothModes, column, formArea, notification, toastRegion } from './nph-notification.demo';
import { body, demo, header, index, list, matrix, note, section, source, table, text, usage } from '../../shared/docs/page';
import { sheetUseDontUse } from '../../shared/docs/sheet-lists';
import metadata from '../../shared/metadata/nph-notification.json';
import type { NphNotificationSeverity } from './nph-notification';

const meta: Meta = {
  title: 'Components/nph-notification/Docs',
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
  variants: 'variants',
  anatomy: 'anatomy',
  actions: 'actions-and-close',
  toast: 'toast-and-region',
  states: 'states',
  accessibility: 'accessibility',
  relations: 'relations-and-context',
  examples: 'required-examples',
  references: 'references',
} as const;

/** Reading page, assembled with the blocks from `src/shared/docs/page.ts`. */
export const Documentation: Story = {
  name: 'Documentation',
  render: (_args, context: GlobalsContext) => {
    const d = translations(localeOf(context)).notificationDocs;
    const pair = ([term, rule]: [string, string]) => [term, rule] as const;
    const modes = (content: () => TemplateResult): TemplateResult =>
      bothModes({ light: d.lightCaption as string, dark: d.darkCaption as string }, content);
    const sample = (severity: NphNotificationSeverity) => d.samples[severity as keyof typeof d.samples];
    const base = (severity: NphNotificationSeverity) => ({
      heading: sample(severity).heading,
      description: sample(severity).description,
      closeLabel: d.close,
      severity,
    });

    /* A cell takes the width of a toast, so every example in the matrix has the same room. */
    const cell = (content: TemplateResult): TemplateResult =>
      html`<div style="inline-size: var(--nph-notification-toast-width-max);">${content}</div>`;
    const matrixRows = STATIC_SEVERITIES.map((severity) => ({
      label: d.severityNames[severity as keyof typeof d.severityNames],
      cells: [
        cell(notification({ ...base(severity), layout: 'single-line', description: d.shortDescription })),
        cell(notification({ ...base(severity), emphasis: 'solid', layout: 'single-line', description: d.shortDescription })),
      ],
    }));

    const inlineError = (): TemplateResult =>
      formArea(notification({ ...base('error'), action: d.retry }), [d.fieldName, d.fieldEmail]);
    const successToast = (): TemplateResult =>
      notification({ ...base('success'), placement: 'toast', duration: 0 });
    const loadingToast = (): TemplateResult =>
      notification({ ...base('loading'), placement: 'toast', hideClose: true });
    const region = (): TemplateResult =>
      toastRegion(
        [loadingToast(), successToast(), notification({ ...base('error'), placement: 'toast', action: d.retry })],
        d.regionLabel,
      );
    const actions = (): TemplateResult =>
      column(
        STATIC_SEVERITIES.slice(0, 2).map((severity) =>
          notification({ ...base(severity), action: d.action, secondaryAction: d.secondaryAction }),
        ),
      );

    return html`
      <main style=${body}>
        ${header('nph-notification', d.summary)}
        ${matrix(d.matrixLabel, [d.subtleLabel, d.solidLabel], matrixRows)}
        ${note('info', d.derivedTitle, d.derivedText)}
        ${index(d.onThisPage, [
          { id: SECTIONS.whenToUse, title: d.whenToUseTitle },
          { id: SECTIONS.api, title: d.apiTitle },
          { id: SECTIONS.usage, title: d.usageTitle },
          { id: SECTIONS.variants, title: d.variantsTitle },
          { id: SECTIONS.anatomy, title: d.anatomyTitle },
          { id: SECTIONS.actions, title: d.actionsTitle },
          { id: SECTIONS.toast, title: d.toastTitle },
          { id: SECTIONS.states, title: d.statesTitle },
          { id: SECTIONS.accessibility, title: d.accessibilityTitle },
          { id: SECTIONS.relations, title: d.relationsTitle },
          { id: SECTIONS.examples, title: d.examplesTitle },
          { id: SECTIONS.references, title: d.referencesTitle },
        ])}

        ${section(
          SECTIONS.whenToUse,
          d.whenToUseTitle,
          html`
            ${text(d.purpose)}
            ${sheetUseDontUse(metadata, localeOf(context), d)}
            ${source(d.sourceLabel, d.sourceFigma)}
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
          html`${usage(d.usageHeader, d.usageMarkup, d.usageTag, ['nph-notification'], d.usageImport)}
            ${source(d.sourceLabel, d.sourceUsage)}`,
        )}

        ${section(
          SECTIONS.variants,
          d.variantsTitle,
          html`${table(d.variantsHeader, d.variants.map(pair), 'text')} ${source(d.sourceLabel, d.sourceFigma)}`,
        )}

        ${section(
          SECTIONS.anatomy,
          d.anatomyTitle,
          html`${table(d.anatomyHeader, d.anatomy.map(pair), 'text')} ${source(d.sourceLabel, d.sourceFigma)}`,
        )}

        ${section(
          SECTIONS.actions,
          d.actionsTitle,
          html`
            ${list(d.actionsList)}
            ${demo(modes(actions), d.actionsCaption)}
            ${source(d.sourceLabel, d.sourceFigma)}
          `,
        )}

        ${section(
          SECTIONS.toast,
          d.toastTitle,
          html`
            ${list(d.toastList)}
            ${demo(modes(region), d.regionCaption)}
            ${source(d.sourceLabel, d.sourceToast)}
          `,
        )}

        ${section(
          SECTIONS.states,
          d.statesTitle,
          html`${table(d.statesHeader, d.states.map(pair), 'text')} ${source(d.sourceLabel, d.sourceFigma)}`,
        )}

        ${section(
          SECTIONS.accessibility,
          d.accessibilityTitle,
          html`${table(d.accessibilityHeader, d.accessibility.map(pair), 'text')} ${source(d.sourceLabel, d.sourceAccessibility)}`,
        )}

        ${section(
          SECTIONS.relations,
          d.relationsTitle,
          html`${list(d.relations)} ${source(d.sourceLabel, d.sourceFigma)}`,
        )}

        ${section(
          SECTIONS.examples,
          d.examplesTitle,
          html`
            ${demo(modes(inlineError), d.exampleError)}
            ${demo(modes(successToast), d.exampleSuccess)}
            ${demo(modes(loadingToast), d.exampleLoading)}
            ${source(d.sourceLabel, d.sourceFigma)}
          `,
        )}

        ${section(SECTIONS.references, d.referencesTitle, list(d.references))}
      </main>
    `;
  },
};

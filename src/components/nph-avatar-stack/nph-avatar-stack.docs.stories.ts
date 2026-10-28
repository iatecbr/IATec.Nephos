/**
 * Reading page of `nph-avatar-stack`.
 *
 * It does not prove the contract — that is the role of `Components/nph-avatar-stack/Validation`
 * and of the tests. The content is transcribed from the frame accepted in Figma (`1579:46`), from
 * the decisions D1 to D3 of DSA-25, from the spec sheet (`ficha`) and from P78; nothing is decided
 * here. The page follows the order of the `nph-avatar` page: it opens with the labelled matrix,
 * and the two lists of "When to use" are the ones of the sheet. The three required examples of the
 * frame close it, each in light and dark mode.
 *
 * Deferred, not fulfilled here:
 * - the Usage section (P70) enters every Docs page, after API, in DSA-35.
 *
 * The text comes from the language dictionary, in `.storybook/i18n/`, under the
 * `avatarStackDocs` key. The story is SINGLE: it reads `globals.locale` and looks up the
 * translation. Technical identifiers appear literally and are the same in any language.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import './nph-avatar-stack';
import { inScheme, meetingParticipants, membersInList, stack, taskOwners } from './nph-avatar-stack.demo';
import type { Scheme } from './nph-avatar-stack.demo';
import { body, demo, header, index, list, matrix, note, section, source, table, text } from '../../shared/docs/page';
import { sheetUseDontUse } from '../../shared/docs/sheet-lists';
import metadata from '../../shared/metadata/nph-avatar-stack.json';

const meta: Meta = {
  title: 'Components/nph-avatar-stack/Docs',
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
  composition: 'composition',
  anatomy: 'anatomy',
  accessibility: 'accessibility',
  examples: 'examples',
  references: 'references',
} as const;

/* Demo frame. Not a precedent for component CSS. */
const modes = 'display: flex; flex-wrap: wrap; gap: var(--nph-space-stack);';

/** The same example in light and in dark mode, side by side. */
function bothModes(d: Record<string, unknown>, content: () => TemplateResult): TemplateResult {
  const schemes: Array<[Scheme, string]> = [
    ['light', d.lightCaption as string],
    ['dark', d.darkCaption as string],
  ];
  return html`<div style=${modes}>${schemes.map(([scheme, caption]) => inScheme(scheme, caption, content()))}</div>`;
}

const SIZES = ['sm', 'md', 'lg'] as const;

/** Reading page, built with the blocks of `src/shared/docs/page.ts`. */
export const Documentation: Story = {
  name: 'Documentation',
  render: (_args, context: GlobalsContext) => {
    const d = translations(localeOf(context)).avatarStackDocs;
    const pair = ([term, rule]: [string, string]) => [term, rule] as const;

    return html`
      <main style=${body}>
        ${header('nph-avatar-stack', d.summary)}
        ${matrix(
          d.matrixLabel,
          SIZES.map((size) => `size: ${size}`),
          [
            { label: 'count: 0', cells: SIZES.map((size) => stack(size, 3, 0, d.groupThree)) },
            { label: 'count: 3', cells: SIZES.map((size) => stack(size, 3, 3, d.groupThreeMore)) },
          ],
        )}
        ${note('info', d.derivedTitle, d.derivedText)}
        ${index(d.onThisPage, [
          { id: SECTIONS.whenToUse, title: d.whenToUseTitle },
          { id: SECTIONS.api, title: d.apiTitle },
          { id: SECTIONS.composition, title: d.compositionTitle },
          { id: SECTIONS.anatomy, title: d.anatomyTitle },
          { id: SECTIONS.accessibility, title: d.accessibilityTitle },
          { id: SECTIONS.examples, title: d.examplesTitle },
          { id: SECTIONS.references, title: d.referencesTitle },
        ])}

        ${section(
          SECTIONS.whenToUse,
          d.whenToUseTitle,
          html`
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
          SECTIONS.composition,
          d.compositionTitle,
          html`
            ${text(d.compositionText)}
            ${demo(
              html`<div style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--nph-space-section);">
                ${stack('md', 2, 0, d.groupTwo)} ${stack('md', 5, 0, d.groupFive)} ${stack('md', 5, 3, d.groupFiveMore)}
              </div>`,
              d.compositionCaption,
            )}
            ${table(d.compositionHeader, d.composition.map(pair), 'text')} ${source(d.sourceLabel, d.sourceComposition)}
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
            ${demo(bothModes(d, () => taskOwners(d.taskName, d.ownersLabel)), d.exampleOwners)}
            ${demo(bothModes(d, () => meetingParticipants(d.meetingName, d.participantsLabel)), d.exampleParticipants)}
            ${demo(bothModes(d, () => membersInList(d.teamName, d.membersLabel)), d.exampleMembers)}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(SECTIONS.references, d.referencesTitle, list(d.references))}
      </main>
    `;
  },
};

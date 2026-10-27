/**
 * Reading page of `nph-sidebar-item`, `nph-sidebar-subitem` and `nph-sidebar-rail-button`.
 *
 * It does not prove the contract — that is the role of
 * `Components/nph-sidebar-item/Validation` and of the tests. The content is transcribed from
 * the board accepted in Figma (`1366:2`, documentation `2723:460`, sets `2251:51271`,
 * `2251:51312` and `2251:51328`), from the spec sheets (`fichas/nph-sidebar-item.md`,
 * `fichas/nph-sidebar-subitem.md` and `fichas/nph-sidebar-rail-button.md`) and from P98;
 * nothing is decided here. The page follows the order of the `nph-badge` page: it opens with
 * the labelled matrix, and the two lists of "When to use" are the ones of the item sheet.
 * Then Types and States, the sections of the pieces themselves — Subitem, Rail button, More
 * actions and tooltip, Relations and context — and the three required examples of the board,
 * each in light and dark mode.
 *
 * Deferred, not fulfilled here, as on every Docs page:
 * - the Usage section (P70) enters every Docs page, after API, in DSA-35;
 * - the "When to use" lists still come from the dictionary, and a test checks that they equal
 *   the sheet's; reading them from the Metadata is P71, in DSA-34;
 * - `text/body-lg` in `text` and `list` (DSA-33).
 *
 * The text comes from the language dictionary, in `.storybook/i18n/`, under the
 * `sidebarItemDocs` key. The story is SINGLE: it reads `globals.locale` and looks up the
 * translation. Technical identifiers appear literally and are the same in any language.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import type { NphDropdownMenuEntry } from '../nph-dropdown-menu/nph-dropdown-menu';
import { bothModes, collapsedMenu, mainMenu, openGroup, panel } from './nph-sidebar-item.demo';
import type { MenuText } from './nph-sidebar-item.demo';
import { body, demo, header, index, list, matrix, note, section, source, table, text, useDontUse } from '../../shared/docs/page';

const meta: Meta = {
  title: 'Components/nph-sidebar-item/Docs',
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
  types: 'types',
  states: 'states',
  subitem: 'subitem',
  railButton: 'rail-button',
  moreActions: 'tooltip-and-more-actions',
  relations: 'relations-and-context',
  anatomy: 'anatomy',
  accessibility: 'accessibility',
  examples: 'required-examples',
  references: 'references',
} as const;

/* Demo frame. Not a precedent for component CSS. */
const cellWidth = 'display: block; inline-size: var(--nph-layout-sidebar-expanded);';
const row = 'display: flex; flex-wrap: wrap; align-items: center; gap: var(--nph-space-inline);';

/** Reading page, assembled with the blocks from `src/shared/docs/page.ts`. */
export const Documentation: Story = {
  name: 'Documentation',
  render: (_args, context: GlobalsContext) => {
    const d = translations(localeOf(context)).sidebarItemDocs;
    const pair = ([term, rule]: [string, string]) => [term, rule] as const;
    const captions = { light: d.lightCaption, dark: d.darkCaption };
    const menu: MenuText = { pages: d.pages, group: d.group, subitems: d.subitems };
    const [home, inbox] = d.pages as MenuText['pages'];
    const actions: NphDropdownMenuEntry[] = [
      { value: 'rename', text: d.actions[0], icon: 'pen-to-square' },
      { value: 'pin', text: d.actions[1], icon: 'thumbtack' },
      { type: 'separator' },
      { value: 'remove', text: d.actions[2], icon: 'trash-can', severity: 'destructive' },
    ];
    const item = (attributes: { group?: boolean; counter?: number; expanded?: boolean; active?: boolean; disabled?: boolean }): TemplateResult =>
      html`<span style=${cellWidth}
        ><nph-sidebar-item
          type=${attributes.group ? 'group' : 'link'}
          label=${attributes.group ? d.group.label : (inbox?.label ?? '')}
          icon=${attributes.group ? d.group.icon : (inbox?.icon ?? '')}
          href=${attributes.group ? '' : '#page'}
          .counter=${attributes.counter ?? null}
          ?expanded=${attributes.expanded ?? false}
          ?active=${attributes.active ?? false}
          ?disabled=${attributes.disabled ?? false}
        ></nph-sidebar-item
      ></span>`;
    const rail = (counter: number | null, state: { active?: boolean; disabled?: boolean } = {}): TemplateResult =>
      html`<nph-sidebar-rail-button
        label=${inbox?.label ?? ''}
        icon=${inbox?.icon ?? ''}
        href="#page"
        .counter=${counter}
        ?active=${state.active ?? false}
        ?disabled=${state.disabled ?? false}
      ></nph-sidebar-rail-button>`;

    return html`
      <main style=${body}>
        ${header('nph-sidebar-item', d.summary)}
        ${matrix(
          d.matrixLabel,
          ['state: rest', 'state: active', 'state: disabled'],
          [
            { label: 'type: link', cells: [item({}), item({ active: true }), item({ disabled: true })] },
            { label: 'type: counter', cells: [item({ counter: 12 }), item({ counter: 12, active: true }), item({ counter: 12, disabled: true })] },
            { label: 'type: group-closed', cells: [item({ group: true }), html``, item({ group: true, disabled: true })] },
            { label: 'type: group-open', cells: [item({ group: true, expanded: true }), html``, item({ group: true, expanded: true, disabled: true })] },
          ],
        )}
        ${note('info', d.derivedTitle, d.derivedText)}
        ${index(d.onThisPage, [
          { id: SECTIONS.whenToUse, title: d.whenToUseTitle },
          { id: SECTIONS.api, title: d.apiTitle },
          { id: SECTIONS.types, title: d.typesTitle },
          { id: SECTIONS.states, title: d.statesTitle },
          { id: SECTIONS.subitem, title: d.subitemTitle },
          { id: SECTIONS.railButton, title: d.railTitle },
          { id: SECTIONS.moreActions, title: d.moreActionsTitle },
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
            ${useDontUse({ title: d.whenToUseTitle, items: d.whenToUse }, { title: d.whenNotToUseTitle, items: d.whenNotToUse })}
            ${source(d.sourceLabel, d.sourceFrame)}
          `,
        )}

        ${section(
          SECTIONS.api,
          d.apiTitle,
          html`${table(d.apiHeader, d.api.map(pair))}
            ${note('warning', d.invalidTitle, d.invalidText)}
            ${source(d.sourceLabel, d.sourceApi)}`,
        )}

        ${section(
          SECTIONS.types,
          d.typesTitle,
          html`
            ${demo(
              panel(html`${item({})} ${item({ counter: 12 })} ${item({ group: true })} ${item({ group: true, expanded: true })}`),
              d.typesCaption,
            )}
            ${table(d.typesHeader, d.types.map(pair), 'code')}
            ${source(d.sourceLabel, d.sourceFrame)}
          `,
        )}

        ${section(
          SECTIONS.states,
          d.statesTitle,
          html`
            ${demo(panel(html`${item({})} ${item({ active: true })} ${item({ disabled: true })}`), d.statesCaption)}
            ${table(d.statesHeader, d.states.map(pair), 'code')}
            ${source(d.sourceLabel, d.sourceFrame)}
          `,
        )}

        ${section(
          SECTIONS.subitem,
          d.subitemTitle,
          html`
            ${text(d.subitemText)}
            ${demo(
              panel(html`${d.subitems.map(
                (label: string, position: number) =>
                  html`<nph-sidebar-subitem label=${label} href="#sub" ?active=${position === 0} ?options=${position === d.subitems.length - 1}></nph-sidebar-subitem>`,
              )}`),
              d.subitemCaption,
            )}
            ${table(d.apiHeader, d.subitemApi.map(pair))}
            ${source(d.sourceLabel, d.sourceSubitem)}
          `,
        )}

        ${section(
          SECTIONS.railButton,
          d.railTitle,
          html`
            ${text(d.railText)}
            ${demo(html`<div style=${row}>${rail(null)} ${rail(null, { active: true })} ${rail(3)} ${rail(3, { active: true })} ${rail(null, { disabled: true })}</div>`, d.railCaption)}
            ${table(d.apiHeader, d.railApi.map(pair))}
            ${source(d.sourceLabel, d.sourceRail)}
          `,
        )}

        ${section(
          SECTIONS.moreActions,
          d.moreActionsTitle,
          html`
            ${text(d.moreActionsText)}
            ${demo(
              panel(html`<nph-sidebar-item label=${d.longLabel} icon="folder" href="#long" tooltip=${d.longLabel}></nph-sidebar-item>
                <nph-sidebar-item
                  label=${home?.label ?? ''}
                  icon=${home?.icon ?? ''}
                  href="#home"
                  .actions=${actions}
                  actions-label=${d.actionsLabel}
                ></nph-sidebar-item>`),
              d.moreActionsCaption,
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
            ${demo(bothModes(captions, () => mainMenu(menu)), d.exampleMain)}
            ${demo(bothModes(captions, () => openGroup(menu)), d.exampleGroup)}
            ${demo(bothModes(captions, () => collapsedMenu(menu)), d.exampleCollapsed)}
            ${source(d.sourceLabel, d.sourceFrame)}
          `,
        )}

        ${section(SECTIONS.references, d.referencesTitle, list(d.references))}
      </main>
    `;
  },
};

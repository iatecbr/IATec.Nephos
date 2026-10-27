/**
 * VALIDATION stories of `nph-sidebar-item`, `nph-sidebar-subitem` and
 * `nph-sidebar-rail-button`.
 *
 * They prove the contract accepted in Figma (board `1366:2`, documentation `2723:460`, sets
 * `2251:51271`, `2251:51312` and `2251:51328`), the pending decisions D-1 to D-4 in their
 * default and P98: the `type` × `state` matrix of the item; the subitem with and without
 * options; the rail button with and without the counter; the balloon and more actions; the
 * invalid input; and the three required examples of the board — main menu with current page
 * and counter, group open with subitems, and collapsed menu with rail buttons. The subitem
 * and the rail button have no page of their own: their Validation is here (P98, as the
 * `Option` story of `nph-select`, P91). Every story shows the same pieces in light and in
 * dark mode, in the same story, through `data-nph-color-scheme` on the frame (P20, P67).
 *
 * Hover and focus are interaction states: they show up by moving the mouse over a line and
 * pressing Tab; the component tests measure them. Each page opens with what it proves, from
 * the dictionary (`validationPages.claims`). The example text and the captions come from the
 * language dictionary, under the key `sidebarItemValidation` (`docs/i18n.md`, "Storybook");
 * the row and column names of the matrices are the technical attributes, the same in any
 * language.
 */
import { html, nothing } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { translations } from '../../../.storybook/i18n/index.js';
import { matrix } from '../../shared/docs/page';
import { localeOf, validationPage, validationTitle } from '../../shared/docs/validation';
import type { GlobalsContext } from '../../shared/docs/validation';
import type { NphDropdownMenuEntry } from '../nph-dropdown-menu/nph-dropdown-menu';
import { collapsedMenu, inScheme, mainMenu, openGroup, panel } from './nph-sidebar-item.demo';
import type { MenuText, Scheme } from './nph-sidebar-item.demo';

const meta: Meta = {
  title: 'Components/nph-sidebar-item/Validation',
};

export default meta;

type Story = StoryObj;

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined) {
  return translations(localeOf(context)).sidebarItemValidation;
}

/* Demonstration frame. Not a precedent for component CSS. */
const stack = 'display: flex; flex-direction: column; gap: var(--nph-space-stack);';
const modesFrame = 'display: flex; flex-wrap: wrap; align-items: flex-start; gap: var(--nph-space-stack);';
/* Room for a line inside a matrix cell: the width the item fills. */
const cellWidth = 'display: block; inline-size: var(--nph-layout-sidebar-expanded);';

const page = (storyId: string) => ({
  piece: 'nph-sidebar-item',
  storyId: `components-nph-sidebar-item-validation--${storyId}`,
});

/** What a story draws in one mode; the caption names the mode and, when given, the example. */
type ModeContent = (title: string) => TemplateResult;

/** The same demonstration in both modes, each with its caption. */
function inBothModes(context: GlobalsContext | undefined, storyId: string, content: ModeContent, name?: string): TemplateResult {
  const v = t(context);
  const modes: Array<[Scheme, string]> = [
    ['light', v.lightCaption],
    ['dark', v.darkCaption],
  ];
  const title = validationTitle(context, 'nph-sidebar-item', page(storyId).storyId);
  return html`<div style=${modesFrame}>
    ${modes.map(([scheme, caption]) => {
      const label = name === undefined ? caption : `${name} · ${caption}`;
      return inScheme(scheme, label, content(`${title} · ${label}`));
    })}
  </div>`;
}

/** The text of the examples, from the dictionary. */
function menuText(context: GlobalsContext | undefined): MenuText {
  const v = t(context);
  return { pages: v.pages, group: v.group, subitems: v.subitems };
}

/** The actions of more actions, from the dictionary. */
function actions(context: GlobalsContext | undefined): NphDropdownMenuEntry[] {
  const v = t(context);
  return [
    { value: 'rename', text: v.actions[0], icon: 'pen-to-square' },
    { value: 'pin', text: v.actions[1], icon: 'thumbtack' },
    { type: 'separator' },
    { value: 'remove', text: v.actions[2], icon: 'trash-can', severity: 'destructive' },
  ];
}

interface ItemCell {
  type?: 'link' | 'group';
  counter?: number;
  expanded?: boolean;
  active?: boolean;
  disabled?: boolean;
}

/** `type` × `state`: link, counter, group closed and open, at rest, active and disabled. */
export const Matrix: Story = {
  name: 'Matrix',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const [inbox] = v.pages as MenuText['pages'];
    const cell = (state: ItemCell): TemplateResult =>
      html`<span style=${cellWidth}
        ><nph-sidebar-item
          type=${state.type ?? 'link'}
          label=${state.type === 'group' ? v.group.label : (inbox?.label ?? '')}
          icon=${state.type === 'group' ? v.group.icon : (inbox?.icon ?? '')}
          href=${state.type === 'group' ? nothing : '#page'}
          .counter=${state.counter ?? null}
          ?expanded=${state.expanded ?? false}
          ?active=${state.active ?? false}
          ?disabled=${state.disabled ?? false}
        ></nph-sidebar-item
      ></span>`;
    /* Active does not exist in a group (evidence, Properties): the cell stays empty. */
    const rows: Array<[string, ItemCell, boolean]> = [
      ['type: link', {}, true],
      ['type: counter', { counter: 12 }, true],
      ['type: group-closed', { type: 'group' }, false],
      ['type: group-open', { type: 'group', expanded: true }, false],
    ];
    return validationPage(
      context,
      page('matrix'),
      inBothModes(context, 'matrix', (label) =>
        matrix(
          label,
          ['state: rest', 'state: active', 'state: disabled'],
          rows.map(([name, state, canBeActive]) => ({
            label: name,
            cells: [cell(state), canBeActive ? cell({ ...state, active: true }) : html``, cell({ ...state, disabled: true })],
          })),
        ),
      ),
    );
  },
};

/** The subitem: options no and yes, at rest, active and disabled; a long label with an ellipsis. */
export const Subitem: Story = {
  name: 'Subitem',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const [first] = v.subitems as string[];
    const cell = (options: boolean, state: { active?: boolean; disabled?: boolean } = {}): TemplateResult =>
      html`<span style=${cellWidth}
        ><nph-sidebar-subitem
          label=${first ?? ''}
          href="#sub"
          ?options=${options}
          ?active=${state.active ?? false}
          ?disabled=${state.disabled ?? false}
        ></nph-sidebar-subitem
      ></span>`;
    return validationPage(
      context,
      page('subitem'),
      inBothModes(context, 'subitem', (label) =>
        matrix(
          label,
          ['state: rest', 'state: active', 'state: disabled'],
          [false, true].map((options) => ({
            label: `options: ${options ? 'yes' : 'no'}`,
            cells: [cell(options), cell(options, { active: true }), cell(options, { disabled: true })],
          })),
        ),
      ),
    );
  },
};

/** The rail button: counter off and on, at rest, active and disabled (D-1, D-2). */
export const RailButton: Story = {
  name: 'Rail button',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const [, inbox] = v.pages as MenuText['pages'];
    const cell = (counter: number | null, state: { active?: boolean; disabled?: boolean } = {}): TemplateResult =>
      html`<nph-sidebar-rail-button
        label=${inbox?.label ?? ''}
        icon=${inbox?.icon ?? ''}
        href="#page"
        .counter=${counter}
        ?active=${state.active ?? false}
        ?disabled=${state.disabled ?? false}
      ></nph-sidebar-rail-button>`;
    return validationPage(
      context,
      page('rail-button'),
      inBothModes(context, 'rail-button', (label) =>
        matrix(
          label,
          ['state: rest', 'state: active', 'state: disabled'],
          [null, 3].map((counter) => ({
            label: `counter: ${counter === null ? 'off' : 'on'}`,
            cells: [cell(counter), cell(counter, { active: true }), cell(counter, { disabled: true })],
          })),
        ),
      ),
    );
  },
};

/** The balloon with the full name of a cut label, and more actions with its menu, on hover and focus. */
export const TooltipAndMoreActions: Story = {
  name: 'Tooltip and more actions',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const [home, inbox] = v.pages as MenuText['pages'];
    return validationPage(
      context,
      page('tooltip-and-more-actions'),
      inBothModes(context, 'tooltip-and-more-actions', () =>
        panel(html`<nph-sidebar-item label=${v.longLabel} icon="folder" href="#long" tooltip=${v.longLabel}></nph-sidebar-item>
          <nph-sidebar-item
            label=${inbox?.label ?? ''}
            icon=${inbox?.icon ?? ''}
            href="#inbox"
            .counter=${12}
            .actions=${actions(context)}
            actions-label=${v.actionsLabel}
          ></nph-sidebar-item>
          <nph-sidebar-subitem label=${v.longLabel} href="#long-sub" tooltip=${v.longLabel}></nph-sidebar-subitem>
          <nph-sidebar-rail-button label=${home?.label ?? ''} icon=${home?.icon ?? ''} href="#home"></nph-sidebar-rail-button>`),
      ),
    );
  },
};

/** Invalid input draws nothing: an active group, a counter with text, a link without href and a rail button without label. */
export const InvalidInput: Story = {
  name: 'Invalid input',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const [home] = v.pages as MenuText['pages'];
    return validationPage(
      context,
      page('invalid-input'),
      inBothModes(context, 'invalid-input', (label) =>
        matrix(label, [], [
          {
            label: 'type: group · active',
            cells: [html`<nph-sidebar-item type="group" label=${v.group.label} icon=${v.group.icon} active></nph-sidebar-item>`],
          },
          {
            label: 'counter: new',
            cells: [html`<nph-sidebar-item label=${home?.label ?? ''} icon=${home?.icon ?? ''} href="#page" counter="new"></nph-sidebar-item>`],
          },
          {
            label: 'href: —',
            cells: [html`<nph-sidebar-subitem label=${v.subitems[0]}></nph-sidebar-subitem>`],
          },
          {
            label: 'label: —',
            cells: [html`<nph-sidebar-rail-button icon=${home?.icon ?? ''} href="#page"></nph-sidebar-rail-button>`],
          },
        ]),
      ),
    );
  },
};

/** The three required examples of the accepted board, each in light and dark mode. */
export const Examples: Story = {
  name: 'Examples',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const text = menuText(context);
    return validationPage(
      context,
      page('examples'),
      html`<div style=${stack}>
        ${inBothModes(context, 'examples', () => mainMenu(text), v.exampleMain)}
        ${inBothModes(context, 'examples', () => openGroup(text), v.exampleGroup)}
        ${inBothModes(context, 'examples', () => collapsedMenu(text), v.exampleCollapsed)}
      </div>`,
    );
  },
};

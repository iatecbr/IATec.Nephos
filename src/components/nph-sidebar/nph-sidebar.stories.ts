/**
 * VALIDATION stories of `nph-sidebar`.
 *
 * They prove the contract accepted in Figma (documentation frame `4633:27036`, sets
 * `4605:9647`, `4605:9612`, `4605:9599`, `4605:9589` and `4605:9594`) and P116: the three modes
 * (expanded, collapsed, mobile) and the two states (ready, loading); the flyout panel of the
 * second level of the collapsed menu and of the third level, next to the opener; the two Figma
 * booleans, the collapse button and the corner button; the short messages in place of the list;
 * the invalid input; and the four required examples of the documentation — a product with many
 * areas, the list arriving, the phone and the collapsed menu with its flyout. Every story shows
 * the same menu in light and in dark mode, in the same story, through `data-nph-color-scheme` on
 * the frame (P20, P67).
 *
 * The flyout opens on a click: the stories that show it open press the opener after they draw,
 * as a person would. The mobile menu is a modal `<dialog>`: it is drawn closed, with the button
 * of the product that opens it, and the `Mobile` story opens the light one, alone, when it plays.
 * Hover and focus are interaction states: they show up by moving the mouse and pressing Tab; the
 * component tests measure them. Each page opens with what it proves, from the dictionary
 * (`validationPages.claims`). The text comes from the language dictionary, under the key
 * `sidebarValidation` (`docs/i18n.md`, "Storybook"); the row and column names of the matrices
 * are the technical attributes, the same in any language.
 *
 * The `Brands` page proves the seven brands of P20 in light and dark, each frame with
 * `data-nph-brand` and `data-nph-color-scheme` on the same element (DSA-36).
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { translations } from '../../../.storybook/i18n/index.js';
import { brandFrames } from '../../shared/docs/brands';
import { matrix } from '../../shared/docs/page';
import { localeOf, validationPage, validationTitle } from '../../shared/docs/validation';
import type { GlobalsContext } from '../../shared/docs/validation';
import { collapsedMenu, expandedFlyout, inScheme, loadingMenu, mainMenu, phone, sidebar } from './nph-sidebar.demo';
import type { Scheme, SidebarText } from './nph-sidebar.demo';

const meta: Meta = {
  title: 'Components/nph-sidebar/Validation',
};

export default meta;

type Story = StoryObj;

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined) {
  return translations(localeOf(context)).sidebarValidation;
}

/* Demonstration frame. Not a precedent for component CSS. */
const stack = 'display: flex; flex-direction: column; gap: var(--nph-space-stack);';
const row = 'display: flex; flex-wrap: wrap; align-items: flex-start; gap: var(--nph-space-stack);';
/* Smaller columns for the cells of a matrix. */
const cellHeight = 'calc(var(--nph-layout-sidebar-expanded) * 1.5)';

const page = (storyId: string) => ({
  piece: 'nph-sidebar',
  storyId: `components-nph-sidebar-validation--${storyId}`,
});

/** The same demonstration in both modes, each with its caption. */
function inBothSchemes(context: GlobalsContext | undefined, storyId: string, content: () => TemplateResult, name?: string): TemplateResult {
  const v = t(context);
  const schemes: Array<[Scheme, string]> = [
    ['light', v.lightCaption],
    ['dark', v.darkCaption],
  ];
  const title = validationTitle(context, 'nph-sidebar', page(storyId).storyId);
  return html`<div style=${row}>
    ${schemes.map(([scheme, caption]) => inScheme(scheme, name === undefined ? `${title} · ${caption}` : `${name} · ${caption}`, content()))}
  </div>`;
}

/** The text of the demonstrations, from the dictionary. */
function text(context: GlobalsContext | undefined): SidebarText {
  return t(context) as SidebarText;
}

/** The expanded and the collapsed menu, ready, with the current page, a counter, an open group and a disabled page. */
export const Modes: Story = {
  name: 'Modes',
  render: (_args, context: GlobalsContext) => {
    const s = text(context);
    return validationPage(
      context,
      page('modes'),
      inBothSchemes(context, 'modes', () => html`<div style=${row}>${mainMenu(s)} ${sidebar(s, { mode: 'collapsed' })}</div>`),
    );
  },
};

/**
 * The phone: the button of the product opens the menu over the screen, with the scrim behind and
 * the close button in place of the collapse button. The story opens the light one, alone, when it
 * plays; Esc, the close button and the scrim close it and give the focus back to the button.
 */
export const Mobile: Story = {
  name: 'Mobile',
  render: (_args, context: GlobalsContext) => {
    const s = text(context);
    return validationPage(context, page('mobile'), inBothSchemes(context, 'mobile', () => phone(s)));
  },
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('figure[data-nph-color-scheme="light"] nph-button') as HTMLElement | null;
    await (button as (HTMLElement & { updateComplete?: Promise<unknown> }) | null)?.updateComplete;
    (button?.shadowRoot?.querySelector('button') as HTMLButtonElement | null)?.click();
  },
};

/** The state `loading`: nph-skeleton rows in place of the items, expanded and collapsed; the search and the corner button stay. */
export const Loading: Story = {
  name: 'Loading',
  render: (_args, context: GlobalsContext) => {
    const s = text(context);
    return validationPage(
      context,
      page('loading'),
      inBothSchemes(context, 'loading', () => html`<div style=${row}>${loadingMenu(s)} ${sidebar(s, { mode: 'collapsed', loading: true })}</div>`),
    );
  },
};

/** The flyout panel: next to the rail button for the second level, next to the option for the third, and next to the subitem in the expanded menu. */
export const Flyout: Story = {
  name: 'Flyout',
  render: (_args, context: GlobalsContext) => {
    const s = text(context);
    const v = t(context);
    return validationPage(
      context,
      page('flyout'),
      html`<div style=${stack}>
        ${inBothSchemes(context, 'flyout', () => collapsedMenu(s), v.flyoutCollapsed)}
        ${inBothSchemes(context, 'flyout', () => expandedFlyout(s), v.flyoutExpanded)}
      </div>`,
    );
  },
};

/** The two Figma booleans, the collapse button and the corner button, on and off, in the expanded menu. */
export const Parts: Story = {
  name: 'Parts',
  render: (_args, context: GlobalsContext) => {
    const s = text(context);
    const cell = (hideCollapseButton: boolean, hideCornerButton: boolean): TemplateResult =>
      sidebar(s, { hideCollapseButton, hideCornerButton, groupOpen: false, height: cellHeight });
    return validationPage(
      context,
      page('parts'),
      inBothSchemes(context, 'parts', () =>
        matrix(
          t(context).partsLabel,
          ['hide-corner-button: no', 'hide-corner-button: yes'],
          [false, true].map((hideCollapse) => ({
            label: `hide-collapse-button: ${hideCollapse ? 'yes' : 'no'}`,
            cells: [cell(hideCollapse, false), cell(hideCollapse, true)],
          })),
        ),
      ),
    );
  },
};

/** The short message in place of the list: no items, and an error; the product provides and translates both. */
export const Messages: Story = {
  name: 'Messages',
  render: (_args, context: GlobalsContext) => {
    const s = text(context);
    return validationPage(
      context,
      page('messages'),
      inBothSchemes(
        context,
        'messages',
        () => html`<div style=${row}>
          ${sidebar(s, { items: [], emptyText: s.emptyText, height: cellHeight })} ${sidebar(s, { errorText: s.errorText, height: cellHeight })}
        </div>`,
      ),
    );
  },
};

/** Invalid input: a mode outside the three draws nothing, and an entry that cannot be drawn is left out. */
export const InvalidInput: Story = {
  name: 'Invalid input',
  render: (_args, context: GlobalsContext) => {
    const s = text(context);
    const withBadEntries = [
      { label: s.home, icon: 'house' },
      { label: s.inbox, icon: 'not-an-icon', href: '#page-2' },
      { type: 'group', label: s.reports, icon: 'clipboard', children: [] },
      { label: s.calendar, icon: 'calendar-days', href: '#page-3' },
    ] as never;
    return validationPage(
      context,
      page('invalid-input'),
      inBothSchemes(context, 'invalid-input', () =>
        matrix(t(context).invalidLabel, [], [
          { label: 'mode: wide', cells: [sidebar(s, { mode: 'wide' as never, height: cellHeight })] },
          { label: 'items: 3 of 4 cannot be drawn', cells: [sidebar(s, { items: withBadEntries, height: cellHeight })] },
        ]),
      ),
    );
  },
};

/** The four required examples of the documentation, each in light and dark mode. */
export const Examples: Story = {
  name: 'Examples',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const s = text(context);
    return validationPage(
      context,
      page('examples'),
      html`<div style=${stack}>
        ${inBothSchemes(context, 'examples', () => mainMenu(s), v.exampleMain)}
        ${inBothSchemes(context, 'examples', () => loadingMenu(s), v.exampleLoading)}
        ${inBothSchemes(context, 'examples', () => phone(s), v.examplePhone)}
        ${inBothSchemes(context, 'examples', () => collapsedMenu(s), v.exampleFlyout)}
      </div>`,
    );
  },
};

/** The seven brands in light and dark: the current page, the counter, the open group and the active rail button follow the brand of the frame, and so does the focus on Tab. */
export const Brands: Story = {
  name: 'Brands',
  render: (_args, context: GlobalsContext) => {
    const s = text(context);
    return validationPage(
      context,
      page('brands'),
      brandFrames(
        validationTitle(context, 'nph-sidebar', page('brands').storyId),
        () => html`${sidebar(s, { height: cellHeight })} ${sidebar(s, { mode: 'collapsed', height: cellHeight })}`,
      ),
    );
  },
};


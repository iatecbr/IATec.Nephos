/**
 * VALIDATION stories of `nph-accordion` and `nph-accordion-item`.
 *
 * They prove the contract accepted in Figma (documentation frame `7428:43770`, accordion set `7227:26169`, item set
 * `7227:26332`, start set `7227:26993`) and P136: the three appearances; the multiple and the single expansion; the
 * three sizes; the eight start types, one per list; the tag, the end status and the short description; the
 * indicator at the end and at the start, and the indent of the content; the disabled item, the locked section and
 * the open item that cannot close; the right-to-left writing; the event; and the three required examples in light
 * and dark mode, in the same story. Each page opens with what it proves, and the matrix names its rows by
 * attribute. All visible text, including the titles and the content, comes from the language dictionary, under the
 * `accordionValidation` and `validationPages` keys (`docs/i18n.md`, "Storybook").
 *
 * The piece has no reading page in Storybook yet: its contract is in `fichas/nph-accordion.md`, and these stories
 * point to it. The stories that show a tag, a start status or a description carry `NAME_EXCEPTION`, and the one that
 * shows a disabled item carries `DISABLED_EXCEPTION`; both are explained where they are defined.
 *
 * Hover and focus are interaction states: they show up by moving the mouse over a trigger and by pressing Tab, and
 * the tests prove their colors and rings.
 */
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { translations } from '../../../.storybook/i18n/index.js';
import { brandFrames } from '../../shared/docs/brands';
import { matrix } from '../../shared/docs/page';
import { localeOf, validationPage, validationTitle } from '../../shared/docs/validation';
import type { GlobalsContext } from '../../shared/docs/validation';
import './nph-accordion';
import { DISABLED_EXCEPTION, NAME_EXCEPTION, accordion, bothModes, examples, interactive, plain, startMedia } from './nph-accordion.demo';
import type { AccordionTexts } from './nph-accordion.demo';

const meta: Meta = {
  title: 'Components/nph-accordion/Validation',
  parameters: NAME_EXCEPTION,
};

export default meta;

type Story = StoryObj;

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined) {
  return translations(localeOf(context)).accordionValidation as unknown as AccordionTexts & Record<string, unknown>;
}

const page = (storyId: string) => ({ piece: 'nph-accordion', storyId: `components-nph-accordion-validation--${storyId}`, sheet: true });

const title = (context: GlobalsContext, storyId: string) => validationTitle(context, 'nph-accordion', page(storyId).storyId);

/** The three appearances: grouped with the divider, separated in blocks with space, flush with the divider and no container. */
export const Appearances: Story = {
  name: 'Appearances',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('appearances'),
      matrix(title(context, 'appearances'), [], [
        { label: 'appearance: grouped', cells: [plain(v, { appearance: 'grouped' })] },
        { label: 'appearance: separated', cells: [plain(v, { appearance: 'separated' })] },
        { label: 'appearance: flush', cells: [plain(v, { appearance: 'flush' })] },
      ]),
    );
  },
};

/** The two expansions: several sections open at once, and one at a time, where the open one can also close. */
export const Expansion: Story = {
  name: 'Expansion',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('expansion'),
      matrix(title(context, 'expansion'), [], [
        {
          label: 'expansion: multiple · two items open',
          cells: [
            accordion(
              [{ label: v.sectionOne, open: true }, { label: v.sectionTwo, open: true }, { label: v.sectionThree }],
              [v.bodyOne, v.bodyTwo, v.bodyThree],
              { expansion: 'multiple' },
            ),
          ],
        },
        { label: 'expansion: single · one item open', cells: [plain(v, { expansion: 'single' })] },
        { label: 'expansion: single · all closed', cells: [plain(v, { expansion: 'single' }, {}, false)] },
      ]),
    );
  },
};

/** The three sizes: they change the minimum height of every trigger and the size of the start media; the large one changes the title. */
export const Sizes: Story = {
  name: 'Sizes',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const extra = { description: v.shortSupport, start: 'tile', icon: 'folder' } as const;
    return validationPage(
      context,
      page('sizes'),
      matrix(title(context, 'sizes'), [], [
        { label: 'size: compact', cells: [plain(v, { size: 'compact', appearance: 'flush' }, extra)] },
        { label: 'size: default', cells: [plain(v, { size: 'default', appearance: 'flush' }, extra)] },
        { label: 'size: large', cells: [plain(v, { size: 'large', appearance: 'flush' }, extra)] },
      ]),
    );
  },
};

/** The eight start types, one type per list: icon, tile, avatar, image and the four status icons, in the three sizes. */
export const Start: Story = {
  name: 'Start',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('start'),
      matrix(title(context, 'start'), [], [
        ...startMedia(v, 'default').map(({ label, cell }) => ({ label: `${label} · size: default`, cells: [cell] })),
        ...startMedia(v, 'compact')
          .filter((_, index) => index === 1 || index === 2 || index === 4)
          .map(({ label, cell }) => ({ label: `${label} · size: compact`, cells: [cell] })),
        ...startMedia(v, 'large')
          .filter((_, index) => index === 1 || index === 2 || index === 4)
          .map(({ label, cell }) => ({ label: `${label} · size: large`, cells: [cell] })),
      ]),
    );
  },
};

/** What the trigger turns on: the tag, the end status, the short description, and a long title that wraps and keeps the tag centered. */
export const Parts: Story = {
  name: 'Parts',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const bodies = [v.bodyOne, v.bodyTwo, v.bodyThree];
    return validationPage(
      context,
      page('parts'),
      matrix(title(context, 'parts'), [], [
        { label: 'tag: on', cells: [accordion([{ label: v.sectionOne, tag: v.tagNew, open: true }], bodies, { appearance: 'flush' })] },
        {
          label: 'description: on · status: on',
          cells: [
            accordion(
              [
                { label: v.sectionOne, description: v.shortSupport, status: 'success', statusLabel: v.statusDone },
                { label: v.sectionTwo, description: v.shortSupport, status: 'warning', statusLabel: v.statusAttention },
                { label: v.sectionThree, description: v.shortSupport, status: 'error', statusLabel: v.statusLate },
                { label: v.sectionOne, description: v.shortSupport, status: 'pending', statusLabel: v.statusPending },
              ],
              bodies,
              { appearance: 'flush' },
            ),
          ],
        },
        {
          label: 'tag: on · description: on · status: on · start: tile',
          cells: [
            accordion(
              [
                {
                  label: v.sectionOne,
                  description: v.shortSupport,
                  tag: v.tagPro,
                  status: 'success',
                  statusLabel: v.statusDone,
                  start: 'tile',
                  icon: 'folder',
                },
              ],
              bodies,
              { appearance: 'flush' },
            ),
          ],
        },
        {
          label: 'label: long',
          cells: [
            accordion(
              [{ label: v.longTitle, description: v.longSupport, tag: v.tagPro, start: 'avatar', status: 'pending', statusLabel: v.statusPending }],
              bodies,
              { appearance: 'flush', width: '24rem' },
            ),
          ],
        },
      ]),
    );
  },
};

/** The indicator at the end and at the start: at the start the open content lines up with the part after the indicator. */
export const Indicator: Story = {
  name: 'Indicator',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('indicator'),
      matrix(title(context, 'indicator'), [], [
        { label: 'indicator: end', cells: [plain(v, { appearance: 'flush' }, { indicator: 'end' })] },
        { label: 'indicator: start', cells: [plain(v, { appearance: 'flush' }, { indicator: 'start' })] },
        {
          label: 'indicator: start · start: icon · status: on',
          cells: [plain(v, { appearance: 'flush' }, { indicator: 'start', start: 'icon', status: 'success', statusLabel: v.statusDone })],
        },
      ]),
    );
  },
};

/** The disabled item, the locked section and the open item that cannot close. Hover and focus show by interaction. */
export const States: Story = {
  name: 'States',
  parameters: DISABLED_EXCEPTION,
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const bodies = [v.bodyOne, v.bodyTwo, v.bodyThree];
    return validationPage(
      context,
      page('states'),
      matrix(title(context, 'states'), [], [
        {
          label: 'state: disabled',
          cells: [accordion([{ label: v.sectionOne, description: v.shortSupport, disabled: true }], bodies, { appearance: 'flush' })],
        },
        {
          label: 'state: disabled · open: yes (locked section)',
          cells: [
            accordion(
              [{ label: v.sectionOne, description: v.lockedNote, status: 'success', statusLabel: v.statusDone, disabled: true, open: true }],
              bodies,
              { appearance: 'flush' },
            ),
          ],
        },
        {
          label: 'persistent: yes (open that does not close)',
          cells: [accordion([{ label: v.sectionOne, persistent: true }, { label: v.sectionTwo }], bodies, { appearance: 'flush' })],
        },
        {
          label: 'state: disabled · appearance: separated',
          cells: [
            accordion([{ label: v.sectionOne, disabled: true }, { label: v.sectionTwo, disabled: true, open: true }], bodies, {
              appearance: 'separated',
            }),
          ],
        },
      ]),
    );
  },
};

/** Right-to-left writing: the indicator, the start media and the indent follow the start; the chevron at the start points to it. */
export const Direction: Story = {
  name: 'Direction',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('direction'),
      html`<div dir="rtl">
        ${matrix(title(context, 'direction'), [], [
          { label: 'indicator: end', cells: [plain(v, {}, { start: 'tile', description: v.shortSupport, status: 'success', statusLabel: v.statusDone })] },
          { label: 'indicator: start', cells: [plain(v, { appearance: 'flush' }, { indicator: 'start', start: 'icon' })] },
        ])}
      </div>`,
    );
  },
};

/** The event: it is fired when the person opens or closes an item, and says the state the item is in now. */
export const Interactive: Story = {
  name: 'Interactive',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('interactive'),
      matrix(title(context, 'interactive'), [], [{ label: 'event: nph-toggle', cells: [interactive(v)] }]),
    );
  },
};

/** The three required examples — the details of a contract, the steps of a setup and the filters of a side panel — in light and dark. */
export const Examples: Story = {
  name: 'Examples',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('examples'),
      bothModes({ light: v.lightCaption, dark: v.darkCaption }, () => examples(v)),
    );
  },
};

/** The seven brands in light and dark: the tile, the hover, the focus and the tag follow the brand. */
export const Brands: Story = {
  name: 'Brands',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('brands'),
      brandFrames(title(context, 'brands'), () =>
        /* The content is a button, not text: the gate cannot read the background behind a text of the light DOM
           slotted into a piece inside this matrix, and the brand shows in the trigger, the tile and the button. */
        accordion(
          [
            {
              label: v.sectionOne,
              description: v.shortSupport,
              tag: v.tagNew,
              start: 'tile',
              icon: 'folder',
              open: true,
              content: html`<div><nph-button text=${v.saveLabel}></nph-button></div>`,
            },
            { label: v.sectionTwo, start: 'tile', icon: 'folder' },
          ],
          [v.bodyOne],
          { width: '28rem' },
        ),
      ),
    );
  },
};

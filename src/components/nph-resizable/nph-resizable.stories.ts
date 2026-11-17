/**
 * VALIDATION stories of `nph-resizable`.
 *
 * They prove the contract accepted in Figma (documentation frame `5123:2641`, root `5112:1850`,
 * sets `5112:1849` and `5099:172`) and decision P128: the group with two and three panels in both
 * directions, the handle at rest and disabled, the collapsed panel, the nested groups, the limits
 * of a panel, the own event `nph-resize` with the sizes the product keeps, the three required
 * examples of the frame — "List and reading pane", "Nested" and "Collapsed" — and the seven brands.
 * Every story shows the same group in light and in dark mode, in the same story, through
 * `data-nph-color-scheme` on the frame (P20, P67).
 *
 * Hover, dragging and focus belong to the handle and show up by using it: move the mouse over the
 * line, drag it, or press Tab and use the arrows; the component test measures each state. No
 * attribute forces a state, because it would be API. Each page opens with what it proves, from the
 * dictionary (`validationPages.claims`). The captions and the panel names come from the language
 * dictionary, under the key `resizableValidation` (`docs/i18n.md`, "Storybook"); the row and column
 * names of the matrices are the technical attributes, the same in any language.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { format, translations } from '../../../.storybook/i18n/index.js';
import { brandFrames } from '../../shared/docs/brands';
import { matrix } from '../../shared/docs/page';
import { localeOf, validationPage, validationTitle } from '../../shared/docs/validation';
import type { GlobalsContext } from '../../shared/docs/validation';
import './nph-resizable';
import type { NphResizableResizeDetail } from './nph-resizable';
import { collapsed, frame, group, inScheme, linesContent, listAndReading, listContent, nested, readingContent, sample } from './nph-resizable.demo';
import type { Scheme } from './nph-resizable.demo';

const meta: Meta = {
  title: 'Components/nph-resizable/Validation',
};

export default meta;

type Story = StoryObj;

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined) {
  return translations(localeOf(context)).resizableValidation;
}

/* Demonstration frame. Not a precedent for component CSS. */
const stack = 'display: flex; flex-direction: column; gap: var(--nph-space-stack);';
const modesFrame = 'display: flex; flex-wrap: wrap; align-items: flex-start; gap: var(--nph-space-stack);';
const statusStyle = 'color: var(--nph-color-muted-foreground);';

const page = (storyId: string) => ({
  piece: 'nph-resizable',
  storyId: `components-nph-resizable-validation--${storyId}`,
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
  const title = validationTitle(context, 'nph-resizable', page(storyId).storyId);
  return html`<div style=${modesFrame}>
    ${modes.map(([scheme, caption]) => {
      const label = name === undefined ? caption : `${name} · ${caption}`;
      return inScheme(scheme, label, content(`${title} · ${label}`));
    })}
  </div>`;
}

/** Direction and panels: the Figma properties `direcao` and `paineis`. */
export const Matrix: Story = {
  name: 'Matrix',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('matrix'),
      inBothModes(context, 'matrix', (label) =>
        matrix(
          label,
          ['panels: 2', 'panels: 3'],
          [
            { label: 'direction: horizontal', cells: [sample(v, { count: 2 }), sample(v, { count: 3 })] },
            { label: 'direction: vertical', cells: [sample(v, { direction: 'vertical', count: 2 }), sample(v, { direction: 'vertical', count: 3 })] },
          ],
        ),
      ),
    );
  },
};

/** The handle at rest and disabled, with the collapse button on and off, in both directions. */
export const HandleStates: Story = {
  name: 'Handle states',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('handle-states'),
      inBothModes(context, 'handle-states', (label) =>
        matrix(
          label,
          ['state: default', 'state: disabled', 'collapse button: off'],
          [
            {
              label: 'direction: horizontal',
              cells: [sample(v), sample(v, { disabled: true }), sample(v, { hideCollapseButton: true })],
            },
            {
              label: 'direction: vertical',
              cells: [
                sample(v, { direction: 'vertical' }),
                sample(v, { direction: 'vertical', disabled: true }),
                sample(v, { direction: 'vertical', hideCollapseButton: true }),
              ],
            },
          ],
        ),
      ),
    );
  },
};

/** The collapsed panel is a size, not a look of the handle: the left panel is collapsed, the chevron flipped, and the button restores it. */
export const Collapsed: Story = {
  name: 'Collapsed',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('collapsed'),
      inBothModes(context, 'collapsed', (label) =>
        matrix(label, ['collapsed-size: 0', 'collapsed-size: 5'], [
          {
            label: 'direction: horizontal',
            cells: [
              collapsed(v),
              frame(
                group({
                  collapseLabel: v.collapse,
                  expandLabel: v.expand,
                  sizes: [5, 95],
                  panels: [
                    { name: v.navigation, content: linesContent(), collapsedSize: '5', defaultSize: '30' },
                    { name: v.reading, content: readingContent() },
                  ],
                }),
                'wide',
              ),
            ],
          },
        ]),
      ),
    );
  },
};

/** Nested groups: more than three panels by putting a group of the other direction inside a panel. */
export const Nested: Story = {
  name: 'Nested',
  render: (_args, context: GlobalsContext) =>
    validationPage(context, page('nested'), inBothModes(context, 'nested', () => nested(t(context)))),
};

/** The limits of a panel: the handle stops at the minimum and at the maximum, in percent and in pixels. */
export const Limits: Story = {
  name: 'Limits',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const limited = (sizes: readonly number[], min: string, max: string): TemplateResult =>
      frame(
        group({
          collapseLabel: v.collapse,
          expandLabel: v.expand,
          sizes,
          panels: [
            { name: v.list, content: listContent(), minSize: min, maxSize: max },
            { name: v.reading, content: readingContent() },
          ],
        }),
        'wide',
      );
    return validationPage(
      context,
      page('limits'),
      inBothModes(context, 'limits', (label) =>
        matrix(label, ['size: at the minimum', 'size: at the maximum'], [
          { label: 'min-size: 25 · max-size: 60', cells: [limited([25, 75], '25', '60'), limited([60, 40], '25', '60')] },
          { label: 'min-size: 160px · max-size: 320px', cells: [limited([20, 80], '160px', '320px'), limited([40, 60], '160px', '320px')] },
        ]),
      ),
    );
  },
};

/** The status text under a group: it is replaced by a listener, and the product keeps `detail.sizes`. */
function interactive(context: GlobalsContext | undefined): TemplateResult {
  const v = t(context);
  const onResize = (event: CustomEvent<NphResizableResizeDetail>): void => {
    const status = (event.currentTarget as HTMLElement).querySelector('output');
    if (status) {
      status.textContent = format(v.statusChanged, { sizes: event.detail.sizes.map((size) => Math.round(size)).join(' ') });
    }
  };
  return html`<div style="${stack} align-items: flex-start;" @nph-resize=${onResize}>
    ${listAndReading(v)}
    <output aria-live="polite" style=${statusStyle} .textContent=${v.statusIdle}></output>
  </div>`;
}

/** A drag, a key or a click fires `nph-resize`; `detail.sizes` is what the product stores and gives back through `sizes`. */
export const Interactive: Story = {
  name: 'Interactive',
  render: (_args, context: GlobalsContext) =>
    validationPage(context, page('interactive'), inBothModes(context, 'interactive', () => interactive(context))),
};

/** The three required examples of the accepted frame, each in light and dark mode. */
export const Examples: Story = {
  name: 'Examples',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('examples'),
      html`<div style=${stack}>
        ${inBothModes(context, 'examples', () => listAndReading(v), v.exampleListReading)}
        ${inBothModes(context, 'examples', () => nested(v), v.exampleNested)}
        ${inBothModes(context, 'examples', () => collapsed(v), v.exampleCollapsed)}
      </div>`,
    );
  },
};

/** The seven brands in light and dark (DSA-36): the focus border and the collapse button follow the brand. */
export const Brands: Story = {
  name: 'Brands',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('brands'),
      brandFrames(validationTitle(context, 'nph-resizable', page('brands').storyId), () => sample(v)),
    );
  },
};

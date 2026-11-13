/**
 * VALIDATION stories of `nph-collapsible`.
 *
 * They prove the contract accepted in Figma (documentation frame `6014:1688`, set `6006:2250`) and P121:
 * the three types (line, button and preview), closed and open; the two appearances; the three sizes of
 * the line type; the indicator at the end and at the start, and the indent of the content to the title;
 * what the trigger turns on (the description and the start icon); the disabled state and open and disabled
 * together; several pieces one under the other with no divider; the right-to-left writing; the event; and
 * the three required examples in light and dark mode, in the same story. Each page opens with what it
 * proves, and the matrix names its rows by attribute, as on the Docs page. All visible text, including
 * the titles and the content, comes from the language dictionary, under the `collapsibleValidation` and
 * `validationPages` keys (`docs/i18n.md`, "Storybook").
 *
 * Hover and focus are interaction states: they show up by moving the mouse over a trigger and by pressing
 * Tab, and the tests prove their colors and rings.
 */
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { translations } from '../../../.storybook/i18n/index.js';
import { brandFrames } from '../../shared/docs/brands';
import { matrix } from '../../shared/docs/page';
import { localeOf, validationPage, validationTitle } from '../../shared/docs/validation';
import type { GlobalsContext } from '../../shared/docs/validation';
import './nph-collapsible';
import { bothModes, collapsible, examples, interactive, logContent, stack } from './nph-collapsible.demo';
import type { ExampleTexts } from './nph-collapsible.demo';

const meta: Meta = {
  title: 'Components/nph-collapsible/Validation',
};

export default meta;

type Story = StoryObj;

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined) {
  return translations(localeOf(context)).collapsibleValidation as unknown as ExampleTexts & Record<string, unknown>;
}

const page = (storyId: string) => ({ piece: 'nph-collapsible', storyId: `components-nph-collapsible-validation--${storyId}` });

/** The three types — line, button and preview — closed and open: the trigger, the chevron and the cut of the preview. */
export const Types: Story = {
  name: 'Types',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const long = logContent(v);
    return validationPage(
      context,
      page('types'),
      matrix(validationTitle(context, 'nph-collapsible', page('types').storyId), [], [
        { label: 'type: line · open: no', cells: [collapsible(v)] },
        { label: 'type: line · open: yes', cells: [collapsible(v, { open: true })] },
        { label: 'type: button · open: no', cells: [collapsible(v, { type: 'button' })] },
        { label: 'type: button · open: yes', cells: [collapsible(v, { type: 'button', open: true })] },
        { label: 'type: preview · open: no', cells: [collapsible(v, { type: 'preview', content: long })] },
        { label: 'type: preview · open: yes', cells: [collapsible(v, { type: 'preview', open: true, content: long })] },
      ]),
    );
  },
};

/** The two appearances: flush with no outline, and the card with the background, the outline and the padding. */
export const Appearances: Story = {
  name: 'Appearances',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const long = logContent(v);
    return validationPage(
      context,
      page('appearances'),
      matrix(validationTitle(context, 'nph-collapsible', page('appearances').storyId), [], [
        { label: 'appearance: flush · open: yes', cells: [collapsible(v, { open: true, description: v.support })] },
        { label: 'appearance: card · open: no', cells: [collapsible(v, { appearance: 'card', description: v.support })] },
        { label: 'appearance: card · open: yes', cells: [collapsible(v, { appearance: 'card', open: true, description: v.support })] },
        { label: 'appearance: card · type: button', cells: [collapsible(v, { appearance: 'card', type: 'button', open: true })] },
        { label: 'appearance: card · type: preview', cells: [collapsible(v, { appearance: 'card', type: 'preview', content: long })] },
      ]),
    );
  },
};

/** The three sizes of the line type: they change the minimum height of the trigger, and the large one changes the title. */
export const Sizes: Story = {
  name: 'Sizes',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('sizes'),
      matrix(validationTitle(context, 'nph-collapsible', page('sizes').storyId), [], [
        { label: 'size: compact', cells: [collapsible(v, { size: 'compact', description: v.support, open: true })] },
        { label: 'size: default', cells: [collapsible(v, { size: 'default', description: v.support, open: true })] },
        { label: 'size: large', cells: [collapsible(v, { size: 'large', description: v.support, open: true })] },
      ]),
    );
  },
};

/** The indicator at the end and at the start: the open content indents to the title, past the indicator and the start icon. */
export const Indicator: Story = {
  name: 'Indicator',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('indicator'),
      matrix(validationTitle(context, 'nph-collapsible', page('indicator').storyId), [], [
        { label: 'indicator: end', cells: [collapsible(v, { open: true })] },
        { label: 'indicator: start', cells: [collapsible(v, { indicator: 'start', open: true })] },
        { label: 'indicator: start · icon: on', cells: [collapsible(v, { indicator: 'start', icon: 'gear', open: true })] },
        { label: 'indicator: end · icon: on', cells: [collapsible(v, { icon: 'gear', open: true })] },
        { label: 'indicator: start · appearance: card', cells: [collapsible(v, { indicator: 'start', appearance: 'card', open: true })] },
      ]),
    );
  },
};

/** What the trigger turns on: the support line and the start icon; a long title wraps and the content holds any piece. */
export const Content: Story = {
  name: 'Content',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('content'),
      matrix(validationTitle(context, 'nph-collapsible', page('content').storyId), [], [
        { label: 'description: on', cells: [collapsible(v, { description: v.support })] },
        { label: 'icon: on · description: on', cells: [collapsible(v, { icon: 'gear', description: v.support })] },
        { label: 'description: on · title: long', cells: [collapsible(v, { label: v.longTitle, description: v.longSupport, icon: 'gear', width: '20rem' })] },
        {
          label: 'content: a piece',
          cells: [
            collapsible(v, {
              open: true,
              content: html`<p style="margin: 0;">${v.advancedBody}</p>
                <div><nph-button text=${v.saveLabel}></nph-button></div>`,
            }),
          ],
        },
      ]),
    );
  },
};

/** Disabled, and open and disabled together: the content stays in view, faded. Hover and focus show by interaction. */
export const States: Story = {
  name: 'States',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('states'),
      matrix(validationTitle(context, 'nph-collapsible', page('states').storyId), [], [
        { label: 'state: default', cells: [collapsible(v, { description: v.support })] },
        { label: 'state: disabled', cells: [collapsible(v, { disabled: true, description: v.support })] },
        { label: 'state: disabled · open: yes', cells: [collapsible(v, { disabled: true, open: true, description: v.support })] },
        { label: 'state: disabled · appearance: card · open: yes', cells: [collapsible(v, { disabled: true, appearance: 'card', open: true })] },
        { label: 'state: disabled · type: button', cells: [collapsible(v, { disabled: true, type: 'button' })] },
        { label: 'state: disabled · type: preview', cells: [collapsible(v, { disabled: true, type: 'preview', content: logContent(v) })] },
      ]),
    );
  },
};

/** Several one under the other, in the same column and the same width: separated by space, with no divider. */
export const Stack: Story = {
  name: 'Stack',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('stack'),
      matrix(validationTitle(context, 'nph-collapsible', page('stack').storyId), [], [
        { label: 'appearance: flush', cells: [stack(v)] },
        { label: 'appearance: card', cells: [stack(v, 'card')] },
      ]),
    );
  },
};

/** Right-to-left writing: the indicator, the icon and the indent follow the start; the chevron at the start points to it. */
export const Direction: Story = {
  name: 'Direction',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('direction'),
      html`<div dir="rtl">
        ${matrix(validationTitle(context, 'nph-collapsible', page('direction').storyId), [], [
          { label: 'indicator: end', cells: [collapsible(v, { open: true, icon: 'gear', description: v.support })] },
          { label: 'indicator: start', cells: [collapsible(v, { indicator: 'start', open: true, icon: 'gear' })] },
          { label: 'type: button', cells: [collapsible(v, { type: 'button', open: true })] },
        ])}
      </div>`,
    );
  },
};

/** The event: it is fired when the person opens or closes the content, and says the state the content is in now. */
export const Interactive: Story = {
  name: 'Interactive',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('interactive'),
      matrix(validationTitle(context, 'nph-collapsible', page('interactive').storyId), [], [
        { label: 'event: nph-toggle', cells: [interactive(v)] },
      ]),
    );
  },
};

/** The three required examples — the advanced settings, the steps of a sign-up and the import log — in light and in dark. */
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

/** The seven brands in light and dark: the hover, the focus and the card follow the brand. */
export const Brands: Story = {
  name: 'Brands',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('brands'),
      brandFrames(
        validationTitle(context, 'nph-collapsible', page('brands').storyId),
        () => html`<div style="display: flex; flex-direction: column; gap: var(--nph-space-stack);">
          ${collapsible(v, { open: true, description: v.support })} ${collapsible(v, { appearance: 'card', open: true })}
          ${collapsible(v, { type: 'button', open: true })}
        </div>`,
      ),
    );
  },
};

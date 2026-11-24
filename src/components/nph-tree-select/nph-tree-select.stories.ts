/**
 * VALIDATION stories of `nph-tree-select`.
 *
 * They prove the contract accepted in Figma (documentation frame `7145:9081`, sets `6339:8107` and
 * `6339:8110`): the three modes in the two sizes, the states of the field, the panel with each content, the
 * error row in the narrow panel, the three required examples in light and dark mode in the same story, a field
 * to try with the mouse and the keyboard, and the seven brands. Each page opens with what it proves, and the
 * matrix names its rows by attribute. All visible text, the items of the tree included, comes from the language
 * dictionary, under the `treeSelectValidation` and `validationPages` keys (`docs/i18n.md`, "Storybook").
 *
 * The open panels are set open by the `open` property, so many show on one page; the focus, the active item and
 * the keys belong to the interaction: the tests prove them.
 */
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { translations } from '../../../.storybook/i18n/index.js';
import { brandFrames } from '../../shared/docs/brands';
import { matrix } from '../../shared/docs/page';
import { localeOf, validationPage, validationTitle } from '../../shared/docs/validation';
import type { GlobalsContext } from '../../shared/docs/validation';
import { NPH_TREE_SELECT_MODES, NPH_TREE_SELECT_SIZES } from './nph-tree-select';
import { bothModes, cell, examples, items } from './nph-tree-select.demo';
import type { ExampleTexts } from './nph-tree-select.demo';

const meta: Meta = {
  title: 'Components/nph-tree-select/Validation',
};
export default meta;
type Story = StoryObj;

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined): ExampleTexts {
  return translations(localeOf(context)).treeSelectValidation as unknown as ExampleTexts;
}

const page = (storyId: string) => ({ piece: 'nph-tree-select', storyId: `components-nph-tree-select-validation--${storyId}` });

/** The three modes in the two sizes, closed, with and without a value. */
export const Modes: Story = {
  name: 'Modes',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('modes'),
      matrix(
        validationTitle(context, 'nph-tree-select', page('modes').storyId),
        [],
        NPH_TREE_SELECT_SIZES.flatMap((size) =>
          NPH_TREE_SELECT_MODES.flatMap((mode) => [
            { label: `mode: ${mode} · size: ${size} · value: off`, cells: [cell(v, { mode, size })] },
            {
              label: `mode: ${mode} · size: ${size} · value: on`,
              cells: [cell(v, mode === 'multiple' ? { mode, size, values: ['contracts', 'contract-2025', 'contract-2026', 'readme'] } : { mode, size, value: 'contract-2025' })],
            },
          ]),
        ),
      ),
    );
  },
};

/** The states of the field: error, disabled, disabled with a value, and the counter of the multiple choice. */
export const States: Story = {
  name: 'States',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('states'),
      matrix(validationTitle(context, 'nph-tree-select', page('states').storyId), [], [
        { label: 'state: error', cells: [cell(v, { invalid: true })] },
        { label: 'state: disabled', cells: [cell(v, { disabled: true })] },
        { label: 'state: disabled · value: on', cells: [cell(v, { disabled: true, value: 'readme' })] },
        { label: 'state: disabled · mode: multiple · value: on', cells: [cell(v, { mode: 'multiple', disabled: true, values: ['readme', 'images', 'logo'] })] },
        { label: 'state: error + disabled', cells: [cell(v, { invalid: true, disabled: true })] },
        { label: 'mode: multiple · counter: on', cells: [cell(v, { mode: 'multiple', counter: true, values: ['readme', 'images', 'logo'] })] },
        { label: 'inside nph-field: on', cells: [cell(v, { withField: true })] },
      ]),
    );
  },
};

/** The panel with each content: items, the search with the ancestors, no result, first load and empty. */
export const Panel: Story = {
  name: 'Panel',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const open = { open: true, expanded: ['documents', 'contracts'] };
    return validationPage(
      context,
      page('panel'),
      matrix(validationTitle(context, 'nph-tree-select', page('panel').storyId), [], [
        { label: 'selection: single · content: items', cells: [cell(v, { ...open, value: 'contract-2025' })] },
        { label: 'selection: multiple · content: items', cells: [cell(v, { ...open, mode: 'multiple', values: ['contracts', 'contract-2025', 'contract-2026'] })] },
        { label: 'selection: single · content: search', cells: [cell(v, { open: true, mode: 'search', query: v.typed })] },
        { label: 'selection: single · content: no result', cells: [cell(v, { open: true, mode: 'search', query: 'zzzz', room: 260 })] },
        { label: 'selection: single · content: first load', cells: [cell(v, { open: true, empty: true, loading: true, room: 200 })] },
        { label: 'selection: single · content: empty', cells: [cell(v, { open: true, empty: true, room: 300 })] },
      ]),
    );
  },
};

/** The error row in the narrow panel: Try again drops below the message, at the same start. */
export const ErrorRow: Story = {
  name: 'ErrorRow',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('error-row'),
      matrix(validationTitle(context, 'nph-tree-select', page('error-row').storyId), [], [
        {
          label: 'branch: failed to load · panel: 280',
          cells: [cell(v, { open: true, expanded: ['remote'], tree: [{ id: 'remote', label: v.documents, branch: true, error: true }], room: 200 })],
        },
        {
          label: 'branch: failed to load · panel: 360',
          cells: [cell(v, { open: true, width: 360, expanded: ['remote'], tree: [{ id: 'remote', label: v.documents, branch: true, error: true }], room: 200 })],
        },
      ]),
    );
  },
};

/** A field to try: click or the keys open the panel, the arrows move, Enter chooses or checks, Esc closes. */
export const Interactive: Story = {
  name: 'Interactive',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('interactive'),
      matrix(validationTitle(context, 'nph-tree-select', page('interactive').storyId), [], [
        { label: 'mode: single', cells: [cell(v, { withField: true })] },
        { label: 'mode: search', cells: [cell(v, { mode: 'search', withField: true })] },
        { label: 'mode: multiple', cells: [cell(v, { mode: 'multiple', withField: true })] },
      ]),
    );
  },
};

/** The three required examples, in light and in dark: a file in a folder, files for a submission, a contract in a large tree. */
export const Examples: Story = {
  name: 'Examples',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(context, page('examples'), bothModes({ light: v.lightCaption, dark: v.darkCaption }, () => examples(v)));
  },
};

/** The seven brands in light and dark: the focus and the chosen item follow the brand, with the panel open in every frame. */
export const Brands: Story = {
  name: 'Brands',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('brands'),
      brandFrames(validationTitle(context, 'nph-tree-select', page('brands').storyId), () =>
        html`${cell(v, { open: true, value: 'contract-2025', expanded: ['documents', 'contracts'], tree: items(v), room: 330 })}`,
      ),
    );
  },
};

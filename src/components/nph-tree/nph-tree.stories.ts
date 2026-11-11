/**
 * VALIDATION stories of `nph-tree`.
 *
 * They prove the contract accepted in Figma (documentation frame `5876:216753`, sets `5485:350`,
 * `5485:421` and `5485:766`) and P118: the three selections (none, single and multiple) and the three
 * types of item (closed branch, open branch and leaf), with the icons on and off; the states that
 * show at rest (selected, disabled and their combination); multiple selection with the parent mixed,
 * the disabled item out of the count and the cascade turned off; the first load, the branch that
 * loads, the error row and the empty tree; the cut label, the six levels and the container that
 * scrolls; and the three required examples in light and dark mode, in the same story. Each page opens
 * with what it proves, and the matrix names its rows by attribute, as on the Docs page. All visible
 * text, including the names of the folders, comes from the language dictionary, under the
 * `treeValidation` and `validationPages` keys (`docs/i18n.md`, "Storybook").
 *
 * Hover and focus are interaction states: they show up by moving the mouse over an item and by pressing
 * Tab, and the tests prove their colors and the border.
 */
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { translations } from '../../../.storybook/i18n/index.js';
import { brandFrames } from '../../shared/docs/brands';
import { matrix } from '../../shared/docs/page';
import { localeOf, validationPage, validationTitle } from '../../shared/docs/validation';
import type { GlobalsContext } from '../../shared/docs/validation';
import './nph-tree';
import {
  MATRIX_WIDTH,
  NARROW_WIDTH,
  bothModes,
  branchIds,
  deepNodes,
  examples,
  fileNodes,
  inCard,
  loadNodes,
  longNodes,
  manyNodes,
  permissionNodes,
  tree,
} from './nph-tree.demo';
import type { ExampleTexts } from './nph-tree.demo';

const meta: Meta = {
  title: 'Components/nph-tree/Validation',
};

export default meta;

type Story = StoryObj;

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined) {
  return translations(localeOf(context)).treeValidation as unknown as ExampleTexts & Record<string, unknown>;
}

const page = (storyId: string) => ({ piece: 'nph-tree', storyId: `components-nph-tree-validation--${storyId}` });

/** The three selections: none opens and closes, single chooses one item, multiple puts a box on every item. */
export const Selections: Story = {
  name: 'Selections',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const items = fileNodes(v);
    return validationPage(
      context,
      page('selections'),
      matrix(validationTitle(context, 'nph-tree', page('selections').storyId), [], [
        { label: 'selection: none', cells: [inCard(tree(v, { items, expanded: ['documents'], width: MATRIX_WIDTH }))] },
        { label: 'selection: single', cells: [inCard(tree(v, { items, selection: 'single', selected: 'reports', expanded: ['documents'], width: MATRIX_WIDTH }))] },
        {
          label: 'selection: multiple',
          cells: [inCard(tree(v, { items, selection: 'multiple', checked: ['q1'], expanded: ['documents', 'reports'], width: MATRIX_WIDTH }))],
        },
      ]),
    );
  },
};

/** The three types of item, the closed branch, the open branch and the leaf, with the icons off and on. */
export const Items: Story = {
  name: 'Items',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const items = fileNodes(v);
    return validationPage(
      context,
      page('items'),
      matrix(validationTitle(context, 'nph-tree', page('items').storyId), [], [
        { label: 'icons: off', cells: [inCard(tree(v, { items, expanded: ['documents'], width: MATRIX_WIDTH }))] },
        { label: 'icons: on', cells: [inCard(tree(v, { items, expanded: ['documents'], icons: true, width: MATRIX_WIDTH }))] },
      ]),
    );
  },
};

/** The states that show at rest: selected, disabled, and selected with disabled. Hover and focus come with the pointer and the keyboard. */
export const States: Story = {
  name: 'States',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const items = fileNodes(v);
    return validationPage(
      context,
      page('states'),
      matrix(validationTitle(context, 'nph-tree', page('states').storyId), [], [
        { label: 'state: selected', cells: [inCard(tree(v, { items, selection: 'single', selected: 'reports', expanded: ['documents'], icons: true, width: MATRIX_WIDTH }))] },
        { label: 'state: disabled', cells: [inCard(tree(v, { items, selection: 'none', expanded: ['images'], icons: true, width: MATRIX_WIDTH }))] },
        {
          label: 'state: selected · disabled',
          cells: [inCard(tree(v, { items, selection: 'single', selected: 'photos', expanded: ['images'], icons: true, width: MATRIX_WIDTH }))],
        },
      ]),
    );
  },
};

/** Multiple selection: checked, unchecked and mixed; the disabled item stays out of the count; the cascade can be turned off. */
export const Multiple: Story = {
  name: 'Multiple',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const items = permissionNodes(v);
    const open = branchIds(items);
    return validationPage(
      context,
      page('multiple'),
      matrix(validationTitle(context, 'nph-tree', page('multiple').storyId), [], [
        {
          label: 'selection: multiple · parent: mixed',
          cells: [inCard(tree(v, { items, selection: 'multiple', checked: ['leads', 'tickets', 'chat'], expanded: open, label: v.permissionsLabel, width: MATRIX_WIDTH }))],
        },
        {
          label: 'selection: multiple · state: disabled',
          cells: [inCard(tree(v, { items, selection: 'multiple', checked: ['finance'], expanded: open, label: v.permissionsLabel, width: MATRIX_WIDTH }))],
        },
        {
          label: 'selection: multiple · check-strictly: on',
          cells: [
            inCard(tree(v, { items, selection: 'multiple', checked: ['sales', 'chat'], expanded: open, checkStrictly: true, label: v.permissionsLabel, width: MATRIX_WIDTH })),
          ],
        },
        {
          label: 'selection: multiple · icons: on',
          cells: [inCard(tree(v, { items, selection: 'multiple', checked: ['support'], expanded: open, icons: true, label: v.permissionsLabel, width: MATRIX_WIDTH }))],
        },
      ]),
    );
  },
};

/** The first load, the branch that loads with the spinner, and the branch that failed with the error row. */
export const Loading: Story = {
  name: 'Loading',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('loading'),
      matrix(validationTitle(context, 'nph-tree', page('loading').storyId), [], [
        { label: 'loading: on', cells: [inCard(tree(v, { items: [], loading: true, width: MATRIX_WIDTH }))] },
        { label: 'state: loading', cells: [inCard(tree(v, { items: loadNodes(v), expanded: ['shared-drive'], icons: true, width: MATRIX_WIDTH }))] },
        { label: 'state: error', cells: [inCard(tree(v, { items: loadNodes(v), expanded: ['backups'], icons: true, width: MATRIX_WIDTH }))] },
        { label: 'state: loading · error', cells: [inCard(tree(v, { items: loadNodes(v), expanded: ['shared-drive', 'backups'], width: MATRIX_WIDTH }))] },
      ]),
    );
  },
};

/** The empty tree shows the empty state in place of the list. */
export const Empty: Story = {
  name: 'Empty',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('empty'),
      matrix(validationTitle(context, 'nph-tree', page('empty').storyId), [], [
        { label: 'items: empty', cells: [inCard(tree(v, { items: [], width: MATRIX_WIDTH }))] },
      ]),
    );
  },
};

/** The label is cut on one line with its whole text in a balloon, and the levels indent by one step each, with no limit. */
export const Width: Story = {
  name: 'Width',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const levels = deepNodes(v);
    return validationPage(
      context,
      page('width'),
      matrix(validationTitle(context, 'nph-tree', page('width').storyId), [], [
        { label: 'label: cut', cells: [inCard(tree(v, { items: longNodes(v), expanded: ['long-folder'], icons: true, width: NARROW_WIDTH }))] },
        { label: 'levels: 6', cells: [inCard(tree(v, { items: levels, expanded: branchIds(levels), icons: true, width: MATRIX_WIDTH }))] },
      ]),
    );
  },
};

/** The tree lives in a container that gives the surface and the scroll; the item does not shrink and the border of the item at the edge is whole. */
export const Container: Story = {
  name: 'Container',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('container'),
      matrix(validationTitle(context, 'nph-tree', page('container').storyId), [], [
        { label: 'container: card · scroll', cells: [html`<div style="inline-size: ${MATRIX_WIDTH}; max-inline-size: 100%;">${inCard(tree(v, { items: manyNodes(v), selection: 'single' }), '15rem')}</div>`] },
      ]),
    );
  },
};

/** The three required examples — the destination folder, the permissions by area and the branches that load — in light and in dark. */
export const Examples: Story = {
  name: 'Examples',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('examples'),
      bothModes({ light: v.lightCaption as string, dark: v.darkCaption as string }, () => examples(v)),
    );
  },
};

/** The seven brands in light and dark: the surface, the bar, the chevron and the focus follow the brand. */
export const Brands: Story = {
  name: 'Brands',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('brands'),
      brandFrames(
        validationTitle(context, 'nph-tree', page('brands').storyId),
        () => html`<div style="display: flex; flex-direction: column; gap: var(--nph-space-stack);">
          ${tree(v, { items: fileNodes(v), selection: 'single', selected: 'reports', expanded: ['documents'], icons: true, width: MATRIX_WIDTH })}
          ${tree(v, { items: permissionNodes(v), selection: 'multiple', checked: ['leads', 'tickets', 'chat'], expanded: ['sales', 'support'], width: MATRIX_WIDTH })}
        </div>`,
      ),
    );
  },
};

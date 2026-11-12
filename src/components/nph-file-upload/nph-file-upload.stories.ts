/**
 * VALIDATION stories of `nph-file-upload`.
 *
 * They prove the contract accepted in Figma (documentation frame `5311:8328`, sets `5297:7473` and
 * `5298:7669`) and P119: the states of the zone (empty, error, limit and disabled, and dragging, which a
 * story reaches by dragging files over the zone); the two formats and the width that switches them; the
 * five statuses of an item and the two kinds; the file above the size that comes in as an item in error;
 * the long name that is cut and the long reason that wraps; the zone as the control of `nph-field`, and
 * the compact zone in a form; and the three required examples in light and dark mode, in the same story.
 * Each page opens with what it proves, and the matrix names its rows by attribute, as on the Docs page.
 * All visible text, including the names of the files, comes from the language dictionary, under the
 * `fileUploadValidation` and `validationPages` keys (`docs/i18n.md`, "Storybook").
 *
 * Hover and focus are interaction states: they show up by moving the mouse over the button and by
 * pressing Tab, and the tests prove their icon, colors and rings.
 */
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { translations } from '../../../.storybook/i18n/index.js';
import { brandFrames } from '../../shared/docs/brands';
import { matrix } from '../../shared/docs/page';
import { localeOf, validationPage, validationTitle } from '../../shared/docs/validation';
import type { GlobalsContext } from '../../shared/docs/validation';
import './nph-file-upload';
import {
  COMPACT_WIDTH,
  ZONE_WIDTH,
  bothModes,
  examples,
  imageFiles,
  inField,
  inForm,
  inUseFiles,
  limitFiles,
  longFiles,
  sizeErrorFiles,
  standaloneItem,
  statusFiles,
  upload,
} from './nph-file-upload.demo';
import type { ExampleTexts } from './nph-file-upload.demo';

const meta: Meta = {
  title: 'Components/nph-file-upload/Validation',
};

export default meta;

type Story = StoryObj;

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined) {
  return translations(localeOf(context)).fileUploadValidation as unknown as ExampleTexts & Record<string, unknown>;
}

const page = (storyId: string) => ({ piece: 'nph-file-upload', storyId: `components-nph-file-upload-validation--${storyId}` });

/** The states of the zone that a page sets: empty, error, limit and disabled. */
export const States: Story = {
  name: 'States',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('states'),
      matrix(validationTitle(context, 'nph-file-upload', page('states').storyId), [], [
        { label: 'state: empty', cells: [upload(v)] },
        { label: 'state: error', cells: [upload(v, { error: v.typeError })] },
        { label: 'state: limit', cells: [upload(v, { files: limitFiles(v), maxFiles: 5 })] },
        { label: 'state: disabled', cells: [upload(v, { disabled: true })] },
        { label: 'state: disabled · state: error', cells: [upload(v, { disabled: true, error: v.typeError })] },
      ]),
    );
  },
};

/** Dragging is a state of its own: the story drags files over the zone, and the button leaves with its place kept. */
export const Dragging: Story = {
  name: 'Dragging',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('dragging'),
      matrix(validationTitle(context, 'nph-file-upload', page('dragging').storyId), [], [
        { label: 'state: dragging', cells: [upload(v)] },
        { label: 'state: dragging · format: compact', cells: [upload(v, { format: 'compact', width: COMPACT_WIDTH })] },
      ]),
    );
  },
  play: async ({ canvasElement }) => {
    const zones = [...canvasElement.querySelectorAll('nph-file-upload')] as HTMLElement[];
    for (const zone of zones) {
      await (zone as unknown as { updateComplete: Promise<unknown> }).updateComplete;
      const transfer = new DataTransfer();
      transfer.items.add(new File(['sample'], 'sample.pdf', { type: 'application/pdf' }));
      zone.shadowRoot?.querySelector('.zone')?.dispatchEvent(new DragEvent('dragenter', { dataTransfer: transfer, bubbles: true, cancelable: true }));
    }
  },
};

/** Two formats: stacked and centered, and one row. The compact format only applies from 668 px of width. */
export const Formats: Story = {
  name: 'Formats',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('formats'),
      matrix(validationTitle(context, 'nph-file-upload', page('formats').storyId), [], [
        { label: 'format: default', cells: [upload(v)] },
        { label: 'format: compact · width: 48rem', cells: [upload(v, { format: 'compact', width: COMPACT_WIDTH })] },
        { label: 'format: compact · width: 30rem', cells: [upload(v, { format: 'compact', width: ZONE_WIDTH })] },
        { label: 'format: compact · state: error', cells: [upload(v, { format: 'compact', width: COMPACT_WIDTH, error: v.typeError })] },
        { label: 'size: large', cells: [upload(v, { size: 'large' })] },
      ]),
    );
  },
};

/** The five statuses of an item in one list: ready, uploading, sent, error and done. */
export const Items: Story = {
  name: 'Items',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('items'),
      matrix(validationTitle(context, 'nph-file-upload', page('items').storyId), [], [
        { label: 'status: ready, uploading, sent, error, done', cells: [upload(v, { files: statusFiles(v) })] },
        { label: 'status: error · state: disabled', cells: [upload(v, { files: statusFiles(v), disabled: true })] },
      ]),
    );
  },
};

/** The image kind: the thumbnail in nph-image, in every status; the last image still has no thumbnail. */
export const Kinds: Story = {
  name: 'Kinds',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('kinds'),
      matrix(validationTitle(context, 'nph-file-upload', page('kinds').storyId), [], [
        { label: 'kind: image', cells: [upload(v, { files: imageFiles(v) })] },
        { label: 'kind: file', cells: [upload(v, { files: statusFiles(v).slice(0, 2) })] },
      ]),
    );
  },
};

/** The limit reached: the button is disabled and the rule says how to free space. A file above the size is an item in error. */
export const Limit: Story = {
  name: 'Limit',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('limit'),
      matrix(validationTitle(context, 'nph-file-upload', page('limit').storyId), [], [
        { label: 'state: limit', cells: [upload(v, { files: limitFiles(v), maxFiles: 5 })] },
        { label: 'status: error · reason: size', cells: [upload(v, { files: sizeErrorFiles(v) })] },
        { label: 'state: error · reason: count', cells: [upload(v, { files: limitFiles(v), maxFiles: 6, error: v.countError })] },
      ]),
    );
  },
};

/** A name that does not fit is cut on one line with an ellipsis; a long reason wraps and the item grows. */
export const Width: Story = {
  name: 'Width',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('width'),
      matrix(validationTitle(context, 'nph-file-upload', page('width').storyId), [], [
        { label: 'name: cut · reason: wraps', cells: [upload(v, { files: longFiles(v) })] },
        { label: 'name: cut · width: 20rem', cells: [upload(v, { files: longFiles(v).slice(0, 1), width: '20rem' })] },
      ]),
    );
  },
};

/** The zone as the control of nph-field, with the label, the asterisk and the help text; and the compact zone in a form. */
export const Field: Story = {
  name: 'Field',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('field'),
      matrix(validationTitle(context, 'nph-file-upload', page('field').storyId), [], [
        { label: 'field: required · help', cells: [inField(v, { files: inUseFiles(v) })] },
        { label: 'field: required · state: error', cells: [inField(v, { error: v.typeError })] },
        { label: 'format: compact · container: card', cells: [inForm(v)] },
      ]),
    );
  },
};

/** The three required examples — the empty zone, the list in use and the limit reached — in light and in dark. */
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

/** The seven brands in light and dark: the dragging colors, the thumbnail box and the focus ring follow the brand; the item is also drawn alone. */
export const Brands: Story = {
  name: 'Brands',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('brands'),
      brandFrames(
        validationTitle(context, 'nph-file-upload', page('brands').storyId),
        () => html`<div style="display: flex; flex-direction: column; gap: var(--nph-space-stack);">
          ${upload(v, { files: inUseFiles(v) })} ${upload(v, { error: v.typeError })} ${standaloneItem(v)}
        </div>`,
      ),
    );
  },
};

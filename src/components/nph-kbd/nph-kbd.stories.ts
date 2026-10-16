/**
 * VALIDATION stories of `nph-kbd`.
 *
 * They prove the single key and the combination, one piece per key, as in frame
 * `1193:20`, and the combination with the macOS symbols. The keys are example
 * content and do not go through the language dictionary: they are key names,
 * the same in all three languages. Each page opens with what it proves and
 * points to the sheet, since the piece has no Docs page. The color scheme comes
 * from the global Storybook selector.
 */
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { validationPage } from '../../shared/docs/validation';
import type { GlobalsContext } from '../../shared/docs/validation';
import './nph-kbd';

const meta: Meta = {
  title: 'Components/nph-kbd/Validation',
};

export default meta;

type Story = StoryObj;

const row = 'display: flex; align-items: center; gap: var(--nph-space-inline-tight);';

const page = (storyId: string) => ({ piece: 'nph-kbd', storyId: `components-nph-kbd-validation--${storyId}`, sheet: true });

/** One key per piece, through the text property. */
export const SingleKey: Story = {
  name: 'Key',
  render: (_args, context: GlobalsContext) =>
    validationPage(
      context,
      page('single-key'),
      html`<div style=${row}>
        <nph-kbd text="K"></nph-kbd>
        <nph-kbd text="Esc"></nph-kbd>
        <nph-kbd text="Shift"></nph-kbd>
        <nph-kbd text="F2"></nph-kbd>
      </div>`,
    ),
};

/** The combination joins one piece per key, side by side. */
export const Combination: Story = {
  name: 'Combination',
  render: (_args, context: GlobalsContext) =>
    validationPage(
      context,
      page('combination'),
      html`<div style=${row}>
        <nph-kbd text="Ctrl"></nph-kbd>
        <nph-kbd text="Shift"></nph-kbd>
        <nph-kbd text="P"></nph-kbd>
      </div>`,
    ),
};

/**
 * The same combination on macOS, with the system symbols: Command, Shift and the
 * letter. The text of each key arrives ready from the consuming application,
 * which picks the set by the user's system; the piece does not detect the system.
 */
export const MacCombination: Story = {
  name: 'Combination on macOS',
  render: (_args, context: GlobalsContext) =>
    validationPage(
      context,
      page('mac-combination'),
      html`<div style=${row}>
        <nph-kbd text="⌘"></nph-kbd>
        <nph-kbd text="⇧"></nph-kbd>
        <nph-kbd text="P"></nph-kbd>
      </div>`,
    ),
};

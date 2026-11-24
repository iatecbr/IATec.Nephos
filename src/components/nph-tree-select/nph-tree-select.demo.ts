/**
 * Demonstration frame shared by the `nph-tree-select` Validation stories.
 *
 * It lives in a file that does not end in `.stories.ts`, so Storybook's glob does not index it. The scenery
 * here (the room kept under each field for its open panel, the figure with the scheme of its own) is NOT a
 * precedent for component CSS: the piece takes its measures from the `tree-select/*` tokens and the tokens of
 * the field it reuses, and its place from the field, in the top layer.
 *
 * Every visible text, the items of the tree included, comes from the dictionary, passed in by the page that
 * calls this file.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../nph-field/nph-field';
import './nph-tree-select';
import type { NphTreeNode } from '../nph-tree/nph-tree.model';
import type { NphTreeSelectMode, NphTreeSelectSize } from './nph-tree-select';

export type Scheme = 'light' | 'dark';

/** The texts of the examples, from the `treeSelectValidation` dictionary. */
export interface ExampleTexts {
  lightCaption: string;
  darkCaption: string;
  fieldLabel: string;
  placeholderSingle: string;
  placeholderSearch: string;
  placeholderMultiple: string;
  removeLabel: string;
  clearLabel: string;
  subject: string;
  emptyHeading: string;
  emptyDescription: string;
  noResultHeading: string;
  noResultDescription: string;
  errorText: string;
  retryText: string;
  errorMessage: string;
  typed: string;
  documents: string;
  contracts: string;
  contract2025: string;
  contract2026: string;
  reports: string;
  images: string;
  logo: string;
  readme: string;
  shortWindow: string;
}

/** The tree of the examples: folders, a branch inside a branch, and a file at the first level. */
export function items(v: ExampleTexts): NphTreeNode[] {
  return [
    {
      id: 'documents',
      label: v.documents,
      children: [
        {
          id: 'contracts',
          label: v.contracts,
          children: [
            { id: 'contract-2025', label: v.contract2025 },
            { id: 'contract-2026', label: v.contract2026 },
          ],
        },
        { id: 'reports', label: v.reports },
      ],
    },
    { id: 'images', label: v.images, children: [{ id: 'logo', label: v.logo }] },
    { id: 'readme', label: v.readme },
  ];
}

export interface CellOptions {
  mode?: NphTreeSelectMode;
  size?: NphTreeSelectSize;
  open?: boolean;
  value?: string;
  values?: string[];
  query?: string;
  expanded?: string[];
  invalid?: boolean;
  disabled?: boolean;
  loading?: boolean;
  empty?: boolean;
  counter?: boolean;
  withField?: boolean;
  tree?: NphTreeNode[];
  /** The width of the field, and so of its panel, in pixels. */
  width?: number;
  /** The room kept under the field for the panel it opens, in pixels. */
  room?: number;
}

/** One tree select, with the room its panel needs under it. */
export function cell(v: ExampleTexts, options: CellOptions = {}): TemplateResult {
  const mode = options.mode ?? 'single';
  const placeholder = mode === 'single' ? v.placeholderSingle : mode === 'search' ? v.placeholderSearch : v.placeholderMultiple;
  const tree = options.empty === true ? [] : (options.tree ?? items(v));
  const field = html`<nph-tree-select
    mode=${mode}
    style=${ifDefined(options.width === undefined ? undefined : `inline-size: ${String(options.width)}px`)}
    size=${options.size ?? 'default'}
    ?open=${options.open === true}
    ?invalid=${options.invalid === true}
    ?disabled=${options.disabled === true}
    ?loading=${options.loading === true}
    ?counter=${options.counter === true}
    ?icons=${true}
    subject=${ifDefined(options.counter === true ? v.subject : undefined)}
    placeholder=${placeholder}
    label=${v.fieldLabel}
    remove-label=${v.removeLabel}
    clear-label=${v.clearLabel}
    empty-heading=${v.emptyHeading}
    empty-description=${v.emptyDescription}
    no-result-heading=${v.noResultHeading}
    no-result-description=${v.noResultDescription}
    error-text=${v.errorText}
    retry-text=${v.retryText}
    .items=${tree}
    .expanded=${options.expanded ?? []}
    .value=${options.value ?? ''}
    .values=${options.values ?? []}
    .query=${options.query ?? ''}
  ></nph-tree-select>`;
  const inner = options.withField === true ? html`<nph-field label=${v.fieldLabel}>${field}</nph-field>` : field;
  const room = options.open === true ? (options.room ?? 340) : 0;
  return html`<div style="min-inline-size: 460px; min-block-size: ${String(room + 48)}px; padding-block-end: ${String(room)}px;">${inner}</div>`;
}

/**
 * The same example in a color scheme of its own, on the same element that resolves the tokens (P67). A story
 * is never duplicated per mode. The open panel is a descendant of the figure, so it takes the scheme too.
 */
export function inScheme(scheme: Scheme, caption: string, content: TemplateResult): TemplateResult {
  return html`<figure
    data-nph-color-scheme=${scheme}
    style="margin: 0; display: flex; flex-direction: column; gap: var(--nph-space-inline); padding: var(--nph-space-section); background: var(--nph-color-background); color: var(--nph-color-foreground); border: var(--nph-border-width) solid var(--nph-color-border); border-radius: var(--nph-radius-control); inline-size: fit-content; max-inline-size: 100%; box-sizing: border-box;"
  >
    ${content}
    <figcaption style="color: var(--nph-color-muted-foreground);">${caption}</figcaption>
  </figure>`;
}

/** The same example in light and in dark mode, side by side. */
export function bothModes(captions: { light: string; dark: string }, content: () => TemplateResult): TemplateResult {
  return html`<div style="display: flex; flex-wrap: wrap; align-items: flex-start; gap: var(--nph-space-stack);">
    ${inScheme('light', captions.light, content())} ${inScheme('dark', captions.dark, content())}
  </div>`;
}

/** The three required examples: choosing a file, files that go in a submission, finding a contract in a large tree. */
export function examples(v: ExampleTexts): TemplateResult {
  return html`<div style="display: flex; flex-direction: column; gap: var(--nph-space-section);">
    ${cell(v, { mode: 'single', open: true, value: 'contract-2025', expanded: ['documents', 'contracts'], withField: true })}
    ${cell(v, { mode: 'multiple', open: true, values: ['contracts', 'contract-2025', 'contract-2026', 'readme'], expanded: ['documents', 'contracts'], withField: true })}
    ${cell(v, { mode: 'search', open: true, query: v.typed, withField: true })}
  </div>`;
}

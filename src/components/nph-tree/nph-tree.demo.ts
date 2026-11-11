/**
 * Demonstration frame shared by the `nph-tree` Validation and Docs pages.
 *
 * It lives in a file that does not end in `.stories.ts`, so Storybook's glob does not index it. The
 * scenery here — the card the tree lives in, the widths that force the cut label, the container that
 * scrolls — is NOT a precedent for component CSS: the piece takes its measures from the `tree/*`
 * tokens, and it has no background, border or height of its own.
 *
 * The examples are the required ones of the accepted documentation (frame `5876:216753`): choose the
 * destination folder, in single selection; check permissions by area, in multiple selection, with the
 * parent mixed; a branch that loads next to a branch that failed to load. Every visible text comes
 * from the dictionary, passed in by the page that calls this file.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';

import './nph-tree';
import type { NphTreeNode, NphTreeSelection } from './nph-tree';

export type Scheme = 'light' | 'dark';

/** The texts of the examples, from the `treeValidation` dictionary. */
export interface ExampleTexts {
  explorerLabel: string;
  destinationLabel: string;
  permissionsLabel: string;
  loadLabel: string;
  emptyHeading: string;
  emptyDescription: string;
  errorText: string;
  retryText: string;
  documents: string;
  reports: string;
  q1: string;
  q2: string;
  notes: string;
  images: string;
  logo: string;
  photos: string;
  archive: string;
  oldFiles: string;
  readme: string;
  sales: string;
  leads: string;
  quotes: string;
  invoices: string;
  support: string;
  tickets: string;
  chat: string;
  finance: string;
  payments: string;
  refunds: string;
  sharedDrive: string;
  backups: string;
  longLabel: string;
  levels: string[];
  itemName: string;
  destinationTitle: string;
  permissionsTitle: string;
  loadTitle: string;
}

/**
 * The same example in a color scheme of its own, on the same element that resolves the tokens
 * (P67). A story is never duplicated per mode.
 */
export function inScheme(scheme: Scheme, caption: string, content: TemplateResult): TemplateResult {
  return html`<figure
    data-nph-color-scheme=${scheme}
    style="margin: 0; display: flex; flex-direction: column; gap: var(--nph-space-inline); padding: var(--nph-space-section); background: var(--nph-color-background); color: var(--nph-color-foreground); border: var(--nph-border-width) solid var(--nph-color-border); border-radius: var(--nph-radius-control); inline-size: 100%; min-inline-size: var(--nph-layout-field-width); max-inline-size: 100%; box-sizing: border-box;"
  >
    ${content}
    <figcaption style="color: var(--nph-color-muted-foreground);">${caption}</figcaption>
  </figure>`;
}

/** The same example in light and in dark mode, one under the other. */
export function bothModes(captions: { light: string; dark: string }, content: () => TemplateResult): TemplateResult {
  return html`<div style="display: flex; flex-direction: column; gap: var(--nph-space-stack);">
    ${inScheme('light', captions.light, content())} ${inScheme('dark', captions.dark, content())}
  </div>`;
}

/** The width of a tree inside a matrix cell. A table cell sizes itself from its content, and the tree brings no width of its own. */
export const MATRIX_WIDTH = '20rem';

/** A width that cuts the long labels. */
export const NARROW_WIDTH = '14rem';

export interface TreeOptions {
  items: NphTreeNode[];
  selection?: NphTreeSelection;
  selected?: string | null;
  checked?: string[];
  expanded?: string[];
  icons?: boolean;
  checkStrictly?: boolean;
  loading?: boolean;
  label?: string;
  /** The width of the frame, to force the cut label. */
  width?: string;
}

/** A tree with every text the page owes it, at the width asked for. */
export function tree(texts: ExampleTexts, options: TreeOptions): TemplateResult {
  const { items, selection = 'none', selected = null, checked = [], expanded = [], icons = false, checkStrictly = false, loading = false, label, width } = options;
  const piece = html`<nph-tree
    .items=${items}
    .selected=${selected}
    .checked=${checked}
    .expanded=${expanded}
    selection=${selection}
    ?icons=${icons}
    ?check-strictly=${checkStrictly}
    ?loading=${loading}
    label=${label ?? texts.explorerLabel}
    empty-heading=${texts.emptyHeading}
    empty-description=${texts.emptyDescription}
    error-text=${texts.errorText}
    retry-text=${texts.retryText}
  ></nph-tree>`;
  return html`<div style="inline-size: ${width ?? '100%'}; max-inline-size: 100%;">${piece}</div>`;
}

/** The folders and files of the examples. */
export function fileNodes(texts: ExampleTexts): NphTreeNode[] {
  return [
    {
      id: 'documents',
      label: texts.documents,
      children: [
        {
          id: 'reports',
          label: texts.reports,
          children: [
            { id: 'q1', label: texts.q1 },
            { id: 'q2', label: texts.q2 },
          ],
        },
        { id: 'notes', label: texts.notes },
      ],
    },
    {
      id: 'images',
      label: texts.images,
      children: [
        { id: 'logo', label: texts.logo },
        { id: 'photos', label: texts.photos, disabled: true },
      ],
    },
    { id: 'archive', label: texts.archive, children: [{ id: 'old', label: texts.oldFiles }] },
    { id: 'readme', label: texts.readme },
  ];
}

/** The areas of a permission tree: the last item of the last area is disabled. */
export function permissionNodes(texts: ExampleTexts): NphTreeNode[] {
  return [
    {
      id: 'sales',
      label: texts.sales,
      children: [
        { id: 'leads', label: texts.leads },
        { id: 'quotes', label: texts.quotes },
        { id: 'invoices', label: texts.invoices },
      ],
    },
    {
      id: 'support',
      label: texts.support,
      children: [
        { id: 'tickets', label: texts.tickets },
        { id: 'chat', label: texts.chat },
      ],
    },
    {
      id: 'finance',
      label: texts.finance,
      children: [
        { id: 'payments', label: texts.payments },
        { id: 'refunds', label: texts.refunds, disabled: true },
      ],
    },
  ];
}

/** A branch that loads and a branch that failed to load, both open. */
export function loadNodes(texts: ExampleTexts): NphTreeNode[] {
  return [
    { id: 'shared-drive', label: texts.sharedDrive, branch: true },
    { id: 'backups', label: texts.backups, branch: true, error: true },
    { id: 'documents', label: texts.documents, children: [{ id: 'notes', label: texts.notes }] },
  ];
}

/** Items whose labels do not fit the row: the label is cut and the balloon holds it all. */
export function longNodes(texts: ExampleTexts): NphTreeNode[] {
  return [
    { id: 'long', label: texts.longLabel },
    { id: 'short', label: texts.readme },
    { id: 'long-folder', label: texts.longLabel, children: [{ id: 'long-child', label: texts.longLabel }] },
  ];
}

/** A tree that goes down six levels, to show the indent. */
export function deepNodes(texts: ExampleTexts): NphTreeNode[] {
  const build = (index: number): NphTreeNode => ({
    id: `level-${String(index)}`,
    label: texts.levels[index] as string,
    ...(index < texts.levels.length - 1 ? { children: [build(index + 1)] } : {}),
  });
  return [build(0)];
}

/** Many items, for a container that scrolls. */
export function manyNodes(texts: ExampleTexts, count = 40): NphTreeNode[] {
  return Array.from({ length: count }, (_, index) => ({ id: `item-${String(index)}`, label: `${texts.itemName} ${String(index + 1)}` }));
}

/** The ids of every branch of a list of nodes, to open them all. */
export function branchIds(nodes: readonly NphTreeNode[]): string[] {
  return nodes.flatMap((node) => (node.children === undefined ? [] : [node.id, ...branchIds(node.children)]));
}

/** The tree inside a card that gives the surface, the room and the scroll. */
export function inCard(content: TemplateResult, height?: string): TemplateResult {
  return html`<div
    style="box-sizing: border-box; background: var(--nph-color-card); border: var(--nph-border-width) solid var(--nph-color-border); border-radius: var(--nph-radius-control); ${height === undefined ? '' : `block-size: ${height}; overflow-y: auto;`}"
  >
    ${content}
  </div>`;
}

/** A titled example inside a card. */
function titled(title: string, content: TemplateResult): TemplateResult {
  return html`<div style="display: flex; flex-direction: column; gap: var(--nph-space-inline);">
    <strong>${title}</strong>
    ${inCard(content)}
  </div>`;
}

/** The first required example: choose the destination folder, in single selection, with the icons on. */
export function destinationExample(texts: ExampleTexts): TemplateResult {
  return titled(
    texts.destinationTitle,
    tree(texts, { items: fileNodes(texts), selection: 'single', selected: 'reports', expanded: ['documents'], icons: true, label: texts.destinationLabel }),
  );
}

/** The second required example: permissions by area, in multiple selection, with the parent mixed. */
export function permissionsExample(texts: ExampleTexts): TemplateResult {
  return titled(
    texts.permissionsTitle,
    tree(texts, {
      items: permissionNodes(texts),
      selection: 'multiple',
      checked: ['leads', 'quotes', 'tickets', 'chat', 'payments'],
      expanded: ['sales', 'support', 'finance'],
      label: texts.permissionsLabel,
    }),
  );
}

/** The third required example: a branch that loads and a branch that failed to load. */
export function loadExample(texts: ExampleTexts): TemplateResult {
  return titled(texts.loadTitle, tree(texts, { items: loadNodes(texts), expanded: ['shared-drive', 'backups'], icons: true, label: texts.loadLabel }));
}

/** The three required examples, one under the other, in the frame of a scheme. */
export function examples(texts: ExampleTexts): TemplateResult {
  return html`<div style="display: flex; flex-direction: column; gap: var(--nph-space-section);">
    ${destinationExample(texts)} ${permissionsExample(texts)} ${loadExample(texts)}
  </div>`;
}

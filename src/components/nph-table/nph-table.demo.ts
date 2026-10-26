/**
 * Demonstration frame and table fixtures shared by the `nph-table` Validation and Docs pages.
 *
 * It lives in a file that does not end in `.stories.ts`, so Storybook's glob does not index
 * it. The scenery here — the gaps, the framed figure, the narrow box — is NOT a precedent for
 * component CSS: the piece itself takes every measure from tokens.
 *
 * Every visible text comes from the language dictionary of the page that calls these
 * functions, under `tableValidation.sample`: this file holds none. The images are data URIs
 * of an abstract picture, never a network address.
 *
 * The three examples are the required ones of the accepted frame (`2584:66651`): items
 * grouped by category, an open order and a table with caption. The category content is not
 * defined yet (D1 of DSA-49): until then the groups are the first level of the tree.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';

import { format } from '../../../.storybook/i18n/index.js';
import type en from '../../../.storybook/i18n/en.json';
import './nph-table';
import type { NphTableColumn, NphTableFooter, NphTableRow } from './nph-table';
import '../nph-button/nph-button';

export type Scheme = 'light' | 'dark';

/** The sample texts of the chosen language. */
export type Sample = (typeof en)['tableValidation']['sample'];

/** An abstract picture as a data URI. */
function picture(background: string, shape: string): string {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">` +
    `<rect width="80" height="80" fill="${background}"/>` +
    `<circle cx="28" cy="32" r="20" fill="${shape}"/>` +
    `<rect x="40" y="40" width="32" height="32" fill="${shape}" fill-opacity="0.6"/>` +
    `</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const IMAGE_A = picture('#2f4858', '#f6ae2d');
export const IMAGE_B = picture('#86bbd8', '#33658a');

/**
 * The same example in a color scheme of its own, on the same element that resolves the
 * tokens (P67). A story is never duplicated per mode.
 */
export function inScheme(scheme: Scheme, caption: string, content: TemplateResult): TemplateResult {
  return html`<figure
    data-nph-color-scheme=${scheme}
    style="margin: 0; display: flex; flex-direction: column; gap: var(--nph-space-inline); padding: var(--nph-space-section); background: var(--nph-color-background); color: var(--nph-color-foreground); border: var(--nph-border-width) solid var(--nph-color-border); border-radius: var(--nph-radius-control); min-inline-size: 0; max-inline-size: 100%; box-sizing: border-box;"
  >
    ${content}
    <figcaption style="color: var(--nph-color-muted-foreground);">${caption}</figcaption>
  </figure>`;
}

/** A box narrower than the table, so its scroll area overflows and takes the focus. */
export function narrow(content: TemplateResult): TemplateResult {
  return html`<div style="inline-size: var(--nph-layout-field-width); max-inline-size: 100%;">${content}</div>`;
}

/** Unit and amount: text to the start, numbers to the end. */
export function basicColumns(s: Sample): NphTableColumn[] {
  return [
    { key: 'unit', header: s.unit },
    { key: 'amount', header: s.amount, align: 'end' },
  ];
}

/** Four units; the third has no amount, so the no-value dash shows. */
export function basicRows(s: Sample): NphTableRow[] {
  const amounts = [s.amounts[0], s.amounts[1], null, s.amounts[2]];
  return s.units.map((unit, index) => ({ key: `unit-${index}`, cells: { unit, amount: amounts[index] ?? null } }));
}

export function basicFooter(s: Sample): NphTableFooter {
  return { unit: s.totalLabel, amount: s.totalAmount };
}

/** A long list for the fixed header: the units numbered, the amounts repeated. */
export function manyRows(s: Sample, count: number): NphTableRow[] {
  return Array.from({ length: count }, (_, index) => ({
    key: `many-${index}`,
    cells: { unit: format(s.unitNumber, { number: index + 1 }), amount: s.amounts[index % s.amounts.length] ?? null },
  }));
}

/** A basic table with the caption, description, total and the no-value label of the sample. */
export function basicTable(s: Sample, attributes: Partial<Record<'size' | 'framed' | 'striped' | 'grid' | 'sticky', boolean | string>> = {}, rows = basicRows(s)): TemplateResult {
  return html`<nph-table
    caption=${s.caption}
    no-value-label=${s.noValue}
    size=${(attributes.size as string | undefined) ?? 'default'}
    ?framed=${Boolean(attributes.framed)}
    ?striped=${Boolean(attributes.striped)}
    ?grid=${Boolean(attributes.grid)}
    ?sticky-header=${Boolean(attributes.sticky)}
    .columns=${basicColumns(s)}
    .rows=${rows}
    .footer=${basicFooter(s)}
  ></nph-table>`;
}

/** The first set of composite cells: person, badge, status, icon and text, rating. */
export function peopleTable(s: Sample): TemplateResult {
  const columns: NphTableColumn[] = [
    { key: 'person', header: s.person },
    { key: 'situation', header: s.situation },
    { key: 'status', header: s.status },
    { key: 'type', header: s.type },
    { key: 'rating', header: s.rating, align: 'end' },
  ];
  const situations = [
    { text: s.paid, severity: 'success' as const },
    { text: s.late, severity: 'warn' as const },
    { text: s.paid, severity: 'success' as const },
  ];
  const statuses = ['success', 'error', 'success'] as const;
  const rows: NphTableRow[] = s.people.map((name, index) => ({
    key: `person-${index}`,
    cells: {
      person: { type: 'person', text: name, secondary: s.roles[index] ?? '', src: index === 1 ? '' : index === 0 ? IMAGE_A : IMAGE_B },
      situation: { type: 'badge', ...(situations[index] as { text: string; severity: 'success' | 'warn' }) },
      status: { type: 'status', status: statuses[index] ?? 'success', text: statuses[index] === 'error' ? s.failed : s.paid },
      type: { type: 'icon-text', icon: 'calendar', text: index === 1 ? s.yearly : s.monthly },
      rating: { type: 'rating', text: s.ratings[index] ?? '' },
    },
  }));
  return html`<nph-table label=${s.label} no-value-label=${s.noValue} .columns=${columns} .rows=${rows}></nph-table>`;
}

/** The second set: link, thumbnail, truncated text, button, actions, mixed actions, loading and no value. */
export function actionsTable(s: Sample): TemplateResult {
  const columns: NphTableColumn[] = [
    { key: 'document', header: s.document },
    { key: 'product', header: s.product },
    { key: 'note', header: s.note, width: '10rem' },
    { key: 'action', header: s.action },
    { key: 'actions', header: s.actions },
    { key: 'mixed', header: s.mixedActions },
  ];
  const rows: NphTableRow[] = s.people.map((name, index) => ({
    key: `actions-${index}`,
    cells: {
      document: { type: 'link', text: s.receipt, href: '#receipt' },
      product: { type: 'thumbnail', src: index === 2 ? '' : index === 0 ? IMAGE_A : IMAGE_B, text: s.products[index] ?? '' },
      note: index === 1 ? null : index === 2 ? { type: 'loading' } : { type: 'truncated', text: s.longNote },
      action: { type: 'button', text: s.pay, action: 'pay' },
      actions: { type: 'actions', editLabel: format(s.editOf, { name }), moreLabel: format(s.moreOf, { name }) },
      mixed: { type: 'mixed-actions', text: s.edit, moreLabel: format(s.moreOf, { name }) },
    },
  }));
  return html`<nph-table label=${s.label} no-value-label=${s.noValue} .columns=${columns} .rows=${rows}></nph-table>`;
}

/** Orders with their expanded item; `open` and `loading` say which state each order shows. */
export function orderRows(s: Sample, states: ReadonlyArray<'closed' | 'open' | 'loading'>): NphTableRow[] {
  return s.orders.slice(0, states.length).map((order, index) => ({
    key: `order-${index}`,
    cells: { unit: order, amount: s.amounts[index] ?? null },
    toggleLabel: format(s.detailsOf, { name: order }),
    open: states[index] === 'open',
    loading: states[index] === 'loading',
    detail: {
      name: s.products[index] ?? '',
      description: s.orderDescription,
      src: index === 0 ? IMAGE_A : IMAGE_B,
      values: [
        { label: s.quantity, value: '2' },
        { label: s.price, value: s.amounts[index] ?? '' },
      ],
      badge: { text: s.inStock, severity: 'success' },
    },
  }));
}

export function orderTable(s: Sample, states: ReadonlyArray<'closed' | 'open' | 'loading'>, caption = ''): TemplateResult {
  return html`<nph-table
    caption=${caption}
    label=${s.label}
    no-value-label=${s.noValue}
    .columns=${basicColumns(s)}
    .rows=${orderRows(s, states)}
  ></nph-table>`;
}

/** A hierarchy in three levels: region, city, district; `open` opens every level. */
export function treeRows(s: Sample, open: boolean): NphTableRow[] {
  const [south, porto, district, curitiba, north] = s.regions;
  return [
    {
      key: 'south',
      cells: { unit: south ?? '', amount: s.amounts[0] ?? null },
      toggleLabel: format(s.levelsOf, { name: south ?? '' }),
      open,
      children: [
        {
          key: 'porto',
          cells: { unit: porto ?? '', amount: s.amounts[1] ?? null },
          toggleLabel: format(s.levelsOf, { name: porto ?? '' }),
          open,
          children: [{ key: 'district', cells: { unit: district ?? '', amount: s.amounts[1] ?? null } }],
        },
        { key: 'curitiba', cells: { unit: curitiba ?? '', amount: s.amounts[2] ?? null } },
      ],
    },
    { key: 'north', cells: { unit: north ?? '', amount: s.amounts[2] ?? null } },
  ];
}

export function treeTable(s: Sample, open: boolean): TemplateResult {
  return html`<nph-table label=${s.label} no-value-label=${s.noValue} .columns=${basicColumns(s)} .rows=${treeRows(s, open)}></nph-table>`;
}

/** Two channel columns under one title, between the unit and the total. */
export function groupTable(s: Sample): TemplateResult {
  const columns: NphTableColumn[] = [
    { key: 'unit', header: s.unit },
    { key: 'web', header: s.web, align: 'end', group: s.accesses },
    { key: 'app', header: s.app, align: 'end', group: s.accesses },
    { key: 'total', header: s.totalLabel, align: 'end' },
  ];
  const rows: NphTableRow[] = s.units.slice(0, 2).map((unit, index) => ({
    key: `group-${index}`,
    cells: { unit, web: s.channels[0] ?? null, app: s.channels[1] ?? null, total: s.channels[2] ?? null },
  }));
  return html`<nph-table label=${s.label} no-value-label=${s.noValue} .columns=${columns} .rows=${rows}></nph-table>`;
}

export function emptyTable(s: Sample): TemplateResult {
  return html`<nph-table
    caption=${s.caption}
    empty-heading=${s.emptyHeading}
    empty-description=${s.emptyDescription}
    framed
    .columns=${basicColumns(s)}
    .rows=${[]}
  ></nph-table>`;
}

/** Caption with description, total and the main action in the slot. */
export function captionTable(s: Sample, framed = false): TemplateResult {
  return html`<nph-table
    caption=${s.caption}
    description=${s.description}
    total=${s.total}
    no-value-label=${s.noValue}
    ?framed=${framed}
    .columns=${basicColumns(s)}
    .rows=${basicRows(s)}
    .footer=${basicFooter(s)}
  >
    <nph-button slot="action" severity="secondary" emphasis="outline" size="compact" text=${s.export}></nph-button>
  </nph-table>`;
}

/** A table wider than its box: the scroll area overflows and takes the focus. */
export function wideCaptionTable(s: Sample): TemplateResult {
  const columns: NphTableColumn[] = [
    { key: 'unit', header: s.unit },
    { key: 'person', header: s.person },
    { key: 'note', header: s.note },
    { key: 'amount', header: s.amount, align: 'end' },
  ];
  const rows: NphTableRow[] = s.units.slice(0, 3).map((unit, index) => ({
    key: `wide-${index}`,
    cells: { unit, person: s.people[index] ?? null, note: s.longNote, amount: s.amounts[index] ?? null },
  }));
  return narrow(html`<nph-table
    caption=${s.caption}
    description=${s.description}
    total=${s.total}
    no-value-label=${s.noValue}
    framed
    .columns=${columns}
    .rows=${rows}
  ></nph-table>`);
}

/** Example: items grouped by category, the groups as the first level of the tree (D1), the total in the footer. */
export function groupedByCategory(s: Sample): TemplateResult {
  const rows: NphTableRow[] = s.categories.map((category, group) => ({
    key: `category-${group}`,
    cells: { unit: category, amount: s.categoryTotals[group] ?? null },
    toggleLabel: format(s.itemsOf, { name: category }),
    open: true,
    children: (s.categoryItems[group] ?? []).map((item, index) => ({
      key: `category-${group}-${index}`,
      cells: { unit: item, amount: s.categoryAmounts[group]?.[index] ?? null },
    })),
  }));
  return html`<nph-table
    caption=${s.groupCaption}
    no-value-label=${s.noValue}
    framed
    .columns=${basicColumns(s)}
    .rows=${rows}
    .footer=${{ unit: s.totalLabel, amount: s.categoryTotal }}
  ></nph-table>`;
}

/** Example: an open order, the expanding row with the item and its photo. */
export function openOrder(s: Sample): TemplateResult {
  return html`<nph-table
    caption=${s.orderCaption}
    no-value-label=${s.noValue}
    framed
    .columns=${basicColumns(s)}
    .rows=${orderRows(s, ['open', 'closed'])}
  ></nph-table>`;
}

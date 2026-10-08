/**
 * Reading pages of `nph-icon`: documentation and visual catalog.
 *
 * Neither proves the contract — that is the role of `Components/nph-icon/
 * Validation` and of the tests. Here one reads and searches.
 *
 * The text comes from the language dictionary, in `.storybook/i18n/`. Each
 * story is UNIQUE: it reads `globals.locale` and fetches the translation.
 * Technical identifiers — `nph-icon`, token names, attributes and commands —
 * appear literally and are the same in any language.
 *
 * The gallery search belongs to THIS page, not to the component API: no
 * attribute, property, event or style of `nph-icon` was created for it.
 */
import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, format, translations } from '../../../.storybook/i18n/index.js';
import './nph-icon';
import { NPH_ICON_NAMES, NPH_ICON_SIZES } from './nph-icon.icons';
import {
  CATEGORIES,
  CORE_TOTAL,
  button,
  counter,
  field,
  filterNames,
  grid,
  searchLabel,
  specimen,
  tile,
  tileName,
} from './nph-icon.demo';
import {
  header,
  body,
  demo,
  source,
  index,
  list,
  matrix,
  note,
  section,
  table,
  text,
  useDontUse,
} from '../../shared/docs/page';

const meta: Meta = {
  title: 'Components/nph-icon/Docs',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj;

interface GlobalsContext {
  globals?: Record<string, unknown>;
}

function localeOf(context: GlobalsContext | undefined): string {
  return (context?.globals?.[LOCALE_GLOBAL] as string | undefined) ?? DEFAULT_LOCALE;
}

/*
 * `hidden` must beat the inline `display` of the frame. Scenario rule,
 * restricted to this page.
 */
const hidingRule = html`
  <style>
    [hidden] {
      display: none !important;
    }
  </style>
`;

/* Icons of one category in the matrix: cells of equal width, as many as fit in the row. */
const matrixRow =
  'display: grid; grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr)); gap: var(--nph-space-stack); padding-block-end: var(--nph-space-stack);';

/** Section ids: technical identifiers, the same in any language. */
const SECTIONS = {
  whenToUse: 'when-to-use',
  api: 'api',
  core: 'core',
  size: 'size',
  color: 'color',
  accessibility: 'accessibility',
  invalid: 'invalid-input',
  references: 'references',
} as const;

/**
 * Catalog category ids, in the order of `CATEGORIES`: the groups
 * of `icones_nucleo`, in `design.md`, with a technical name in English.
 */
const CATEGORY_IDS = [
  'navigation-and-menus',
  'direction-and-disclosure',
  'action',
  'status-and-communication',
  'content-and-data',
] as const;

/**
 * Reading page, assembled with the blocks of `src/shared/docs/page.ts`. Every
 * block declares the origin of the rule it shows; nothing here is decided on
 * this page.
 */
export const Documentation: Story = {
  name: 'Documentation',
  render: (_args, context: GlobalsContext) => {
    const dictionary = translations(localeOf(context));
    const d = dictionary.docs;
    const categories = dictionary.categories;
    const coreHeading = format(d.coreTitle, { total: CORE_TOTAL });

    return html`
      <div style=${body}>
        ${header('nph-icon', d.summary)}
        ${matrix(
          d.matrixLabel,
          [],
          CATEGORIES.map((category, position) => ({
            label: categories[position] ?? '',
            cells: [
              html`<div style=${matrixRow}>
                ${category.map((name) => specimen(html`<nph-icon name=${name} size="md"></nph-icon>`, name))}
              </div>`,
            ],
          })),
        )}

        ${note('info', d.derivedTitle, d.derivedText1)}

        ${index(d.onThisPage, [
          { id: SECTIONS.whenToUse, title: d.whenToUseTitle },
          { id: SECTIONS.api, title: d.apiTitle },
          { id: SECTIONS.core, title: coreHeading },
          { id: SECTIONS.size, title: d.sizeTitle },
          { id: SECTIONS.color, title: d.colorTitle },
          { id: SECTIONS.accessibility, title: d.accessibilityTitle },
          { id: SECTIONS.invalid, title: d.invalidTitle },
          { id: SECTIONS.references, title: d.referencesTitle },
        ])}

        ${section(
          SECTIONS.whenToUse,
          d.whenToUseTitle,
          html`
            ${useDontUse(
              { title: d.whenToUseTitle, items: d.whenToUse },
              { title: d.whenNotToUseTitle, items: d.whenNotToUse },
            )}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(
          SECTIONS.api,
          d.apiTitle,
          html`
            ${table(
              d.apiHeader,
              d.api.map(
                ([term, description]: [string, string]) =>
                  [term, format(description, { total: CORE_TOTAL })] as const,
              ),
              'auto',
            )}
            ${source(d.sourceLabel, d.sourceSpecContract)}
          `,
        )}

        ${section(
          SECTIONS.core,
          coreHeading,
          html`
            ${text(d.coreText)}
            ${table(
              d.coreHeader,
              CATEGORIES.map(
                (category, index) =>
                  [categories[index] ?? '', format(d.coreCount, { count: category.length })] as const,
              ),
              'text',
            )}
            ${note('info', d.solidNoteTitle, d.coreRule)}
            ${source(d.sourceLabel, d.sourceCore)}
          `,
        )}

        ${section(
          SECTIONS.size,
          d.sizeTitle,
          html`
            ${text(d.sizeText)}
            ${demo(
              html`${NPH_ICON_SIZES.map(
                (size) => html`
                  <div style="display: flex; flex-direction: column; align-items: center; gap: var(--nph-space-inline-tight);">
                    <nph-icon name="gear" size=${size}></nph-icon>
                    <code style="color: var(--nph-color-muted-foreground);">${size}</code>
                  </div>
                `,
              )}`,
              d.sizeCaption,
            )}
            ${table(
              d.sizeHeader,
              d.sizeTable.map(([token, usage]: [string, string]) => [token, usage] as const),
            )}
            ${note('info', d.overflowNoteTitle, d.sizeOverflow)}
            ${source(d.sourceLabel, d.sourceSize)}
          `,
        )}

        ${section(
          SECTIONS.color,
          d.colorTitle,
          html`${text(d.colorText)} ${source(d.sourceLabel, d.sourceColor)}`,
        )}

        ${section(
          SECTIONS.accessibility,
          d.accessibilityTitle,
          html`${list(d.accessibility)} ${source(d.sourceLabel, d.sourceAccessibility)}`,
        )}

        ${section(
          SECTIONS.invalid,
          d.invalidTitle,
          html`
            ${text(d.invalidText)}
            ${note('warning', d.invalidNoteTitle, d.invalidPointer)}
            ${source(d.sourceLabel, d.sourceInvalid)}
          `,
        )}

        ${section(SECTIONS.references, d.referencesTitle, list(d.references))}
      </div>
    `;
  },
};


function galleryOf(target: EventTarget | null): HTMLElement | null {
  return target instanceof HTMLElement
    ? target.closest<HTMLElement>('[data-nph-gallery]')
    : null;
}

/**
 * Filters the grid in the browser. The displayed set always comes from
 * `filterNames` over `NPH_ICON_NAMES`: it is impossible for this page to show
 * an icon that is not in the core.
 *
 * The language comes from the DOM itself, written at render time: the event
 * handler has no access to the story context.
 */
function applyFilter(gallery: HTMLElement, term: string): void {
  const g = translations(gallery.dataset['nphLocale'] ?? DEFAULT_LOCALE).gallery;
  const matches = new Set<string>(filterNames(NPH_ICON_NAMES, term));

  for (const item of gallery.querySelectorAll<HTMLElement>('[data-nph-name]')) {
    item.hidden = !matches.has(item.dataset['nphName'] ?? '');
  }

  for (const category of gallery.querySelectorAll<HTMLElement>('[data-nph-category]')) {
    category.hidden =
      category.querySelectorAll('[data-nph-name]:not([hidden])').length === 0;

    /* The index chip disappears with the category: a link to a hidden section leads nowhere. */
    const id = category.querySelector('section[id]')?.id ?? '';
    const chip = gallery.querySelector(`nav a[href="#${id}"]`)?.closest('li');
    if (chip instanceof HTMLElement) {
      chip.hidden = category.hidden;
    }
  }

  const empty = gallery.querySelector<HTMLElement>('[data-nph-empty]');
  if (empty !== null) {
    empty.hidden = matches.size > 0;
  }

  /* The counter only changes text when the number changes: a screen reader is not a notice board. */
  const counter = gallery.querySelector<HTMLElement>('[data-nph-counter]');
  const total = String(matches.size);
  if (counter !== null && counter.dataset['nphFound'] !== total) {
    counter.dataset['nphFound'] = total;
    counter.textContent = format(g.counter, { found: matches.size, total: CORE_TOTAL });
  }
}

function onSearch(event: Event): void {
  const target = event.currentTarget;
  const gallery = galleryOf(target);
  if (gallery === null || !(target instanceof HTMLInputElement)) {
    return;
  }
  applyFilter(gallery, target.value);
}

function onClear(event: Event): void {
  const gallery = galleryOf(event.currentTarget);
  const search = gallery?.querySelector<HTMLInputElement>('[data-nph-search]') ?? null;
  if (gallery === null || search === null) {
    return;
  }
  search.value = '';
  applyFilter(gallery, '');
  search.focus();
}

/**
 * Visual catalog of the core icons, with search by name.
 *
 * Each card shows the `nph-icon` WITHOUT `label`, decorative, with the name as
 * text below: with visible text alongside, labeling the icon would make the
 * screen reader read it twice.
 */
export const IconsOverview: Story = {
  name: 'Icons Overview',
  render: (_args, context: GlobalsContext) => {
    const locale = localeOf(context);
    const dictionary = translations(locale);
    const g = dictionary.gallery;
    const categories = dictionary.categories;

    return html`
      <div style=${body} data-nph-gallery data-nph-locale=${locale}>
        ${hidingRule}
        ${header(g.title, `${g.summary1} ${g.summary2} ${g.summary3}.`)}

        <div
          role="search"
          style="display: flex; align-items: flex-end; gap: var(--nph-space-inline); flex-wrap: wrap; padding-top: var(--nph-space-stack);"
        >
          <div style="display: flex; flex-direction: column; gap: var(--nph-space-stack-tight);">
            <label for="nph-icon-search" style=${searchLabel}>${g.searchLabel}</label>
            <input
              id="nph-icon-search"
              data-nph-search
              type="search"
              autocomplete="off"
              spellcheck="false"
              placeholder=${g.searchExample}
              aria-controls="nph-icon-grid"
              style=${field}
              @input=${onSearch}
            />
          </div>
          <button type="button" style=${button} @click=${onClear}>${g.clear}</button>
        </div>

        <p
          data-nph-counter
          data-nph-found=${CORE_TOTAL}
          role="status"
          aria-live="polite"
          style=${counter}
        >
          ${format(g.counter, { found: CORE_TOTAL, total: CORE_TOTAL })}
        </p>

        ${index(
          dictionary.docs.onThisPage,
          CATEGORIES.map((_, position) => ({
            id: CATEGORY_IDS[position] ?? '',
            title: categories[position] ?? '',
          })),
        )}

        <div id="nph-icon-grid" style="display: flex; flex-direction: column;">
          ${CATEGORIES.map(
            (category, position) => html`
              <div data-nph-category>
                ${section(
                  CATEGORY_IDS[position] ?? '',
                  categories[position] ?? '',
                  html`
                    <div style=${grid}>
                      ${category.map(
                        (name) => html`
                          <div data-nph-name=${name} style=${tile}>
                            <nph-icon name=${name} size="lg"></nph-icon>
                            <span style=${tileName}>${name}</span>
                          </div>
                        `,
                      )}
                    </div>
                  `,
                )}
              </div>
            `,
          )}
        </div>

        <div data-nph-empty hidden>${text(g.empty)}</div>
      </div>
    `;
  },
};

/**
 * Storybook languages for Nephos.
 *
 * A story is NEVER duplicated per language: it reads the chosen language and
 * looks the text up in the dictionary. Tripling a story would mean fixing every
 * change three times, and someone would eventually forget one.
 *
 * `pt-BR` is the source. `en` and `es` are translations. Technical
 * identifiers — `nph-icon`, tokens, attributes, commands, paths — do not go
 * through here: they appear literally in the story, the same in every language.
 *
 * See `docs/i18n.md`.
 */

/*
 * The dictionaries are JSON, one per language, and JSON has no comments: their
 * rules live here.
 *
 * - `pt-BR.json` is the source language. Every sentence starts there; `en.json`
 *   and `es.json` are translations and never decide content. If they diverge,
 *   the source wins.
 * - `sidebar` translates sidebar labels by entry id. An entry without a key
 *   keeps its original name — the case of `nph-icon`, which is a technical name.
 * - `colorScheme` is the toolbar mode selector. One mode at a time: frame and
 *   page switch together.
 * - `categories` follows the order of `icones_nucleo`, in design.md.
 * - A number enters through a `{nome}` marker, filled in by `format()`. The
 *   marker is the same in all three languages; only the surrounding text is
 *   translated.
 */
import ptBR from './pt-BR.json';
import en from './en.json';
import es from './es.json';

/** The global's identifier is `locale`, in English, like every technical name. */
export const LOCALE_GLOBAL = 'locale';

export const DEFAULT_LOCALE = 'pt-BR';

/** Display order in the selector. The source comes first. */
export const LOCALES = [
  { value: 'pt-BR', title: 'Português (BR)', right: '🇧🇷' },
  { value: 'en', title: 'English', right: '🇺🇸' },
  { value: 'es', title: 'Español', right: '🇪🇸' },
];

const DICTIONARIES = { 'pt-BR': ptBR, en, es };

/**
 * Returns the dictionary for the requested language. An unknown language falls
 * back to the source instead of breaking the page: Portuguese text is a small,
 * visible defect; a blank story is a big one.
 */
export function translations(locale) {
  return DICTIONARIES[locale] ?? DICTIONARIES[DEFAULT_LOCALE];
}

/**
 * Translated label of a sidebar entry, or `undefined` when there is no
 * translation — the case of `nph-icon`, which is a technical name and never
 * changes.
 */
export function sidebarLabel(id, locale) {
  return translations(locale).sidebar[id];
}

/**
 * Fills the `{nome}` markers of a dictionary text. A marker without a value
 * stays as it is, so the defect shows on the page instead of vanishing.
 */
export function format(template, values) {
  return template.replace(/\{(\w+)\}/g, (marker, name) =>
    Object.hasOwn(values, name) ? String(values[name]) : marker,
  );
}

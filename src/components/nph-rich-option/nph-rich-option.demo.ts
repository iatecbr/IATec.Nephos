/**
 * Demonstration frame shared by the `nph-rich-option` Validation and Docs pages.
 *
 * It lives in a file that does not end in `.stories.ts`, so Storybook's glob does not index it.
 * The scenery here — the gaps, the framed figure, the room below an open list — is NOT a
 * precedent for component CSS: the piece takes every measure from tokens.
 *
 * The three examples are the required ones of the accepted frame (`6935:11785`): "Choosing the
 * plan" (radio cards, one checked), "Turning on notices" (switch cards, the first one on, with an
 * icon, no shortcut) and "Assigning people in the combobox" (the rich option with an avatar and a
 * box, two chosen, the last with no description). A group is an `nph-field` around the cards of
 * one control: the field names the group, wraps the cards, stacks them and carries the error
 * message (P83); the card owns the choice, the keyboard and its own Tab stop (P134). The functions
 * take the visible text as arguments: this file holds none, because every visible text comes from
 * the language dictionary of the page that calls it.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';

import '../nph-combobox/nph-combobox';
import type { NphComboboxEntry } from '../nph-combobox/nph-combobox';
import '../nph-field/nph-field';
import '../nph-multi-combobox/nph-multi-combobox';
import '../nph-option/nph-option';
import '../nph-select/nph-select';
import './nph-rich-option';

export type Scheme = 'light' | 'dark';

/**
 * The same example in a color scheme of its own, on the same element that resolves the tokens
 * (P67). A story is never duplicated per mode. `room` keeps space below an open list, so it does
 * not cover the next figure.
 */
export function inScheme(scheme: Scheme, caption: string, content: TemplateResult, room = false): TemplateResult {
  return html`<figure
    data-nph-color-scheme=${scheme}
    style="margin: 0; display: flex; flex-direction: column; gap: var(--nph-space-inline); padding: var(--nph-space-section); background: var(--nph-color-background); color: var(--nph-color-foreground); border: var(--nph-border-width) solid var(--nph-color-border); border-radius: var(--nph-radius-control); inline-size: fit-content; min-inline-size: var(--nph-layout-rich-option-width); max-inline-size: 100%; box-sizing: border-box; ${room
      ? 'padding-block-end: calc(var(--nph-layout-max-list-height) + var(--nph-space-section));'
      : ''}"
  >
    ${content}
    <figcaption style="color: var(--nph-color-muted-foreground);">${caption}</figcaption>
  </figure>`;
}

/** The same example in light and in dark mode, side by side. */
export function bothModes(captions: { light: string; dark: string }, content: (scheme: Scheme) => TemplateResult, room = false): TemplateResult {
  const schemes: Array<[Scheme, string]> = [
    ['light', captions.light],
    ['dark', captions.dark],
  ];
  return html`<div style="display: flex; flex-wrap: wrap; align-items: flex-start; gap: var(--nph-space-stack);">
    ${schemes.map(([scheme, caption]) => inScheme(scheme, caption, content(scheme), room))}
  </div>`;
}

/** One card. The tags and attributes are the contract; the text comes in. */
export interface CardSpec {
  control?: 'checkbox' | 'radio' | 'switch';
  name?: string;
  value?: string;
  text: string;
  description?: string;
  icon?: string;
  shortcut?: string;
  keyShortcuts?: string;
  checked?: boolean;
  invalid?: boolean;
  disabled?: boolean;
}

export function card(spec: CardSpec): TemplateResult {
  return html`<nph-rich-option
    control=${spec.control ?? 'checkbox'}
    name=${spec.name ?? ''}
    value=${spec.value ?? 'on'}
    text=${spec.text}
    description=${spec.description ?? ''}
    icon=${spec.icon ?? ''}
    shortcut=${spec.shortcut ?? ''}
    key-shortcuts=${spec.keyShortcuts ?? ''}
    ?checked=${spec.checked ?? false}
    ?invalid=${spec.invalid ?? false}
    ?disabled=${spec.disabled ?? false}
  ></nph-rich-option>`;
}

export interface GroupSpec {
  /** The name of the group, the subject: "Plan". */
  title: string;
  control: 'checkbox' | 'radio' | 'switch';
  /** The `name` the radio cards share: the group and the key in the form. */
  name: string;
  cards: readonly CardSpec[];
  /** The error message of the field: filling it in is what makes the group invalid. */
  error?: string;
  help?: string;
  disabled?: boolean;
}

/** A group: an `nph-field` named by the subject, around the cards of one control. */
export function cardGroup(spec: GroupSpec): TemplateResult {
  return html`<nph-field label=${spec.title} help=${spec.help ?? ''} error=${spec.error ?? ''} ?disabled=${spec.disabled ?? false}>
    ${spec.cards.map((item) => card({ ...item, control: spec.control, name: spec.control === 'checkbox' ? (item.name ?? spec.name) : spec.name }))}
  </nph-field>`;
}

export interface PlanText {
  planGroup: string;
  planMonthlyTitle: string;
  planMonthlyText: string;
  planAnnualTitle: string;
  planAnnualText: string;
  planTeamTitle: string;
  planTeamText: string;
}

/** Choosing the plan: radio cards, one checked. */
export function plans(d: PlanText, name: string, checked = 'annual', extra: Partial<GroupSpec> = {}): TemplateResult {
  return cardGroup({
    title: d.planGroup,
    control: 'radio',
    name,
    cards: [
      { value: 'monthly', text: d.planMonthlyTitle, description: d.planMonthlyText, checked: checked === 'monthly' },
      { value: 'annual', text: d.planAnnualTitle, description: d.planAnnualText, checked: checked === 'annual' },
      { value: 'team', text: d.planTeamTitle, description: d.planTeamText, checked: checked === 'team' },
    ],
    ...extra,
  });
}

export interface NoticeText {
  noticesGroup: string;
  noticeMentionsTitle: string;
  noticeMentionsText: string;
  noticeDigestTitle: string;
  noticeDigestText: string;
  noticeSecurityTitle: string;
  noticeSecurityText: string;
}

/** Turning on notices: switch cards with no shortcut, the first one on, with an icon. */
export function notices(d: NoticeText, name: string): TemplateResult {
  return cardGroup({
    title: d.noticesGroup,
    control: 'switch',
    name,
    cards: [
      { value: 'mentions', text: d.noticeMentionsTitle, description: d.noticeMentionsText, icon: 'bell', checked: true },
      { value: 'digest', text: d.noticeDigestTitle, description: d.noticeDigestText },
      { value: 'security', text: d.noticeSecurityTitle, description: d.noticeSecurityText },
    ],
  });
}

export interface ExtraText {
  extrasGroup: string;
  extraBackupTitle: string;
  extraBackupText: string;
  extraSupportTitle: string;
  extraSupportText: string;
  extraEditorTitle: string;
  extraEditorText: string;
}

/** Several independent choices: checkbox cards, one with the shortcut hint. */
export function extras(d: ExtraText, name: string): TemplateResult {
  return cardGroup({
    title: d.extrasGroup,
    control: 'checkbox',
    name,
    cards: [
      { name: `${name}-backup`, value: 'backup', text: d.extraBackupTitle, description: d.extraBackupText, checked: true },
      { name: `${name}-support`, value: 'support', text: d.extraSupportTitle, description: d.extraSupportText },
      { name: `${name}-editor`, value: 'editor', text: d.extraEditorTitle, description: d.extraEditorText, icon: 'pen', shortcut: '⌘ E' },
    ],
  });
}

/** A static list surface for the options of the matrix, with the width and the border of a list. */
export const listSurface =
  'display: flex; flex-direction: column; box-sizing: border-box; inline-size: var(--nph-layout-input-width); max-inline-size: 100%; padding: var(--nph-space-inline-tight); background: var(--nph-color-popover); border: var(--nph-border-width) solid var(--nph-color-input); border-radius: var(--nph-radius-container);';

export interface OptionText {
  optionLabel: string;
  optionDescription: string;
  optionSecondary: string;
}

export interface OptionState {
  active?: boolean;
  keyboard?: boolean;
  selected?: boolean;
  disabled?: boolean;
}

/** The four starts of one rich option in one state, in a list surface. */
export function richOptions(d: OptionText, state: OptionState, marker: 'check' | 'checkbox', photo = ''): TemplateResult {
  const on = (): { active: boolean; keyboard: boolean; selected: boolean } => ({
    active: state.active ?? false,
    keyboard: state.keyboard ?? false,
    selected: state.selected ?? false,
  });
  return html`<div style=${listSurface}>
    <nph-option rich marker=${marker} description=${d.optionDescription} .active=${on().active} .keyboard=${on().keyboard} .selected=${on().selected} ?disabled=${state.disabled ?? false}
      >${d.optionLabel}</nph-option
    >
    <nph-option rich marker=${marker} start="icon" icon="globe" description=${d.optionDescription} .active=${on().active} .keyboard=${on().keyboard} .selected=${on().selected} ?disabled=${state.disabled ?? false}
      >${d.optionLabel}</nph-option
    >
    <nph-option
      rich
      marker=${marker}
      start="avatar"
      src=${photo}
      secondary=${d.optionSecondary}
      description=${d.optionDescription}
      .active=${on().active}
      .keyboard=${on().keyboard}
      .selected=${on().selected}
      ?disabled=${state.disabled ?? false}
      >${d.optionLabel}</nph-option
    >
    <nph-option rich marker=${marker} start="dot" status="success" description=${d.optionDescription} .active=${on().active} .keyboard=${on().keyboard} .selected=${on().selected} ?disabled=${state.disabled ?? false}
      >${d.optionLabel}</nph-option
    >
  </div>`;
}

export interface SelectPlanText {
  selectLabel: string;
  selectPlaceholder: string;
  selectFreeTitle: string;
  selectFreeText: string;
  selectTeamTitle: string;
  selectTeamText: string;
  selectCompanyTitle: string;
  selectCompanyText: string;
  selectPlainTitle: string;
}

/** A select with rich options, and a plain option beside them: one list, both looks. */
export function planSelect(d: SelectPlanText, open = false): TemplateResult {
  return html`<nph-field label=${d.selectLabel}>
    <nph-select placeholder=${d.selectPlaceholder} name="select-plan" ?open=${open}>
      <nph-option rich value="free" description=${d.selectFreeText}>${d.selectFreeTitle}</nph-option>
      <nph-option rich value="team" description=${d.selectTeamText}>${d.selectTeamTitle}</nph-option>
      <nph-option rich value="company" disabled description=${d.selectCompanyText}>${d.selectCompanyTitle}</nph-option>
      <nph-option value="plain">${d.selectPlainTitle}</nph-option>
    </nph-select>
  </nph-field>`;
}

export interface PeopleText {
  peopleLabel: string;
  peoplePlaceholder: string;
  peopleAnaName: string;
  peopleAnaRole: string;
  peopleBrunoName: string;
  peopleCarlaName: string;
  peopleCarlaRole: string;
  peopleDianaName: string;
  peopleDianaRole: string;
  peopleCreate: string;
  peopleRemoveLabel: string;
}

/** The people of the combobox: an avatar, a description, the last one with none. */
export function peopleEntries(d: PeopleText, photos: Readonly<Record<string, string>> = {}): NphComboboxEntry[] {
  return [
    { value: 'ana', text: d.peopleAnaName, start: 'avatar', src: photos.ana ?? '', rich: true, description: d.peopleAnaRole },
    { value: 'carla', text: d.peopleCarlaName, start: 'avatar', src: photos.carla ?? '', rich: true, description: d.peopleCarlaRole },
    { value: 'diana', text: d.peopleDianaName, start: 'avatar', src: photos.diana ?? '', rich: true, description: d.peopleDianaRole },
    { value: 'bruno', text: d.peopleBrunoName, start: 'avatar', src: photos.bruno ?? '', rich: true },
  ];
}

/** Assigning people in the combobox: the rich option with an avatar, two chosen, the last with no description. */
export function assignPeople(d: PeopleText, open = false): TemplateResult {
  return html`<nph-field label=${d.peopleLabel}>
    <nph-multi-combobox
      placeholder=${d.peoplePlaceholder}
      name="assignees"
      remove-label=${d.peopleRemoveLabel}
      .options=${peopleEntries(d)}
      .defaultValue=${['ana', 'bruno']}
      ?open=${open}
    ></nph-multi-combobox>
  </nph-field>`;
}

/** The single-choice combobox with the same people, and the create row, which is a plain option. */
export function assignOne(d: PeopleText, open = false): TemplateResult {
  return html`<nph-field label=${d.peopleLabel}>
    <nph-combobox
      placeholder=${d.peoplePlaceholder}
      name="assignee"
      creatable
      create-label=${d.peopleCreate}
      .options=${peopleEntries(d)}
      ?open=${open}
    ></nph-combobox>
  </nph-field>`;
}

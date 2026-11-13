# Technical decisions — Nephos

This is the **single source** of the technical decisions P01, P02, P03, P17, P19, P20, P21, P62, P63, P64, P65, P66, P67, P68, P69, P70, P71, P72, P73, P74, P75, P76, P77, P78, P79, P80, P81, P82, P83, P84, P85, P86, P87, P88, P90, P91, P92, P93, P94, P95, P96, P97, P98, P99, P100, P101, P102, P104, P105, P106, P107 and P108. If this file and any other document in the
repository disagree, this one prevails.

## Technical review queue — Elvys

Record of everything that was waiting for his review, in a single place. The **If he
disagrees** column stated the cost of changing course, to prioritize the reading; the
**Elvys's review** column records the outcome.

**Review completed on 28/08/2026**, item by item, in a working session with
Claude Code. Elvys approved all the decisions below as they were recorded,
except P62.4, which he resolved differently from what was recorded (see the
P62.4 subsection for the detail).

| # | Decision | Adopted on | If he disagrees | Elvys's review |
|---|---|---|---|---|
| **P62.3** | `for` and `text` as the API of `nph-label` | 27/08/2026 | **Cheap now, expensive later.** `nph-input` and `nph-field` will be built on top of them | Approved, 28/08/2026 |
| **P62.2** | Format of the typography tokens: five properties per role | 27/08/2026 | Medium. The values do not change, only the emission and the CSS that consumes them | Approved, 28/08/2026 |
| **P62.1** | `nph-label` without Shadow DOM — exception to P01 | 27/08/2026 | High. It is the only way the native association works; without it the label loses its function | Approved, 28/08/2026 |
| **P62.4** | Dimensions in `px`, not `rem` | 27/08/2026 | High and old. Applies to the whole system, not just typography | Resolved by his own decision: migrate the generator to `rem` — 28/08/2026. **Implemented on 28/08/2026** |
| **P62.5** | The radius stays in `px` | 28/08/2026 | Low. Converting later is one line in the generator, but requires changing `raio_regras` in `design.md` | Adopted by Indiane on 28/08/2026. **Reviewed and approved by Mauro on 09/09/2026, in PR #25, merged in `ed7c009`.** Resolves the scope contradiction of P62.4 |
| **P62.6** | `info` and `infoLabel` in `nph-label`: the information trigger | 06/10/2026 | Medium. `nph-field` will assemble the label with the trigger; changing the API later requires redoing both | Anatomy and behavior: L8 to L11, adopted by Indiane on 08/09/2026 and 01/10/2026. API and semantics approved by `maurocsjr` in PR #58, merged in `455ead8`. **Amended by P77 (21/10/2026)**: how the balloon opens, closes and sits |
| **P01** | Open Shadow DOM | 24/08/2026 | High. Every component depends on it | Approved, 28/08/2026 |
| **P02** | Custom properties as public API | 24/08/2026 | High | Approved, 28/08/2026 |
| **P03** | Directory pattern and TypeScript | 24/08/2026 | Medium | Approved, 28/08/2026 |
| **P17** | Role of each source of truth | 24/08/2026 | High | Approved, 28/08/2026 |
| **P19** | Storybook, tests and publishing | 24/08/2026 | Medium | Approved, 28/08/2026 |
| **P20** | Style Dictionary v5 and theme contract | 24/08/2026 | High | Approved, 28/08/2026 |
| **P21** | Technical plan of `nph-icon` | 26/08/2026 | Already implemented and merged under risk acceptance | Approved, 28/08/2026. Light amendment: under review in the pull request that brings it. |
| **P63** | Metadata generated from the spec | 28/09/2026 | Medium. Changing location or format later requires generating again and adjusting whoever reads it; the spec does not change | Adopted by Indiane on 28/09/2026. **Reviewed and approved by Mauro on 30/09/2026, in the team chat.** |
| **P64** | Code language | 28/09/2026 | Medium. Applies to all new code; migrating what exists only swaps names | Adopted by Indiane on 28/09/2026. **Reviewed and approved by Mauro on 30/09/2026, in the team chat.** Amendment of 02/10/2026 approved by Mauro in PR #49, merged on 05/10/2026. Amendment of 06/10/2026 adopted by Indiane: the language part approved by Mauro in PR #59, merged in `addb034`, and the Storybook naming item in PR #56, merged in `455ead8`. Amendment of 15/10/2026 (American English) adopted by Indiane, reviewed in the pull request that brings it. |
| **P65** | API and semantics of `nph-tooltip` | 05/10/2026 | Low now. `nph-label` is the first consumer; changing later requires redoing its trigger | Behavior and scope (L11.5) and anatomy (L11.6, L11.7 and the accepted frame) adopted by Indiane on 01/10/2026. API and semantics approved by `maurocsjr` in PR #51, merged on 05/10/2026. **Amended by P77 (21/10/2026)**: opening, closing, placement and semantics |
| **P66** | API and semantics of `nph-spinner`, `nph-separator` and `nph-kbd` | 05/10/2026 | Low now. `nph-button` (Batch B) and `nph-rich-option` will be the first consumers | Anatomy and behavior: frames accepted by Indiane on 01/10/2026. API and semantics approved by `maurocsjr` in PR #54, merged in `d01da7b` |
| **P67** | Dependent invariants redeclared in each scheme root | 05/10/2026 | Medium. Changes where the generator emits 14 tokens and fixes how a part of the screen switches brand | Consumption decided by Indiane on 05/10/2026. Generator approved by `maurocsjr` in PR #55, merged in `7dd370d` |
| **P68** | API and semantics of `nph-badge` and `nph-button` | 05/10/2026 | Low now. No piece consumes either of them yet | Anatomy and behavior: frames accepted by Indiane on 01/10/2026, completed on 02/10/2026. API and semantics approved by `maurocsjr` in PR #56, merged in `455ead8`. **Amended by P86 (23/10/2026)**: the shape and the tooltip of the icon-only button. **Amended by P88 (23/10/2026)**: the solid icon in `hover-active`, of the button with text and, since the amendment of P88 of 27/10/2026, of the icon-only button |
| **P69** | API and semantics of `nph-skeleton` | 15/10/2026 | Low now. No piece consumes it yet; `nph-avatar` will share its avatar sizes and radii | Anatomy and behavior: frame accepted by Indiane on 08/10/2026. API and semantics reviewed in the pull request that brings them |
| **P70** | Package entry points and the Usage section | 15/10/2026 | Medium. Every `Docs` page shows the import line, so changing the path later changes every page and every consumer | Adopted by Indiane on 15/10/2026 (DSA-30, D2). Reviewed in the pull request that brings it |
| **P71** | `Docs` page lists read from the Metadata | 15/10/2026 | Low. The lists move from the dictionary to the Metadata; the sheet does not change its format | Adopted by Indiane on 15/10/2026 (DSA-30, D1). Reviewed in the pull request that brings it |
| **P72** | Accessibility gate in the tests | 15/10/2026 | Medium. Two new dependencies and a gate on every story; the earlier, the fewer violations to fix | Adopted by Indiane on 15/10/2026 (DSA-30, D3). Reviewed in the pull request that brings it |
| **P73** | API and semantics of `nph-togglebutton` | 19/10/2026 | Low now. Only `nph-toggle-group` (DSA-23, PR #92) consumes it, and it consumes its event, so changing the event name or the state name later requires redoing both | Anatomy and behavior: board accepted by Indiane on 07/10/2026, motion answered on 19/10/2026 (D6). API and semantics reviewed in the pull request that brings them. **Amended on 29/10/2026 (DSA-61)**: `size`, the new rest, hover and checked states, the solid icon and one icon at most |
| **P74** | API and semantics of `nph-avatar` | 20/10/2026 | Low now. No piece consumes it yet; `nph-select` (DSA-29) and `nph-avatar-stack` (DSA-25) will, so changing `src`, `label` or `size`, or the border over the photo, later requires redoing both | Anatomy and behavior: frame accepted by Indiane on 06/10/2026, D1 to D4 answered on 19/10/2026. API and semantics reviewed in the pull request that brings them |
| **P75** | Package `@iatec/nephos`: first release candidate | 19/10/2026 | High and public. The name, the `exports` paths and the `rc` tag are what every consumer writes in a lockfile and in an import line | Approved by Elvys on 19/10/2026. Amends P70, adopted by Indiane on 15/10/2026: her confirmation is requested in the pull request that brings it |
| **P76** | API and semantics of `nph-toggle-group` | 20/10/2026 | Low now. No piece consumes it yet; a toolbar will, so changing `label`, `selection`, `value` or the event `nph-value-change`, or the `value` attribute each button carries, later requires redoing both | Anatomy and behavior: frame accepted by Indiane on 08/10/2026, D1 to D3 answered on 19/10/2026. API and semantics reviewed in the pull request that brings them. **Amended on 29/10/2026 (DSA-61)**: `size`, written on every button |
| **P77** | `nph-tooltip`: any element, opened on hover and on keyboard focus (amends P65 and P62.6) | 21/10/2026 | Medium. `nph-button` (DSA-43) and the value balloon of the slider (DSA-39) will attach the balloon with `for`, so changing `for`, `side` or the rule of opening later requires redoing both | Anatomy and behavior: board accepted by Indiane on 20/10/2026, D1 answered on 20/10/2026; the plan is approved by Elvys on 21/10/2026. API and semantics approved by Elvys's merge of PR #94 (`3835337`). **Amended on 22/10/2026 (DSA-48)**: hover delay, keyboard, only focusable elements and `relation`; rules accepted by Indiane on 22/10/2026, the plan approved by Elvys the same day, API and semantics reviewed in the pull request that brings them |
| **P78** | API and semantics of `nph-avatar-stack` | 22/10/2026 | Low now. No piece consumes it yet; a list of people, a card or a table row will, so changing `count`, `label` or the slot of `nph-avatar` children later requires redoing them | Anatomy and behavior: frame accepted by Indiane on 08/10/2026, D1 to D3 answered on 19/10/2026; the plan is approved by Elvys on 22/10/2026. API and semantics reviewed in the pull request that brings them |
| **P79** | API and semantics of `nph-switch` | 22/10/2026 | Low now. No piece consumes it yet; `nph-dropdown-menu` (DSA-45) will, without a label, so changing `checked`, `text`, `label` or the native events later requires redoing both | Anatomy and behavior: frame accepted by Indiane on 08/10/2026, D1 to D4 answered on 19/10/2026; the plan is approved by Elvys on 22/10/2026. API and semantics reviewed in the pull request that brings them |
| **P80** | API and semantics of `nph-input`, the reference of the form controls | 22/10/2026 | Medium. `nph-field` (DSA-28), `nph-checkbox`, `nph-radio` and `nph-input-otp` copy its form association, its native events and its name by reference, so changing them later requires redoing those pieces | Anatomy and behavior: frame accepted by Indiane on 01/10/2026, D1 to D7 answered on 16/10/2026; the plan is approved by Elvys on 22/10/2026. API and semantics reviewed in the pull request that brings them. **Amended on 28/10/2026 (DSA-59)**: the size `compact` |
| **P81** | API, semantics and form participation of `nph-checkbox` | 22/10/2026 | Low now. `nph-field` (DSA-28) holds it as an option of a group, and a form will submit it, so changing `checked`, `name`, `value`, the native events or `nphFieldRole` later requires redoing both | Anatomy and behavior: frame accepted by Indiane on 01/10/2026, D1 to D6 answered on 19/10/2026; the plan is approved by Elvys on 22/10/2026. API and semantics reviewed in the pull request that brings them |
| **P82** | API and semantics of `nph-radio` | 22/10/2026 | Low now. No piece consumes it yet; `nph-field` (DSA-28) wraps it in a `radiogroup` and `nph-rich-option` will use the circle alone, so changing `name`, `checked`, the native events or the host as the control later requires redoing both | Anatomy and behavior: frame accepted by Indiane on 01/10/2026, D1 to D5 answered on 19/10/2026; the plan is approved by Elvys on 22/10/2026. API and semantics reviewed in the pull request that brings them |
| **P83** | `nph-field`: API, semantics and the field–control contract | 22/10/2026 | Medium. Every form control (DSA-16, DSA-17, DSA-18, DSA-27, DSA-41, and later DSA-29, DSA-31, DSA-38, DSA-39 and DSA-46) takes the contract, so changing `label`, `description`, `invalid`, `required`, `disabled` or `nphFieldRole` later requires redoing all of them | Anatomy and behavior: frame accepted by Indiane on 01/10/2026, D1 to D8 answered on 16/10/2026; the plan and the contract approved by Elvys on 22/10/2026. API and semantics reviewed in the pull request that brings them |
| **P84** | API and semantics of `nph-empty`, and the first raster asset of the package | 22/10/2026 | Low now. No piece consumes it yet; `nph-combobox` (DSA-46) will, so changing `heading` or `description` later requires redoing its empty list. The asset delivery (`vite.config.lib.ts`) applies to any later illustration | Anatomy and behavior: board accepted by Indiane on 16/10/2026; the plan is approved by Elvys on 22/10/2026. API and semantics reviewed in the pull request that brings them |
| **P86** | Icon-only `nph-button`: shape and built-in tooltip (amends P68) | 23/10/2026 | Low now. `nph-dialog` (DSA-44) will use the icon-only button to close, so changing `shape`, or the tooltip the button renders, later requires redoing it | Anatomy and behavior: board `nph-icon-button` accepted by Indiane on 19/10/2026, textual audit approved on 20/10/2026; the plan is approved by Elvys on 22/10/2026. API and semantics reviewed in the pull request that brings them |
| **P87** | API and semantics of `nph-dialog` | 22/10/2026 | Low now. No piece consumes it yet; `nph-alert-dialog` will build on it, so changing `heading`, `open`, the slots or the event `nph-close` later requires redoing both. The tokens redefined in the window and the breakpoint literal are the first of their kind | Anatomy and behavior: board accepted by Indiane on 21/10/2026; the plan approved by Elvys on 22/10/2026. API and semantics reviewed in the pull request that brings them |
| **P88** | `nph-button`: solid icon in `hover-active` (amends P68) | 23/10/2026 | Low. Visual only: no API, event or token changes, and the accessible name stays | Rule decided by Indiane on 21/10/2026 and shown in Figma (`461:13009`); the plan is approved by Elvys on 22/10/2026. Reviewed in the pull request that brings it. **Amended on 27/10/2026 (DSA-52)**: the icon-only button also swaps its icon; rule decided by Indiane on 26/10/2026 (D1 of DSA-47), reviewed in the pull request that brings it |
| **P90** | API and semantics of `nph-image` | 23/10/2026 | Low now. No piece consumes it yet; `nph-table` will, for the thumbnail and the expanded item, so changing `size`, `ratio`, `src`, `alt` or `interactive`, or the derived state, later requires redoing it | Anatomy and behavior: board accepted by Indiane on 23/10/2026; the plan is approved by Elvys on 23/10/2026. API and semantics reviewed in the pull request that brings them |
| **P85** | API and semantics of `nph-input-otp` | 22/10/2026 | Low now. No piece consumes it yet; a sign-in or verification screen will, inside `nph-field`, so changing `length`, `masked`, `value` or the native events later requires redoing that screen | Anatomy and behavior: board accepted by Indiane on 16/10/2026; the plan is approved by Elvys on 22/10/2026. API and semantics reviewed in the pull request that brings them |
| **P93** | API and semantics of `nph-textarea` | 23/10/2026 | Low now. No piece consumes it yet; a comment box or a message composer will, so changing `counter`, `readonly` or the `actions` slot later requires redoing them. It copies the form shape of P80 and the field contract of P83 | Anatomy and behavior: frame accepted by Indiane on 16/10/2026; the plan is approved by Elvys on 23/10/2026. API and semantics reviewed in the pull request that brings them |
| **P91** | API and semantics of `nph-select` and `nph-option` | 23/10/2026 | Medium. `nph-combobox` (DSA-46) and `nph-multi-combobox` (DSA-31) reuse `nph-option` and its owner symbol, so changing the option API, `NPH_OPTION_CHANGED` or the keyboard later requires redoing both | Anatomy and behavior: frame accepted by Indiane on 14/10/2026, D1 to D9 answered on 19/10/2026; the plan is approved by Elvys on 23/10/2026. API and semantics reviewed in the pull request that brings them. **Amended by P96 (26/10/2026)**: the `marker` of the option, `check` or `checkbox` |
| **P94** | API and semantics of `nph-slider` | 23/10/2026 | Low now. No piece consumes it yet; a filter panel will, so changing `mode`, `value`, `start`, `end`, the two form entries of `range` or the ARIA thumbs later requires redoing it | Anatomy and behavior: board accepted by Indiane on 15/10/2026; the plan is approved by Elvys on 23/10/2026. API and semantics reviewed in the pull request that brings them |
| **P92** | API and semantics of `nph-dropdown-menu` | 24/10/2026 | Low now. No screen consumes it yet; an account menu or a toolbar will, so changing `for`, `items`, the entry fields or the event `nph-item-select` later requires redoing them | Anatomy and behavior: board accepted by Indiane on 21/10/2026; the plan is approved by Elvys on 23/10/2026. API and semantics reviewed in the pull request that brings them |
| **P97** | API and semantics of `nph-table` | 26/10/2026 | Low now. No piece consumes it yet; a report or a statement screen will, and `nph-data-table` may build on it, so changing `columns`, `rows`, the cell types or the events later requires redoing them | Anatomy and behavior: board accepted by Indiane on 23/10/2026; the plan is approved by Elvys on 26/10/2026. API and semantics reviewed in the pull request that brings them |
| **P95** | API and semantics of `nph-combobox` and its list | 26/10/2026 | Medium. `nph-multi-combobox` (DSA-31) takes the list module, so changing the entries of `options`, the search, the groups, the highlight or the events `nph-search` and `nph-create` later requires redoing both. The options as data depart from the light-DOM options of P91 | Anatomy and behavior: board accepted by Indiane on 14/10/2026; the plan is approved by Elvys on 23/10/2026. API and semantics reviewed in the pull request that brings them |
| **P96** | API and semantics of `nph-multi-combobox`; the `checkbox` marker of `nph-option` (amends P91) | 26/10/2026 | Low now. No piece consumes the field yet; the marker defaults to `check`, so `nph-select` and `nph-combobox` do not change | Anatomy and behavior: board accepted by Indiane on 15/10/2026, D1 to D3 answered; the plan is approved by Elvys on 23/10/2026. API and semantics reviewed in the pull request that brings them |
| **P102** | Vitest 5 for the browser tests (amends item 5 of P21) | 29/10/2026 | Low. Only the test runner and the Storybook packages that require it move; going back is a lockfile change and one test line | Decided by Elvys on 29/10/2026. Reviewed in the pull request that brings it |
| **P106** | Up to two reruns of a browser test shard after a network change on the Azure host | 29/10/2026 | Low. Only the Azure step changes; removing the reruns is a pipeline change, and a real failure still fails on the first run | Decided by Elvys on 29/10/2026 (one rerun) and 30/10/2026 (up to two). Reviewed in the pull request that brings it |
| **P107** | API and semantics of `nph-progress` | 06/11/2026 | Low. No piece consumes the bar yet; `nph-notification` (DSA-63) may embed it later, and changing the `type`, `status`, `value`, `steps` and `step` properties or the invalid-input rule then requires redoing both | Anatomy and behavior: documentation accepted by Indiane on 05/11/2026. The plan is approved by the wave. API and semantics reviewed in the pull request that brings them |
| **P108** | API and semantics of `nph-notification` | 06/11/2026 | Low now. No piece consumes it yet; the toast region of the consuming application will, and `nph-alert-dialog` does not, so changing `placement`, `severity`, `emphasis`, `layout`, `duration`, the events `nph-action` and `nph-close` or the invalid-input rule later requires redoing the region. The ghost action and the close on solid point public tokens of `nph-button`, a step beyond the component-token precedent of `nph-dialog` and `nph-toolbar` | Anatomy and behavior: documentation accepted by Indiane on 04/11/2026. The plan is approved by the wave. API and semantics reviewed in the pull request that brings them |
| **P111** | API and semantics of `nph-popover`; the open trigger and the ARIA of `nph-button` (amends P68) | 07/11/2026 | Low now. No piece consumes the popover yet; `nph-hover-card` and `nph-navigation-menu` have their own surfaces, so changing `for`, `side`, `align`, `arrow`, `size`, `closable`, the `footer` slot, the event `nph-close` or the invalid-input rule later requires redoing every consumer. The change to `nph-button` is small and scoped to `aria-haspopup="dialog"`, so it touches no other trigger | Anatomy and behavior: documentation accepted by Indiane on 06/11/2026. The plan is approved by the wave. API and semantics reviewed in the pull request that brings them |
| **P112** | API and semantics of `nph-hover-card` | 07/11/2026 | Low now. No piece consumes it yet; a profile, a page or an item link will, and changing `href`, the default slot, `heading`, `meta`, `meta-icon`, `meta-title`, `side`, `arrow`, `open`, the slot `media`, the closing on blur or the invalid-input rule later requires redoing every card. The slot `media` and the alignment of the card to the link wait for Indiane (D-1, D-2) | Anatomy and behavior: documentation accepted by Indiane on 06/11/2026. The plan is approved by the wave. API and semantics reviewed in the pull request that brings them |
| **P113** | API and semantics of `nph-context-menu`; the accepted changes of `nph-dropdown-menu` and `nph-icon` | 08/11/2026 | Low now. No piece consumes the context menu yet; `nph-data-table` is its first expected parent, so changing `for`, `items`, `open-submenu`, `size`, the event `nph-item-select` (with `origin`) or the invalid-input rule later requires redoing every consumer. The `nph-dropdown-menu` change is visual only | Anatomy and behavior: documentation accepted by Indiane on 06/11/2026. The plan is approved by the wave. API and semantics reviewed in the pull request that brings them |
| **P114** | The answers of 2026-11-09 applied in the code: the size of `nph-switch`, the focus of the dropdown item, the open trigger of `nph-button`, the disclosure and motion of `nph-navigation-menu` and the other choices (amends P87, P111 and P113) | 09/11/2026 | Low. The pieces are not consumed by another piece beyond the dropdown item that draws the small switch; changing `size` of `nph-switch`, `NPH_PROGRESS_MIN_STEPS` or the narrow rows of `nph-navigation-menu` later requires redoing every consumer | Answers by Indiane on 2026-11-09, in the tasks. The choices are reviewed in the pull request that brings them |
| **P115** | API and semantics of `nph-tabs` | 09/11/2026 | Low now. No piece consumes it yet; a section with parts, a request or a record will, and changing `tabs`, `value`, `variant`, `activation`, the named slot of the panel, the event `nph-tab-change`, the names of the scroll arrows or the invalid-input rule later requires redoing every consumer. The balloon of the cut tab (D-1), the names of the arrows (D-2), `99+` (D-3) and the cut label in the segmented and tab button styles (D-4) wait for Indiane | Anatomy and behavior: documentation accepted by Indiane on 09/11/2026. API and semantics reviewed in the pull request that brings them |
| **P116** | API and semantics of `nph-sidebar`; the focus hook of `nph-button`; the disclosure of the subitem and of the rail button (amends P98) | 11/11/2026 | Low now. No piece consumes the sidebar yet; the application shell will, and changing `items`, `mode`, `open`, the events, the flyout panel or the focus hook later requires redoing every consumer. The `sidebar` icon in `nph-icon` (D-1), the dark logo (D-2) and the current page in a collapsed group (D-3) wait for Indiane | Anatomy and behavior: documentation accepted by Indiane on 09/11/2026. API and semantics reviewed in the pull request that brings them |
| **P117** | API and semantics of `nph-stepper` | 11/11/2026 | Low now. No piece consumes it yet; a sign-up, a hiring or a setup form will, and changing `steps`, `current`, `non-linear`, the hidden status texts, `step-text`, the event `nph-step-select`, the narrow width or the invalid-input rule later requires redoing every consumer. The 600 px of the narrow width (D-2), the position-only progress on the narrow width (D-3) the focusable span of a cut pending step (D-4) and the connector against a status set out of position (D-5) wait for Indiane | Anatomy and behavior: documentation accepted by Indiane on 10/11/2026. API and semantics reviewed in the pull request that brings them |
| **P118** | API and semantics of `nph-tree` | 11/11/2026 | Low now. No piece consumes it yet; the Tree Select and the Tree Table will, and changing `items`, the state properties `selection`, `selected`, `checked` and `expanded`, the cascade, the events `nph-tree-toggle`, `nph-tree-select`, `nph-tree-check` and `nph-tree-load`, the load on demand, the texts of the consumer or the invalid-input rule later requires redoing every consumer. The Tree Table against the tree of `nph-table` (D-1) and the focus border of the disabled item (D-2) wait for Indiane | Anatomy and behavior: documentation accepted by Indiane on 11/11/2026. API and semantics reviewed in the pull request that brings them |
| **P119** | API and semantics of `nph-file-upload` | 11/11/2026 | Low now. No piece consumes it yet; a form that attaches files will, and changing `files`, the validation and its reasons, the events `nph-file-upload-add`, `nph-file-upload-remove` and `nph-file-upload-retry`, the texts of the consumer, the compact format or the invalid-input rule later requires redoing every consumer. The dashed border token (D-1), the description of the button (D-2), the items of a disabled zone (D-3), the error inside `nph-field` (D-4) and the lines of the item (D-5) wait for Indiane | Anatomy and behavior: documentation accepted by Indiane on 10/11/2026. API and semantics reviewed in the pull request that brings them |
| **P120** | API and semantics of `nph-scheduler` | 13/11/2026 | Low now. No piece consumes it yet; a product screen will, so changing `events`, `calendars` and `labels`, the instant format, the events `nph-event-click` and `nph-date-change`, the slots `detail` and `detail-footer`, the order of Tab or the invalid-input rule later requires redoing every consumer. The date grid (D-1), the `sidebar` icon (D-2), the derived measures (D-3), the color of a calendar (D-4), the click on a day (D-5), the detail (D-6) and the order of the all-day band (D-7) wait for Indiane | Anatomy and behavior: documentation accepted by Indiane on 12/11/2026. API and semantics reviewed in the pull request that brings them |

**Outside this note, still awaiting his confirmation:** license, CI variable,
credential and platform of **Font Awesome Pro**. See `PO-001` in the vault.

> **Status of all decisions in this note:**
> *Decision adopted by Indiane on 24/08/2026 (P21 on 26/08/2026, P62 on
> 27/08/2026) — reviewed and approved by Elvys on 28/08/2026, item by item,
> except P62.4.*
>
> Elvys formally reviewed and approved P01, P02, P03, P17, P19, P20, P21, P62.1,
> P62.2 and P62.3 as they were recorded. For P62.4, he did not approve
> recording the divergence without a correction: he decided to migrate the generator to `rem`
> (see P62.4). These decisions apply to the current work and remain
> revisable: changing them now requires the same rite as always —
> technical conflict explained, proposal recorded, human review.

Before this note, the five were recorded as open pending items,
delegated to Elvys. They left that state on 24/08/2026, to unblock the
continuity of the work. The record that they were pending items is preserved on
purpose: they are **current and revisable** decisions, not closed decisions.

---

## P01 — Component encapsulation

**Decision.** Future components with the `nph-` prefix will use **open Shadow
DOM**.

**Reason.** It encapsulates the internal styles and protects the visual implementation,
while keeping inspection, debugging and testing feasible.

**Scope.** It only starts to apply when the first component is created.

**Impact.** Every `nph-*` component is born with Shadow DOM in open mode.
Outside styles do not leak into the component, and the internal CSS does not leak
into the page. This makes P02 mandatory: without a public customization
API, encapsulation would make the component impossible to theme.

**Out of scope.** Closed Shadow DOM, which must not be used. Creating any
component in this task.

**Status.** Decision adopted by Indiane on 24/08/2026 — reviewed and approved
by Elvys on 28/08/2026.

---

## P02 — Customization and CSS exposure

**Decision.** The public visual customization API will use **CSS custom
properties**, for tokens and for customization. Internal parts that
need to be styled from outside may be exposed with **`::part`**.
Internal CSS classes **are not public API**.

**Reason.** It allows theming and the planned adjustments without turning internal
classes into a contract with the consumer — which would freeze the implementation and
prevent refactoring.

**Scope.** It only starts to apply when the first component is created.

**Impact.** It defines the boundary between what is contract and what is internal:
custom properties and `::part` are stable and versioned; class names
inside the Shadow DOM may change at any time. A consumer that
depends on an internal class breaks without warning, and that does not count as a regression.

**Out of scope.** Creating styles, parts or components in this task. Defining
which specific parts each component will expose — that is decided in the spec of
each piece.

**Status.** Decision adopted by Indiane on 24/08/2026 — reviewed and approved
by Elvys on 28/08/2026.

---

## P03 — Project organization

**Decision.** The future directory pattern is this one, without creating unnecessary
empty directories:

```text
src/
  components/
    <nome-do-componente>/
      <nome-do-componente>.ts
      <nome-do-componente>.css
      <nome-do-componente>.stories.ts
      <nome-do-componente>.test.ts
  tokens/
    source/
    generated/
  styles/
  shared/
docs/
```

The structure Storybook already created is preserved. Stories and tests sit
next to the component they belong to.

**Reason.** Keep the implementation, style, story and test of a piece in the same
place, so that the component is readable and movable as a unit.

**Scope.** Future pattern. None of these directories is created now, except
`docs/`, which exists because this note lives in it.

**Impact.** `src/tokens/source/` and `src/tokens/generated/` materialize P17:
the versioned JSON goes in `source/`, the generated CSS goes in `generated/`.

**Out of scope.** Creating `src/`, `src/components/`, `src/tokens/`,
`src/styles/` or `src/shared/` in this task. Creating components.

**Divergence resolved in the first component.** The Storybook configuration
includes the stories in `src/components/**/*.stories.ts`, and the structure started
using TypeScript according to this pattern. The history of this divergence explains the
scope of P03; it does not authorize future changes.

**Status.** Decision adopted by Indiane on 24/08/2026 — reviewed and approved
by Elvys on 28/08/2026.

---

## P17 — Token format and consumption

**Decision.** Tokens versioned in the repository will use **JSON** as the
source format. **CSS custom properties** will be the **generated** format for
consumption in the browser.

**Canonical source by responsibility.**

- **Figma** is the visual source: it defines and validates values, modes, aliases and
  design intent.
- `design.md` is the human and agentic contract: it explains usage, accessibility,
  naming and constraints. It is not the generation file.
- **JSON** will be the versioned technical source of the audited values that enter
  the repository.
- The **CSS custom properties** will be generated from the JSON and must not be edited
  by hand.

Until the Figma ↔ documentation audit is finished, no value enters the
JSON. **Do not create tokens with fictitious or unaudited values.**

**Reason.** JSON is tool-readable and serves as the source to generate other
formats; CSS custom properties are what the browser consumes and what P02
defines as public API.

**Scope.** No token value enters the repository before the audit.

**Impact.** It creates a generation step between source and consumption: the JSON is
edited, the CSS is generated and must not be edited by hand. The generation tool
has not been chosen yet.

**Out of scope.** Creating token files, migrating values from Figma to
code, choosing a generation tool and writing the token build script.

**Compatibility with [`design.md`](../design.md).** The existing YAML in
`design.md` remains as documentation of the contract until its migration and
validation in the repository. After the audit, the JSON will be the technical source of the
values; `design.md` will keep explaining the criteria and must point to the
JSON, without duplicating values that could diverge.

**Status.** Decision adopted by Indiane on 24/08/2026 — reviewed and approved
by Elvys on 28/08/2026.

---

## P19 — Storybook, tests and publishing

**Decision.**

- Keep `@storybook/web-components-vite`.
- `npm run storybook` for local development.
- `npm run build-storybook` as build validation.
- Stories will sit next to the components when these are created.
- The Storybook build must run in CI on pull requests, once the
  workflow is created.
- Initially, the result will be made available only as a **private CI
  artifact**.

**Reason.** Consolidate as a working choice what is already configured and
working, and fix build validation before there are components, without
exposing anything publicly while the system is under construction.

**Scope.** The two commands apply from now on. CI applies from the moment
the workflow exists.

**Impact.** It ends the provisional status of `@storybook/web-components-vite`,
which until 24/08/2026 was listed as a bootstrap choice to be confirmed. npm remains
the package manager by the same continuity decision. CI and its private
artifact are rules for the future workflow; this note does not state that they already
exist.

**Out of scope.** Public publishing, GitHub Pages, external environment, deploy
and definitive test configuration. Creating the CI workflow. Interaction and
accessibility tests will be defined with the first real component.

**Annotation of 15/10/2026.** P70 defines the package entry points and the import
line of each component. Public publishing stays out of scope.

**Annotation of 15/10/2026.** P72 defines the accessibility tests: the deferral to
"the first real component" is closed.

**Amended by P75 (19/10/2026).** P75 publishes release candidates of the package to a
private feed. Public publishing, GitHub Pages and the CI workflow stay out of scope.

**Annotation of 26/10/2026.** At Elvys's request, the Azure Pipeline that publishes the
package (`azure-pipelines.yml`, `docs/release.md`) also runs `npm run build-storybook` in its
Build stage, on pull requests to `v/5.0.0`, on release tags and on manual runs, and publishes
`storybook-static/` as the private pipeline artifact `storybook`. This is the private CI
artifact the decision foresees; the decision itself does not change. The team hosts the
folder; public publishing, GitHub Pages, an external environment and deploy stay out of
scope. The static build carries Font Awesome Pro artwork, so making it reachable outside
IATec is a license decision for Indiane (`PO-001`). Reviewed in the pull request that brings
it; the merge is the approval.

**Status.** Decision adopted by Indiane on 24/08/2026 — reviewed and approved
by Elvys on 28/08/2026.

---

## P20 — Generation tool and public theme contract

This decision **complements P17**, which fixed JSON as the source format and CSS
custom properties as the generated format, but left the tool open.

**Decision.**

- The generation tool is **Style Dictionary v5**.
- The public theming contract is **two independent attributes**:
  `data-nph-brand` and `data-nph-color-scheme`.
- The public values of `data-nph-color-scheme` are **`light`** and **`dark`**.
- The values of `data-nph-brand` are the names of the verticals: `sistemas`,
  `gerencial`, `educacao`, `comercial`, `financeiro`, `igrejas`, `rh`.
- The namespace of the DTCG extensions is **`com.iatec.nephos`**.

**Reason.** The tool was chosen by requirement, not by popularity:
it must support **layers**, **aliases** and **modes**. Style Dictionary treats
aliases as first-class syntax and, with `outputReferences`, emits
`var(--outro-token)` instead of flattening the alias into a literal — the requirement that
eliminates the alternatives. Layers come from the organization of the source files; modes
come from one output per mode, each with its own selector. It is pure Node, with no
coupling to a Figma plugin, consistent with the npm already fixed by P19.

Technical identifiers stay in English. Brand values stay in
Portuguese because they are proper names of the verticals, not technical terms.

**Scope.** Applies from now on to `src/tokens/`. It does not change P17, which remains
the source of the rule on format and responsibility per layer.

**Impact.**

1. `style-dictionary` comes in as the first `devDependency` outside Storybook.
2. `src/tokens/generated/` now contains a versioned, generated artifact, which
   must **never** be edited by hand. The build is deterministic so that, in the
   future CI, an empty `git diff` check is possible.
3. Brand and scheme become an **HTML contract**: the consumer puts both
   attributes on the root element. Omitting both delivers Sistemas in light.
4. DTCG has no native modes; the mode format in
   `$extensions["com.iatec.nephos"].modes` is a Nephos convention. Switching
   tools preserves the JSON, but requires rewriting the step that applies the modes.
5. **Recorded limitation:** Style Dictionary 5.5.2 serializes `duration` in
   the DTCG structured form as `[object Object]`. The source remains
   structured; the conversion happens only at output, through a custom transformer. There is
   a validation that aborts the build if `[object Object]` reappears.

**Out of scope.** Creating a CI workflow. Publishing. Generating formats other than CSS.
Migrating effect styles, text styles or the postponed primitives.

**Status.** Decision adopted by Indiane on 24/08/2026 — reviewed and approved
by Elvys on 28/08/2026.

---

## P21 — Technical plan of the first component: `nph-icon`

**Decision.** For the first component, adopt the decisions below until there is a
concrete technical conflict or a later review by Elvys:

1. Implement `nph-icon` in Lit, with open Shadow DOM, inline SVG and a closed
   map of the 93 approved icons. The package is Font Awesome Pro on line 6,
   using the `regular` and `solid` SVG packages; each approved name has both
   artworks. The exact version is only pinned after an authenticated query to the registry, at
   the authorized moment of installation.
2. The approved public contract is `name` required, `variant=regular` by
   default, with `solid` available for each name of the approved collection, `size`
   required in `sm|md|lg` and `label` optional. `label` absent, empty or
   containing only spaces after `trim` makes the icon decorative. There are no slots,
   events, focus, click, touch, color property or initial `::part`.
3. The drawing of `eye`, `eye-slash` and `star` may overflow horizontally,
   centered and without clipping or rescaling, inside a square box scaled by
   height. `space/inline-tight` belongs to the container that composes icon and text.
4. Invalid input renders no icon and emits `console.error` only in
   development. There is no visual fallback or free size.
5. Adopt strict TypeScript, stories next to the component and Vitest in
   browser mode as the validation base of the first component. The implementation
   includes story discovery in `src/components/**`, in-browser tests for
   `currentColor` and custom properties, and `build-storybook`.
6. The policy adopted for credentials is: no value in a versioned file;
   local configuration protected from Git; reference to the variable
   `FONTAWESOME_NPM_AUTH_TOKEN` only where needed; and the CI secret
   configured outside the repository. The future CI validates installation, tests and
   `build-storybook` on pull requests, with a private artifact.
7. Indiane accepts the risk of starting the implementation before Elvys's review.
   The local protection rule was applied through an `.npmrc` ignored by Git; this
   does not replace Elvys's later review of license, CI and platform.
8. The Storybook organization of `nph-icon` separates `Docs / Documentação`, for
   reading the contract, from `Docs / Icons Overview`, for the searchable catalog
   of the closed core of 93 icons, and from `Validação`, for variants, sizes,
   color inheritance, accessibility and invalid input. The documentation page is
   derived and points to the canonical sources; it installs no addon, MDX or new
   dependency, does not change the public API and creates no icon, token or variant. Search
   is a behavior of the Storybook page, not of the Web Component.

**Reason.** The technical plan was prepared and reviewed against the working clone,
the approved contract of the component and decisions P01, P02, P03, P17 and P19. The
decisions remove ambiguities of API, behavior, tests and security. The
protection against accidental inclusion of the local configuration was applied; the
technical review by Elvys remains later and mandatory.

**Scope.** This note decides the implementation plan of `nph-icon`. It does not create
dependencies, component files, CI, secrets, local configuration or
publishing.

**Impact.**

- Claude — code may implement P21 before Elvys's review, without exposing
  or versioning a credential and without creating CI.
- Copilot updates the spec and the Register with the implementation evidence,
  Storybook and tests after the verifiable delivery.
- CI remains nonexistent until its technical creation in a change of its own.

**Out of scope.** Creating or exposing a credential, configuring a secret, creating a
workflow, publishing Storybook or implementing another component.

**Status.** Decision adopted by Indiane on 26/08/2026 — implementation
authorized under formal risk acceptance; organization of `Docs / Documentação`,
`Docs / Icons Overview` and `Validação` approved by Indiane on 26/08/2026;
reviewed and approved by Elvys on 28/08/2026.

**Amendment I7, 08/09/2026 — absorbed by the matrix of 14/09/2026.** The original
wording of P21 restricted `solid` to `star`. I7 authorized `circle-info` in
`solid` because the `regular` outline disappears next to text, especially in
light mode; `regular` remains the default. On 14/09/2026 the approved Figma documentation
extended `solid` to all 93 names; items 1 and 2 already describe that
collection. This note records the reason for I7 and neither reopens nor reduces the current map.

**Amendment — Light as the default style.** The `regular` SVG package was replaced
by `light` (`@fortawesome/pro-light-svg-icons`, same pinned version), and
`variant=regular` by `variant=light` as the default; `solid` is unchanged. This
replaces `regular` in items 1 and 2 and the sentence "`regular` remains the
default" of amendment I7, which stay above as the record. `regular` is no longer a
valid value and has no alias. Reason: at 16 px Regular draws a 1.5 px stroke and
Light 1.0 px, the same weight as the text, so the Solid of the active item stands
out. Thin and Sharp remain forbidden; Duotone is unchanged.

**Annotation of 29/10/2026.** P102 moves the browser tests of item 5 to Vitest 5. The rest of
item 5 does not change.

---

## P62 — `nph-label`: exception to P01, typography and API

**Status.** Four decisions adopted by Indiane on 27/08/2026. Elvys reviewed them
on 28/08/2026: he approved P62.1, P62.2 and P62.3 as recorded; P62.4
he resolved differently — see the subsection. **P62.5**, adopted by Indiane
on 28/08/2026 to resolve the scope contradiction of P62.4, **was reviewed and
approved by Mauro on 09/09/2026**, in PR #25. The first three arose from a
concrete problem during implementation; the fourth is an old divergence
that the implementation exposed.

### P62.1 — `nph-label` does not use Shadow DOM

**Decision.** `nph-label` is the **only Nephos component without Shadow DOM**.
It renders in the light DOM. P01 remains valid for all the others.

**Reason.** The native association between label and control does not cross the
Shadow DOM boundary. From inside it, `for` does not reach an `id` of the
document, clicking the label does not move the cursor to the field and the screen reader does not
announce the field name. Since this is the reason a label exists, the
encapsulation gives way.

**Discarded alternative.** Delegating the association to `nph-field`, which would keep
P01 intact. It was refused because it would block the P0 cut: `nph-field` is 4th in the queue
and does not exist yet, and `nph-label` would be ready and useless until then.

**Limit.** It is an exception for one piece, not the opening of a precedent. Any other
component that wants to leave Shadow DOM needs its own decision.

### P62.2 — Typography: five custom properties per role

**Decision.** Each of the 14 text roles emits five custom properties, with
the `css` field of `design.md` read as a **prefix**, not as the final name:

```css
--nph-text-label-md-font-family   /* alias to --nph-core-font-sans */
--nph-text-label-md-font-size
--nph-text-label-md-line-height
--nph-text-label-md-font-weight
--nph-text-label-md-letter-spacing
```

**Reason.** `letter-spacing` does not fit in the CSS `font` shorthand, and a component
often needs an isolated property. In the generator, the change is one
line: `fontFamily` goes into `TIPOS_TRATADOS`, and Style Dictionary's own `fontFamily/css`
transform handles the emission. Weight stayed as `number`, not
`fontWeight`, because DTCG accepts a word or a number in that type and the Nephos
source always stores a number.

**Why now.** The 14 styles had been postponed since the base migration.
`nph-label` is the first component made of pure text: without `text/label-md` in
code, it could only exist with a literal value, which A2 forbids. The same blocker
applied to `nph-input`, `nph-field` and `nph-checkbox`.

**Origin of the values.** Read from the 14 text styles of the Figma file
`DS-IA-NEPHOS 5.0` on 27/08/2026 and checked against `tokens_typography` in
`design.md`, item by item, with no divergence. Layers: `core` 139 → 141,
`semantic` 147 → 217, total 292 → **364**.

### P62.3 — API of `nph-label`: `required`, `for` and `text`

**Decision.** Three public properties. `required` was planned in the component
register; `for` and `text` were not and come from P62.1.

| Property | Role |
|---|---|
| `required` | Boolean, default `false`. Adds the asterisk at the end of the text |
| `for` | Mirrors the native `<label>` attribute. It is the mechanism of the association |
| `text` | The label text. It is a property, and not content between the tags, because without Shadow DOM there is no `slot` and Lit would replace the consumer's children |

**This is the most urgent decision in the queue.** `nph-input` and `nph-field` will be
built on top of it. Changing later costs much more than changing now.

**Accessibility tied to this decision.** The asterisk carries `aria-hidden` and is
decorative. The required state reaches the screen reader through the control itself,
with `required`, and not through hidden text in the label: the state belongs to the
field, and hidden text would require a Portuguese string inside the component,
forbidden by the trilingual plan. **Consequence: `nph-input` will have to carry
`required`.**

*Amended by P62.6.*

### P62.4 — Dimensions are emitted in `px`, not `rem`

> **Read the historical record below as history.** The original decision —
> record the divergence without correcting it — **was replaced** by Elvys's
> decision on 28/08/2026 and is already implemented. For the current state, go straight to
> **Elvys's decision — 28/08/2026** and **Implementation — 28/08/2026**, at the end of
> this subsection. What comes before describes the situation of 27/08/2026 and **is not the
> state of the repository today**.

**Original decision, 27/08/2026 — SUPERSEDED.** Record the divergence instead of
correcting it at that moment.

**The fact, on 27/08/2026.** `design.md` declared `unidade_css: rem, raiz
16px` and **no layer of the generator complied with it**: space, radius, control
height, icon size and the newly migrated typography were all emitted in `px`. The
typography migration merely followed what already existed. **This stopped being true
on 28/08/2026:** today 92 of the 100 `dimension` tokens are emitted in `rem`, and only
`core/radius` remains in `px`, by P62.5.

**Reason for not correcting it in that PR.** Switching to `rem` affects every `dimension`
of the system, not just typography, and it is a pipeline decision. Correcting it inside a
component PR would hide a global change inside a local delivery. That is
why the correction came later, in its own PR.

**What was open, and no longer is.** Either the generator would start emitting `rem`,
or `design.md` would start declaring `px`. The contract promised one thing and the
code delivered another. Resolved below.

**Elvys's decision — 28/08/2026.** Resolves the divergence: the **generator migrates
to `rem`**. `design.md` (`unidade_css: rem, raiz 16px`) does not change — it is the
code that starts complying with the contract already written. This replaces the "record
without correcting" above; the divergence is no longer just noted.

**Scope of this decision.** It sets the direction, not the implementation. It affects every
`dimension` layer of Style Dictionary — space, radius, control height, icon
size and typography (P62.2) —, not just typography. The migration itself (change in the
generator, and revalidation of the deterministic output of each layer) is a task of its own,
outside this note.

**Implementation — 28/08/2026.** Carried out under Indiane's authorization. The
`nephos/dimension/rem` transform in `scripts/build-tokens.mjs` divides by 16 and
emits `rem`; zero is emitted as `0`. **92 of the 100 `dimension` tokens** were converted
— space, control height, icon size, layout width and height,
focus thickness and the 42 typography ones. The 8 radius ones are left out by P62.5.

The 8 primitives of `core/radius` were left out, by the decision recorded in
**P62.5**, below.

---

### P62.5 — The radius stays in `px`

**Indiane's decision, 28/08/2026.** `core/radius` stays out of the P62.4
conversion. The other 92 `dimension` tokens go to `rem`; the 8 radius ones remain
in `px`.

**Why this decision exists.** The scope of P62.4 cites "radius" among the
affected families and, in the same paragraph, determines that `design.md` **does not
change**. For the radius, the two things do not fit together: `raio_regras` in
`design.md` declares `unidade_css: px`. Converting the radius would require changing the
contract that P62.4 itself orders to preserve.

**Why `px` and not `rem`.**

1. **The rule has a written reason, and the reason is still valid.** `design.md`
   explains: `"Raio em rem cresceria com a fonte do usuario e um botao de 6px viraria capsula. Forma nao acompanha tamanho de texto."`
   (a radius in rem would grow with the user's font and a 6px button would turn into a capsule; shape does not follow text size). `px` and `rem` behave
   the same under browser zoom; the difference only shows when the
   user enlarges the font — and then a radius in `rem` **deforms** the button instead of
   following it.
2. **The mention of "radius" in P62.4 is incidental, not reasoned.** It appears
   in an enumeration of the families of the `dimension` layer. The part of P62.4 that was
   actually decided is the other one: the code starts complying with the contract. Here, the
   contract says `px`.
3. **`core/radius/full` is `9999px`**, which in `rem` would become `624.9375rem` —
   a value nobody would write on purpose, and a sign that the family was not
   considered when the list was written.

**What this decision does NOT do.** It does not change `raio_regras` in `design.md`: it
confirms it. It creates no new exception — the radius was already the only foundation declared in
`px`. It does not touch the other three `unidade_css` rules.

**Cost of changing course.** Low and symmetric: converting the radius later means
moving `'radius'` out of the `NO_CONVERSION` constant (formerly `SEM_CONVERSAO`;
renamed by P64 on 29/09/2026) in
`scripts/build-tokens.mjs` and running `npm run build:tokens`. But it would require changing
`raio_regras` in `design.md` along with it, and then it stops being a pipeline change and
becomes a visual contract change.

**Status.** Decision adopted by Indiane on 28/08/2026 — documentary review of the
evidence completed by Copilot on 09/09/2026. The review confirmed the compatibility
with `raio_regras` in `design.md`, the separation of the 8 radius tokens from the 92 converted `dimension`
tokens and the cost described for a future change.

**Reviewed and approved by Mauro on 09/09/2026**, in PR #25, on commit `5fa4821`,
merged into `v/3.0.0` in `ed7c009`. These are two distinct pieces of evidence and both are necessary:
Copilot's documentary review checked the evidence, and Mauro's approval is the
human review rite that the other technical decisions went through. With it, P62.5 is no longer
the only P62 decision without a recorded review.

### P62.6 — Information trigger: `info` and `infoLabel`

*Amended by P77 (21/10/2026): the balloon opens on hover and on keyboard focus, above the label, with no click toggle, and the trigger is described by the tooltip instead of controlling it. The paragraphs this changes are marked below; the text is kept as it was written.*

**Conflict with P62.3.** P62.3 fixed three public properties (`required`,
`for` and `text`). L8 of the decision register (08/09/2026) says that gaining `info`
is a contract change, and L9 and L11 (01/10/2026) give the trigger focus and a balloon.
This decision extends the API to five properties, through the rite of "How to change one
of these decisions": the conflict is here, the proposal is this section, and the human
review is the one by `maurocsjr` in the PR. The text of P62.3 does not change; it only gains the
annotation "Amended by P62.6".

**Decision.**

- **API: two new properties, neither reflects** (they are content, like `text`).

  | Property | Role |
  |---|---|
  | `info` | String, empty by default. The text of the explanation, already localized by the consuming application. It is the `text` of `nph-tooltip` |
  | `infoLabel` (`info-label`) | String, empty by default. The accessible name of the trigger (L11.3) |

  The trigger appears only with both filled, after `trim`. `info` without
  `infoLabel` is invalid input: the trigger does not appear and `console.error` is emitted in
  development, once per cause. The label remains: it is the name of the
  control and cannot disappear because of the help. This adapts the invalid input
  rule of `docs/stories.md` (§2.5, which says to draw nothing) only to the invalid
  part, as §2.5 itself asks for another piece: decide and record.
  `infoLabel` without `info` is an assembly state: nothing, no error (decision of
  01/10/2026: an empty `infoLabel` omits the trigger).
- **Semantics.** The trigger is a native `<button type="button">` **after** the
  `<label>`, outside it: inside, it would enter the accessible name of the control. It carries
  `aria-label` = `infoLabel`, `aria-expanded` and `aria-controls` with the `id` of the
  `nph-tooltip`, unique per instance. *(Superseded by P77: no `aria-expanded` and no `aria-controls`; the `id` is the one of the trigger, and the tooltip describes it with `aria-describedby`.)* The icon is `circle-info` `solid` `sm`,
  decorative. The `nph-tooltip` exists from mount, closed, because the
  `role="status"` region must exist before opening (P65). The open state is
  internal and is not API. *(Superseded by P77: the host of the tooltip is a `role="tooltip"` and the open state belongs to the tooltip.)*
- **Open and close.** *(Superseded by P77: the balloon opens on hover and on keyboard focus and closes with Esc, when the pointer leaves or on blur; a click does nothing, and touch never opens it. The `nph-tooltip` does all of it; the label keeps no listener.)* Click, Enter or Space toggle, through the native behavior
  of the button; on opening, the trigger receives `focus()` (in Safari, clicking a
  button does not give it focus, and without focus Esc would not reach it). No hover. They close:
  - **Esc** (L11.5), in a `keydown` listener on the trigger itself, never on the
    document. With the balloon open, it closes and stops propagation — the dialog that
    contains the form does not close along with it; with the balloon closed, it does not intercept;
  - **click outside** (L11.5), outside the trigger and the balloon. Clicking the label
    text closes and moves focus to the control (P62.1). A `pointerdown` listener on the
    document, in capture, only while open, removed on closing and on disconnecting;
  - **Tab out**: `focusout` of the trigger closes when focus goes to an
    element outside the `nph-label`. It is the keyboard reading of the "click outside"
    of L11.5: without it, the balloon would stay open over the next field, with no Esc to
    close it. Reading confirmed by Indiane on 06/10/2026; the implementation is
    reviewed in the PR. A click on the balloon, which is not focusable, does not close it.
- **Anatomy, only through tokens** (component set `374:6` and frame `1194:1482`). Only with the
  trigger, the host receives `data-nph-info`, and the root becomes `inline-flex`,
  centered, with a `gap` of `space/inline-tight` and `position: relative`; without it, the
  root stays `inline-block`. The trigger is 24 × 24, the artwork of
  `icon/size-sm` with `space/inline-tight` around it (WCAG 2.5.8), with no background or
  border, in `color/muted-foreground`. Focus, only on `:focus-visible`, is the border
  of `border/width` in `focus/border` with radius `focus/border-radius-control` and
  the halo of `focus/ring-width` in `focus/halo` with radius
  `focus/radius-control-with-border`, both outside — the same drawing as the
  focus of `nph-button` in Figma (L9). The balloon sits below the label, aligned
  to the start, at `space/inline`, in `position: absolute`: it does not push the
  form, as the `use` of `color/tooltip` asks ("does not block the page"). *(Superseded by P77: above the label by default, centered on the information icon, placed by the `nph-tooltip` in the top layer, flipping when it does not fit.)*
  The width is that of the text, up to the maximum of `nph-tooltip`.
- **Literals and why:** `transparent` (trigger without background), `calc(-1 * …)`
  to put border and halo outside, `position` and `inset` of the balloon, and the
  button resets (`margin: 0`, `border: 0`, `font: inherit`), because the element lives in the
  light DOM and an application stylesheet can reach `button`. No visual value.

**Known limits.**

- **L-a — `use` of `color/muted-foreground`.** The `use` in `design.md`
  ("Caption, helper text, placeholder, metadata") does not mention the icon of the
  trigger, which the accepted Figma uses (contrast of 6.69:1 in light and 9.81:1 in
  dark, L8). The code follows Figma. Indiane decided on 06/10/2026 to extend the
  `use` to the trigger icon, in PR #57; with it, this limit is resolved.
- **L-b — rule 6 of `design.md`.** Rule 6 and `focus-ring/default` still
  speak only of the `focus/ring` ring. The alignment to focus by border and halo is in
  PR #57, which already mentions the `info` trigger; this one goes in after it.
  *Resolved by PR #57:* rule 6 now names the focus border and halo, and cites the
  `info` trigger of the `nph-label`.
- **L-c — no `z-index`.** *(Resolved by P77: the balloon is in the top layer and flips when it does not fit.)* There is no layer token. A positioned sibling that
  comes later in the DOM can end up on top of the balloon. The balloon also does not flip
  upward near the edge of the screen.

**Source.** Anatomy and behavior: L8 to L11 of the decision register (vault),
accepted by Indiane on 08/09/2026 and 01/10/2026, and the `nph-label` frame
(`1194:1482`) with component set `374:6`, in the Figma file `DS-IA-NEPHOS 5.0`. The API
(`info`, `infoLabel`), the semantics and the adaptation of §2.5 are a technical proposal
of this implementation. Closing by Tab is a reading of L11.5, confirmed by
Indiane on 06/10/2026.

**Status.** Anatomy and behavior adopted by Indiane on 01/10/2026; API and
semantics approved by `maurocsjr` in PR #58 (DSA-04), merged in `455ead8`.

---

## P63 — Metadata generated from the spec

**Decision.**

- The spec in `fichas/<name>.md` remains the source of the piece's contract. The
  **Metadata** is a derived copy, in JSON, of the spec's YAML.
- Reading happens **at build time**. The file is generated by
  `node scripts/verificar-operacao.mjs --gerar-metadata`, is versioned and is
  **never** edited by hand.
- The location is `src/shared/metadata/<piece>.json`. Only a spec with `status: active`
  (renamed in DSA-15) generates a file.
- The JSON mirrors the whole YAML, in the spec's order, with 2-space indentation, LF
  line endings and a final newline.
- The verifier rule `V32` fails Metadata that does not match the spec, JSON
  without a current spec, and a spec outside the reader's grammar.

**Reason.** Code, Storybook, tests and a future query server need to
read the contract without parsing Markdown. Generating the copy from the spec delivers
that format without opening a second source: `V27` still fails `meta.ts`
and `metadata.ts` inside `src/components/`.

**Scope.** The spec's YAML is read by `scripts/spec-lib.mjs` (formerly `ficha-lib.mjs`; renamed by P64 on 02/10/2026), which covers only the
subset the template uses and rejects, with the line number, what it does not
recognize. No new dependency comes in. Task, context and evidence
remain in JSON, as decided on 02/09/2026.

**Impact.** Whoever changes a current spec runs `--gerar-metadata` in the same
commit. Without it, `npm run test:operacao` fails by `V32`.

**Out of scope.** The Metadata tab in Storybook, the query server
(MCP) and checking the spec's `api` block against the code.

**Annotation of 15/10/2026.** P71 makes the `Docs` pages read `use_when` and
`do_not_use_when` from the Metadata. The Metadata tab stays out of scope.

**Status.** Decision adopted by Indiane on 28/09/2026, by delegation —
reviewed and approved by Mauro on 30/09/2026, in the team chat.

---

## P64 — Code language

**Decision.**

- **Code names** — variable, constant, function, class, parameter and
  internal property — are written in **English**.
- **Comments, error messages and output for whoever maintains the repository**
  remain in **PT-BR**, the language of the team and of the internal documentation.
  *(Superseded by the amendment of 06/10/2026, below: they move to English.)*
- Applies to all versioned code: `scripts/`, `src/`, `stories/` and
  `.storybook/`.

**Outside the rule**, because it is a data or interface contract and changing it would break
whoever already uses it:

- the keys of the task, context and evidence JSON, the keys of the token JSON
  and the keys of the specs' YAML;
- the command-line flags, the script names in `package.json` and the
  file names cited in a command recorded in `docs/operacao/` (today, only
  `scripts/verificar-operacao.mjs`);
- the public names, which are already English: `nph-*` tags, properties, custom
  properties and the `data-nph-*` attributes;
- the text shown to whoever reads: test description, messages and the text of
  the dictionaries in `.storybook/i18n/`; *(test description and messages:
  superseded by the amendment of 06/10/2026, below)*
- the historical record, which keeps citing the name of the time.

**Reason.** Until now there was no rule, and practice was mixed:
`verificar-operacao.mjs` was entirely in PT-BR, `build-tokens.mjs` mixed both
languages, and the components had an English API and internal functions in PT-BR. The
review of PR #41 pointed this out. The rule follows what P20 already fixes for tokens and
theme and what `fichas/_modelo.md` fixes for the specs: identifiers in English,
everything else in Portuguese.

**Impact.** New code is born under the rule. Existing code migrates folder by folder, in
task `DSA-07`, without changing behavior: the output of the scripts is identical before and
after, and the generated files do not change. `scripts/` migrated on 29/09/2026.

**Amendment of 02/10/2026 — file names.** A technical file name in
Portuguese kept the language mix that P64 removed from identifiers. The
renamed files are not cited by a command recorded in `docs/operacao/` nor
by a schema; the current documentation that cites them changes along with them. Technical
code file names (`src/`, `stories/`, `.storybook/`, `scripts/`) also follow
the rule. What stays: what a command recorded in `docs/operacao/` cites, the directories
of the verifier contract (`fichas/`, `docs/operacao/tarefas/`, `evidencias/`,
`contextos/`, and the same subfolders inside the fixtures) and the documentation, which
includes the names of the evidence files. The fixture cases of the verifier
and of the invariance test also move to English. Proof: `npm run test:naming`, with the contract
exceptions in `scripts/naming-exceptions.json`. Adopted by Indiane on
02/10/2026; approved by Mauro in PR #49.

**Amendment of 06/10/2026 — language of the documentation, comments and
messages.** The repository now has a single language for whoever reads it, person or
agent: English.

- **In English:** all the code, including **comments**, **messages**
  (console, `throw`, `Error`, process output, `fail`/`warn`, assertion
  messages) and **test descriptions** (`describe`, `it`, `test`), which are code text
  and not text shown to whoever uses Storybook; the **specs**; **all the
  DS documentation the agent reads** — `design.md`, `AGENTS.md`, `CLAUDE.md`,
  `GOVERNANCA.md`, `contributing.md`, the `README.md` and all of `docs/`, including
  `docs/operacao/` (tasks and evidence); and **Storybook**, with English as the
  source and default language.
- **The English spec is the source.** The component frame in Figma, in
  Portuguese, is the version for people; if the two diverge, the spec prevails.
- **Stays out, in Portuguese:** Figma; the team's working vault;
  commits, pull request descriptions and comments for reviewers; the translated values
  of the `pt-BR` and `es` dictionaries in `.storybook/i18n/` and the `pt-BR` and
  `es` translations of the public documentation; the historical record, which keeps citing the name
  and the text of the time.
- **Contract keys do not change now.** Key and enum value of the task, context and evidence
  JSON, key of the specs' YAML (and of the Metadata) and
  key, mode and brand of the token JSON — `objetivo`, `estado`,
  `aguardando-decisao`, `use_quando`, `modos`, `claro`, `escuro` — remain in
  Portuguese until their own task, `DSA-15`, which migrates last. Text that cites
  one of them puts it between backticks. On 06/10/2026 `DSA-15` moved the contract
  keys to English, with the map in `docs/operacao/tarefas/DSA-15.md`; the keys of
  `design.md` and the brand names stay as they are.
- **Storybook naming.** Story title, story name, story export and page anchor
  are identifiers in English: the Storybook ID and permalink come from them.
  The visible text of a story comes only from the dictionaries in
  `.storybook/i18n/`, and no visible text is hand-written in a story. The
  sidebar label comes from the `sidebar` subtree, whose keys are the story and
  group IDs, in English. The Storybook IDs and URLs change once, in this
  amendment. Proof: `npm run test:naming`, which reads the title, the name and
  the `sidebar` key as identifiers and fails Portuguese text hand-written in a
  story. Adopted by Indiane on 06/10/2026, from Mauro's review in PR #56.
- **The translation is faithful:** it changes no rule, number or decision.

**Proof.** `npm run test:naming` now fails Portuguese in comments,
messages and test descriptions in `src/`, `stories/`, `.storybook/` and `scripts/`,
including comments inside `html`, `svg` and `css` templates. The documentation is
checked by the same command, by vocabulary (`scripts/language-lib.mjs`), in
two groups — documentation and specs —, which stay in warning mode until the translation of
each one lands. A text exception goes into `scripts/naming-exceptions.json` (code)
or into `scripts/language-exceptions.json` (documentation), only with the classes
`prose-text` and `contract-term`, which never cover a technical name. Adopted by
Indiane on 06/10/2026.

**Amendment of 15/10/2026 — American English.** No rule named the variant, and
the repository mixed both: `.storybook/i18n/en.json` and parts of `README.md` and
`docs/tokens.md` are British (`colour`, `behaviour`, `centre`), while `design.md`,
the specs, this note and every identifier are American (`color/*`, P20).

- The English of this repository is **American English**, in prose as in
  identifiers. It covers everything this decision puts in English: the code text,
  the specs, the documentation and the `en.json` dictionary.
- **Proof:** the cspell spell checker, set to American English (`en-US`), run by
  an npm script. Its dependency, configuration and script, and the fixes of the
  British spellings, go through a pull request of their own; a change to
  `README.md` or `docs/tokens.md` brings its `pt-BR` and `es` pairs.
- Story IDs do not change: they come from identifiers, which were already
  American.
- **Stays out:** the `pt-BR` and `es` translations, and the historical record,
  which keeps the text of its time.

Adopted by Indiane on 15/10/2026 (DSA-30, D8).

**Implemented in DSA-37.** `npm run test:spelling` runs cspell with
`cspell.config.yaml`: `en-US` over the files this decision puts in English, with
each exclusion and its reason in the file — the translations, the historical record,
the generated files, the token source and the Portuguese-by-design data of the
language proof. A span between backticks, in Markdown or in a code comment, and a
fenced block other than `json` or `yaml` are code and stay out; a template literal,
the data block of a task and a `design.md` list item with a space stay in, and
`scripts/test-spelling.mjs` proves the configuration with probes before the run.
The British forms are `flagWords`, since the `en-US` dictionary alone accepts some
of them (`centre`, `catalogue`, `artefact`). `full stop` is two valid words, which no
spell checker catches: it became "period" once. `labelled` and `cancelled` pass, as
the `en-US` dictionary accepts them.

**Status.** Decision adopted by Indiane on 28/09/2026 — reviewed and approved
by Mauro on 30/09/2026, in the team chat. Amendment of 02/10/2026 approved by
Mauro in PR #49, merged on 05/10/2026. Amendment of 06/10/2026 adopted by
Indiane: the language of the documentation, comments and messages approved by
Mauro in PR #59, merged in `addb034`; the Storybook naming item approved by
Mauro in PR #56, merged in `455ead8`. Amendment of 15/10/2026 adopted by
Indiane; reviewed in the pull request that brings it.

---

## P65 — `nph-tooltip`: API and semantics

*Amended by P77 (21/10/2026): the tooltip opens and closes by itself, on hover and on keyboard focus, on any element; it is a `role="tooltip"`; it places itself. The paragraphs this changes are marked below; the text is kept as it was written. `text`, the anatomy and the rule of the text stay.*

**Decision.**

- `nph-tooltip` is a Web Component with **open Shadow DOM** (P01). The CSS
  lives in `nph-tooltip.css`, imported `?inline`, as in `nph-icon`.
- **Public API: two properties.**

  | Property | Role |
  |---|---|
  | `text` | String, default empty. The bubble text, already localized by the consuming application. Empty or only spaces: nothing is shown |
  | `open` | Boolean, default `false`, reflected to the attribute. Shows the bubble |

- **No slot, no event, no positioning and no trigger of its own.** *(Superseded by P77: it finds its element by `for`, opens, closes and places itself; `open` stays as the state.)* Whoever
  opens, closes and positions it is the consumer. The first is the `info` trigger of
  `nph-label`, which opens on click, Enter or Space and closes with Esc or a click
  outside; the bubble does not open on hover.
- **Toggletip semantics.** *(Superseded by P77: the host is a `role="tooltip"`.)* The host is a `role="status"` live region from
  mount, open or closed: the screen reader only announces a change inside
  a region that already existed. The bubble is not focusable; focus stays on the trigger.
- **Anatomy only through semantic tokens:** background `color/tooltip`; text
  `text/body-sm` in `color/tooltip-foreground`; radius `radius/inner`; padding
  `space/inline-tight` top and bottom and `space/inline` on the sides;
  `elevation/dropdown`; no border and no arrow. Width up to
  `layout/max-tooltip-width` and height up to `layout/max-tooltip-height`.
- **The text is not truncated.** It follows the width up to the maximum and wraps only
  between words: no ellipsis, no automatic hyphenation, no broken
  word. It fits in up to two lines; longer text is a content error.

**Source.** Behavior and scope: Indiane's decision on 01/10/2026, L11.5 of the
decision register (vault). Anatomy: L11.6 and L11.7 and the `nph-tooltip` frame
(`1237:5`) accepted in the Figma file `DS-IA-NEPHOS 5.0`, with component `1237:3`. The
padding follows the redesign accepted on the same day; L11.5 still cites
`space/container-padding`, which the redesign replaced. The API (`text`, `open`)
and the semantics (`role="status"`) are a technical proposal of this implementation.

**Known limit.** `elevation/dropdown` is emitted in `:root` with
`var(--nph-shadow-color)`. In a subtree with another `data-nph-color-scheme`, the
shadow keeps the root's color. It is a pending item of the token generator, and not
of this piece. *Resolved by P67.*

**Status.** Anatomy and behavior adopted by Indiane on 01/10/2026; API and
semantics approved by Mauro in PR #51 (DSA-08), merged on 05/10/2026.

---

## P66 — `nph-spinner`, `nph-separator` and `nph-kbd`: API and semantics

**Decision.** The three pieces are Web Components with **open Shadow DOM** (P01),
CSS in its own file imported `?inline`, as in `nph-icon`. None has a slot,
event, focus, click, color property or `::part`. Anatomy only through semantic
tokens. Invalid input renders nothing and emits `console.error` only in
development, with no visual fallback — the same rule as P21, adopted here by
its own decision, as `docs/stories.md` (§2.5) asks.

- **`nph-spinner`**
  - `size`: `sm` (default) or `md`, reflected to the attribute. The default follows the
    accepted frame and supersedes the `sem padrão` of the spec of 31/08/2026.
  - `label`: optional string. When not empty after `trim` and with a valid `size`, the
    host gets `role="img"` and `aria-label`. Without it, `aria-hidden="true"`. It is the
    pattern of `nph-icon` (P21, item 2).
  - The drawing is the `circle-notch` of `nph-icon`, in the same `size`. It spins with
    `motion/loop-duration` and `motion/loop-easing`. With `prefers-reduced-motion:
    reduce` the spin stops (WCAG 2.3.3).
  - Written literals: `rotate(0)` and `rotate(1turn)` in the `@keyframes`. They are the
    geometric definition of the turn, not a visual decision.
- **`nph-separator`**
  - `orientation`: `horizontal` (default) or `vertical`, reflected to the attribute.
  - One line of `border/width` in `color/border`. The host is `aria-hidden` and
    has no role: it is decorative.
  - It fills the container. The horizontal one fills the width in a block parent or
    a column flex. The vertical one fills the height in a row flex parent or grid.
    Outside that, whoever uses it gives the length.
  - `layout/separator-width` and `layout/separator-height` are not consumed. The
    two are the FIXED length of master `762:6`, and the accepted frame says
    `a instância preenche o contêiner`.
- **`nph-kbd`**
  - `text`: string, default empty. It is the Figma property `tecla`. The name is
    `text`, as in `nph-label` (P62.3) and in `nph-tooltip` (P65), and not `key`,
    which consuming frameworks reserve. `K` is only example content from
    Figma.
  - Empty or only spaces: nothing is shown (0 × 0), with no error. It is the
    mount state before the consumer fills in the text.
  - The text sits inside `<kbd>`, and the screen reader reads the key through it. A
    combination joins one piece per key.
  - The border is an inside stroke, as in Figma, made with `box-shadow: inset` in
    `border/width`. The height stays equal to that of the accepted component: the line of
    `text/label-sm` plus `space/inline-tight` top and bottom. The only written
    zero is `margin: 0`, which removes the default margin of `<kbd>`.

**Source.** Frames accepted in the Figma file `DS-IA-NEPHOS 5.0` on 01/10/2026:
`nph-spinner` (`1195:22210`, set `281:11`), `nph-separator` (`1196:674`,
set `762:6`) and `nph-kbd` (`1193:20`, component `772:3`). All three have Figma UX QA
and textual audit approved. The names `text` and `orientation`, the
empty default of `text`, the `role="img"` semantics of the spinner and the
invalid input rule are a technical proposal of this implementation.

**Out of scope.** The spinner inside `nph-button` (Batch B). Determinate progress
indicator. Separator with text. Key combination in a single piece.

**Status.** Anatomy and behavior accepted by Indiane on 01/10/2026; API and
semantics approved by Mauro in PR #54 (Batch A), merged in `d01da7b`.

---

## P67 — Dependent invariants in each scheme root

This decision **complements P20** without changing it. P20 still fixes the two
attributes as the theme contract; P67 says how they apply in a part of the screen.

**Technical conflict.** A custom property with `var()` resolves on the element that
declares it, and the child inherits the already resolved value. The generator emitted the invariants
once, only in `:root`. In a part of the screen with another brand or another scheme, the
invariant that points to `theme/*` or to a variant kept the root's
value. Measured in the browser: in `data-nph-brand="educacao"`, `--nph-focus-halo`
came out as `#b1cdfb`, the Sistemas halo. In the shadow (`elevation/*`), the color stayed the light
one in a dark part — the limit recorded in P65.

**Decision.**

- An invariant is **dependent** when some reference of it points to
  `theme/*`, to a variant or to another dependent (fixed point, in
  `scripts/tokens-lib.mjs`, `dependents()`).
- The generator emits the dependents in `:root, [data-nph-color-scheme]`: every scheme
  root redeclares them, and the `var()` resolves there the local brand and scheme. The
  other invariants stay only in `:root`.
- **Consumption, decided by Indiane on 05/10/2026:** a part of the screen with another
  brand carries `data-nph-brand` **and** `data-nph-color-scheme` on the same element. Only
  the scheme in a part of the screen also works. Only the brand, without the scheme on the same
  element, is not supported.
- New generator validation: a dependent outside the scheme block, or an
  independent one inside it, fails the build.

**Reason.** Redeclaring only the dependents, and not all invariants, preserves the
consumer's customization (P02): an independent invariant customized in
`:root` still reaches any part of the screen. Requiring both attributes
together dispenses with `@scope` and does not ask for a recent browser.

**Limit.** A dependent customized only in `:root` does not reach a part of the
screen with `data-nph-color-scheme`: there it is redeclared. To customize it,
declare it on the scheme element as well.

**Impact.** The generated CSS moves lines from one block to another, without changing any
value. The proof is in `src/shared/tokens/tokens-cascade.test.ts`: a part of the
screen with brand and scheme resolves every brand and semantic token the same as the root
with the same attributes, in the seven brands and both schemes. The gate command
of DSA-04 (`conferir-tokens-figma.cjs`) now accepts both invariant
blocks.

**Rite.** This decision touches the limit of P65 and the use of P20, so it follows the
rite of the section "How to change one of these decisions": the technical conflict is above, the
proposal is this section, and the human review is the one by `maurocsjr` in the PR. The text of the
P65 decision does not change; only its limit gets the annotation.

**Status.** Consumption decided by Indiane on 05/10/2026; generator approved by
Mauro in PR #55, merged in `7dd370d`.

---

## P68 — `nph-badge` and `nph-button`: API and semantics

**Decision.** The two pieces are Web Components with **open Shadow DOM** (P01),
CSS in its own file imported `?inline`, as in `nph-icon`. Neither has a slot,
event of its own, color property or `::part`. Anatomy only through semantic
tokens. Invalid input renders nothing and emits `console.error` only in
development, one per cause and accumulating — the rule of P21, adopted here by
its own decision, as in P66. The names follow P64.

- **Names common to both.** The Figma `tipo` is `severity`, and the `enfase` is
  `emphasis`. `severity` is the PrimeNG name, which is the source of the values
  (`primary`, `secondary`, `info`, `warn`, `help`, `danger`, `success`; B1 of
  the decision register). `type` is not used: on the button, it is the native
  attribute that decides form submission. The two pieces use the same name for
  the same choice.
- **`nph-badge`**
  - `severity`: the types above, default `primary`, reflected to the attribute.
  - `emphasis`: `solid` (default) or `light`, reflected to the attribute. The
    defaults are those of set `878:30`.
  - `text`: string, default empty. It is the accessible name. Empty or only
    spaces: nothing is shown (0 × 0), with no error. It is the mount state, as in
    `nph-kbd` (P66), and the rule of the frame: if there is nothing to write,
    there is no badge.
  - `icon`: string, default empty. A name from the `nph-icon` core, before the
    text, in `icon/size-sm`, in the text color and decorative.
  - Text only, no role. It receives no click, focus or hover: the hover left
    Figma on 02/10/2026, because the badge is not clickable.
  - The text stays on one line (`white-space: nowrap`): one or two words.
- **`nph-button`**
  - `severity` (default `primary`), `emphasis` (`solid`, default, `outline`,
    `light` or `ghost`) and `size` (`compact`, `default`, default, or `large`).
    `outline` and `ghost` exist only in `primary`, `secondary` and
    `danger`, and `light` only in `primary` and `danger` (B1; the `secondary`
    `light` was removed in DSA-64). The `default` default is Indiane's decision on 05/10/2026,
    through T4 (`compact` is tied to the dense context), and supersedes the
    `padrão compact` of the accepted frame (`1197:5449`, section 5). The three
    are reflected to the attribute, as are `disabled` and `loading`: the internal
    CSS selects by them.
  - `text`: what happens on click, and the accessible name. It stays on one line
    (`white-space: nowrap`), because the height is fixed by the control token.
  - `icon-start` and `icon-end` (properties `iconStart` and `iconEnd`): one core
    name each, in `icon/size-sm` when there is text, and they can coexist (B6).
  - **Icon only (B5).** *(Amended by P86: the icon-only button is square or circular, through
    `shape`, and renders its own `nph-tooltip`, which names the native button.)* With no text and one icon, the button is square, at the
    control height, with no side padding, and the icon follows the box: `sm` in
    `compact`, `md` in `default` and `lg` in `large` (set `498:15671`). The
    `label` is required and becomes the `aria-label` of the native button; with
    text, it is not used. The name `label` is Indiane's decision on 05/10/2026:
    it supersedes the `aria-label` approved on 02/09/2026, because an
    `aria-label` placed on the host does not name the button inside the shadow
    root, and it follows `nph-icon` and `nph-spinner`.
  - A native `<button type="button">` inside the shadow root, with
    `delegatesFocus`. Native keyboard: Tab enters and leaves; Enter and Space
    activate. The click is the native `click`, which crosses the shadow root and
    reaches the host.
  - **Focus** only on `:focus-visible`: a `border/width` border close to the
    box, with radius `focus/border-radius-control`, and a `focus/ring-width` halo
    outside, with radius `focus/radius-control-with-border`, without changing the
    size. The border has the color of the type (`color/primary`, `status/info`,
    `status/warning`, `status/help`, `color/destructive`, `status/success`) and,
    in `secondary`, `focus/border`. The halo is `focus/halo` in `primary` and in
    `secondary`, and `focus/halo-<hue>` in the others. The same in every
    emphasis.
  - **Hover** (`hover-active`) *(Amended by P88: in the button with text, the start and end
    icons also switch from `light` to `solid`; since the amendment of P88 of 27/10/2026, so
    does the icon of the icon-only button.)* on the hover tokens of each pair: `color/*-hover`
    and `status/*-hover` in solid, by the decision of 02/10/2026, which
    supersedes B4; `*-surface-hover` and `*-on-surface-hover` in `outline` and in
    `light`; the surface of the type in `ghost`.
  - `disabled`: native `disabled`. The button leaves the Tab order, does not fire
    a click and stays at `state/disabled-opacity`, in the resting colors.
  - `loading` (the Figma `carregando`): the `nph-spinner` spinner takes the place
    of the start icon, the end icon disappears and the text stays. In icon only,
    the spinner replaces the icon: `sm` in `compact` and `md` in `default` and in
    `large`. The button stays focusable, with `aria-disabled="true"` and
    `aria-busy="true"`, and the click does not reach the consumer. The spinner is
    decorative.
  - In `disabled` and in `loading`, a listener on the native button and another,
    in the capture phase, on the host stop the `click`, including one from
    `click()` called on the host.
  - Invalid input: `severity`, `emphasis` or `size` outside the list; `outline`,
    `light` or `ghost` in `info`, `warn`, `help` or `success`; an icon outside
    the core; no text and two icons; no text, one icon and no `label`. **No text
    and no icon is the mount state**: nothing, with no error, as in `nph-kbd`.
- **Written literals, and why.** `transparent` (`ghost` has no background);
  `nowrap`; `calc(-1 * ...)`, which places the focus border and halo outside;
  and `inset 0 0 0` in the `box-shadow` of the `outline` border, which is an
  inside stroke, as in `nph-kbd`. None is a visual value.

**Known limits.**

- **L-a — subtree with another scheme or another brand.** `status/on-solid`
  (alias of `color/background`) and `focus/halo` (alias of `theme/brand-200`)
  are emitted only in `:root`. In a part of the screen with another
  `data-nph-color-scheme` or another `data-nph-brand`, both keep the root's
  value: the solid text of `info`, `warn`, `help` and `success`, in both pieces,
  and the halo of `primary` and `secondary`. It is the same pending item of the
  token generator that P65 records for the shadow. When the generator redeclares
  these invariants per scheme, both pieces fix themselves: they consume the same
  token names. *Resolved by P67:* both are emitted in each scheme root, and a
  part of the screen with another brand carries `data-nph-brand` and
  `data-nph-color-scheme` on the same element. The tests of both pieces measure
  this.
- **L-b — `use` in `design.md` narrower than the accepted Figma.** The accepted
  frame and sets use tokens where the `use` does not yet cite that use:
  `color/primary-surface` and `color/destructive-surface` (the `use` cites
  "nph-button with light or outline emphasis") also serve the `ghost` hover and
  the `light` badge; `color/primary-on-surface` ("USE only on it") also in the
  `ghost` with no background; `color/muted` (`nao_use: "Hover."`) in the hover of
  the `secondary` `ghost` and as the background of the `secondary` `outline`;
  `status/<hue>` (icon, dot, bar) as the solid background of badge and button;
  `status/<hue>-surface` and `-foreground` ("Always together with the other
  three roles") in the `light` badge, without `-border`. The pieces follow
  Figma; widening the `use` is a pending decision of Indiane, and this PR does
  not change `design.md`. *Resolved by PR #57:* the `use` of each of these
  tokens now cites these uses.

**Source.** Frames accepted in the Figma file `DS-IA-NEPHOS 5.0` on 01/10/2026
and completed on 02/10/2026: `nph-badge` (`1196:1100`, set `878:30`; the hover
left) and `nph-button` (`1197:5449`, sets `461:13009` and `498:15671`; the solid
hover moved to the hover tokens). Both have Figma UX QA and textual audit
approved on 02/10/2026. Decision register (vault): B1, B5 and B6. The names
`severity`, `emphasis`, `text`, `icon`, `iconStart`, `iconEnd` and `loading`,
the semantics of `loading` and the invalid input rule are a technical proposal
of this implementation. The `label` and the `default` default `size` are
Indiane's decisions on 05/10/2026.

**Out of scope.** Form submission (`type="submit"`, form-associated element),
link that looks like a button, button group, fluid-width button, text on more
than one line, clickable badge and badge with a count.

**Status.** Anatomy and behavior accepted by Indiane on 01/10/2026 and
completed on 02/10/2026; API and semantics approved by Mauro in PR #56
(Batch B), merged in `455ead8`.

---

## P69 — `nph-skeleton`: API and semantics

**Decision.** `nph-skeleton` is a Web Component with **open Shadow DOM** (P01), CSS
in its own file imported `?inline`, as in `nph-icon`. It has no slot, event, focus,
click, color property or `::part`. Anatomy only through semantic tokens. Invalid
input renders nothing and emits `console.error` only in development, with no visual
fallback — the same rule as P21, adopted here by its own decision, as in P66.

- `shape`: `line` (default), `block`, `avatar-sm`, `avatar-md` or `avatar-lg`,
  reflected to the attribute. It is the Figma property `forma`, whose values are
  `linha`, `bloco`, `avatar sm`, `avatar md` and `avatar lg`. One property, as in
  the accepted frame: a second `size` property would be valid only for the avatar
  and meaningless for `line` and `block`.
- The piece is a rectangle in `color/muted`, with no border, no text and no
  animation. It is still, so there is no reduced-motion rule.
- `line` takes `skeleton/line-height` and `radius/inner`; `block` takes
  `radius/control`; `avatar-*` takes `avatar/size-*` and `avatar/radius-*`, the
  same pair as `nph-avatar`, with rounded corners and never a circle.
- The width of `line` and `block` comes from the container: both fill it in a block
  parent or a column flex parent. The height of `block` follows the content that
  will come in, so the consumer gives it; without one, the block takes no height.
- **Line height, literal reading.** The line takes only its own
  `skeleton/line-height`; the space between lines comes from the consumer. Whether
  the line should take the whole line box of the text it replaces is an open
  question of Indiane (D1 of DSA-26), and the answer changes one declaration in the
  CSS.
- The host is `aria-hidden="true"` and has no role: the piece is decorative. The
  loading container, not the piece, carries `aria-busy` while it waits.

**Source.** Frame `nph-skeleton` (`1578:38`, set `1578:37`) of the Figma file
`DS-IA-NEPHOS 5.0`, accepted by Indiane on 08/10/2026, with the Figma UX QA and the
textual audit approved in round 2. The names `shape`, `avatar-sm`, `avatar-md` and
`avatar-lg`, the semantics of the host and the invalid input rule are a technical
proposal of this implementation.

**Out of scope.** Any animation or pulse. A default height for `block`. A `size`
property. Setting `aria-busy` on the container. The `nph-avatar` piece itself,
which this one only holds the place of.

**Status.** Anatomy and behavior accepted by Indiane on 08/10/2026. API and
semantics are reviewed in the pull request that brings them; the merge is the
approval.

---

## P70 — Package entry points and the Usage section

This decision **narrows the out of scope of P19** without changing it: publishing
stays out; the import path of a component is defined here.

**Technical conflict.** The `Docs` pages show markup but not how a consumer brings a
component into a page. `package.json` has the name `nephos`, is `private` and has no
`exports` field, and P19 leaves publishing out of scope. A Usage section with an import
line (DSA-30, D2) would name a path that does not resolve.

**Decision.**

- The package is `nephos`, the name `package.json` already has. Each component is
  imported by its tag: `import 'nephos/nph-<name>';`.
- `package.json` gets an `exports` field with the pattern `./nph-*`, pointing to a
  JavaScript build of each component in `dist/`, the build output that `.gitignore`
  already excludes. The build is not versioned.
- The import line alone registers the component with its CSS: the build carries what
  the source imports with `?inline`, so the consumer needs no Vite loader. `nph-label`,
  whose CSS is global because it has no Shadow DOM (P62.1), is the case the build has
  to solve without a second import line.
- `lit` and `@fortawesome/*` stay outside the build: they are already in
  `dependencies`, so the consumer installs them, and the Font Awesome Pro license stays
  with whoever installs it. The generated token CSS is still imported on its own, as the
  `README.md` says.
- `private` stays `true`.
- Each component `Docs` page has a **Usage** section right after **API**, the position of
  section "6. Usage" in the Figma documentation model (`1134:12862`). It shows the markup
  of the accepted frame and the import line. The page reads the package name from
  `package.json`; nobody writes it by hand.
- The visible text in the markup is an attribute, because the components have no slot
  (P62.3, P65, P66, P68).

**Reason.** A design system read by agents has to say, on the page, how the piece is
consumed. The import line has to be true on the day it is written, so the entry points
come before the section.

**Impact.** The JavaScript build, its script and the `exports` field go through a pull
request of their own, with a test that the import line of each page resolves. The model of
`docs/stories.md`, §4.10, gets the Usage section after API.

**Out of scope.** Publishing to a registry, the version policy, how a consumer obtains
the built package, and the CI workflow stay as P19 left them.

**Rite.** This decision touches the out of scope of P19, so it follows the rite of the
section "How to change one of these decisions": the technical conflict is above, the
proposal is this section, and the human review is the pull request. The text of P19 does
not change; only its out of scope gets the annotation.

**Status.** Adopted by Indiane on 15/10/2026 (DSA-30, D2). Reviewed in the pull request
that brings it; the merge is the approval.

**Amended by P75 (19/10/2026).** The package name is `@iatec/nephos` (the import line is
`import '@iatec/nephos/nph-<name>';`), `private` is removed, and `lit` and `@fortawesome/*`
are peer dependencies. The text above is kept as it was written.

**Annotation of 28/10/2026 (DSA-35).** Every component `Docs` page has the Usage section right
after API, built with the `usage` block of `src/shared/docs/page.ts`: a table whose first row
is the markup, kept in `usageMarkup` of the page key of the three dictionaries so that its
visible text is translated, and whose next rows are the import lines, written by `importLine`
with the name read from `package.json`. The page's own component comes first; a component that
the markup shows and that no other line registers gets a line of its own (`nph-input` under
`nph-field`, the `nph-button` that opens `nph-dropdown-menu`), and one that the page's component
already imports, bare or for its values, does not (`nph-avatar` under `nph-avatar-stack`,
`nph-option` under `nph-select`). Data that only a property takes, such as `items` or `columns`, is not
written as an attribute: the text of the row says where it comes from.
`src/shared/docs/usage.test.ts` finds every `Docs` page by file name and fails a page without
the section after API, with a markup that differs between languages or that makes a component
report an error, or with a missing or redundant import line. The promise that the import line
alone registers the component with its CSS, `nph-label` included, is proved in a browser:
`npm run test:package` ends by importing each component through `@iatec/nephos/nph-<name>`,
resolved by `exports` into `dist/` (`vitest.package.config.ts` and
`scripts/test-package.browser.test.mjs`, two files outside the paths P03 lists, as P75,
item 11). It runs after `npm run build:lib` and never from `npm test`, because `dist/` is not
versioned, so the Build stage of `azure-pipelines.yml` installs Chromium before it.

---

## P71 — `Docs` page lists read from the Metadata

This decision **extends P63** without changing it: P63 already names Storybook as a
reader of the Metadata.

**Technical conflict.** The "use" and "do not use" lists of the `Docs` pages were
transcribed from the accepted Figma frames into `.storybook/i18n/*.json`, while the sheet
is the source of the piece (P63; P64, amendment of 06/10/2026). Four pages differ from
their sheet: `nph-badge`, `nph-button`, `nph-icon` and `nph-label` (DSA-30, D1).

**Decision.**

- A component `Docs` page reads `use_when` and `do_not_use_when` from
  `src/shared/metadata/<piece>.json`, the generated copy of the sheet.
- A test fails when the lists a page shows differ from the Metadata of its sheet.
- Figma is the source of a piece's lists only at the start. Once the sheet exists and the
  tests pass, the sheet in this repository is the source: the source of an agentic design
  system does not depend on a tool.
- Before a page moves to the Metadata, its sheet is brought level with the accepted Figma
  frame, without removing any item that Indiane accepted, and the Metadata is generated
  again.

**Reason.** Two copies of the same list drift apart, and they already did. The sheet is
the copy that agents read, so it is the one the page shows.

**Open.** The Metadata is in English only (DSA-14), and `docs/stories.md`, §4.8, asks for
every visible text in the three languages. How the `pt-BR` and `es` pages show the lists
is not decided by this note; it is a question for Indiane before the code.

**Out of scope.** The Metadata tab in Storybook, as P63 left it. Any other block of the
page.

**Annotation of 28/10/2026 (DSA-34).** Indiane answered the open question on 16/10/2026
(DSA-34, D1): the English lists come from the Metadata, and the `pt-BR` and `es` pages take
the translation of each item from `.storybook/i18n/pt-BR.json` and `es.json`. The dictionary
keeps the translations in `whenToUse` and `whenNotToUse` of the page key, at the position of
each item in the Metadata, and `en.json` keeps the Metadata lists themselves, so that the three
dictionaries keep the same shape. The block is `sheetUseDontUse`, in
`src/shared/docs/sheet-lists.ts`. `src/shared/docs/sheet-lists.test.ts` finds every `Docs` page
by file name and fails a page whose lists differ from the Metadata, an item without a
translation and a dictionary list whose number of items differs from the Metadata. Before the
move, the sheets of `nph-badge`, `nph-button`, `nph-icon` and `nph-label` took the lists Indiane
approved on 16/10/2026 (DSA-34, D2); the other pages already showed the lists of their sheets.

**Status.** Adopted by Indiane on 15/10/2026 (DSA-30, D1). Reviewed in the pull request
that brings it; the merge is the approval.

---

## P72 — Accessibility gate in the tests

This decision **closes a deferral of P19**: "interaction and accessibility tests will be
defined with the first real component".

**Technical conflict.** The first real component was `nph-icon` (PR #6), and
`src/components/` now has nine. Accessibility is proved only by assertions written per
component; `package.json` has neither `axe-core` nor the Storybook accessibility addon
(DSA-30, D3).

**Decision.**

- The Storybook accessibility addon (`@storybook/addon-a11y`) runs inside the tests,
  through the Storybook Vitest integration (`@storybook/addon-vitest`), and a violation
  fails the run.
- The rule set is WCAG 2.2 AA.
- The scope is every story, `Validation` and `Docs`: the `Docs` page is also read by
  people.
- The addon panel stays available while a story is written; the panel is not the gate.
- A known exception is written in the story itself, with the reason, the discarded
  alternative and the date, as `docs/stories.md`, §2.3, records an exception. Opening an
  exception is a human decision.

**Reason.** An assertion written per component proves what its author thought of. A rule
set run on every story catches what nobody thought of, and failing the run is what makes
it a gate.

**Impact.** The two dependencies, the test configuration and the fixes of the violations
found go through a pull request of their own. The assertions written per component stay.

**Out of scope.** Interaction tests, which P19 deferred in the same sentence. The CI
workflow, as P19 left it.

**Rite.** This decision touches the out of scope of P19, so it follows the rite of the
section "How to change one of these decisions": the technical conflict is above, the
proposal is this section, and the human review is the pull request. The text of P19 does
not change; only its out of scope gets the annotation.

**Annotation of 27/10/2026.** DSA-32 puts the gate in place: `@storybook/addon-a11y` and
`@storybook/addon-vitest` at the version of `storybook`, the stories as the `storybook`
project of `vitest.config.ts`, and `parameters.a11y` in `.storybook/preview.js` with
`test: 'error'` and the axe tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa` and `wcag22aa`.
Each story is read once, in the initial globals (light mode, default language), after
`.storybook/settle.js` lets the transitions inside the shadow roots end. The decision itself
does not change.

**Status.** Adopted by Indiane on 15/10/2026 (DSA-30, D3). Reviewed in the pull request
that brings it; the merge is the approval.

---

## P73 — `nph-togglebutton`: API and semantics

**Decision.** `nph-togglebutton` is a Web Component with **open Shadow DOM** (P01), CSS
in its own file imported `?inline`, as in `nph-icon`. It has no slot, no `::part`, no
color property and no size property *(superseded by the amendment of 29/10/2026, DSA-61:
`size` exists)*. Anatomy only through semantic tokens. Invalid input
renders nothing and emits `console.error` only in development, one per cause — the rule of
P21, adopted here by its own decision, as in P66 and P68. The names follow P64.

1. **Properties.** The Figma property names are in Portuguese and the code API is in
   English (P64). The mapping below is a technical proposal of this implementation.

   | Figma | API |
   |---|---|
   | `marcado` | `pressed`, Boolean, reflected to the attribute |
   | `invalido` | `invalid`, Boolean, reflected to the attribute |
   | `desabilitado` | `disabled`, Boolean, reflected to the attribute |
   | the label text | `text`, String |
   | `ícone início` and `ícone fim` | `icon-start` and `icon-end`, String |
   | the accessible name of the icon-only piece | `label`, String |

   `label` becomes the `aria-label` of the native button, as in P68: an `aria-label` on
   the host would not name the button inside the shadow root. `state` and `texto` are not
   properties: `state` is the interaction, and `texto` is the presence of `text`.

2. **Semantics: `aria-pressed`.** The piece is a native `<button type="button">` inside
   the shadow root, with `delegatesFocus` and `aria-pressed` following `pressed`.
   `role="switch"` and `aria-checked` are not used: the accepted board separates the piece
   from `nph-switch` and `nph-checkbox`, and says it is a button that holds a state.
   `aria-pressed` is the semantics of exactly that. The piece is not form-associated: a
   choice that goes with a submission is `nph-checkbox`, as the board says.

3. **The event `nph-change`.** The piece fires `nph-change` when the person toggles it by
   click, Enter or Space. The event bubbles, crosses the shadow root (`composed`), is not
   cancelable, and carries `detail: { pressed: boolean }` with the new value. A change of
   `pressed` made from code never fires it, so a consumer that sets the property does not
   receive its own echo. It is the **first custom event of the repository**. The native
   `click` does not say the new value without reading the element, and the prefix `nph-`
   avoids a collision with the native `change`. `nph-toggle-group` (DSA-23, PR #92)
   consumes it. A `click()` called on the host toggles the piece and fires the event too, as
   a click of the person does; a disabled piece neither toggles nor fires, also for
   `click()`. The event is typed in `HTMLElementEventMap`, so a consumer gets `detail`
   typed.

4. **Icons.** *(Amended on 29/10/2026, DSA-61: `icon-end` defaults to `none`, one icon at
   most, and each icon is drawn `light` and `solid`.)* `icon-start` and `icon-end` take
   `auto` (default), `none` or a name from the `nph-icon` core. `auto` is the pair of the board: `xmark` when off and `check` when on.
   Both glyphs are rendered, stacked, and cross-fade by opacity, so the change is the
   motion of D6 and not a swap of nodes. `none` turns the icon off. A core name is one
   fixed icon, with no swap. The board says that the icon changes in the instance, so the
   consumer may give another one; a single property per side covers the board's boolean
   (on by default) and the consumer's icon, without four properties. The icons are
   `icon/size-sm` and `aria-hidden`.

5. **`disabled` wins over `invalid`.** The board draws `desabilitado` only with `state`
   `default` and not invalid. In runtime, `disabled` suppresses the error border: it is
   listed in the sheet as an invalid combination, and is not a `console.error` case.

6. **Icon only.** With no text, the piece shows one icon, from `icon-start`; `icon-end` is
   ignored. It requires `label`. It is **50 by 36 px** *(amended on 29/10/2026, DSA-61: the
   icon follows the size, 50 by 28, 54 by 36 or 58 by 44 px)*, as the board measures it from the
   variables of set `1512:719`, and it is **not square**: the rule of `nph-button`, which
   makes the icon-only box square, is not copied.

7. **Invalid input.** The piece draws nothing and emits one `console.error` per cause, only
   in development, when: there is no `text` and no `label`; `icon-start` or `icon-end` is
   not `auto`, `none` or a core name; the piece is icon only and `icon-start` is `none`.
   `icon-end` is validated even when the piece is icon only, although it is ignored in the
   drawing. An empty string is invalid; removing the attribute leaves the property `null`,
   and the piece reads `null` as `auto`. The check runs again only when `text`, `label`,
   `icon-start` or `icon-end` changes, so toggling does not repeat the same error.

8. **Motion.** The off-to-on change animates the background, the border, the icon color,
   the label color and the opacity of the icons on `motion/state-duration` and
   `motion/state-easing`, always as a pair (D6). Width, height and position never animate.
   Under `prefers-reduced-motion` the change takes `motion/hover-duration`, and the color
   still changes.

**Reduced motion and `core/duration/100`.** The evidence of D6 and `movimento_reduzido` in
`design.md` name `core/duration/100`. Rule 4 of `design.md` forbids a component from
consuming `core/*`, and the anti-pattern A57 allows only `var(--nph-motion-*)` for a
duration or a curve. `motion/hover-duration` is the semantic alias of
`core/duration/100`, with the same value, 100 ms, so the piece uses it and no token is
created or changed. It touches the anti-pattern A58 (combine duration and curve outside the motion
roles): the pair rule says each role is two tokens that never mix, and the piece uses the
duration of the `hover` role with the curve of the `state` role. The two curves have the same value, `cubic-bezier(0.4, 0, 0.2, 1)`.
**Open question of Indiane**, recorded as D7 of the task DSA-22: approve this
substitution, or create a semantic alias for it. It does not block the pull request.

**Points for review.**

- **D6 against `movimento_regras.anime_apenas`.** `design.md` lists only opacity and
  transform as animatable; D6 animates background, border and colors. The accepted
  evidence prevails, and `design.md` does not change.
- **`use` of tokens in `design.md` narrower than the accepted board.** `color/muted` (the
  track), `color/background` (the inner area), `space/inline-tight` (on four sides) and the
  focus tokens of this piece. `design.md` does not change in this pull request; widening the
  `use` is a decision of Indiane, through Claude in Figma, as P68 recorded for L-b.
- **Contrast, measured and known limits.** The component test measures the seven brands in
  light and dark. The off label is `color/muted-foreground` on `color/muted`, and `design.md`
  marks that token as not for text needed to complete the task; it measures 5.76:1 in light and
  6.61:1 in dark, so it passes 4.5:1. The outline of the pressed inner area, `color/primary-border`
  on the track, passes 3:1 in all 14 brand and scheme pairs: the lowest value is 3.31:1 in dark
  gerencial, and 4.27:1 in light educacao. The error border, `status/error` on `color/background`,
  measures 6.88:1 in light and 5.01:1 in dark. The focus border is `color/primary`, and `design.md`
  says only `focus/border` guarantees 3:1 against the halo. It does not pass 3:1 in two ways: against
  the page background, only in dark gerencial (2.71:1) and dark rh (2.88:1); against the halo, in all
  seven brands in dark (1.76:1 to 2.94:1). In light it passes, and the lowest value is 3.33:1 against
  the halo, in educacao. The piece follows the accepted board, which draws the border in
  `color/primary`; moving it to `focus/border` is a decision of Indiane, through Claude in Figma.

**Source.** Board `nph-togglebutton` (`1512:27498`, set `1512:719`) of the Figma file
`DS-IA-NEPHOS 5.0`, accepted by Indiane on 07/10/2026, with the Figma UX QA approved on
07/10/2026 and the textual audit on 08/10/2026; the motion, answered by Indiane on
19/10/2026 (D6). The names `pressed`, `invalid`, `text`, `label`, `icon-start` and
`icon-end` and the mapping from the Figma properties, `aria-pressed`, the event
`nph-change`, the values `auto` and `none`, the cross-fade of the two icons, the rule that
`disabled` wins and the invalid input rule are a technical proposal of this implementation.

**Out of scope.** Form association and form submission. The Usage section of the page
(P70, DSA-35). The page lists read from the Metadata (P71, DSA-34). The accessibility gate
(P72, DSA-32). The brand story (DSA-36). `aria-invalid`, which is not valid on a button. A
`size` property *(added by the amendment of 29/10/2026, DSA-61)*. A slot. The pieces `nph-switch` and `nph-checkbox`,
which are planned.

**Status.** Anatomy and behavior accepted by Indiane on 07/10/2026; motion answered on
19/10/2026. API and semantics are reviewed in the pull request that brings them; the merge
is the approval.

### Amendment of 29/10/2026 — DSA-61: size, the new states and one icon at most

**Technical conflict.** The decision has no size property, draws the off piece on a
`color/muted` track and the pressed one as a raised inner area with `elevation/subtle` and a
`color/primary-border` outline, changes only the label color on hover, draws every icon
`light` and lets `icon-start` and `icon-end` both default to `auto`, so a piece with text
shows two icons. On 29/10/2026 Indiane accepted the board again (`1512:27498`, set
`1512:719`), with the size and new states, and three tokens, `togglebutton/background-hover`,
`togglebutton/background-checked` and `togglebutton/background-checked-hover`
(`docs/operacao/evidencias/DSA-61/figma-docs-accepted-2026-10-29.md`).

**Decision.**

1. **`size`.** A new property, the Figma `tamanho`: `compact`, `default` (the default) or
   `large`, reflected, because the internal CSS selects the height by it:
   `control/height-compact`, `control/height-default` or `control/height-large`, with or
   without text. It is compared as written, as in `nph-button` and `nph-input`: a value
   with spaces around it is invalid input. Any other value draws nothing and emits one
   `console.error` in development (item 7). Padding, radius, gap and text role do not
   change with the size.
2. **States.** The box has no background and no visible border off at rest; the border
   stays, transparent, so the invalid border and the focus offsets do not change the size.
   Off on hover the box takes `togglebutton/background-hover`; pressed,
   `togglebutton/background-checked`; pressed on hover,
   `togglebutton/background-checked-hover`. The label is `color/muted-foreground` off at rest
   and `color/foreground` otherwise. The inner area has no background, shadow or outline of
   its own: `elevation/subtle`, `color/primary-border` and the `color/muted` track leave the
   piece. The pressed state shows in the background, the label color and the icon; no
   semibold label and no stroke (decision of Indiane on 29/10/2026, option A of the preview).
   Disabled keeps the rest colors of its pressed value, so a pressed disabled piece keeps
   `togglebutton/background-checked`.
3. **Solid icon.** Each icon is drawn twice, `light` and `solid`, stacked in one cell, as
   P88 does for `nph-button`; the CSS shows `solid` when the piece is on or under the pointer
   and enabled, and `light` off at rest and whenever the piece is disabled. For `auto` that
   is four drawings, `xmark` and `check` in each style, still cross-faded by opacity on the
   motion of D6 (item 8).
4. **One icon at most.** `icon-start` keeps the default `auto`; `icon-end` now defaults to
   `none`. With text, both on is invalid input: the piece draws nothing and emits one
   `console.error` in development. To put the icon at the end, set `icon-start` to `none`.
   Icon only keeps item 6: it draws `icon-start` and ignores `icon-end`. Removing the
   `icon-end` attribute leaves the property `null`, and the piece reads it as `none`.
5. **Icon only by size.** The icon of the icon-only piece follows the size: `icon/size-sm` in
   `compact`, `icon/size-md` in `default` and `icon/size-lg` in `large`; with text it stays
   `icon/size-sm`. The piece still hugs its content and is never square: 50 by 28, 54 by 36
   and 58 by 44 px.
6. **Motion.** The box animates its background, border and color; the inner area has
   nothing left to animate. Item 8 holds otherwise.

**Contrast, measured.** The label and the icon pass 6:1 on the background of each state in
the seven brands and both schemes, as the board says: `color/muted-foreground` on the page,
and `color/foreground` on the three `togglebutton/*` backgrounds. Known limit, accepted by
Indiane on 29/10/2026: the checked background is 1.26:1 on the page in light and 1.54:1 in
dark, and in dark without an icon the label barely changes; the state is also told by
`aria-pressed`. The test pins both values.

**Compatibility.** A consumer that set `icon-end` and left `icon-start` on its default now
gets invalid input, and one that relied on two icons by default now gets one. No consumer in
the repository does either; `nph-toggle-group` writes `size` on its buttons (P76, amendment
of 29/10/2026).

**Status.** Rules accepted by Indiane on 29/10/2026; reviewed in the pull request that
brings them; the merge is the approval.

---

## P75 — Package `@iatec/nephos`: first release candidate

This decision **amends P19 and P70**. P19 left public publishing and the CI workflow out
of scope, and P70 fixed the package name as `nephos`, kept `private` as `true` and left
publishing to a registry, the version policy and how a consumer obtains the package out of
scope. The scope of P19 on public publishing stays as it was: the feed below is private.

**Technical conflict.** The products that will consume Nephos (Angular, Vue, React and
Blazor applications) need to install it, and nothing in the repository lets them: the name is
not scoped, the package is private, `lit` and Font Awesome Pro are `dependencies` that a
consumer cannot pin, and there is no build, no types and no manifest. P70 promised the entry
points and a test that the import line resolves; this decision delivers both and the
publication around them.

**Decision.**

1. **Name, visibility and version.** The package is `@iatec/nephos`. `private` is removed.
   The version is `5.0.0-rc.1`.
2. **Where and under which tag.** Release candidates are published to the Azure DevOps
   Artifacts feed `IATec.Community`
   (`https://sda-iatec.pkgs.visualstudio.com/_packaging/IATec.Community/npm/registry/`), by an
   Azure Pipeline that is a separate pull request. `publishConfig` carries the registry and the
   npm dist-tag `rc`: the pipeline never publishes a release candidate to `latest`. Azure Artifacts versions are
   immutable, so each publish bumps the counter (`rc.2`, `rc.3`, ...); a published version is
   never replaced.
3. **Scope of `rc.1`: the 10 components that exist on `v/5.0.0`**: `nph-badge`,
   `nph-button`, `nph-icon`, `nph-kbd`, `nph-label`, `nph-separator`, `nph-skeleton`,
   `nph-spinner`, `nph-togglebutton` and `nph-tooltip`. A component that is added later enters
   by adding its folder: the build and the `exports` pattern take it without a change.
4. **Custom elements only.** There is no React, Vue, Angular or Blazor wrapper: `AGENTS.md`
   forbids framework authoring, and a custom element is consumed by all four. The package
   ships `.d.ts` declarations, with each tag in `HTMLElementTagNameMap`, and a Custom
   Elements Manifest, `custom-elements.json`, written by `@custom-elements-manifest/analyzer`
   with its Lit plugin. The consumption guide per framework is `docs/consuming.md`.
5. **Peers.** `lit` (`^3.3.3`) and `@fortawesome/pro-light-svg-icons` and
   `@fortawesome/pro-solid-svg-icons` (`^6.7.2`) are `peerDependencies`. They stay in
   `devDependencies` at the versions the repository uses, so Storybook and the tests run as
   before. The Font Awesome Pro license stays with whoever installs it (P70): **every
   consumer, and every CI that installs the package, needs a Font Awesome Pro npm token.**
6. **Public entry points (`exports`).** `./nph-*` (one per component, `types` and `import`),
   `./tokens.css`, `./scrollbar.css`, `./custom-elements.json` and `./package.json`.
   `scrollbar.css` is public because `docs/tokens.md` already tells whoever consumes the
   tokens to load it right after them. The generated token CSS is copied to `dist/` as it
   is: no token is created or changed by the build.
7. **Layout of `dist/`.** `dist/<tag>/<tag>.js` and `dist/<tag>/<tag>.d.ts`, one ES module
   per component and ESM only; code that several components share and is not a component goes
   to `dist/shared/`, so no component is defined twice. `dist/tokens.css`,
   `dist/scrollbar.css` and `dist/custom-elements.json` complete it. `lit` and
   `@fortawesome/*` are external. The `?inline` CSS is a string inside the module (P70).
8. **The global CSS of `nph-label`.** `nph-label` has no Shadow DOM (P62.1), so its CSS is a
   plain `import './nph-label.css'`. The library build turns that import into a module that
   adopts the stylesheet once on the document, with `document.adoptedStyleSheets`, and falls
   back to a `<style>` element where constructable stylesheets do not exist. One line,
   `import '@iatec/nephos/nph-label'`, is enough in Vite, in the Angular CLI and in a bundle
   served to Blazor. `adoptedStyleSheets` was chosen over a `<style>` element because it is not
   blocked by a `style-src` Content Security Policy without `unsafe-inline`. The rule is
   document-wide: a `nph-label` inside the shadow root of another component is not reached.
   `import.meta.env` is replaced by the build, so a consumer without Vite does not break.
9. **`sideEffects` is `true`.** Importing a component registers it, and importing
   `tokens.css` loads it: both are side effects. The value is written down, and not left as
   the default, because a list that covers only `dist/` makes the bundler of this repository
   (Storybook included) drop `import '../nph-icon/nph-icon'` and ship components that never
   register.
10. **The proof.** `npm run build:lib` writes `dist/`; `npm run test:package` checks that
    every component folder resolves through `exports` in JavaScript and in declarations, has
    its tag in `HTMLElementTagNameMap` and in the manifest, that every import line the
    documentation shows resolves, that importing a component registers every component it
    renders, and that `dist/` carries no story, test, local path or `import.meta.env`;
    `npm run pack:check` runs `publint` and `@arethetypeswrong/cli` on the packed tarball.
    This is the check P70 promised for the import line of each page.
11. **Files this decision adds** outside the paths P03 lists: `vite.config.lib.ts`,
    `tsconfig.build.json`, `custom-elements-manifest.config.mjs`, `scripts/build-lib.mjs`
    and `scripts/test-package.mjs`; three development dependencies, `publint`,
    `@arethetypeswrong/cli` and `@custom-elements-manifest/analyzer`.

**Reason.** A design system consumed by products has to be installable, typed and
described. Custom elements keep the one implementation that AGENTS.md allows, and a private
feed with a release-candidate tag lets the products try it without a version that promises
stability.

**Known limit.** Font Awesome publishes each icon as a CommonJS file (`faBars.js`), and
`nph-icon` imports one file per approved icon and style. A browser cannot load those through an import map.
A consumer without a bundler step, as in Blazor, bundles `@iatec/nephos` into one file first.
Inlining the icon data in the package would remove the step, and would also put Font Awesome
Pro artwork in a package, which P70 did not allow; that is a decision for a later release.

**Out of scope.** The Azure Pipeline that builds and publishes (a separate pull request). A
release that takes the `latest` tag, and any public registry. Framework wrappers. The
Usage section of each `Docs` page (P70, DSA-35), which this decision unblocks. A root entry
point (`import '@iatec/nephos'`) that registers everything.

**Annotation of 26/10/2026.** The Azure Pipeline also publishes the static Storybook as the
private pipeline artifact `storybook` (see the annotation of the same date in P19). The
package, the feed and the `rc` tag do not change.

**Annotation of 07/11/2026.** The feed has `latest` on `5.0.0-rc.1`. The pipeline published it
with `npm publish --tag rc` (run 609226), and Azure Artifacts, like the npm registry, gives
`latest` to the first version ever published of a package, whatever `--tag` says. This is the
only exception to "a release candidate never takes `latest`": `5.0.0-rc.2` and later go only to
`rc`, so `latest` stays on `rc.1` until a stable version is published. A consumer installs a
release candidate by its exact version or with `@rc`, never without a tag (`docs/release.md`).

**Status.** Approved by Elvys on 19/10/2026. It amends P70, which Indiane adopted on
15/10/2026: her confirmation is requested in the review of the pull request that brings
this decision. Reviewed in that pull request; the merge is the approval.

---

## P74 — `nph-avatar`: API and semantics

**Decision.** `nph-avatar` is a Web Component with **open Shadow DOM** (P01), CSS in its
own file imported `?inline`, as in `nph-icon`. It has no slot, no `::part`, no event, no
color property and no shape property. Anatomy only through semantic tokens. Invalid input
renders nothing and emits `console.error` only in development, one per cause — the rule of
P21, adopted here by its own decision, as in P66, P68 and P73. The names follow P64.

1. **Properties.** The Figma property names are in English for `size` and in Portuguese
   for `tipo`, and the code API is in English (P64). The mapping below is a technical
   proposal of this implementation.

   | Figma | API |
   |---|---|
   | `size` | `size`, `sm` (default), `md` or `lg`, reflected to the attribute |
   | the photo of the person | `src`, String |
   | the accessible name | `label`, String |
   | `tipo`: `foto` or `sem foto` | not a property: it derives from `src` |

   `size` reflects because the internal CSS selects the box by it. `tipo` derives from
   `src`: a non-empty `src`, after trim, is `foto`; without it, the piece is `sem foto`.
   The precedent is P73, where the presence of `text` derives the Figma `texto`. The
   default is **inverted on purpose**: in Figma the default of `tipo` is `foto`, while in
   code the absence of `src` is the natural default, so `<nph-avatar>` with no attribute
   draws `sem foto`. A consumer that passes `src` gets `foto`; swapping the type of one
   avatar is adding or removing its `src`.

2. **Semantics.** Without `label`, or with a `label` of only whitespace, the host takes
   `aria-hidden="true"` and no role: the avatar is decorative, as `nph-icon` is, because the
   person's name is next to it. With a `label` that has text, the host takes `role="img"`
   and `aria-label`. The name is on the host and not on the inner image, which always has
   `alt=""`. The avatar is never focusable, has no `tabindex` and is not a button. A missing
   `label` and a missing `src` are not errors: the empty avatar that `nph-select` (DSA-29,
   D4) shows before a choice, `<nph-avatar size="sm">` with no attribute, is valid and
   silent. `nph-avatar-stack` (DSA-25) reads the group's names itself and passes no `label`
   to its avatars.

3. **Photo lifecycle.** The person icon (`nph-icon` `user`, style `light`, at the
   `icon/size-*` of the same size, D1 and D2) shows while the photo loads and stays if the
   photo fails; the photo takes its place on `load` (D3). The `<img>` is rendered only for a
   non-empty `src` after trim, and a new `src` starts the wait again. The piece emits no
   event, for the load or for the failure, and no error: a photo that does not load is not a
   failure of the avatar.

4. **Border.** The border (`border/width` in `color/border`, D4) is drawn by the avatar's
   own `::after`, inside the frame and over the photo, with the corner of the frame
   (`border-radius: inherit`) and `pointer-events: none`. The paint order is structural:
   `:host::after` paints after the shadow content, so it comes above the `<img>`. The test
   reads the computed style of the pseudo-element and does not read pixels. It is the
   separation that `nph-avatar-stack` (DSA-25) uses between overlapped avatars: the stack
   draws no ring. There is no property for it.

5. **Host box.** The host is exactly the avatar size, `avatar/size-sm`, `-md` or `-lg`
   (24, 32 and 40 px), with `box-sizing: border-box`, `display: inline-flex`, `flex: none`
   and `vertical-align: middle`, and it clips its content. It adds no height or width, so a
   consumer can count on it: the 40 px option row with an avatar in DSA-29 D9 and the
   overlap of `nph-avatar-stack` depend on a box of exactly 24, 32 or 40.

6. **Absences.** No slot, no `::part`, no event, no initials, no `shape` property and no
   form association. The Figma frame has no initials: the fallback is only the photo and the
   person icon. The count of a group ("+N") is a piece of `nph-avatar-stack` made with the
   tokens of the avatar; the avatar has no counting mode.

7. **Invalid input.** An invalid `size` renders nothing, takes no space, leaves
   `data-nph-rendered` out and emits one `console.error` per cause, only in development. A
   valid value set afterwards makes the piece draw. No `src` and no `label` is valid and emits
   nothing.

**Source.** Frame `nph-avatar` (`1434:30`, set `1434:29`) of the Figma file
`DS-IA-NEPHOS 5.0`, accepted by Indiane on 06/10/2026, with the Figma UX QA and the textual
audit approved; D1 to D4 answered on 19/10/2026. The names `src` and `label`, the derivation
of `tipo` from `src`, the semantics of the host, the lifecycle of the photo and the invalid
input rule are a technical proposal of this implementation.

**Out of scope.** `nph-avatar-stack` (DSA-25) and `nph-select` (DSA-29), which are planned.
Initials. A circle or any other shape. Widening the `use` text in `design.md` for the tokens
the avatar consumes (`color/muted`, `color/muted-foreground`, `color/border`, `icon/size-*`
and `avatar/radius-*`, which `nph-skeleton` also consumes): it is the pending decision D5 of
DSA-24, with Indiane, and the component keeps consuming them either way. The Usage section of
the page (P70, DSA-35), the page lists read from the Metadata (P71, DSA-34) and the
accessibility gate (P72, DSA-32).

**Status.** Anatomy and behavior accepted by Indiane on 06/10/2026; D1 to D4 answered on
19/10/2026. API and semantics are reviewed in the pull request that brings them; the merge
is the approval.

---

## P76 — `nph-toggle-group`: API and semantics

**Decision.** `nph-toggle-group` is a Web Component with **open Shadow DOM** (P01), CSS in
its own file imported `?inline`, as in `nph-icon`. Its shadow root holds only the default
slot, and the host is the row. It has no `::part`, no color property, no size property *(superseded
by the amendment of 29/10/2026, DSA-61: `size` exists)* and no form association. Anatomy only through semantic tokens: the group consumes one,
`space/inline`. Invalid input renders nothing and emits `console.error` only in development,
one per cause — the rule of P21, adopted here by its own decision, as in P66, P68, P73 and
P74. The names follow P64.

1. **Properties.** The Figma frame has two properties, `texto` and `mostrar 3º`, and leaves
   single and multiple selection to code. The mapping below is a technical proposal of this
   implementation.

   | Figma | API |
   |---|---|
   | the name of the group (`aria-label`) | `label`, String |
   | single or multiple selection, "behavior, resolved in code" | `selection`, `single` (default) or `multiple` |
   | the value the group receives (D3) | `value`, a list of strings; the attribute is words separated by spaces |
   | `texto` | not a property: it is the presence of `text` on each button (P73) |
   | `mostrar 3º` | not a property: three is only the limit of the Figma set (D2) |
   | `marcado`, `state`, `desabilitado`, `invalido` | not properties of the group: they stay on each `nph-togglebutton` |

2. **The default slot and the `value` attribute.** The group takes `nph-togglebutton`
   children. Each child names itself with a `value` **attribute**, which the group reads with
   `getAttribute('value')`, trimmed: a non-empty word with no whitespace, unique in the group.
   `nph-togglebutton` does not declare it: it ignores the attribute, it has no `value`
   property and no type for it, and **P73 is not amended**. The cost is a contract that lives
   in the group and not in the button; the gain is that a component already merged stays as
   it is. A child that is not an `nph-togglebutton`, or a button without `value`, is not part
   of the selection, and neither is a button whose `value` has whitespace inside
   (`"bold italic"`): the attribute of the group reads words separated by spaces, so a value of
   two words would be emitted as one item and lost when the list is written back with
   `join(' ')`. Such a button is treated as one with an empty or repeated value: not
   selectable, with a warning in development.

3. **`value` and the source of truth.** The group is the source of truth of the selection:
   in `willUpdate` and when the slot changes, it writes `pressed` on every child from `value`,
   so a `pressed` attribute in the markup of a child does not survive. With no value, none is
   checked (D3). Single selection holds zero or one item, and a second one is dropped with a
   warning. Setting `value` from code moves the checks and never fires the event. Changing
   only the `value` attribute of a direct child raises no `slotchange`, so the group also
   observes that attribute (a `MutationObserver` on the host, filtered to the direct buttons,
   connected and disconnected with the element); on a change it writes `pressed` again and
   checks the composition, and it never fires the event.

4. **Single selection (D3).** Checking a button unchecks the others, and one button stays
   checked once a choice is made. A click on the checked button does nothing: the group
   listens to `click` in the **capture** phase and stops it before it reaches the button, so
   the button does not toggle, does not flicker, `nph-change` does not fire and no group
   event fires. Enter and Space on the native button produce the same `click`, and `click()`
   on the button host too. Cost: that click does not reach a listener of the consumer, as the
   click on a disabled `nph-togglebutton` does not, in P73. A disabled button is left to its
   own rule. Multiple selection has no such block: each button toggles on its own.

5. **The event `nph-value-change`.** When the person changes the selection, the group fires
   `nph-value-change`, with `bubbles`, `composed` and no `cancelable`, and `detail: { value }`,
   the list of checked values in the order of the buttons. The name is different from
   `nph-change` because `HTMLElementEventMap['nph-change']` is already typed with `{ pressed }`
   by `nph-togglebutton`, and one name cannot carry two types; the group also does not stop the
   `nph-change` of each button, so an ancestor still hears both. A change of `value` from code
   never fires it.

6. **Semantics.** The host is `role="group"`, set in `willUpdate` as `nph-icon` and
   `nph-avatar` do, and its name is `label`, which becomes its `aria-label`. A name the consumer
   puts on the host with `aria-label` or `aria-labelledby` also counts; the second works only on
   the host, because an id reference does not cross a shadow root. The buttons stay buttons with
   `aria-pressed`. In single selection the group is **not** a `radiogroup`: P73 fixes
   `aria-pressed` and rejects `aria-checked`, and the accepted frame separates the piece from the
   controls that choose. **Known limit:** the screen reader reads the state of each button and
   does not announce that the choice is exclusive.

7. **Keyboard.** One Tab stop per button, in order, with no arrow keys and no roving tabindex.
   A disabled button leaves the order. The accepted frame says each button shows its own focus
   and that the group does not receive focus, and it asks for no arrow keys; a roving tabindex
   across several groups is the work of a toolbar (WAI-ARIA Authoring Practices, Toolbar). The
   group has no `tabindex` and no `delegatesFocus`. D5 of the task asks Indiane to confirm.

8. **Box.** `display: inline-flex` with `gap` `space/inline` (8 px), `align-items: stretch`,
   no wrap, no background, border, outline, opacity or transition. The height comes from each
   button, `control/height-default`. `space/inline` is wider than the border and the halo of
   one button (`2 × border/width + focus/ring-width`), so a focused button is not covered by
   its neighbor.

9. **Invalid input and composition.** Two causes render nothing, take no space, leave
   `data-nph-rendered` out and emit one `console.error` each, only in development: a
   `selection` that is not `single` or `multiple`, and no name (no `label`, no `aria-label` and
   no `aria-labelledby`). Problems in the composition render the group anyway and emit one
   `console.warn` each, only in development, and the same problem is not repeated while it
   lasts: fewer than two buttons (D2, there is no maximum), a child that is not an
   `nph-togglebutton`, a button without `value`, a button whose `value` has more than one
   word, a repeated `value`, a value that matches no button, buttons with text mixed with
   icon-only buttons (D4), and more than one value in single selection.

10. **Icons (D1).** The Alignment and Formatting examples need `align-left`, `align-center`,
    `align-right`, `bold`, `italic` and `underline`. They enter the block `icones_nucleo` of
    `design.md`, category `acao`, and the closed map of `nph-icon`, in `light` and `solid`,
    Font Awesome Pro 6.7.2. The task does it; no token is created or changed.

11. **The package (P75).** `nph-toggle-group` is the first tag with two parts after the
    prefix. P75 says a component added later enters by adding its folder, but three checks
    of the package assumed one part, `nph-[a-z]+`: the filter of the Custom Elements Manifest in
    `custom-elements-manifest.config.mjs`, and the two expressions of `scripts/test-package.mjs`
    that read the tag and the imports of a component. They now take
    `nph-[a-z]+(?:-[a-z]+)*`, so the promise of P75 holds; without it `npm run test:package`
    fails for the group (the tag is not in the manifest, and its bare import is not found).
    No other line of those files changes.

**Divergence between sources, resolved.** The Description of the accepted frame says each
button holds its own state and the group only gathers and spaces the buttons. D3, answered
later and repeated in the task, says the group coordinates single selection and each button
no longer holds that choice alone. The code follows D3.

**Points for review.**

- **Reading `value` from an attribute** and not adding a property to `nph-togglebutton`, with
  the cost above.
- **The first slot of the repository.** The other pieces have none.
- **The name `nph-value-change`**, and not `nph-change` with a union type.
- **`role="group"` on the host**, and the known limit of single selection.
- **The click blocked in capture** on the checked button, which hides that click from the
  consumer.
- **Use and do-not-use lists.** "For a single option, use `nph-togglebutton`, without a
  group" is listed under "When to use" in the accepted frame; the sheet and the page put it in
  "When not to use", where a redirection reads as what it is.
- **Pending decisions D4 and D5**, with Indiane: what the group does when text and icon only
  are mixed, and arrow keys. The code follows the defaults above meanwhile.

**Source.** Frame `nph-toggle-group` (`1580:61`, set `1580:60`) of the Figma file
`DS-IA-NEPHOS 5.0`, accepted by Indiane on 08/10/2026, with the Figma UX QA and the textual
audit approved; D1 to D3 answered on 19/10/2026. The names `label`, `selection` and `value`, the
`value` attribute of each button, the event `nph-value-change`, the semantics of the host, the
capture rule for the click and the invalid input and composition rules are a technical proposal
of this implementation.

**Out of scope.** A toolbar and the roving tabindex across groups. `nph-switch` and
`nph-checkbox`, which are planned. A `size` *(added by the amendment of 29/10/2026, DSA-61)*,
`disabled` or `invalid` property on the group, a maximum, an orientation, a form association and a color property. Moving `value` into
`nph-togglebutton`. The Usage section of the page (P70, DSA-35), the page lists read from the
Metadata (P71, DSA-34) and the accessibility gate (P72, DSA-32).

**Status.** Anatomy and behavior accepted by Indiane on 08/10/2026; D1 to D3 answered on
19/10/2026. API and semantics are reviewed in the pull request that brings them; the merge
is the approval.

### Amendment of 29/10/2026 — DSA-61: size

**Technical conflict.** The decision has no size property: every button is
`control/height-default`. On 29/10/2026 Indiane accepted the frame again (`1580:61`, set
`1580:60`) with the property `tamanho`, `compacto`, `padrão` and `grande`, which every
button of the group follows
(`docs/operacao/evidencias/DSA-61/figma-docs-accepted-2026-10-29.md`).

**Decision.**

1. **`size`.** A new property, `compact`, `default` (the default) or `large`, reflected so the
   attribute shows the size the buttons take. Any other value, compared as written, draws
   nothing and emits one `console.error` in development, as `selection` does.
2. **The group writes it.** The group is already the source of truth of `pressed`; it now
   writes `size` on every `nph-togglebutton` child in the same pass, so the buttons always
   share one height and, icon only, one icon size (P73, amendment of 29/10/2026). A `size`
   set on a button inside the group is overwritten, and a button added later takes it.
3. **Unchanged.** The group consumes only `space/inline`, between the buttons in every size,
   and adds no color, border or focus.

**Status.** Rules accepted by Indiane on 29/10/2026; reviewed in the pull request that
brings them; the merge is the approval.

---

## P77 — `nph-tooltip`: any element, opened on hover and on keyboard focus

This decision **amends P65 and P62.6**. P65 fixed a balloon that only the `info` trigger of
`nph-label` used, that the consumer opened, closed and positioned, and that was a `role="status"`
live region; P62.6 fixed that trigger as a button that toggled the balloon by click, below the
label. Indiane redefined the piece on 19/10/2026 and accepted the new board on 20/10/2026
(DSA-42). The text of P65 and P62.6 is kept as it was written; the paragraphs this decision
replaces carry a "Superseded by P77" mark.

**Technical conflict.** The new contract (a balloon for **any** element, opened by the pointer
and by the keyboard focus, closed by the pointer leaving, by blur and by Esc, flipping when it
does not fit) cannot be met with a component that the consumer opens and positions, nor with a
live region that announces on activation. The board also leaves open how another element
attaches the balloon in code ("is defined in the spec"), which DSA-39 (the value balloon of the
slider) and DSA-43 (the icon-only button) both wait for.

**Decision.**

1. **API: four properties, no event, no slot, no `::part`.** *(Superseded by the amendment of 22/10/2026, DSA-48: a fifth property, `relation`, says whether the balloon describes or names the element.)*

   | Property | Role |
   |---|---|
   | `text` | String, empty by default. The balloon content, already localized. Unchanged from P65 |
   | `for` | String, reflected. The `id` of the element that opens the balloon, looked up in the **same root** as the tooltip |
   | `side` | `top` (default), `bottom`, `left` or `right`. The **preferred** side |
   | `open` | Boolean, reflected, `false` by default. The state. The tooltip turns it on and off; the consumer may turn it on to show the balloon open, and the closing rules still hold |

   **Why `side` is code API and not a Figma property.** The task says the Figma component gets no
   side property and that the code "implements the placement as behavior" (`DSA-42.md`,
   decision D1). The balloon has no arrow, so it looks the same on any side, and a Figma variant
   would draw nothing different. That is what "behavior" means there: the side is not a variant.
   It does not say the code has no way to ask for one, and the board requires the four sides
   ("top, bottom, left and right"). Without `side`, `left` and `right` could never be reached,
   because a flip only goes to the opposite side. So `side` is a preferred side, with the flip as
   behavior. If a reading of D1 as "no side API at all" prevails, the fallback is automatic
   placement only (top, then bottom, then the side with more room).
2. **How an element attaches the balloon: `for`.** The tooltip is a sibling of the element, in the
   same root, and `for` is the `id` of the element (`<nph-tooltip for="delete" text="Delete">`),
   like the native `<label for>`. The lookup uses `getRootNode()`, never `document`: inside the
   shadow root of another component, the element is looked up there. A component that needs the
   balloon on an element inside its own shadow root renders its own `nph-tooltip` next to it, with
   `for` pointing at the internal `id`; that is how `nph-label` does it (it has no shadow root, so
   the root is the document or the shadow root that contains the label), and how DSA-39 and DSA-43
   are to do it. Wrapping the element in a slot was refused: it breaks flex layouts and the
   `nph-toggle-group` slot, and a reference from a slotted element to text in the shadow root of
   the wrapper does not exist in ARIA. An attribute on the element (`tooltip="..."`) was refused:
   every component would reimplement it, and the board says "any element".
3. **Opening.** *(Superseded by the amendment of 22/10/2026, DSA-48: the pointer waits `motion/hover-delay`, focus does not; only an element that receives focus opens it; Enter and Space do not bring the focus hold back.)* On hover, only with a mouse or a pen, and on keyboard focus, with no delay. Focus
   opens it only when the element that has the focus matches `:focus-visible` and the last pointer
   action on the element was not a touch (a tap that focuses a button, or a field, does not open
   it; the next key press makes the keyboard count again). Touch never opens it: without hover,
   essential information never lives only in the balloon. A click, Enter or Space on the element
   does nothing to the balloon.
4. **Closing.** The balloon has two independent holds: the pointer (over the element or over the
   balloon) and the focus (visible focus on the element). It is open while either holds and closes
   when both are gone. Esc, listened to on the document in the capture phase and only while open,
   closes it, drops both holds and stops the key (`stopPropagation` and `preventDefault`), so the
   dialog around does not close with it; it stays closed until the pointer and the focus have both
   left once. With the balloon closed, Esc is not intercepted. There is no hover delay token, and
   the board asks for none to open. *(Superseded by the amendment of 22/10/2026, DSA-48: the token `motion/hover-delay` exists and the pointer waits it.)* The distance between the element and the balloon is
   `space/inline`, so the pointer leaves the element before it reaches the balloon: the exit
   transition is the window. Coming back into the element or the balloon during the exit cancels
   the closing (WCAG 1.4.13, the balloon stays open while the pointer is over it).
5. **Placement and layer.** The balloon is a `popover="manual"` in the top layer: it needs no
   `z-index`, which resolves the limit L-c of P62.6, and no ancestor with `overflow` clips it.
   JavaScript measures the element and the balloon and places it: top by default, the opposite side
   when the preferred one does not fit, the side with the most room when neither does, centered on
   the element on the cross axis and never outside the window. It places again on scroll and on
   resize while open, and while the element is outside the window the balloon is not drawn: it
   returns with the element, instead of staying stuck to the edge of the window. CSS anchor positioning is not used: its support is uneven and it does not
   cross shadow roots. No library is added. The distance is `space/inline`, which is wider than the
   outer reach of a focus drawing (`border/width` plus `focus/ring-width`), so the balloon never
   covers the focus of the element.
6. **Motion.** It enters on `motion/enter-duration` with `motion/enter-easing` and leaves on
   `motion/exit-duration` with `motion/exit-easing` (the board names the durations; `design.md` makes
   the pair one role). Only opacity moves. The balloon leaves the top layer when the exit ends. With
   reduced motion, the duration is that of `motion/hover-duration`, the semantic alias of
   `core/duration/100`, as in `nph-togglebutton`; the curve stays and the balloon still appears and
   still leaves.
7. **Semantics.** *(Superseded by the amendment of 22/10/2026, DSA-48: with `relation="name"` the `id` goes to the `aria-labelledby` of the element instead, and the reference follows a change of the tooltip `id`.)* The host is a `role="tooltip"` from mount, open or closed (WAI-ARIA 1.2; APG
   Tooltip pattern), with an `id` (generated when the consumer gives none). The tooltip adds that
   `id` to the `aria-describedby` of the element, keeping what is there, and removes only its own on
   disconnect or when `for` changes. The balloon never takes focus and has no focusable child. The
   `role="status"` live region of P65 is gone: the description is read when the element receives
   focus. **Finding recorded:** Chromium computes the description of the element from the text
   inside the shadow root of the referenced host only while the balloon is shown (`display: none`
   contributes no text), so the host also carries `aria-label` with the same text, which the browser
   reads in both states. The proof is the description the browser itself computes, read through the
   accessibility tree, in the tests.
8. **`nph-label`.** The label keeps its API (`text`, `required`, `for`, `info`, `infoLabel`) and its
   button, 24 by 24, focus drawing and tokens. It gives the button an `id`, drops `aria-expanded`,
   `aria-controls`, the open state and every listener, and renders
   `<nph-tooltip for="<button id>" text="<info>">`. The balloon opens on hover and on focus of the
   icon, above the label by default. A click on the icon does nothing. Its CSS loses the position
   of the balloon and the `position: relative` of the root.
9. **Anatomy and the rule of the text** stay as in P65: `color/tooltip`, `text/body-sm` in
   `color/tooltip-foreground`, `radius/inner`, `space/inline-tight` vertically and `space/inline`
   horizontally, `elevation/dropdown`, up to `layout/max-tooltip-width` and
   `layout/max-tooltip-height`, no border and no arrow, text that fits whole in up to two lines. The
   Figma component binds `border/width` but draws no stroke; no border is drawn.
10. **Invalid input** follows P21 and P76: `for` empty or matching no element in the same root (after
    one more frame, so an element rendered right after the tooltip is found) and a `side` that is not
    one of the four draw nothing and emit `console.error` only in development, one per cause.

**Breaking changes, and the release candidate.** `@iatec/nephos` is published as `5.0.0-rc.N`, and
`docs/consuming.md` says that the API can still change between release candidates (P75). So the
change is made without a compatibility layer and without touching `package.json`; the counter is the
pipeline's. What a consumer of `rc.1` must know:

- `nph-label` keeps its markup and API; its balloon now opens on hover and on keyboard focus, above
  the label, a click does not toggle it, and touch never opens it.
- A bare `<nph-tooltip open text="...">` draws nothing: it needs `for`.
- The host of `nph-tooltip` is a `role="tooltip"` and takes no room in the flow (it was a
  `role="status"` inline block). No CSS that positioned it holds.
- `open` is still a reflected boolean, but the tooltip now sets it.

**Reason.** A tooltip that every consumer opens by hand would be reimplemented in each component that
needs one; a single behavior, with one way to attach it, is what a design system is for.

**Known limits.**

- **An element whose focus lives in a shadow root** (a custom element with `delegatesFocus`) opens
  the balloon on hover and on focus, but `aria-describedby` on the host does not reach the
  focusable element inside. The component that owns the shadow root renders its own tooltip next to
  the inner element. For the icon-only `nph-button`, whose name stays on its own button, this
  matters little.
- **A disabled element** may not receive pointer events, so the balloon may not open over it.
  *(Superseded by the amendment of 22/10/2026, DSA-48: a disabled element gets no balloon, by rule.)*
- **Duplicate reading.** An icon-only button whose accessible name equals the balloon text may be
  read twice by a screen reader. *(Superseded by the amendment of 22/10/2026, DSA-48: `relation="name"` makes the balloon the name, read once.)*
- **No touch.** The information of the balloon is never available on touch, by design.
- **Esc in capture.** While a balloon is open, the focused element does not see the Esc key.
- **Left and right are physical** (`left` is always the left of the screen); there is no right-to-left
  mirroring.

**Source.** Board `nph-tooltip` (`1241:3`, frame `1237:5`, component `1237:3`) of the Figma file
`DS-IA-NEPHOS 5.0`, accepted by Indiane on 20/10/2026, with the textual audit approved; the
redefinition of 19/10/2026 and D1 of 20/10/2026 are in `docs/operacao/tarefas/DSA-42.md`. The names
`for` and `side`, the role, the layer, the placement rules, the holds and the touch rule are a
technical proposal of this implementation, reviewed with the plan on 21/10/2026.

**Out of scope.** A hover delay or a configurable one. *(Superseded by the amendment of 22/10/2026, DSA-48: the hover delay is in, from the token; a configurable one stays out.)* A tooltip with an action, a link or focus
(`nph-popover`). Collisions with the layers of other popovers. A right-to-left mirror. Wrappers or
an attribute on the element. The Usage section of the page (P70, DSA-35), the page lists read from
the Metadata (P71, DSA-34) and the accessibility gate (P72, DSA-32).

**Pending for Indiane (DSA-42, D2 to D7), none of them blocks.** The distance of the balloon of the
icon-only button (`space/inline` here, `space/inline-tight` in the evidence of DSA-43); the
alignment on the cross axis (centered here); what the open balloon does on scroll and on resize
(it follows here, and is not drawn while the element is out of the window); the motion shape (opacity only here); what a click on the information icon does
(nothing here); the limits of a disabled element and of the duplicate reading.

**Status.** Anatomy and behavior accepted by Indiane on 20/10/2026. API and semantics are reviewed
in the pull request that brings them; the merge is the approval.

### Amendment of 22/10/2026 — DSA-48: hover delay, keyboard, focusable elements and the accessible name

**Technical conflict.** On 22/10/2026 Indiane approved six rules for the balloon, after a benchmark
of tooltip patterns, and the Figma documentation (frame `1237:5`, component `1237:3`) shows them
(`docs/operacao/evidencias/DSA-48/figma-docs-accepted-2026-10-22.md`): keyboard focus opens at once;
the pointer opens after 300 ms; click, Enter and Space run the action and neither open nor close the
balloon; the balloon goes only on an element that receives focus; on an icon-only button the balloon
text is the accessible name of the action, announced once; on touch the icon-only button has no
visible name, an accepted exception. Items 1, 3, 4 and 7 above, and two known limits, cannot hold
them. The 300 ms became the token `motion/hover-delay` (DSA-48, D1). The amendment also fixes the
three findings of the last Copilot review of PR #94 that were missed before its merge.

**Decision.**

1. **API: five properties.** `relation` joins `text`, `for`, `side` and `open`: `description`, the
   default, or `name`. It is not reflected. The default keeps the behavior of every current
   consumer. Any other value draws nothing, writes no reference and emits `console.error` in
   development, like an invalid `side`; `name` with empty text emits one too.
2. **The wait.** A mouse or a pen opens the balloon after resting `motion/hover-delay` on the
   element. The component reads the token from the computed style of its host, in JavaScript, when
   the pointer enters: the value is the token, never a number in the code. Without the token
   (`tokens.css` not loaded) it opens with no wait and emits `console.error` once in development.
   Leaving before the wait ends opens nothing. Keyboard focus and `open` set by the consumer do not
   wait. While the balloon is still on screen (open, or leaving), coming back into the element keeps
   it, with no new wait. With reduced motion the wait stays: it is not movement.
3. **Click, Enter, Space, Esc and Tab.** A key press restores the focus hold of an element that
   matches `:focus-visible` (P77 item 3), except Enter and Space, which run the action, Esc, which
   dismisses, and Tab, which moves the focus anyway. So Enter and Space after a focus by click do not
   open the balloon, and they never close it. A pointer press on the element during the wait, touch
   included, cancels it, and a new wait starts only when the pointer leaves and enters again; an open
   balloon does not close on click. The focus that a pointer press on the element or its label gives
   (a text field matches `:focus-visible` on a mouse click) does not open the balloon either; the next
   key press makes the keyboard count again. If the balloon opens by focus or by `open` while a wait
   is pending, the wait ends and the pointer hold is taken at once, so a blur does not let the timer
   open it again. Esc during the wait cancels it too, without being intercepted. Whether a click
   during the wait should cancel it is open with Indiane (DSA-48, D2), with this as the default.
4. **Only an element that receives focus.** The balloon opens, by hover, focus or `open`, only when
   the element is not disabled (`:disabled`, or a `disabled` attribute on a custom element) and is
   in the Tab order (`tabIndex >= 0`, or a `contenteditable` element that is the editing root and has
   no `tabindex`, which the browser tabs to while its `tabIndex` reads `-1`) or is a host that
   delegates its focus. An element that does not
   receive focus emits `console.error` once in development; a disabled one does not, because it is a
   passing state. An element disabled while its balloon is open loses it at once. The root observer
   watches `disabled`, `tabindex` and `contenteditable`, and checks the element again only when the
   change can touch it: its own attributes, `disabled` on an ancestor `<fieldset>` (the `:disabled`
   check keeps the exception of the first `<legend>`), `contenteditable` on an ancestor, and a move of
   the element or of an ancestor in the tree. The
   reference stays on a disabled element: an icon-only button still needs its name.
5. **The accessible name.** With `relation="name"` the tooltip adds its `id` to the
   `aria-labelledby` of the element, and not to its `aria-describedby`, keeping what is there. The
   host already mirrors the text in `aria-label` (item 7), which the name computation reads through
   `aria-labelledby` with the balloon closed or open; the tests read the name and the description the
   browser itself computes. A reference the consumer wrote is never removed. The `info` icon of
   `nph-label` keeps the description: its balloon is an explanation, and its name is `infoLabel`.
6. **The three findings of PR #94.** (a) The tooltip keeps the `id`, the attribute and the element it
   wrote, and moves the reference when its own `id` changes (the root observer already sees that
   attribute); a removed `id` is generated again. (b) The scroll targets are collected through the
   flat tree: a slotted node goes through its `assignedSlot`, so a scroller inside the shadow root
   around a slot is followed; Chromium does not deliver that scroll to `window`. (c) Esc no longer
   restores the focus hold, so Esc after a touch on an input does not open the balloon, and the key
   reaches the page.

**Breaking changes, and the release candidate.** Under P75, without a compatibility layer:

- The pointer opens the balloon after 300 ms, not at once.
- An element that does not receive focus (a `<span>`, an `<svg>` without `tabindex`) or a disabled
  one gets no balloon; it used to.
- Enter and Space after a focus by click no longer open the balloon.
- `relation` is new and additive; with the default nothing else changes. `nph-label` keeps its API
  and semantics. The icon-only `nph-button` (DSA-43) renders its own tooltip with `relation="name"`
  next to its inner `<button>`.

**Known limits, updated.** The disabled element and the duplicate reading leave the list: they are
rules now. A host with a closed shadow root is not seen as focusable from outside and gets no
balloon; the component that owns it renders the tooltip inside, as item 2 already asks. The other
limits stay.

**Pending for Indiane.** DSA-42 D2 to D6 are unchanged; this amendment answers none of them. Rules 4
and 5 remove the two cases behind DSA-42 D7, and Indiane confirms whether D7 closes. DSA-48 D2 asks
whether a click during the wait cancels it.

**Source.** `docs/operacao/tarefas/DSA-48.md` and its `figma-docs-accepted` evidence; the last
Copilot review of PR #94 on `d82d2c3`, recorded in
`docs/operacao/evidencias/DSA-42/review-and-merge-2026-10-22.md`. The property name `relation`, the
reading of the token in JavaScript, the keys excluded from the focus hold and the click during the
wait are a technical proposal of this implementation, approved with the plan on 22/10/2026.

**Status.** Rules accepted by Indiane on 22/10/2026. The API and semantics of the amendment are
reviewed in the pull request that brings them; the merge is the approval.

---

## P78 — `nph-avatar-stack`: API and semantics

**Decision.** `nph-avatar-stack` is a Web Component with **open Shadow DOM** (P01), CSS in its
own file imported `?inline`, as in `nph-icon`. Its shadow root holds one hidden wrapper with the
default slot and the count, and the host is the row. It has no `::part`, no event, no color
property and no form association. Anatomy only through semantic tokens. Invalid input renders
nothing and emits `console.error` only in development, one per cause — the rule of P21, adopted
here by its own decision, as in P66, P68, P73, P74 and P76. The names follow P64.

1. **Properties.** The Figma properties are `size`, `mostrar 3º`, `mostrar 4º`, `mostrar 5º`,
   `mostrar contagem` and `contagem`. The mapping below is a technical proposal of this
   implementation.

   | Figma | API |
   |---|---|
   | `size` | `size`, `sm` (default), `md` or `lg`, reflected to the attribute |
   | `mostrar 3º`, `mostrar 4º`, `mostrar 5º` | not properties: the number of `nph-avatar` children |
   | `mostrar contagem` and `contagem` | `count`, Number, `0` by default |
   | the name of the group | `label`, String |
   | the type of each avatar (photo or no photo) | not a property of the group: the `src` of each avatar (P74) |

   `count` is a number and not the text of the Figma `contagem`: the evidence says the text is
   always "+N", so the group writes the `+` and the digits, with no thousands separator. Above
   zero the count is drawn; zero, or a removed attribute (which Lit reads as `null`), draws
   none. A count that is not a whole number from zero up is invalid input.

2. **The default slot and a single size.** The group takes `nph-avatar` children, each with its
   own `src`. The group is the source of truth of the size, as `nph-toggle-group` is of `pressed`
   (P76): in `updated` and on `slotchange` it writes its `size` on every child avatar, so a
   `size` written on a child does not survive. Changing only the `size` attribute of a child
   raises no `slotchange`, so the group also observes `size` and `label` on its direct avatars (a
   `MutationObserver` on the host, connected and disconnected with the element) and writes the
   size again; its own write comes back once through the observer and writing it again changes
   nothing. An invalid group writes nothing on its avatars.

3. **Overlap and paint order.** A negative `gap` does not exist in CSS, so every avatar but the
   first, and the count, takes `margin-inline-start: var(--nph-avatar-overlap)` (-8 px), through
   `::slotted(nph-avatar:not(:first-child))`. There is no `z-index`: every `nph-avatar` is
   positioned (it anchors its border overlay, P74), so the next one paints over the previous
   one, and the count is positioned too, so it paints over the last avatar (D2). The separation
   is the border of each avatar (D3): the group draws no ring, background or border.

4. **The count.** A box after the slot: `block-size` and `min-inline-size` `avatar/size-*`,
   `border-radius` `avatar/radius-*`, `padding-inline` `space/inline-tight`, a real border
   `border/width` in `color/border` inside the box (`box-sizing: border-box`; it has no photo to
   draw over, so it needs no overlay as the avatar does), background `color/muted`, text
   `color/muted-foreground`, `text/label-sm` in `sm` and `md` and `text/label-md` in `lg` (D1),
   through the five properties of each role (P62.2). It grows with the number.

5. **Semantics.** The host is a `role="img"`, set in `willUpdate` as `nph-avatar` does, and its
   name is `label`, which becomes its `aria-label`; a name the consumer puts on the host with
   `aria-label` or `aria-labelledby` also counts, as in P76. The group is read as one image with
   the names and the total ("Ana, Bruno, Carla and 3 more"), written by the consumer in its
   language: the component composes no sentence. The slot and the count sit in one wrapper with
   `aria-hidden="true"` and `display: contents`, so the avatars and the count stay out of the
   accessibility tree and the avatars stay flex items of the host. **Finding recorded:** the role
   alone does not hide them. In Chromium an `nph-avatar` with a `label` of its own, slotted in a
   `role="img"` host, is still exposed as an image with its name; with the wrapper it is not. The
   proof is the node the browser itself computes, read through the accessibility tree, in the
   tests. The group is never focusable and has no `tabindex`. With invalid input the host takes
   `aria-hidden="true"` and no role.

6. **Box.** `display: inline-flex`, `align-items: center` and `vertical-align: middle`, with no
   background, border, outline, opacity or transition. The space to a text next to it,
   `space/inline`, is given by the consumer.

7. **Invalid input and composition.** Three causes render nothing, take no space, leave
   `data-nph-rendered` out and emit one `console.error` each, only in development: a `size` that is
   not `sm`, `md` or `lg`; a `count` that is not a whole number from zero up; and no name (no
   `label`, no `aria-label` and no `aria-labelledby`). Problems in the composition render the group
   anyway and emit one `console.warn` each, only in development, not repeated while they last:
   fewer than two avatars, more than five (all of them are drawn: the group does not hide an
   avatar or add it to the count), a child that is not an `nph-avatar`, and an avatar with a
   `label` of its own.

**Known limit.** The group does not check that `label` and `count` agree: whoever uses it writes
both.

**Points for review.**

- **`count` as a number**, and not the text of the Figma `contagem`.
- **More than five avatars draws all of them**, with a warning, and does not move the extra ones
  into the count, which would couple two inputs and leave `label` behind.
- **No name renders nothing**, as in P76, and not a decorative group as in P74: the count is
  information only the name carries, and the text next to a group, such as a team name, does not
  say who or how many.
- **The `aria-hidden` wrapper** in place of the role alone, with the finding above.
- **Writing `size` on the children**, which a consumer cannot override inside the group.

**Source.** Frame `nph-avatar-stack` (`1579:46`, set `1579:45`) of the Figma file
`DS-IA-NEPHOS 5.0`, accepted by Indiane on 08/10/2026, with the Figma UX QA and the textual audit
approved; D1 to D3 answered on 19/10/2026. The names `count` and `label`, the slot of `nph-avatar`
children, the size written on them, the semantics of the host and its wrapper, and the invalid
input and composition rules are a technical proposal of this implementation, approved with the
plan by Elvys on 22/10/2026.

**Out of scope.** A list of people that the group opens, and the control around it. A data
property with the people, an automatic count, a maximum in code, a property per avatar, a ring
and a color property. Widening the `use` text in `design.md` for the tokens of the count: it is
the pending decision D4 of DSA-25, with Indiane, as D5 of DSA-24 is for the avatar, and the
component consumes them either way. The Usage section of the page (P70, DSA-35), the page lists
read from the Metadata (P71, DSA-34) and the accessibility gate (P72, DSA-32).

**Status.** Anatomy and behavior accepted by Indiane on 08/10/2026; D1 to D3 answered on
19/10/2026. API and semantics are reviewed in the pull request that brings them; the merge is the
approval.

---

## P79 — `nph-switch`: API and semantics

**Decision.** `nph-switch` is a Web Component with **open Shadow DOM** (P01), CSS in its own
file imported `?inline`, as in `nph-icon`. It has no slot, no `::part`, no color property, no
size property and no form association. Anatomy only through semantic tokens. Invalid input
renders nothing and emits `console.error` only in development — the rule of P21, adopted here
by its own decision, as in P66, P68, P73 and P76. The names follow P64.

1. **Properties.** The Figma set has the variant `marcado`, the variant `state` and the
   boolean `mostrar rótulo`. The mapping below is a technical proposal of this implementation.

   | Figma | API |
   |---|---|
   | `marcado` | `checked`, Boolean, reflected to the attribute |
   | `state` `erro` and `erro-foco` | `invalid`, Boolean, reflected to the attribute |
   | `state` `disabled` | `disabled`, Boolean, reflected to the attribute |
   | the label text | `text`, String |
   | `mostrar rótulo` off | the absence of `text`; then `label`, String, is the accessible name |

   `state` `default`, `hover` and `foco` are interaction, not properties. `label` becomes the
   `aria-label` of the native button, as in P68 and P73: an `aria-label` on the host would not
   name the button inside the shadow root. With `text`, `label` is not used. `checked`
   reflects because the piece is not associated with a form, so the attribute is not the
   default of a reset (contract of the field, P83, item 5.4).

2. **Semantics: `role="switch"`.** The piece is one native `<button type="button">` inside the
   shadow root, with `delegatesFocus`, `role="switch"` and `aria-checked` following `checked`.
   The button holds the track and, after it, the label, so the name comes from the content and
   the whole piece is the touch target the evidence asks for; the track is `aria-hidden`. Space
   and Enter toggle, as on a native button. This is the opposite of P73, on purpose: the
   evidence sets the piece apart from `nph-togglebutton` (a button that keeps a state, with
   `aria-pressed`) and from `nph-checkbox` (a choice that goes with a submission). The piece
   is not form-associated.

3. **Native events.** When the person toggles the piece by click, Enter or Space, the host
   fires `input` (`bubbles`, `composed`) and then `change` (`bubbles`, not `composed`), as a
   native control does; the new value is read from `event.target.checked`. A change of
   `checked` made from code never fires them. There is no `nph-*` event and nothing in
   `HTMLElementEventMap`: one key in that map takes one type, and `nph-change` is already typed
   with `{ pressed }` by `nph-togglebutton`. This follows the contract of the field (P83, item
   5.1) and the exception to the reasoning of item 3 of P73 recorded in P80, item 4: these pieces
   are form controls, and the frameworks bind `input` and `change`. The switch has no inner
   `<input>`, so the host fires both. A `click()` called on the host toggles the piece and fires
   both events, as the click of a person does; a disabled piece neither toggles nor fires, also
   for `click()`.

4. **`aria-invalid`.** Unlike P73, the piece sets `aria-invalid="true"` on the native button
   while `invalid` holds and `disabled` does not: `role="switch"` supports it, because it
   inherits from `checkbox`. The error sentence stays outside the piece.

5. **`disabled` wins over `invalid`.** The evidence says `disabled` does not exist with an
   error. In runtime, `disabled` suppresses the error outline and `aria-invalid`: it is listed in
   the sheet as an invalid combination, and is not a `console.error` case. A disabled
   `<fieldset>` around the piece disables it as the property does, except inside the first
   `<legend>` of that fieldset, as the browser does (P83, item 4): the piece reads the fieldset
   itself, since it is not form-associated, and watches its `disabled` attribute. The property
   `disabled` does not change; an internal marker on the host carries the state to the CSS.

6. **Inside `nph-field`.** The class declares `static nphFieldRole = 'option'`: in the field,
   the piece is one option of a `role="group"`, and the field writes `invalid` and `disabled` on
   it (P83, items 5.3 and 6). The piece brings its own text and does not need the field to have
   a name; without a name it does not render (P83, item 5.6).

7. **Focus on the track.** On `:focus-visible`, the track outline turns `focus/border`, at
   `border/width`, and a halo of `focus/ring-width` in `focus/halo` shows outside the track, both
   `radius/full` (D2); with an error, `status/error` and `focus/halo-error`. The label gets no
   ring. The outline of the track at rest is a stroke inside it, made with `box-shadow: inset`,
   so it does not move the knob, which keeps `space/inline-tight` from the outer edge (D4).

8. **Motion.** The knob slides by `transform`, never by layout position, and the track fill and
   outline change on `motion/state-duration` and `motion/state-easing`, both ways (D3). Two knobs
   share the place: the off one, in `color/background`, and the on one, in
   `color/primary-foreground`, which fades in over it while both slide; the off knob stays
   opaque, so the knob never dims in the middle of the slide. Under `prefers-reduced-motion` the
   knobs do not slide: the off knob stays on the left and fades out, the on knob stays on the
   right and fades in, and the colors change on `motion/hover-duration`. The evidence names
   `core/duration/100`; the piece uses its semantic alias, with the same value, 100 ms, as P73
   does, with the same touch on A58 (the duration of the `hover` role with the curve of the
   `state` role, both `cubic-bezier(0.4, 0, 0.2, 1)`). The open question is still D7 of the
   task DSA-22; this piece follows its answer.

9. **Invalid input.** With no `text` and no `label` (an empty or whitespace string counts as
   none), the piece draws nothing and emits one `console.error`, only in development. The check
   runs again only when `text` or `label` changes, so toggling does not repeat the error.

**Points for review.**

- **`use` of tokens in `design.md` narrower than the accepted frame.** `color/input` says
  "Field border" and is the fill of the off track here; `icon/size-lg` says "DO NOT USE … in a
  list" and is the height of the track, which `switch/track-width` asks for. `design.md` does
  not change in this pull request; widening the `use` is a decision of Indiane, through Claude in
  Figma, as P73 recorded.
- **D3 against `movimento_regras.anime_apenas`.** The track fill and outline animate, besides
  transform and opacity. The accepted evidence prevails, as in P73.
- **Contrast, measured.** The component test measures the seven brands in light and dark. The
  track edge on the page background: `color/input` 3.23:1 in light and 6.58:1 in dark;
  `color/primary-border` at least 4.96:1 in light and 4.91:1 in dark. The knob on its track:
  `color/background` on `color/input` 3.23:1 in light and 6.58:1 in dark; `color/primary-foreground`
  on `color/primary` at least 4.96:1. The error outline, `status/error` on `color/background`,
  6.88:1 in light and 5.01:1 in dark. **Known limit, already recorded in `design.md`:**
  `focus/border` against `focus/halo` is 2.92:1 in `Sistemas`, in light mode; the test pins that list.

**Known limits.** A forced-colors mode is not handled: there the `box-shadow` and the
backgrounds give way to system colors and the knob may not show; handling it takes system color
keywords, which no piece uses yet, and is left to a task for every piece. A right-to-left page
does not mirror the knob: `left` is physical, and the evidence says left is off and right is on.
The error sentence outside the piece cannot be tied to it by `aria-describedby` across the
shadow root; inside `nph-field`, the field describes the group. A `<legend>` inserted or removed
before the one that holds the piece does not recompute its state until the next update, as in
`nph-field` (P83).

**Source.** Frame `nph-switch` (`1549:2`, set `1548:56`) of the Figma file `DS-IA-NEPHOS 5.0`,
accepted by Indiane on 08/10/2026, with the Figma UX QA and the textual audit approved; D1 to D4,
read from the set and answered by Indiane on 19/10/2026, in `docs/operacao/tarefas/DSA-27.md`. The
names `checked`, `invalid`, `disabled`, `text` and `label`, `role="switch"` on one button, the two
knobs and `aria-invalid` are a technical proposal of this implementation, reviewed with the plan
on 22/10/2026.

**Out of scope.** Form association and submission (`nph-checkbox`). A group component. A size.
What `nph-dropdown-menu` (DSA-45) will need: the piece without a label in a row 20 px high, the
row forcing the hover of the track, and the piece inside a `menuitem`. The Usage section of the
page (P70, DSA-35), the page lists read from the Metadata (P71, DSA-34) and the accessibility gate
(P72, DSA-32).

**Pending for Indiane (DSA-27, D5 and D6), none of them blocks.** How a one-line label aligns
with the track (tops aligned here); whether the fill follows the hover while there is an error
(it does here, and the outline stays `status/error`).

**Status.** Anatomy and behavior accepted by Indiane on 08/10/2026; D1 to D4 answered on
19/10/2026. API and semantics are reviewed in the pull request that brings them; the merge is the
approval.

---

## P80 — `nph-input`: API and semantics, the reference of the form controls

**Decision.** `nph-input` is a Web Component with **open Shadow DOM** (P01) and
`delegatesFocus`, CSS in its own file imported `?inline`, as in `nph-icon`. It has no slot, no
`::part` and no color property. Anatomy only through semantic tokens. It is the **first piece of
the repository associated with a form**, and this decision also fixes the pattern that
`nph-checkbox` (DSA-17), `nph-radio` (DSA-18) and `nph-input-otp` (DSA-41) copy, each recording
only what changes; there is no shared helper yet. What the field writes on the control (`label`,
`description`, `invalid`, `required`, `disabled`) is the field contract, recorded in P83
(DSA-28); this decision says how the input takes it. Invalid input renders nothing and emits
`console.error` only in development, one per cause — the rule of P21, adopted here by its own
decision, as in P66, P68, P73, P74 and P76. The names follow P64.

1. **Properties.** The Figma set has `size`, `state` and six properties for the icons, the value
   and the placeholder. The mapping below is a technical proposal of this implementation.

   | Figma | API |
   |---|---|
   | `size` | `size`, `default` or `large`, reflected: the internal CSS selects the height by it. *(Amended on 28/10/2026, DSA-59: `compact` too.)* |
   | `state` `erro` | `invalid`, Boolean, reflected: error border and `aria-invalid` on the inner field |
   | `state` `disabled` | `disabled`, Boolean, reflected: native `disabled` on the inner field and the clear button |
   | `state` `hover`, `foco`, `foco-limpar`, `erro-foco` | not properties: interaction, drawn by the CSS |
   | `ícone início` + `⮑ ícone início` | `icon-start`: `none` (default) or a core name of `nph-icon`. The Figma default, on with `magnifying-glass`, would put a magnifier in every field |
   | `ícone fim` + `⮑ ícone fim` | `icon-end`: `none` (default) or a core name; it turns on the clear button, and the name only swaps the art (D2) |
   | `texto do valor` | `value`, the current value |
   | `texto do placeholder` | `placeholder` |
   | the types of D1 | `type`: `text` (default), `email`, `tel`, `url` or `search` |
   | the accessible name of the clear button | `clear-label`, required with `icon-end` |
   | the form | `name` (reflected), `required` (reflected), `autocomplete` (WCAG 1.3.5) |
   | the field contract (P83) | `label` and `description`, text never visible |

2. **Form association.** `static formAssociated = true` and `attachInternals()`. It is what
   makes the host **labelable**: `<label for>` pointing to the host — what `nph-label for`
   renders (P62.1) — moves the focus to the inner native `<input>` through `delegatesFocus`,
   and `host.labels` lists it.
   - **Value.** `setFormValue(value)` on every change. A disabled host, by its attribute or by a
     disabled `<fieldset>`, is left out of the form data by the browser.
   - **`name` reflects.** The form reads the **attribute** of the host: without it, `el.name =
     'x'` set by code leaves the entry out of the submission (proved in Chromium).
   - **`value`: the attribute is the default, the property is the current value**, as in the
     native `<input>`. The property is declared with `attribute: false`; the host observes the
     `value` attribute by hand and applies it only while the field is not dirty. Typing and
     setting the property make it dirty; `form.reset()` (`formResetCallback`) clears the flag
     and goes back to the attribute. `formStateRestoreCallback` puts the value back on history
     navigation.
   - **Validity.** The host mirrors the flags **and** the message of the inner field:
     `setValidity(input.validity, input.validationMessage, input)`. It covers `required` empty
     and the format of `email` and `url`. The message is the browser's, in the person's
     language: no `nph-*` knows a language. `invalid` is **not** a constraint and adds no
     `customError`: the sentence belongs to `nph-field`, and `setValidity` would need one. A
     form whose messages are written by `nph-field` uses `novalidate` when the browser balloon
     is not wanted.
   - **Native surface**, as getters and methods, not reactive properties: `form`, `labels`,
     `validity`, `validationMessage`, `willValidate`, `checkValidity()` and `reportValidity()`.
   - **Value and validity before the events.** The host takes the value of the inner field in a
     `input` listener of its own, in capture, and writes the form value and the validity before
     any listener of the consumer runs; setting `value`, a reset and clearing do the same. The
     value is the one the native field keeps after its sanitizing (a line break, the spaces of
     an `email`). While the inner field does not validate (disabled), the host clears its
     validity, and mirrors it again when the field is enabled.
   - **Enter submits.** The inner field has no form owner, so the browser would not submit the
     form on Enter. The host does what HTML does: it clicks the default button of the form (the
     first submit button in tree order whose form is this one, `input type="image"` and buttons
     associated by the `form` attribute included, so the submitter, `formaction` and the
     validation apply), does nothing when that button is disabled, and calls `requestSubmit()`
     when there is none. With no form, Enter does nothing. It decides at the **end of the
     propagation**, as the default action of a native field: a consumer that cancels Enter, in
     capture or in bubbling, keeps the form. A microtask would decide between two listeners of
     the same event, too early.

3. **Accessible name and description.** The focused element is the inner field, and an `id`
   does not cross the shadow root. The inner field takes, in this order:
   1. the labels associated with the host (`internals.labels`), as **element references**
      (`ariaLabelledByElements`). A reference from inside a shadow root to an element of an
      outer scope is valid. The name follows the text of the label, because it is a reference
      and not a copy, and the `aria-hidden` asterisk of `nph-label` stays out of it. The host
      recomputes it after the first frame (the label may render after the input), on focus, when
      `label` changes and when a label of its root is added, removed or pointed elsewhere (a
      `MutationObserver` on the root, filtered to `for` and `id`). **Proved in Chromium**, by the accessibility tree read through the
      DevTools protocol in `nph-input.test.ts`: the inner field is a `textbox` named by the
      label, with or without the asterisk; a label that wraps the host names it too. `nph-input-otp`
      (DSA-41) can follow the same path;
   2. `label`, as the `aria-label` of the inner field. It is what `nph-field` writes (P83), since
      its label is not associated with `for`.

   With no name at all, the field **renders** and warns once in development: the label may
   arrive after the first render, and there is no event that says so. `description` goes into
   an internal element referenced by `aria-describedby`, hidden by clipping and not by
   `display: none`, which the browser does not read (P77).

4. **Events: the native ones, an exception to the reasoning of P73 item 3.** P73 gave
   `nph-togglebutton` an `nph-change` because its `click` did not say the new value and the
   prefix avoided the native `change`. These pieces are **form controls**: the consumer reads
   `event.target.value`, as frameworks do with a native field, and an `nph-*` event would need
   a typed key in `HTMLElementEventMap` that `nph-change` (P73) and `nph-value-change` (P76)
   already take with another `detail`. So the input fires `input` and `change` and no event of
   its own. The `input` of the inner field is `composed` and reaches the host on its own; the
   `change` is not, so the host fires it again (`bubbles`, not `composed`). Setting `value` from
   code fires neither. The same rule holds for the form controls of the field contract (P83).

5. **The clear button (D2).** A native `<button type="button">` after the field, named by
   `clear-label`, with the `nph-icon` of `icon-end`, decorative. It shows only with a value and
   when the field is enabled, and it stays in the Tab order: the frame draws `foco-limpar`
   (D2-item of the task, with Indiane). A click, Enter or Space empties the value, moves the
   focus back to the field — the button disappears, and the focus cannot fall on the page —
   and fires `input` and `change`, as typing does. `icon-end` without `clear-label` draws the
   field without the button and one error, as `info` without `info-label` in P62.6. In a
   `search` field, the cancel button of the browser is hidden, so the one of the piece is the
   only one.

6. **States (D4, D5).** The container border is `color/input`, `color/input-hover` on hover and
   `focus/border` with the halo `focus/halo` attached outside, at `focus/radius-control`, while
   the inner field has the focus. `foco-limpar` is the focus on the clear button, keyboard only:
   the container keeps its border, and the border (`focus/border-radius-control`) and the halo
   (`focus/radius-control-with-border`) sit around the 24 × 24 target. `erro` keeps
   `status/error` on hover and on focus, with the halo `focus/halo-error`; with `erro` and the
   focus on the clear button, the target takes the usual focus. `disabled` wins over
   everything: `color/input`, `color/muted` and `state/disabled-opacity` on the whole host,
   selected by `:host(:disabled)`, which also matches a disabled `<fieldset>`. The field shows
   its focus on a pointer click too: a text field always shows where the caret is. There is
   no motion: the evidence does not ask for it (D4-item of the task). *(Amended on 28/10/2026,
   DSA-59: in `compact`, the `foco-limpar` ring goes past the field.)*

7. **Box (D6).** The host is `inline-flex`, `layout/input-width` wide, with no minimum; the
   parent stretches it with its own `inline-size`, as `nph-field` will (P83).

8. **Invalid input.** A `type` outside the five (rendering a password as text would be a risk),
   a `size` outside the two *(three since the amendment of 28/10/2026, DSA-59)* and an icon value outside `none` and the core render nothing, take
   no space, leave `data-nph-rendered` out, contribute nothing to the form data and emit one
   `console.error` each, accumulating.

**Points for review.**

- **Form association**, the first of the repository, and the pattern the other controls copy.
- **The name by element reference**, and not a copy of the text: tools that compute the name
  from attributes (axe-core of P72, the role queries of Playwright) may not follow it; the proof
  is the accessibility tree of Chromium. Setting it writes an empty `aria-labelledby` on the
  inner field; check it when the gate of P72 lands.
- **Native events** instead of `nph-*`, and the departure from the reasoning of P73 item 3.
- **Enter submits** by clicking the default button, decided at the end of the propagation.
- **One `MutationObserver` per field on its root**, to follow labels that are recreated; it
  watches the tree and the `for` and `id` attributes, not the text.
- **`icon-start` and `icon-end` off by default**, unlike the Figma booleans.

**Known limits.** Autofill by browsers and password managers inside a shadow root varies.
Forced colors and right-to-left are not treated yet.

**Source.** Frame `nph-input` (`1195:532`, set `622:18359`) of the Figma file `DS-IA-NEPHOS
5.0`, accepted by Indiane on 01/10/2026, with the Figma UX QA and the textual audit approved on
02/10/2026; D1 to D7 answered on 16/10/2026. The API names, the form association, the name by
reference, the native events, the Enter rule and the invalid input rules are a technical
proposal of this implementation, approved in the plan by Elvys on 22/10/2026.

**Out of scope.** Password, number and mask (D1). A read-only state, `maxlength`, `minlength`,
`pattern` and `inputmode`. A `customError` from `invalid`. An event of its own. Motion. A shared
helper for the form controls. The Usage section of the page (P70, DSA-35) and the page lists read
from the Metadata (P71, DSA-34), as on every Docs page.

**Status.** Anatomy and behavior accepted by Indiane on 01/10/2026; D1 to D7 answered on
16/10/2026. API and semantics are reviewed in the pull request that brings them; the merge is
the approval.

### Amendment of 28/10/2026 — DSA-59: the size `compact`

**Technical conflict.** Item 1 gives `size` two values, `default` and `large`, the sizes of the
set accepted on 01/10/2026. On 28/10/2026 Indiane accepted a third size in the same set,
`compact` (variants `2978:9` to `2978:47`): a 28 px field for the search of the compact
`nph-toolbar` and for the compact table, with two new tokens, `input/height-compact` and
`input/clear-padding-end`
(`docs/operacao/evidencias/DSA-59/documentacao-figma-aceita-2026-10-28.md`).

**Decision.**

1. **API.** `size` is `compact`, `default` or `large`, reflected as before; the default stays
   `default`. Any other value still draws nothing and emits one `console.error` in development
   (item 8). The value is compared as written, without trimming spaces, because the internal CSS
   selects the measures by the exact reflected attribute: `" compact "` or `"large "` is invalid
   input, as in `nph-button`, and no longer renders with the measures of `default`.
2. **Measures.** `compact` changes two things: the height, `input/height-compact`, and the end
   padding, `input/clear-padding-end`, in every state, with or without the clear button. The
   start padding, the gap, the radius, the border, the text role, the icons and the 24 × 24 clear
   target are the ones of the other sizes. The 5 px end padding keeps the target inside the 28 px
   height and draws the X 12 px from the end border, the distance of the start icon from the
   start border.
3. **States.** The seven states of item 6, with the same tokens as `default`.
4. **The focus ring of the clear button.** In `compact` the `foco-limpar` ring (the 26 px border
   and the 34 px halo around the 24 px target, the same ring as in the other sizes) does not fit
   inside the 28 px field: the halo goes 3 px past its top and its bottom and reaches its end
   edge. By decision of Indiane on 28/10/2026 (option 1 of the preview), it stays as it is and
   goes past the field only while the button has focus: it is neither clipped nor shrunk. The
   piece clips nothing on its host or its container, and a wrapper of the consumer, in the
   toolbar or the table, must not clip it either. WCAG 2.4.13 accepts a focus indicator drawn
   outside the component, and WCAG 2.4.11 does not fail a partly covered one at level AA.
5. **Accessibility.** The target is the field itself, 28 px high: `compact` is for mouse and
   keyboard, not for touch (`design.md`, A30), and `large` keeps the 44 px target. The clear
   button keeps its own 24 × 24 target (WCAG 2.5.8).

**Breaking changes.** One. A `size` with spaces around it, such as `"large "`, was accepted
before, after a trim, and drew the measures of `default`, because the CSS did not match it. Now it
is invalid input (item 1): the field draws nothing, leaves the form data and emits one
`console.error` in development. Migration: remove the spaces from the value. Otherwise `size` only
gains a value, `default` and `large` do not change, and the exported `NPH_INPUT_SIZES` and
`NphInputSize` gain `compact`.

**Source.** The evidence above, set `622:18359` and frame `1211:690` of the Figma file
`DS-IA-NEPHOS 5.0`. Selecting the measures by the reflected `size`, as for `large`, is the
technique of item 1, unchanged.

**Status.** Size accepted by Indiane on 28/10/2026. Reviewed in the pull request that brings it;
the merge is the approval.

---

## P81 — `nph-checkbox`: API, semantics and form participation

**Decision.** `nph-checkbox` is a Web Component with **open Shadow DOM** (P01), CSS in its own
file imported `?inline`, as in `nph-icon`. It has no slot, no `::part`, no color property and no
size property. Anatomy only through semantic tokens. Invalid input renders nothing and emits
`console.error` only in development — the rule of P21, adopted here by its own decision, as in
P68 and P73. The names follow P64. It is a form control: it follows the form pattern of P80
(`nph-input`, the reference implementation) and the contract between `nph-field` and its
controls of P83, and records here only what differs.

1. **Properties.** The Figma property names are in Portuguese and the code API is in English
   (P64). The mapping below is a technical proposal of this implementation.

   | Figma | API |
   |---|---|
   | `marcado` = `true` | `checked`, Boolean, not reflected |
   | `marcado` = `indeterminado` | `indeterminate`, Boolean, not reflected |
   | `state` = `erro` | `invalid`, Boolean, reflected |
   | `state` = `disabled` | `disabled`, Boolean, the host attribute |
   | the text | `text`, String |
   | `mostrar rótulo` off: the accessible name | `label`, String |
   | — | `name` and `value`, String, the host attributes; `form`, read only |

   `state` values `hover`, `foco` and `erro-foco` are the interaction, not properties.
   `mostrar rótulo` is the presence of `text`, as `texto` is in P73. `indeterminate` shows the
   `minus` mark whatever `checked` is, as on the native checkbox, and a click of the person
   clears it and toggles `checked`: the evidence says it "is not an answer from the person".

2. **Semantics: a native checkbox inside.** The piece is an `<input type="checkbox">` inside a
   `<label>` with the drawn box and the text, in the shadow root, with `delegatesFocus`, as the
   native button of P73. The browser gives the role, the `mixed` state, Space, `:focus-visible`
   and the click on the text. The input lies, invisible, over the 24 × 24 touch area. The name
   is the text; without text, `label` becomes the `aria-label` of the input. Unlike P73,
   `aria-invalid` is valid on a checkbox, so `invalid` sets it on the input. **Known limit:** a
   `<label for>` outside, pointing to the host, toggles it but does not name the inner input,
   because an id does not cross the shadow root. The bridge of P80 item 3 (the labels of the
   host as element references) is not adopted: the piece brings its own text.

3. **Default and current state.** The `checked` attribute is the default state, the one a form
   reset goes back to; the property is the current state. Once the person toggles the piece, or
   code sets `checked`, the piece is dirty and a later change of the attribute no longer moves
   the current state, as the dirty checkedness of the native checkbox (P80). The state, the inner
   input and the form data move at once, before any listener runs and before the render.

4. **Form participation.** `formAssociated` and `ElementInternals`, as P80. A checked piece
   submits `name=value`; unchecked, nothing; `indeterminate` does not change what is submitted.
   `name` and `value` are the host attributes, read and written by their accessors: the form
   reads the attribute, and `value` is `on` when it is absent, as on the native checkbox.
   `form.reset()` goes back to the `checked` attribute, clears `indeterminate` and fires nothing.
   A disabled `<fieldset>` disables the piece as its own `disabled` does. State restoration
   brings back the checked state. There is **no `required` and no constraint validation**: the
   evidence has no `obrigatório`, and `invalid` never blocks the submission — the error sentence
   belongs to the page or to `nph-field`. So the native surface is only the `form` getter: with
   no constraint, the validity getters of P80 would always say valid.

5. **`disabled` is the host attribute, set at once.** The `disabled` property reads and writes
   the attribute, as the native one, instead of reflecting it during the render. The host then
   matches `:disabled` at once, and `formDisabledCallback`, which the browser calls for the own
   attribute and for a fieldset, runs outside an update. A reflection during the render would call
   it inside the update, and the render it asks for would be lost. `disabled` wins over `invalid`:
   the error border and `aria-invalid` are suppressed, and the combination is not an error.

6. **Events: the native ones.** As P80 item 4, for the form controls, the native events
   replace the reasoning of P73 item 3. The native `input` of the inner input is composed and
   crosses the shadow root on its own, unstopped; the native `change` is not composed, so the host
   fires its own `change` after it, which bubbles and is not composed. Both only when the person
   toggles the piece; setting `checked` or `indeterminate` from code fires nothing. The consumer
   reads `event.target.checked`. Nothing goes into `HTMLElementEventMap`. `click()` on the host
   dispatches one cancelable `click` on the host and, when nothing cancels it, toggles the piece
   and fires `input` and `change`, as on the native checkbox. The click of a `<label for>` outside
   toggles the piece with no second `click`; known limit: a cancellation made later, by an
   ancestor in bubbling, comes after that toggle. When an ancestor stops the `input` before it
   reaches the host, the host takes the state from the inner input on `change`.

7. **Inside `nph-field`.** `static nphFieldRole = 'option'`: in the field, the piece is an
   option of a group. The field names and describes the group in its own shadow root and writes
   `invalid` and `disabled` on each box (P83); `disabled` keeps the opacity of the piece, and the
   field draws none.

8. **Measures and focus.** The box is `icon/size-sm`, with `radius/inner` and `border/width`
   (D4); the touch area is the box plus `space/inline-tight` on each side, 24 × 24; the text is
   `space/inline` from the touch area (D5) and is lowered by a `calc()` of tokens so its first
   line is centered on the touch area. The focus is the box border in `focus/border` and a band of
   `focus/ring-width` in `focus/halo` outside it, which fills exactly the touch area, with the
   radius `focus/radius-inner` (`radius/inner` plus `focus/ring-width`); unlike P73, there is no
   extra border outside. The border follows the precedence error, focus, hover, rest (D2, D3).
   Following D2 to the letter, the border of a checked box stays `color/input`.

9. **Motion.** The evidence says nothing about it; `design.md` gives the checkbox the state role.
   The fill, the border and the opacity of the marks animate on `motion/state-duration` and
   `motion/state-easing`, as a pair. Width, height and position never animate. Under
   `prefers-reduced-motion` the change takes `motion/hover-duration`, the semantic alias of
   `core/duration/100`, the same substitution P73 records, open as D7 of DSA-22.

**Points for review.**

- **D7 of DSA-17, open for Indiane.** D2 says that a checked or indeterminate box on hover also
  takes `state/hover-opacity`, but not on what. The piece applies it to the box only; it does not
  block the pull request.
- **`use` of tokens in `design.md` narrower than the accepted frame.** `color/primary` (the
  fill of the box), `space/inline-tight` (on four sides), `state/hover-opacity` (the hover of the
  box; its `use` says it was the solid hover of `nph-button`) and `icon/size-sm` (the measure of
  the box). `design.md` does not change in this pull request; widening the `use` is a decision
  of Indiane, through Claude in Figma, as P68 and P73 recorded.
- **Contrast, measured, and known limits.** The component test measures the seven brands in light
  and dark. The box border, `color/input`, measures 3.23:1 in light and 6.58:1 in dark against the
  background; the mark, `color/primary-foreground` on `color/primary`, is at least 4.96:1, also
  under `state/hover-opacity`; the text is 21:1 in light and 14.73:1 in dark; the error border is
  6.88:1 in light and 5.01:1 in dark. Under 3:1, fixed in the test as exactly the measured pairs:
  the checked fill against the background in dark gerencial (2.71:1) and dark rh (2.88:1), where
  the box border keeps the box visible; `focus/border` against the halo in light `sistemas`
  (2.92:1), as `design.md` already records; and `status/error` against `focus/halo-error` in dark,
  in every brand (1.96:1), which `design.md` does not record.

**Source.** Frame `nph-checkbox` (`1194:1033`, set `740:18776`) of the Figma file
`DS-IA-NEPHOS 5.0`, accepted by Indiane on 01/10/2026, with the Figma UX QA and the textual audit
approved on 02/10/2026; D1 to D6 answered on 19/10/2026. The mapping from the Figma properties,
the native input inside a label, the default and current state, the form participation, the
`disabled` accessor and the motion are a technical proposal of this implementation; the native
events and `nphFieldRole` follow the rules of the wave approved by Elvys on 22/10/2026.

**Out of scope.** `required` and constraint validation. A link or rich content in the text (D6).
A size, a slot, a `::part`. Group logic: the item that summarizes a group is kept in step by the
page. The Usage section of the page (P70, DSA-35). The page lists read from the Metadata (P71,
DSA-34). The accessibility gate (P72, DSA-32). The brand story (DSA-36). Forced colors and right
to left, a known limit shared by the form controls.

**Status.** Anatomy and behavior accepted by Indiane on 01/10/2026; D1 to D6 answered on
19/10/2026. API and semantics are reviewed in the pull request that brings them; the merge is
the approval.

---

## P82 — `nph-radio`: API and semantics

**Decision.** `nph-radio` is a Web Component with **open Shadow DOM** (P01), CSS in its own file
imported `?inline`, as in `nph-icon`. It has no slot, no `::part`, no color property and no size
property. Anatomy only through semantic tokens. Invalid input renders nothing and emits
`console.error` only in development — the rule of P21, adopted here by its own decision, as in
P66, P68, P73, P74 and P76. The names follow P64. The form pattern is the one of **P80**
(`nph-input`, the reference of the form controls), and the contract with `nph-field` is
**P83**; this decision lists only the API of the radio and what differs from them.

1. **Properties.** The Figma property names are in Portuguese and the code API is in English
   (P64). The mapping below is a technical proposal of this implementation.

   | Figma | API |
   |---|---|
   | `marcado` | `checked`, Boolean, **not** reflected; the `checked` attribute is the initial state |
   | `state` `erro` | `invalid`, Boolean, reflected |
   | `state` `disabled` | `disabled`, Boolean, reflected |
   | the text | `text`, String |
   | `mostrar rótulo` off | no `text`; the accessible name is `label`, String |
   | the group and the form | `name` and `value`, String, reflected; `value` is `on` by default |

   `state` `hover`, `foco` and `erro-foco` are interaction, not properties. There is no
   indeterminate and no size: the circle is always `icon/size-sm`.

2. **The host is the control.** The radio is form-associated (`static formAssociated = true`,
   `ElementInternals`), its role is `radio`, with `aria-checked` and `aria-disabled`, set through
   the internals, and the host takes the focus itself, with a `tabindex` the piece owns. There is
   **no inner `<input>`**, unlike `nph-input` and `nph-checkbox`: an input inside a shadow root is
   in another tree than the other radios, so native exclusivity and the native arrow keys would not
   reach them, and it would not join the form outside. Since the code coordinates the group anyway,
   one focusable element is simpler than an inner input kept in sync with the host. A `<label for>`
   pointing at the radio checks it, because a form-associated element is labelable.

3. **The group is not an element.** The accepted frame says the group is several radios inside an
   `nph-field`, and DSA-18 leaves exclusivity, arrow keys, the form value and the event to code.
   Radios with the same non-empty `name`, in the **same root** (`getRootNode()`, never `document`,
   as in P77) and with the same form owner, are one group, in tree order. A detached tree is a root
   too, as for the native radio, so markup parsed with two checked radios keeps the last one.
   Checking one unchecks the others, from the person or from code; the others do not become dirty.
   A change of `name`, by the property or the attribute, settles both groups at once, on the page or
   not, and a checked radio unchecks its new group, so the radio renamed last wins whatever the order
   of its attributes.
   A radio that arrives checked unchecks the radios of the group already on the page; radios that
   connect in the same batch have not had their turn yet, so the last checked radio to connect wins.
   The association with a form follows the same rule. A radio without a name is a group of
   one. `nph-field` gives the group its role (`radiogroup`), name, description, `aria-required` and
   error, and reads `static nphFieldRole = 'radio'` (P83); the radio owns the exclusivity, the arrow
   keys and its Tab stop, so it works outside a field too (`nph-rich-option`).

4. **The person checks it.** A click on the piece — the circle or the text — `click()`, Space or a
   `<label for>` checks an unchecked radio. A click on the checked radio changes nothing and fires
   no event, and the `click` still bubbles: there is no inner button to stop, so the capture block
   of P76 is not copied. Only a radio that does not respond (disabled, inside a disabled fieldset,
   or not drawn) stops the click in the capture phase, as in P73.

5. **Keyboard (WAI-ARIA APG, Radio Group).** One Tab stop per group: the checked radio that
   responds or, with none checked, the first one that responds. Arrow down and arrow right move the
   focus to the next radio that responds, arrow up and arrow left to the previous one, wrapping; the
   arrow also checks it and fires the events. Space checks the focused radio. A radio hidden by
   the `hidden` attribute or by `display: none`, on itself or on an ancestor, takes no Tab stop and the arrows skip it; code can
   still check it. A change of visibility alone is picked up the next time the group settles. Arrows and Space
   prevent the page scroll; Enter does nothing; a key with Alt, Ctrl or Meta is left alone. Every
   radio settles the `tabindex` of its whole group when it connects, leaves (the group it left),
   changes `checked`, `disabled`, `name` or form owner, or becomes drawn. A `tabindex` the consumer
   writes is replaced.

6. **Events: the native `input` and `change`.** When the person checks a radio, the host fires
   `input` (bubbles, composed) and then `change` (bubbles, not composed), as the native radio does;
   none is cancelable, and the state is already set when they fire. Setting `checked` from code never
   fires them. There is no `nph-*` event and no entry in `HTMLElementEventMap`. This follows the
   exception P80 records to the reasoning of P73, item 3: these pieces are form controls, and the
   frameworks of the consumers bind `input` and `change`.

7. **Form (P80).** `setFormValue(checked ? value : null)`: only the checked radio enters the
   `FormData`, as `name=value`. `name` and `value` reflect, because the form reads the attributes of
   the host; an empty `name` writes no attribute, and the default `value`, `on`, is also written as
   the attribute; removing the `value` attribute gives back `on`, so the property, the events and
   the form agree. A radio that is not drawn (no accessible name) submits nothing, as in P80. `checked` does not reflect: the attribute is the
   initial state and the one `form.reset()` returns to, and a later change of the attribute moves the
   current state only while the piece is not dirty — neither the person nor code changed `checked`
   — the rule of the native radio. `formDisabledCallback` (a disabled fieldset) works as `disabled`;
   `formStateRestoreCallback` brings back an explicit checked or unchecked state, which the radio
   writes as its restore state (`null` would not be restored, and a radio unchecked by the person
   would come back checked by its attribute); in the `autocomplete` mode it compares the state
   only with `value`, so a value that looks like a restore marker is just a value. `form`, `labels`,
   `validity`, `validationMessage`, `willValidate`, `checkValidity()` and `reportValidity()` are
   exposed, as in P80. There is no `required` and no validity of its own: the field says the group
   is required (P83).

8. **Accessible name.** `internals.ariaLabel` is the text or, without text, `label`; an
   `aria-label` or `aria-labelledby` the consumer puts on the host also counts and wins. The proof is
   the name, the role and the state the browser itself computes, read through the accessibility
   tree, in the tests.

9. **`invalid` is visual only.** `aria-invalid` is not supported on the `radio` role (WAI-ARIA 1.2);
   it goes on the `radiogroup` of `nph-field`, with the error message. `disabled` wins over
   `invalid`: the error border is suppressed, and the combination is not an error (D7, open with
   Indiane).

10. **Drawing (D1 to D5).** The circle is `icon/size-sm` with `border/width` and `radius/full`; the
    touch area is the circle plus `space/inline-tight` on each side, 24 × 24; the dot is
    `calc(icon/size-sm - 2 × space/inline-tight)`, 8, because D3 measures the padding from the outer
    edge of the circle, border included. `space/inline` separates the touch area from the text, which
    is `text/label-md` and wraps; the circle stays at the top and its center is on the center of the
    first line, through a top offset computed from the tokens (D6, open with Indiane). Focus is the
    border `focus/border` and a `focus/halo` halo of `focus/ring-width` on the circle, which covers the
    touch area exactly; with error, `status/error` and `focus/halo-error`. The disabled opacity goes
    on the whole piece, text included; the field passes `disabled` and does not draw it again (P83).

11. **Motion.** Fill and border change on `motion/state-duration` and `motion/state-easing`, and the
    dot fades by opacity on the same pair; width, height and position never animate. Under
    `prefers-reduced-motion` the duration is `motion/hover-duration`, the semantic alias of
    `core/duration/100`, as in `nph-togglebutton`; the curve stays and the colors still change. The
    question about this substitution is the open D7 of DSA-22; no new one is opened.

12. **Invalid input and composition.** No accessible name — no `text`, no `label`, no `aria-label`
    and no `aria-labelledby`, an empty or blank one counting as none — renders nothing, takes no space, leaves `data-nph-rendered` out, takes
    no Tab stop and emits one `console.error` in development; the check runs again only when one of
    those changes, so checking does not repeat it. Two problems of composition render anyway and emit
    one `console.warn` each, in development, once while they last, read one frame after the radio
    connects so radios parsed together are found: a radio without `name`, and a group of one. There is
    no maximum: "more than five, use `nph-select`" is a usage rule, not an error.

**Points for review.**

- **The host as the control**, with no inner input, while `nph-input` and `nph-checkbox` keep a
  native one.
- **The tabindex owned by the piece**, which replaces one the consumer writes.
- **The `use` of tokens in `design.md` narrower than the accepted frame:** `radius/full` ("NEVER on a
  regular button, field or card"), `state/hover-opacity` (written for the button), `color/input` (it
  names checkbox, not radio) and `icon/size-sm` as the size of a box. The accepted evidence prevails,
  and `design.md` does not change; widening the `use` is a decision of Indiane, through Claude in
  Figma, as P68 and P73 recorded.
- **Contrast, measured.** The circle outline, `color/input` on `color/background`, and the text pass
  3:1 and 4.5:1 in both schemes. The dot, `color/primary-foreground` on `color/primary`, and the error
  border, `status/error` on `color/background`, pass 3:1 in all 14 brand and scheme pairs. The focus
  border, `focus/border`, is below 3:1 against the halo only in light Sistemas (2.92:1), the known
  limit `design.md` records; the test pins that list.

**Known limits.**

- Outside a `radiogroup`, the screen reader does not announce the group name or the position: that
  comes from `nph-field`.
- `invalid` is not announced on the radio.
- The arrow keys are physical: no right-to-left mirroring. `forced-colors` is not treated.
- **Found by the last Copilot review of the pull request, recorded here by Elvys's decision of
  24/10/2026, with a follow-up task:**
  - a change of `value` on a checked radio reaches the form data on the next update of the piece,
    not in the same call: reading `FormData` in the same handler, before `updateComplete`, gives the
    old value;
  - a radio hidden by `visibility: hidden`, on itself or on an ancestor, still counts as shown: it
    may hold the Tab stop of its group, and the arrow keys may check it without moving the focus to
    it (`display: none` and the `hidden` attribute are handled);
  - the radio does not check `defaultPrevented`: a `keydown` the consumer cancels in the capture
    phase still moves the focus, checks the radio and fires `input` and `change`.

  **Follow-up:** sync the form value in the `value` setter, use `checkVisibility` with the
  visibility option, and return early on a cancelled `keydown`, each with its regression test.

**Source.** Frame `nph-radio` (`1196:311`, set `848:66`) of the Figma file `DS-IA-NEPHOS 5.0`,
accepted by Indiane on 01/10/2026, with the Figma UX QA and the textual audit approved on 02/10/2026;
D1 to D3 read from the accepted set and D4 and D5 answered on 19/10/2026. The host as the control,
the group by name and root, the keyboard, the events, the form semantics, `nphFieldRole`, the
invalid input and the composition warnings are a technical proposal of this implementation,
approved with the plan by Elvys on 22/10/2026.

**Out of scope.** `required` and validity of the group (P83: the field says it). An indeterminate
state, a size, a slot, a `::part` and a color property. A right-to-left mirror and `forced-colors`.
The Usage section of the page (P70, DSA-35), the page lists read from the Metadata (P71, DSA-34) and
the accessibility gate (P72, DSA-32).

**Pending for Indiane (DSA-18, D6 and D7), none of them blocks.** Whether the circle aligns with the
first line by its center (here) or by the top edge; and what the piece does with `invalid` and
`disabled` together (disabled wins, here).

**Status.** Anatomy and behavior accepted by Indiane on 01/10/2026; D1 to D5 answered on 19/10/2026.
API and semantics are reviewed in the pull request that brings them; the merge is the approval.

---

## P83 — `nph-field`: API, semantics and the field–control contract

**Decision.** `nph-field` is a Web Component with **open Shadow DOM** (P01), CSS in its own file
imported `?inline`, as in `nph-icon`. Its shadow root holds an `nph-label`, a wrapper around the
default slot and the message line. It has no `::part`, no event of its own, no color or size
property and no form association. Anatomy only through semantic tokens: `layout/field-width`,
`space/stack-tight`, `space/inline`, `text/caption`, `text/body-md`, `color/muted-foreground` and
`status/error`. The names follow P64. This decision also fixes the **field–control contract**: the
properties every form control that enters the field takes (DSA-16, DSA-17, DSA-18, DSA-27, DSA-41,
and later DSA-29, DSA-31, DSA-38, DSA-39 and DSA-46). The decisions of those pieces cite it as
"field contract, P83".

1. **Properties.** The Figma set has the variants `state`, `obrigatório` and `ícone`, the
   properties `mostrar apoio`, `texto de apoio`, `mensagem de erro`, `contador`,
   `texto do contador` and the swap `⮑ controle`. A text that is filled in turns its part on: there are no
   booleans to show a part. The mapping below is a technical proposal of this implementation.

   | Figma | API |
   |---|---|
   | the label text | `label`, String: the text of the `nph-label` and the accessible name of the control |
   | `obrigatório` | `required`, Boolean, reflected |
   | `ícone` (D1) | `info` and `infoLabel` (`info-label`), String, passed to the `nph-label` as they are |
   | `mostrar apoio`, `texto de apoio` | `help`, String |
   | `mensagem de erro`, `state` `erro` | `error`, String. Filled in, the field is invalid: there is no `state` property |
   | `contador`, `texto do contador` | `counter`, String, shown as it comes; the field counts nothing |
   | D8 | `disabled`, Boolean, reflected |
   | `⮑ controle` | the default slot |

   `required` and `disabled` reflect like the native attributes, so the CSS of the consumer can
   read the state of the field. A text of spaces counts as empty.

2. **Why the field writes properties on the control.** An id reference (`for`,
   `aria-labelledby`, `aria-describedby`) does not cross a shadow root, and the slot does not merge
   trees (P77, item 2). The control is a light DOM child of the field and its focus lives in its own
   shadow root, so nothing in the shadow root of the field can name or describe it by reference.
   The field passes the text and the state as properties, and each control applies them to its
   focusable element, in its own root. **Discarded alternative:** rendering the label and the
   message line in the light DOM of the field and referencing them with `ariaLabelledByElements`
   and `ariaDescribedByElements`. It would be a second exception to P01, which P62.1 says needs a
   decision of its own, and it writes into the light DOM that a framework of the consumer owns.

3. **The `nph-label` inside the shadow root.** The label is an `nph-label` used **without `for`**:
   the association is the contract of item 5, and P62.1 and `for` still hold for a label used on its
   own next to a native control. P62.1 discarded delegating the association to `nph-field` because
   the field did not exist; this decision is that delegation, and P62.1 does not change. The
   `nph-label` has no Shadow DOM and its CSS is global, so the field adopts the same stylesheet in
   its root (`nph-label.css?inline`) and writes no selector on the classes of the label (P02). The
   library build leaves `?inline` imports alone, so no side effect is added. A click on the label
   text calls `focus()` on the control; a click on the information icon or on its balloon does not.

4. **Message line, layout and disabled (D2 to D8).** The help is `text/caption` in
   `color/muted-foreground`; the error is `text/body-md` in `status/error`, with no icon, and
   replaces the help. With no help, no error and no counter the line is not rendered. The counter
   sits at the end of the help line and never takes the error color. Four points the evidence does
   not settle follow a **provisional default** until Indiane answers D-1 to D-4 (see below), and
   are not part of the contract: in error the counter goes on a line of its own below the message,
   at the end, `space/stack-tight` below (D-1); at least `space/inline` from the help text, which
   wraps (D-2); the help comes back when disabled hides the error (D-3); long texts wrap with no
   ellipsis, and a run with no space, such as a URL, breaks inside the width (D-4). The
   host stacks the label row, the control and the line at `space/stack-tight`, takes
   `layout/field-width` and `max-inline-size: 100%`, and the slotted control is stretched with
   `inline-size: auto` (a `::slotted` rule from the outer tree wins over the `:host` width of the
   control). A group stacks its options at `space/stack-tight`. **The field draws no opacity when
   disabled:** D8 asks for `state/disabled-opacity` only on the control, and every control already
   fades itself; both together would give 0.25. Disabled hides the error, and so does a disabled
   `<fieldset>` around the field, except in its first `<legend>`, as the browser and `nph-input` read
   it. The field watches the `disabled` attribute of those fieldsets and writes nothing on the control
   for them: the control reads the fieldset itself.

5. **The field–control contract.**
   1. **Events.** Native `input` and `change` on the host, only by an action of the person: setting
      `checked` or `value` from code fires nothing. No new `nph-*` event in the form controls and
      nothing in `HTMLElementEventMap`. With an inner `<input>` (input, otp, checkbox), the native
      `input` passes through (it is already composed and is not stopped) and `change` is fired again
      on the host (`bubbles: true`, not composed). With no inner `<input>` (radio, switch), the host
      fires `input` (`bubbles`, `composed`) and then `change`. P80 records this as an exception to
      the reasoning of P73, item 3: these pieces are form controls.
   2. **Properties the field writes on the control:**
      - `label`: the accessible name, as text, never visible;
      - `description`: the control puts it in an inner element hidden by clipping, never by
        `display: none` (Chromium does not read it; see the `willUpdate` of `nph-tooltip`), referenced
        by `aria-describedby`. Input and otp take `description`; on the options of a group
        (checkbox, radio, switch) the field describes the group;
      - `invalid`;
      - `required`: the input uses the native `required`; the otp maps it to `aria-required` or
        ignores it; on the options of a group the field puts `aria-required` on a radio group. A form
        with `nph-field` that does not want the native validation bubble uses `novalidate`: the
        error message belongs to the field;
      - `disabled`: the control draws its own opacity; the field only passes it and draws nothing.

      Inside a field, the field is the source of `label`, `description`, `invalid` and `required`:
      a value set on the control is overwritten, so the field is never red without a text.
      `disabled` adds up: the field turns it on while it is disabled and gives back only what it
      turned on, even after the control moves to another field. A control moved between fields
      belongs to the last field that wrote on it: the old field does not clean up what the new one
      wrote. The default slot takes the children with no `slot` attribute or an empty one. `description` is the visible message line, the error when shown and the help
      otherwise; the counter is not part of it.
   3. **`static nphFieldRole`:** checkbox and switch are `'option'`; radio is `'radio'`. Input and
      otp need nothing: an absent or unknown value is a control. The field reads it from the class
      of the element, so a custom element not yet defined receives nothing until it is defined.
   4. **Form** (input, checkbox, radio, otp): `formAssociated` and `ElementInternals`. `name`
      reflects as an attribute: without the attribute on the host, the piece is left out of
      `FormData`. Checkbox and radio reflect `value`. In input and otp the `value` attribute is the
      initial value and the property is the current value. `checked` does not reflect: the
      attribute is the reset default and the property is the current state, with a "dirty" flag.
      Enter in the input and in the otp submits the form, as the native one does. The switch is not
      form-associated, and its `checked` reflects.
   5. **No shared helper.** DSA-16 is the reference implementation and P80 describes the pattern;
      the other pieces copy it and record only what changes.
   6. **No accessible name:** input and otp warn and render; checkbox, radio and switch do not
      render.

6. **A group of options.** When the slot holds options, the wrapper of the slot, inside the shadow
   root of the field, is a `group` (`radiogroup` when the options are radios), with `aria-label`
   from `label` and `aria-describedby` pointing to the text of the message line, in the same root.
   It is not the host, as in `nph-toggle-group` (P76): an `aria-describedby` on the host would not
   reach the message in the shadow root. `aria-labelledby` to the `nph-label` was discarded: the
   computed name would take the name of the information icon and the text of its balloon. The
   wrapper carries `aria-invalid` in error, and `aria-required` only as a `radiogroup` (it is not
   allowed on `group`). The field writes only `invalid` and `disabled` on each option. Exclusivity,
   arrow keys and the roving tabindex of radios belong to `nph-radio` (P82). A click on the label of
   a group moves no focus, as a native `<legend>`.

7. **Invalid input and composition.** `label` empty emits `console.error` only in development and
   the field **renders anyway**: hiding the control because of a missing translation is worse, as
   P62.6 keeps the `nph-label` when the help is wrong. A problem in the composition renders and
   emits `console.warn` only in development, one per cause while it lasts (the rule of P76): no
   control, more than one control (only the first is named), a control mixed with options, radios
   mixed with other options, and an element that does not take the contract. The field checks the
   contract before it writes and writes nothing on such an element, so its own writes never hide
   the warning.

**Known limits.** The name and the description reach the control as text, not as a reference: the
visible label is not associated with the control in the accessibility tree, and the two only match
because the field writes the same text. The stories use the real `nph-input`; the options of a
group are demonstration elements that take the contract until `nph-checkbox` and `nph-radio` are
merged. The field watches only the `disabled` attribute of the fieldsets around it: when a
`<legend>` is inserted or removed before the one that holds the field, the "first legend" exception
changes but the disabled state of the field is not recomputed until its next update, so its
message and `invalid` may stay stale meanwhile. **Follow-up** for a future task: also observe the
children of those fieldsets, with a regression test on the real `nph-input` that swaps the first
legend.

**Out of scope.** Form association of the field, validation and character counting (DSA-38 decides
how its counter reads the text), a live region for the error, a layout property, a size property and
a right-to-left mirror. The Usage section of the page (P70, DSA-35), the page lists read from the
Metadata (P71, DSA-34) and the accessibility gate (P72, DSA-32).

**Pending for Indiane (DSA-28, D-1 to D-5), none of them blocks.** The alignment of the counter
line in error and the space above it; the space between the help and the counter and what happens
when the help does not fit; whether the help comes back when disabled hides the error; long help and
error texts wrapping; and the missing `use:` line of `layout/field-width` in `design.md`. The code
follows the default stated in the task.

**Status.** Anatomy and behavior: frame accepted by Indiane on 01/10/2026, D1 to D8 answered on
16/10/2026. The plan and the contract were approved by Elvys on 22/10/2026. API and semantics are
reviewed in the pull request that brings them; the merge is the approval.

---

## P84 — `nph-empty`: API and semantics

**Decision.** `nph-empty` is a Web Component with **open Shadow DOM** (P01), CSS in its own
file imported `?inline`, as in `nph-icon`. It has no slot, event, focus, click, `::part`, color
property or size property. Anatomy only through semantic tokens. Invalid input renders nothing
and emits `console.error` only in development, with no visual fallback — the rule of P21, adopted
here by its own decision, as in P66 and P69. The names follow P64. It is the **first piece that
ships a raster asset**.

1. **Properties.** The Figma component has three properties and no variant. The mapping below is
   a technical proposal of this implementation.

   | Figma | API |
   |---|---|
   | `título` | `heading`, String, required, not reflected |
   | `descrição` | `description`, String, optional, not reflected |
   | `texto da descrição` | not a property: it is the presence of a non-empty `description` |
   | the illustration | not a property: it follows the color scheme |

   The name is `heading` and not `title`: `title` is a global HTML attribute, which the browser
   shows as a native tooltip and some screen readers read as a description. `texto da descrição`
   follows the precedent of `texto` in P73: on and off is the presence of the text, so there is no
   boolean that could say "on" with an empty text. Both texts are trimmed. Neither reflects: the
   CSS selects nothing by them.

2. **Semantics.** The host has no role. The heading and the description are `<p>`, not `<h*>`: a
   heading level inside a shadow root cannot be chosen by the consumer, and inside the
   `nph-combobox` list a heading would be noise. The piece is not a live region: announcing that a
   search found nothing belongs to the piece that receives it (DSA-46). The illustration is
   decorative, with an empty `alt` and `aria-hidden="true"`.

3. **The illustration follows the scheme by opacity.** `scheme/is-light` and `scheme/is-dark` are
   numbers, 1 in their own scheme and 0 in the other (`design.md`, `tokens_scheme`), and CSS cannot
   branch on a number. Both images are rendered, stacked in one grid cell, and each takes its flag
   as `opacity`. It works in every browser, writes no literal value and switches when
   `data-nph-color-scheme` changes on any ancestor, because custom properties inherit through the
   shadow root. **Cost:** the browser downloads both files (D1 of DSA-40). Discarded: a container
   style query (`@container style(...)`), whose support was not verified in every target browser,
   and reading the scheme in JavaScript, which does not see an attribute change on an ancestor.

4. **The asset ships as a file of the package.** In library mode Vite inlines every imported asset
   as base64, whatever its size. The two PNG files would become about 1 MB of JavaScript. The
   component imports them with `?no-inline`, and `vite.config.lib.ts` changes in two lines:
   `base: './'`, so the emitted URL is `new URL('../assets/<file>', import.meta.url)` and resolves
   wherever the package is installed (with the default base it would be the absolute `/<file>`, a
   path of the consumer's site); and `assetFileNames: 'assets/[name][extname]'`, so the files go to
   `dist/assets/` under their own name. `files: ["dist"]` already ships them and `exports` does not
   change. Only `nph-empty` reads `import.meta.url`: the JavaScript of every other component is the
   same, byte for byte, with and without the change. A consumer needs a bundler that resolves
   `new URL(..., import.meta.url)` (Vite, webpack 5, Rollup) or serves `dist/` as it is.

5. **Box.** A column that centers everything, `gap` `space/section` between the illustration and
   the text group and `space/inline-tight` between the heading and the description, padding
   `space/container-padding` on the four sides, `inline-size` `layout/input-width` with
   `box-sizing: border-box`, no background and no border. `max-inline-size: 100%`: in a narrower
   container the box shrinks to it and the text wraps (WCAG 1.4.10; D3 of DSA-40 asks Indiane to
   confirm). The heading is `text/heading-xs` in `color/foreground`, the description `text/body-sm`
   in `color/muted-foreground`; a word longer than the line breaks instead of overflowing.

6. **Size of the illustration.** 120 × 87 is the size of the asset, not a token (evidence of
   DSA-40). It is written as the `width` and `height` attributes of the images, not in the CSS,
   with `object-fit: contain`: the dark file has another proportion (2048 × 1538 against
   2048 × 1487) and is fitted whole, not cut nor stretched (D2 of DSA-40).

7. **Invalid input.** Without `heading`, with an empty one or with only spaces, the piece draws
   nothing, takes no space, leaves `data-nph-rendered` out and emits one `console.error` in
   development. An empty `description` is not an error: it is the heading-only case.

**Known limits.**

- **Angular application in a subdirectory.** The Angular application builder (checked with
  Angular 22 and the installed package) keeps the URL `new URL('../assets/<file>', import.meta.url)`
  and writes its bundles at the root of the browser output. An application published in a
  subdirectory, such as `/my-app/`, therefore resolves the illustrations to `/assets/` at the root
  of the site, outside the application: the consumer copies the two PNG files there. At the root of
  the site, the asset glob of `docs/consuming.md` is enough; Blazor with esbuild resolves them inside
  the application (`wwwroot/assets/`). Decided by Elvys on 23/10/2026: the delivery of this decision
  stays, and the limit is recorded here and in the guide.
- **Follow-up, after D1.** A new task is needed for (b) or (c) once D1 settles the weight of the
  illustrations: (b) the consumer gives the base of the assets, or (c) the illustrations are
  embedded in the package. It is recorded in `pending_decisions` of DSA-40 (D4, decider Indiane).

**Points for review.**

- **`vite.config.lib.ts`**, the first change of the library build since P75, and the first file of
  the package that is not code.
- **Both illustrations downloaded**, until D1 of DSA-40 brings lighter files.
- **The name `heading`**, shared with `nph-dialog` (DSA-44).

**Source.** Board `nph-empty` (`1463:25260`, frame `2003:688`, component `1463:25238`) of the
Figma file `DS-IA-NEPHOS 5.0`, accepted by Indiane on 16/10/2026, with the Figma UX QA and the
textual audit approved; `scheme/is-light`, `scheme/is-dark` and the two files in
`assets/illustrations/` are on `v/5.0.0`. The names `heading` and `description`, the semantics, the
switch by opacity, the delivery of the asset and the invalid input rule are a technical proposal of
this implementation, approved with the plan by Elvys on 22/10/2026.

**Out of scope.** An action, a button or a link. A loading state. Other illustrations, or choosing
one by hand. Announcing the result of a search. The `nph-combobox` itself (DSA-46): the
Storybook pages show its list in a frame. The Usage section of the page (P70, DSA-35), the page
lists read from the Metadata (P71, DSA-34) and the accessibility gate (P72, DSA-32).

**Pending for Indiane (DSA-40, D1 to D4), none of them blocks.** Lighter illustration files (the
current ones are 2048 px wide for a drawing of 120); whether the dark illustration is fitted or cut
in the 120 × 87 box; whether the box shrinks in a narrower container; and, after D1, the new task
for (b) or (c) of the known limit above.

**Status.** Anatomy and behavior accepted by Indiane on 16/10/2026. API and semantics are reviewed
in the pull request that brings them; the merge is the approval.

---

## P86 — Icon-only `nph-button`: shape and built-in tooltip

This decision **amends P68** in the icon-only button (B5). P68 fixed a square icon-only button
named by `label`, with no tooltip. Indiane accepted the `nph-icon-button` board on 19/10/2026, with
the textual audit approved on 20/10/2026 (DSA-43): the set has two shapes, and every icon-only
button carries a tooltip with the action name. In code it stays the `nph-button` without text: no
new tag. The text of P68 is kept as it was written; its icon-only paragraph carries an "Amended by
P86" mark.

**Technical conflict.** P68 has one corner for the icon-only button and no tooltip; the accepted
board adds `forma` (`quadrado`, `circular`) and makes the tooltip required. The rule of the
tooltip comes from P77 and its amendment of 22/10/2026: an element whose focus lives in a shadow
root cannot be described from outside, so the component that owns that root renders the tooltip
(P77 item 2), and on an icon-only button the balloon text is the accessible name, announced once
(rule 5 of DSA-48).

**Decision.**

1. **`shape`.** A string, reflected to the attribute, `square` (default) or `circular`, the Figma
   `forma` (`quadrado`, `circular`). The internal CSS selects the corners by it: `radius/control`
   in `square`, `radius/full` in `circular`. In the circular shape the focus border and halo also
   take `radius/full`; their width, color and distance do not change. The shape changes neither the
   size nor the touch target: the box stays 28, 36 or 44 px. An enum, not a boolean `circular`,
   keeps the one-to-one with the Figma variant and the invalid input rule of the piece.
2. **Only in the icon-only button.** The set with text has no `forma`. `circular` with text is
   invalid input, like `outline` in `info`: nothing is drawn and `console.error` is emitted in
   development, one per cause and accumulating (P68, P21 rule). A value outside the list is too.
   `square` with text is the default and never fails.
3. **The tooltip the button renders.** A valid icon-only button renders
   `<nph-tooltip for="control" relation="name">` next to its native button, in its shadow root; the
   native button has the `id` `control`, unique in that root. The tooltip text is the `label`: there
   is no second string that could diverge from the name, and there is no way to turn the tooltip off,
   because the board makes it required on every icon-only button. The button with text renders no
   tooltip. `side` is not set: the default `top` is the "above the button" of the board, and the
   tooltip flips by itself when it does not fit. Importing `nph-button` registers `nph-tooltip` too.
   The button keeps one root template for both forms, so switching between text and icon only
   keeps the native button and its focus. A click on the open balloon is composed and reaches the
   host without activating the native button, so the capture guard of the host stops it, as it does
   in `disabled` and `loading`. A tooltip rendered after the keyboard focus arrived, as when a button
   with text becomes icon-only while focused, heard no `focusin`: `nph-tooltip` now takes the focus
   hold when it attaches, on any path, to an element that already has the focus, with the rule of
   `focusin`, and only when the last input of the page was the keyboard. The page keeps one record
   of that last input: a key press (Tab included, not Enter, Space or Esc, which run or dismiss the
   action) or a pointer press, touch included. A text field matches `:focus-visible` after a click
   too, so the record decides; both events are composed, so a focus move between two controls of
   the same shadow root counts, which a `focusin` on the document does not see. The record starts
   when the module loads, not with the first tooltip, so the first balloon of a page also knows it.
   The `nph-tooltip` demonstrations that paired an icon-only `nph-button` with a second, outer
   tooltip now use a native button with one tooltip, so no example shows two balloons.
4. **The name, announced once.** With `relation="name"` the tooltip adds its `id` to the
   `aria-labelledby` of the native button, and the browser computes the name from the text it
   mirrors. The native button keeps `aria-label` with the same `label`: `aria-labelledby` wins in
   the name computation, and the `aria-label` covers the moment before the tooltip attaches. The
   tests read the name and the description the browser itself computes: the name is the `label` and
   there is no description, with the balloon closed and open.
5. **States.** The tooltip follows P77 and its amendment: keyboard focus opens it at once, the
   pointer after `motion/hover-delay`, never on touch, Enter and Space leave it alone and Esc closes
   it. A disabled button gets no balloon, because the native button is `:disabled` and the tooltip
   gives none to an element without focus; the reference stays, so the disabled button keeps its
   name. In `loading` the native button stays focusable (`aria-disabled`), so the balloon opens and
   names an action that is busy; the click still does not reach the consumer.
6. **Icon only in an action with a consequence.** The board allows it only in the actions column of
   a table, where the tooltip gives the name; elsewhere, the button has text. This is a usage rule
   of the sheet, not something the component can check.

**Breaking changes, and the release candidate.** Under P75, without a compatibility layer:

- The icon-only button now renders an `nph-tooltip` in its shadow root and its native button has
  `aria-labelledby`; the name does not change.
- `shape` is new and additive; with the default nothing else changes. The button with text does not
  change.

**Known limits.**

- **Esc inside a dialog.** With keyboard focus on an icon-only button, the balloon is open, and the
  first Esc closes the balloon, not the dialog around it (P77 item 4). It is pending with Indiane
  (DSA-43, D2).
- **No visible name on touch**, by rule 6 of DSA-48: the tooltip never opens there.
- **The distance of the balloon** is the one of the tooltip, `space/inline`; the DSA-43 evidence
  shows `space/inline-tight`. It is DSA-42 D2, with Indiane; the button does not override it.

**Source.** Board `nph-icon-button` (`2122:1591`, frame `2128:3953`, set `498:15671`) of the Figma
file `DS-IA-NEPHOS 5.0`, accepted by Indiane on 19/10/2026, with the Figma QA approved the same day
and the textual audit approved on 20/10/2026; `docs/operacao/evidencias/DSA-43/`. The name `shape`,
its values, the invalid input rule, the `id` of the native button, the `aria-label` kept as a
fallback and the tooltip in `loading` are a technical proposal of this implementation, approved with
the plan by Elvys on 22/10/2026.

**Out of scope.** A configurable side of the balloon, a way to turn it off and a tooltip text other
than `label`. The solid icon in `hover-active` (DSA-47). The Anatomy section of the page (DSA-33),
the Usage section (P70, DSA-35), the page lists read from the Metadata (P71, DSA-34) and the
accessibility gate (P72, DSA-32).

**Status.** Anatomy and behavior accepted by Indiane on 19/10/2026 and 20/10/2026. API and semantics
are reviewed in the pull request that brings them; the merge is the approval.

---

## P87 — `nph-dialog`: API and semantics

**Technical conflict.** The board of `nph-dialog` (DSA-44) fixes the anatomy, the sizes, the
spaces and the tokens, and leaves to code what it calls code rules: where the focus goes on open
and on close, the scroll, the veil outside the piece and the name of each property. Four points
also touch rules of other decisions: the solid secondary `nph-button` must paint
`color/secondary-on-dialog`, and the button has no color property (P68); the lines are
`nph-separator` in `color/dialog-separator`, and the separator keeps `color/border` (P66); the
stacked actions change below the `md` breakpoint, and no component has used a breakpoint yet; and a
modal dialog covers the window it opens in, which a page with several examples in both modes
(`docs/stories.md`, §4.6) cannot show at once.

**Decision.**

1. **API: nine properties, two slots and one event, no `::part`.**

   | Name | Role |
   |---|---|
   | `heading` | String, required. The title, the `h2` of the header and the accessible name. Not `title`: it is a global HTML attribute and would show the browser's own balloon over the dialog |
   | `description` | String. The support sentence below the title, the accessible description. Empty: none |
   | `size` | `sm`, `md` (default) or `lg`, reflected. The width ceiling (the Figma P, M and G) |
   | `actions` | `inline` (default) or `stacked`, reflected. `stacked` stacks only below the `md` breakpoint |
   | `hide-close` | Boolean, reflected. Turns off the close button, on by default; the name is inverted because an HTML boolean attribute cannot turn off a default `true` |
   | `close-label` | String. The accessible name of the close button, already localized; required while it is shown |
   | `header-separator`, `footer-separator` | Booleans, reflected. The lines; the footer one is drawn only with a footer |
   | `open` | Boolean, reflected. The state and the only way to open and close the dialog, as `open` of `nph-tooltip` (P77). No `show()` or `close()` method |
   | default slot | The content area. Empty, it is not drawn (the Figma "show content" off) |
   | slot `footer` | The `nph-button` actions, in the order the consumer writes them. Empty, the footer is not drawn |
   | `nph-close` | Bubbles, `composed`, **cancelable**, `detail: { source: 'escape' \| 'close-button' }`. Fired before the dialog closes when the person asks. `preventDefault()` keeps it open. Setting `open` never fires it (as P76) |

   Invalid input does not render and emits `console.error` in development, one per cause while it
   lasts (P21): an empty `heading`, a `size` or an `actions` outside the lists. An empty
   `close-label` with the button on draws the dialog without the button and says why. A dialog
   opened over another opens and emits `console.warn` ("finish or close the first one").

2. **Layer: the native `<dialog>` with `showModal()`.** It gives the top layer (no `z-index`, no
   clipping), the inert page and `role="dialog"` with `aria-modal`. The veil `overlay/scrim` is its
   `::backdrop`: outside the piece, as the board asks. No library is added.

3. **Focus.** On open: the first element with `autofocus` in the content or the footer; otherwise
   the first focusable element of the content, then of the footer, then the close button, then the
   window itself (`tabindex="-1"`). The close button comes after the content so that an Enter does
   not close the dialog by accident. The search follows what the person sees: into open shadow
   roots and from a slot to what it shows, so the field of a form component that does not delegate
   the focus counts; a negative `tabindex` on a shadow host takes out everything it draws, as
   sequential navigation does. Each candidate is focused and kept only if the focus really
   lands in it, so a disabled or hidden element is skipped, with the browser's own rule of a
   disabled `<fieldset>`, which spares its first `<legend>`; so is what a piece keeps focusable
   while turned off (`aria-disabled="true"`, or inside a disabled piece, such as the thumb of a
   disabled `nph-slider`), also when a piece hands the focus to such a part, as a loading
   `nph-button` does. A piece that has not drawn yet, when
   the dialog is connected already open, cannot take it: once the pieces draw, the rule runs again
   if the focus is still on the exact element the rule put it on, so a move by the person is kept,
   even between two parts of one piece. On close, the focus goes back to the
   element that had it, looked up inside shadow roots and given back by the component, not by the
   browser. No Tab trap is written: the inert page already keeps Tab in the dialog and the browser
   interface. The content area that scrolls with nothing focusable inside (item 5) is not a
   candidate on open: Tab reaches it after the opening rule ran (amended on 28/10/2026, DSA-32).

4. **Esc.** It is the browser's close request, the `cancel` event of the `<dialog>`. The dialog
   always holds it, fires `nph-close` and closes unless the event is canceled, so the exit animates
   and `open` changes on one path. **Known limit:** with no new activation by the person since the
   last held request, the browser fires `cancel` not cancelable and closes the window; the dialog
   then fires `nph-close` not cancelable and closes at once. An `nph-tooltip` open inside the dialog
   takes the first Esc (P77, item 4), also the balloon the close button carries (P86) while it has
   keyboard focus; the second Esc closes the dialog. A click on the veil does not close it (D5).

5. **Scroll.** The window is a column: the header and the footer keep their size and only the
   content scrolls above `layout/dialog-max-height`. The scroll area clips what is drawn outside
   its box, so it keeps around the content the room of the focus border and halo the controls draw
   outside theirs, and gives it back in negative margins: the measures do not change. When the
   header, the footer and the padding alone do not fit, as in a short window with the actions
   stacked, the content keeps at least one control row (`control/height-large`, D6) and the window
   itself scrolls, so no field and no action is out of reach. While any
   dialog is shown, the root of the page
   does not scroll (`overflow: hidden`, with a counter shared by every dialog), because the inert
   page still scrolls under the wheel over the veil; the width of the scrollbar that disappears is
   given back as padding, measured at run time, and the values the root had are restored at the
   end, each axis with its priority. If the browser refuses to show the window, nothing is held:
   the lock is released and a later update tries again. **This writes to the document**: it is the one global side effect of the piece.
   **Amended on 28/10/2026 (DSA-32, Elvys):** while the content scrolls and holds nothing that
   takes focus — text only, such as a list of names — the keyboard could not reach the scroll
   (WCAG 2.1.1). While that lasts, the content area is a region named by the title
   (`role="region"`, `aria-labelledby` on the heading) with `tabindex="0"`, and draws the focus
   ring inside the focus room it already keeps; the arrows and Page Down then scroll it. It
   follows the size of the content and of what it holds, and a control added, removed, disabled
   or hidden, so it leaves the Tab order when the scroll ends or a reachable control comes in. A
   hidden field, or a control that is hidden, inert or turned off, does not count as reachable. With a control inside, the control takes the focus and the
   browser scrolls to it, so the area stays out of the Tab order. Alternative discarded: an
   exception of the gate rule `scrollable-region-focusable`, which would have left the scroll out
   of reach.

6. **Width.** The window hugs its content (`fit-content`), from `layout/dialog-min-width` up to the
   ceiling of `size`, and never past the window less `layout/margin-compact` on each side (D2); the
   height also stops there. `layout/dialog-content-sm`, `-md` and `-lg` are not consumed: they are
   the width of the default content part in Figma, as `layout/separator-width` is the length of the
   master in P66. **Known limit:** content whose width is a percentage shrinks to its own size.

7. **Tokens redefined in the scope of the window, with no new value.** The window redefines
   `--nph-color-secondary` and `--nph-color-secondary-hover`, and, since DSA-64, the solid secondary
   tokens of the button (`--nph-button-secondary-solid-background`,
   `--nph-icon-button-secondary-solid-background` and their hovers), as `color/secondary-on-dialog`
   and its hover, which reach by inheritance every element inside the window that reads them
   — today, the `nph-button` in the content and in the footer: in dark,
   `color/secondary` is the same `surface/600` as `color/dialog`. **Superseded by P114 (item 4):** the
   window no longer redefines those tokens, only `color/border`. The `nph-button` keeps no color
   property (P68): the dialog uses the token channel the button already reads. On its own
   `nph-separator` only, the dialog redefines `--nph-color-border` as `color/dialog-separator`: an
   exception, scoped to the dialog, to the sentence of P66 "the color does not change"; the text of
   P66 does not change. No token is created and no value changes.

8. **Breakpoint.** `design.md` (§2f) makes the breakpoints build values, the only Nephos values that
   do not reach a component as `var()`: a media query does not accept a custom property. The `md`
   breakpoint (768) is written in the CSS as `@media (width < 48rem)`, with a comment pointing to
   `tokens_breakpoint`. `rem` in a media query follows the browser's default font size, not the
   root of the page: 48rem is 768 px at the usual 16 px and grows with a larger default font. The
   evidence names it `core/breakpoint/md`, which does not exist as a token, by that rule.

9. **Stacked actions.** Below the breakpoint, `actions="stacked"` turns the footer into a column in
   reverse order, so the primary, written last, sits on top; the visual order then differs from the
   Tab order, which keeps the order of the markup. Each button fills the line: the host stretches,
   and the native button inside it fills the host by a rule of `nph-button.css`
   (`:host(:not([data-nph-icon-only])) .control { flex: 1 }`), authorized by Elvys and brought by
   this decision after DSA-47.

10. **Motion.** The window and the veil enter on `motion/enter-*` and leave on `motion/exit-*`, the
    roles `design.md` gives to the dialog; only opacity moves. With reduced motion, the duration is
    `motion/hover-duration`, as P77.

11. **Stories in frames.** Each example is the real dialog, open, in a story hidden from the sidebar
    (`Components/nph-dialog/Fixtures`, without the `dev` tag). The Validation and Docs pages embed it
    in an `<iframe>`, one per mode, with the mode and the language in the address: each frame is a
    window of its own, with its own veil and breakpoint. `docs/stories.md`, §4.6 still holds: light
    and dark in the same story. A non-modal "preview" attribute was refused: it would be API invented
    for the page, and not the modal dialog.

**Reason.** The native modal dialog already does what the board asks of code — the top layer, the
inert page, the close request and the backdrop — and what is left (focus, scroll, events) is small
and testable. Redefining the token in the scope of the window keeps P68 and P66 as they are for every
other use.

**Source.** Board `nph-dialog` (`1368:27`, frame `2277:2`, set `2268:52262`) of the Figma file
`DS-IA-NEPHOS 5.0`, accepted by Indiane on 21/10/2026, with the textual audit approved, in
`docs/operacao/evidencias/DSA-44/`. The names, the focus rule, the event, the lock, the breakpoint
literal, the remapped tokens and the frames are a technical proposal of this implementation, approved
by Elvys with the plan on 22/10/2026.

**Out of scope.** The highlight icon (`status`), until D3. The `nph-alert-dialog`. A non-modal
dialog, a drawer or a side panel. The Usage section of the page (P70, DSA-35), the page lists read
from the Metadata (P71, DSA-34) and the accessibility gate (P72, DSA-32).

**Pending for Indiane (DSA-44, D1 to D6).** Whether `stacked` is the consumer's choice or what every
dialog does below `md` (D1); the margin to the edge of a small window (D2); the icon, the size, the
box and the place of the highlight icon (D3, which keeps `status` out); the extent of the lines and
the spaces around them and next to the close button (D4); whether a click on the veil closes (D5);
the minimum height of the content in a window too short for everything (D6). Only D3 holds a part
back.

**Status.** Anatomy and behavior accepted by Indiane on 21/10/2026; the plan approved by Elvys on
22/10/2026. API and semantics are reviewed in the pull request that brings them; the merge is the
approval.

---

## P88 — `nph-button`: solid icon in `hover-active`

This decision **amends P68** in the `hover-active` state of the button with text. P68 changes only
the surface, the text and the outline on hover; the icons stay in the `light` variant of
`nph-icon` in every state. On 21/10/2026 Indiane decided that an action with an icon in an active
state switches the icon from `light` to `solid`, and showed it in the set `461:13009` of Figma
(DSA-47, `docs/operacao/evidencias/DSA-47/`). The text of P68 is kept as it was written; its
**Hover** bullet carries an "Amended by P88" mark.

**Decision.**

1. **When.** In `hover-active`, the same condition that changes the background:
   `.control:not(:disabled):not([aria-disabled='true']):is(:hover, :active)`. At rest, in focus
   without hover, in `disabled` and in `loading` the icons stay `light`; in `loading` the spinner
   takes the place of the start icon and the end icon is not drawn, as in P68.
2. **What.** `icon-start` and `icon-end` draw the `solid` variant of the same core name, at
   `icon/size-sm`. The color does not change: the icon keeps the text color of the pair, including
   its hover color. No token is created or changed.
3. **How.** *(Amended on 27/10/2026, DSA-52: the icon-only button renders its icon as a pair too,
   at the size of its box.)* With text, each icon renders as a pair, a `light` one and a `solid` one, and the
   internal CSS hides the one of the other state with the hover selector above and its exact
   complement. The swap follows the background by construction, with no state in the component
   and no new property; the button keeps its width, because a hidden item takes no flex gap.
4. **Only in the button with text.** *(Superseded by the amendment of 27/10/2026, DSA-52: the
   icon-only button swaps too.)* The icon-only set `498:15671` keeps its icon `light` in every
   state, so the icon-only button renders a single icon, as in P86. Whether it also swaps is DSA-47
   D1, with Indiane; the answer only changes which branch renders the pair.
5. **Accessibility.** Every icon stays decorative (`aria-hidden`), so the name is the text, at rest
   and on hover. The swap is not a sign of state on its own: the surface already changes.

**Breaking changes.** None. The public API, the events and the tokens do not change; the shadow root
of the button with text now holds two `nph-icon` for each icon, which is internal (P02). *(Amended on
27/10/2026, DSA-52: the shadow root of the icon-only button holds two as well.)*

**Source.** The rule of Indiane of 21/10/2026, converted to text in
`docs/operacao/evidencias/DSA-47/figma-docs-accepted-2026-10-21.md`, set `461:13009` and card 25 of
the board `2478:1910` of the Figma file `DS-IA-NEPHOS 5.0`. The pair of icons hidden by CSS is a
technical proposal of this implementation, approved with the plan by Elvys on 22/10/2026.

**Out of scope.** The icon-only button (D1). *(Superseded by the amendment of 27/10/2026, DSA-52: the
icon-only button is in.)* The icon of other pieces with an active state, which
each task brings with its own evidence.

**Status.** Rule accepted by Indiane on 21/10/2026. Reviewed in the pull request that brings it; the
merge is the approval.

### Amendment of 27/10/2026 — DSA-52: the icon-only button

**Technical conflict.** Item 4 left the icon-only button out, as D1 of DSA-47. On 26/10/2026 Indiane
answered D1: the icon-only button (set `498:15671`, the `nph-icon-button` contract of P86) also swaps
its icon from `light` to `solid` in `hover-active`, the same rule as the button with text. She showed
it in the preview frame `2722:5358` of Figma, in light and dark
(`docs/operacao/evidencias/DSA-52/figma-docs-accepted-2026-10-26.md`). The set itself keeps `light`
in every state, because the default of an instance-swap property is the same for the whole set; that
is a limit of Figma, not another decision.

**Decision.**

1. **When.** The same condition as item 1. At rest, in focus without hover and in `disabled` the icon
   stays `light`; in `loading` the spinner takes its place, as in P86.
2. **What.** The icon of the icon-only button draws the `solid` variant of the same core name, at the
   size of its box (`sm` in `compact`, `md` in `default`, `lg` in `large`), in either shape. The
   color does not change, and no token is created or changed.
3. **How.** As item 3: the icon renders as a `light` and `solid` pair, and the same CSS hides the one
   of the other state. Only the branch that renders the pair changes.
4. **Accessibility.** Both icons are decorative (`aria-hidden`); the name stays the `label`, through
   the tooltip, at rest and on hover (P86).

**Breaking changes.** None. The public API, the events and the tokens do not change; the shadow root
of the icon-only button now holds two `nph-icon`, which is internal (P02).

**Source.** The answer of Indiane to D1 of DSA-47 on 26/10/2026, converted to text in the evidence
above. The pair is the technique of item 3, unchanged.

**Status.** Rule accepted by Indiane on 26/10/2026. Reviewed in the pull request that brings it; the
merge is the approval.

---

## P90 — `nph-image`: API and semantics

**Decision.** `nph-image` is a Web Component with **open Shadow DOM** (P01), CSS in its own file
imported `?inline`, as in `nph-icon`. The host is the frame. It has no slot, no `::part`, no
`nph-*` event, no color property and no form association. Anatomy only through semantic tokens.
Invalid input renders nothing and emits `console.error` only in development, one per cause — the
rule of P21, adopted here by its own decision, as in P66, P74 and P78. The names follow P64.

1. **Properties.** The Figma properties are `tamanho`, `proporção`, `estado` and `giro`. The
   mapping below is a technical proposal of this implementation.

   | Figma | API |
   |---|---|
   | `tamanho` | `size`: `xs` (default), `sm`, `md`, `lg`, `xl`, `2xl` or `media` (`mídia`), reflected |
   | `proporção` | `ratio`: `1:1` (default), `4:3` or `16:9`, reflected; only `media` uses it |
   | `estado` `carregada`, `carregando`, `vazio`, `erro` | not a property: derived from `src` and the load |
   | `estado` `hover`, `foco`, `desabilitada` | `interactive` and `disabled`, booleans, reflected |
   | `giro` | not a property: the rotation of the spinner |
   | the image | `src` |
   | the accessible name | `alt` |

   The default size is `xs` because it is the default of the Figma property, although the
   evidence gives it no usage rule. A square size ignores `ratio` with no warning: the evidence
   says the other sizes are always `1:1`. The ratio values keep the Figma text, which is a valid
   attribute value.

2. **The content state.** No `src` (after trim) is empty; a `src` is loading until the inner
   `<img>` fires `load` (loaded) or `error` (error); a new `src` starts the wait again. The state
   machine and the guard against a late event of an image that is no longer the current one are
   the ones of `nph-avatar` (P74). The read-only `status` says the state drawn now, and the host
   repeats the native `load` and `error` of the inner image as plain `Event`s that do not bubble,
   as the native ones: the evidence gives the text that explains a failure to the parent, so the
   parent must hear about it. They are native names, not `nph-*` events, as in P80.

3. **Frame and anatomy.** The square sizes are `image/size-*` with `image/radius-sm` (`xs`,
   `sm`), `image/radius-md` (`md`, `lg`) or `image/radius-lg` (`xl`, `2xl`, `media`); `media` is
   `image/media-width` wide with the height from `aspect-ratio`, the only literal values written
   (`1 / 1`, `4 / 3`, `16 / 9`). The frame is `image/background`; the image fills it with
   `object-fit: cover`. The border, `image/border-width` in `image/border`, is an overlay after
   the content, as in P74, and is off while loading. The spinner is the `nph-spinner` (P66) in
   `image/foreground`: it has only `sm` and `md`, so `xs`, `sm` and `md` take `sm` and the larger
   sizes take `md`.

4. **The clickable image.** The evidence says hover, focus and disabled are applied by the parent
   when the image is clickable, and that the image only receives focus when it is clickable. With
   `interactive`, the piece draws an inner native `<button type="button">` that fills the frame,
   with `delegatesFocus`, as `nph-button` (P68) and `nph-togglebutton` (P73), and gives it the
   `alt` as `aria-label`; the click is the native `click`. Hover over a loaded image shows the veil
   `image/overlay` with the `nph-icon` `eye` in `image/on-overlay`; the eye takes
   `image/icon-size-sm` in `xs` and `sm`, `-md` in `md` and `lg`, and `-lg` in the larger sizes
   (the grouping of the radii). The veil is drawn only over a loaded image: an eye over an empty frame
   or a failed image would promise a preview of nothing. Keyboard focus draws the ring
   `image/focus-border` in `focus/ring-width` as an outline just outside the frame, with its
   corner: it sits on the surface around the image and never over the photo, so an image of the
   ring color does not hide it, and an outline takes no space, so the area does not change. The
   frame therefore does not clip; the image and the veil take its corner themselves. A `click()`
   called on the host of a clickable, disabled image stops in the capture phase, as in
   `nph-button`; a plain disabled image lets the click pass to its parent. The eye reads
   `image/icon-size-*`: the veil bridges them to the `icon/size-*` that `nph-icon` reads, so a
   local value of an image token reaches the eye. `disabled` puts the whole piece at `state/disabled-opacity` and makes the
   button natively disabled. Without `interactive` there is no hover or focus look and the piece
   is never focusable.

5. **Semantics.** Without `interactive`: with an `alt`, the host takes `role="img"` and
   `aria-label`, in every state; with an empty `alt`, `aria-hidden="true"`. With `interactive`,
   the host has no role and the button carries the name. The inner `<img>` always has `alt=""`.
   `interactive` without an `alt` renders and emits one `console.warn` in development, not
   repeated while it lasts.

6. **Invalid input.** A `size` outside the seven or a `ratio` outside the three renders nothing,
   takes no space, leaves `data-nph-rendered` out, hides the host and emits one `console.error`
   per cause, also when the ratio is given to a square size.

**Known limits.**

- **Empty and error look alike.** The empty and error illustrations are image assets that are
  not in the repository, and the evidence says the code must ask the design owner for them
  (D1 of DSA-51). Until they arrive, both states draw the frame only, which falls short of the
  accessibility rule "loading, empty and error change the drawing, not only the color": the
  parent's text and the `error` event carry the difference. The tokens
  `image/illustration-light` and `image/illustration-dark` stay unconsumed until then, and the
  files, once they arrive, follow the asset delivery of P84.
- **`design.md` has no usage entry for the `image/*` tokens** (D2 of DSA-51); the component
  consumes them either way.
- **The loading state of the Validation and Docs pages is held by the demo frame**, which takes
  the address off the inner image of one piece so the image never arrives; the piece itself is
  untouched.

**Points for review.**

- **`xs` as the default size**, following Figma, and not `sm` as in P74.
- **The content state derived from `src`**, with the read-only `status` and the native `load`
  and `error` repeated on the host.
- **The clickable image as an inner native button**, opted in with `interactive`, and the veil
  only over a loaded image.
- **The sizes of the eye and of the spinner** by size, which the evidence does not map.
- **An invalid `ratio` renders nothing even on a square size**, which would ignore it.
- **The focus ring outside the frame**, an outline, and not a stroke over the photo: the change
  came from the code review of the pull request, where a photo of the ring color hid the ring.

**Source.** Board `nph-image` (`2573:66090`), frame `Documentação` (`2677:465`) and set
`2573:66089` of the Figma file `DS-IA-NEPHOS 5.0`, accepted by Indiane on 23/10/2026, with the
Figma UX QA and the textual audit approved. The names `ratio`, `alt`, `interactive` and
`disabled`, the derived state with `status` and the repeated events, the inner button, the veil
only over a loaded image, the sizes of the eye and the spinner and the invalid input rules are a
technical proposal of this implementation, approved with the plan by Elvys on 23/10/2026.

**Out of scope.** The illustrations (D1). A state forced by the parent, such as loading during an
upload without `src`. A loading timeout: the rule "do not leave loading without an end" belongs
to the consumer, and the error comes from the native `error`. `srcset`, `sizes`, lazy loading, a
caption and the preview the eye suggests. `nph-table`. The Usage section of the page (P70,
DSA-35), the page lists read from the Metadata (P71, DSA-34) and the accessibility gate (P72,
DSA-32).

**Status.** Anatomy and behavior accepted by Indiane on 23/10/2026. API and semantics are reviewed
in the pull request that brings them; the merge is the approval.

---

## P85 — `nph-input-otp`: API and semantics

**Decision.** `nph-input-otp` is a Web Component with **open Shadow DOM** (P01) and
`delegatesFocus`, CSS in its own file imported `?inline`, as in `nph-icon`. It has no slot, no
`::part`, no color property and no own event. Anatomy only through semantic tokens. It is
**associated with forms** in the pattern of P80 (`nph-input`), and it follows the contract with
the field of P83 (`nph-field`); this decision lists only what is its own. Invalid input renders
nothing and emits `console.error` only in development, one per cause — the rule of P21, adopted
here by its own decision, as in P66, P68, P73 and P76. The names follow P64.

1. **One native input, cells that only draw.** The shadow root holds one native
   `<input type="text">`, transparent and laid over the row of cells, with
   `autocomplete="one-time-code"`, `maxlength` equal to `length`, `inputmode="text"` and
   `autocapitalize`, `autocorrect` and `spellcheck` off. The cells are `aria-hidden` and draw the
   characters of `value`. The board says that the name comes from the field and that "the digit
   is only the value": one input gives one name, one value and one Tab stop, and leaves paste
   and the code the browser offers to the input itself. One input per cell was discarded: it
   gives one name per cell, a code offered by the browser lands only in the first cell, and
   paste and Backspace across cells become code of the piece.

2. **Properties.** The Figma property names are in Portuguese and the code API is in English
   (P64). The mapping below is a technical proposal of this implementation; `length` and
   `masked` follow the names of PrimeNG `InputOtp`, the source of names already used in P68.

   | Figma | API |
   |---|---|
   | `digitos` (6 or 4) | `length`, Number, 6 (default) or 4, reflected |
   | `size` | `size`, `default` (default) or `large`, reflected |
   | `state=erro` | `invalid`, Boolean, reflected; `aria-invalid` on the input |
   | `state=disabled` | `disabled`, Boolean, reflected; a disabled `<fieldset>` does the same |
   | `ocultar dígito` (on the cell) | `masked`, Boolean, reflected, on the host |
   | `dígito` and `mostrar dígito` (on the cell) | not API: the character comes from `value`, and a cell is empty while the code does not reach it |
   | the code | `value`, String |
   | the name and the description from the field | `label` and `description`, String (P83) |
   | the obligation from the field | `required`, Boolean, reflected; `aria-required` on the input, with no constraint validation |
   | the form entry | `name`, String, reflected |

   `masked` sits on the host because the cells are not public in code: without it, a code typed
   in a public place, which the board shows, could not be hidden (D3 of DSA-41 asks Indiane to
   confirm). `form` and `labels` are read-only getters, as in P80.

3. **Characters, typing and paste.** The field keeps only ASCII letters and digits, with the case
   as typed: the board says that the field takes a number or a letter, as behavior. Any other
   character typed is refused in `beforeinput`, before the browser replaces a selection with it,
   so the code is not touched and the `input` of that keystroke does not reach the consumer. As in P80, the host takes the value in an `input` listener of its
   own, registered first and in capture, so the value and the form data are settled before any
   listener of the consumer runs, in capture or in bubbling. A paste is cleaned, cut at `length` and **replaces the whole
   value**; a paste with no letter or digit changes nothing. The paste is the browser's own: the
   field does not touch the `paste` event, keeps the whole text from the `beforeinput`
   (`insertFromPaste`, Input Events) and replaces the value in its `input` listener. So a paste
   canceled by any means, in capture or in bubbling (`preventDefault()`, `onpaste` returning
   `false`, `returnValue`, or the `beforeinput` canceled), leaves the field alone, and a listener
   that moves the focus sends the paste there, as in a native input. The caret is the native one:
   focus puts it on the next empty cell (the browser would select the whole code, and the
   selection is not drawn), a click on a cell puts it on that cell or at the end of the code,
   and the arrows, Home, End and Backspace are the native ones. The **active cell** is the one
   at the caret, the last one when the code is full; it is the only cell with the focus look.

4. **Value.** The `value` attribute is the initial value and the value of `form.reset()`; the
   property is the current value. Once the person or the code changes the value, a new `value`
   attribute no longer replaces it. A value set from code with other characters or longer than
   `length` is cleaned, cut and reported with `console.warn` in development. A shorter `length`
   cuts the current value, and the value at focus with it, so the cut fires no `change`; the cut
   applies whenever `length` is valid, also while `size` is not.

5. **Form (P80).** `static formAssociated` and `ElementInternals`: `setFormValue` at once on every
   change (typing, paste, setting `value`, reset, restore), and `null` while `length` or `size`
   is invalid and the field draws nothing,
   `formResetCallback` back to the attribute, `formStateRestoreCallback`, and
   `formDisabledCallback`, read by `:host(:disabled)`; the inner input reads a disabled
   `<fieldset>` around the host by itself (except inside its first `<legend>`), as in P80, so
   enabling the host or the field again always enables the input. `name` reflects, because the form data
   reads the attribute of the host. There is no validity: neither `required` nor the length
   become a constraint, because the evidence has none, and the error sentence belongs to the
   field. **Enter submits the form** by the rule of P80: the default button of the form is
   clicked, or `requestSubmit()` runs when there is none; a disabled default button stops it; and
   it is decided at the end of the propagation, so a consumer that cancels Enter keeps the form.
   `name` is `null` by default, as in P80, so the host carries no empty `name` attribute.

6. **Events.** The native ones, as the contract of the field fixes (P83, and the exception to the
   reasoning of P73 recorded in P80): the `input` of the inner input crosses the shadow root with
   the host as its target, and the host fires `change` (bubbles, not composed) when the person
   leaves the field or presses Enter with a value different from the one at focus. Setting
   `value` or a reset moves that value at focus, so they never cause a `change`. A paste fires
   one `input`, with `inputType` `insertFromPaste`. Setting `value` from code fires nothing.
   Nothing enters `HTMLElementEventMap`.

7. **Name and description.** A label associated with the host names the inner input first,
   through `ariaLabelledByElements` from `internals.labels`; without one, `label` becomes the
   `aria-label` of the input. As in P80, the host looks for the name again after the first frame,
   on focus, when `label` changes and when a label of its root is added, removed or pointed
   elsewhere (a `MutationObserver` on the root, filtered to `for` and `id`). `description` goes
   into an inner element hidden by clipping
   (`clip-path`), never by `display: none`, referenced by `aria-describedby`. The test reads both
   from the real accessibility tree of Chromium. With no name, the field renders and warns once
   in development: the label may arrive after the first draw.

8. **States.** Hover paints every cell border `color/input-hover`, because the field is one
   target; the active cell takes `focus/border` and a `box-shadow` halo of `focus/ring-width` in
   `focus/halo`, outside the cell and out of the layout, whose outer radius equals
   `focus/radius-control`; `invalid` paints every border `status/error`, and the active cell's
   halo `focus/halo-error`; `disabled` takes `color/muted` and `state/disabled-opacity` on the
   whole field and wins over `invalid`, with no `aria-invalid`. The board does not name the hover
   border, the halo width, the opacity token or which of disabled and error wins: the piece
   follows `nph-input` (DSA-16, D3 to D5), and D1 of DSA-41 asks Indiane to confirm.

9. **Invalid input.** The piece draws nothing and emits one `console.error` per cause, only in
   development, when `length` is not 4 or 6 and when `size` is not `default` or `large`. The
   check runs again only when `length` or `size` changes.

**Written literals, and why.** `transparent` (the input draws no text, caret, background or
selection), `absolute`, `inset: 0` and `100%` (the input covers the row of cells, and the
description stays inside the field, so a long text adds no scroll), `:not([hidden])` (an author
`display` would win over `hidden`), zeros in
`box-shadow` (the halo is a spread) and `inset(50%)` in `clip-path` (the description is hidden by
clipping). None is a visual value.

**Known limits.**

- **`masked` is visual only.** The input stays `type="text"`, so a screen reader reads the code.
  `type="password"` was discarded: password managers would offer to save the code.
- **iOS zoom.** The input uses `text/code`, 14 px, and iOS Safari zooms a field under 16 px on
  focus. No token was created or bent to avoid it.
- **`one-time-code` in a shadow root.** That iOS offers a code received by SMS to an input inside
  a shadow root is **to be confirmed on a device**, not a guarantee. The WebOTP API is out.
- **Forced colors and right-to-left** are not treated, as in the other form pieces.

**Points for review.**

- **The examples inside the `nph-field`.** Two of the three required examples of the board sit in
  the `nph-field` (DSA-28). Elvys decided on 22/10/2026, after DSA-33 D2, that they could wait for
  it; DSA-28 was merged first (PR #105), so both are on the page with the real field, and the test
  reads the name and the description the field writes from the accessibility tree of Chromium.
- **The resend action.** The board puts a ghost `nph-button` with the label in `color/link` and
  underlined below the field. The `nph-button` has no color property and no `::part`, and a
  link-looking button is out of its scope (P68): the delivery does not show the resend action,
  and D4 of DSA-41 asks Indiane how that look reaches the `nph-button`.
- **Only digits.** The board makes letters and numbers behavior, so a phone shows the text
  keyboard. D2 of DSA-41 asks Indiane whether a field restricted to digits, with the numeric
  keyboard, is wanted.

**Source.** Board `nph-input-otp` (`1633:122`, set `1633:120`, cell set `1633:29`) of the Figma
file `DS-IA-NEPHOS 5.0`, accepted by Indiane on 16/10/2026, with the Figma UX QA and the textual
audit approved. The single input, the names `length`, `size`, `invalid`, `disabled`, `masked`,
`required`, `name`, `value`, `label` and `description`, the character rule, the paste rule, the
caret rule, the form behavior and the invalid input rule are a technical proposal of this
implementation, reviewed with the plan on 22/10/2026.

**Out of scope.** A field restricted to digits, a separator between groups of cells, `readonly`,
a placeholder, constraint validation, the WebOTP API, the resend action, the Usage section of the
page (P70, DSA-35), the page lists read from the Metadata (P71, DSA-34) and the accessibility gate
(P72, DSA-32).

**Status.** Anatomy and behavior accepted by Indiane on 16/10/2026; D1 to D4 of DSA-41 are open
with her and do not block. API and semantics are reviewed in the pull request that brings them;
the merge is the approval.

---

## P93 — `nph-textarea`: API and semantics

**Decision.** `nph-textarea` is a Web Component with **open Shadow DOM** (P01) and
`delegatesFocus`, CSS in its own file imported `?inline`, as in `nph-input`. It is a form
control: it copies the form shape of P80 and takes the field–control contract of P83. Anatomy
only through semantic tokens. It has no `::part`, no `nph-*` event, no color property and no
size. The names follow P64.

1. **Properties.** The Figma properties are `state`, `texto do valor`, `texto do placeholder`,
   `rodapé` and `texto do contador`. The mapping below is a technical proposal of this
   implementation.

   | Figma | API |
   |---|---|
   | `state` `default`, `hover`, `foco`, `erro-foco` | not a property: the resting look, the pointer and the focus |
   | `state` `erro` | `invalid`, reflected |
   | `state` `disabled` | `disabled`, reflected |
   | `state` `leitura` | `readOnly` (attribute `readonly`), reflected |
   | `texto do valor` | `value` |
   | `texto do placeholder` | `placeholder` |
   | `rodapé` | not a property: on when there is a `counter` or an element in the `actions` slot |
   | `texto do contador` | `counter` |
   | the footer actions | the named slot `actions` |

   The form side is `name` (reflected) and `required` (reflected), and the field contract is
   `label` and `description`, as in P80.

2. **The form shape of P80, with two divergences.** Value (the `value` attribute as the
   default, the property as the current value, the dirty flag), form association, reset,
   history restore, disabled `<fieldset>` with its first legend, validity mirrored from the inner
   field, name by reference to the associated labels or `label`, `description` in a clipped
   element, the native `input` and the `change` fired again by the host, and no event when code
   sets `value` — all as P80 describes them, with no shared helper (P83, item 5). The value keeps
   its line breaks. The two divergences:
   1. **Enter writes a new line.** It does not submit the form, so the Enter rule of P80 item 2
      does not apply, and the piece has no `keydown` of its own.
   2. **`readonly` exists.** P80 left a read-only state out of `nph-input`; the evidence gives
      `state=leitura` here. `readonly` is the native one of the inner `<textarea>`: the field is
      focusable and selectable, stays in the form data and is out of validation, as the native
      one. It draws no hover, no error look and no `aria-invalid`, because the evidence says
      `leitura` "does not change on hover and has no error". The precedence is `disabled` over
      `readonly` over `invalid`.

3. **The counter is text.** `counter` is shown as it comes, such as `0/280`, as the `counter` of
   `nph-field` (P83): the piece counts nothing and does not know the format or the language of
   the count. The consumer writes it on `input`. There is no native `maxlength`, which would
   block typing; the evidence says a passed limit is warned with `state=erro` and the field
   message, "without blocking the typing". A text that is empty or only spaces turns it off. It
   is not part of the accessible description, as the support-line counter of P83. Discarded: a
   soft `maxlength` with a generated `{length}/{max}`, which invents a format and a language in
   the piece.

4. **The footer.** The actions are instances the consumer chooses (`nph-button`, `ghost` and
   `solid`, `size=default`), so they enter through the named slot `actions`, the only slot of the
   piece. There is no `footer` property: the footer is drawn when there is a counter or an action,
   inside the box, `space/stack` below the text — the bottom padding of the field is part of that
   distance — with the counter at the start and the actions at the end, `space/inline` apart. In
   `readonly`, the footer is not drawn even with content (the "Do not" of the evidence), and one
   `console.warn` in development says why, not repeated while it lasts. When the piece is
   disabled — by its attribute or by a fieldset — it writes `disabled` on each slotted element
   that has the property and gives back only what it turned on, also when the element leaves the
   slot: the additive rule of P83. As in `nph-field`, the owner and the forced `disabled` are
   shared by every instance, so an action moved to another textarea belongs to the new one, and a
   custom element defined after the render is synchronized when it upgrades.

5. **Growth and scroll.** The inner `<textarea>` is the scroll area: `box-sizing: border-box`,
   `min-block-size: layout/textarea-min-height`, `max-block-size: layout/textarea-max-height`,
   `overflow-y: auto` and `resize: none` (no handle). It grows with the text through
   `field-sizing: content`. The box draws the border and does not clip, so the focus halo, drawn
   on `.control::after` as in `nph-input`, stays outside the clipping, as the evidence asks.
   Discarded for v1: measuring `scrollHeight` in JavaScript on every `input`.

6. **Measures the evidence does not give.** The padding is `space/control-padding` on the sides,
   as `nph-input`, and `space/inline` at the top and bottom: 76 = 3 × 20 (`text/body-md`) + 2 × 8,
   which is what the `use` of `layout/textarea-min-height` describes, "room for the text lines
   plus the padding of the field". The default width is `layout/input-width`, with no minimum; the
   parent stretches it, as `nph-field` does. These are D-1 and D-4 of DSA-38.

7. **No invalid input that draws nothing.** The piece has no enumerated property, so the P21
   rule has no case here and there is no `data-nph-rendered`. A field with no accessible name and
   a footer in `readonly` render and warn once each in development.

**Known limits.**

- **`field-sizing` is recent.** A browser without it keeps the field at
  `layout/textarea-min-height` and scrolls inside: the text is never cut and the field never
  passes the maximum, but it does not grow.
- **Forced colors and right-to-left are not treated yet**, as in P80.
- **A disabled action fades twice.** The piece is at `state/disabled-opacity` and each
  `nph-button` it disables takes its own disabled opacity, so the action reads fainter than the
  field. P83 avoided that sum in `nph-field`; here the evidence asks for both the faded piece and
  the disabled actions, and the sum waits for Indiane (D-5 of DSA-38).

**Points for review.**

- **The two divergences from P80**: Enter writes a line, and `readonly` exists.
- **`counter` as a text**, with no count and no `maxlength`.
- **The `actions` slot and no `footer` property**, the footer on by its content.
- **`field-sizing: content`** for the growth, and its limit.
- **The padding and the width** (D-1, D-4), the focus in `readonly` (D-2), the arrangement of
  the footer (D-3) and the opacity of a disabled action (D-5), which wait for Indiane.

**Source.** Frame `nph-textarea` (`1632:24`), documentation `1922:642` and set `1632:22` of the
Figma file `DS-IA-NEPHOS 5.0`, accepted by Indiane on 16/10/2026, with the Figma UX QA and the
textual audit approved. The mapping of the properties, the `actions` slot, `counter` as a text,
the readonly rules, the growth through `field-sizing` and the padding are a technical proposal of
this implementation, approved with the plan by Elvys on 23/10/2026.

**Out of scope.** A resize handle, `rows`, `maxlength`, `minlength`, `autocomplete`, a size and
motion. The count of characters, which belongs to the consumer. The Usage section of the page
(P70, DSA-35), the page lists read from the Metadata (P71, DSA-34) and the accessibility gate
(P72, DSA-32).

**Status.** Anatomy and behavior accepted by Indiane on 16/10/2026. API and semantics are reviewed

---

## P91 — `nph-select` and `nph-option`: API and semantics

**Decision.** `nph-select` is a Web Component with **open Shadow DOM** (P01), CSS in its own file
imported `?inline`, form-associated in the pattern of `nph-input` (P80) and a control of the field
contract (P83). Its options are `nph-option`, a second Web Component with open Shadow DOM, children
of the select in the light DOM, as `<option>` is a child of `<select>`. Neither has a `::part`, an
`nph-*` event or a color property. Anatomy only through semantic tokens. Invalid input renders
nothing and emits `console.error` only in development, one per cause — the rule of P21, adopted
here as in P80. The names follow P64.

1. **Two tags, two folders.** The option is shared: the list of `nph-combobox` (DSA-46) and of
   `nph-multi-combobox` (DSA-31) reuse it. It lives in `src/components/nph-option/`, with its own
   sheet (`fichas/nph-option.md`) and its own package entry, because the build
   (`vite.config.lib.ts`), the manifest and `test:package` take one definition per folder, and
   P03 makes the tag the folder name. The public `@iatec/nephos/nph-option` entry is forced by
   that packaging, not a choice of API: the option never stands alone, and importing
   `nph-select` registers it. It has no Docs page of its own; its reading page is the one of
   `nph-select`, and its Validation is the `Option` story there.

2. **Properties of the select.** The Figma properties are `size`, `state`, `início`, `conteúdo`
   and `ícone início`.

   | Figma | API |
   |---|---|
   | `size` | `size`: `default` (default) or `large`, reflected |
   | `state` `erro` | `invalid`, boolean, reflected (P83) |
   | `state` `disabled` | `disabled`, boolean, reflected; a disabled `<fieldset>` disables it too |
   | `state` `hover`, `foco`, `aberto`, `erro-foco` | not properties: CSS and `open` |
   | `aberto` | `open`, boolean, reflected |
   | `início` | `start`: `none` (default), `icon` or `avatar` |
   | `ícone início` | `icon`: a core name of `nph-icon`, default `globe` |
   | `conteúdo` | not a property: the placeholder with no choice, the chosen option with one |
   | the placeholder text | `placeholder` |
   | the value | `value` (P80) |
   | the form | `name` (reflected) and `required` (reflected) |
   | the field contract (P83) | `label` and `description`, text never visible |

3. **Properties of the option.** The Figma properties of `nph-select / opção` are `state`,
   `início`, `marcador`, `ícone`, `rótulo`, `texto secundário` and `secundário`.

   | Figma | API |
   |---|---|
   | `rótulo` | the text of the default slot |
   | `texto secundário` and `secundário` | `secondary`; empty turns it off |
   | `início` | `start`: `none` (default), `icon`, `avatar` or `dot` |
   | `ícone` | `icon`: a core name, default `globe`, with `start="icon"` |
   | the photo of the avatar | `src`, with `start="avatar"`; empty is the empty avatar |
   | the color of the dot | `status`: `neutral`, `info`, `warning`, `success`, `error` or `help`; absent, the text color (D6) |
   | `state` `disabled` | `disabled`, boolean, reflected |
   | `state` `selecionada` | `selected`, written by the owning list, not reflected |
   | `state` `hover` | `active`, written by the owning list, not reflected: the option the pointer or the keyboard is on (D5) |
   | the value | `value`, reflected; without the attribute, the label text with its white space collapsed, as in `<option>` |
   | `marcador` | always `marca` here; `checkbox` belongs to `nph-multi-combobox` (DSA-31) *(Amended by P96: `marker`, `check` by default or `checkbox`, reflected; the multi-combobox sets `checkbox` on its options)* |

   `start` is explicit and not derived from `icon`, `src` or `status`: the empty avatar and the
   dot with no state have no attribute that would reveal them. The option takes the role `option`,
   `aria-selected` and `aria-disabled` through `ElementInternals`, so it writes no attribute on its
   own host, and shows `selected` and `active` through `CustomStateSet` (`:state()`). The owning
   list learns that a property of an option changed through the exported symbol
   `NPH_OPTION_CHANGED`: a list implements a method under that symbol. The symbol is an export of
   the option module, for the lists that own options; the method is marked `@internal`, so it stays
   out of the manifest and is not API of the select. The text and the attributes of the options
   reach the list through a `MutationObserver`.

4. **The value.** The value follows P80: the `value` attribute is the default and the value of
   `form.reset()`, the property is the current value, and a dirty flag stops the attribute from
   applying. The chosen option is the first `nph-option` with valid input whose `value` equals
   the current value; an option with invalid input is never the chosen one.
   The value is kept until such an option arrives, so a framework may render the options after the
   value; with no option of that value, the trigger shows the placeholder and the form data leaves
   the entry out, as a radio group with nothing checked. `<nph-option selected>` is not an
   attribute and not the default of the reset: the default is the `value` attribute of the select.
   `required` with no choice, or with a chosen option of empty value, is `valueMissing`, as in the
   native select. Its message is the browser's, read from a `<select required>` that is never
   connected, so the piece does not know the language (P80). The anchor of the validity is the
   trigger. Enter does not submit the form: in a select-only combobox, Enter opens and chooses, as
   in the native `<select>`.

5. **Events.** The piece has no inner `<input>`, so the host fires `input` (`bubbles`, `composed`)
   and then `change` (`bubbles`) — P83, item 1 — only when the person chooses an option of a
   different value. The form data and the validity are up to date when they run. Choosing the
   option already chosen, Escape, Tab, a click outside, `value` and `open` set from code fire
   nothing. Opening and closing fire no event, as the `open` of the tooltip (P65, P77).

6. **The trigger and the keyboard.** The trigger is a `div` with role `combobox`, `tabindex="0"`,
   `aria-haspopup="listbox"`, `aria-expanded` and `aria-controls`, in the shadow root, with
   `delegatesFocus`: the select-only combobox pattern of the APG. The focus never leaves it; the
   active option is pointed to by `ariaActiveDescendantElement`, an element reference from the
   shadow root to an option of the outer light DOM, which is valid as the `ariaLabelledByElements`
   of P80. The keys are those of the APG: closed, Enter, Space, ArrowDown, ArrowUp and Alt+ArrowDown
   open on the chosen option, or on the first; Home and End open on the first and the last; a
   printable character opens on the option that starts with it. Open, the arrows move without
   wrapping; Home, End, PageUp and PageDown (ten options) jump; typing within 500 ms builds one
   search, and the same character typed again cycles through the options that start with it;
   Enter, Space and Alt+ArrowUp choose and close; Escape closes without choosing and stops there,
   so a dialog around the select stays open. **Tab closes without choosing**, and the focus moves
   on: the APG suggests that Tab chooses the active option, but a Tab that only passes through
   must not change the value or fire `change`. Disabled options and options with invalid input
   are skipped and cannot be chosen. The focus look shows on `:focus-visible` and while the list is
   open: a select has no caret to show where the focus is, as the input has.

7. **The list.** The list is internal: a `popover="manual"` in the shadow root, with role
   `listbox` and the slot of the options, in the top layer as the balloon of `nph-tooltip` (P77),
   with no `z-index` and no clipping by an ancestor. JavaScript places it `space/inline-tight`
   below the trigger (D1), with the width of the trigger, and follows the trigger on scroll —
   also inside shadow roots — and resize. When it does not fit below and fits above, it turns up,
   `space/inline-tight` above the trigger (D-2 of DSA-29, open). It fades in and slides
   `space/inline-tight` into place with `motion/enter-*`, and leaves with `motion/exit-*`; it leaves
   the top layer when the exit ends; with reduced motion, only the opacity moves (D2), in
   `motion/hover-duration` (100 ms, the rule of `design.md` 2g, as in `nph-tooltip`). A click
   during the exit chooses nothing: the list is already closed. The
   maximum height `layout/max-list-height` is on an inner box that scrolls, with the border outside
   it (D9); the active option scrolls into view without scrolling the page. A press outside the
   select, and the focus leaving it, close the list without choosing. A disabled select, one with
   invalid input or one with no option to choose does not open, also when `open` is set.

8. **Name and description.** As P80: the labels associated with the host name the trigger and the
   list by element reference; without one, `label` is their `aria-label`; with no name at all, the
   select renders and warns once in development, after the first frame. `description` sits in a
   clipped element referenced by `aria-describedby`. `static nphFieldRole` is absent: the select is
   a single control (P83).

9. **Invalid input.** On the select: a `size` outside the two, a `start` outside the three or an
   `icon` outside the core renders nothing, takes no space, leaves `data-nph-rendered` out,
   contributes nothing to the form and emits one `console.error` per cause. The magnifying glass
   as `icon` renders and emits one `console.warn` in development: search belongs to
   `nph-combobox`. On the option: a `start` outside the four, a `status` outside the six or an
   `icon` outside the core renders nothing and emits one `console.error` per cause.

**Known limits.**

- **The list does not shrink.** When it fits neither below nor above, it takes the side with
  more room and is held inside the window, over the trigger if needed.
- **An option outside a select** draws its looks but has no list around it; only the Validation
  and Docs pages do that, to show the option states side by side.
- **Forced colors and right-to-left** are not treated yet, as in P80.

**Points for review.**

- **The option as a second tag in a folder of its own**, forced by the packaging.
- **The symbol `NPH_OPTION_CHANGED`** as the contract between an option and its list, for
  `nph-combobox` and `nph-multi-combobox` to take.
- **Tab closes without choosing**, against the APG suggestion.
- **No choice leaves the entry out of the form data.**
- **The message of `valueMissing` from a disconnected native select.**
- **The list turns up near the bottom of the window** (D-2 of DSA-29, open with Indiane).

**Source.** Frame `nph-select` (`1357:160`), documentation `1452:448`, set `1357:115`, option
`1357:136` and list `1357:137` of the Figma file `DS-IA-NEPHOS 5.0`, accepted by Indiane on
14/10/2026, with the Figma UX QA and the textual audit approved, and D1 to D9 answered on
19/10/2026. The names `start`, `icon`, `open`, `secondary`, `status`, `selected` and `active`, the
second tag, the owner symbol, the value model, the events, the keyboard, the turned-up list and
the invalid input rules are a technical proposal of this implementation, approved with the plan
by Elvys on 23/10/2026.

**Out of scope.** Search, groups and multiple choice (`nph-combobox`, DSA-46;
`nph-multi-combobox`, DSA-31). The checkbox marker of the option *(brought by P96)*. A width property: the width is
`layout/input-width`. The Usage section of the page (P70, DSA-35), the page lists read from the
Metadata (P71, DSA-34) and the accessibility gate (P72, DSA-32).

**Status.** Anatomy and behavior accepted by Indiane on 14/10/2026. API and semantics are reviewed
in the pull request that brings them; the merge is the approval.

---

## P94 — `nph-slider`: API and semantics

**Decision.** `nph-slider` is a Web Component with **open Shadow DOM** (P01) and
`delegatesFocus`, CSS in its own file imported `?inline`, as in `nph-icon`. It has no slot, no
`::part`, no `nph-*` event and no color property. Anatomy only through semantic tokens. It is a
form control: it takes the form pattern of P80 and the field contract of P83, recording here only
what changes. Invalid input renders nothing and emits `console.error` only in development, one
per cause — the rule of P21, adopted here by its own decision, as in P66, P68, P80 and P90. The
names follow P64.

1. **Properties.** The Figma set has `orientacao`, `tipo` and `state`, and five Booleans for the
   optional parts. The mapping below is a technical proposal of this implementation.

   | Figma | API |
   |---|---|
   | `orientacao` | `orientation`: `horizontal` (default) or `vertical`, reflected: the internal CSS selects the parts by it |
   | `tipo` `simples`, `intervalo` | `mode`: `single` (default) or `range`, reflected. Not `type`, which in a form control is the native type |
   | `state` `erro` | `invalid`, Boolean, reflected: the `status/error` border and `aria-invalid` on each thumb |
   | `state` `disabled` | `disabled`, Boolean, reflected |
   | `state` `hover`, `foco`, `erro-foco` | not properties: interaction, drawn by the CSS and by the balloon |
   | `rótulo e valor` | `text`: the visible text of the `nph-label`, with the current value beside it. Empty turns the part off |
   | `mínimo e máximo` | `limits`, Boolean |
   | `marcas` | `marks`, Boolean: one label per step, from `min` to `max` (D4) |
   | `campo` | `inputs`, Boolean: one `nph-input` in `single`, one at each end in `range` |
   | `menos e mais` | `steppers`, Boolean, with `decrease-label` and `increase-label` as the accessible names of the buttons |
   | the value, the limits and the step (not properties in Figma) | `value` (`single`), `start` and `end` (`range`); `min` (0), `max` (100) and `step` (1) |
   | the name of each thumb in `intervalo` | `start-label` and `end-label` |
   | the field contract (P83) | `label`, `description`, `invalid`, `required` and `disabled` |
   | the form | `name`, reflected |

   `text` is a separate property from `label` because `label` is, in every form control, the
   accessible name in text that is never visible (P80, P83); the visible label of the slider is a
   part of its anatomy, off inside `nph-field`.

2. **Each thumb is an element of its own with `role="slider"`.** The value balloon is an
   `nph-tooltip` (evidence), and the tooltip attaches only to an element that receives focus and
   sits by the box of that element (P77). A native `<input type="range">` receives focus as the
   whole track, so its balloon would sit in the middle of the track and never follow the value; a
   native range the size of the thumb, moved to the value, would lose the hover of the tooltip.
   The thumb is the focusable element, the balloon sits above it, and a new value re-renders the
   tooltip, which places the balloon again. The keyboard, the pointer and the ARIA values are the
   piece's own, after the slider pattern of the WAI-ARIA Authoring Practices:
   - each thumb has `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-valuetext` (the
     number as the balloon shows it) and `aria-orientation`. In `range`, each thumb stops at the
     other, and its `aria-valuemin` or `aria-valuemax` is the value of the other thumb;
   - the arrows move one `step` (Right and Up raise); Page Up and Page Down move a tenth of the
     scale, rounded to the step and never less than one step; Home and End go to the bounds;
   - a press on the track or on a thumb moves the thumb (the nearest one, in `range`) to that
     point, focuses it and follows the drag, with the pointer captured by the track. The track
     lets the page scroll across it on touch;
   - every value is rounded to the step and kept inside the scale, as the native range does; the
     highest value is the last step at or below `max`;
   - the balloon opens by the rules of the tooltip (hover and keyboard focus) and stays open while
     a thumb is dragged; the slider turns it on and off only for the drag. It is not drawn when the
     slider is disabled.

   The touch target is a circle of `control/height-large` around the drawn thumb, a
   pseudo-element; the focus halo is another, outside the border.

3. **Values and form.** As in P80, the `value`, `start` and `end` attributes are the defaults and
   the values of `form.reset()`; the properties are the current values; the attributes apply
   only while the person has not moved the slider and setting a property has not made it dirty.
   The default of `value` is the middle of the scale, as the native range; `start` and `end`
   start at the ends. `single` contributes `name=value`; `range` contributes two entries under
   the same name, start and end, through a `FormData`, and its restore state is the text
   `"start end"`. A slider always has a value, so it has no validity and blocks no submission;
   `required` exists only because `nph-field` writes it (P83), has no effect and does not become
   `aria-required`, which `slider` does not support. A disabled `<fieldset>` disables it, except
   in its first `<legend>`, as P80 reads it.

4. **Events.** The native `input` and `change`, with no inner native control behind them: the
   host fires `input` (bubbles, composed) and then `change` (bubbles), as the browser does for a
   range. A key and a click on minus or plus fire both; a drag fires `input` at each new value and
   `change` on release, only when the value changed. The `input` of an inner `nph-input` (the
   person typing) stops inside the slider; the field applies the number on Enter, which the slider
   handles because the inner field has no form in its root, and on its `change` (leaving it), rounded and kept inside the bounds of its thumb, and a text that is not a number
   goes back to the current value. Setting a value from code fires nothing.

5. **Accessible name and description.** As in P80: the labels associated with the host
   (`nph-label for`, a `label`, or `nph-field`), referenced through `ariaLabelledByElements`; then
   `label`; then `text`. In `single` the name goes on the thumb. In `range` it goes on an inner
   group (`role="group"`) around the two thumbs, and each thumb takes `start-label` or
   `end-label`. `description` is read as the description of each thumb, from a clipped span the
   thumbs reference; the balloon adds itself to the same description, repeating the value. A
   slider with no name renders and warns once in development; a `range` without `start-label` and
   `end-label` renders and warns once. The number is written with `Intl.NumberFormat` in the
   `lang` of the closest ancestor, with the digits of `min` and `step`; there is no unit, which
   belongs to the text of the label. `focus()` and a click on an associated label reach the first
   thumb, even when a field or the minus button comes before it: `focus()` is overridden, and the
   first thumb carries `autofocus`, the focus delegate of `delegatesFocus`, which takes no focus
   on page load from inside a shadow root. An inner field takes the name of the slider (in
   `single`, also the text of the associated labels, since it sits in another root) and its
   `description`. The names are synced after every render, so a new `label`, `text` or mode
   renames the thumbs at once.

6. **Parts and composition.** The parts beside the track, from left to right:
   `[start field] [minus] [minimum] track [maximum] [plus] [end field]` (D1); in `single`, the
   only field is at the end. They sit at `space/inline` from each other and from the track. A
   field shares the line with the track, one part for the field and three for the track (D5): the
   evidence gives it no width of its own. In the vertical orientation the track takes
   `layout/input-width` of height (D3), the maximum is at the top and the minimum at the bottom,
   and only `text` and `limits` exist. Minus and plus are
   icon-only `nph-button` (`secondary`, `ghost`, `default`, `minus` and `plus`), named by
   `decrease-label` and `increase-label` and shown in their built-in tooltip (P86), and move by
   one step the thumb used last, the start one by default (D2). `nph-label` has no Shadow DOM
   (P62.1), so the slider adopts its CSS in its shadow root, as `nph-field` does.

7. **Disabled.** The whole slider at `state/disabled-opacity`, once: the thumbs leave the Tab
   order and take `aria-disabled`, the balloon is not drawn, keys, the pointer and the buttons do
   nothing, and the look of the error goes away. The inner `nph-input` and `nph-button` become
   `inert` and are not disabled, so they keep `state=default`, as the evidence draws them, and do
   not fade a second time; an inert button opens no tooltip.

8. **Invalid input.** An `orientation` or a `mode` outside its values, a `min` that is not below
   `max`, and a `step` that is not a positive number render nothing, with one `console.error` per
   cause. `marks`, `inputs` or `steppers` in the vertical orientation, `steppers` without its two
   names, and `marks` on a scale of more than 100 steps, are not drawn, with one error each; the
   rest renders. The limit of 100 marks keeps the labels readable and the render from blocking
   the page; it does not change the step. `limits` with `marks`, and
   `text` inside `nph-field`, render and warn once (the Do not list of the evidence).

**What is not decided here and stays as a known limit.** Forced colors and right-to-left, as in
every piece. Moving the value by the swipe gesture of a mobile screen reader depends on the
browser sending the arrow keys to an ARIA `slider`. A unit or a custom format for the number, a
vertical length of its own and a width of its own for the field are not in v1.

**Points for review.**
- **The thumbs as ARIA sliders, not native ranges**, so the balloon can follow the value (item
  2).
- **`mode` and `text`**, and not `type` and a second meaning for `label` (item 1).
- **Two entries under the same name in `range`** (item 3).
- **The balloon repeats the value in the description**, already given by `aria-valuetext`
  (item 5).
- **The inner field and buttons inert, not disabled, when the slider is disabled** (item 7).
- **D1 to D5** are defaults of this implementation, provisional until Indiane answers them: the
  order of the side parts, the thumb that minus and plus move in `range`, the vertical length,
  one mark per step and the width of the field.

**Source.** Board `nph-slider` (`1636:46`), frame `Documentação` (`1925:642`) and set `1636:44`
of the Figma file `DS-IA-NEPHOS 5.0`, accepted by Indiane on 15/10/2026, with the Figma UX QA and
the textual audit approved. The names, the ARIA thumbs, the form entries, the events, the
precedence of the name, the inert inner parts and the invalid input rules are a technical
proposal of this implementation, approved with the plan by Elvys on 23/10/2026.

**Out of scope.** A progress bar, which is not operated. A size property. A tooltip of its own.
More than two thumbs. The Usage section of the page (P70, DSA-35), the page lists read from the
Metadata (P71, DSA-34) and the accessibility gate (P72, DSA-32).

**Status.** Anatomy and behavior accepted by Indiane on 15/10/2026. API and semantics are reviewed
in the pull request that brings them; the merge is the approval.

---

## P92 — `nph-dropdown-menu`: API and semantics

**Technical conflict.** The accepted board (`1365:118`) gives the menu, the item and its parts,
with their tokens, and leaves "opening, closing and keyboard" to code. The item, the group label,
the separator and the profile header are parts of one Figma component; the package takes one
custom element definition per folder (`vite.config.lib.ts`, `scripts/test-package.mjs`, P91).

**Decision.**

1. **One tag; the item is data.** The menu is the only element. Its items, group labels and
   separators are entries of `items`, and the profile header is `header`; everything is drawn in
   the shadow root of the menu, so every ARIA reference stays in one root. Unlike `nph-option`,
   which three lists share (P91), the item is used only by this menu (evidence, Relations), so it
   gets no folder, no package entry and no tag of its own.
2. **API: six properties, one event.**

   | Property | Role |
   |---|---|
   | `for` | String, reflected. The `id` of the element that opens the menu, looked up in the **same root**, as `nph-tooltip` (P77). The menu writes `aria-haspopup="menu"` (only when absent) and `aria-expanded` on it |
   | `open` | Boolean, reflected. The state; the menu turns it on and off, and the consumer may set it |
   | `items` | Property only. The entries: an item (`value`, `text`, and optionally `description`, `icon`, `avatar`, `severity`, `selection`, `switch`, `checked`, `shortcut`, `count`, `tag`, `submenu`, `disabled`, `loading`), a `label` and a `separator` |
   | `header` | Property only. `{ name, status, src }` or `null` (the Figma `cabeçalho`) |
   | `size` | `default` or `compact`, reflected. The Figma `tamanho` of the item, set on the whole menu: a dense list is dense as a whole, and the evidence has no case of mixed sizes |
   | `label` | The accessible name of the menu; empty, the trigger names it |

   The event `nph-item-select` bubbles and is not composed, with `detail: { value, checked }`:
   `checked` is the new state of a single choice, a multiple choice or a switch, and `null` on a
   common item. It fires only when the person activates an item, also on a single choice that was
   already checked. After an activation, the menu replaces `items` with a new list carrying the new
   `checked`; the objects of the consumer are never changed.
3. **Groups.** A `label` opens a group and names it; a `separator` closes it; items before the first
   label, or after a separator with no label, form a group with no name. A group with no item is
   dropped and its separator goes to the next group. Single choice is exclusive inside its group.
4. **Semantics.** The panel is a `popover="manual"` (top layer, as P77 and P91). Inside, a
   `role="menu"`; every group is a `role="group"`, labelled by its label when it has one (the
   `nph-separator` is hidden from the accessibility tree, so the group carries the split); the profile header sits
   outside the menu, as informative text. A common item is `menuitem`, a single choice
   `menuitemradio`, a multiple choice and a switch `menuitemcheckbox`, with `aria-checked`. The name
   of an item is its text (`aria-labelledby`); `aria-describedby` lists the description, the tag,
   the counter and the shortcut, in that order. The inner `nph-checkbox` and `nph-switch` are
   `inert`: the item carries role, state and focus, so there is no interactive element inside
   another, and a press on the box or the track activates the item. They never take `disabled`:
   the item already paints `state/disabled-opacity` on the row.
5. **Keyboard and pointer.** The menu button pattern of the APG. On the trigger, a click toggles;
   Enter and Space (as its click) and ↓ open on the first item, ↑ on the last. In the menu, the
   focus moves between the items (each `tabindex="-1"`): ↓ and ↑ with wrap, Home, End, and a typed
   character to the next item that starts with it. Enter and Space activate, Space also right after a
   typed character. A common item and a
   single choice close the menu and give the focus back to the trigger; a multiple choice and a
   switch keep it open. A disabled or loading item takes the focus and does not activate (APG). Esc,
   listened to on the document in the capture phase only while open, closes, gives the focus back
   when it was in the menu and stops the key, so a dialog around does not close with it (P77 item
   4). Tab and Shift+Tab close the menu and move on from the trigger, wherever the menu sits in the DOM:
   the focus goes back to the trigger before the default action. A press outside the menu and its trigger closes it
   without moving the focus; a press on the trigger while open closes it, and does not open it again.
   Hover only paints (D-6). A trigger that is disabled, `aria-disabled` or an `nph-button` in `loading`
   opens nothing, by click or by key; a press on it still closes an open menu, except on an `nph-button`
   that went into `loading` while the menu was open (see the known limits).
6. **Placement and motion.** `space/inline-tight` below the trigger (D-1, as the list of
   `nph-select`), aligned to its start edge; it turns up when it does not fit below and fits above,
   never leaves the window and follows the trigger on scroll and resize, also a trigger set by `for` while
   open, and its own size: content that changes while open places it again. `layout/input-width` is the
   preferred width: a narrower window, or a larger font, holds the panel inside it. Only a menu taller
   than the room scrolls inside. `open` set before the trigger exists waits for the lookup. Opening fades in and slides `space/inline-tight` on `motion/enter-*`,
   closing on `motion/exit-*`, as the list of `nph-select` (D-2); under reduced motion, opacity only
   on `motion/hover-duration`.
7. **Solid icon on hover.** On the hover of a `default` item, the start icon and the submenu arrow
   swap to their solid twin in `dropdown/item-hover-icon-foreground` (rule of 21/10/2026); two
   `nph-icon` per place, the CSS shows one, as P88. The destructive item keeps its light icon in
   `color/destructive-on-surface`.
8. **Loading.** The `nph-spinner` sm takes the end of the item, in place of shortcut, counter, tag,
   switch, arrow and check; the item is `aria-busy`.
9. **Invalid input** follows P21: `for` empty or matching no element in the same root after one
   frame, no valid item, and a `size` outside the two draw nothing and emit `console.error` in
   development. An invalid entry (no `value`, no `text`, an unknown `severity` or `selection`, a
   switch with a selection, a submenu with a switch or a selection) is left out, one error per cause.

**Known limits.**

- **The inner box and track do not take their own hover** on item hover (D-3): `nph-checkbox` and
  `nph-switch` hover only through `:hover` in their own shadow root. A follow-up task gives them a
  way.
- **`aria-haspopup` and `aria-expanded` on an `nph-button`** sit on its host and do not reach its
  inner `<button>`, which has the focus. With a native `<button>` as the trigger they work.
- **A trigger that changes its `id`, or moves, after the lookup** is not followed; setting `for`
  again looks it up.
- **The focus halo is cut by 1 px on the sides when the panel scrolls**: the border and the halo
  reach 5 px outside the row and the panel padding is 4. The halo is decorative.
- **Opened by a mouse click, the first item has the focus but does not show it.** That is the
  `:focus-visible` behavior of Chromium, which the tests prove; other engines may differ.
- **Forced colors and right-to-left** are not treated yet, as in P80.
- **An `nph-button` that goes into `loading` while the menu is open** does not close it by a press:
  the button blocks its own click before the menu hears it. Esc, Tab and a press outside still close
  it. Follow-up: close on the `pointerdown` of an inactive trigger (last Copilot round of PR #118).
- **A trigger clipped by a scrolling ancestor**, while its box is still inside the window, keeps the
  menu drawn next to it: the visibility check reads the window only. Follow-up: hide or close the
  panel when the trigger has no visible intersection with its clipping ancestors (last Copilot round
  of PR #118).
- **The accessibility gate (P72) leaves out `label-content-name-mismatch`** in the stories that show
  a shortcut, a counter, a description or a tag: axe wants the visible text of the item inside its
  name, and Understanding WCAG 2.5.3 counts those four as supplementary text, outside the label.
  The exception is recorded in `nph-dropdown-menu.demo.ts`; decided by Elvys on 27/10/2026
  (DSA-32).

**Points for review.**

- **The item as data**, not as a tag.
- **`size` on the menu**, not on the item.
- **The event `nph-item-select`**, and that it fires again on a checked single choice.
- **`inert` on the inner pieces.**

**Source.** Board `nph-dropdown-menu` (`1365:118`), documentation `2365:3685`, menu `1365:63`, item
set `1365:57` and parts `1365:58`, `1365:60` and `2359:47364` of the Figma file `DS-IA-NEPHOS 5.0`,
accepted by Indiane on 21/10/2026 with the Figma UX QA and the textual audit approved, and the solid
icon rule of the same day. The names, the data model, the event, the keyboard, the placement and the
invalid input rules are a technical proposal of this implementation, approved with the plan by Elvys
on 23/10/2026.

**Out of scope.** A nested menu (the submenu item draws the arrow and activates as a common item). An
item with a link. A context menu. The Usage section of the page (P70, DSA-35), the page lists read
from the Metadata (P71, DSA-34) and the accessibility gate (P72, DSA-32).

**Status.** Anatomy and behavior accepted by Indiane on 21/10/2026. API and semantics are reviewed in
the pull request that brings them; the merge is the approval.

---

## P97 — `nph-table`: API and semantics

**Decision.** `nph-table` is a Web Component with **open Shadow DOM** (P01), CSS in its own file
imported `?inline`. Its data comes by property and it draws a native `<table>` in its own shadow
root. It has no `::part` and no color property. Anatomy only through semantic tokens. Invalid
input renders nothing, or leaves out the part that is invalid, and emits `console.error` only in
development, one per cause — the rule of P21, adopted here by its own decision, as in P66, P74
and P90. The names follow P64.

1. **One tag, data by property.** The Figma parts — header, cell, composite cell, footer, empty
   body, chevron, tree cell and expanded item — are inner parts, not tags. The build, the
   manifest and `test:package` take one definition per component folder (P91, item 1), and a
   tag per part would make each one a public piece. So the table takes `columns`, `rows` and
   `footer` as properties (`attribute: false`) and draws `thead`, `tbody` and `tfoot` with `th`
   and `scope` in its shadow root: the native table semantics, and every reference between parts
   (`aria-labelledby`, `aria-describedby`, `aria-controls`, the `for` of the tooltip) in one
   root. In plain HTML the consumer fills them by JavaScript, as `.value` on many controls; Lit,
   Vue, Angular and React 19 pass properties. The alternatives were a table of the consumer in
   the light DOM, styled from outside — a second exception to P01, which P62.1 says is not a
   precedent — and child tags per part, which change `test:package` and the list of pieces.

2. **Properties.** The Figma properties of the set are `size`, `moldura`, `cabeçalho fixo` and
   `foco`; of the cell, `conteúdo`, `estado`, `grade` and `alinhamento`; and the caption options
   `legenda`, `descrição` and `total`.

   | Figma | API |
   |---|---|
   | `size` | `size`: `default` (default) or `large`, reflected |
   | `moldura` | `framed`, boolean, reflected |
   | `cabeçalho fixo` | `sticky-header` (`stickyHeader`), boolean, reflected |
   | `foco` | not a property: the `:focus-visible` of the scroll area |
   | `estado` `faixa` | `striped`, boolean, reflected, on the table |
   | `estado` `hover` | not a property: the `:hover` of the row |
   | `grade` | `grid`, boolean, reflected, on the table |
   | `alinhamento` | `align` of the column: `start` (default) or `end` |
   | `legenda`, `texto da legenda` | `caption` |
   | `descrição`, `texto da descrição` | `description` |
   | `total` | `total` |
   | `conteúdo` | the `type` of a composite cell (item 4) |
   | the name of a table without a caption | `label` |
   | what the dash is read as | `no-value-label` (`noValueLabel`) |
   | the empty body | `empty-heading` and `empty-description`, passed to the `nph-empty` |
   | the main action of the caption | the slot `action`, at `table/caption-action-gap` |

   The stripe and the grid are of the whole table: in Figma they are states of the cell, but a
   table with the stripe on some rows only, or the grid on some cells only, has no case in the
   evidence. The stripe counts only the rows of data, by a class the render sets; an expanded item
   does not shift it. `align` takes the logical `start` and `end`, which match `text-align` and the
   reading direction, and not `left` and `right`.

3. **Columns and the two-level header.** A column is `{ key, header, align?, group?, width? }`.
   `key` is unique and finds the cell in each row and the value in `footer`. `end` aligns the
   column, its header and its footer to the end, with tabular figures (`design.md`: a number in a
   table is `tnum`). Neighbor columns with the same `group` get the group title above them, a
   `th` with `scope="colgroup"` over a `colgroup` of those columns, in the same header piece; the
   other columns take both header rows. `width` is the content width of the column, a CSS length
   given in use (the evidence: the column width is set in use).

4. **Cells.** A row is `{ key, cells, detail?, children?, open?, loading?, toggleLabel? }`, and
   `cells` maps a column key to a cell. A string or a number is text. `null`, `undefined` or an
   empty string is the no-value dash, `—`, hidden from the screen reader, with `no-value-label`
   read in its place: the piece never leaves a cell empty. An object with `type` is a composite
   cell:

   | `conteúdo` | `type` | Piece |
   |---|---|---|
   | `duas linhas` | `text` with `secondary` | the second line in `table/muted-foreground` |
   | `pessoa` | `person` | `nph-avatar` md, decorative, with the name beside it |
   | `selo` | `badge` | `nph-badge` light, with `severity` |
   | `ícone e texto` | `icon-text` | `nph-icon` of the core |
   | `miniatura` | `thumbnail` | `nph-image` sm |
   | `link` | `link` | `<a>` underlined in `table/link-foreground`; only an `http`, `https`, `mailto` or `tel` address, a path or a fragment |
   | `texto cortado` | `truncated` | the focusable cell and an `nph-tooltip` (below) |
   | `status` | `status` | `circle-check` or `circle-xmark` in `table/status-*-icon`, with the name |
   | `botão` | `button` | `nph-button` secondary solid compact |
   | `ações` | `actions` | Edit (`pen-to-square`) and more (`ellipsis-vertical`), icon-only `nph-button` secondary ghost default |
   | `ações mistas` | `mixed-actions` | written Edit and more, `nph-button` secondary solid compact |
   | `avaliação` | `rating` | one solid `star` in `table/rating-foreground` and the score |
   | `carregando` | `loading` | `nph-skeleton` line; the cell carries `aria-busy="true"` while it loads |

   The names of the icon-only buttons and of the chevron come per row from the data
   (`editLabel`, `moreLabel`, `toggleLabel`), already localized: the piece does not know the
   language. The icons of the cell take `table/icon-size`, bridged to the `icon/size-sm` that
   `nph-icon` reads. The thumbnail and the photo of the expanded item take
   `table/thumbnail-size`, `table/thumbnail-size-large`, `table/thumbnail-radius` and
   `table/muted-background` **through** `nph-image` `sm` and `lg`: their tokens are the same
   aliases (`image/size-sm`, `image/size-lg`, `radius/inner`, `color/muted`), so the table does
   not consume those four directly, and the border of the photo is a rule of `nph-image` itself
   (P90). The truncated text is cut with an ellipsis at the column `width`; the cell takes
   `tabindex="0"` and an `nph-tooltip` with the whole text and `relation="name"` (P77). The text in
   the DOM is already the whole text, so the name does not change and is read once. The `secondary`
   of the icon-only actions is a reading of the evidence, which says only ghost and light compact.

5. **Expanding row and tree.** A row with `detail` (`name`, `description`, `src`, `alt`,
   `values` with `label` and `value`, `badge`) opens the expanded item in a row under it, a cell
   that spans the table: the photo `nph-image` lg, the name, the description, each value with its
   label on top (`dl`), and an `nph-badge` light. When any row has a `detail`, a first column holds
   the chevron (the part `corpo`); its header is an empty cell (the part `cabeçalho`) and a row
   without detail keeps it empty (the part `recuo`). A row with `children` opens the next level of
   a tree, up to three levels; its chevron sits in the first cell, each level indents by
   `table/expand-indent` plus `table/cell-gap`, and a row without children keeps the space of the
   chevron, so the text aligns. The chevron is the icon-only `nph-button` secondary ghost compact,
   `chevron-right` when closed and `chevron-down` when open, named by `toggleLabel`; `loading` on
   the row makes it the `loading` button, whose click does not reach the table. `open` on the row
   is the state. A click on the chevron replaces `rows` with a new list in which only that row has
   the new `open` — the object of the consumer is not changed — and fires `nph-row-toggle`, so
   `rows` is always the state, as the `items` of `nph-dropdown-menu` (P92).
   The rows are drawn keyed by `key`, and the cells by the column `key`, so a row or a cell keeps
   its elements, and the focus on its buttons, when rows or columns come in or leave before it, as
   when the children of a level arrive.

6. **Name, focus and scroll.** The caption, when there is one, sits above the table at
   `table/stack-gap`, with the title, the description up to `table/caption-max-width`, the total
   as an `nph-badge` secondary and the slot `action`. The caption title names the table
   (`aria-labelledby`) and the description describes it (`aria-describedby`): "the caption is the
   title of the table". A native `<caption>` was discarded: it would sit inside the scroll area and
   the frame, and the name would add the description and the total. Without a caption, `label` is
   `aria-label`; with neither, the table renders and warns once in development, as P80 does for a
   name that can arrive later. The table sits in a scroll area that scrolls both ways, up to
   `table/max-width`; with `sticky-header` it stops at `table/body-max-height`. While it overflows,
   measured with a `ResizeObserver`, the area takes `tabindex="0"`, `role="region"` and the name
   of the table, so the keyboard can scroll it; when it fits, it is not a stop of the Tab order. The
   scroll area and the truncated text take the ring `focus/border` in `table/focus-ring-width`
   (the evidence); the chevron, the buttons and the more keep the focus of their own piece. The
   scrollbar takes `table/scrollbar-*` through `::-webkit-scrollbar`, and only the colors where
   that is not supported, as `src/styles/scrollbar.css`.

7. **Fixed header and borders.** The table uses `border-collapse: separate` with no spacing, and
   draws the row divider on the cells: with collapsed borders the line of a sticky header does not
   stay. With `sticky-header`, the `thead` sticks to the top of the scroll area over the body
   (`z-index: 1`), and its cells draw the line `table/sticky-divider-*` as a `box-shadow` in place
   of their divider. A cell boundary at a fractional pixel leaves a seam between two cell
   backgrounds; every cell after the first casts its own background a hairline
   (`table/border-width`) to its inline start, so a row reads as one band in both schemes.

8. **Events.** `nph-row-action` (`{ row, action }`) when the person activates a button of a cell:
   `action` is the one of a `button` cell, or `edit` and `more` of the actions. `nph-row-toggle`
   (`{ row, open }`) when the person opens or closes a row. Both bubble, are not composed, are
   declared in `HTMLElementEventMap` with keys of their own (no other piece declares them), and
   code never fires them. The link navigates as a link. The more fires `nph-row-action` with `more`;
   wiring the `nph-dropdown-menu` (P92), merged while this decision was in review, is a follow-up.

9. **Invalid input.** A `size` outside the two, no column, a column without `key` or `header`, a
   repeated `key` or an `align` outside the two renders nothing, takes no space, leaves
   `data-nph-rendered` out and emits one `console.error` per cause. A row without `key` or with a
   repeated one, with both `detail` and `children`, with children at the third level, a row that
   opens without `toggleLabel`, a detail without `name` or with a badge severity outside the list
   is left out, with its descendants, and shapes nothing: the chevron column and the tree come
   from the valid rows only, closed levels included. A cell with a `type` outside the list or without the fields it needs (text, `href`,
   `action`, the button names), with a badge severity, a status or an icon outside the lists, or a
   link whose `href`, parsed as the browser parses it, takes another protocol (`javascript:`,
   `data:`), is drawn blank. No row and no `empty-heading` draws the body blank. Each cause is reported once per
   instance. A no-value cell without `no-value-label` and a truncated cell in a column without
   `width` render and warn once in development.

**Known limits.**

- **The open state of the chevron is on the host of its `nph-button`.** `aria-expanded` and
  `aria-controls` are written on the `nph-button` element, but the focus is on its inner native
  button, which `nph-button` does not let carry them (the same limit as the trigger of
  `nph-dropdown-menu`, P92). A screen reader may not announce open or closed until `nph-button`
  passes them on; the chevron icon and the row that appears carry the change. Follow-up in
  `nph-button`.
- **`aria-level` on a row outside a `treegrid`.** ARIA 1.2 gives `aria-level` to a row inside a
  `treegrid`; the table is not an interactive grid (the evidence: it reads, it does not operate),
  so the level is written on the `<tr>` and its support by screen readers varies. The
  accessibility gate (P72) flags it; the stories that draw a tree carry an exception decided by
  Elvys on 27/10/2026 (DSA-32), and the move to `role="treegrid"` with the APG keyboard is
  DSA-56. *Annotation of 28/10/2026:* P101 (DSA-56) makes the table that draws a tree a
  `treegrid`, so `aria-level` is on a row of a `treegrid`, and the exception is gone from the
  stories. In the tree, the row also carries `aria-expanded`; the next limit stays for the
  expanding row of a flat table.
- **The category content** of the cell is listed in the evidence but not described (D1 of
  DSA-49): there is no `category` type yet. The required example of items grouped by category
  shows the groups as the first level of the tree, open, with the total in the footer.
- **Typography the evidence does not name** (D2): the caption title takes `text/heading-sm`, the
  description `text/body-md` in `table/caption-foreground`, the second line and the labels of the
  expanded item `text/body-sm`. The header and the footer are `text/heading-xs` (the evidence) and
  the cell `text/body-md` (`design.md`).
- **The thumbnail without a photo** shows the empty frame of `nph-image`, not the `image` icon,
  which is not in the core (D3).
- **Glyphs and emphasis** chosen until the design owner answers: `pen-to-square` for Edit (D4),
  `circle-check` and `circle-xmark` for the status (D5), one solid star (D6), the total in the
  default `solid` emphasis (D7).
- **`design.md` has no usage entry for the `table/*` tokens** (D8); the component consumes them
  either way.
- **The fixed header** stops the scroll area, header included, at `table/body-max-height`.
- **A truncated cell in the first column of a number tree.** In a tree whose first column has
  `align: 'end'`, a `truncated` cell keeps its text next to the chevron when the cell has room
  to spare: the rule that sends the value to the end takes the last child of the tree cell,
  which there is the tooltip and not the text. Found in the sixth Copilot review of the pull
  request; the fix (the margin on the second child) is a follow-up.
- **Forced colors and right-to-left** are not treated yet, as in P80.

**Points for review.**

- **Data by property and one tag**, forced by the packaging.
- **`striped` and `grid` on the table**, not per cell.
- **`start` and `end`** in place of the Figma `esquerda` and `direita`.
- **`secondary` as the severity** of the ghost and solid buttons of the actions and of the chevron.
- **The slot `action`**, the first slot of the wave, justified by `table/caption-action-gap`.
- **The scroll area as a region only while it overflows.**
- **`aria-level` on a row outside a `treegrid`**, and `aria-expanded` on the host of the chevron.
  *Annotation of 28/10/2026:* the level is now on a row of a `treegrid` (P101).
- **`rows` replaced on open**, so the state lives in the data.
- **The hairline cover against the seam between cell backgrounds.**

**Source.** Board `nph-table` (`1370:113`), frame `Documentação` (`2584:66651`) and the parts
`1370:19`, `1370:20`, `2425:1032`, `2425:1033`, `2425:1046`, `2571:66334`, `2571:66335` and
`2571:66336` of the Figma file `DS-IA-NEPHOS 5.0`, accepted by Indiane on 23/10/2026, with the
Figma UX QA and the textual audit approved; the fixed-header line on `color/border` decided on
25/10/2026. The data by property, the names, the cell types, the events, the caption as the name,
the scroll region, the open state in `rows` and the invalid input rules are a technical proposal
of this implementation, approved with the plan by Elvys on 26/10/2026.

**Out of scope.** Sorting, selection, filtering and pagination (`nph-data-table`). The menu of the
more (a follow-up with the `nph-dropdown-menu`, P92). The category content (D1). An interactive grid (`treegrid` with
arrow keys) — *annotation of 28/10/2026:* P101 brings it for the tree only. Virtual scrolling. A free slot in the cell. The Usage section of the page (P70,
DSA-35), the page lists read from the Metadata (P71, DSA-34) and the accessibility gate (P72,
DSA-32).

**Status.** Anatomy and behavior accepted by Indiane on 23/10/2026. API and semantics are reviewed
in the pull request that brings them; the merge is the approval.

---

## P95 — `nph-combobox`: API and semantics

**Technical conflict.** The accepted board (`1359:142`) gives the field, the clear button, the
divider, the arrow area, the seven states of the list and the shortcuts footer, and leaves
filtering, keyboard, form value, events, the positioning of the list and the text of the clear
button to code. Two points of it cannot be met with the option model of P91, where the options are
`nph-option` children of the owner in the light DOM:

- the `busca` list draws the typed stretch of each option in `text/highlight-weight` and the rest
  in `color/muted-foreground`. The label of `nph-option` is the text of its slot, owned by the
  consumer; a substring of it can only be styled by changing the consumer's DOM or the option, and
  the CSS Custom Highlight API does not take `font-weight`;
- the `carregando`, `criar` and `vazio` lists and the groups are states of a search the consumer
  usually answers from a server, as a list it replaces.

**Decision.** `nph-combobox` is a Web Component with **open Shadow DOM** (P01), CSS in its own
file imported `?inline`, form-associated in the pattern of `nph-input` (P80) and a control of the
field contract (P83). It has no `::part` and no color property. Anatomy only through semantic
tokens. Invalid input renders nothing and emits `console.error` only in development, one per
cause — the rule of P21, as in P80. The names follow P64.

1. **The options are data; each is drawn as an `nph-option`.** `options` takes the entries, as
   the `items` of `nph-dropdown-menu` (P92): an option `{ value, text, secondary, start, icon, src,
   status, disabled }`, a group label `{ type: 'label', text }` and a separator
   `{ type: 'separator' }`. The combobox draws each option as an `nph-option` in its own shadow
   root, with the typed stretch in a `match` span and the rest in `rest` spans as the slotted label;
   both spans live in the combobox's tree, so its CSS reaches them. The option is reused, not
   copied: start, dot, secondary text, the selected and the active looks are its own. An invalid
   entry is left out, with one error per cause; its `start`, `icon` and `status` follow
   `nph-option`.

2. **The list is a module another field takes.** `nph-combobox.list.ts` (with
   `nph-combobox.list.css`) exports the entry types, the search, the groups, the highlight, the
   drawing of an option, a group and the create row, and the style of the list, in the precedent
   of `nph-icon.icons.ts`. `nph-multi-combobox` (DSA-31, D2) imports it; the library build puts
   the shared code in `dist/shared/`. It is not a tag: the field that owns the list draws it.

3. **Properties.**

   | Figma | API |
   |---|---|
   | `size` | `size`: `default` (default) or `large`, reflected |
   | `state` `erro` | `invalid`, boolean, reflected (P83) |
   | `state` `disabled` | `disabled`, boolean, reflected; a disabled `<fieldset>` disables it too |
   | `state` `hover`, `foco`, `aberto`, `erro-foco`, `foco-limpar` | not properties: CSS and `open` |
   | `aberto` | `open`, boolean, reflected |
   | `início` | `start`: `search` (default, the magnifying glass), `icon` or `avatar` |
   | `ícone início` | `icon`: a core name of `nph-icon`, default `globe` |
   | `conteúdo` | not a property: the placeholder, the chosen option or the typed text (`query`) |
   | `valor` | the text of the chosen option; `value` is its value (P80, P91) |
   | `limpar` | `clearable`, with `clear-label` as the accessible name of the button |
   | list `resultados`, `busca`, `status`, `grupos` | `options` and the typed text |
   | list `carregando` | `loading`, with `loading-label` as the name of the `nph-spinner` |
   | list `criar` | `creatable`, with `create-label`, the words before the typed text |
   | list `vazio` | `empty-heading` and `empty-description`, the texts of the `nph-empty` |
   | list `atalhos` | the `shortcuts` slot |
   | the search | `filter`: `contains` (default) or `none`, the consumer filters |
   | the form | `name` (reflected), `required`, `placeholder`, `label` and `description` |

   `query` is the typed text; setting it from code writes it in the field and filters the list,
   and fires nothing. `clearable` without `clear-label`, `creatable` without `create-label` and
   `loading` without `loading-label` each emit one error, and the button and the row are not
   drawn.

4. **The value.** As P91: the `value` attribute is the default and the value of `form.reset()`,
   the property is the current value, and a dirty flag stops the attribute from applying. The
   chosen option is the first option with that value; the value is kept until such an option
   arrives. The text of the field is the text of the chosen option; the typed text is never the
   value — leaving the field without choosing gives it the chosen text again — except through the
   create row. With `filter="none"`, `options` holds the results of a search: when they leave
   the chosen option out, the choice stays in the form and in the field, without entering the
   results. The clear button leaves no choice, also when the list has an option of empty value;
   clearing that option fires `input` and `change`, because the choice went away. `required` with no choice is `valueMissing`, with the message of a disconnected
   native select (P91). Enter with the list closed submits the form, as `nph-input` (P80); with
   the list open, it chooses.

5. **The search.** `contains` keeps the options whose text contains the typed text with no
   difference of case or accent (the canonical decomposition without its marks, lower case); the
   first match is the highlighted stretch, mapped back to the original text. A group with no match
   goes away with its label; its line goes to the next group drawn. `none` keeps every option, so
   the consumer that searches a server filters `options` itself; the highlight shows in both.

6. **Events.** The host fires `input` (`bubbles`, `composed`) and then `change` (`bubbles`) only
   when the person changes the value: a choice of a different option, the clear button or the
   create row (P83, item 1). Typing does not change the value, so the native `input` of the inner
   field stops in the shadow root, and `nph-search` (`bubbles`, `composed`, `detail: { query }`)
   says the typed text changed, also when leaving the field clears it. `nph-create`
   (`bubbles`, `composed`, `detail: { text }`) fires when the person chooses the create row,
   before `input` and `change`; the value becomes the text, and the consumer adds the option.
   Setting `value`, `query` or `open` from code fires nothing; opening and closing fire nothing.
   Both keys are new in `HTMLElementEventMap` and collide with none (P76).

7. **The field and the keyboard.** The inner field is an `<input type="text" role="combobox">`
   with `aria-autocomplete="list"`, `aria-expanded` and `aria-controls`: the editable combobox
   with list autocomplete of the APG, with `delegatesFocus`. The focus never leaves it; the
   active option is pointed to by `aria-activedescendant` with an id, because the options live
   in the same shadow root. Typing opens the list, filters it and makes the first match active
   (D-5). Closed: ArrowDown and ArrowUp open on the chosen option, or on the first or the last;
   Alt+ArrowDown opens without moving; Escape clears the typed text (D-4). Open: the arrows move
   without wrapping; PageUp and PageDown move ten; Enter and Alt+ArrowUp choose and close; Escape
   closes and stops there, so a dialog around stays open; Tab closes without choosing (P91). Home
   and End stay in the text. A click on the field opens; on the arrow area, it opens and closes.

8. **The list.** The layer of P91 §7: a `popover="manual"` in the shadow root, `space/inline-tight`
   below the field, with its width, turned up when it does not fit below and fits above, following
   the field on scroll and resize, with the motion of P91. The maximum height
   `layout/max-list-height` is on the inner box that scrolls. The group label takes the look of the
   `nph-dropdown-menu` group label and the separator is the `nph-separator`, as in P92. The waiting
   and the empty lists sit in a `role="status"` region, so the person hears that the search found
   nothing (the announcement P84 leaves to the piece that receives the `nph-empty`). With nothing to
   show — no option, no spinner and no `empty-heading` — the list does not open.

9. **Name and description.** As P80 and P91: the labels associated with the host name the field and
   the listbox; without one, `label`; with no name at all, the combobox renders and warns once in
   development. `description` sits in a clipped element referenced by `aria-describedby`.
   `static nphFieldRole` is absent: a single control (P83).

**Pending decisions (Indiane), with the default the code follows.** D-1 the create row: an
`nph-option` with the `plus` icon, `create-label` and the typed text in quotes, highlighted. D-2 the
shortcuts footer: a slot the consumer fills, a `color/border` line above and `space/inline` around.
D-3 the rest of the text on the active option keeps `color/muted-foreground`. D-4 Escape with the list
closed clears the typed text. D-5 the first match is active while the person types.

**Known limits.**

- **The list does not shrink**, as in P91.
- **A label written decomposed**, a base letter followed by a combining mark (`Cafe` and U+0301
  instead of `Café`), can leave the mark outside the highlight: the match ends at the base letter,
  so the base and its accent take different weight and color. The precomposed form, the one
  applications usually send, is not affected. Follow-up: extend the end of the match over the
  combining marks that follow it, with a regression on decomposed text (Copilot, round 6 of
  PR #120).
- **The waiting and the empty boxes** take `space/inline` around the `nph-spinner` and the
  `nph-empty`; the evidence does not draw them.
- **Forced colors and right-to-left** are not treated yet, as in P80.
- **A long empty or waiting message scrolls inside `layout/max-list-height`** beside the listbox,
  not in it (DSA-32): only options go in a listbox. The keyboard reaches that scroll where the browser
  makes a scroll box with nothing focusable a Tab stop (Chromium and Firefox); Safari does not, and
  the field does not move it with the arrows. The same holds in `nph-multi-combobox`, which shares the
  list (P96).

**Points for review.**

- **The options as data**, against the light-DOM options of P91. The combobox does **not** implement
  `NPH_OPTION_CHANGED`: it owns the data, and the parent of each option is its own listbox, so the
  symbol P91 left "for `nph-combobox` to take" has no use here.
- **The list as a module**, not as a tag.
- **The events `nph-search` and `nph-create`**, and the native `input` stopped in the shadow root.
- **`query` settable from code.**
- **Enter submits the form with the list closed**, as `nph-input`, unlike `nph-select`.

**Source.** Board `nph-combobox` (`1359:142`), documentation `1766:2400`, set `1359:115`, list
`1359:141` and option `1357:136` of the Figma file `DS-IA-NEPHOS 5.0`, accepted by Indiane on
14/10/2026, with the Figma UX QA and the textual audit approved. The data model, the list module, the
names, the search, the events, the keyboard and the invalid input rules are a technical proposal of
this implementation, approved with the plan by Elvys on 23/10/2026.

**Out of scope.** Several options (`nph-multi-combobox`, DSA-31). A width property: the width is
`layout/input-width`. A new token. The Usage section of the page (P70, DSA-35), the page lists read
from the Metadata (P71, DSA-34) and the accessibility gate (P72, DSA-32).

**Status.** Anatomy and behavior accepted by Indiane on 14/10/2026. API and semantics are reviewed in
the pull request that brings them; the merge is the approval.

---

## P96 — `nph-multi-combobox`: API and semantics

**Technical conflict.** The accepted board (`1467:25660`) gives the field, the chip with its states,
the counter and the list, and leaves keyboard, form value, events and the text read by the remove
button to code. Three points need a decision of their own:

- the value is a list, and the form patterns of P80, P91 and P95 hold a single value, with the
  `value` attribute as the default;
- the list is the `nph-combobox` list (D2), with each option in `marcador=checkbox`, which P91 left
  to this task: `nph-option` has only the check;
- the remove buttons come before the text field in the shadow root, so the focus delegate of the
  host is the first remove button, not the text.

**Decision.** `nph-multi-combobox` is a Web Component with **open Shadow DOM** (P01), CSS in its
own file imported `?inline`, form-associated in the pattern of `nph-input` (P80) and a control of
the field contract (P83). It has no `::part`, no slot and no color property. Anatomy only through
semantic tokens. Invalid input renders nothing and emits `console.error` only in development — the
rule of P21, as in P80. The names follow P64.

1. **The list is the `nph-combobox` list (P95, D2).** The field takes `nph-combobox.list.ts` and
   its style: the entries of `options`, the search, the groups, the highlight and the empty state.
   It does not take `filter`, `loading`, `creatable` or the `shortcuts` slot: the board draws the
   `resultados`, `grupos` and `vazio` lists only, and the field accepts no text outside the list.

2. **The `checkbox` marker (amends P91).** `nph-option` gets `marker`, reflected: `check` (default,
   nothing changes for `nph-select` and `nph-combobox`) or `checkbox`. With `checkbox`, an
   `nph-checkbox` sits at the start of the option, before its own start (D-1, as the multiple choice
   of `nph-dropdown-menu`, P92), checked while the option is selected; the option takes no selected
   background and no check (evidence, Relations). The box is `inert` and hidden from the screen
   reader, named by the label text so that it renders (P81): the option keeps the role and
   `aria-selected`. A `marker` outside the two is invalid input of the option. The list module
   passes an optional `marker` per row.

3. **The chip is internal.** Each chosen option is a chip drawn in the shadow root of the field,
   not a tag and not a piece (evidence: "not a public piece"): a pill in `color/primary-surface`,
   the label in `text/label-sm` on one line with an ellipsis and a maximum width of the field (D3),
   and a native `<button>` that removes the option, a 24 × 24 target named by `remove-label` and
   the text of the option ("Remove Brazil"). With `chip-icon`, the chip shows the icon of its option
   (an option with `start: 'icon'`, its icon or `globe`, as the list draws it), or `tag` for an
   option with no icon (D-3). The chips follow the order of the choice and wrap; the field grows.

4. **Properties.**

   | Figma | API |
   |---|---|
   | `size` | `size`: `default` (default) or `large`, reflected; only the minimum height changes |
   | `state` `erro` | `invalid`, boolean, reflected (P83) |
   | `state` `disabled` | `disabled`, boolean, reflected; a disabled `<fieldset>` disables it too |
   | `state` `hover`, `foco`, `erro-foco` | not properties: CSS and `open` |
   | `conteúdo` `placeholder`, `itens`, `digitando`, `várias linhas` | not properties: derived from the value and the typed text (`query`) |
   | `conteúdo` `contador` | `counter`, boolean, reflected, with `subject`, the subject of the field (D1) |
   | chip `ícone início` and `⮑ ícone` | `chip-icon`, boolean, on the field |
   | the text read by the remove button | `remove-label`, the word before the option |
   | list `vazio` | `empty-heading` and `empty-description`, the texts of the `nph-empty` |
   | the form | `name` (reflected), `required`, `placeholder`, `label` and `description` |

   Chips without `remove-label` draw no remove button, and `counter` without `subject` draws the
   counter alone, each with one error. A `size` outside the two draws nothing.

5. **The value is a list.** `value` is a property only: the chosen values, strings, each once, in
   the order the person chose them; reading it gives a copy. `defaultValue` is a property only and
   takes the role of the `value` attribute of P80: while the person has not changed the choice and
   code has not set `value`, setting it moves `value` too; after that, only `form.reset()` goes back
   to it. This is the first piece with a list as its value, and a list has no good attribute form
   (a separator would forbid values that contain it). A value with no option is kept until its
   option arrives (P91), with no chip and out of the form data.

6. **The form.** The form value is a `FormData` with one entry `name=value` per chosen option that
   has an option, as `<select multiple>`. A `FormData` form value is submitted with its own keys, not
   with the `name` of the host, so each entry takes the current `name`, and a change of `name` writes
   the value again; with no `name`, nothing is submitted. The saved state is the whole list of values,
   restored without events. `required` with nothing chosen is `valueMissing`, with the message of a
   disconnected native select (P91). Enter with the list closed submits the form (P80).

7. **Events.** The host fires `input` (`bubbles`, `composed`) and then `change` (`bubbles`) only when
   the person changes the choice: an option checked or unchecked in the list, or a chip removed (P83,
   item 1). Typing does not change the value, so the native `input` of the inner field stops in the
   shadow root. No `nph-*` event: with no search answered by the consumer, `nph-search` has no use.
   Setting `value`, `defaultValue`, `query` or `open` from code fires nothing.

8. **The field and the keyboard.** The inner field is an `<input type="text" role="combobox">` with
   `aria-autocomplete="list"`, `aria-expanded` and `aria-controls`; the listbox has
   `aria-multiselectable="true"`. Typing opens the list, filters it and makes the first match
   active. Closed: ArrowDown and ArrowUp open on the first or the last option; Alt+ArrowDown opens
   without moving; Escape clears the typed text. Open: the arrows move without wrapping; PageUp and
   PageDown move ten; **Enter checks or unchecks the active option and keeps the list open**, the
   typed text is cleared and the option stays active; Alt+ArrowUp and Escape close; Tab closes
   without choosing. A click on an option checks or unchecks it and keeps the list open. The remove
   buttons are native buttons in the Tab order, before the text; pressed from the keyboard (a click
   with no pointer count, `detail` 0), the focus goes to the remove button now in its place, or to
   the text after the last; pressed by the pointer, the focus goes to the text. With the list open,
   the active option is brought into view once the rows have drawn.

9. **The focus of the host goes to the text.** With `delegatesFocus`, the focus delegate of the
   shadow root is its first focusable element, the first remove button. `focus()` is overridden to
   focus the text, which is what `nph-field` calls on a click of its label, and a click on a label
   associated with the host is sent to the text by a listener on that label (the activation of a
   label runs the focusing steps, not `focus()`). A click inside the field, in a label that wraps
   it, keeps its own target, and so does a click on a link or another control inside the label, as
   on a native label. The listener is released when the field leaves the page or the label stops
   being associated, and set again when the field comes back. `autofocus` on the text would make it the focus delegate, but it also
   takes the focus of the page on load: not used.

10. **The list and the layer** are those of P95: a `popover="manual"` in the shadow root,
    `space/inline-tight` below the field, with its width, turned up when it does not fit below,
    following the field on scroll, on resize and when the chips make it grow. The inner box that
    scrolls takes `tabindex="-1"`, so a long list is not a Tab stop of its own (a scroller with no
    focusable child is keyboard-focusable in Chromium).

11. **Name and description.** As P80 and P95: the labels associated with the host name the text and
    the listbox; without one, `label`; with no name at all, the field renders and warns once in
    development. `description` sits in a clipped element referenced by `aria-describedby`.
    `static nphFieldRole` is absent: a single control (P83).

**Pending decisions (Indiane), with the default the code follows.** D-1 the checkbox at the start
of the option, before its own start. D-2 the counter mode with nothing chosen shows the
placeholder. D-3 a chip for an option with no icon shows `tag`. D-4 in the counter mode, the text
field sits after the counter, on the same line.

**Known limits.**

- **The list does not shrink**, as in P91.
- **The remove buttons are Tab stops**, one per chip, before the text: a field with many chips
  takes many presses of Tab to cross. The evidence asks for the button to take the focus.
- **In the counter mode the chips are not drawn**: an option is removed by unchecking it in the
  list.
- **The text cursor** takes the native caret in `color/foreground`; its width and height in the
  evidence (`border/width` by `icon/size-sm`) are not styleable.
- **Forced colors and right-to-left** are not treated yet, as in P80.

**Points for review.**

- **`value` and `defaultValue` as lists**, properties only, against the `value` attribute of P80.
- **The `checkbox` marker** as an amendment of P91, and the optional `marker` of the list module.
- **The chip as markup**, not a tag.
- **Enter keeps the list open**, unlike `nph-combobox`, where it chooses and closes.
- **`focus()` overridden and the label listener**, to keep the focus delegate on the text.
- **No Backspace that removes the last chip**: the evidence says the remove button is the way to
  remove an option without opening the list.

**Source.** Board `nph-multi-combobox` (`1467:25660`), set `1467:25652`, chip `1467:24879`, the
`nph-combobox` list `1359:141` and option `1357:136` of the Figma file `DS-IA-NEPHOS 5.0`,
accepted by Indiane on 15/10/2026, with the Figma UX QA and the textual audit approved; D1 to D3
answered by Indiane. The list value, the marker of the option, the names, the events, the keyboard,
the focus of the host and the invalid input rules are a technical proposal of this implementation,
with the plan approved by Elvys on 23/10/2026.

**Out of scope.** Free text and a create row (`nph-input`). A search answered by the consumer
(`filter`, `loading`). A width property: the width is `layout/multi-combobox-width`. An avatar in
the chip. A new token. The Usage section of the page (P70, DSA-35), the page lists read from the
Metadata (P71, DSA-34) and the accessibility gate (P72, DSA-32).

**Status.** Anatomy and behavior accepted by Indiane on 15/10/2026. API and semantics are reviewed in
the pull request that brings them; the merge is the approval.

---

## P98 — `nph-sidebar-item`, `nph-sidebar-subitem` and `nph-sidebar-rail-button`: API and semantics

**Technical conflict.** The accepted board (`1366:2`, documentation `2723:460`) gives three sets —
the first-level item (`2251:51271`), the second-level subitem (`2251:51312`) and the rail button
(`2251:51328`) — and leaves destination, current page and group opening to code. Four points need
a decision of their own:

- the task places the three pieces in `src/components/nph-sidebar-item/`, but the build
  (`vite.config.lib.ts`), the manifest and `test:package` take one definition per folder, and P03
  makes the tag the folder name (P91, item 1; P97, item 1);
- the Figma `type` mixes what the line is (a link or a group) with an optional part (the counter);
- more actions opens a menu from a button that lives in the shadow root of the item, which a menu
  outside it cannot reference by `for` (P77, "How it attaches");
- the item contains a link and a button that are siblings, and the clicks of the button, of its
  menu and of the balloon reach the host as composed clicks.

**Decision.** The three pieces are Web Components with **open Shadow DOM** (P01) and
`delegatesFocus`, CSS in their own file imported `?inline`. They have no `::part`, no slot and no
color property. Anatomy only through semantic tokens. Invalid input renders nothing and emits
`console.error` only in development, one per cause — the rule of P21, as in P68. A piece with no
label (and, on the rail button, no icon) is a mount: nothing, no error (P66). The names follow
P64.

1. **Three tags, three folders.** `nph-sidebar-item`, `nph-sidebar-subitem` and
   `nph-sidebar-rail-button` each have their folder, package entry and sheet, as `nph-option`
   (P91, item 1). The location the task gives is superseded by that packaging; the task text stays
   as recorded. The reading page and the Validation stories of the three live in the folder of
   `nph-sidebar-item`, as the `Option` story lives in `nph-select`.

2. **The item.** `type` is `link` (default) or `group`, reflected. A link is an `<a href>`; the
   current page is `active`, reflected, with `aria-current="page"`. `counter` is a whole number
   from zero up, in a pill after the label and read inside the name of the link; it exists only on
   a link, so the Figma `counter` type is a link with `counter`. A group is a native
   `<button type="button">` with `aria-expanded`, following `expanded`, reflected; the Figma
   `group-closed` and `group-open` are `group` with `expanded` off and on. A group has no `href`, no
   `counter` and is never `active` (evidence, Properties): each of those is invalid input. `icon`
   is a core name of `nph-icon` at `icon/size-md`, `light` at rest and `solid` when active or in an
   open group (AGENTS.md, Font Awesome rule); `label` is the visible text and the name.

3. **The event `nph-toggle`.** A click, Enter or Space on a group toggles `expanded` and fires
   `nph-toggle` on the host, bubbling, crossing the shadow root (`composed`), not cancelable, with
   `detail: { expanded }`. Setting `expanded` from code fires nothing, as `nph-change` of P73 and
   `nph-row-toggle` of P97. `nph-sidebar` shows or hides the subitems; the item does not own them.
   A link fires nothing of its own: the click is the native `click`.

4. **More actions.** `actions` (property only) takes the entries of `nph-dropdown-menu` (P92) and
   `actions-label` names the button; `actions` without `actions-label` is invalid input. The
   button is the icon-only `nph-button` ghost and compact with `ellipsis-vertical` (P86), with the
   default severity of `nph-button` (D-3), a sibling of the link, never inside it, at the end of
   the line. It is hidden by opacity at rest and shown on hover and on focus within the item, so
   Tab and Shift+Tab reach it; under `hover: none` it is not drawn (evidence: mouse and keyboard
   only). The `nph-dropdown-menu` lives in the shadow root of the item, `for` the button; its
   `nph-item-select`, which does not leave the shadow root, is fired again on the host with the same
   `detail`, bubbling. A disabled item has no more actions.

5. **Clicks that are not a click on the line.** A click whose path holds the more actions button,
   its menu or the balloon stops at the host in the bubble phase (`stopImmediatePropagation`), after
   their own handlers, as the balloon of `nph-button` (P86). A disabled piece lets no click through,
   `click()` on the host included, in the capture phase.

6. **Disabled.** The line at `state/disabled-opacity`, out of the Tab order, with no balloon. A
   disabled link is an `<a>` without `href`, with `role="link"` and `aria-disabled="true"`, so the
   screen reader still finds a link; a disabled group is the native disabled button. A disabled
   link needs no `href`.

7. **The balloon.** On the item and the subitem, `tooltip` is the text of an `nph-tooltip`
   `for` the line, with `relation="description"`: the name stays the label, and the balloon text
   does not follow it (evidence, Properties). On the rail button the balloon is always on, with the
   `label`, `relation="name"` and the `aria-label` as a fallback, as the icon-only `nph-button`
   (P86); there is no property to turn it off (evidence, Do not). Its counter is the description of
   the link, through `aria-describedby` (amended on 27/10/2026, below: the counter is in the name).

8. **The subitem.** A link with `label`, `href`, `active`, `disabled` and `tooltip`, and
   `options`, reflected, which draws `chevron-right` at `icon/size-sm`. The arrow is visual only and
   the subitem stays a link (D-4). No icon, no counter and no more actions.

9. **The rail button.** A link with `label`, `icon`, `href`, `active`, `disabled` and `counter`, a
   square of `sidebar/rail-button-size` in `radius/container`. The counter sits on the top end
   corner, inside the button (D-1); active, it gains an outline `border/width` in
   `sidebar/panel-background` (D-2).

10. **Tokens.** The tokens of the evidence, each in its part: the item in `sidebar/item-height`,
    `sidebar/item-padding`, `space/control-padding` and `sidebar/item-radius`; the subitem in
    `control/height-default`, `space/inline` and `sidebar/item-padding`; the color of rest, hover
    and the rail button at rest in `sidebar/item-foreground` (the evidence measures the contrast of
    that color against the hover backgrounds). The focus is border `border/width` in
    `color/primary` and halo `focus/ring-width` in `focus/halo`, outside the box, as `nph-button`,
    in `focus/border-radius-sidebar-item` and `focus/radius-sidebar-item`, or
    `focus/border-radius-container` and `focus/radius-container` on the rail button. The pieces do
    not use `sidebar/item-background-active`, `sidebar/rail-radius`, `focus/border` or
    `focus-ring/sidebar`: the evidence gives the active item no background, the rail button
    `radius/container`, and the focus border and halo.

**Source.** Board `nph-sidebar-item` (`1366:2`), documentation `2723:460`, sets `2251:51271`,
`2251:51312` and `2251:51328` of the Figma file `DS-IA-NEPHOS 5.0`, accepted by Indiane on
26/10/2026, with the Figma UX QA and the textual audit approved. The three folders, the split of
`type` and `counter`, the event, the more actions menu, the click rule, the disabled link and the
invalid input rules are a technical proposal of this implementation, with the plan approved by
Elvys on 23/10/2026.

**Out of scope.** `nph-sidebar`: the panel, the expanded and collapsed modes, the indent of the
subitems, the flyout and the keyboard between lines. What the list of options of a subitem opens
(D-4). A new token. The Usage section of the page (P70, DSA-35), the page lists read from the
Metadata (P71, DSA-34) and the accessibility gate (P72, DSA-32).

**Amended on 27/10/2026 (DSA-32).** Item 7: the counter of the rail button is no longer the
description. The accessibility gate (P72) found the visible number outside the name
(`label-content-name-mismatch`, WCAG 2.5.3), and Elvys decided that the counter goes in the name.
`aria-labelledby` reads the balloon, whose `id` is fixed, and then the counter; the balloon finds
its own `id` already there and adds nothing, so the label is still announced once. Disabled, with
no balloon, the `aria-label` holds the label and the counter. Reviewed in the pull request that
brings it; the merge is the approval.

**Status.** Anatomy and behavior accepted by Indiane on 26/10/2026. D-1 to D-4 wait for Indiane.
API and semantics are reviewed in the pull request that brings them; the merge is the approval.

---

## P99 — `nph-pagination`: API and semantics

**Technical conflict.** The accepted documentation (`1640:196`, set `1640:194`) gives six types,
three positions in the list, the page, ellipsis and go to page pieces, and leaves the page
number, the position text and the list total to code. Five points need a decision of their own:

- the evidence calls the numbers and the arrows `nph-button` and `nph-icon-button`, secondary and
  outline, and it also gives them their own paint tokens — `pagination/arrow-background` on
  `color/background`, `pagination/arrow-border` on `color/input`,
  `pagination/item-background-hover` on `color/accent` and `pagination/text-foreground` on
  `color/foreground` — that no severity and emphasis of `nph-button` paints (its secondary outline
  is `color/muted` with a `secondary-foreground` border), and `nph-button` has no color property
  and no `::part` (P68). The two statements cannot both be followed;
- the Figma `posição` is the result of the current page and the count, not a choice;
- the position text and the names carry numbers that change when the person moves, in the
  language of the consuming application;
- above a few pages, the numbers must hide some pages without the bar changing width;
- the arrow the person used may lose its destination and be disabled while it has the focus.

**Decision.** `nph-pagination` is a Web Component with **open Shadow DOM** (P01) and
`delegatesFocus`, CSS in its own file imported `?inline`. It has no `::part`, no slot and no color
property. Anatomy only through semantic tokens. Invalid input renders nothing and emits
`console.error` only in development, one per cause — the rule of P21, as in P68. A count of zero
is a mount: nothing, no error (P66). The names follow P64.

1. **One tag.** The Figma page, ellipsis and go to page pieces are inner parts, not tags (P91,
   item 1; P97, item 1). The host draws a `nav` named by `label`.

2. **Native buttons painted with the pagination tokens (D-1).** Each number and each arrow is a
   native `<button type="button">` drawn by the piece with the `pagination/*` tokens, so every
   token created for this piece is consumed. They copy from `nph-button` what does not depend on
   color: the focus of the secondary severity (border `border/width` in `focus/border`, halo
   `focus/ring-width` in `focus/halo`, outside the box, keyboard only), the icon light at rest and
   solid in hover-active (P88), and, on the icon-only arrows, the `nph-tooltip` next to the button
   in the shadow root with `relation="name"` and the `aria-label` as a fallback (P86). Indiane
   decides D-1; if the numbers and arrows become `nph-button`, `nph-button` needs a paint hook
   first, which is a change of P68.

3. **Type and position.** `type` is `numbered` (default), `simple`, `edges`, `range`, `compact` or
   `table`, reflected. `page` is the current page, a whole number from 1, reflected. The count is
   `page-count`, or comes from `total-items` and `page-size`; `range` and `table` show the range of
   items, so they require both, and the derived count wins over a different `page-count`, with one
   warning. The position is not a property: at the first page, first and previous are disabled; at
   the last, next and last. A disabled arrow stays in place (evidence, Do). `page` above the count
   draws the last page and warns once, so a filter that shrinks the list does not take the bar away
   (as the transient value of `nph-select`, P91); it fires nothing.

4. **The window of numbers.** Up to seven pages, every number. Above that, always seven slots: the
   first and the last page, the current page with one neighbor on each side, and an ellipsis for
   each run of hidden pages — `1 2 3 4 5 … 10`, `1 … 4 5 6 … 10`, `1 … 6 7 8 9 10`. Every number
   and every ellipsis reserves the width of the widest number, the count, through a hidden copy
   stacked under it, with tabular figures, so the bar keeps its width at any page of any list. The ellipsis is the `ellipsis` icon in a box of `pagination/item-size`,
   `aria-hidden`, with no click.

5. **Text by template.** Every text comes already localized: `label`, `page-label`, `first-label`,
   `previous-label`, `next-label`, `last-label`, `position-text`, `page-size-label` and
   `go-to-label`. `page-label` and `position-text` are templates with the markers `{page}`,
   `{count}`, `{start}`, `{end}` and `{total}`, the convention of the Storybook dictionaries
   (`.storybook/i18n/index.js`, `format`); the piece fills them with the numbers written by
   `Intl.NumberFormat` in the language of the nearest `lang`, as `nph-slider` (P94), looked up
   across the shadow roots the bar lives in. In `page-label`, the markers describe the page each
   number leads to, not the current one. So the consumer gives the text once and the piece
   rewrites it when the person moves. A missing arrow
   label, position text, field label or `page-sizes` is invalid input; a missing `label` or
   `page-label` renders and warns once. In `numbered`, `previous-label` and `next-label` are the
   written text of the arrows, with the chevron (D-3), and there is no balloon.

6. **The event `nph-page-change`.** A number, an arrow, go to page or items per page sets `page`
   (and `page-size`) and fires `nph-page-change` on the host, bubbling, crossing the shadow root
   (`composed`), not cancelable, with `detail: { page, pageSize }` (`pageSize` is `null` when the
   count comes from `page-count` alone). Setting `page` from code fires nothing, as `nph-toggle`
   of P98. The composed `input` of the inner `nph-select` and `nph-input` stops at their element,
   and their `change` does not leave the shadow root: the bar has one event.

7. **Focus stays in the bar.** When the arrow that had the focus loses its destination and is
   disabled, the focus moves to the current page, or to the opposite arrow where there are no
   numbers, so the keyboard does not fall back to the start of the document.

8. **Items per page and go to page.** In `table`, `page-sizes` lists the options of an
   `nph-select` in `pagination/page-size-width`, with a native `<label for>` from
   `page-size-label`; it must hold `page-size`. Changing it keeps the first item on screen
   (item 101 at 25 per page is on page 3 at 50). In `edges`, `go-to-page` turns on an `nph-input`
   in `pagination/page-input-width` beside the bar, with a native `<label for>` from
   `go-to-label` (evidence: "beside the bar with first and last"). Its `change` (Enter or blur)
   takes a whole number, limited to the count; text that is not a number is ignored, and the field
   empties after it, with no error state, which would need the sentence of `nph-field`.

9. **Layout (D-4, D-5).** The outline of the bar wraps the arrows and the numbers, or the position
   text between the arrows in `simple`, `range` and `compact`. In `table`, items per page and the
   range sit before the bar; go to page sits after it; the groups at `pagination/group-gap`, a
   label and its field at `pagination/control-gap`. The last arrow is the first one with only its
   icon turned half a turn, not the button, its focus or its balloon.

10. **Tokens.** The tokens of the evidence, each in its part: the bar in `pagination/border`,
    `pagination/border-width`, `pagination/radius`, `pagination/padding-x`, `pagination/padding-y`
    and `pagination/item-gap`; numbers and arrows in `pagination/item-size` and
    `pagination/item-radius`; the text in `pagination/text-foreground` and `text/label-md` (D-2);
    hover in `pagination/item-background-hover`; the current page in
    `pagination/item-background-active` and `text/label-md-strong`; the arrow in
    `pagination/arrow-background` with an inner stroke `pagination/arrow-border-width` in
    `pagination/arrow-border`; disabled in `pagination/disabled-opacity`. The written arrows of
    `numbered` take `space/control-padding` and `space/inline-tight` from `nph-button` with text.

**Source.** Documentation `1640:196`, set `1640:194`, page `2888:87682`, ellipsis `2888:87798` and
go to page `2888:87805` of the Figma file `DS-IA-NEPHOS 5.0`, accepted by Indiane on 27/10/2026,
with the Figma UX QA and the textual audit approved. The native buttons, the templates, the window
of numbers, the event, the focus rule, the fields and the invalid input rules are a technical
proposal of this implementation, with the plan approved by Elvys on 23/10/2026.

**Out of scope.** `nph-data-table`, which places the bar below the table. Load more and infinite
scroll. A size, forced colors and right-to-left. A new token. The Usage section of the page (P70,
DSA-35), the page lists read from the Metadata (P71, DSA-34) and the accessibility gate (P72,
DSA-32).

**Status.** Anatomy and behavior accepted by Indiane on 27/10/2026. D-1 to D-5 wait for Indiane.
API and semantics are reviewed in the pull request that brings them; the merge is the approval.

---

## P100 — `nph-chip`: API and semantics

**Technical conflict.** The accepted documentation (frame `3077:2240`, set `3076:1439`, board
`3077:807`) gives one set with the Figma properties `tipo`, `cor`, `conteúdo`, `tamanho` and `estado`,
and leaves the code API to the code. Six points need a decision of their own:

- the evidence draws the counter as an `nph-badge`, `secondary` and `light`, and it also gives the
  counter its own paint and space tokens — `chip/counter-background`,
  `chip/counter-background-hover`, `chip/counter-background-disabled`, `chip/counter-foreground`,
  `chip/counter-padding-y` and `chip/counter-padding-x` — that `nph-badge` does not paint: it has no
  color property and no `::part` (P68). The two statements cannot both be followed;
- the evidence says a cut label shows the whole text in a tooltip on hover and on focus, but the body
  of a removable chip has no action, and `nph-tooltip` draws only on an element that takes focus
  (P77);
- the evidence says the X has an `aria-label` with the action and the label, but the word of the
  action is text in the language of the consuming application;
- the Figma `conteúdo` and `estado` are not independent: the set has the combinations it draws and no
  others, and the code has to say what happens to the rest;
- the piece has two events of the person, one for each type, and `nph-change` is already typed by
  `nph-togglebutton` with another detail;
- the evidence leaves four details open: the size of the avatar, the order of the counter and the X on
  the selected chip, the hover and focus of the X of the invalid chip, and the target of the tooltip
  on a removable chip.

**Decision.** `nph-chip` is a Web Component with **open Shadow DOM** (P01) and `delegatesFocus`,
CSS in its own file imported `?inline`. It has no slot, no `::part`, no color property and no form
association. Anatomy only through semantic tokens. Invalid input renders nothing and emits
`console.error` only in development, one per cause — the rule of P21, as in P68. A chip with no text is
a mount: nothing, no error (P68). The names follow P64.

1. **One tag, the Figma properties as attributes.** `type` is `removable` (default) or
   `selectable`, the Figma `tipo`; `severity` is `default`, `success`, `warning`, `error`, `info` or
   `help`, the Figma `cor`; `size` is `compact` (default) or `default`, the Figma `tamanho`. All three
   reflect, because the internal CSS selects on them. The name is `severity`, not `color` or `status`:
   every status color of the library is a `severity` (`nph-badge`, `nph-button`). Each exported list
   (`NPH_CHIP_TYPES`, `NPH_CHIP_SEVERITIES`, `NPH_CHIP_SIZES`) is the closed list of the check.

2. **The content is not a property.** The Figma `conteúdo` becomes `icon` (a core name of
   `nph-icon`), `avatar` with `avatar-src` (the photo; without it, the avatar draws the person icon)
   and `counter` (a whole number from zero up), at most one of them. Icon and avatar are decorative,
   in `icon/size-sm` and `avatar/size-sm`. The avatar is removable only and the counter selectable
   only, as the set. `text` is the label, already localized, in one line, with an ellipsis at
   `chip/max-width`.

3. **The counter is a pill of its own (D-1).** The chip draws the counter itself, a pill with
   `chip/counter-background` (`chip/counter-background-hover` on hover and active of the chip,
   `chip/counter-background-disabled` when disabled), the number in `chip/counter-foreground` and the
   text role `text/label-sm` of the badge text, `chip/counter-padding-y` and `chip/counter-padding-x`
   inside and `radius/full`, so every token created for this piece is consumed. It is the precedent of
   P99, which painted its numbers and arrows with its own tokens, and of P98, which drew the counter
   of `nph-sidebar-item`. Indiane decides D-1; if the counter becomes an `nph-badge`, `nph-badge` needs
   a paint hook first, which is a change of P68.

4. **The avatar is `sm` (D-2).** The evidence does not give the size of the `nph-avatar` before the
   text. `sm` fits the compact height and is the one the code uses in both sizes.

5. **Removable: the X.** The body of a removable chip has no action. The X is a native
   `<button type="button">` with a target of `chip/remove-size` in both sizes and an `aria-label` made
   of `remove-label` and the text, so it reads "Remove filter Status: Waiting", the same word before the
   text as `nph-multi-combobox` (P96, "Remove Brazil"). `remove-label` is required while the X shows;
   without it the piece draws nothing and says so once. `readonly` shows the value with no X and needs
   no `remove-label`. The chip does not remove itself: the X fires `nph-remove` and the consumer takes
   the value away.

6. **Selectable: the whole chip is the toggle.** A selectable chip is one native `<button>` with
   `aria-pressed`, named by its text and, with a counter, the number ("Pending 12"; a space separates
   them). `selected` reflects and the selected chip shows the X as a mark only, an icon with no button
   of its own: the click belongs to the whole chip, and a nested button would be an interactive element
   inside another. The order is icon, text, counter and X (D-5), and the end padding is the one of the
   X, `chip/padding-end-remove` or `chip/padding-end-remove-default`.

7. **Events, named for what changed.** `nph-remove` fires on the host (`bubbles`, `composed`) when the
   person presses the X, with `detail: { text }`. `nph-selected-change` fires on the host (`bubbles`,
   `composed`) when the person toggles a selectable chip, after `selected` changed, with
   `detail: { selected }`. Neither is `nph-change`: `HTMLElementEventMap['nph-change']` is already typed
   with `{ pressed }` by `nph-togglebutton` (P73), and one name cannot carry two types — the same
   reason as `nph-value-change` of P76. Both fire only for the person: setting `selected`, or any
   other property, from code fires nothing (as `nph-toggle` of P98). The click on the X is stopped
   there, so it is not a click on the chip.

8. **The cut label has a balloon (D-3).** The piece measures the label (`ResizeObserver` and the load
   of the font) and, only when its text is wider than its box, shows the whole text in an
   `nph-tooltip` on hover and on keyboard focus (P77). In the removable chip the label itself takes
   `tabindex="0"`, as the truncated cell of `nph-table` (P97), so the balloon has a target, and the
   focus draws the ring around the whole chip; in the selectable chip the balloon points at the chip
   button. A label that is not cut takes no focus and has no balloon, and a disabled chip has none.
   On the selectable chip the balloon is the name, with `relation="name"` as the truncated cell of
   `nph-table`, and the button is named by the balloon and then the counter, so the text is not read
   a second time as a description. The cut label of a removable chip is a generic element, which
   ARIA does not let be named, so there the balloon stays its description.

9. **States are attributes, one at a time.** `marked` (the last chip of a field, ready to leave),
   `readonly` and `invalid` belong to a removable chip in the default severity and exclude each other;
   `selected` and `counter` belong to a selectable chip, which has the default severity only. A status
   severity exists only on a removable chip with text, with no icon and no avatar. The invalid X takes
   the error pair, `chip/error-remove-background-hover` for hover and active and `chip/error-focus-border`
   with `chip/error-focus-halo` for the focus ring (D-4), to match the red border. Hover, focus and
   active are interaction states, not attributes.

10. **A combination the set does not have does not render (P21).** The chip draws only what the
    Figma set draws. A type, severity or size outside the lists, an icon outside the core, more than
    one content, `avatar-src` without `avatar`, a counter that is not a whole number from zero up, a
    counter or `selected` on a removable chip, an avatar, a status severity or a state on a selectable
    chip, more than one state, a status severity with a state, an icon or an avatar, and a removable
    chip with an X and no `remove-label` each draw nothing and emit one `console.error` in development.

11. **`disabled` wins over the rest (P73).** The whole chip takes `state/disabled-opacity`, with
    `chip/background-disabled` and no border; the native button is disabled, so the chip leaves the
    Tab order, and a click on the host, on `click()` or on the X fires nothing and shows no balloon.
    The selected chip keeps its full background. It is no error to combine it with another state.

12. **Tokens.** The tokens of the evidence, each in its part: the container in `chip/background`,
    `chip/radius`, `chip/height-compact`, `chip/height-default`, `chip/max-width`, `chip/gap` and
    `chip/border-width` in `chip/border`, drawn inside so it never makes the chip wider or taller; the
    padding in `chip/padding-x`, `chip/padding-start-icon`, `chip/padding-start-avatar`,
    `chip/padding-end-remove`, `chip/padding-end-remove-default` and `chip/padding-end-counter`; the
    label in `text/label-md` and `chip/foreground`; each status in `chip/<status>-background`,
    `chip/<status>-border`, `chip/<status>-foreground`, `chip/<status>-remove-background-hover`,
    `chip/<status>-focus-border` and `chip/<status>-focus-halo`; `marked` in
    `chip/background-hover`; the selected chip in `chip/background-selected`,
    `chip/background-selected-hover` and `chip/foreground-selected`; the X in `chip/remove-size`,
    `chip/remove-radius` and `chip/remove-background-hover`. Focus is the border `border/width` and the
    halo `focus/ring-width`, round as `chip/radius`, around the X or the whole chip.

**Source.** Documentation `3077:2240`, set `3076:1439`, board `3077:807` and page `1626:40` of the
Figma file `DS-IA-NEPHOS 5.0`, accepted by Indiane on 28/10/2026, with the Figma UX QA and the textual
audit approved. The attributes, the names of the events, the cut label, the combinations that do not
render and the invalid input rules are a technical proposal of this implementation.

**Out of scope.** The field that holds chips: the chips of `nph-multi-combobox` stay internal (P96).
`nph-toolbar` and its line of applied filters (DSA-55). A horizontal scroll of the line, which the
evidence forbids. A size, forced colors and right-to-left. A new token.

**Status.** Anatomy and behavior accepted by Indiane on 28/10/2026. D-1 to D-5 wait for Indiane. API
and semantics are reviewed in the pull request that brings them; the merge is the approval.

---

## P101 — `nph-table`: the tree as a treegrid

**Technical conflict.** P97 writes `aria-level` on the rows of a tree, and ARIA 1.2 gives
`aria-level` to a row only inside a `treegrid`. The table is a native `table`, so the
accessibility gate (P72) flags the rule `aria-conditional-attr`, and the stories that draw a
tree carried the exception `TREE_LEVEL_EXCEPTION`, decided by Elvys on 27/10/2026 (DSA-32)
until this task. P97 left an interactive grid out of scope; this decision brings it for the
tree only, and the flat table does not change.

**Decision.**

1. **When.** The table is a `treegrid` when it draws a tree: when one valid row, open or
   closed, has `children`. The other tables — with or without an expanding row — stay a native
   `table`, as P97 describes them.

2. **Roles and states.** `role="treegrid"` goes on the `<table>` of the shadow root; the rows,
   the column headers and the cells take their roles from the table (`row`, `columnheader`,
   `gridcell`). Each row of data carries `aria-level`, `aria-posinset` and `aria-setsize`,
   counted among the valid rows of its level under the same parent (a row left out does not
   count), and a row that opens — by `children` or by `detail` — carries `aria-expanded` on
   the `<tr>`. The open expanded item is a row of the level under its row, the only one there.
   The row carries the open state of the tree, and the chevron does not: with `tabindex` on its
   host (item 3), the host of the `nph-button` is a focusable element with no role, where ARIA
   does not allow `aria-expanded`, and the gate (P72) flags it. The chevron keeps its name and,
   for an expanded item, `aria-controls`. The footer row, when there is one, is outside the
   levels: it carries no `aria-level`, and the arrows reach it after the last row. The rows keep
   one template in both tables, so a row that stays keeps its elements, and the focus on its
   buttons, when the table becomes a tree or stops being one.

3. **Focus.** One row of the body is the Tab stop (`tabindex="0"`): the last row the focus was
   in, while it is drawn — also while the table was flat, so a table that becomes a tree keeps
   the Tab stop on the row the focus is in — and the first row otherwise; the other rows and every cell take
   `tabindex="-1"`. The links, the buttons, the chevron and the truncated text of the row that
   is the Tab stop keep the Tab order, and those of the other rows take `tabindex="-1"` (on the
   host of an `nph-button`, which takes its inner button out of the Tab order). So Tab goes from
   the row to its own widgets and then leaves the table, as the APG treegrid says. The focused
   row and cell take the ring `focus/border` in `table/focus-ring-width`, drawn inside, as the
   truncated text does. A truncated cell reached by the arrows takes `tabindex="0"` in the
   capture phase of the focus, before its `nph-tooltip` hears it: the tooltip opens only on an
   element in the Tab order (P77), and the render then keeps the cell there, as its row is now
   the Tab stop.

4. **Keys** (the APG treegrid, rows first). On a row: Right Arrow opens a closed row, and on
   an open row or a leaf goes to its first cell; Left Arrow closes an open row, and on a closed
   row or a leaf goes to its parent row; Down Arrow and Up Arrow go to the next and the previous
   row, the footer last; Home and End, with or without Control, go to the first and the last row; Enter opens and
   closes the row. On a cell: Right Arrow and Left Arrow go to the next and the previous cell,
   and Left Arrow on the first cell goes back to the row; Down Arrow and Up Arrow go to the cell
   of the same column in the next and the previous row, or to that row when it has no such cell,
   as the expanded item; Home and End go to the first and the last cell of the row; Control+Home
   and Control+End go to the cell of the same column in the first and the last row. Control goes
   only with Home and End, and Alt, Shift and Meta with no key of the tree. A key pressed inside a
   button or a link stays with it. Opening and closing from the keyboard replace `rows`
   and fire `nph-row-toggle`, as the chevron does; a row that loads does not open, as its click
   does not.

5. **What the flat table keeps.** A table without a tree has no role besides the native ones,
   no roving Tab stop, no arrow key, no `aria-level` and no state on the row: every link and
   button stays in the Tab order, and the chevron of an expanding row carries the open state on
   the host of its `nph-button`, with the known limit of P97.

**Reason.** The level of a row is part of reading a hierarchy, and ARIA gives it to a row only
in a `treegrid`. A `treegrid` is an interactive grid, so it owes the person its keyboard: one
Tab stop and the arrows, so that a long tree is not a long run of Tab stops. The flat table has
no hierarchy to read, and a grid there would add a keyboard the evidence does not ask for.

**Known limits.**

- **The focus when the focused row leaves.** When the consumer replaces `rows` and the row
  that holds the focus is not drawn any more, the focus leaves with it, as with any element that
  leaves the page; the Tab stop goes to the first row.
- **The tooltip of a truncated cell opens on hover only in the row that is the Tab stop.** It is
  a regression of this decision: before it, every truncated cell of a tree had `tabindex="0"` and
  its tooltip opened on hover in any row. `nph-tooltip` opens only on an element in the Tab order
  (P77), and in the other rows the cell has `tabindex="-1"`, though the arrows reach it; there,
  a hover also warns in development that the element does not receive focus. The text stays whole
  in the name of the cell, and the arrows open the tooltip. Follow-up in `nph-tooltip` (P77): take
  a cell with `tabindex="-1"` inside a `grid` or a `treegrid` as an element that receives focus.
- **The expanded item under a row of the third level** is a row of `aria-level` 4: it is the
  detail of that row, not a fourth level of the tree, which still goes down to three.
- **No Page Up and Page Down** and no selection: the APG makes both optional, and selection is
  of `nph-data-table`.
- **Forced colors and right-to-left** are not treated yet, as in P97: Right Arrow opens in both
  reading directions.

**Points for review.**

- **The treegrid on the tree only**, so the flat table does not change.
- **Rows first**, the default of the APG treegrid.
- **`aria-posinset` and `aria-setsize`** written by the piece, counting the valid rows only.
- **The expanded item as a row of the level under its row** when it is inside a tree.

**Source.** The WAI-ARIA Authoring Practices treegrid pattern, ARIA 1.2 (`aria-level`,
`aria-posinset`, `aria-setsize` and `aria-expanded` on a row of a `treegrid`), P72 and P97. The
roles, the focus and the keys are a technical proposal of this implementation (DSA-56), from the
decision of Elvys on 27/10/2026 to move the tree to a treegrid.

**Out of scope.** The flat table, the look of the rows, the tokens, sorting, selection and
filtering (`nph-data-table`).

**Status.** API and semantics are reviewed in the pull request that brings them; the merge is the
approval.

---

## P102 — Vitest 5 for the browser tests

This decision **amends item 5 of P21**, "Vitest in browser mode as the validation base", in its
version only: the test runner, the browser mode and the two projects of `vitest.config.ts` stay.

**Technical conflict.** The browser tests fail now and then on the Azure agents with "Failed to
fetch dynamically imported module", and a run sometimes hangs until the 30-minute timeout. The
diagnosis of PR #142 shows that Vite answered the failing imports with `200 OK`: the failure is on
the Chromium side, below the top-level import. It matches vitest-dev/vitest#11745, where the
maintainer says that Vitest 4 gets no more fixes and points to Vitest 5, and the comment on
vitest-dev/vitest#10791 (`ERR_INSUFFICIENT_RESOURCES`). The two sequential shards of PR #142
(`7db2065`) made the failure rarer but did not end it: PR #143 failed three times on `3c9d51f` with
the shards on.

**Decision.**

- `vitest` and `@vitest/browser-playwright` move to `^5.0.5`.
- `storybook`, `@storybook/web-components-vite`, `@storybook/addon-a11y` and
  `@storybook/addon-vitest` move to `^10.6.5`, the first `@storybook/addon-vitest` that accepts
  Vitest 5.
- `vite` stays at `^8.2.2`, `playwright` at `^1.62.1` and `style-dictionary` at `^5.5.2`, with the
  same locked versions, so the Chromium build does not change.
- The test configuration does not change: no Vitest 5 option is set to bring back a Vitest 4
  behavior, and the request log of `NEPHOS_TEST_DIAGNOSTICS` stays.

**Reason.** The defect is upstream, in a version that no longer gets fixes. Moving only the runner
and the Storybook packages it requires keeps one variable at a time: the shards, the browser and
the server topology stay as they are.

**Impact.**

- `package-lock.json` is generated again from scratch. From the old lockfile, npm refuses the move
  (`ERESOLVE`): `storybook` 10.6.5 has the optional peer `vite-plus@^0.2`, which pins
  `@vitest/browser-playwright` to 4.1.10. Some 90 transitive dependencies move inside their semver
  ranges.
- Vitest 5 requires Node 22.12 or later. The validated Node 24.18, which the pipeline also uses,
  meets it.
- One test changes. The press outside of `nph-combobox` clicked at (600, 600) of `document.body`,
  outside the 414 × 896 viewport. Vitest 4 let that click through; under Vitest 5, Playwright
  refuses it ("`<html>` intercepts pointer events") until the test times out. The press moves to
  the bottom-left corner of the viewport, as in `nph-multi-combobox`. The behavior under test does
  not change.
- The version table of `AGENTS.md` follows.

**Out of scope.** Removing the sequential shards of the Azure pipeline, which waits for Vitest 5 to
be proven there. The agent pool and the load of its hosts. Any other dependency.

**Rite.** This decision touches the version that item 5 of P21 adopted, so it follows the section
"How to change one of these decisions": the technical conflict is above, the proposal is this
section, and the human review is the pull request. The text of P21 does not change; it only gets
the annotation.

**Status.** Decided by Elvys on 29/10/2026. Reviewed in the pull request that brings it; the merge
is the approval.

---

## P104 — `nph-toolbar`: API and semantics

**Technical conflict.** The accepted documentation (frame `2944:6528`, set `2105:426`, page
`1626:44`) gives one set with the Figma properties `tipo`, `tamanho`, `contagem`, `centro`,
`caixa de seleção`, `limpar em texto` and `limpar em ícone`, and leaves the code API to the code.
Five points need a decision of their own:

- the booleans and the zones are pieces the consumer puts in the bar, not states of the bar: the
  code has to say how the pieces go in and how the bar reaches them;
- the evidence says the height of each size comes from the pieces, not from a toolbar token, so
  the bar has to make every piece take its size;
- the evidence says that in the bulk bar the hover of the actions uses
  `toolbar/bulk-action-background-hover`, but `nph-button` has no color property and no `::part`
  (P68);
- the keyboard rule left Figma for this task: the W3C ARIA Authoring Practices toolbar pattern,
  which leaves the wrap at the ends and the text fields open, and the applied filters strip, whose
  filters "are not actions", has a focus rule of its own after a removal;
- the removal of a filter is announced in a status region, but the text and the removal itself
  belong to the consuming application (`nph-chip` does not remove itself, P100).

**Decision.** `nph-toolbar` is a Web Component with **open Shadow DOM** (P01), CSS in its own file
imported `?inline`. It has no own event, no `::part`, no color property and no form association.
Anatomy only through semantic tokens. Invalid input renders nothing and emits `console.error` only
in development, one per cause — the rule of P21. A problem in the composition renders anyway and
emits `console.warn` only in development, once while it lasts, as P76. The names follow P64.

1. **The Figma properties as attributes.** `type` is `bulk` (default, `em massa`), `page`
   (`página`), `tools` (`ferramentas`), `floating` (`flutuante`) or `applied-filters`
   (`filtros aplicados`); `size` is `compact`, `default` (default) or `large`. Both reflect, because the
   internal CSS selects on them. `count-text` is the Figma `contagem`, already localized, drawn by
   the bar in `text/label-md` with `toolbar/bulk-count-foreground` or
   `toolbar/floating-count-foreground`, the only text the bar draws, because the color token is the
   bar's; only in `bulk` and `floating`. `label` names the area and becomes the `aria-label` of the
   host; `aria-label` or `aria-labelledby` on the host also count, and a bar with no name does not
   render, as P76.

2. **The zones are slots, the booleans are composition.** The default slot is the start; `center`
   is the middle, shown only with content (the Figma `centro`); `end` holds the actions on the
   right; `checkbox` takes the `nph-checkbox` of the bulk bar, before the count (the Figma
   `caixa de seleção`). Clear in text or in icon is the button the consumer chooses. The start and
   the end share the free space, so the center sits in the middle; the bar does not wrap.

3. **The bar writes the size.** The bar writes `size` on every direct child that has one —
   `nph-button`, `nph-togglebutton`, `nph-toggle-group` and `nph-input` — so they are 28, 36 or 44 px
   high, and a `size` set on such a child is written back, as `nph-toggle-group` writes on its
   buttons (P76). `nph-chip`, which has two sizes, takes `compact` in the compact bar and `default` in
   the other two, as the evidence says. Only direct children are reached: a wrapper hides a piece
   from the size and from the keyboard.

4. **The bulk hover is inherited (D-1).** In the bulk bar, the host points
   `--nph-button-secondary-ghost-background-hover` and
   `--nph-icon-button-secondary-ghost-background-hover` at `toolbar/bulk-action-background-hover`;
   the pieces inside inherit it, as `nph-dialog` points `--nph-color-secondary` for its buttons
   (P87). No token is created or changed. The danger ghost action keeps its own hover.

5. **Keyboard: the toolbar pattern (D-2).** The actions — `nph-button`, `nph-togglebutton`, also
   inside an `nph-toggle-group`, and `nph-checkbox` — are one Tab stop, by a roving tabindex on the
   host of each piece: `tabindex="-1"` on the hosts that do not hold the stop takes their shadow tree
   out of the Tab order, and `focus()` still reaches the inner control through `delegatesFocus`. The
   right and left arrows move between them, wrapping at the ends, and follow the reading direction in
   a right-to-left page; Home and End go to the first and the last; a key with a modifier is left
   alone. A disabled action is skipped and gives the stop away; a loading one is still an action.
   `nph-input` keeps its own Tab stop and its arrow keys, which edit its text. A key from the panel
   of `nph-dropdown-menu` or from a field does not move the bar. The bar gives the `tabindex` back to
   a piece that leaves it.

6. **The applied filters strip (D-3, D-4).** `applied-filters` is a `role="group"` with no arrow
   keys: each X and the clear button are Tab stops of their own. Its children are removable
   `nph-chip` and one `nph-button` after the last chip; with no chip the strip is not shown and takes
   no height. The bar never removes a chip: the consumer takes the filter away on `nph-remove`. When
   the chip leaves, if the focus was in the strip and did not go somewhere else, the focus goes to the
   next chip, else to the previous one, else to `trigger`, the `id` of the button that opens the
   filters, looked up in the same root as the `for` of `nph-tooltip` (P77); after the clear button
   empties the strip, to `trigger`. A status region, clipped and never `display: none`, announces
   `removed-text` with the `{text}` marker filled with the text of the chip, and `cleared-text`
   after the clear button empties the strip, emptied first so the same sentence is announced again.
   The strip has to stay in the page while it is empty.

7. **The narrow bar is composition (D-5).** The bar does not collapse by itself: on a narrow screen
   the consumer drops the text of the buttons first, then sends the actions at the back to More,
   which opens `nph-dropdown-menu`.

8. **Tokens.** The fourteen `toolbar/*` tokens of the evidence, each in its part: the bar in
   `toolbar/background`, `toolbar/border` in `toolbar/border-width`, `toolbar/radius` and
   `toolbar/padding`; the bulk bar in `toolbar/bulk-background`, `toolbar/bulk-padding-x`,
   `toolbar/bulk-count-foreground` and `toolbar/bulk-action-background-hover`; the floating bar in
   `toolbar/floating-background`, `toolbar/floating-border`, `toolbar/floating-radius`,
   `toolbar/floating-count-foreground` and `elevation/dropdown`; the space in `toolbar/gap`. The count
   is `text/label-md`.

**Source.** Documentation `2944:6528`, set `2105:426` and page `1626:44` of the Figma file
`DS-IA-NEPHOS 5.0`, accepted by Indiane on 27/10/2026 and again on 28/10/2026 with the applied
filters, with the Figma UX QA and the textual audit approved; the keyboard rule is the W3C ARIA
Authoring Practices toolbar pattern, by decision of Indiane. The attributes, the slots, the roving
tabindex, the focus rule's trigger and the announcements are a technical proposal of this
implementation.

**Out of scope.** A vertical bar, which the evidence forbids. A bar that collapses by itself. The
pagination, a sibling piece. `nph-data-table`, which places the bar above the table. A new token.

**Status.** Anatomy and behavior accepted by Indiane on 28/10/2026. D-1 to D-5 wait for Indiane. API
and semantics are reviewed in the pull request that brings them; the merge is the approval.

---

## P105 — `nph-data-table`: API and semantics

**Technical conflict.** The accepted documentation (frame `2875:17577`, set `2633:69628`, board
`1371:282`) gives one set with the Figma properties `estado`, `size`, `moldura`, `cabeçalho fixo`,
`foco`, `grade` and `expande`, five inner pieces (`cabeçalho`, `seleção`, `linha`, `ações` and
`ajuste`) and a footer that changes with the width of the table's space, and leaves the code API to
the code. Five points need a decision of their own:

- the table is the one of `nph-table` (P97, P101), which the task does not change, but the parts the
  contract puts inside it — the sortable header, the selection column, the selected row, the more of
  each row and the `ajuste` column — have no place in its API: the header is text, the cells have no
  such types, and its drawing methods were private;
- the toolbar and the bulk action bar are `nph-toolbar` (P104), which reaches only its direct
  children for the size and the keyboard, so it cannot be drawn by the table around content of the
  consumer;
- the evidence says the column order, the searched term and the selected total "come from the
  data": the table must not search, sort or page by itself;
- the footer switches at 850 and 420 px, and there is no breakpoint token;
- the descending sort needs a down arrow, and the `nph-icon` core has none.

**Decision.** `nph-data-table` is a Web Component with **open Shadow DOM** (P01) that **extends the
class of `nph-table`**: every attribute, property, cell, event and rule of `nph-table` holds, and the
style of `nph-table` comes first, with the CSS of the data table over it, imported `?inline`. It has
no `::part` and no color property. Anatomy only through semantic tokens. What `nph-table` rejects
renders nothing, as P97; a cause of its own leaves out only the part it names and emits
`console.error` only in development, once per cause — the rule of P21. The names follow P64.

1. **Extension points of `nph-table`.** `nph-table` gains protected members that, by default, draw
   exactly what it drew before: before and after the scroll area, the header cell of a column, the
   cells before and after the header and the row of data, more classes for a row, the leading and
   trailing columns counted in every span, the body, and the rows drawn. Its development errors and
   warnings carry the tag of the element that reports them. Its tests do not change. This is the one
   change to `nph-table`, which the task otherwise leaves alone; drawing a second table would copy
   its checks and its cells. The Custom Elements Manifest plugin
   (`custom-elements-manifest.config.mjs`) reads the module the analyzer writes for a superclass,
   `/src/components/nph-table/nph-table`, as the source file, so the inheritance points at
   `dist/nph-table/nph-table.js` in the published manifest.

2. **Controlled data.** `rows` arrive already searched, sorted and paged. The table keeps what the
   person chose — `sort-key` and `sort-direction`, `selected`, `page` and `page-size` — and says so
   in `nph-sort-change` (`{ key, direction }`), `nph-selection-change` (`{ selected }`) and
   `nph-page-change` (`{ page, pageSize }`); it never orders, filters or cuts a list. A row carries
   `name`, the record that fills `{name}` in the names of its controls, and `switched`.

3. **Sorting (D-2, D-3).** A column with `sortable` draws its header as a native button the size of
   the cell, with the ring `focus/border` in `table/focus-ring-width` inside it; the sorted header
   carries `aria-sort`. The arrow is `arrow-up-arrow-down` while not sorted, `arrow-up` ascending and
   `arrow-up` turned half a turn descending, as `nph-pagination` turns its last arrow. A click sorts
   another column ascending and turns the sorted one around.

4. **Selection (D-4).** `selectable` adds a column of `nph-checkbox`, named by `select-all-label` in
   the header and `select-label` with `{name}` in each row. `selected` is the list of row keys; the
   header box checks or unchecks the rows drawn, keeps the ones of other pages, and is indeterminate
   when only part of the drawn rows is checked. The selected row takes
   `data-table/row-selected-background` and the mark `data-table/row-selected-indicator` in
   `data-table/row-selected-indicator-width` at the inline start. The table points the input border of
   its own boxes at `data-table/checkbox-border`, as `nph-dialog` points a color of its pieces (P87).

5. **The bars are slots.** The consumer puts an `nph-toolbar` of the page type in the slot `toolbar`
   and one of the bulk type in the slot `bulk`, as direct children of the table, so each bar keeps
   its own children. While a row is selected the bulk bar takes the place of the page bar, and the
   table writes its `count-text` from `selected-text` with `{count}` and `{total}`, filled in the
   language of the page. When the bulk bar leaves, or the footer, with the focus in it, the focus
   stays in the table: the header box, else a sortable header, the first piece of the page bar or
   the scroll area, which takes the focus from code, with `tabindex="-1"` while it holds it, even
   when it does not scroll.

6. **Row actions and `ajuste` (D-6).** `actions` holds the entries of an `nph-dropdown-menu` opened
   by the more of each row, an icon-only `nph-button` secondary ghost named `actions-label` with
   `{name}`; an entry fires `nph-row-action`, the event of `nph-table`, with the value of the entry.
   `switch-header` adds a column with an `nph-switch` per row, named `switch-label` with `{name}`,
   at the end of the row before the actions, and fires `nph-row-switch` (`{ row, checked }`).

7. **States (D-5).** `loading` draws an `nph-skeleton` in the cells of data — as many rows as the
   rows shown, or the page size — with the header visible. With no row, an `empty-heading` and a
   `clear-label`, the body holds the `nph-empty` and an `nph-button` that fires `nph-filter-clear`,
   `data-table/empty-gap` apart.

8. **The footer (D-1).** With `page-size` and more `total-items` than one page, the footer stays
   outside the scroll area, in `pagination-layout`: `wide` is the `nph-pagination` table type, with
   its own items per page; `middle` (the default, the master's case) is the label and the
   `nph-select` of items per page and the range type; `narrow` is the range type only. The consumer
   sets it for the width of the space until the breakpoint tokens exist.

9. **A row with `children`** is drawn without them, with an error: the tree is `nph-table`'s.

**Source.** Documentation `2875:17577`, set `2633:69628`, board `1371:282` and page `1371:2` of the
Figma file `DS-IA-NEPHOS 5.0`, accepted by Indiane on 28/10/2026 with the Figma UX QA and the textual
audit approved. The extension points, the controlled data, the slots, the names and the events are a
technical proposal of this implementation.

**Out of scope.** Load more and infinite scroll. A tree of records. A footer that switches by
itself before the breakpoint tokens. A new token.

**Status.** Anatomy and behavior accepted by Indiane on 28/10/2026. D-1 to D-6 of DSA-58 wait for
Indiane. API and semantics are reviewed in the pull request that brings them; the merge is the
approval.

---

## P106 — Up to two reruns of a browser test shard after a network change

**Technical conflict.** The browser tests fail now and then on the Azure agents with "Failed to
fetch dynamically imported module", in Vitest 4 and in Vitest 5 (P102). The Playwright provider,
with `VITEST_PW_DEBUG`, shows the cause: in build 612149, Vite served the test file with `200 OK`,
and 213 ms later Chromium failed 116 module requests with `net::ERR_NETWORK_CHANGED`. The agents
are not containers and share their host with other jobs. Chromium on Linux drops every request in
flight, localhost included, when an address or interface of the host changes
(`TransportClientSocketPool::OnIPAddressChanged` in `net/socket/transport_client_socket_pool.cc`).
At the Chromium of Playwright 1.62.1 (151.0.7922.34), no switch or feature turns that off on Linux,
and the Chromium bug 41144540 answers it as by design. Running one file at a time
(`--no-file-parallelism`) did not avoid it and made the run five times slower.

**Decision.**

- In the `Component tests (Chromium)` step of `azure-pipelines.yml`, a test shard that fails is run
  again, **up to twice**, each time only when the only failures of its last attempt come from the
  network change: each failed file failed to
  load and the cause of its own error in the log is "Failed to fetch dynamically imported module",
  for the file or for a module it loads first, such as the Storybook setup; no test failed; and
  every unhandled error is a Vitest tester that "did not become ready" while the log shows a module
  of the tester dropped with `net::ERR_NETWORK_CHANGED` (build 612881). `scripts/shard-rerun.mjs`
  decides it from the JSON report and the log of each attempt, holds the limit (`MAX_RERUNS`), and
  proves its own rules with probes (`--self-test`, in the repository checks of the pipeline).
- Any other failure fails the step at once, even next to a file that failed to load, and a shard
  that still fails after the second rerun fails the step.
- Each rerun, with its attempt number and its reason, is written to the log as an Azure warning.
- `VITEST_PW_DEBUG` stays on in that step, so the log shows whether `net::ERR_NETWORK_CHANGED` came
  with the failure. The infrastructure prints of the diagnosis leave.

**Reason.** The cause is outside the repository: the network of a shared host. A rerun limited to
that signature keeps every real failure as it is, and costs one shard, about two minutes, only when
the host changed its network. One rerun was not enough: in build 612908 the network of the host
changed twice, 1 min 40 s apart, the second time during the rerun.

**Impact.** Only the pipeline and the new `scripts/shard-rerun.mjs` change; the tests, the
configuration and `npm test` do not. Locally nothing changes.

**Out of scope.** `npm run test:package` in the Build stage, which can fail the same way (build
612025) and is not rerun. A dedicated agent or one whose network does not change during the job,
which removes the cause and is an infrastructure decision. Fewer module requests per import, such
as Font Awesome in one module, which changes `nph-icon` or the dependency configuration. A run that
hangs until the job timeout, which a rerun does not catch.

**Status.** Decided by Elvys on 29/10/2026 (rerun the shard, once) and changed by Elvys on
30/10/2026 (up to two reruns, with the same rule). Reviewed in the pull request that brings it; the merge
is the approval.

---

## P107 — `nph-progress`: API and semantics

**Technical conflict.** The accepted documentation (frame `4385:3186`, sets `4368:1532` and
`4368:1185`) gives one set with the Figma properties `tipo`, `tamanho`, `status`, `valor`,
`movimento`, `etapas`, `rótulo`, `valor em texto` and `ajuda`, and leaves the code API to the code.
Five points need a decision of their own:

- the bar must be read as a progress bar named by its label and described by its help text, and
  an id reference works only inside one shadow root, so a role on the host could not point at the
  texts the piece draws;
- the three types share one piece, and the status icon, the value text and the help text are
  optional texts whose words depend on the language of the page;
- in Figma `valor`, `movimento` and `etapas` are samples of continuous or open data, and success
  and error exist only at value 100 on the determinate type;
- the evidence says the indeterminate loop "runs only while there is no value and gives way to
  determinate at the first real value", without saying who switches;
- the minimum width of 48 px has no token, by decision of the accepted documentation.

**Decision.** `nph-progress` is a Web Component with **open Shadow DOM** (P01). It has no slot, no
event, no `::part` and no color property. Anatomy only through semantic tokens, the `progress/*`
ones. What it rejects renders nothing and emits `console.error` only in development, once per
cause — the rule of P66. The names follow P64.

1. **Properties.** `type` (`determinate`, the default, `indeterminate` or `steps`), `size` (`md`,
   the default, or `sm`) and `status` (`active`, the default, `success` or `error`), all three
   reflected because the internal CSS selects the parts by them. `value`, a number from 0 to 100,
   0 by default, read on `determinate`. `steps`, 3, 4 or 5, and `step`, the current one from 1 to
   `steps`, 1 by default, read on `steps`. `label`, `value-text` and `help`, the optional texts,
   already localized by the consumer: the piece writes no word of its own. The host `aria-label`
   names the bar when there is no `label`; it is read by a property whose attribute is
   `aria-label`, since a property called `ariaLabel` is the native ARIA reflection of the element.

2. **Semantics.** The `role="progressbar"` lives on the track, inside the shadow root, named by the
   label with `aria-labelledby` (or by the host `aria-label`) and described by the help text with
   `aria-describedby`. `aria-valuemin` is 0 and `aria-valuemax` 100. `determinate` gives
   `aria-valuenow` the value; `steps` gives it `round(100 * step / steps)`, 100 on success, so the
   current step counts, as it has the color of the done ones, and so does the errored one, since the
   text says which step it is; `indeterminate` omits it. `aria-valuetext` is `value-text`. The status
   icon, `circle-check` or `circle-xmark` in solid at `progress/icon-size`, is decorative.

3. **Invalid input.** A `type`, `size` or `status` outside the values; a `value` that is not a
   number from 0 to 100; success or error on `determinate` below 100, which the contract does not
   have, so `<nph-progress status="success">` alone, with its default 0, renders nothing; any status
   but `active` on `indeterminate`; a `steps` outside 3 to 5 or a `step` outside 1 to `steps`. An
   error without `help` renders and warns, because the contract requires the text and the text may
   arrive after the first render, as may the accessible name.

4. **Geometry.** The width is fluid: the host is 100% of the container with a minimum of `3rem`, the
   one literal measure of the CSS, written by decision of the accepted documentation and
   recorded in the header of `nph-progress.css`. Below 100 the indicator is `value%` minus
   `progress/track-gap`, never below zero, with the end stop, `progress/stop-size` on both sizes and
   never taller than the bar, at the end of the track; at 0 only the end stop remains; at 100 the
   indicator fills the track and the end stop goes.

5. **Motion.** The only motion is the indeterminate loop: one segment, a third of the track, one pass
   in `progress/loop-duration` with `progress/loop-easing`, from outside the left edge to outside the
   right edge, so it is never stopped in the middle, and back with no transition. It exists only on
   `type="indeterminate"`: the consumer switches `type` to `determinate` when the first real value
   arrives, which is how the loop "gives way". With reduced motion the loop stops and the segment
   rests at the start of the track, with the state word beside it (WCAG 2.3.3).

6. **Steps.** One equal segment per step, apart by `progress/segment-gap`, each as tall as the bar.
   On active the segments up to `step` are done and the rest pending; on error the done ones, the
   `step` one in error and the rest pending; on success all in success. The step counts are the
   three of the accepted Figma set; another count is a pending decision of Indiane (D-1 of DSA-65).

**Source.** Documentation `4385:3186`, sets `4368:1532` and `4368:1185` and page `1626:26` of the
Figma file `DS-IA-NEPHOS 5.0`, accepted by Indiane on 05/11/2026 with the Figma UX QA and the
textual audit approved. The property names, the semantics, the invalid-input rule and the choice of
who switches the type are a technical proposal of this implementation.

**Out of scope.** `nph-stepper`, a task list and a summary card, which the accepted documentation
leaves out of this piece. A width token. A free color. A new token.

**Status.** Anatomy and behavior accepted by Indiane on 05/11/2026. D-1 of DSA-65 waits for Indiane.
API and semantics are reviewed in the pull request that brings them; the merge is the approval.

---

## P108 — `nph-notification`: API and semantics

**Technical conflict.** The accepted documentation (frame `3442:10163`, set `3434:9035`, page
`1369:2`, close focus on solid `4207:1146`) gives one set with the Figma properties `placement`,
`severity`, `emphasis`, `layout`, `título`, `ações`, `ação secundária`, `fechar` and
`barra de tempo`, and leaves the code API to the code. Six points need a decision of their own:

- the booleans are texts and parts the consumer supplies, not states: the code has to say how the
  title, the actions, the close button and the time bar come in, and how the person's answer comes
  out;
- `nph-button` has no color property and no `::part` (P68), yet the contract asks for a ghost
  secondary action in the color of each severity, and a close button on solid with its own hover
  and a focus border without the halo;
- the toast that closes by itself has a time rule (WCAG 2.2.1), pause rules and exceptions
  (error, loading, an action), and the evidence does not say who runs the timer or who removes the
  element;
- single-line must reflow to stacked "once the text goes beyond one line", which the CSS alone
  cannot know;
- the evidence describes the announcement only for the toast, and the piece has an inline
  placement too;
- the toast region is described as a stack at the corner of the screen with its own gap, but it is
  not a piece of the set, and the minimum width of 320 px has no token.

**Decision.** `nph-notification` is a Web Component with **open Shadow DOM** (P01), CSS in its own
file imported `?inline`. It has no slot, no `::part`, no color property and no form association.
Anatomy only through semantic tokens, the `notification/*` ones. Invalid input renders nothing and
emits `console.error` only in development, one per cause while it lasts — the rule of P21 and
P66. The names follow P64.

1. **Properties.** `placement` (`inline`, the default, or `toast`), `severity` (`info`, the
   default, `success`, `warning`, `error`, `help`, `neutral` or `loading`), `emphasis` (`subtle`,
   the default, or `solid`) and `layout` (`stacked`, the default, or `single-line`), all four
   reflected because the internal CSS selects by them. `heading` is the Figma `título`, optional,
   and `description` is required; both are already localized by the consumer, and the piece writes
   no word of its own. The name is `heading`, not `title`, the global HTML attribute that the
   browser would show as a native tooltip. `action` and `secondary-action` are the text of the
   Figma `ações` and `ação secundária`; `hide-close` is the Figma `fechar` turned around, so that
   the default is the close button on; `close-label` is the accessible name of the close button,
   required while it is shown, as in `nph-dialog` (P87). `duration`, a number of milliseconds,
   6000 by default. `time-bar` is the Figma `barra de tempo`.

2. **Invalid input.** A value outside a list; an empty `description`; `loading` outside the subtle
   toast; a `duration` that is not 0 and is below 6000, negative or not a number; `secondary-action`
   without `action` where it would be drawn (not on single-line); `time-bar` outside a subtle toast, on error, on loading, with an action that is drawn or with
   `duration` 0; a visible close button with no `close-label`. What the Figma set says "has no
   effect" is not invalid, it is not drawn: the actions on solid and on loading, the secondary
   action on single-line and the close button on loading; and a valid `duration` on inline, on
   error, on loading or with an action is ignored.

3. **Events and who removes.** `nph-action` carries `detail.action`, `primary` or `secondary`, and
   `nph-close` carries `detail.source`, `close-button` or `timeout`, the vocabulary of
   `nph-dialog`. Both bubble and cross the shadow root; `nph-close` is cancelable. Without
   `preventDefault()` the notification hides itself with `hidden`; the consumer removes the element.
   The piece never removes itself and does not close after an action.

4. **Time.** A toast that closes by itself stays `duration` milliseconds, 6000 by default; 0 keeps
   it; below 6000 is invalid (WCAG 2.2.1). The piece runs the timer: it pauses while the pointer is
   over the toast and while focus is inside it, and goes on with what was left. Error, loading and a
   toast with an action never close by themselves, whatever `duration` says. When the consumer
   cancels `nph-close` after a timeout, the toast stays and the time does not restart.

5. **Announcement.** The host is `role="alert"` on error and warning and `role="status"` on the
   others, and never takes or moves focus. The evidence specifies this for the toast; applying the
   same rule to inline is an extension of this piece. The severity icon is decorative. The close
   button is an icon-only `nph-button`, named by `close-label`, with the tooltip of that piece.

6. **Reflow.** A single-line notification measures its text on a hidden twin that does not wrap,
   and takes the stacked layout while everything does not fit on one line, with the action below
   the text. The width of a toast stays the one of the layout it declared. The mark is internal, not
   API.

7. **Touch.** With `pointer: coarse` the actions take the size large of `nph-button`, and the touch
   area of the close grows to `control/height-large` with no change in its drawing.

8. **Composition: the public tokens of `nph-button`.** Nothing inside is reimplemented and no
   inner piece changes. `nph-button` has no color property and no `::part`, so the colors of the
   contract go through the public custom properties it already reads, set only on the element inside
   the notification, never on the page: the pattern of `nph-dialog` (P87) and `nph-toolbar` (P104).
   - The secondary action is a ghost `nph-button`, primary, and danger on error, and its
     `color/primary-on-surface` and `color/primary-surface` (or `color/destructive-on-surface` and
     `color/destructive-surface`) point at `notification/<severity>-action-foreground` and
     `notification/<severity>-action-background-hover`. This goes one step beyond the precedent: the
     dialog and the toolbar point component tokens of the button, but the ghost exists only in
     primary, secondary and danger and no component token of the button carries the color of the
     other severities, so a semantic token of the button is pointed.
   - The close on solid points `color/secondary-foreground` at the text color,
     `icon-button/secondary-ghost-background-hover` at the contract color mixed to the opacity of
     `notification/close-background-hover-opacity`, `focus/border` at
     `notification/close-focus-border`, `focus/halo` at transparent and `border/width` at
     `notification/close-focus-border-width`, which only the focus border of the button reads.
   - The main action is the `nph-button` of the type of the severity, solid, and primary on neutral;
     the spinner and the skeleton keep their own tokens. No token is created or changed.

9. **Geometry and elevation.** The inline notification takes the width of its area. The toast is
   `notification/toast-width` stacked and `notification/toast-width-max` single-line, never wider
   than its container, and uses `elevation/modal` directly, because an effect style is not a variable
   and the build does not accept a shadow alias; in dark mode `shadow/color` is transparent, so the
   toast has no shadow. The minimum of 320 px of the contract has no token: it holds by construction,
   since the width of the toast comes from its token.

10. **The toast region is not a piece.** It is the container of the consuming application, at the
    bottom-right corner, with `notification/stack-gap` between the toasts, at most three visible, the
    newest next to the corner and in front. The CSS of the piece does not read `notification/stack-gap`.
    The sheet teaches how to build the region. A loading toast turns into success or error in the same
    toast when the consumer changes `severity`. Whether the region becomes a piece is pending decision
    D-1 of DSA-63.

11. **The time bar.** An `nph-skeleton` line, stopped, decorative, as the Figma set shows it, until
    `nph-progress` (DSA-65) is wired in; that is left for later, as are `nph-link`, for an action
    that navigates, and `nph-alert-dialog`, for what needs an answer.

**Source.** Documentation `3442:10163`, set `3434:9035` and page `1369:2` of the Figma file
`DS-IA-NEPHOS 5.0`, accepted by Indiane on 04/11/2026 with the Figma UX QA and the textual audit
approved, and the appendix points answered. The property names, the invalid-input rule, the events,
who runs the timer and who removes the element, the reflow by measurement, the announcement on inline
and the use of the public tokens of `nph-button` are a technical proposal of this implementation.

**Out of scope.** The toast region as a piece, a toast manager or a queue, `nph-alert-dialog`,
`nph-progress` in the time bar, `nph-link`, a width token for the minimum of 320 px, a free color and
a new token.

**Status.** Anatomy and behavior accepted by Indiane on 04/11/2026. D-1 of DSA-63 waits for Indiane
and does not block the piece. API and semantics are reviewed in the pull request that brings them;
the merge is the approval.

---

## P109 — `nph-breadcrumb`: API and semantics

**Technical conflict.** The accepted documentation (frame `4512:4741`, sets `4490:2886`, `4490:2678`
and `4490:2697` and separator `1635:16`) gives the Figma properties `niveis`, `ícones`, `tipo`,
`state`, `rótulo` and `ícone`, and leaves the code API to the code. Six points need a decision of
their own:

- the path is a list of levels, each with a text, a destination and an optional icon, and the last
  one is not a link: the code has to say how that list goes in, since a slot could not enforce "every
  level above has an `href`, the current page has none";
- in Figma `niveis` is `2`, `3`, `4` or `recolhido`, a count of levels and a mode in one property,
  and the evidence says "use collapsed when the trail does not fit the width" without saying who
  decides;
- the ellipsis opens the hidden levels in an `nph-dropdown-menu`, which needs a trigger by `for`
  in the same root, writes `aria-haspopup` and `aria-expanded` on it, and fires `nph-item-select`,
  while the trail must behave as a list of links, where an activated level is a navigation;
- the menu width hugs the widest option between a floor and a ceiling, and `nph-dropdown-menu` keeps
  a fixed width of `layout/input-width` until a round of its own (accepted point 4 of the evidence);
- the contract says nothing about a trail with 5 or more levels that is not collapsed, nor about an
  icon in the menu of the hidden levels;
- the piece has no loading state, by decision of the accepted documentation, and a trail that does
  not fit is a layout decision of the page.

**Decision.** `nph-breadcrumb` is a Web Component with **open Shadow DOM** (P01). It has no slot, no
event, no `::part` and no color property. Anatomy only through semantic tokens, the `breadcrumb/*`
ones and the global focus ones. What it rejects renders nothing and emits `console.error` only in
development, once per cause — the rule of P66. The names follow P64.

1. **`levels` is a property.** The path is a list of `{ label, href?, icon? }`, from the first level
   to the current page, set by property only (no attribute, no slot): a list of objects does not
   serialize to an attribute, and a slot per level could not check the rule of the last level. The
   last level is the current page. The texts are already localized by the consuming application: the
   piece writes no word of its own. The first level reads "Home", as the evidence says.

2. **`collapsed` is a boolean chosen by the consumer.** It is the Figma `niveis=recolhido`, and it
   reflects, so the consumer can style and check the state. Off, the trail draws every level and
   accepts 2, 3 or 4, the counts of the accepted Figma set; more than 4 renders nothing (D-1).
   On, it draws the first level, the ellipsis and the last two levels, and the levels in between go
   to the menu; it needs 4 levels or more, since with 3 there would be nothing to hide. The
   consumer chooses it because the width is the page to know: the piece does not measure itself,
   so it never changes shape without the page asking, and the same `levels` renders the same trail.

3. **Icons: all or none.** `icon` on a level is the core name of an `nph-icon` and has the Figma
   rule `ícones=com`: every level has its own, in the light style on a link and the solid style on
   the current page, in the color of its label. A trail with an icon on only some of the levels, or
   with an icon outside the core, renders nothing. The menu of the hidden levels carries no icon,
   because the contract does not say it does (D-2).

4. **`href` above the current page, none on it.** Every level above the current page is a link and
   needs an `href`; the current page is text with `aria-current="page"` and has none. A level that
   breaks it renders nothing: a link with no destination is a dead end, and a current page that
   leads somewhere is the link to itself that the evidence forbids. The `href` is also parsed as the
   browser would (`new URL(href, document.baseURI)`) and only `http:`, `https:`, `mailto:` and `tel:`
   are taken, so `javascript:` and its obfuscated spellings, such as `java` plus a line break plus
   `script:`, render nothing: the path may come from untrusted data, and it reaches both the visible
   link and the anchor the menu clicks. It is the rule of the link cell of `nph-table`.

5. **The accessible name.** `label` names the navigation landmark; the host `aria-label` does it
   when there is no `label`, read by a property whose attribute is `aria-label` (as in P107), since
   a property called `ariaLabel` is the native ARIA reflection of the element. A trail with neither
   renders and warns once in development, because the name may arrive after the first render, as in
   P107. `ellipsis-label` is the accessible name of the ellipsis button, and it is required on the
   collapsed trail, since the icon has no text; without it the collapsed trail renders nothing.

6. **The ellipsis is a native button of the shadow root.** The `nph-dropdown-menu` beside it finds
   the button by `for` in the same root (P77, P92) and writes `aria-haspopup="menu"` and
   `aria-expanded` on it. The open state of the button is read from `aria-expanded` in CSS, so the
   hover look stays while the menu is open. It is a native `button` and not an `nph-button` because
   the `nph-button` does not pass `aria-haspopup` and `aria-expanded` to its inner button (a known
   limit of `nph-dropdown-menu`), and the open look of the ellipsis depends on them. Its target is
   `breadcrumb/ellipsis-target-size`.

7. **A hidden level activated is a native click.** The `nph-item-select` of the menu does not leave
   the trail: the piece stops it and clicks a hidden anchor of its own shadow root, set to the `href`
   of the chosen level. The result travels the way a visible link does, a native `click` that bubbles,
   is `composed` and cancelable, and a router that listens to the click on the document handles it
   as it handles a link. The piece fires no event of its own and adds no API to be told apart from a
   link. The limit is recorded in the sheet: `target` and the modifier keys do not apply to a click
   made by code.

8. **The width of the menu.** The `nph-dropdown-menu` panel reads its width from
   `--nph-layout-input-width`, the one custom property it already exposes for that, and P02 forbids
   reaching into its inside. The breadcrumb sets that property on its own menu element:
   `breadcrumb/menu-max-width` for every browser, so the menu never passes the ceiling and the text
   is cut by the ellipsis the menu already draws; and, under
   `@supports (inline-size: calc-size(fit-content, size))`,
   `calc-size(fit-content, clamp(breadcrumb/menu-min-width, size, breadcrumb/menu-max-width))`, which
   hugs the widest option between the floor and the ceiling. The floor and the ceiling are
   `breadcrumb/menu-min-width` and `breadcrumb/menu-max-width`. It holds only in the breadcrumb: the
   `nph-dropdown-menu` keeps its fixed `layout/input-width` until a round of its own, as the evidence
   says. Where `calc-size()` does not exist, the menu keeps the ceiling as a fixed width, as the
   `nph-dropdown-menu` does by itself: the hug and the floor do not hold, and the sheet records it.
   A `fit-content(<length>)` middle step was not kept: a browser that lacks `calc-size()` may lack it
   too, and an invalid width would leave the panel with no ceiling.

9. **One line.** The trail is `nowrap` and never shrinks. A trail that does not fit is a trail the
   page must collapse, and the sheet records that the choice is the consumer's. Collapsing by itself
   would need a measure the piece cannot read before it renders, and would change the shape of the
   trail with no one asking.

10. **Right-to-left.** The chevron of the separator mirrors by `:dir(rtl)`, as the evidence says;
    the order of the levels follows the reading direction of the page.

11. **Loading.** The piece has no loading state. During loading, a line of `nph-skeleton` takes the
    place of the trail, as a documentation rule that the consuming application applies.

12. **Invalid input.** A `levels` that is not a list or has fewer than 2 levels; more than 4 levels
    on a trail that is not collapsed; a collapsed trail with fewer than 4 levels; a level without
    `label`; a level above the current page without `href`, or the current page with one; an `icon`
    outside the core or on only some of the levels; a collapsed trail without `ellipsis-label` — each
    renders nothing and emits `console.error` only in development, once per cause: a re-render with
    the same input stays silent, and a fixed input draws again with no leftover. A trail without an
    accessible name renders and warns once.

**Source.** Documentation `4512:4741`, sets `4490:2886`, `4490:2678` and `4490:2697` and separator
`1635:16` of the Figma file `DS-IA-NEPHOS 5.0`, accepted by Indiane on 06/11/2026 with the Figma UX
QA and the textual audit approved, and the points of its approval page. The property names,
the shape of `levels`, the semantics, the invalid-input rule, the native click of a hidden level and
the way the menu width is applied are a technical proposal of this implementation.

**Out of scope.** An `nph-link`: the link stays an inner piece of the breadcrumb until it exists. An
icon in the menu of the hidden levels. The radius of the menu and the focus border of the menu item,
which a round of `nph-dropdown-menu` reviews. A trail of 5 or more levels without `collapsed`. A
collapse by width done by the piece. A loading state. A new token.

**Pending decisions for Indiane.**

- **D-1 — 5 or more levels without collapsing.** The accepted set draws 2, 3 or 4 levels, or the
  collapsed trail. The code refuses 5 or more levels on a trail that is not collapsed and asks for
  `collapsed`. If the product has paths that long and wants them drawn in full, the contract needs
  new counts; Figma does not have them.
- **D-2 — an icon in the menu of the hidden levels.** The contract says the menu has no header and
  no group label, and says nothing about the icon of each level. The code draws the hidden levels as
  text only, even when the trail has icons. If the menu should carry the icon of the level, Indiane
  decides, and it is a round of the breadcrumb and of the item of `nph-dropdown-menu`.

**Status.** Anatomy and behavior accepted by Indiane on 06/11/2026. D-1 and D-2 wait for Indiane.
API and semantics are reviewed in the pull request that brings them; the merge is the approval.

---

## P110 — `nph-navigation-menu`: API and semantics

**Technical conflict.** The accepted documentation (frame `3977:7913`, sets `3969:7897`, `3957:6662` and
`3957:6722`) gives the Figma properties `largura`, `aberto`, `tipo`, `state`, `rótulo`, `ícone`, `título`,
`descrição` and `mostrar descrição`, and leaves the code API to the code. Eight points need a decision of
their own:

- the bar is composition: how many top items, groups and links there are is not a property, and a slot
  could not enforce "a trigger has groups, a group has links, a link has a destination";
- `largura` is a mode of the piece (`larga` and `estreita`), and the evidence says "use narrow when the
  items do not fit on one line" without saying who decides;
- `aberto` is one Figma property, but it means the panel of one of several triggers when wide and the
  vertical list when narrow;
- the evidence has the state `atual` for the top item of both types, a trigger included, and does not say
  who turns it on for a trigger, which is a button that goes to no page;
- the Menu button is the `nph-icon-button`, and the evidence gives it `aria-expanded`, while `nph-button`
  does not pass `aria-expanded` to its inner native button (the limit P109 point 6 records for the
  ellipsis of the breadcrumb);
- the evidence closes the panel 0.5 s after the pointer leaves and opens it after 0.3 to 0.5 s, and asks
  for `motion/hover-delay`, which is 300 ms and has no semantic token for 500 ms;
- the evidence does not say how a trigger and its groups show in the narrow list;
- the evidence has no motion for the arrow or for the panel.

**Decision.** `nph-navigation-menu` is a Web Component with **open Shadow DOM** (P01). It has no slot, no
event, no `::part` and no color property. Anatomy only through semantic tokens, the `navigation-menu/*`
ones and the global ones the evidence names (focus, `state/disabled-opacity`, `elevation/dropdown`, the
text roles). What it rejects renders nothing and emits `console.error` only in development, once per
cause — the rule of P66. The names follow P64.

1. **`items` is a property.** The top items are a list: a link item is `{ label, href, current?,
   disabled? }` and a trigger item is `{ type: 'trigger', label, value?, groups, disabled? }`; a group is
   `{ label?, links }` and a link is `{ title, href, description?, icon?, current?, disabled? }`. Set by
   property only (no attribute, no slot): a list of objects does not serialize to an attribute, and a slot
   could not check the rule of each level. The texts are already localized by the consuming application:
   the piece writes no word of its own. `href` takes `http:`, `https:`, `mailto:`, `tel:` or a relative
   address, parsed as the browser would (`new URL(href, document.baseURI)`), so `javascript:` and its
   obfuscated spellings render nothing; it is the rule of `nph-breadcrumb` (P109 point 4) and of the link
   cell of `nph-table`. A disabled link needs no `href`.

2. **`narrow` is a boolean chosen by the consumer.** It is the Figma `largura=estreita`, and it reflects.
   The piece does not measure itself: the width is the page's to know, so it never changes shape without
   the page asking, and the same `items` renders the same bar. It is the rule of `collapsed` in P109
   point 2. A narrow bar needs `menu-label`, the accessible name of the Menu button, and renders nothing
   without it.

3. **`open` and `active`.** `open` is the Figma `aberto=sim`, a boolean that reflects: wide, it shows the
   panel of the active trigger; narrow, the list. The piece turns it on and off, and the consumer may set
   it. `active` is the `value` of the trigger whose panel `open` shows; a trigger without `value` has its
   index as text, and an empty or unknown `active` falls back to the first trigger that is not disabled.
   A click on a trigger writes both. The piece fires no event: the consumer needs none to draw the bar,
   and the evidence defines none. A bar that changes width while open closes.

4. **The current state.** `current` on a link, the top one or a panel one, marks the page. A menu has one
   current page, and more than one renders nothing. The state `atual` of a trigger is **derived**: a
   trigger shows as current when its panel holds the current link, so there is a single place that says
   where the person is (D-2). The link carries `aria-current="page"`; a trigger that holds the current
   link carries `aria-current="true"`, which is the section and not a page. The indicator is a part of its
   own, hidden from assistive technology, and always comes with the current text color (WCAG 1.4.1). A
   current item does not change on hover: the evidence has no hover state for it. The current panel link
   draws its icon solid, since solid marks the active item (AGENTS.md); the icon of the other links stays
   light, and it does not swap to solid on hover, as the item of `nph-dropdown-menu` does, because the
   evidence gives the icon a hover color and no swap.

5. **The accessible name.** `label` names the navigation landmark; the host `aria-label` does it when
   there is no `label`, read by a property whose attribute is `aria-label` (as in P107 and P109 point 5).
   A bar with neither renders and warns once in development, because the name may arrive after the first
   render. A trigger is named by its label, and a panel link by its content: the title and, when it has
   one, the description. A link is not given `aria-labelledby` on its title, because the visible
   description would then be outside its name (the axe rule `label-content-name-mismatch`).

6. **Disclosure navigation.** A `nav` with a name; each trigger is a native `button` with `aria-expanded`
   and `aria-controls` pointing to its panel, in the same shadow root. The panel comes right after its
   trigger in the DOM, so it is in the Tab order right after it, and a closed panel is out of it. Enter
   and Space open and close it; Esc closes it and gives the focus back to the trigger; a click outside, and
   the focus leaving the bar, close it; following a link closes it. There are no arrow keys: it is not a
   menubar, as the evidence says.

7. **The layer.** The panel is a `popover="manual"`, so it lives in the top layer, as the balloon of
   `nph-tooltip` (P77) and the panel of `nph-dropdown-menu` (P92): no `z-index` and no clipping by an
   ancestor. It opens `navigation-menu/panel-offset` below its control, aligned to its start edge (the
   right one in right-to-left writing), and never leaves the window sideways. It follows the trigger on
   scroll and resize. It never turns up: the bar is always at the top of the page, which the evidence
   says. The wide panel hugs its content; the narrow panel and the panel link take
   `navigation-menu/panel-width`, as the evidence says. In a window narrower than its content the groups
   shrink to fit it. It does not depend on the `nph-popover` (DSA-67).

8. **The pointer.** A trigger opens when the mouse rests on it for `motion/hover-delay`, and the panel
   closes the same time after the pointer leaves the trigger and the panel, and stays open while the
   pointer is over either. The evidence asks for 0.5 s to close and has no semantic token for it:
   `motion/hover-delay` is 300 ms and `core/duration-delay-long` is 600 ms, and a component never reads
   `core/*`. The piece reads `motion/hover-delay` for both, read the way `nph-tooltip` reads it, and the
   difference is the pending decision D-4. A click on a trigger the pointer opened keeps it open until
   another click, so the click that follows a hover does not close what it just meant to open. Touch and
   pen open by click only.

9. **The Menu button.** It is a native `button` in the shadow root, with `aria-label` from `menu-label`,
   `aria-expanded` and `aria-controls`, drawn with the tokens of the secondary ghost `nph-icon-button`
   (`icon-button/secondary-ghost-background-hover`, `color/secondary-foreground`),
   `control/height-default` square, `radius/control` and the global focus tokens, with the `bars` icon and
   an `nph-tooltip` with `relation="name"` and the same text, as every icon-only button carries (P86). It
   is a native `button` and not an `nph-button` for the reason of P109 point 6: the `nph-button` does not
   pass `aria-expanded` to its inner button, and the evidence gives the Menu button `aria-expanded`. The
   look of the open button is read from `aria-expanded` in CSS.

10. **The narrow list.** It opens the same items as a vertical list in a panel `panel-width` wide. Each
    trigger shows as a group: its label is the label of the group (drawn as the group label of
    `nph-dropdown-menu`, by a CSS replica, since `nph-dropdown-menu` is one tag, P92, and its label cannot
    be imported), followed by its groups and links; the top links come together in one section; the
    sections are separated by a horizontal `nph-separator`, `group-gap` apart. The current link is marked.
    The evidence does not say how a trigger shows here (D-1).

11. **Motion.** The evidence has no motion for the arrow or the panel, so the arrow does not turn and the
    panel enters and leaves with no transition (D-3).

12. **Invalid input.** An `items` that is not a list or is empty; an item with a `type` other than `link`
    and `trigger`; a link or a panel link without `label` or `title`; a link without `href` that is not
    disabled, or with a protocol other than the four; a trigger without `groups` or a group without
    `links`; an `icon` outside the core; two triggers with the same `value`; more than one current link;
    a narrow bar without `menu-label` — each renders nothing and emits `console.error` only in
    development, once per cause: a re-render with the same input stays silent, and a fixed input draws
    again with no leftover. A bar without an accessible name renders and warns once. A missing
    `motion/hover-delay` opens and closes on hover with no wait and reports it once.

**Source.** Documentation `3977:7913` and sets `3969:7897`, `3957:6662` and `3957:6722` of the Figma file
`DS-IA-NEPHOS 5.0`, accepted by Indiane on 03/11/2026 with the Figma UX QA and the textual audit approved,
and the twelve points of its appendix answered as recommended. The property names, the shape of `items`,
the semantics, the invalid-input rule, the derived current state of the trigger, the use of
`motion/hover-delay` for closing and the narrow list are a technical proposal of this implementation.

**Out of scope.** A featured card inside the panel, a menubar pattern and more than one level of panels,
as the task says. A new token. A change in `nph-dropdown-menu`, `nph-icon-button`, `nph-separator` or
`nph-icon`. A collapse by width done by the piece. A motion for the arrow or the panel.

**Pending decisions for Indiane.**

- **D-1 — a trigger in the narrow list.** The evidence says the Menu button opens "the same items as a
  vertical list" and does not say how a trigger and its groups show. The code shows each trigger as a
  group, with its label as the group label, and its links below. If the list should fold the groups of a
  trigger, Indiane decides.
- **D-2 — who turns on the current state of a trigger.** The evidence has the state `atual` for the top
  item of both types. The code derives it from the current link in the panel. If a trigger should be
  marked current on its own, a new field would be needed.
- **D-3 — motion.** The evidence has no motion for the arrow or the panel. The code has none: the arrow
  does not turn and the panel enters and leaves with no transition.
- **D-4 — the closing wait.** The evidence says 0.5 s to close and the token `motion/hover-delay` is
  300 ms, with no semantic token for 500 ms. The code uses `motion/hover-delay` for opening and closing.
  If the closing wait must be 500 ms, a token is needed, and tokens come from Figma. **Answered on
  2026-11-09; see P114 (item 7).**
- **D-5 — the contrast of the current text in dark mode.** `navigation-menu/current-foreground` is
  `color/primary-hover`, which in the dark scheme resolves to a dark shade in four brands, over the dark
  bar (1.49:1 to 2.16:1). The `Brands` story carried `BRAND_CONTRAST_EXCEPTION`, as the sidebar item and
  the dropdown menu did for the same token (DSA-36, D2). **Answered on 2026-11-09:** the token is
  `color/primary-text` and the exception left the story (P114).

**Status.** Anatomy and behavior accepted by Indiane on 03/11/2026. D-1 to D-5 wait for Indiane. API and
semantics are reviewed in the pull request that brings them; the merge is the approval.

---

## P111 — `nph-popover`: API and semantics

**Technical conflict.** The accepted documentation (frame `4749:5857`, set `4727:1544`) gives the
Figma properties `lado`, `alinhamento`, `seta`, `tamanho`, `descrição`, `corpo`, `fechar` and
`rodapé`, and leaves the code API to the code. Seven points need a decision of their own:

- the popover is anchored to a trigger that stays outside it, and the evidence asks the trigger to
  carry `aria-haspopup`, `aria-expanded` and `aria-controls`: the code has to say how the two find
  each other, and where an id reference can point, since the surface lives in a shadow root;
- the trigger in the open state takes the `hover-active` look with no new `nph-button` variant
  (accepted point 18), and `nph-button` paints that state only inside its own shadow root, from its
  own `:hover`, and does not pass `aria-haspopup` and `aria-expanded` to the native button (a known
  limit of the `nph-dropdown-menu` sheet);
- the evidence says the popover closes with Esc, a press outside, the close button or the footer
  action and that the focus returns to the trigger, and says nothing about the focus on open, about
  Tab, about what a footer action is, or about the event;
- the offset is 4 and the arrow is 8 tall and 16 wide, with no word on where they meet;
- the footer buttons are compact and go back to the default size on a touch screen, and the buttons
  are the consumer's, so the size attribute cannot be set by the popover;
- the title and the description are bound in Figma to core typography, and the popover consumes no
  core token;
- a surface that does not fit on the side asked for, or in the window, needs a rule, and the
  contract is silent.

**Decision.** `nph-popover` is a Web Component with **open Shadow DOM** (P01). Anatomy only through
semantic tokens: the `popover/*` ones, `elevation/dropdown`, the motion roles and the text roles. It
has no `::part` and no color property. What it rejects renders nothing and emits `console.error`
only in development, once per cause: the rule of P21. The names follow P64.

1. **The trigger is found by `for`, in the same root.** The popover looks the element up by id with
   `getRootNode()`, like `nph-tooltip` (P77) and `nph-dropdown-menu` (P92), one frame later when it
   was rendered right after. The trigger stays outside the component. The popover writes
   `aria-haspopup="dialog"` (unless the trigger already has one), `aria-expanded` and
   `aria-controls` on it and removes what it wrote when it leaves. `aria-controls` points to the id
   of the popover **host**, which the popover generates when the consumer gave none: the surface is
   in the shadow root, and an id reference does not cross it (D-3). A disabled, `aria-disabled` or
   loading trigger opens nothing.

2. **The open trigger is a state of `nph-button`, not a variant (Q1, option A; amends P68).** An
   `nph-button` that carries `aria-haspopup="dialog"` and `aria-expanded="true"` on the host draws
   the `hover-active` state, icons included, through an internal `data-nph-open` marker, and hands
   `aria-haspopup` and `aria-expanded` to its native button, which is the element with a role. It is
   a state read from the attributes, so the API of `nph-button` does not change: the two attributes
   are observed with `observedAttributes`, not declared as properties. The scope is deliberately the
   value `dialog`: the trigger of an `nph-dropdown-menu` carries `menu` and keeps its look and the
   limit its sheet records (D-2). `aria-controls` stays on the host: it cannot cross the shadow root
   of the button either. The task does not list `nph-button` among the pieces it does not change.

3. **`open`, `heading` and `description`.** `open` reflects; the trigger toggles it and the consumer
   may set it. `heading` is required, already localized, always visible: the `<h2>` of the surface
   and its accessible name by `aria-labelledby`. `description` is optional and is the
   `aria-describedby`. The surface is a **non-modal `dialog`**: no `aria-modal`, no inert page, no Tab
   trap. The piece writes no word of its own.

4. **`side`, `align`, `arrow` and `size` reflect.** The consumer states what it asks for and the
   internal CSS selects by it. The side the surface **resolved to** is `data-side` on the surface, not
   on the host, so a turn does not rewrite what the consumer set. `side` is `bottom` (default), `top`,
   `right` or `left`; `align` is `start`, `center` (default) or `end`; `size` is `sm`, `md` (default)
   or `lg` and changes only the width. A value outside a list renders nothing.

5. **Placement and the turn.** The surface is a `popover="manual"`, so it lives in the top layer: no
   `z-index`, no clipping by an ancestor, as the `nph-dropdown-menu` panel (P92). JavaScript sets its
   `top` and `left` from the trigger. The distance is `popover/offset` as a margin on the edge that
   faces the trigger. The surface turns to the **opposite side when the one asked for does not fit and
   the opposite has more room**, never leaves the window, follows the trigger on scroll and resize,
   and is hidden while the trigger is out of the window. The sides are physical; `start` and `end`
   follow the writing direction on the top and bottom sides, and are the top and the bottom on the
   others. The height follows the content and is not constrained.

6. **The arrow.** Off by default and decorative (`aria-hidden`). It is an inline SVG whose view box
   carries the direction, so no rotation is written and no literal enters the CSS; it is
   `popover/arrow-width` by `popover/arrow-height`, filled in `popover/background`, outlined in
   `popover/border` on its two slanted edges only (`vector-effect: non-scaling-stroke`), and its base
   overlaps the border by one border width so the fill covers the border under it. It keeps
   `popover/arrow-inset` from the corner with `start` and `end` and sits in the middle with `center`.
   When the window pushes the surface sideways, the arrow slides back by the same amount, never
   closer to a corner than the inset, so the tip still points to the trigger. **With the arrow, the
   tip keeps `popover/offset` from the trigger and the surface sits one arrow height further**: the
   only reading that does not overlap the two measures (D-1).

7. **Close and focus.** It closes with Esc, a press outside the surface and the trigger, the close
   button, the footer action, or the focus leaving the popover for the page. The `nph-close` event
   (`bubbles`, `composed`, `cancelable`, `detail: { source }` with `escape`, `outside`, `close-button`
   or `focus-out`) is fired before the close when the person asks, and `preventDefault()` keeps it
   open: the shape of `nph-dialog` (P87). The trigger, a footer action and `open` set from code never
   fire it; **a footer action closes the popover because the consumer sets `open` to `false` in the
   handler of its button**, so no attribute is invented on the button. The focus returns to the
   trigger on any close in which it was inside the popover, which covers Esc, the close button and
   the footer action; a press outside and the focus leaving leave it where the person put it. Esc
   runs in the bubbling phase, after the controls of the body, so a control that used the key (an open
   `nph-select` list) keeps it; with more than one popover open it belongs to the last one shown; it stops
   at the popover and does not reach a dialog around it (P77, item 4). While the surface leaves, it is
   `inert`: it is still in the top layer, but takes no focus and no click. Closing on the focus
   leaving is an addition of this decision: the contract lists four closes, and a non-modal surface
   that stays open over the content after Tab would cover it.

8. **Focus on open: the rule of P87.** The first element with `autofocus` in the body or the footer;
   otherwise the first focusable element of the body, then of the footer, then the close button, then
   the surface itself (`tabindex="-1"`), looking into open shadow roots and slots. The rule runs again
   once the pieces have drawn, only for the same opening and only if the focus is still where it put
   it. The helpers are copied from `nph-dialog`: there is no shared helper.

9. **Parts.** The default slot is the body (`nph-field`) and the `footer` slot takes the actions; both
   are shown only when they have content, and **the divider comes with the footer**: with no footer
   there is none. `closable` draws the close button, a compact ghost secondary `nph-button` with the
   `xmark` icon (the `nph-icon-button` of the contract is the icon-only `nph-button` since DSA-43),
   and `close-label` is its accessible name, required while it is shown: without it the popover draws
   with no button and says why, as `nph-dialog` does.

10. **Compact footer buttons go back to the default size on a touch screen.** Under
    `@media (pointer: coarse)` the footer redefines `--nph-control-height-compact` as
    `--nph-control-height-default`, with no new value: the slotted buttons inherit it. It is the
    precedent of P87, which redefines tokens in scope. It holds because the compact rule of
    `nph-button` changes only its internal height variable.

11. **Typography: semantic roles.** The title is `text/label-lg` (16, 24, medium) and the description
    `text/body-sm` (12, 16, regular): the semantic roles whose composition equals the core values
    bound in Figma (`core/size/300`, `core/line-height/300` and `core/weight/medium`; `core/size/100`,
    `core/line-height/100` and `core/weight/regular`), since a component consumes no core token. The
    `use` of `text/label-lg` in `design.md` says it is not for titles (D-4).

12. **Not clipped, not nested.** The surface has `overflow: visible`, so the focus ring of an inner
    piece is not cut. Its parts are its own: there is no `nph-card` inside, as the evidence says. A
    popover inside a dialog is out of scope.

13. **Invalid input.** A `for` that is empty or matches no element in the same root, an empty
    `heading`, and a `side`, an `align` or a `size` outside the lists — each renders nothing and emits
    `console.error` only in development, once per cause while it lasts. A `closable` with no
    `close-label` draws without the button and emits an error.

**Source.** Documentation `4749:5857` and set `4727:1544` of the Figma file `DS-IA-NEPHOS 5.0`,
accepted by Indiane on 06/11/2026 with the Figma UX QA and the textual audit approved, and the points
of its approval page. The property names, the way the trigger is bound, the close rules the evidence
leaves open, the focus rule, the placement and the arrow geometry are a technical proposal of this
implementation.

**Effects on other pieces.** The accepted tokens move three things the task asked to check, and none
needed a new token. `nph-field` draws its error message in `status/error-text` instead of
`status/error`: light is unchanged, dark goes from 3.37:1 to 4.69:1 over the popover, and its test and
sheet read the new token. `nph-dialog` takes `space/inline-loose` at 12 with no code change: its tests
read the token, so the footer actions are 12 apart. The indent of the group selection demo of
`nph-checkbox` reads the same token and goes from 16 to 12: no test asserts the 16, and the indent is a
demonstration frame that is not a precedent for component CSS, so it is accepted at 12 with no token of
its own. `nph-label` keeps `status/error` on the required asterisk, as `design.md` says, and
`nph-dropdown-menu` is not changed.

**Out of scope.** A popover inside a dialog. A new variant of `nph-button`. A change of
`nph-dropdown-menu`. A token. A constrained height or a scroll of the surface. Any color property.

**Pending decisions for Indiane.**

- **D-1 — the distance with the arrow.** The contract gives the offset as 4 and the arrow as 16 by
  8, and does not say where they meet. The code keeps the tip 4 from the trigger and puts the surface
  one arrow height further. If she wants the surface 4 from the trigger, with the arrow overlapping
  the gap, it is her measure.
- **D-2 — the open look on the dropdown trigger.** The open look and the ARIA of the native button
  are scoped to `aria-haspopup="dialog"`. If the trigger of `nph-dropdown-menu` should look open
  too, she decides, and it belongs to a round of that piece.
- **D-3 — `aria-controls`.** It points to the popover host, because an id reference does not cross a
  shadow root. It does not block the pull request.
- **D-4 — the title role.** The title is drawn in `text/label-lg`, which matches the accepted values
  exactly, while `design.md` says that role is not for titles. A role or tokens for the popover title
  is hers to give.

**Status.** Anatomy and behavior accepted by Indiane on 06/11/2026. D-1 to D-4 wait for Indiane. API
and semantics are reviewed in the pull request that brings them; the merge is the approval.

---

## P112 — `nph-hover-card`: API and semantics

**Technical conflict.** The accepted documentation (frame `4422:2418`, component set `4406:1105`) gives the
Figma properties `abertura`, `seta`, `lado`, `texto do gatilho`, `título`, `descrição`, `meta`, `mostrar meta`
and `ícone da meta`, and leaves the code API to the code. Eleven points need a decision of their own:

- the trigger is a text link that the contract draws in every variant, with its own color, underline,
  typography and focus tokens (`hover-card/focus-border`, `hover-card/focus-halo`), and the content property
  is called `texto do gatilho`: the code has to say whether the piece wraps a link of the consumer, points to
  one by `for` as `nph-tooltip` does (P77), or renders the link itself;
- `título` could be the `title` attribute, which is the native tooltip of every element, and `mostrar meta`
  is a boolean that the code could take as a property of its own;
- the contract gives the wait to open (600 ms) and to close (300 ms), the pointer onto the card (WCAG 1.4.13),
  keyboard focus and Esc, and says nothing about what happens when the focus leaves, when a click follows the
  pointer, or when the card is closed from code;
- the contract fixes the distance of 4 from the link and the arrow of 16 by 8 at 16 from the corner, and says
  nothing about the side that does not fit, nor about the alignment of the card to the link when there is no
  arrow;
- the arrow overlaps the card by the width of its border, so the distance of the card is not the distance of
  the arrow;
- the card must not clip inside an ancestor with `overflow`, and the contract says nothing about a layer;
- the contract says the card is read only and that a screen reader user reaches the same content through the
  link, which the semantics of a dialog, a tooltip or a described link would contradict;
- the three required examples (profile, summary with an image, item with a status) need an avatar, an image
  and a badge in the card, and the Figma set has no slot for them: they are "by instance";
- the contract does not say what the piece does with an input it cannot draw;
- the contract has no event, and the evidence says the preview can be turned off;
- the contrast of the link in the dark scheme: point 9 of the contract names the Gerencial brand (2.71:1) and
  says the fix belongs to `color/primary` of that brand; the `Brands` story measured the same failure in other
  brands (up to 3.81:1).

**Decision.** `nph-hover-card` is a Web Component with **open Shadow DOM** (P01). It has no event and no
`::part`. Anatomy only through semantic tokens: the `hover-card/*` ones, the text roles, `elevation/dropdown`
and the global focus ones. What it rejects draws no card and emits `console.error` only in development, once
per cause — the rule of P66. The names follow P64.

1. **The default slot is the text of the link, and `href` is a property.** The piece renders the link itself,
   a native `a` of its shadow root, whose content is the default slot. It does not wrap a link of the consumer
   and does not point to one by `for`, as `nph-tooltip` (P77) and `nph-popover` do: the contract hands the
   piece the visual of the link (color, underline, typography, focus) and names the content property
   `texto do gatilho`, and a link outside, in another root, would not receive `hover-card/focus-border` and
   `hover-card/focus-halo`, which the contract draws in each variant. The cost is recorded in the sheet: the
   link of the piece is not the link of the consumer, so it has no `target`, `rel` or `download`, and a click
   on it reaches the document as a composed event whose `target` is the host: a router must find the anchor
   in `event.composedPath()`, and no compatibility with every router is promised. `href` takes `http:`, `https:` or a relative address,
   parsed as the browser would (`new URL(href, document.baseURI)`), so `javascript:` and its obfuscated
   spellings draw no card and give the link no destination; `mailto:` and `tel:` are not taken, since a
   preview of those destinations has nothing to show. It is the rule of the breadcrumb (P109 point 4)
   narrowed to the protocols a preview can describe.

2. **`heading`, not `title`; `description`; `meta`; `meta-icon`; `meta-title`.** `heading` is the Figma
   `título`; it is not called `title` because `title` is the native tooltip attribute of the host and would
   show a second balloon over the card. `description` is the Figma `descrição`. `meta` is the Figma `meta`,
   and an empty `meta` is the Figma `mostrar meta` turned off: one property instead of a text and a boolean
   that could disagree. `meta-icon` is the Figma `ícone da meta`, a core name of `nph-icon` in the light
   style, `clock` by default (the preferred values are `clock` and `calendar`); a name outside the core, while
   the line shows, draws no card, and while the line is off it is not read. `meta-title` is the full date: it
   becomes the `title` of the meta text, which is the contract rule "relative time up to 30 days, then the full
   date, the full date always in `title`". The consumer calculates and writes the time: the piece writes no
   word and computes no time, so the texts stay localized by the application, as in P109 point 1. This is a
   decision of the code, not an item for Indiane.

3. **Opening and closing.** The two waits are read from `hover-card/open-delay` and `hover-card/close-delay`
   with `getComputedStyle`, so a brand or an application that changes the token changes the wait. The pointer
   resting on the link opens the card after the first; leaving before it ends opens nothing; a press on the
   link cancels it (a click follows the link and nothing opens). Keyboard focus on the link opens the card
   with no wait, only when the link matches `:focus-visible`, so a mouse click that focuses the link opens
   nothing. A pointer that leaves the link and the card closes it after the second; coming back to the link
   or to the card during that wait keeps it open, with no new wait, as the tooltip does (P77). Losing focus
   closes it with no wait: there is no card to cross by keyboard, so the 300 ms would only leave a card on
   screen over a link the person has left. While any of the three holds (pointer on the link, pointer on the
   card, focus on the link) is on, the card stays open. Esc closes it with no wait, only while it is open, in
   the capture phase with `stopPropagation`, so a dialog around it does not close with the same key (P77 point
   4); the card then stays closed until the pointer and the focus are both gone. Touch is ignored in both
   directions: there is no hover, the tap follows the link, and a touch event never closes a card the keyboard
   opened. A delay token that is not defined (the tokens are not loaded) gives no wait and is reported once in
   development.

4. **`side`, flip and alignment.** `side` is the Figma `lado` (`bottom` by default, `top`, `left`, `right`) and
   is the preferred side: the card flips to the opposite side when it does not fit, takes the side with the most
   room when neither fits, and is kept inside the window. The placement is measured in JavaScript, as in
   P77 and P92, with no dependence on CSS anchor positioning. **Alignment (D-2).** The contract defines only
   the arrow, which starts at `hover-card/arrow-inset` from the corner of the card. The code uses one rule with
   and without the arrow: the center of the link sits at the arrow inset plus half the arrow base from the
   start corner of the card, so the arrow tip, when there is an arrow, is on the center of the link, and the
   card does not move when the arrow is turned on. In right-to-left writing the rule is mirrored and the card
   starts at the right. On the left and right sides the same rule runs along the height.

5. **The arrow.** `arrow` reflects. It is an SVG, `aria-hidden`, of `hover-card/arrow-width` by
   `hover-card/arrow-height`, with the fill of the card and the outline of its border, drawn for the resolved
   side after the flip. It overlaps the card by `hover-card/border-width`, so its base covers the border of
   the card. The distance from the link to the tip is `hover-card/offset`, with and without the arrow, as the
   contract says, and so the card sits at the offset plus the arrow height minus the border width, which is
   11 with the tokens of the contract. When the window pushes the card, the tip keeps following the center of
   the link, inside the rounded corners.

6. **The layer.** The card is a `popover="manual"`, so it lives in the top layer, as the balloon of
   `nph-tooltip` (P77) and the panel of `nph-dropdown-menu` (P92): no `z-index` and no clipping by an
   ancestor with `overflow`. `manual` because the browser's light dismiss would close it on a click elsewhere,
   which is not in the contract. The card follows the link on scroll and resize, and is not drawn while the
   link is outside the window.

7. **No role, no `aria-describedby`.** The card is a plain container: no `role="tooltip"`, no dialog, no
   `aria-describedby` or `aria-labelledby` on the link, and it never takes focus. The contract says the card
   repeats the destination, and that a screen reader user reaches the same content through the link; a
   description on the link would read the preview before the destination and make the link longer on every
   visit. The arrow and the meta icon are `aria-hidden`. A closed card is not displayed, so assistive
   technology does not reach it.

8. **The slot `media`, for the required examples only (D-1).** The contract has three required examples,
   profile with an avatar, summary with an image and a date, item with a status and a time, built with
   `nph-avatar`, `nph-image` and `nph-badge` "by instance", and the Figma set has no slot. In code, an instance
   is a child, so the piece offers one optional slot, `media`, at the start of the card, which takes no room
   while it is empty. It is not a place for actions: the card stays read only. Whether the slot should exist
   and where it sits in the card is a decision of Indiane.

9. **Invalid input.** An empty or unsafe `href`, an empty `heading`, a `side` outside the list, and a
   `meta-icon` outside the core while the meta line shows: each draws no card, keeps the link (with no
   destination when the `href` is the cause) and emits `console.error` only in development, once per cause: a
   re-render with the same input stays silent, and a fixed input draws again with no leftover. A card that
   cannot be drawn never opens, from the pointer, the focus or `open`.

10. **No event.** The piece fires nothing: the card opens and closes by itself, the consumer may read `open`
    (it reflects) and may set it to show the card open, under the same closing rules, and the contract defines
    no event. The preview "can be turned off" by the application by not rendering the piece and leaving the
    plain link.

11. **The focus of the link.** Two pseudo-element layers outside the box of the link, as `nph-button`: a border
    of `hover-card/border-width` in `hover-card/focus-border`, with the radius `focus/border-radius-inner`, and
    a halo of `focus/ring-width` in `hover-card/focus-halo`, with the radius
    `focus/radius-inner-with-border`. The link is `inline-block` so the box of the layers is the box of its
    text; a link that breaks across lines draws the ring around the whole box, a known limit recorded in the
    sheet. The link takes `color/primary`, underlined, `text/label-md` and `radius/inner`.

12. **Motion.** The card enters on `hover-card/enter-duration` with `motion/enter-easing` and leaves on
    `hover-card/exit-duration` with `motion/exit-easing`, animating only opacity; it leaves the top layer when
    the exit ends. With reduced motion the duration is `motion/hover-duration`, as in `nph-tooltip`: the card
    still appears and still leaves.

**Inherited limit.** The contrast of the link in the dark scheme is 2.71:1 in the Gerencial brand, as point 9
of the accepted contract says, and the `Brands` story measured it below 4.5:1 in other brands too (up to
3.81:1). It comes from `color/primary` of each brand; point 9 says the fix belongs to that token, that the
underline stays and that this task does not change it. The `Brands` story carries the contrast exception of
`src/shared/docs/brands.ts` (the same one as `nph-sidebar-item`, `nph-dropdown-menu` and
`nph-navigation-menu`), which leaves when the token is fixed. The sheet records it. D-3 asks Indiane to
confirm the extent.

**Source.** Documentation `4422:2418` and component set `4406:1105` of the Figma file `DS-IA-NEPHOS 5.0`,
accepted by Indiane on 06/11/2026 with the Figma UX QA and the textual audit approved, and the ten points of
its approval page. The property names, the link rendered by the piece, the `href` protocols, the reading of the
two waits from the tokens, the closing on blur, the capture of Esc, the flip, the alignment, the layer, the
absence of role, the invalid-input rule and the slot `media` are a technical proposal of this implementation.

**Out of scope.** Loading remote content into the card, which the contract leaves out of the first version
(reopen it with real remote content, weighing `nph-spinner` before `nph-skeleton`). An action, a link or a
field in the card, which belong to `nph-popover`. A `for` that attaches the card to a link outside the piece.
An `nph-link`. A `target`, `rel` or `download` on the link. A width other than `hover-card/width`. An event.
A new token, and a change in `color/primary` of any brand.

**Pending decisions for Indiane.**

- **D-1 — the slot `media`.** The Figma set has no slot, and the three required examples (profile with an
  avatar, summary with an image and a date, item with a status and a time) are built "by instance". For the
  code to reproduce them, the piece has an optional slot `media`, at the start of the card. Indiane decides
  whether the slot exists and where it sits in the card; if it does not, the examples need another route, such
  as a fixed set of properties for the avatar, the image and the badge.
- **D-2 — the alignment of the card to the link.** The contract defines the arrow at 16 from the corner and
  nothing about the alignment of the card when there is no arrow. The code uses the same rule with and without
  the arrow, so the card does not move when the arrow is turned on: the center of the link sits at the arrow
  inset plus half the arrow base from the start corner of the card, mirrored in right-to-left writing.
  Indiane decides whether the card without the arrow aligns another way, such as centered on the link.
- **D-3 — the contrast of the link in dark, beyond Gerencial.** Point 9 of the contract names only the
  Gerencial brand (2.71:1). The `Brands` story measured the link in `color/primary` below 4.5:1 in the dark
  scheme of other brands (up to 3.81:1). The fix belongs to `color/primary` of each brand, which Indiane
  owns; the piece does not change it and the story carries the contrast exception.
- **D-4 — a window too short for the card.** The contract says nothing about a window shorter than the card
  and its link, and says the description wraps with no scrolling. When no side fits, the code keeps the card
  beside the link, never over it, so the link stays reachable by pointer and keyboard, and the window cuts
  what does not fit; the card does not scroll. Indiane decides whether the card needs another fallback for
  such a window, such as a maximum height with scrolling, which the contract rules out today.

**Status.** Anatomy and behavior accepted by Indiane on 06/11/2026. D-1 to D-4 wait for Indiane. API and
semantics are reviewed in the pull request that brings them; the merge is the approval.

---

## P113 — `nph-context-menu`: API and semantics

**Technical conflict.** The accepted documentation (frame `4838:27591`, set `4819:15828`) gives the
Figma properties `submenu`, `tamanho` and `foco`, the behavior and the accessibility, and leaves the
code API to the code. Seven points need a decision of their own:

- the evidence leaves open whether the context menu is a piece of its own or a directive over
  `nph-dropdown-menu`; that menu opens from a visible trigger, below it, in one level, as one tag
  (P92), and the context menu opens at a point and unfolds a submenu;
- the menu opens at the point of a right click on an object that is not a button: the code has to say
  how the object is found, what the menu writes on it, and how the keyboard and touch gestures that
  the browser may or may not turn into a `contextmenu` event are handled;
- the submenu is a second panel, and the evidence gives its side and its line but not how it is
  opened, closed and named, nor what Esc closes;
- the evidence asks every action to also exist on the screen, and says a menu in a table "acts only on
  the row", so the code has to tell the consumer which element was under the pointer;
- the shortcut goes in `aria-keyshortcuts`, whose syntax is not the one of the visible text;
- the icon at rest is `color/muted-foreground` in the DSA-69 evidence and "the color of the label" in
  the DSA-45 evidence of the item the two menus share;
- there is no event, no state and no limit for opening, closing, the long press and the scroll.

**Decision.** `nph-context-menu` is a Web Component with **open Shadow DOM** (P01). Anatomy only
through semantic tokens: the `dropdown/*` ones, `elevation/dropdown`, the motion roles and the text
roles; **no `context-menu/*` token**, as the approval page decided. It has no `::part` and no color
property. What it rejects renders nothing and emits `console.error` only in development, once per
cause: the rule of P21. The names follow P64.

1. **A piece of its own, with the look of the dropdown item (Q1).** It is one tag, with the item, the
   group label and the separator drawn in its own shadow root, so every ARIA reference stays in one
   root (P91). The CSS of the item is a replica of `nph-dropdown-menu` with the same `dropdown/*`
   tokens, as the group label of `nph-navigation-menu` is (P110); the helper `groupsOf` is not shared,
   because the `submenu` of the context menu is a list of entries and the one of the dropdown is a
   boolean. Opening at a point and unfolding a submenu would need a new API on the dropdown, which the
   task does not authorize.

2. **`for` names the object, and the menu writes nothing on it (Q2).** The id is looked up with
   `getRootNode()`, one frame later when it was rendered right after, like `nph-popover` (P111). The
   object is not a button, so there is no `aria-haspopup` or `aria-expanded` to write. An object that
   holds several targets, such as the rows of an `nph-data-table`, is one object. The menu listens to
   `contextmenu`, `keydown`, `pointerdown`, `pointermove`, `pointerup` and `pointercancel` there.

3. **Opening: pointer, keyboard and touch (Q3).** `contextmenu` opens the menu at `clientX` and
   `clientY` and cancels the menu of the browser. Shift+F10 and the Menu key are handled on `keydown`
   and open the menu below the object, at its start edge, on the first item: the browser's own
   `contextmenu` for the same key is not read as a pointer event (browsers fill its coordinates and
   `button` differently), so a `contextmenu` within one second of that key, or of a long press, is the
   same gesture and opens nothing twice. On touch, a `pointerdown` of a primary touch starts a timer of
   700 ms, the evidence's "about 700 ms", and the press opens the menu at its point unless it ends,
   is cancelled or moves farther than 10 px first. The `contextmenu` that Android sends for a held
   touch is cancelled, so it does not open the menu at the browser's own delay. These two numbers had
   no token (D-3); **superseded by P114 (item 10):** they are the tokens `context-menu/long-press-delay` and
   `context-menu/long-press-tolerance`. A right click on the menu itself, when it sits inside the object, opens nothing.

4. **Placement (Q4).** The panel is a `popover="manual"`, so it lives in the top layer: no `z-index`,
   no clipping by an ancestor. JavaScript sets `top` and `left`: the start top corner at the point;
   when the panel does not fit to the right it turns to the left of the point, when it does not fit
   below it turns above, and it never leaves the window. Only a menu taller than the window scrolls
   inside. In right-to-left writing the corner of the point is the top end one. A menu opened from
   code (`open`) sits at the start top corner of the object, takes no focus and follows the object on
   scroll; a menu the person opened closes on a scroll of the page or of a container around the
   object, as the evidence says.

5. **The submenu is a second panel (Q9).** One level, in the same shadow root, a `popover="manual"` of
   its own, `role="menu"` named by the item that opened it (`aria-labelledby`), with the item
   carrying `aria-haspopup="menu"`, `aria-expanded` and, while open, `aria-controls`. It sits flush
   with the first panel, to the right, with its first item on the line of the parent item (past its
   border and padding); when there is no room on the right it turns to the left. The item that opened
   it keeps the hover background, with the icon and the arrow solid. The right arrow (the left one in
   right-to-left writing), Enter, Space and a click open it; the right arrow, Enter and Space move
   the focus to its first item; the opposite arrow closes it and gives the focus back to the item. A
   pointer over an item with a submenu opens it after `motion/hover-delay`, read from the token as
   `nph-navigation-menu` does (P110); a pointer over an item with none closes it after the same wait;
   the pointer inside the submenu keeps it open. `open-submenu`, a reflecting string, is the `value`
   of the open item: the menu writes it, the consumer may set it to show the submenu open, and a
   value that names no enabled item with a submenu is reported in development.

6. **Items (Q6).** `items` is property only: entries of `item`, `label` and `separator`, grouped as in
   `nph-dropdown-menu`. An item has `value` and `text`, and optionally `icon`, `severity`,
   `selection`, `checked`, `shortcut`, `submenu` and `disabled`. `description`, `avatar`, `tag`,
   `count`, `switch`, `loading` and the header are not in the accepted contract, so they are not in
   the API. An item with a `submenu` takes no `selection` and no `shortcut` (the arrow takes the end
   of the item) and its list has at least one valid item and no `submenu` of its own; any of those
   leaves the item out, with one error per cause.

7. **The event carries the object (Q7).** `nph-item-select` bubbles, with
   `detail: { value, checked, origin }`: `checked` is the new state of a single or multiple choice
   and `null` on a common item; `origin` is the element that was under the pointer when the menu
   opened (`composedPath()[0]`), or `null` when the menu was opened from code. It is what lets a row of
   a table act only on itself (D-1). Opening and closing fire no event (D-2). The menu then replaces
   `items` with a new list, also inside a submenu, and never changes the objects of the consumer.

8. **Choices and closing (Q5, Q8).** Single choice is `menuitemradio` with the check, exclusive inside
   its group; multiple choice is `menuitemcheckbox` with an inert `nph-checkbox`. A common item and a
   single choice close the whole menu and give the focus back to the object; a multiple choice keeps
   it open. Esc closes **one level at a time**: the submenu first, giving the focus back to its item,
   then the menu, giving it back to the object (APG; the evidence says "Esc closes the menu", D-5);
   it stops at the menu and does not reach a dialog around it (P77, item 4). A press outside, Tab,
   the focus leaving and a scroll close it. When the object is not focusable, such as a table row,
   giving the focus back is a no-op, and the sheet records it as a limit.

9. **Focus.** Opened by keyboard, the first item takes the focus and shows it; opened by the mouse or
   by touch, it takes the focus without showing it, as `nph-dropdown-menu` does; opened from code, no
   focus moves. The arrows move with wrap, Home and End go to the ends, a typed character goes to the
   next item that starts with it, Enter and Space activate.

10. **The shortcut in `aria-keyshortcuts`.** The visible text (`Ctrl+C`, `⌘D`, `Del`) is written in the
    syntax of the attribute (`Control+C`, `Meta+D`, `Delete`) by `keyShortcutsOf`; it is not in the
    name or in `aria-describedby`. The stories that show a shortcut carry the gate exception of
    `label-content-name-mismatch` that `nph-dropdown-menu` carries (P72, decided by Elvys on
    27-10-2026); its extension to this piece is for him to confirm in the pull request.

11. **The icon at rest keeps the color of the item (D-4).** The DSA-69 evidence lists the icon with the
    shortcut in `color/muted-foreground`; the DSA-45 evidence of the same item says the start icon is
    "in the color of the label". The code keeps the label color in both menus, as the dropdown
    already shipped, so the two menus stay equal.

12. **Invalid input.** A `for` that is empty or matches no element in the same root, a `size` outside
    the two, no valid item, and the invalid items above each render nothing (or leave the item out)
    and emit `console.error` only in development, once per cause while it lasts.

**Source.** Documentation `4838:27591` and set `4819:15828` of the Figma file `DS-IA-NEPHOS 5.0`,
accepted by Indiane on 06/11/2026 with the Figma UX QA and the textual audit approved, and the 18
points of its approval page. The property names, the way the object is bound, the gestures, the
placement, the submenu mechanics, the event and the close rules the evidence leaves open are a
technical proposal of this implementation.

**Effects on other pieces.** The accepted changes land in `nph-dropdown-menu` in the same task and
amend the look P92 records, not its API: the panel and the item take `dropdown/panel-radius` (12) and
`dropdown/item-radius` (8), the focus ring `dropdown/item-focus-border-radius` and
`dropdown/item-focus-halo-radius`, the separator `dropdown/separator`, the destructive item
`dropdown/item-destructive-foreground` (and `dropdown/item-destructive-hover-*` on hover), and the
start icon turns solid on hover and on visible focus in every type, selection and size, light at rest
and disabled; the compact destructive item follows from the same rules. `nph-icon` takes
`arrow-pointer`, light and solid, which the example of the opening point uses; a test ties the closed
core of `nph-icon` to the icon list of `design.md`, so the name was added to that list, with no token,
as DSA-54 did for `arrow-left-to-line`. Elvys authorized that edit on 08/11/2026, limited to the `icones_nucleo` list (`direcao_e_revelacao`) and with no token; Indiane approved the icon in point 8 of the DSA-69 evidence. `color/dropdown-border`
now resolves to `color/border-subtle`, so the outline of the `nph-navigation-menu` panel and of the
loading `nph-notification` changes color with no code change.

**Out of scope.** A second level of submenu. A description, an avatar, a tag, a counter, a switch, a
loading state or a header on an item. An event of opening or closing. A token. A directive over
`nph-dropdown-menu`. A forced-colors mode.

**Pending decisions for Indiane.**

- **D-1 — the object of a table menu.** The evidence says the menu in a table "opens over the clicked
  row and acts only on it" and does not say how the code knows the row. The code names one object with
  `for` and reports the element under the pointer in `detail.origin`. If the menu should instead be
  one per row, or `origin` should be the row itself, it is her call.
- **D-2 — no event of opening or closing.** The contract has none, so the code fires none; a consumer
  that must prepare the items for the row under the pointer listens to `contextmenu` on the object
  before the menu does, or sets `items` on its own `contextmenu`.
- **D-3 — the long press.** The evidence says about 700 ms. The code uses 700 ms and a movement limit of
  10 px, which have no token, and cancels the touch `contextmenu` of the browser.
- **D-4 — the icon color at rest.** `color/muted-foreground` (DSA-69) or the color of the label
  (DSA-45). The code keeps the label color in both menus.
- **D-5 — Esc in the submenu.** The code closes the submenu first and the menu on the second press; the
  evidence says Esc closes the menu.

**Status.** Anatomy and behavior accepted by Indiane on 06/11/2026. D-1 to D-5 wait for Indiane. API
and semantics are reviewed in the pull request that brings them; the merge is the approval.

---

## P114 — The answers of 2026-11-09 applied in the code: the technical choices

**Technical conflict.** Indiane answered the pending decisions of lots 1 and 2 on 2026-11-09 (Figma
frames `5374:10420` and `5404:10452`). Each answer says what the piece does, and leaves to the code
how: the name of the size of the switch, how the pointer and the keyboard share one focus, how the
narrow navigation list is a disclosure, how an exit transition ends, where a token is read, and which
piece paints the open look of a menu trigger. Eleven points needed a choice of their own, recorded here
so the next reader does not have to rebuild them from the diffs. No token is created or changed: the
code reads tokens that already exist.

**Decision.** Pieces and rows are in `docs/operacao/tarefas/DSA-70.md`.

1. **The size of `nph-switch` is `size`, `default` or `small` (DSA-45 D-4).** The property is reflected
   and the constant is `NPH_SWITCH_SIZES`. An invalid value follows the rule of `nph-button`: nothing is
   rendered and one development error says so. The measures of the track and the knob are internal
   variables, overridden in `:host([size='small'])` by `switch/track-width-sm`, `switch/track-height-sm`,
   `switch/thumb-size-sm` and `switch/track-padding-sm`; the knob travel keeps its formula. The small
   track gets a block margin of `(icon/size-md - track height) / 2`, so the piece is 20 high and the
   track is centered on the first line of a label. The item of `nph-dropdown-menu` draws the small switch
   with `label` as its accessible name, hidden by `inert`, and no visible text.
2. **The pointer moves the focus of the dropdown item on `pointermove` (DSA-45 D-6).** It is not
   `pointerenter` or `mouseover`: a menu that opens under a still pointer must not take the focus from its
   first item (the Radix approach). The focus uses `preventScroll`. Touch pointers, disabled items and
   loading items are skipped, and leaving the panel does not blur. The arrows already read the focused
   item, so they continue from the hovered one. Known side effect: after keyboard navigation the ring
   follows the pointer, because the browser keeps `:focus-visible` on a scripted focus.
3. **`nph-button` paints the open look for `aria-haspopup="menu"` as for `dialog` (DSA-67 D-2).** The
   open trigger of the dropdown is an `nph-button` and the button painted the look only for `dialog`.
   The getter returns `dialog`, `menu` or none, other values are ignored, and the inner native button
   receives the same `aria-haspopup` and `aria-expanded` as the host. The rule and the token
   (`button/secondary-solid-background-hover`) do not change. This amends the limit written in P111,
   that the button knew only the dialog.
4. **The secondary solid of `nph-dialog` is not redefined (DSA-64 D-1).** The window keeps only
   `color/border` for its own separator. In dark `color/secondary` equals `color/dialog`, so the solid
   secondary blends into the window; the label identifies the button, as Indiane decided. The tokens
   `color/secondary-on-dialog` and its hover stay in the source and nothing reads them. This amends
   item 7 of P87.
5. **`nph-progress` steps: any integer from 2 (DSA-65 D-1).** `NPH_PROGRESS_MIN_STEPS` (2) replaces the
   exported list `NPH_PROGRESS_STEP_COUNTS`. A non-integer is invalid. There is no maximum and no
   warning: the guidance to avoid more than 7 steps is in the sheet and in the Docs page.
6. **The title of `nph-popover` reads the five `text/heading-sm` roles (DSA-67 D-4).**
7. **`nph-navigation-menu` waits `navigation-menu/close-delay` to close and `motion/hover-delay` to open
   (DSA-62 D-4).** Both are read from the computed style by one helper, with no literal fallback; a
   token that does not resolve closes at once and logs one error for that token. A pointer that comes
   back within the close delay keeps the panel open.
8. **The narrow list is a disclosure (DSA-62 D-1).** Each trigger is a `button` row with the arrow,
   `aria-expanded` and `aria-controls` pointing to a `role="group"` region named by the row; the region
   is `hidden` while collapsed. The rows open and close independently (APG does not ask for exclusivity)
   and they collapse again each time the list opens. The state is a private set, not an attribute, so
   the public API is unchanged. A disabled trigger is a disabled row that never opens.
9. **The arrow turns `0.5turn` and the panel fades on `motion/enter-*` and `motion/exit-*` (DSA-62
   D-3).** The panel follows the exit technique of `nph-dropdown-menu`: `data-open` is the open style,
   the panel stays `inert` and in the top layer until the computed `transition-duration` ends and then
   `hidePopover()` runs; asking for it again during the exit cancels the timer. It is a fade with no
   slide. With reduced motion both the arrow and the panel use `transition: none` and the panel leaves
   the top layer at once.
10. **`nph-hover-card` centers on the link when it has no arrow (DSA-68 D-2), and its link reads
    `color/link` (DSA-68 D-3).** Without the arrow the corner of the card is half its length from the
    link center on the cross axis; with the arrow the rule of 16 px stays. Collision handling is
    unchanged. `nph-context-menu` reads `context-menu/long-press-delay` and
    `context-menu/long-press-tolerance` from the computed style of the host on each press, with no
    literal fallback: a token that does not resolve keeps the long press from arming and logs one error
    for that token. The delay accepts `s` and `ms`, the tolerance `px` and `rem`, and a move farther than
    the tolerance cancels (exactly the tolerance does not). This amends item 3 of P113, which said the
    two numbers had no token.
11. **`nph-select` disabled: the arrow area takes `color/muted`, the field's own background (DSA-29
    D-1).** The divider and the opacity stay.

The `Brands` stories of `nph-dropdown-menu`, `nph-sidebar-item`, `nph-navigation-menu` and
`nph-hover-card` no longer carry `BRAND_CONTRAST_EXCEPTION`: the gate passes without it in the seven
brands and both schemes. The story of `nph-context-menu` keeps it, because its checked item still reads
`color/primary-hover`.

**Left out.** The row of `nph-table` that points `table/link-foreground` in dark to `color/link`: it
changes a token value, and the code agent never creates or changes a token. It waits for Indiane, in
Figma, and DSA-70 stays open until it comes. DSA-45 D-3, DSA-62 D-2, DSA-67 D-3 and DSA-69 D-1 and D-2
stay open.

**Status.** The answers come from Indiane, recorded in the tasks. The technical choices above are
reviewed in the pull request that brings them; the merge is the approval.

---

## P115 — `nph-tabs`: API and semantics

**Technical conflict.** The accepted documentation (frame `3483:11200`, sets `3472:9192`, `3472:8748`
and `3472:8747`) gives the Figma properties `estilo`, `state`, `rótulo`, `ícone início`, `contador`,
`tag`, `abas`, `rolagem` and `tom`, the keyboard behavior of the APG Tabs pattern and the
accessibility, and leaves the code API to the code, with eight points open in the task. Ten points
need a decision of their own:

- the tabs are a list of items with a text, an optional icon, counter and tag, and a state of their
  own, and the panel of each one is content of the consumer: the code has to say how the list goes in
  and how the panels are bound to the tabs, since an ARIA reference (`aria-controls`,
  `aria-labelledby`) does not cross a shadow root;
- the evidence says there is always one active tab, and says the choice between automatic and manual
  activation is "a property of the code", without saying who owns the active tab: the consumer or the
  piece;
- the piece fires an event when the person chooses a tab, and `nph-value-change` is already typed
  with a list by `nph-toggle-group` (P76), as `nph-change` was for the chip (P100);
- the evidence says the counter number enters the accessible name "with hidden context text", without
  saying who writes that text, which is text in the language of the consuming application;
- the evidence says a cut label shows the whole text in `nph-tooltip` on hover and on focus, and the
  tooltip draws only on an element with `tabIndex` of 0 or more (P77), while an inactive tab has -1
  because the list is a single Tab stop;
- the scroll arrows are an icon-only `nph-button` (DSA-43), which needs an accessible name, and the
  Figma has no text for it;
- the evidence leaves open what the arrow does at an end of the list, what happens in the segmented
  and tab button styles when the tabs do not fit, what moves on a tab change, whether the whole list
  can be disabled, where the Tab stop goes when the active tab is disabled, and how a large counter
  shows;
- the evidence says nothing about input the contract does not accept, such as a repeated `value` or an
  icon on only some of the tabs;
- the panel with no focusable item takes the focus (APG), and the piece does not own the content of
  the panel;
- the label and the counter number use the text styles directly, with no token of their own.

**Decision.** `nph-tabs` is a Web Component with **open Shadow DOM** (P01), in one tag, with its CSS
in its own file imported `?inline`. It has no `::part`, no color property, no form association and no
vertical list. Anatomy only through semantic tokens, the `tabs/*` ones, the text roles and the global
focus ones. What it rejects renders nothing and emits `console.error` only in development, once per
cause: the rule of P21. An empty list is a mount: nothing, no error (P68). The names follow P64.

1. **One component, `tabs` is a property.** The tabs are a list of
   `{ value, text, icon?, counter?, counterLabel?, tag?, disabled? }`, set by property only (no
   attribute, no slot): a list of objects does not serialize to an attribute, and a slot per tab
   could not check the rules of the list. `value` names the tab and its panel and is unique. `text` is
   the label, one line, already localized: the piece writes no word of its own. `icon` is a core name
   of `nph-icon`, on every tab or on none. `tag` is one word and is drawn as an `nph-badge`, primary
   light, and primary solid on the active light and outline tab, as the Figma says. The order inside a
   tab is fixed: icon, label, counter, tag (DSA-57 D-5, as in P100). The counter is a pill of the piece
   itself, with the `tabs/counter-*` tokens, since the evidence calls it a piece of `nph-tabs`.

2. **`value` is the active tab, and the piece is the source of truth.** `value` reflects. The piece
   writes it when the person activates a tab, and without a `value` that names a tab, the first
   enabled tab is active and the piece writes `value`, so one tab is always active and the panel is
   never empty (the Do of the documentation). A `value` that names no tab warns in development and
   falls back to the first enabled tab. A `value` set from code changes the tab and fires nothing.
   An active tab that is disabled keeps the active look under `tabs/item-disabled-opacity`: the
   combined state T11 of the evidence.

3. **`variant` and `activation`.** `variant` is the Figma `estilo`: `segmented` (default),
   `underline`, `solid`, `light` or `outline`, the last three being the tab button. `activation` is
   `automatic` (default) or `manual`, as the APG says. Both reflect, because the internal CSS and the
   consumer read them. Outside its list, each one renders nothing and emits `console.error`.

4. **The panel is a slot named by the `value`.** The consumer writes `<div slot="pending">` and the
   piece draws a `role="tabpanel"` around the slot of each tab, with `aria-labelledby` pointing to the
   tab and `hidden` while inactive. The tab carries `aria-controls` pointing to its panel. Both live
   in the same shadow root, since an ARIA reference does not cross a root (P91). The piece does not
   own the content of the panel. A panel with no focusable item takes `tabindex="0"` (APG); the
   piece decides it by a selector list of the elements that already take the Tab key, kept only when
   they take part in the Tab order (not disabled, no negative `tabindex`, not hidden, not inert) and are
   searched inside the shadow roots of the components of the consumer (a shadow host with a negative
   `tabindex` takes its shadow tree out, as the browser does), so an `nph-chip` counts only for the X, the
   button or the cut label it draws, and
   measured when the active tab or the slot changes, after the components of the consumer have
   rendered. It is a heuristic: a focusable item the list does not know gets one more Tab stop, and a
   control the consumer enables later is seen on the next change.

5. **The event is `nph-tab-change`.** It bubbles and is `composed`, with `detail: { value }`, and is
   fired only when the person activates a tab, never when code changes `value`, and never on a click
   on the active tab. It is not `nph-value-change`: `nph-toggle-group` already types that name with a
   list (`string[]`, P76), the same reason P100 gives for not using `nph-change`.

6. **Invalid input.** The rule of P21: nothing is drawn and `console.error` is emitted in development,
   once per cause, for a `variant` or `activation` outside its list, a `tabs` that is not a list, a
   tab that is not an object, a tab without `value` or `text`, a repeated `value`, an `icon` outside
   the core of `nph-icon` or on only some of the tabs, a `counter` that is not a whole number from
   zero up, a `counter` without `counterLabel`, a `tag` with more than one word, and every tab
   disabled. A re-render with the same input stays silent, and a fixed input draws again with no
   leftover. A list with no accessible name renders and warns once, because the name may arrive
   after the first render, as in P107 and P109.

7. **Keyboard and activation (APG).** The list is one Tab stop, kept by a roving `tabindex`: 0 on
   the active tab and -1 on the others. When the active tab is disabled, the Tab stop goes to the
   first enabled tab, since a disabled tab takes no focus (it is a native disabled button). The left
   and right arrows move the focus with wrap and skip a disabled tab; in right-to-left writing the
   arrow that points to the end of the line goes to the next tab. Home and End go to the first and
   the last enabled tab. With `automatic` activation, the tab becomes active when the arrows put the
   focus on it; with `manual`, the arrows only move the focus and Enter, Space or a click activate. A
   click activates the tab and puts the focus on it, and a click on the active tab does nothing.
   Hover only paints. Esc and a click outside do nothing, and after a tab change the focus stays on
   the tab. The focus is reached by the native focus of the browser, which brings the tab into view.

8. **The accessible name.** The label is the name of the tab; the icon is `aria-hidden`. The counter
   number is `aria-hidden` and the hidden context text of the consumer, `counterLabel`, enters the
   name after the label, such as "Pending, 12 items": it is a property of the code, required with
   `counter`, because the piece writes no word. The tag enters the name by its content. `label` names
   the `tablist`, and the host `aria-label` does it when there is no `label`, read by a property whose
   attribute is `aria-label` since a property called `ariaLabel` is the native ARIA reflection (P107,
   P109).

9. **The cut label shows its balloon, with a limit.** The label is one line, cut by an ellipsis. It is
   measured (`ResizeObserver` and `document.fonts.ready`, as `nph-chip`), and only a cut label of an
   enabled tab gets an `nph-tooltip` with the whole text, as its description (the default
   relation), as the cut label of the removable chip (P100): the name of the tab stays its content,
   with the counter text and the tag, so a name built from the balloon would drop the visible text
   (axe `label-content-name-mismatch`). `nph-tooltip` opens only on an element with `tabIndex` of 0 or more
   (P77), and an inactive tab has -1. The piece promotes the cut tab under the pointer to
   `tabindex="0"` while the pointer is on it, on `pointerover` and before the tooltip reads it, and
   gives it back to the roving value when the pointer leaves; the arrows write the roving value before
   they move the focus, so the balloon opens for the focused tab. A touch pointer does not promote.
   It is a limit, registered in the sheet and as D-1.

10. **The scroll arrows.** Only the underline scrolls. When the tabs do not fit, each tab keeps its
    width (`minmax(max-content, 1fr)`) and the list scrolls, with an arrow at each end, measured by
    `ResizeObserver`. The arrow is an `nph-button` with severity `secondary`, emphasis `ghost`, size
    `compact` and shape `square` (the icon-only `nph-button` of DSA-43; there is no sheet for an
    `nph-icon-button`), with the icons `chevron-left` and `chevron-right`, mirrored in right-to-left
    writing. Its name comes from `scroll-previous-label` and `scroll-next-label`, which are text of
    the consumer (D-2); without them the arrows are not drawn and the piece warns once. At an end of
    the list the arrow is disabled, not hidden, so the list does not change width. The arrows have
    `tabindex="-1"`: out of the Tab order, because the arrow keys already scroll the list. The accepted
    documentation also asks them out of the screen reader, but `aria-hidden` on `nph-button`, which
    holds a focusable element in its shadow root, is an axe violation (`aria-hidden-focus`) that
    fails the gate, so they keep their name (D-5). A click scrolls by three quarters of the visible width, smooth
    unless reduced motion asks otherwise.

11. **Segmented and tab button cut instead of scrolling.** The evidence leaves the overflow of these
    styles to the code and the usage rule asks for few tabs and short labels. The tabs share the width
    (`minmax(0, 1fr)`), the list does not scroll and does not wrap, and a label that does not fit is
    cut with an ellipsis and the balloon of item 9 (D-4).

12. **Only color moves.** The change of the active tab and the hover run on `tabs/indicator-duration`
    and change color, background and the shadow of the card; the line of the underline is drawn inside
    each tab and does not slide. With reduced motion nothing moves (DSA-62 D-3), and the scroll
    arrows scroll with no animation.

13. **No disabled for the whole list.** `disabled` is per tab. A list with every tab disabled is
    invalid (item 6), since the person would have nothing to activate.

14. **A large counter.** The visible number above 99 shows `99+` (D-3). The accessible name keeps the
    whole `counterLabel` of the consumer and the API has no maximum.

15. **Tokens.** Only `--nph-tabs-*`, the text roles `--nph-text-label-md-*` (the label) and
    `--nph-text-label-sm-*` (the counter number), `--nph-elevation-subtle` (the card) and the motion
    easing. The label has no token of its own, as in `nph-badge`. No token was created or changed.

**Source.** Documentation `3483:11200` and sets `3472:9192`, `3472:8748` and `3472:8747` of the Figma
file `DS-IA-NEPHOS 5.0`, accepted by Indiane on 09/11/2026 with the Figma UX QA and the textual audit
approved, and the points of its approval page. The property names, the shape of `tabs`, the binding of
the panel, the event, the invalid-input rule, the accessible name of the counter, the balloon of the
cut label and the scroll arrows are a technical proposal of this implementation.

**Out of scope.** A vertical list. A token, new or changed. A change in `nph-tooltip`, so that it opens
on an element with `tabIndex` of -1. Steps in sequence: that is `nph-stepper`. A disabled for the whole
list. Scrolling in the segmented and tab button styles. A form association.

**Pending decisions for Indiane.**

- **D-1 — the balloon of the cut tab.** The Figma asks for the balloon of the cut label on every tab,
  but `nph-tooltip` opens only on an element with `tabIndex` of 0 or more. The code promotes the cut tab
  under the pointer to `tabindex="0"` while the pointer is on it. She confirms it, or asks for a change
  in `nph-tooltip`, which is a task of its own.
- **D-2 — the names of the scroll arrows.** The icon-only `nph-button` needs a name and the Figma has
  no text for it, so the code takes `scroll-previous-label` and `scroll-next-label` from the consumer.
- **D-3 — `99+`.** The Figma cites "99+" only as an example. The code shows `99+` above 99 and keeps the
  whole `counterLabel` in the name.
- **D-4 — segmented and tab button.** With many tabs these styles cut the label, with a balloon,
  instead of scrolling. She confirms it, or asks for the scroll in these styles too.
- **D-5 — the scroll arrows and the screen reader.** The documentation asks the arrows out of the screen
  reader, but `aria-hidden` on a button that holds a focusable element fails the accessibility gate
  (`aria-hidden-focus`). The arrows are out of the Tab order and keep their name. She confirms it, or
  asks for another way to hide them, which needs a change in `nph-button`, another task.

**Status.** Anatomy and behavior accepted by Indiane on 09/11/2026. D-1 to D-5 wait for Indiane. API
and semantics are reviewed in the pull request that brings them; the merge is the approval.

---

## P116 — `nph-sidebar`: API and semantics; the focus hook of `nph-button`; the disclosure of the subitem and of the rail button (amends P98)

**Technical conflict.** The accepted documentation (frame `4633:27036`, sets `4605:9647`, `4605:9612`,
`4605:9599`, `4605:9589` and `4605:9594`) gives the Figma properties `modo`, `estado`, `botão de recolher` and
`botão do canto`, the behavior of the APG Disclosure Navigation Menu and Dialog (Modal)
patterns, the accessibility and the tokens, and leaves the code API to the code, with ten points open in
the task. Eleven points need a decision of their own:

- the item turns into the rail button in the collapsed mode, the flyout panel needs the children of an
  item, and an ARIA reference (`aria-controls`) does not cross a shadow root: the code has to say how the
  list goes in and who draws the pieces;
- the rail button of DSA-53 is a link, and the collapsed menu needs a button that opens the flyout panel;
  the subitem of DSA-53 with `options` is a link with an arrow, and Figma answered D-4: it opens the third
  level, as a disclosure;
- the group, the subitem with options and the rail button of a group point to a panel that lives in the
  shadow root of the menu, outside their own;
- the evidence asks for `sidebar/search-background` and `sidebar/search-border` on the search, and
  `nph-input` has no hook for them and does not change;
- the evidence asks for `focus/border` on the collapse and close buttons, and `nph-button` fixes the focus
  border per severity (`color/primary` for primary), without a hook;
- the collapse button needs the `sidebar` icon, which is not in `nph-icon` (D-1), and `nph-button` has no
  slot, so it cannot hold a placeholder;
- the flyout panel is in the top layer and has its own order of Tab, closing rules and limits of width,
  which the evidence leaves to the code;
- the mobile menu needs the focus trapped, the scrim and the close paths, and the evidence says the
  scrim "is drawn by the screen";
- who keeps the mode, who passes the current item, what an empty or failed list says and whether the code
  offers a shortcut to collapse are open points of the task;
- the evidence answers DSA-53 D-1 to D-4 for the item, the subitem and the rail button, and the code of
  P98 differs in the counter position, the width of its outline, the severity of more actions and the
  subitem with options;
- the evidence says nothing about input the contract does not accept.

**Decision.** `nph-sidebar` is a Web Component with **open Shadow DOM** (P01), in one tag, with its CSS in
its own file imported `?inline`. It has no slot, no `::part` and no color property. Anatomy only through
semantic tokens, the `sidebar/*` ones and the global focus ones. What it rejects renders nothing and emits
`console.error` only in development, once per cause: the rule of P21. An empty list is a mount (P68). The
names follow P64.

1. **One tag; the entries are data.** `items` is a list, by property only, as `items` of
   `nph-dropdown-menu` (P92) and `tabs` of `nph-tabs` (P115). A `{ type: 'label', text }` entry names the
   group that follows it; a link has `label`, `icon`, `href` and optionally `active`, `counter`,
   `disabled`, `tooltip`, `actions`, `actionsLabel` and `value`; a `group` has `label`, `icon`, `children`
   and the same optional fields and `expanded`; a child has `label` and `href`, or `options` (the third
   level, each with `label` and `href`), and `active`, `disabled`, `tooltip` and `value`. The menu draws
   the item, the subitem and the rail button by instance (DSA-53), the flyout panel and its option itself
   (they are inner parts, as the item of `nph-dropdown-menu`), the search with `nph-input`, the corner
   button and the close button with `nph-button`, and the loading list with `nph-skeleton`. An entry that
   cannot be drawn is left out with one error per cause. The menu replaces `items` when a group opens or
   closes and never changes the objects of the consumer. The package takes one definition per folder (P91).
   Two levels in the list, the third only in a flyout panel; there is no fourth level.

2. **The mode is the product's, and the collapse button reports it.** `mode` is `expanded` (default),
   `collapsed` or `mobile`, and reflects. The product chooses it, and switches to `mobile` below the `md`
   breakpoint (768). The collapse button switches `expanded` and `collapsed` by itself and fires
   `nph-mode-change` with `detail: { mode }`, as `nph-tabs` writes `value` and fires `nph-tab-change`
   (P115); the product keeps the mode. Setting `mode` from code fires nothing. There is no keyboard
   shortcut to collapse: `Ctrl+B` and `Cmd+B` belong to the browser and the editors, and the product can
   bind its own. The current item is `active` in the data, as in the item of P98, and the product passes it.

3. **The mobile menu is a modal `<dialog>`, as `nph-dialog` (P87).** `open` opens it, only in `mobile`, and
   reflects; the product opens it with a button of its own. The person closes it with the close button
   (`xmark`, the `nph-button` primary ghost), with Esc or with a click on the scrim, and the menu fires
   `nph-close` first, bubbling, composed and cancelable, with `detail: { source }` (`close-button`,
   `escape` or `scrim`); `preventDefault()` keeps it open, and then sets `open` to `false` itself. Setting
   `open` from code fires nothing. It lives in the top layer with `showModal()`: the page is inert, the
   focus is trapped and goes back to the button that opened it. The menu floats `sidebar/mobile-offset`
   from the start, top and bottom edges, at `sidebar/panel-width`. **The scrim is the `::backdrop` of the
   dialog**, in `sidebar/scrim`, as the `overlay/scrim` of `nph-dialog`: the evidence says the screen draws
   it, but the piece that traps the focus and closes on the click outside has to own the backdrop, since
   `nph-drawer` is out of the first version. `sidebar/scrim` is `overlay/scrim`, stronger in dark, and no
   other strength was needed. The enter uses `motion/enter-*` and the exit `motion/exit-*`; with reduced
   motion nothing moves, as DSA-62 D-3.

4. **The flyout panel is a `popover="manual"`, drawn right after its opener.** It is in the top layer, as
   `nph-dropdown-menu` (P92), with no `z-index` and no clipping by the scrolling list, and draws after its
   opener in the DOM, so the next Tab enters it and Shift+Tab comes back. It opens on a click, Enter or
   Space, never on hover. It sits to the side of the opener, with its top aligned and `space/inline` of
   distance (the margin of the panel carries it, as the gap of P92; Figma gives 8 and no layout token, and
   `sidebar/mobile-offset` is a position of the mobile menu, not this distance). It goes to the other side
   when it does not fit and stays inside the window, and it scrolls only when it is taller than the window.
   Its width is what its options need, at least a line of the expanded menu and at most
   `layout/input-width`, the width of the floating menus: Figma draws 220, with no token, and a width token
   goes to the next Figma batch. The title is the name of its opener. There is one panel per level; opening
   another of the same level closes the first. Esc closes the innermost and gives the focus back to its
   opener; a press outside, the focus moving to a line that is neither the panel nor the opener that holds it open, or a click on a link closes them. Opening a panel
   closes the balloon of its opener. An option with `options` shows `chevron-right` and opens the third
   level; it keeps the active look, with the arrow, when it holds the current page (T11), and the open look
   with Regular weight otherwise. The opener carries `aria-expanded` and `aria-controls`.

5. **`controls` crosses the shadow root.** An `aria-controls` by id cannot leave the shadow root of the item,
   the subitem or the rail button. The three get `controls`, a property of the element, by property only
   (no attribute), which the piece hands to its button as `ariaControlsElements` (a reference to an
   element of an ancestor shadow root is allowed). `nph-sidebar` sets it. The group of the item now carries
   `aria-controls` too, pointing to its subitems.

6. **The disclosure of the subitem and of the rail button (amends P98, items 8 and 9).** A subitem with
   `options` is a native `button` with `aria-expanded`, `expanded` (reflected) and the event `nph-toggle`
   with `detail: { expanded }`, as the group of the item (P98, item 3): Figma answered DSA-53 D-4. It has
   no `href` and is never `active`, each of them invalid input, as the group of the item. The rail button
   gets `type`, `link` (default) or `group`, reflected: a group is a native `button` with `aria-expanded`,
   `expanded` and `nph-toggle`, with no `href`, `counter` or `active`, and its flyout panel is the one of
   the second level. Opening either closes its own balloon. The rail button of an open group draws the
   hover background and the solid icon. This is the only way to give the collapsed menu a button that
   opens a panel without a new tag.

7. **The answers of DSA-53 in the three pieces (amends P98, items 4, 9 and 10).** The focus border of the
   item, the subitem and the rail button is `focus/border`, not `color/primary` (the border fell below 3:1
   against the dark panel in three brands). More actions is the `nph-button` **secondary**, ghost and
   compact (D-3; P98 item 4 said the default severity). The counter of the rail button sits above the top
   end corner: `space/inline-tight` above and `border/width` inside the end edge, the x 19 and y -4 of a 40
   px button (D-1). The outline of the active counter is 4 px wide in `sidebar/panel-background`, decorative
   and not tied to the focus ring (D-2): its width is `space/inline-tight`, which measures 4, not
   `border/width` and not `focus/ring-width`.

8. **The focus hook of `nph-button`.** `--nph-button-focus-border` is the one public hook: the color of the
   focus border, `var(--nph-button-focus-border, <the color of the severity>)`, read once, on the border,
   and not a token. Unset, nothing changes in any of the seven severities; the focus halo does not change.
   `nph-sidebar` sets it to `focus/border` on its close button only; a custom property inherits, so the hook
   is set on the button, never on the host of the menu, and the corner button keeps the default focus of
   `nph-button`. `nph-icon-button` is the icon-only `nph-button`, so the hook covers it. A test proves the
   default of the seven severities and the hook.

9. **The collapse button keeps the place of the icon (D-1).** The `sidebar` icon is not in `nph-icon`, and
   adding it is a foundation task that is not open. `nph-button` has no slot, so it cannot show a
   placeholder; and the code does not invent another icon. The collapse button is a native `button` in the
   shadow root of the menu, with the look of the `nph-button` primary ghost at `control/height-default` and
   `focus/border`, and an `nph-skeleton` of `icon/size-md` in the place of the icon, as the Figma draws it.
   It has `aria-label` (`collapse-label` or `expand-label`), `aria-expanded` and an `nph-tooltip` with the
   name. When the icon enters `nph-icon`, the button becomes `nph-button` with `icon-start="sidebar"`: no
   API changes.

10. **The search is `nph-input`, unchanged.** `nph-input` has no hook for its background and border. The
    menu redefines, on the search instance only, the two semantic tokens the field already reads:
    `--nph-color-input` takes `sidebar/search-border` and `--nph-color-background` takes
    `sidebar/search-background`. It is the cascade of custom properties of P02, which
    `tokens-cascade.test.ts` already exercises; no token is created or changed, and the hover and focus
    colors of the field stay its own. The search is drawn, in the expanded and mobile modes, only with
    `search-label`, its accessible name; `search-placeholder` and `search-value` complete it, and
    `nph-search-change` with `detail: { value }` follows the typing.

11. **The text is the product's.** The menu writes no word: `label` (the landmark, and the dialog),
    `collapse-label`, `expand-label`, `close-label`, `corner-label`, `search-label`, `logo-label`,
    `empty-text` and `error-text` come from the consumer, in its language. A collapse or close button with
    no name is not drawn, with one error; a missing `label` warns once and draws, as `nph-input`. The
    corner button is drawn with `corner-label` and turned off by `hide-corner-button`; the collapse button
    is turned off by `hide-collapse-button`: the Figma booleans, on by default, follow `hide-close` of
    `nph-dialog` (P87). `empty-text` takes the place of an empty list and `error-text`, an alert, the place
    of any list.

12. **The logo, the loading state and the rest of the open points.** The logo is the image of the brand
    library, not exported by Nephos: `logo-src`, `logo-mark-src` (the collapsed mode; `logo-src` when
    empty), `logo-label` and `logo-href`; with an href it is a link named by `logo-label`, without it an
    image with that text. It has no dark version (D-2). Loading draws six `nph-skeleton` rows (lines in
    the expanded and mobile modes, blocks the size of a rail button in the collapsed one) with
    `aria-busy="true"` on the list. The keyboard is Tab in reading order; the arrow keys between lines are
    optional in the pattern and are not offered. The expanded and collapsed widths move on
    `motion/expand-*`. The subitems of an open group are indented to the label of the group, and no
    `sidebar/group-line` is drawn: the evidence keeps the one line between the search and the navigation.
    The measures the evidence does not give come from existing tokens: the gap between lines is
    `space/inline-tight`, the group label takes `space/inline` above and below and `sidebar/item-padding` on
    the sides, and the gap in the logo row is `space/inline` (D-4).

13. **Tokens.** Only `--nph-sidebar-*`, the global focus and motion ones, and the neighbors the evidence
    names; no core or theme token. The scrolling list takes the room of the focus halo on every side and
    gives it back with a negative margin, so the scroll clips the halo of no line. No token was created
    or changed.

**Source.** Documentation `4633:27036`, page `1367:2` and sets `4605:9647`, `4605:9612`, `4605:9599`,
`4605:9589` and `4605:9594` of the Figma file `DS-IA-NEPHOS 5.0`, accepted by Indiane on 09/11/2026 with
the Figma UX QA and the textual audit approved, and the points of its approval page. The property names,
the shape of `items`, the events, the mode and the focus rules, the reference by element, the type of the
rail button, the focus hook, the skeleton in the collapse button, the redefinition of the search tokens,
the invalid-input rule and the limits of the flyout width are a technical proposal of this implementation.

**Out of scope.** A token, new or changed. The `sidebar` icon in `nph-icon` (D-1). A change in `nph-input`,
`nph-icon`, `nph-skeleton` or `nph-tooltip`. A group collapsible by its label, a complementary area, an
attached or inset surface and the `nph-drawer`. A keyboard shortcut to collapse. Arrow keys between lines.

**Pending decisions for Indiane.**

- **D-1 — the `sidebar` icon.** Adding it to `nph-icon` is a foundation task that is not open. Until then the
  collapse button shows a skeleton in its place. She frees the task.
- **D-2 — the dark logo.** The brand has not confirmed which version goes on a dark background. The dark
  logo does not ship until it does.
- **D-3 — the current page in a collapsed group.** The rail button of a group is never `active`, so in the
  collapsed menu nothing shows that the current page is inside a group until its panel opens. She confirms
  it, or asks for an active look on the rail button of the group that holds the current page.
- **D-4 — the measures Figma does not give.** The flyout panel is drawn at 220 with no token: the code takes
  the width its options need, between a line of the expanded menu and `layout/input-width`. The gap between
  lines, the padding of the group label and the gap of the logo row are not written either. She gives the
  tokens in the next batch, or accepts these.

**Status.** Anatomy and behavior accepted by Indiane on 09/11/2026. D-1 to D-4 wait for Indiane. API and
semantics are reviewed in the pull request that brings them; the merge is the approval.

---

## P117 — `nph-stepper`: API and semantics

**Technical conflict.** The accepted documentation (frame `5569:6530`, sets `5541:1622` and `5540:581`)
gives the Figma properties `etapas`, `atual`, `status`, `estado`, `rótulo`, `número`, `descrição`,
`texto da descrição` and `opcional`, the behavior of a navigation with an ordered list and links
(W3C multi-page forms tutorial, APG Link pattern), the accessibility and the width limits, and leaves
the code API to the code, with eleven points open in the task. Eight points need a decision of their
own:

- the steps are a list of items with a label, an optional description, an optional mark, a status and a
  state of their own, and the Figma sets the status from the position of `atual` while the evidence says
  that "the page sets the status of each step": the code has to say how the list goes in and how the
  status is set;
- the evidence says a step is "a link or a button" and that "the page sets which steps are clickable",
  without saying what makes it one or the other, and the piece must not move the current step by
  itself;
- the hidden status text ("Completed", "Pending", "With error"), the word "Optional" and the "Step 2
  of 4" of the narrow width are text in the language of the consuming application, and the piece writes
  no word of its own;
- the evidence says a cut label shows the whole text in `nph-tooltip`, and the tooltip opens only on an
  element that takes focus (P77), while a pending step of the linear stepper is not clickable and takes
  no Tab;
- the evidence says below 600 px the stepper "becomes" `nph-progress` of the steps type, without saying
  how the switch is made, and a query does not accept a custom property;
- the evidence says nothing about input the contract does not accept, such as a status on the current
  step or an eighth step;
- the evidence leaves open where `aria-current="step"` sits when the current step is not a link, and
  whether the description and "Optional" enter the accessible name;
- the number, the label and the description use the text styles directly, with no token of their own.

**Decision.** `nph-stepper` is a Web Component with **open Shadow DOM** (P01), in one tag, with its CSS
in its own file imported `?inline`. It has no `::part`, no slot, no color property, no form association
and no vertical orientation. Anatomy only through semantic tokens, the `stepper/*` ones, the text roles
and the global focus ones. What it rejects renders nothing and emits `console.error` only in
development, once per cause: the rule of P21. An empty list is a mount: nothing, no error (P68). The
names follow P64.

1. **One component, `steps` is a property.** The steps are a list of
   `{ label, description?, optional?, status?, disabled?, href? }`, set by property only (no attribute,
   no slot): a list of objects does not serialize to an attribute. From 2 to 7 steps: two are allowed
   (DSA-65 D-1), the documentation asks for three to seven, and seven is the maximum; the piece never
   collapses steps (DSA-66 D-1 does not apply). `label` is one or two words, already localized.
   `description` is the support line, up to two lines, and on a step with an error it is the reason.
   `optional` shows the word of `optional-label`.

2. **`current` and the statuses.** `current` is an integer from 1 to the number of steps (the Figma
   `atual`), 1 by default, set by the page. The piece keeps no state: a click does not move it. The
   status of a step is `current` at that position, else the `status` it was given (`pending`,
   `completed` or `error`), else the one its position says: completed before `current`, pending after
   it. So the page can mark an error on any step, and a completed step after the current one in a
   non-linear process. The step at `current` takes no `status` and no `disabled`: the evidence says a
   blocked step cannot be the current one, and the current step is where the person is.

3. **`non-linear` and what is clickable.** `non-linear` is a boolean that reflects. Linear (the default):
   only the completed steps and the steps with an error are clickable. Non-linear: the pending steps are
   clickable too. A disabled step and the current step are never clickable, in either mode. A
   clickable step is an `a` when it has `href` and a `button` when it has none, so the page decides
   between a route and an action with the property it already has.

4. **The event is `nph-step-select`.** A button step fires it, `bubbles` and `composed`, with
   `detail: { step }`, the 1-based position, only when the person activates the step: never when code
   sets `current`. A link step fires only the native `click`, which a router handles as it handles any
   link, as the level of `nph-breadcrumb` does (P109). The piece does not change `current`, move the
   focus or update the page title: the page does, as the evidence says (appendix D). `href` takes
   `http:`, `https:`, `mailto:`, `tel:` or a relative address, parsed as the browser would
   (`java\nscript:` is caught); any other protocol is invalid input.

5. **The texts are properties of the consumer.** `completed-label`, `pending-label` and `error-label`
   are the hidden text at the start of each step; `optional-label` is the word "Optional"; `step-text`
   is the text of the narrow width, with the markers `{current}` and `{count}` filled in by the piece, in
   any order the language needs (the marker rule of `nph-pagination`). `label` names the `nav` and the
   host `aria-label` does it when there is no `label`, read by a property whose attribute is
   `aria-label` since a property called `ariaLabel` is the native ARIA reflection (P107, P109). A text
   the piece needs and the consumer did not give draws without it and warns once in development, since
   it may arrive after the first render.

6. **Invalid input.** The rule of P21: nothing is drawn and `console.error` is emitted in development,
   once per cause, for a `steps` that is not a list or has fewer than 2 or more than 7 steps, a `current`
   that is not an integer from 1 to the number of steps, a step that is not an object or has no `label`,
   a `status` outside the list, a `status` or `disabled` on the current step, and an unsafe `href`. A
   re-render with the same input stays silent, and a fixed input draws again with no leftover.

7. **Semantics.** A `nav` with an ordered list, one list item per step, and no tablist: the arrow keys
   do nothing. The current step is a `span` with `aria-current="step"` (on the element of the step, not on
   the list item, so a screen reader that announces the current state of a link announces it here too);
   it is not a Tab stop. A disabled step is a `span` with `aria-disabled="true"` and is not a Tab stop. The
   hidden status text opens each step, with no hidden text on the current one, since the attribute says
   it, and a disabled step with an error carries the pending text, because it looks pending (rule T11).
   The description and "Optional" are part of the step, so they enter its name by content and the reason
   of an error is read. The marker is `aria-hidden`. The connector is a decorative element of the list
   item of the step before it, `aria-hidden`, with no list item of its own.

8. **The cut label and its balloon.** The label of a pending, completed or error step is one line, cut by
   an ellipsis, and measured (`ResizeObserver` on the labels, `document.fonts.ready` and every update, as
   `nph-tabs`); only a cut label of a step that can take focus gets an `nph-tooltip` with the whole text
   as its description (the default relation, as P115 does). A clickable step is already a Tab stop. A
   pending step of the linear stepper is not clickable and takes no Tab, so when its label is cut it
   becomes a `span` with `tabindex="0"`, only to open the balloon: the reading of the evidence, "inferred
   from the linear rule and DSA-48, open for confirmation" (D-4). The current label is never cut: it wraps
   to up to two lines. A disabled step gets no balloon, because `nph-tooltip` opens only on an element
   that takes focus; the screen reader has the whole name by content. The hover wait, the focus without
   wait, the cancel by a click and Esc are the behavior of `nph-tooltip` itself (DSA-48 D1 and D2).

9. **The narrow width is `nph-progress`, drawn by the stepper.** The stepper draws both the list and an
   `nph-progress` of the steps type (`steps`, `step`, the label of the current step as `label`, the
   `step-text` as `value-text`), and a container query on the host hides one of them with `display: none`,
   which takes it out of the accessibility tree. The width that counts is the one of the stepper, not the
   window: a stepper in a card on a wide screen is as narrow as the card. The host takes inline size
   containment for it, so it stretches to the width of where it lives and has no width of its own: in a
   shrink-to-fit parent the page gives it one, which is a limit recorded in the sheet. A query does not
   accept a custom property, so the 600 px of the accepted contract is written in the CSS, in `rem`
   (`37.5rem`), as P87 does for the breakpoint of `nph-dialog`. `design.md` lists "create a breakpoint
   outside the four" as a mistake for the page grid (A55); this is a threshold of one component, accepted
   by Indiane in the documentation, and it is not a page breakpoint (D-2). `nph-progress` here has no
   error: a step with an error does not show as an error on the narrow width (D-3). Between 600 px and the
   room the steps need, the text column gives up its room first, down to nothing (a cut label ends in an
   ellipsis and a balloon), and the marker and the connector keep their structural minimum: the step area
   around the marker, and the connector at `stepper/connector-min-width` with its gap on each side. The
   current step keeps its width and so does the last one. Below the sum of those minimums, such as seven
   steps whose text is at its maximum at 600 px, the contract says nothing, and the list scrolls sideways
   inside its own box and takes the Tab key itself, so the keyboard can scroll it (WCAG 2.1.1). The
   scroller carries the room of the focus border and the halo as padding and takes it back with a negative
   margin, so the focus of a step is not clipped, and the balloons stay outside it. With forced colors the browser
   drops the shadow of the scroller's focus, so the scroller keeps an outline of its own in the system
   color `Highlight`, with no token, as the user's palette decides. The word "Optional" has no rule in the
   contract; it is treated as the label is, on one line and cut with an ellipsis when the text column is
   squeezed, so it never passes the step area, and it stays whole in the name of the step for the screen
   reader. No token minimum is reduced.

10. **Only color moves.** The change of a status and the hover run on `stepper/state-duration` and change
    color and background. With reduced motion nothing moves (DSA-62 D-3).

11. **Hover and focus.** Hover paints the pending and completed steps that can be activated with
    `stepper/item-background-hover`; on the step with an error it only underlines the label. A pending
    step that takes no activation is not painted: the paint would say it can be clicked. A focused step
    has no hover background (`focus/border` on `color/accent` is below 3:1 in dark in some brands). The
    focus is a border and a halo outside the step area, drawn by `::before` and `::after`, centered on it,
    which nothing clips because the connector keeps the steps apart. The current step has rest only.

12. **Tokens.** Only `--nph-stepper-*`, the text roles `--nph-text-label-sm-*` (the number),
    `--nph-text-label-md-*` (the label), `--nph-text-label-md-strong-*` (the current label),
    `--nph-text-body-sm-*` (the description and "Optional") and the motion easing. No token was created
    or changed. The CSS has one literal measure, the `37.5rem` of the container query (item 9).

**Source.** Documentation `5569:6530` and sets `5541:1622` and `5540:581` of the Figma file
`DS-IA-NEPHOS 5.0`, accepted by Indiane on 10/11/2026 with the Figma UX QA and the textual audit
approved, and the points of its approval page. The property names, the shape of `steps`, the way a step
becomes a link or a button, the event, the invalid-input rule, the texts of the consumer, the balloon of
the cut label and the way the narrow width is drawn are a technical proposal of this implementation.

**Out of scope.** The vertical stepper, which waits for `nph-collapsible`. A token, new or changed. A
change in `nph-icon`, `nph-tooltip` or `nph-progress`. The contrast of the brand and error colors on
`color/dialog` in dark (D-1 of the task). A collapse of the steps. A form association.

**Pending decisions for Indiane.**

- **D-1 — the contrast on a dialog in dark.** Inside a dialog, in dark, some brand and error colors fall
  below the contrast minimum (`status/error-text` 3.62, `color/primary-text` 4.02, `focus/border` and the
  current ring 2.56, the error background 2.61). The stepper keeps its tokens. She decides whether the
  foundation fixes them for every component on a dialog. It does not block the pull request.
- **D-2 — the 600 px.** The accepted contract says 600 px; it is not one of the four breakpoints of
  `design.md` (`md` 768, `lg`, `xl`, `xxl`), and a query takes no custom property, so the code writes
  `37.5rem` and reads the width of the stepper, not the window. She confirms the value or chooses
  another.
- **D-3 — the error on the narrow width.** `nph-progress` of the steps type shows the position only; a
  step with an error does not show as an error. She confirms it, or asks for the error status of the
  progress when a step has one.
- **D-4 — the cut pending step.** The balloon of a pending step of the linear stepper needs a focusable
  `span` with no role, which is the reading of a rule the evidence marks "open for confirmation", and the
  hover background paints only the steps that can be activated. She confirms the reading, or asks for
  another.
- **D-5 — a status against the position.** The page may give a step a status that its position does not
  say, such as a pending step before the current one. The Figma draws only the position (completed
  before, pending after), and the connector follows the position too: brand before the current step,
  neutral after it. She confirms it, or asks for the connector to follow the status of the steps.

**Status.** Anatomy and behavior accepted by Indiane on 10/11/2026. D-1 to D-5 wait for Indiane. API and
semantics are reviewed in the pull request that brings them; the merge is the approval.

## P118 — `nph-tree`: API and semantics

**Technical conflict.** The accepted documentation (frame `5876:216753`, sets `5485:350`, `5485:421`
and `5485:766`) gives the Figma properties `tipo`, `estado`, `checkbox`, `ícone`, `rótulo`,
`conteúdo` and `seleção`, the behavior of the WAI-ARIA APG tree view, the accessibility and the
limits, and leaves the code API to the code, with nine points open in the task. Seven points need a
decision of their own:

- the documentation names three parts, the item, the group of children and the tree, and the roles
  `tree`, `group` and `treeitem`, the roving Tab stop, the typing of a letter, the balloon of a cut
  label (which `nph-tooltip` looks up in its own root) and the cascade of the selection all cross
  those parts: the code has to say whether the parts are tags or drawn parts;
- the evidence says how the selection behaves but not how it goes in and out of the piece: the
  chosen item, the checked and mixed items, the open branches, the icon and the loading and error of
  each branch are all data the page must set and the person changes;
- the evidence says a branch with no loaded children "goes to loading" and that "Try again" is the
  action of the item, without saying how the page is asked, how it answers or how the failure is
  told;
- the texts ("Couldn't load.", "Try again", "No items", "This folder has no items yet.") are in the
  language of the consuming application, and the piece writes no word of its own;
- `nph-tooltip` opens only on an element in the Tab order (P77), and in a tree with one Tab stop only
  one item is in it, while the evidence asks for the balloon on hover over any cut label;
- the evidence says rename and delete go to an `nph-context-menu` opened by the item, and a menu
  reports the element under the pointer, which with open Shadow DOM is inside the tree;
- the evidence says nothing about input the contract does not accept, such as a repeated id, and
  nothing about where the focus goes when the item that holds it leaves.

**Decision.** `nph-tree` is a Web Component with **open Shadow DOM** (P01), in **one tag**, with its
CSS in its own file imported `?inline`. It has no `::part`, no slot, no color property and no form
association. Anatomy only through semantic tokens, the `tree/*` ones, the text roles and the motion
pair. What it rejects renders nothing and emits `console.error` only in development, once per cause:
the rule of P21. An empty `items` is a mount (P68). The names follow P64.

1. **One tag; the three Figma sets are drawn parts.** The item, the group and the tree are parts the
   piece draws in one shadow root, not tags (`nph-tree-item` and `nph-tree-group` do not exist). The
   roles, the Tab stop, the keys, the balloon and the cascade need one root, as the tree of
   `nph-table` does (P101); and the Tree Select and the Tree Table take the whole `nph-tree`.

2. **`items` is a property.** A list of `{ id, label, children?, branch?, disabled?, loading?,
   error? }`, set by property only: a list of objects does not serialize to an attribute. `id` is a
   unique non-empty string and is the value every other property and event carries. A node is a
   branch when it has `children` or `branch: true`; `branch: true` with no `children` is a branch not
   loaded yet. There is no depth limit in the piece (the documentation asks to review the structure
   above five levels). The list is replaced, never changed in place; the render is keyed by `id`, so
   an item that leaves takes its own element, and its focus, with it.

3. **The selection is state the person and the code both change.** `selection` is `none` (default),
   `single` or `multiple` and reflects. `selected` (an id) is read in single selection, `checked` (a
   list of ids) in multiple, and `expanded` (a list of ids) in every one; they are the current state,
   as in the native controls, so the person changes them and an event says so, and setting them from
   code fires nothing. Ids the piece does not know are ignored in silence, because a node may arrive
   later. `icons` is one boolean for the whole tree, so the icon is on every node or on none by
   construction.

4. **The cascade.** On by default in multiple selection: checking a parent checks its enabled
   children, a parent is checked when all its enabled children are, mixed when only part of them is,
   and a mixed or unchecked item gets checked by a click. A disabled item keeps its own state, is not
   changed by the cascade and stays out of the count of its parent; a disabled branch neither hands its
   mark to its children nor takes theirs. A parent whose children are all
   disabled is checked by its own mark. A checked parent whose children load later checks them.
   `check-strictly` (`checkStrictly`) turns the cascade off, and then nothing is mixed. The list in
   `nph-tree-check` holds the ids in the checked state, in the order of the tree, closed branches
   included.

5. **The events.** All `bubbles` and `composed`, and only when the person acts: `nph-tree-toggle`
   `{ id, expanded }`; `nph-tree-select` `{ id }` (single selection, only when the choice changes);
   `nph-tree-check` `{ id, checked, value }`, where `value` is the new whole list; and
   `nph-tree-load` `{ id, retry }`.

6. **Load on demand is derived from the data.** A branch that is open, has `branch: true`, has no
   `children` and no `error` is loading, and so is a branch with `loading: true`: the spinner takes
   the place of the chevron and the item carries `aria-busy`. The piece fires `nph-tree-load` once
   when the person opens such a branch, and once more only after the page has answered (opening,
   closing and opening it again before the answer asks nothing); the page loads and replaces `items` with the `children`, or
   with `error: true`, which shows the error row in place of the children. Pressing "Try again"
   (Enter or a click on the error row) fires `nph-tree-load` with `retry: true` and the row goes to
   loading at once, until `items` brings that branch back as another object or without `error`: an
   update of some other branch keeps the retries still waiting. A branch opened by the code loads but does not fire
   the event: the page that opened it loads it. The first load of the tree is `loading` with an empty
   `items`: three `nph-skeleton` rows at the height of the item, `aria-hidden`, and the host busy.
   The failure of that first load has no row in the contract, so the page shows its own message.

7. **The texts are properties of the consumer.** `empty-heading` and `empty-description` for the
   empty tree (`nph-empty`), `error-text` and `retry-text` for the error row. `aria-label`,
   `aria-labelledby` or `label` name the tree. A text the piece needs and the consumer did not give
   draws without it and warns once in development, since it may arrive after the first render.

8. **The host is the tree.** `role="tree"` is set through `ElementInternals`, so `aria-label` and
   `aria-labelledby` of the host name it (a reference cannot cross into a shadow root), and
   `aria-multiselectable` and `aria-busy` follow the state. Inside, a `treeitem` per node and a
   `group` per open branch; the group is the sibling of its item, and the item owns it by
   `aria-owns`, so the box of the item is only the row: the focus, the hover and the scroll to the
   focus are the row's. The tree has no role while it is empty. The name of an item is its `label`,
   set as `aria-label`, so the children it owns never enter it; a cut label with a balloon is named
   by the balloon (`relation="name"`), which holds the same text. `aria-selected` on every item in
   single selection, `aria-checked` on every item in multiple, never both; `aria-level`,
   `aria-setsize` and `aria-posinset` on every item, the error row included. The error row is a
   `treeitem` inside the group of its branch, named by the phrase and the action together.

9. **The keyboard.** One Tab stop, by roving `tabindex`: while the focus is inside, the item with
   focus holds it; when the focus leaves the tree, the stop goes back to the chosen item if it is
   drawn, else to the first, so the next Tab enters there, as the contract says. Down and Up pass through a disabled item, which takes focus with
   `aria-disabled` and does nothing; Right and Left open, close and go down and up as the APG says,
   and in right-to-left writing they swap; Home, End, the asterisk and a letter (the next label
   that starts with it, around the end) are the APG's; Enter and Space follow the selection (single
   chooses; multiple checks, and Enter on a branch opens or closes it; none opens or closes with
   Enter and Space does nothing). Esc and Tab belong to the container. When the item that holds the
   focus leaves, because its parent closed or `items` was replaced, the focus goes to the nearest
   ancestor still drawn, else to the Tab stop; when the focus was elsewhere, the piece takes none.

10. **The pointer.** The chevron opens and closes; the rest of the row chooses (single), checks
    (multiple) or, with no selection, opens and closes. Hover only paints: it moves no focus and
    chooses nothing. A click puts the focus on the item with no focus border: the border is for the
    keyboard (`:focus-visible`).

11. **The balloon of a cut label.** The label is one line cut by an ellipsis, measured
    (`ResizeObserver`, `document.fonts.ready` and every update, as `nph-tabs` and `nph-stepper`); a
    cut label gets an `nph-tooltip` with the whole text. The balloon opens only on an element in the
    Tab order (P77), so the piece gives the stop where the evidence needs it: an item takes
    `tabindex="0"` before the focus moves to it by the keyboard, and, over a cut label, in the
    capture phase of `pointerenter`, before the balloon hears the pointer. The stop goes back when
    the pointer goes to another item or leaves the tree, when the person presses Tab, and when
    another item takes focus. The pointer leaving is read on the host, not on the list, because the
    balloons are drawn beside the list: going from the item onto its balloon keeps both. It is a
    bounded exception to the single Tab stop and it is tested.

12. **Context menu.** The object of an `nph-context-menu` is the host of the tree. `itemIdOf(element)`
    returns the `id` of the node whose row holds the element, so the `origin` the menu reports (the
    first element of the composed path, or the focused item when the menu opens from the keyboard)
    says which node it is for. The tree cancels no `contextmenu`. The host is not focusable, and a
    menu that closes calls `focus()` on its object, so `focus()` on the host puts the focus on the item
    that held it last, or the one a menu was opened on by the pointer, else on the Tab stop.

13. **The checkbox of the item.** `nph-checkbox` is drawn `inert` and `aria-hidden`, with the label of
    the item as its `label` (the dropdown menu does the same, P92), and is never `disabled` by the
    tree, so the opacity of the item fades it once. The box does not take its own hover when the
    pointer is over the row: `nph-checkbox` hovers only through `:hover` in its own shadow root and
    has no way to be forced; it is the limit of DSA-45 D-3, which the evidence says the tree
    inherits, and of DSA-17 D7 for the checked box. A change in `nph-checkbox` is outside this task.

14. **Look and movement.** The face of the row carries the background, the bar and the opacity of a
    disabled item; the focus border is the `::after` of the row, drawn inside, over the bar and at
    full opacity (the recommendation of D-2). Focus wins over hover; selected with hover is selected.
    The chevron is one `chevron-right` that turns a quarter in `motion/expand-duration` and
    `motion/expand-easing`; the open chevron is that glyph turned, the same drawing as
    `chevron-down`; with reduced motion it swaps with no turning. The spinner takes `color/primary`
    (the accepted Figma binds it, `nph-spinner` takes `currentColor`). Right-to-left writing mirrors
    the indent, the bar and the closed chevron. With forced colors the selection and the focus use
    system colors. Nothing else moves.

15. **Tokens.** Only `--nph-tree-*` (all twenty-five), the text roles `--nph-text-body-md-*` and
    `--nph-text-label-md-*`, the motion pair and `--nph-color-primary`. No token was created or
    changed, and the CSS has no literal measure.

**Source.** Documentation `5876:216753` and sets `5485:350`, `5485:421` and `5485:766` of the Figma
file `DS-IA-NEPHOS 5.0`, accepted by Indiane on 11/11/2026 with the Figma UX QA and the textual audit
approved, and the points of its approval page. The one tag, the shape of `items`, the state
properties, the events, the derivation of the loading, the texts of the consumer, the host role, the
hand-given Tab stop, `itemIdOf` and the invalid-input rule are a technical proposal of this
implementation.

**Out of scope.** The Tree Select and the Tree Table, and the tree of `nph-table`. A token, new or
changed. A change in `nph-checkbox`, `nph-icon`, `nph-spinner`, `nph-skeleton`, `nph-empty` or
`nph-tooltip`. Guide lines, a depth limit, a button inside the row, drag and drop, and the failure of
the first load of the tree.

**Pending decisions for Indiane.**

- **D-1 — the Tree Table.** Whether the Tree Table reuses the cell of the tree of `nph-table` and
  stays apart from `nph-tree`, or the two are unified. Recommended: keep both. It is decided in the
  plan of the Tree Table, and it does not block this task.
- **D-2 — the focus of the disabled item.** The disabled item takes focus by the arrows, and Figma has
  no disabled-with-focus variant. Whether the focus border fades with the item or stays on top at full
  opacity. Recommended, and built: on top, at full opacity. It does not block the pull request.

**Status.** Anatomy and behavior accepted by Indiane on 11/11/2026. D-1 and D-2 wait for Indiane. API
and semantics are reviewed in the pull request that brings them; the merge is the approval.

---

## P119 — `nph-file-upload`: API and semantics

**Technical conflict.** The accepted documentation (frame `5311:8328`, sets `5297:7473` and
`5298:7669`) gives the Figma properties `formato`, `estado` and `tipo`, the behavior of a drop zone
with a real button (the APG Button pattern, WCAG 2.4.3, 2.5.7 and 4.1.3), the accessibility, the
width limits and the answers to the appendix, and leaves the code API to the code, with seven
points open in the task. Eight points need a decision of their own:

- the zone and the item are two Figma sets, the focus has to move between items after a removal and
  one live region has to announce what changes in the list, and the evidence does not say who owns
  the list: the zone, which would have to keep files and send them, or the page;
- the evidence says "a file above the maximum size: the item goes to error, with the reason in
  text" and "the error of the zone (limit, format)", without saying where the type, the size and the
  number are checked, nor who chooses the reason of each one;
- the Figma state of the zone includes `hover` and `foco`, which "come from the button", and
  `arrastando`, which a story cannot reach by a property: the code has to say how they are
  detected and which state wins when several apply;
- the hidden texts and the messages of the live region ("2 files added", "Error: X not sent.
  Reason.", "Uploading · 64%", "Remove X", "Cancel upload of X") are text in the language of the
  consuming application, and the piece must write no word of its own;
- the evidence says the error of the zone "is tied to the button by `aria-describedby`", and the
  button is an `nph-button`, which forwards no `aria-describedby` into its own shadow root, while an
  id does not cross a shadow root and the task forbids changing `nph-button`;
- the evidence says the zone sits inside `nph-field` and that "the reason of the error stays in the
  zone itself", while `nph-field` writes `invalid`, `description`, `label`, `required` and
  `disabled` on its control and draws its own message line;
- the evidence says the thumbnail of the image kind is "cut from the chosen file at 64 by 64 with
  `object-fit: cover`" and leaves open who cuts it and what the image kind does before it is ready;
- the dashed border is a stroke style, and the build does not accept that type yet.

**Decision.** `nph-file-upload` is a Web Component with **open Shadow DOM** (P01), in two tags,
each with its CSS in its own file imported `?inline`: `nph-file-upload`, the zone and the list, and
`nph-file-upload-item`, the row of one file, in its own directory because the library build has one
entry per directory (as `nph-sidebar-item`). It has no `::part`, no slot, no color property and no
form association. Anatomy only through semantic tokens, the `file-upload/*` and
`file-upload-item/*` ones, and the text roles and the global focus width. What it rejects renders
nothing and emits `console.error` only in development, once per cause: the rule of P21. An empty
list is a mount: the zone alone, no error. The names follow P64.

1. **The page owns the list.** `files` is a property only (a list of objects does not serialize to
   an attribute): `{ id, name, size?, format?, kind?, status?, progress?, reason?, href?,
   thumbnail?, file? }`. The zone keeps no list, sends nothing over the network and has no form
   association, as `selected` is the page's in `nph-tree`. `id` is unique and `name` required;
   `status` is `ready` (default: the upload happens together with the form), `uploading`, `sent`,
   `error` or `done`; the code does not tell "upload with the form" from "automatic upload": the
   first is the page leaving the entry in `ready`, the second the page putting it in `uploading` at
   once. `uploading` needs `progress` from 0 to 100, because the item says "Uploading · 64%".
   `size` is in bytes and the item writes it with `Intl` in the language of the element, "2.4 MB";
   `format` falls back to the extension of the name, in capitals. `kind` is `file` or `image`, an
   image when `file` is an image. `href` opens a `done` file and takes `http:`, `https:`, `blob:` or
   a relative address, parsed as the browser would; without it the name of a `done` item is text and
   the item warns once.
2. **The zone validates what the person chose and the page decides what to show.** `accept` (the
   syntax of the native file field: `.pdf`, `image/*`, `image/png`), `max-size` (bytes) and
   `max-files` are checked file by file, in this order: the type, the size, then the room left by
   `max-files` less the files already in the list. The zone fires `nph-file-upload-add`, `bubbles`
   and `composed`, `detail: { files, rejected }`, only when the PERSON chooses in the picker or drops
   (never for code, and never for no file): `files` are the `File` objects that pass, `rejected` are
   `{ file, reason }` with `reason` `type`, `size` or `count`. So format and size stay separate
   messages, as the evidence asks: the page writes the sentence of each reason. The page adds the
   accepted files to `files`, adds a file above the size as an entry in `error` with its reason (the
   evidence: the item goes to error), and says a type that is not accepted or a passed limit in
   `error`.
3. **The state of the zone is derived, by precedence.** `disabled`, then dragging, then error, then
   limit, then empty (rule T11: disabled wins and leaves no state border and no state background).
   `error` is the reason, already localized: filled in, the zone goes to error and the reason takes
   the place of the rule, with the `circle-xmark`. Limit is `max-files` reached: the zone changes by
   itself, the phrase says the limit (`limit-text`), the rule says how to free space (`limit-rule`)
   and the button is disabled. Dragging is the depth of `dragenter` and `dragleave` over the zone
   while the dragged data has files; the button leaves with `visibility: hidden` and `inert`, so its
   place is kept and the height does not change. Hover and focus are read from the button: the
   pointer over it and its keyboard focus (`:focus-visible` of the native button) turn the zone icon
   solid, and nothing else changes; away from the button the zone does not react.
4. **The texts are properties of the consumer.** `prompt`, `button-text`, `dragging-text`, `rule`,
   `limit-text`, `limit-rule`, `uploading-text` (`{progress}`), `sent-text`, `done-text`,
   `retry-text`, `remove-label` and `cancel-label` (`{name}`) and the messages of the live region
   `added-text` (`{count}`), `sent-announcement` (`{name}`), `error-announcement` (`{name}`,
   `{reason}`) and `removed-announcement` (`{name}`). The zone passes the ones the items use down to
   them. A text the piece needs and the consumer did not give draws without it and warns once in
   development, since it may arrive after the first render (the rule of `nph-stepper`).
5. **The description is on the group, not on the button.** `nph-button` forwards no `aria-describedby`
   and an id does not cross its shadow root, and the task forbids changing it. The zone is a
   `role="group"` named by `label`, described by `aria-describedby` on the rule or the reason and on
   the `description`, in the same root. It is a limit of this implementation, recorded in the
   sheet, and a pending decision (D-2).
6. **`nph-field` contract.** The zone takes the contract of P83 as a control: `label` names the
   group, `description` is the help text and is never drawn, `required` only reflects (the asterisk
   is the label's and `aria-required` is not valid on a group), `disabled` adds up as for any
   control, and `invalid` puts the zone in error only with a reason to say: the message of the field
   in `description`, or its own `error`. So the zone is never red without a reason (WCAG 1.4.1),
   and the evidence rule "the reason stays in the zone" holds when the page sets `error`, while
   the field may also draw its own line (D-4). `focus()` on the host goes to the button, which is
   what a click on the label of the field asks.
7. **The item.** `nph-file-upload-item` is a public tag and works alone, as the row of a list of
   files already saved. It takes `name`, `status`, `kind`, `format`, `bytes`, `progress`, `reason`,
   `href`, `thumbnail`, `size`, `disabled`, `file-id` and the texts, and fires
   `nph-file-upload-remove` (`detail: { id, cancel }`, `cancel` while uploading) and
   `nph-file-upload-retry` (`detail: { id }`), both `bubbles` and `composed`, only when the person
   acts. Three text lines under the box: the name, the format and size, and the status line, which
   `ready` does not have; this reading of "name, format and size, status" is what gives the 86 of the
   error item (borders, padding and 20 + 4 + 16 + 4 + 16) and the 66 of the others, and it is
   confirmed by the evidence (D-5). The name is cut on one line with an ellipsis and carries a
   `title`. The status line of an upload in progress is a `role="progressbar"`, named by the file name
   and valued by the visible text; it is not on the host, because a progressbar has presentational
   children and would hide the buttons. The name of a `done` file is a link whose click area is
   stretched across the row by an `::after`, and the remove button is a sibling above it, so there is
   no control inside a control; the hover is on the whole row and the focus ring is drawn by the
   row for `:focus-visible` of the link. Both buttons are `nph-button`: "Try again" secondary ghost
   with `rotate-right`, and the remove button icon only with `xmark`, named "Remove X" or "Cancel upload
   of X" by the `label` of the button, which is also its tooltip. `size` is the size of the form,
   `default` or `large`; `compact` is invalid input.
8. **Disabled.** The zone disabled dims the whole zone and carries `aria-disabled`; the items it
   draws are disabled too: they go back to the ready look, under `file-upload/disabled-opacity`, with
   a real `disabled` on both buttons and the name as text. The evidence says the item has no disabled
   state and that, with the whole form disabled, "the code follows the same rule (disabled wins)";
   the visual detail is D-3.
9. **The focus moves only when the page changes the list.** After the picker closes, with files or
   without (`change` and `cancel`), the focus returns to the button. After the person activates the
   remove button the zone notes the item and its position; when `files` no longer has it, the focus goes
   to the remove button of the item now in that position (the next), else the last (the previous),
   else the button. After "Try again" the zone notes the item and, when it is no longer in `error`,
   moves the focus to its remove button. A pending move that the page never completes does nothing, and
   the focus is never taken from where the person went: it moves only when it is on nothing or inside the
   zone.
10. **One live region.** `aria-live="polite"`, `aria-atomic`, visually hidden, in the zone. It compares
    `files` before and after: the entries that were not there and are not `done` and not `error` are
    "added" (as a count), an entry that becomes `sent` is "sent", an entry that becomes `error`, or
    comes in `error`, says "Error: X not sent. Reason", and an entry that left is "removed". Nothing
    is said on the first list the zone draws, a file that arrives `done` is not "added", and a change
    of progress alone says nothing: the progress stays in the visible text and in the progressbar.
11. **The compact format is a container query.** The host takes inline size containment and the CSS
    applies the compact layout in `@container (min-width: 41.75rem)`: a query does not accept a custom
    property, so the 668 px of the accepted contract is written in `rem` (668 / 16), as P87 does for
    the breakpoint of `nph-dialog` and P117 for the 600 px. It reads the width of the zone, not of the
    window. `format` reflects, the zone keeps the default format below the threshold and never breaks
    into lines. The zone stretches to the width of where it lives; in a shrink-to-fit parent, give it
    a width. The default format is 186 high and the compact 66, which the tests measure.
12. **The thumbnail.** The zone makes it: for an `image` entry with a `file` that is an image and no
    `thumbnail`, it reads the picture with `createImageBitmap`, cuts the central square, draws it
    64 by 64 on a canvas and hands the item an object address (`blob:`), which it gives back when the
    entry leaves, when its file changes and when the zone leaves the page. The original never goes
    into the thumbnail. Until it is ready, or when the file cannot be read as a picture, the item
    shows the `file-image` icon: the fallback of the evidence for an image kind without `nph-image`.
    A `thumbnail` the page gives wins and nothing is made.
13. **Tokens.** Only `--nph-file-upload-*`, `--nph-file-upload-item-*`, `--nph-focus-ring-width` and the
    text roles `--nph-text-label-md-*`, `--nph-text-body-md-*` and `--nph-text-body-sm-*`. No token was
    created or changed. The CSS has two literal measures: the `41.75rem` of the container query and the
    `1px` of the visually hidden boxes of the live region and the description. **The dashed border**: the
    Figma token `file-upload/border-style`, pointing to `core/border-style/dashed`, is not in the
    repository, because the build refuses the `strokeStyle` type, and the task's gate
    `stroke-style-token` stays `pending` with Indiane (Claude in Figma): an agent of the code owner never
    creates or changes a token. As the task says, until then the zone writes `border-style: dashed`,
    with a comment that points to the gate; when the tokens exist, one line changes.
14. **Icons.** `file-lines` and `file-image`, light and solid, enter `nph-icon` with this change, as the
    task says: the map, the demo and a test of `nph-icon`, and the list `icones_nucleo` of `design.md`,
    which the test of `nph-icon` binds to the map (the precedent of DSA-54 and DSA-69; no token
    changes). The edit of `design.md` is only the `conteudo_e_dados` line of `icones_nucleo`, under the
    explicit authorization of Elvys for the `icones_nucleo` list, relayed by the orchestrator session
    on 11/11/2026; it fulfills the instruction of the task, which puts the two icons in `nph-icon`, and
    is in its own commit (`aee9d61`). The Figma list of `conferir-nph-icon-figma.cjs` is not touched: its node ids are not in
    the evidence.

**Source.** Documentation `5311:8328` and sets `5297:7473` and `5298:7669` of the Figma file
`DS-IA-NEPHOS 5.0`, accepted by Indiane on 10/11/2026 with the Figma UX QA and the textual audit
approved, and the points of its approval page. The names of the properties and events, the controlled
list, the validation and its reasons, the derived states, the live region, the focus rules, the
container query, the thumbnail and the way the description reaches the group are a technical proposal
of this implementation.

**Out of scope.** A token, new or changed, including the two `border-style` tokens and the
`strokeStyle` type of `scripts/tokens-lib.mjs`. A change in `nph-button`, `nph-icon-button`,
`nph-spinner` or `nph-image`. The single file field (`nph-input-file`) and the list of files in the
columns of `nph-data-table`. The upload itself, a web address, a confirmation on removal and an extra
state for a server error. A form association and the reading of a dropped folder.

**Pending decisions for Indiane.**

- **D-1 — the dashed border.** The gate `stroke-style-token` of DSA-74 waits for the `strokeStyle` type in
  `scripts/tokens-lib.mjs` and for `core/border-style/dashed` and `file-upload/border-style`, which are
  token work for Claude in Figma. The zone writes `border-style: dashed` until then. It blocks the
  `done` state of the task, not the pull request.
- **D-2 — the description of the button.** `nph-button` forwards no `aria-describedby`, so the rule and the
  reason describe the group of the zone and not the button itself. She decides whether `nph-button` gains a
  `description` property (a change outside this task).
- **D-3 — the items of a disabled zone.** The design has no disabled item; the code dims the items, disables
  their buttons and takes the link out. She confirms it, or draws the disabled item.
- **D-4 — the error of the zone and the error of the field.** The zone says the reason itself and the field
  may also draw its message line. She confirms where the reason is shown inside `nph-field`.
- **D-5 — the lines of the item.** The format and size line is separate from the status line, and `done`
  shows the `circle-check` and a word. She confirms the reading.

**Status.** Anatomy and behavior accepted by Indiane on 10/11/2026. D-1 to D-5 wait for Indiane. API and
semantics are reviewed in the pull request that brings them; the merge is the approval.

## P120 — `nph-scheduler`: API and semantics

**Technical conflict.** The accepted documentation (frame `6151:11160`, sets `6142:1744` and `6141:9258`)
gives the Figma properties `vista`, `tamanho-de-tela`, `estado` and `lateral` and, for the event, `cor`,
`tipo` and `estado`; the behavior of a calendar in which each day and each event is a Tab stop (a
deliberate deviation from the APG Grid pattern); the accessibility, the limits and the tokens; and leaves
the code API to the code, with seven points open in the task. Ten points need a decision of their own:

- the scheduler is one Figma set with an inner event, the toolbar buttons, the view select, the
  checkboxes, the avatar stack, the skeleton rows and the popover come "by instance", and the popover
  looks its trigger up in the same root through `for`, so the code has to say how many tags there are
  and who owns the events;
- the data (the events, the calendars, the people and the texts) comes from the screen, and the
  evidence says neither the shape of an event, nor how a calendar gives it its color, nor which
  instant format avoids a time zone, nor what an event that crosses midnight is;
- the evidence says "the scheduler hands the click on the event to the screen" and also "Enter or Space on
  the event opens the detail in the nph-popover and moves the focus into it", while opening, creating
  and editing the detail belongs to the product;
- the Tab order the evidence asks for (toolbar, side panel, days, events in start order) is not the
  visual order of the side panel, the all-day band and the grid, and a positive `tabindex` is not an
  option;
- the evidence fixes the minimum height of an event at 24 px and gives no height for an hour, no width
  for the time of a list row, no size for the cell of the mini month and no measure for the color of a
  calendar;
- the month cell "shows the rows that fit and `+N more`", and what fits is only known after layout;
- the mini month and the compact month are "the date-picker grid, by instance", and the date-picker
  grid does not exist yet and is not part of this task;
- the sidebar button needs the `sidebar` icon, which is not in `nph-icon` (the case of P116, item 9);
- the evidence leaves the break between desktop and mobile, the interval of the now line, the scroll on
  a short desktop and the way the texts are passed and translated to the code;
- the evidence says nothing about input the contract does not accept.

**Decision.** `nph-scheduler` is a Web Component with **open Shadow DOM** (P01), in one tag, with its CSS
in its own file imported `?inline`. It has no color property and no `::part`; the only slots are `detail`
and `detail-footer`. Anatomy only through semantic tokens: the `scheduler/*` and `event/<color>-*` ones
(the event is bound to its `scheduler/*` token, never to the semantic it points to) and the global focus
ones. What it rejects renders nothing and emits `console.error` only in development, once per cause: the
rule of P21. The names follow P64.

1. **One tag; the event is an inner part.** The toolbar, the side panel, the day header, the all-day
   band, the time column, the day grid, the now line, the event, the month cell and line, the list row
   and the compact month are drawn in the shadow root of the scheduler. The package takes one definition
   per folder (P91), and `aria-expanded`, `aria-haspopup` and the `for` of the `nph-popover` need the
   event and the popover in the same root. The buttons, the view select, the checkboxes, the avatars, the
   skeleton rows and the popover are the approved pieces, by instance, with no override of background or
   outline.

2. **The data is by property.** `events` is a list of `{ id, title, start, end?, allDay?, calendar?,
   cancelled?, recurring?, people? }`; `calendars` is a list of `{ id, name, color, visible? }` with the
   `color` of the Figma `cor` (`primary` or one of the seven verticals); `labels` is the object of every
   text the piece writes, already localized, with the 25 keys the type lists. An event takes the color
   and the name of its calendar; an event with no calendar is `primary` with no calendar name. An instant
   is a wall-clock string, `YYYY-MM-DDTHH:mm`; an all-day event is `YYYY-MM-DD`, its `end` the last day,
   included; a string with a zone (`Z`, `+03:00`) is refused, because the piece has no zone. The days are
   whole numbers of days and the minutes of a day, never a `Date` in the local zone, so the arithmetic is the
   same in any zone and in a day with a change of the clock. An event with no `end` ends when it starts.
   An event that ends exactly at midnight, on the next day or later, ends at 24:00 of the day before, which
   stays its last day (an event from the 11th at 22:00 to the 13th at 00:00 covers the 11th and the 12th);
   one that covers more than one
   calendar day, with or without time, is a **multi-day** event and goes to the all-day band, in one bar.
   An event that cannot be read (no id, repeated id, no title, an instant that does not read, an end
   before the start, a calendar that does not exist) is left out with its own error; a calendar with no
   id, a repeated one or no name is left out with its own error, and so are the events that point to it,
   because the name is the text of its checkbox; a color that does not exist keeps the calendar, reports it,
   and `primary` is used for the color.

3. **Attributes.** `view`: `work-week` (default), `week`, `day`, `month` or `list`; reflects, because the
   CSS selects the layout by it. `date`: `YYYY-MM-DD`, the day the period is built around; absent, today.
   `week-start`: `sunday` (default) or `monday`; it is a property of the page, not of the language. The
   work week is the Monday to Friday of the week the week start gives (a week that starts on Sunday has its
   Monday the day after, so a Sunday shows the work week that starts the next day). `hide-side-panel` is the inverse of the Figma
   `lateral` (the precedent of `hide-collapse-button` in P116); reflects. `loading` reflects. `now`: an
   instant that stands for the clock, so the now line and "today" are the same in a story and a test;
   absent, the clock of the machine, read again every minute (the update interval, 60 s). `open-event`:
   the `id` of the event whose detail is open; it reflects and the attribute leaves when nothing is open.
   The empty state is not a property: it is a period with no visible event, in every view. The piece
   writes `view`, `date` and `hide-side-panel` when the person changes them; setting them from code
   fires nothing.

4. **Events.** All bubble and are composed, and fire only when the person acts, as in P115 and P118:
   `nph-view-change` (`{ view }`), `nph-date-change` (`{ date, source }`, the source being `today`,
   `previous`, `next`, `mini-month`, `month` or `more`), `nph-event-click` (`{ id, source }`, cancelable;
   the source is `pointer` or `keyboard`), `nph-event-close` (`{ id, source }`), `nph-day-click`
   (`{ date }`), `nph-new-event` (`{ date }`), `nph-filter-click`, `nph-filter-select` (`{ value, checked }`),
   `nph-calendar-toggle` (`{ id, visible }`) and `nph-side-panel-change` (`{ open }`). The checkbox of a
   calendar replaces `calendars` with a new list and never changes the objects of the consumer, as
   `nph-dropdown-menu` does with `items` (P92). "Filter" opens an `nph-dropdown-menu` when `filter-items`
   has items, and only fires `nph-filter-click` when it has none; the menu is drawn in the shadow root,
   so its `for` finds the button.

5. **The detail belongs to the product; the popover is the mechanism.** The scheduler does not draw the
   detail and does not create or edit an event. A click, Enter or Space on an event fires
   `nph-event-click`; if the screen does not cancel it, the event becomes the `open-event`. When the
   screen puts content in the `detail` slot (and `detail-footer`), the scheduler opens one `nph-popover`
   beside the event, with the title of the event as `heading`, and writes `aria-haspopup="dialog"` and
   `aria-expanded` on the events, after every render, because the popover removes both from its trigger when
   it leaves. Without content in the slots nothing opens and the events carry no popup state. The popover
   lives while the detail is open, so there is no exit animation: its `nph-close` ends the detail and fires
   `nph-event-close` with its source (`escape`, `outside` or `focus-out`); a click on the open event closes it
   (`toggle`). Esc returns the focus to the event; a press outside leaves it where the person clicked. An
   event that leaves the data (removed, or its calendar hidden), or that is not drawn after the person moves to
   another period or view, closes the detail with nothing fired, so it does not open again on its own. The event
   is the trigger of the popover and is not an `nph-button`, which the sheet of `nph-popover` lists as an
   anti-pattern: the accepted documentation says so (it follows DSA-67 D-2 in part), and the open event
   draws its own hover look with `aria-expanded` for that reason.

6. **Tab order from the document, never `tabindex`.** The DOM order is the toolbar, the side panel, the
   body; the container is a grid with areas, so the visual order is still the side panel at the start.
   Inside the body: the day headers, then the all-day band, then the events of the grid by day and start
   (at the same start, the longer first, which is the leftmost); in the month, a layer of day buttons
   first and the layer of the event lines and "+N more" after it, over the same cells. Each day and each
   event is a stop. No arrow keys on the grid. The all-day band comes before the grid in the document, so
   an all-day event of a later day is reached before a timed event of an earlier day: a known limit of the
   order, not a contradiction of it. The mini month and the compact month are one stop with the arrows,
   Page Up, Page Down (Shift for the year), Home and End of the date grid, mirrored in a right-to-left page.
   The list view has the day as a heading, not a stop. Enter or Space on "+N more" goes to the day view of
   that date and the focus lands on its day header. A click on a day fires `nph-day-click` and does
   nothing else: the evidence gives the day no action.

7. **The hour is twice the minimum height of an event.** There is no token for the height of an hour.
   The CSS makes it `calc(scheduler/event-min-height * 2)`, so a half hour fits the 24 px minimum;
   `MIN_VISUAL_MINUTES` (30) in the logic file is that duration, and a test holds the two together. An
   event is placed by minute, from the top of its day, and takes the longer of its duration and the
   minimum; events that touch share the column side by side (the first column is the longer of two that
   start together); the time shows under the title from 60 minutes. A day has 24 hours; the toolbar and
   the day header stay in place and only the grid scrolls, which needs the screen to give the scheduler a
   height. The grid starts at the first event of the period (one hour before it), at the now line when there
   is none, and at 07:00 otherwise; it starts again only when the period changes, or when the events arrive
   late and the person has not scrolled.

8. **The month measures its cells.** The cell shows the lines that fit and "+N more" (an `nph-button`
   compact, in a group named by the count and the date). What fits is measured after the render
   (`ResizeObserver`) from a probe line and the room of the first cell, and draws again when the room
   changes; before the first measure, every line is drawn. The rows have at least four minimum heights.
   A line is one text line, `text/label-sm`, at `scheduler/event-min-height`: the evidence draws it one text
   line high and also sets 24 px as the minimum of an event (WCAG 2.5.8), and the accessibility gate of P72
   fails a 16 px target, so the minimum wins. A multi-day event has one line on each day it covers.

9. **The list.** The week of `date`, only the days that have events, each under a heading; a multi-day event
   appears under each day it covers. The time column is three times `scheduler/time-column-width`.

10. **The phone is a width, not a user-agent.** Below 768 px of the width of the element (the `md`
    breakpoint of P116, read by a `ResizeObserver` on the host, not by a media query on the window) the
    scheduler is the compact month with the list of the chosen day, whatever the `view`, and the
    toolbar of the phone (the month label, previous, next and an icon-only primary "New event"); the view
    select is below it and offers the same views. Choosing another view keeps the compact month and the
    value is kept for the desktop width (the Figma draws only the month on mobile). The day list is one
    row per event, with the start time before the event.

11. **The mini month and the compact month are the scheduler's own date grid (provisional).** The
    date-picker grid does not exist and building it is not part of this task, so the scheduler draws a month
    grid of its own: a `role="grid"` with one stop, the selected day filled, today marked, and the days of the
    other months dimmed and selectable; the compact one adds the event dot. It has no popup, no range, no
    minimum or maximum and no form association: it is not an `nph-date-picker`. The month label and two
    buttons move the month shown without moving the date. When the date-picker grid exists, this grid is the
    one that goes. The cell of the mini month is `control/height-compact`.

12. **The `sidebar` icon keeps its place (the case of P116, item 9).** The icon is not in `nph-icon` and the
    task does not add it. The sidebar button is a native button with the look of the `nph-button` secondary
    ghost and an `nph-skeleton` of `icon/size-md` in the place of the icon, with `aria-label`,
    `aria-expanded`, `aria-controls` and an `nph-tooltip` with the name. When the icon enters `nph-icon`
    the button becomes an `nph-button` with `icon-start="sidebar"`: no API changes. The recurring event uses
    `rotate-right` until `repeat` enters `nph-icon`; the empty state uses `calendar`. No icon was added.

13. **Empty and loading change only the events area.** Empty: the `calendar` icon, the title and the hint
    (`emptyTitle`, `emptyHint`), centered on the grid, until `nph-empty` has a set in Figma; the week keeps its
    seven days. Loading: `nph-skeleton` lines in the columns, the cells and the list, `aria-busy` on the body
    and a status with `loading`; the toolbar stays active.

14. **The language is the nearest `lang`.** Crossing shadow roots, as `nph-pagination` reads it, in English
    without one; the dates, the weekday names, the hours and the period are `Intl` with `timeZone: 'UTC'`
    over the civil day, so a zone never moves a date. A change of `lang` or `dir` on the root element of
    the page draws the piece again; one on an inner element is read at the next render. The accessible name starts with the text the person sees, in the order they see it (WCAG
    2.5.3, which the gate of P72 checks), and goes on as a comma list: for an event, the cancelled text, the
    title and the time when it is written, then the date, the time when it is not written, the calendar and,
    when it applies, `cancelledName` and `repeats`; a list row writes the time first. The people of a day are
    a sentence in the language of the page. The day starts with what it writes (`Mon 9`), goes on with the
    full date and, today, `todayName`. A period change the person makes is announced politely with the
    period label.

15. **The now line.** A line of `scheduler/now-indicator-width` in the column of today, with the dot of
    `scheduler/now-indicator-size` on its start edge and the current time over the time column; it is
    decoration (`aria-hidden`), and today is in the name of the day.

16. **Invalid input.** A `view`, a `week-start`, a `date` or a `now` that does not exist draws nothing and
    says why, once per cause while it lasts. A list that is not a list, a null `labels` and a null event are
    no data. A missing label renders and says which ones are missing, once; a control that would have no accessible name
    without it (an icon-only button, the sidebar button, the view select) is not drawn.

**Source.** Documentation `6151:11160` and sets `6142:1744` and `6141:9258` of the Figma file
`DS-IA-NEPHOS 5.0`, accepted by Indiane on 12/11/2026 with the Figma UX QA and the textual audit approved,
and the twelve points of its approval page. The names of the properties, events and slots, the shape of the
data, the instant format, the multi-day rule, the popover mechanism, the order of the document, the hour
height, the measure of the month cell, the break measured on the element, the provisional date grid and the
way the texts reach the code are a technical proposal of this implementation.

**Out of scope.** A token, new or changed. A change in `nph-button`, `nph-icon-button`, `nph-select`,
`nph-checkbox`, `nph-avatar-stack`, `nph-popover`, `nph-skeleton`, `nph-icon`, `nph-dropdown-menu` or
`nph-empty`. The `nph-date-picker` and its grid. The detail of the event, and the creation and editing of
events, which belong to the product. Past and tentative events, a time scale, a recurrence rule, a time zone
and the drag of an event. The focus of the primary `nph-button` in dark mode, corrected in the `nph-button`.

**Pending decisions for Indiane.**

- **D-1 — the date grid.** The mini month and the compact month are the scheduler's own grid until the
  date-picker grid exists. She decides when it is replaced and whether the compact month keeps the arrows.
- **D-2 — the `sidebar` icon.** The sidebar button keeps the place of the icon with a skeleton (P116, D-1).
  She frees the foundation task that adds `sidebar` to `nph-icon`, and `repeat` for the recurring event.
- **D-3 — derived measures.** No token states the hour (twice the minimum event height), the cell of the
  mini month (`control/height-compact`), the time of a list row (three times the time column), the time of a
  phone row (one and a half times it), the minimum of a month row (four minimum event heights) and the swatch
  of a calendar (`icon/size-sm`). She confirms them or gives tokens.
- **D-4 — the color of a calendar.** "My calendars" shows the color of each calendar as a swatch beside the
  checkbox; the evidence names the checkbox only. She confirms the swatch.
- **D-5 — the click on a day.** A day hands its date to the screen (`nph-day-click`) and does nothing else; the
  evidence gives it no action. She confirms it, or says that the month day opens the day view.
- **D-6 — the detail.** The scheduler hosts the `nph-popover` of the detail and the screen gives its content
  through a slot. She confirms that the mechanism belongs to the scheduler and the content to the product.
- **D-7 — the order of the all-day band.** The band comes before the grid in the document, so Tab reaches an
  all-day event of a later day before a timed event of an earlier one. She confirms it.

**Status.** Anatomy and behavior accepted by Indiane on 12/11/2026. D-1 to D-7 wait for Indiane. API and
semantics are reviewed in the pull request that brings them; the merge is the approval.

---

## How to change one of these decisions

Do not change, replace or reopen P01, P02, P03, P17, P19, P20, P21, P62, P63, P64, P65, P66, P67, P68, P69, P70, P71, P72, P73, P74, P75, P76, P77, P78, P79, P80, P81, P82, P83, P84, P85, P86, P87, P90, P91, P92, P93, P94, P95, P96, P97, P98, P99, P100, P101, P102, P104, P105, P106, P107, P108, P109, P110, P111, P112, P113, P114, P115, P116, P117, P118, P119 or P120 without:

1. explaining the concrete technical conflict;
2. recording a change proposal;
3. requesting human review.

This applies to people and to agents.

## Where these decisions appear

| Document | What it says about them |
|---|---|
| [`../README.md`](../README.md) | Summary and pointer to this note |
| [`../AGENTS.md`](../AGENTS.md) | Mandatory reading rule before touching a component |
| [`../CLAUDE.md`](../CLAUDE.md) | Claude-only instruction; the common rule is in `AGENTS.md` |
| [`../GOVERNANCA.md`](../GOVERNANCA.md) | Current state of the repository |
| [`../design.md`](../design.md) | Foundations contract; §9 and §10 aligned with P03 and P17 |
| [`tokens.md`](tokens.md) | How P17 and P20 are applied: source, generation, consumption and validations |
| [`../fichas/<name>.md`](../fichas/) | How the decision reaches the component: contract, variants, states and tokens |

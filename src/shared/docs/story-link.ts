/**
 * Link from a page to another story of the Nephos Storybook.
 *
 * The preview opens links in the top window (`base target=_parent`), and a
 * plain `href` would reload the whole Storybook and lose the chosen language
 * and color mode. The click asks the frame for the story through the channel,
 * as the sidebar does; the `href` stays for semantics and for opening in a new
 * tab, where a modified click goes untouched.
 */
import { addons } from 'storybook/preview-api';
import { SELECT_STORY } from 'storybook/internal/core-events';

export function storyHref(storyId: string): string {
  return `./?path=/story/${storyId}`;
}

export function goToStory(event: MouseEvent, storyId: string): void {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  addons.getChannel().emit(SELECT_STORY, { storyId });
}

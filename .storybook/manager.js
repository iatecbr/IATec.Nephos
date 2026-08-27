import { addons } from 'storybook/manager-api';
import { themes } from 'storybook/theming';

addons.setConfig({
  theme: {
    ...themes.light,
    brandTitle: 'Nephos',
    brandUrl: './',
    brandTarget: '_self',
  },
  sidebar: {
    showRoots: true,
  },
});

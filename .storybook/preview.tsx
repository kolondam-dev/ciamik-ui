import type { Preview } from '@storybook/react';
import '../src/tokens/index.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'centered',
    backgrounds: {
      default: 'ciamik-light',
      values: [
        { name: 'ciamik-light', value: 'var(--ciamik-bg, #EDEEF3)' },
        { name: 'ciamik-surface', value: 'var(--ciamik-surface, #FFFFFF)' },
        { name: 'ciamik-dark', value: '#0E1430' },
        { name: 'white', value: '#FFFFFF' },
      ],
    },
  },
  decorators: [
    (Story, context) => {
      const isDark = context.globals?.theme === 'dark';
      return (
        <div className={isDark ? 'dark' : ''} style={{ fontFamily: 'var(--font-family)' }}>
          <Story />
        </div>
      );
    },
  ],
  globalTypes: {
    theme: {
      description: 'Color theme',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
  },
};

export default preview;

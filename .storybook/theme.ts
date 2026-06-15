import { create } from '@storybook/theming/create';

export default create({
  base: 'light',
  
  // Brand details
  brandTitle: 'ciamik.id',
  brandUrl: 'https://design.ciamik.id',
  brandImage: undefined, // Renders the text logo "ciamik.id" directly
  brandTarget: '_self',

  // Typography
  fontBase: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  fontCode: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',

  // Theme colors
  colorPrimary: '#008080',    // ciamik primary teal
  colorSecondary: '#F39C12',  // ciamik accent amber/gold

  // UI styling
  appBg: '#F4F5F7',
  appContentBg: '#FFFFFF',
  appPreviewBg: '#EDEEF3',
  appBorderColor: 'rgba(123, 130, 160, 0.15)',
  appBorderRadius: 8,

  // Text colors
  textColor: '#0E1430',
  textInverseColor: '#FFFFFF',

  // Toolbar & Tabs styling
  barTextColor: '#7B82A0',
  barSelectedColor: '#008080',
  barHoverColor: '#008080',
  barBg: '#FFFFFF',

  // Form inputs
  inputBg: '#FFFFFF',
  inputBorder: 'rgba(123, 130, 160, 0.2)',
  inputTextColor: '#0E1430',
  inputBorderRadius: 6,
});

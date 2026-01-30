const path = require('node:path');

module.exports = {
  stories: [
    '../components/**/*.stories.mdx',
    '../components/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    {
      name: '@storybook/addon-postcss',
      options: {
        postcssLoaderOptions: {
          implementation: require('postcss'),
        },
      },
    },
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  viteFinal: async (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'next/config': path.join(__dirname, './next-config-mock.js'),
      'next/link': path.join(__dirname, './mocks/next-link.tsx'),
      'next/router': path.join(__dirname, './mocks/next-router.ts'),
    };
    return config;
  },
};

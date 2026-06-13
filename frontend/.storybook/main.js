const path = require('node:path');

module.exports = {
  stories: ['../components/**/*.stories.@(js|jsx|ts|tsx)'],
  staticDirs: ['../public'],
  addons: ['@storybook/addon-links'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
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

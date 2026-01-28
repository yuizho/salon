const path = require('path');

module.exports = {
  stories: ['../components/**/*.stories.mdx', '../components/**/*.stories.@(js|jsx|ts|tsx)'],
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
    name: '@storybook/react-webpack5',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  webpackFinal: async (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'next/config': path.join(__dirname, './next-config-mock.js'),
    };

    config.resolve.fallback = {
        ...config.resolve.fallback,
        zlib: false,
        fs: false,
        stream: false,
        os: false,
    };

    config.module.rules.push({
      test: /\.(js|jsx|ts|tsx)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: require.resolve('babel-loader'),
          options: {
            presets: [
              ['@babel/preset-react', { runtime: 'automatic' }],
              '@babel/preset-typescript',
              '@babel/preset-env',
            ],
          },
        },
      ],
    });

    return config;
  },
};
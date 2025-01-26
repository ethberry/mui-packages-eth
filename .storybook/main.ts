import type { StorybookConfig } from "@storybook/react-webpack5";

const config: StorybookConfig = {
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
  stories: ["../components/*/src/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/preset-create-react-app",
    "@storybook/addon-links",
    "@storybook/addon-interactions",
  ],
  docs: {
    autodocs: true,
  },
  webpackFinal: config => {
    const { oneOf } = config.module.rules[4];
    const babelLoader = oneOf?.find(({ test }) => new RegExp(test).test(".ts"));
    if (babelLoader) {
      babelLoader.include = [/components\/(.*)\/src/, /.storybook/];
      babelLoader.options.sourceType = "unambiguous";
    }
    return config;
  },
};

export default config;

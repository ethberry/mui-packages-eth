import typescriptRules from "@ethberry/eslint-config/presets/tsx.mjs";
import jestRules from "@ethberry/eslint-config/tests/jest.mjs";

// DON'T ADD ANY RULES!
// FIX YOUR SHIT!!!

export default [
  {
    ignores: [
      ".storybook",
      "**/dist",
    ]
  },

  {
    languageOptions: {
      parserOptions: {
        project: [
          "./tsconfig.eslint.json",
          "./components/*/tsconfig.eslint.json",
          "./other/*/tsconfig.eslint.json",
          "./providers/*/tsconfig.eslint.json",
        ],
        tsconfigRootDir: import.meta.dirname
      },
    }
  },

  ...typescriptRules,
  ...jestRules,
];

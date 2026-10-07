import js from "@eslint/js";
import globals from "globals";
import prettierConfig from "eslint-config-prettier";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: ["node_modules/", "runs/", ".cache/", "baselines/", "reports/", "workers/"],
  },

  js.configs.recommended,

  {
    files: ["**/*.{js,mjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.node,
    },
  },

  ...tseslint.configs.recommended.map((config) => ({ ...config, files: ["src/**/*.ts", "test/**/*.ts"] })),

  {
    files: ["src/**/*.ts", "test/**/*.ts"],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    },
  },

  prettierConfig,
];

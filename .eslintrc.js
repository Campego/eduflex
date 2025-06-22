/* eslint-env node */
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: ["eslint:recommended", "next/core-web-vitals", "prettier"],
  rules: {
    "import/order": [
      "error",
      {
        groups: ["builtin", "external", "internal", ["parent", "sibling"]],
        pathGroups: [
          {
            pattern: "react",
            group: "external",
            position: "before",
          },
        ],
        pathGroupsExcludedImportTypes: ["react"],
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      },
    ],
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      parserOptions: {
        project: ["./tsconfig.json"],
        tsconfigRootDir: __dirname,
      },
      extends: [
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "next/core-web-vitals",
        "prettier",
      ],
      rules: {
        // También las desactivamos dentro del override por seguridad
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-call": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-unsafe-argument": "off",
        "@typescript-eslint/no-redundant-type-constituents": "off",
      },
    },
  ],
};

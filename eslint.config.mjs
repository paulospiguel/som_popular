import { dirname } from "path";
import { fileURLToPath } from "url";

import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Remove imports não utilizados
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          // permitir erros capturados não usados
          caughtErrors: "none",
        },
      ],
      // Ordena imports automaticamente
      "import/order": [
        "warn",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
      // Regras essenciais como erro
      "react-hooks/rules-of-hooks": "error",
      "@typescript-eslint/no-unused-expressions": "error",

      // Regras importantes como warning
      "@typescript-eslint/no-explicit-any": "warn",
      "react/no-children-prop": "warn",
      "react-hooks/exhaustive-deps": "warn",
      "@next/next/no-img-element": "warn",

      // Regras menos críticas como warning
      "react/no-unescaped-entities": "warn",
    },
  },
];

export default eslintConfig;

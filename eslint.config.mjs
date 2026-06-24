import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "scripts/**",
    ],
  },
  {
    rules: {
      // Règle React Compiler très stricte : patterns légitimes ici
      // (hydratation localStorage, reset de pagination contrôlé).
      "react-hooks/set-state-in-effect": "off",
      // Interfaces « extends » vides des primitives shadcn/ui.
      "@typescript-eslint/no-empty-object-type": "off",
      // Contenu français : les apostrophes dans le JSX sont valides et lisibles.
      "react/no-unescaped-entities": "off",
    },
  },
];

export default eslintConfig;

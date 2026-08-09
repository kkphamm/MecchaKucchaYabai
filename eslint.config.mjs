import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    // Motion Primitives ships as copy-in source (design.md Section 6/7):
    // restyle only, don't rewrite internals to satisfy newer/stricter lint
    // rules that the upstream source itself doesn't pass.
    files: ["src/components/core/**", "src/hooks/usePreventScroll.tsx"],
    rules: {
      "react-hooks/static-components": "off",
      "react-hooks/set-state-in-effect": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
]);

export default eslintConfig;

import prettier from "eslint-config-prettier";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const config = [
  {
    ignores: [
      "**/.next/**",
      "**/coverage/**",
      "**/dist/**",
      "node_modules/**",
      "playwright-report/**",
      "test-results/**"
    ]
  },
  ...nextVitals,
  ...nextTypescript,
  {
    settings: {
      next: {
        rootDir: "apps/web/"
      }
    },
    rules: {
      "@next/next/no-html-link-for-pages": "off"
    }
  },
  prettier
];

export default config;

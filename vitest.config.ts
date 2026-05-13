import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      exclude: ["node_modules/", ".next/", "src/test/"],
    },
  },
  resolve: {
    alias: {
      "@atom": path.resolve(__dirname, "./src/components/atoms"),
      "@molecule": path.resolve(__dirname, "./src/components/molecules"),
      "@organism": path.resolve(__dirname, "./src/components/organisms"),
      "@template": path.resolve(__dirname, "./src/components/templates"),
      "@hook": path.resolve(__dirname, "./src/hooks"),
      "@provider": path.resolve(__dirname, "./src/providers"),
      "@lib": path.resolve(__dirname, "./src/libs"),
      "@i18n": path.resolve(__dirname, "./i18n"),
    },
  },
});

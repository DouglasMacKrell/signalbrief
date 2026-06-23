import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "unit",
    globals: true,
    environment: "node",
    include: ["tests/**/*.test.ts"],
    exclude: ["tests/integration/**", "tests/ollama/**"],
    passWithNoTests: true,
    coverage: {
      provider: "v8",
      include: ["src/domain/**", "src/providers/**", "src/seed/**"],
      reporter: ["text", "text-summary"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});

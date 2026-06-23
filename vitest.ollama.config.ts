import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "ollama",
    globals: true,
    environment: "node",
    include: ["tests/ollama/**/*.test.ts"],
    passWithNoTests: false,
    testTimeout: 150_000,
    hookTimeout: 15_000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});

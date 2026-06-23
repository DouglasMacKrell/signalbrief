import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "integration",
    globals: true,
    environment: "node",
    include: ["tests/integration/**/*.integration.test.ts"],
    setupFiles: ["tests/integration/setup.integration.ts"],
    hookTimeout: 60_000,
    testTimeout: 30_000,
    passWithNoTests: false,
    fileParallelism: false,
    maxWorkers: 1,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});

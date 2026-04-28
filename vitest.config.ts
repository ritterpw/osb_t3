import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    testTimeout: 60_000, // testcontainers cold-start can be slow
    hookTimeout: 60_000,
    pool: "forks",
    poolOptions: { forks: { singleFork: true } }, // share one DB container per run
    setupFiles: ["./tests/setup.ts"],
    exclude: ["**/node_modules/**", "**/tests/e2e/**"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
});

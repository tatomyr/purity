import {defineConfig} from "vitest/config"

export default defineConfig({
  test: {
    environment: "jsdom",
    restoreMocks: true,
    coverage: {
      reporter: ["text", "json-summary", "json"],
      extension: [".ts"],
      all: true,
      include: ["src/**/*.ts"],
      exclude: ["src/**/index.ts", "src/**/*.test.ts", "src/**/*.d.ts"],
    },
    snapshotFormat: {
      escapeString: false,
    },
  },
})

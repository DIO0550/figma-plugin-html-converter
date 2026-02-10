import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/mcp-server/index.ts"),
      formats: ["es"],
      fileName: () => "index.js",
    },
    outDir: "dist-mcp",
    target: "node18",
    minify: false,
    sourcemap: false,
    emptyOutDir: true,
    rollupOptions: {
      external: [
        "@modelcontextprotocol/sdk",
        "@modelcontextprotocol/sdk/server/stdio.js",
        "@modelcontextprotocol/sdk/server/streamableHttp.js",
        "zod",
        "node:fs",
        "node:path",
        "node:url",
        "node:http",
        "node:https",
        "node:stream",
        "node:buffer",
        "node:util",
        "node:events",
        "node:crypto",
        "node:net",
        "node:tls",
        "node:os",
        "node:child_process",
        "node:worker_threads",
        "node:async_hooks",
      ],
      output: {
        format: "es",
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});

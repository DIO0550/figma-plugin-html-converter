import { defineConfig } from "vite";
import { resolve } from "path";
import { builtinModules } from "module";

const nodeBuiltins = builtinModules.flatMap((mod) => [mod, `node:${mod}`]);

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
      external: [/^@modelcontextprotocol\/sdk(\/.*)?$/, "zod", ...nodeBuiltins],
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

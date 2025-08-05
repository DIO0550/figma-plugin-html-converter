import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readFileSync } from 'fs';

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  
  return {
    build: {
      lib: {
        entry: {
          code: resolve(__dirname, 'src/code.ts'),
        },
        formats: ['es'],
        fileName: (_format, entryName) => `${entryName}.js`,
      },
      rollupOptions: {
        external: [],
        output: {
          dir: 'dist',
          format: 'es',
        },
        plugins: [
          {
            name: 'copy-ui-html',
            generateBundle() {
              const htmlContent = readFileSync(resolve(__dirname, 'src/ui.html'), 'utf-8');
              this.emitFile({
                type: 'asset',
                fileName: 'ui.html',
                source: htmlContent,
              });
            },
          },
        ],
      },
      target: 'es2017',
      minify: isProduction,
      sourcemap: !isProduction,
      emptyOutDir: true,
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
  };
});
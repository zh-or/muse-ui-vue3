import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig(({ command }) => ({
  plugins: [vue()],
  root: command === 'serve' ? 'demo' : undefined,
  base: command === 'serve' ? '/' : './',
  build: command === 'build' ? {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'MuseUI',
      formats: ['es', 'cjs'],
      fileName: (format) => `muse-ui-vue3.${format === 'es' ? 'es' : 'cjs'}.js`
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        exports: 'named',
        globals: {
          vue: 'Vue'
        }
      }
    },
    cssFileName: 'style'
  } : undefined,
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  }
}));

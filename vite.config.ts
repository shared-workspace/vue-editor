import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from "path";
import UnoCSS from "unocss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    UnoCSS()
  ],
  optimizeDeps: {
    include: ["path-browserify", "@vue/language-service", "monaco-editor-core"],
  },
  resolve: {
    alias: {
      path: "path-browserify",
    },
  },
  build: {
    minify: false,
    outDir: path.resolve(__dirname, "./dist"),
  },
  server: {
    port: 3000,
  },
})

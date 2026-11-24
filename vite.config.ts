import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // fileURLToPath funciona também no Windows (URL.pathname gera "/D:/...").
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});

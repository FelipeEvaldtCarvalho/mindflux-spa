import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

const getUrl = () => new URL("./src", import.meta.url).pathname;

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": getUrl(),
    },
  },
});

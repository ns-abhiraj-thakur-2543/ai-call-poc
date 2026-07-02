import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/poc-demo/",
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://devai.careerforcepro.com",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});

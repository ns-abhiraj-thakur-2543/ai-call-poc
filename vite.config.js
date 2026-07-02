import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: '/poc-demo/',
  plugins: [react()],
  define: {
    // This automatically rewrites the hardcoded URL to the relative Nginx path ONLY during production build
    'https://devai.careerforcepro.com/api': '"/poc-demo/api"', 
  },
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
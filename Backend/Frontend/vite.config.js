import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3002, // if you use 3002
    proxy: {
      "/api": {
        target: "http://localhost:5004",
        changeOrigin: true,
        secure: false,
      },
      "/socket.io": {
        target: "http://localhost:5004",
        ws: true,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
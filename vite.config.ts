import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/UTRY-Dashboard/",
  build: {
    sourcemap: true, // enable source maps for better stack traces in production
  },

  server: {
    host: "::",
    port: 8080,
    hmr: {
      host: "840e847d4b5d.ngrok-free.app",
      protocol: "wss",
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === "development" ? "/" : "/UTRY-Dashboard/",
  build: {
    sourcemap: true, // enable source maps for better stack traces in production
  },

  server: {
    host: "::",
    port: 8081,
    allowedHosts: ["lobby-phys-other-voice.trycloudflare.com", "jennet-sweeping-warthog.ngrok-free.app"],
    hmr: {
      // --- CORRECTED ---
      // The host should be just the hostname, without the protocol or trailing slash.
      //host: "jennet-sweeping-warthog.ngrok-free.app",
      //protocol: "wss",
    },
    proxy: {
      // Forward API calls from the dev server to your backend
      "/api": {
        target: "https://jennet-sweeping-warthog.ngrok-free.app", // Updated to ngrok URL
        changeOrigin: true,
        secure: false,
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

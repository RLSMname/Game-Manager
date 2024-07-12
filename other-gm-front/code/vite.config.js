import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Middleware to set the necessary headers
const headersMiddleware = () => {
  return {
    name: "headers-middleware",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
        res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
        next();
      });
    },
  };
};

export default defineConfig({
  plugins: [react(), headersMiddleware()],
  server: {
    open: true,
  },
});

import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";
import fs from "fs";
import type { Plugin } from "vite";

// Intercepts *.wasm requests in dev and serves them from node_modules
// before React Router's SSR middleware can treat them as routes.
function wasmServePlugin(): Plugin {
  return {
    name: "wasm-serve",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // Return 404 for Chrome DevTools well-known probes before React Router
        // tries to match them as routes and throws noisy errors.
        if (req.url?.startsWith("/.well-known/")) {
          res.writeHead(404).end();
          return;
        }
        if (!req.url?.endsWith(".wasm")) return next();
        const fileName = req.url.split("/").pop()!;
        const wasmPath = path.resolve(
          "node_modules/@energetic-ai/core/dist",
          fileName
        );
        if (fs.existsSync(wasmPath)) {
          res.setHeader("Content-Type", "application/wasm");
          fs.createReadStream(wasmPath).pipe(res);
        } else {
          next();
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [wasmServePlugin(), tailwindcss(), reactRouter(), tsconfigPaths()],
});

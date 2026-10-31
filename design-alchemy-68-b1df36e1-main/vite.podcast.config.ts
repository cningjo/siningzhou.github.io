import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Builds only the Podcast page as static files for GitHub Pages.
// Output goes to <repo root>/podcast/, which is served at /podcast.
export default defineConfig({
  base: "/podcast/",
  publicDir: false,
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: path.resolve(__dirname, "../podcast"),
    // Don't wipe the folder: podcast/media/ holds committed video and image files.
    // The build:podcast script removes only the generated files first.
    emptyOutDir: false,
    rollupOptions: {
      input: path.resolve(__dirname, "podcast.html"),
    },
  },
});

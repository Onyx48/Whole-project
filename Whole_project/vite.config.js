import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// *** CHANGE THIS IMPORT LINE ***
// import path from 'path'; // <-- Original line
import { resolve } from "node:path"; // <-- New line: Import 'resolve' directly from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // *** CHANGE THIS LINE ***
      // "@": path.resolve(__dirname, "./src"), // <-- Original usage
      "@": resolve(__dirname, "./src"), // <-- New usage: Use the imported 'resolve' function directly
    },
  },
});

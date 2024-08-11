import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      pdfmake: path.resolve(__dirname, "node_modules/pdfmake/build/pdfmake.js"),
      vfs_fonts: path.resolve(
        __dirname,
        "node_modules/pdfmake/build/vfs_fonts.js"
      ),
    },
  },
});

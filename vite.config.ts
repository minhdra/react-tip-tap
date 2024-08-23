/// <reference types="vite/client" />
import react from "@vitejs/plugin-react-swc";
import fs from "fs";
import path, { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { libInjectCss } from "vite-plugin-lib-inject-css";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    libInjectCss(),
    dts({
      exclude: [
        "./src/constant",
        "./src/utils",
        "./src/modules/tiptap/IconEditor.tsx",
        "./src/modules/tiptap/ToolbarEditor.tsx",
      ],
      afterBuild: () => {
        const dtsPath = path.resolve(__dirname, "dist/main.d.ts");
        let content = fs.readFileSync(dtsPath, "utf-8");

        // Replace the incorrect path with the correct one
        content = content.replace("../../../../../../src/", "./");

        fs.writeFileSync(dtsPath, content, "utf-8");
      },
    }),
  ],
  css: {
    // convert .app-header (less) to styles.appHeader (tsx)
    modules: {
      localsConvention: "camelCase",
    },
  },
  server: {
    port: 5010,
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/main.ts"),
      formats: ["es"],
      name: "react-tip-tap",
      fileName: (format) => `main.${format}.js`,
    },
    rollupOptions: {
      external: ["antd", "react", "react-dom"],
      output: {
        entryFileNames: "[name].js",
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          antd: "antd",
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
});

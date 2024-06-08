import { resolve } from "path"
import { defineConfig } from "vite"

const outDir = resolve(__dirname, "dist")

export default defineConfig({
  build: {
    minify: false,
    outDir: outDir,
    rollupOptions: {
      input: {
        addButton: "src/addButton.ts",
        background: "src/background.ts",
      },
      output: {
        entryFileNames: "[name].js",
      },
    },
  },
})

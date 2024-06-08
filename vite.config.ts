import { resolve } from "path"
import { defineConfig } from "vite"

const outDir = resolve(__dirname, "dist")

export default defineConfig({
  build: {
    minify: false,
    outDir: outDir,
    rollupOptions: {
      input: {
        // addButton: "src/addButton.ts",
        extractEventInfo: "src/extractEventInfo.ts",
        background: "src/background.ts",
        // backgroundModules: "src/backgroundModules.ts",
        // calendar: "src/calendar.ts",
        // parser: "src/parser.ts",
      },
      output: {
        entryFileNames: "[name].js",
      },
    },
  },
})

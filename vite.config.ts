import { resolve } from "path"
import { defineConfig } from "vite"

const outDir = resolve(__dirname, "dist")

export default defineConfig({
  build: {
    outDir: outDir,
    rollupOptions: {
      input: {
        addButton: "src/addButton.ts",
        background: "src/background.ts",
        calendar: "src/calendar.ts",
        extractEventInfo: "src/extractEventInfo.ts",
        parser: "src/parser.ts",
      },
      output: {
        entryFileNames: "[name].js",
      },
    },
  },
})

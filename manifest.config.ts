import { defineManifest } from "@crxjs/vite-plugin"
import pkg from "./package.json"

export default defineManifest({
  manifest_version: 3,
  name: pkg.name,
  version: pkg.version,
  icons: {
    48: "public/48.png",
  },
  host_permissions: ["https://confit.atlas.jp/*", "https://pub.confit.atlas.jp/*"],
  permissions: ["activeTab", "tabs", "scripting"],
  background: {
    service_worker: "src/background.ts",
    type: "module",
  },
  content_scripts: [
    {
      matches: [
        "https://confit.atlas.jp/*/session/*",
        "https://confit.atlas.jp/*/subject/*",
        "https://pub.confit.atlas.jp/*/session/*",
        "https://pub.confit.atlas.jp/*/presentation/*",
      ],
      js: ["src/addButton.ts"],
    },
  ],
})

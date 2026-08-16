import { addButton as addButtonOld } from "@/confit-old/addButton"
import { addButton as addButtonNew } from "@/confit-new/addButton"

if (document.URL.includes("pub.confit.atlas.jp")) {
  // 2026年ごろからの新サイト
  addButtonNew()
} else {
  // 2025年ごろまでの旧サイトに向けた対応（暫定）
  addButtonOld()
}

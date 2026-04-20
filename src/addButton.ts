import { addButton as addButtonOld } from "@/confit-old/addButton"
import { addButton as addButtonNew } from "@/confit-new/addButton"

if (document.URL.includes("pub.confit.atlas.jp")) {
  addButtonNew()
} else {
  addButtonOld()
}

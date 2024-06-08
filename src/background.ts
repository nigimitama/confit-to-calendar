import { addButtonToConfitPage } from "./backgroundModules"
import { generateCalendarURL } from "./calendar"

const ItemId = "addCalendar"

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.contextMenus.removeAll()
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab.id === undefined) return

    const url = tab?.url
    if (typeof url === "string" && url.includes("confit.atlas.jp") && url.includes("subject")) {
      console.log("Confitサイトにアクセスしました:", tab.url)

      chrome.contextMenus.create({
        id: ItemId,
        title: "Googleカレンダーに追加",
        contexts: ["all"],
      })

      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: addButtonToConfitPage,
        // files: ["addButton.js"],
      })
    }
  })
})

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (tab === undefined) return

  if (info.menuItemId === ItemId) {
    if (tab.id === undefined) return

    // NOTE: jsファイルを指定する場合、viteのトランスパイル時にjsファイルがEmpty chunkになると動かなくなる
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["extractEventInfo.js"],
    })
  }
})

// extractEventInfo.js で実行した結果をmessageで受け取り、タブを開く
chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
  const details = `${message.url}\n\n${message.title}\n${message.details}`
  console.log("message:", message)
  const calendarURL = generateCalendarURL(
    message.title,
    new Date(message.startDate), // stringになっているのでDateにする
    new Date(message.endDate),
    message.location,
    details,
  )
  // 新しいタブでCalendarの入力画面を開く
  chrome.tabs.create({ url: calendarURL })

  // 名前空間をリセット（同じページで2回実行するとconstが2回呼び出されエラーで停止してしまうため）
  chrome.runtime.reload()
})

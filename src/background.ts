import { generateCalendarURL } from "./calendar"

const setupButton = (tabId: number) => {
  chrome.tabs.get(tabId, (tab) => {
    if (tab.id === undefined) return

    const url = tab?.url
    if (typeof url === "string" && url.includes("confit.atlas.jp") && url.includes("subject")) {
      console.log("Confitサイトにアクセスしました:", tab.url)

      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ["addButton.js"],
      })
    }
  })
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, _) => {
  if (changeInfo.status === "complete") {
    setupButton(tabId)
  }
})

chrome.tabs.onActivated.addListener((activeInfo) => {
  setupButton(activeInfo.tabId)
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

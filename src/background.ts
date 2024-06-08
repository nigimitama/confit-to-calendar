import { generateCalendarURL } from "./calendar"

const removeButton = () => {
  const BUTTON_ID = "ConfitToGoogleCalendar"
  const button = document.getElementById(BUTTON_ID)
  if (button && button.parentElement) {
    button.parentElement.removeChild(button)
  }
}

const setupButton = (tabId: number) => {
  chrome.tabs.get(tabId, (tab) => {
    if (tab.id === undefined || tab?.url === undefined) return

    const isConfit = tab.url.includes("confit.atlas.jp")
    const isSessionPage = isConfit && tab.url.includes("session")
    const isEventPage = isConfit && tab.url.includes("subject")
    const isCalendar = tab.url.includes("calendar.google.com")
    if ((isEventPage || isSessionPage) && !isCalendar) {
      console.log("Confitにアクセスしました:", tab.url)

      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ["addButton.js"],
      })
    } else {
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: removeButton,
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

// messageでイベント情報が送られてきたらタブを開く
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

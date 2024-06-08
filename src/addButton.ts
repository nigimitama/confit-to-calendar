import { getDates, getDetails, getLocation, getTitle } from "./parser"

const extractEventInfo = () => {
  const [startDate, endDate] = getDates()
  chrome.runtime.sendMessage({
    url: document.URL,
    title: getTitle(),
    startDate: startDate,
    endDate: endDate,
    location: getLocation(),
    details: getDetails(),
  })
}
// トランスパイル時にextractEventInfo.jsがempty chunkになることを防ぐために関数化せず書く

;(function () {
  const button = document.createElement("button")
  button.textContent = "カレンダーに追加"
  button.id = "fixedButton"
  button.style.position = "fixed"
  button.style.bottom = "20px"
  button.style.right = "20px"
  button.style.padding = "10px"
  button.addEventListener("click", () => {
    extractEventInfo()
  })
  document.body.appendChild(button)
  console.log("button added")
})()

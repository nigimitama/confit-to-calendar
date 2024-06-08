import { getDates, getDetails, getLocation, getTitle } from "./parser"
// トランスパイル時にextractEventInfo.jsがempty chunkになることを防ぐために関数化せず書く
;(function () {
  const [startDate, endDate] = getDates()
  chrome.runtime.sendMessage({
    url: document.URL,
    title: getTitle(),
    startDate: startDate,
    endDate: endDate,
    location: getLocation(),
    details: getDetails(),
  })
})()

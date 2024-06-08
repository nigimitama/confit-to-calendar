import { getDates, getDetails, getLocation, getTitle } from "./parser"

const extractEventInfoToCreateCalendarURL = () => {
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

;(function () {
  extractEventInfoToCreateCalendarURL()
})

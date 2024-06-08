import { getDates, getDetails, getLocation, getTitle } from "./parser"

export const extractEventInfoToCreateCalendarURL = () => {
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

export const addButtonToConfitPage = () => {
  const button = document.createElement("button")
  button.textContent = "カレンダーに追加"
  button.id = "fixedButton"
  button.style.position = "fixed"
  button.style.bottom = "20px"
  button.style.right = "20px"
  button.style.padding = "10px"
  button.addEventListener("click", () => {
    alert("Button Clicked!")
  })
  document.body.appendChild(button)
}

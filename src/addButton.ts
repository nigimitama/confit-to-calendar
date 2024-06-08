import { getDates, getDetails, getLocation, getTitle } from "./parser"

// svgファイルのパスを指定する方法がうまくいかなかったので一旦直接SVGタグを入れる
const calendarIcon = `
<svg width="1.2em" height="1.2em" style="vertical-align: middle" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Livello_1" x="0px" y="0px" viewBox="0 0 200 200" enable-background="new 0 0 200 200" xml:space="preserve">
<g>
	<g transform="translate(3.75 3.75)">
		<path fill="#FFFFFF" d="M148.882,43.618l-47.368-5.263l-57.895,5.263L38.355,96.25l5.263,52.632l52.632,6.579l52.632-6.579    l5.263-53.947L148.882,43.618z"/>
		<path fill="#1A73E8" d="M65.211,125.276c-3.934-2.658-6.658-6.539-8.145-11.671l9.132-3.763c0.829,3.158,2.276,5.605,4.342,7.342    c2.053,1.737,4.553,2.592,7.474,2.592c2.987,0,5.553-0.908,7.697-2.724s3.224-4.132,3.224-6.934c0-2.868-1.132-5.211-3.395-7.026    s-5.105-2.724-8.5-2.724h-5.276v-9.039H76.5c2.921,0,5.382-0.789,7.382-2.368c2-1.579,3-3.737,3-6.487    c0-2.447-0.895-4.395-2.684-5.855s-4.053-2.197-6.803-2.197c-2.684,0-4.816,0.711-6.395,2.145s-2.724,3.197-3.447,5.276    l-9.039-3.763c1.197-3.395,3.395-6.395,6.618-8.987c3.224-2.592,7.342-3.895,12.342-3.895c3.697,0,7.026,0.711,9.974,2.145    c2.947,1.434,5.263,3.421,6.934,5.947c1.671,2.539,2.5,5.382,2.5,8.539c0,3.224-0.776,5.947-2.329,8.184    c-1.553,2.237-3.461,3.947-5.724,5.145v0.539c2.987,1.25,5.421,3.158,7.342,5.724c1.908,2.566,2.868,5.632,2.868,9.211    s-0.908,6.776-2.724,9.579c-1.816,2.803-4.329,5.013-7.513,6.618c-3.197,1.605-6.789,2.421-10.776,2.421    C73.408,129.263,69.145,127.934,65.211,125.276z"/>
		<path fill="#1A73E8" d="M121.25,79.961l-9.974,7.25l-5.013-7.605l17.987-12.974h6.895v61.197h-9.895L121.25,79.961z"/>
		<path fill="#EA4335" d="M148.882,196.25l47.368-47.368l-23.684-10.526l-23.684,10.526l-10.526,23.684L148.882,196.25z"/>
		<path fill="#34A853" d="M33.092,172.566l10.526,23.684h105.263v-47.368H43.618L33.092,172.566z"/>
		<path fill="#4285F4" d="M12.039-3.75C3.316-3.75-3.75,3.316-3.75,12.039v136.842l23.684,10.526l23.684-10.526V43.618h105.263    l10.526-23.684L148.882-3.75H12.039z"/>
		<path fill="#188038" d="M-3.75,148.882v31.579c0,8.724,7.066,15.789,15.789,15.789h31.579v-47.368H-3.75z"/>
		<path fill="#FBBC04" d="M148.882,43.618v105.263h47.368V43.618l-23.684-10.526L148.882,43.618z"/>
		<path fill="#1967D2" d="M196.25,43.618V12.039c0-8.724-7.066-15.789-15.789-15.789h-31.579v47.368H196.25z"/>
	</g>
</g>
</svg>`

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

const BUTTON_ID = "ConfitToGoogleCalendar"

const createButton = () => {
  const button = document.createElement("button")
  button.id = BUTTON_ID
  button.textContent = "カレンダーに追加"

  // マウスオーバー時の背景色の動作
  button.style.backgroundColor = "#f6f6f6"
  button.addEventListener("mouseover", function () {
    button.style.color = "#FFF"
    button.style.backgroundColor = "#0c49c5"
  })
  button.addEventListener("mouseout", function () {
    button.style.color = "#666"
    button.style.backgroundColor = "#f6f6f6" // デフォルトの背景色に戻す
  })
  return button
}

const toFloatingButton = (button: HTMLButtonElement) => {
  button.style.position = "fixed"
  button.style.bottom = "20px"
  button.style.right = "20px"
  button.style.padding = "10px"
  return button
}

const toInlineButton = (button: HTMLButtonElement) => {
  // 隣の「印刷」ボタンとスタイルを似せる
  button.style.transition = "linear .3s"
  button.style.color = "#666"
  button.style.borderRadius = "2px"
  button.style.border = "1px solid #bbb"
  button.style.background = "#f6f6f6"
  button.style.fontSize = ".9em"
  button.style.padding = "4px 12px 4px 8px"
  button.style.margin = "2px"
  button.style.lineHeight = "25px"
  button.style.cursor = "pointer"
  // アイコンの追加
  button.innerHTML = `${calendarIcon} ${button.textContent}`
  return button
}

// トランスパイル時にextractEventInfo.jsがempty chunkになることを防ぐために関数化せず書く
;(function () {
  const isAlreadyExist = document.getElementById(BUTTON_ID) !== null
  if (isAlreadyExist) return

  const button = createButton()
  button.addEventListener("click", () => {
    extractEventInfo()
  })

  // headertools: 「印刷」のボタンがあるエリア
  const headertools = document.querySelector("div.headertools")
  if (headertools === null) {
    const floatingButton = toFloatingButton(button)
    document.body.appendChild(floatingButton)
  } else {
    const inlineButton = toInlineButton(button)
    headertools.appendChild(inlineButton)
  }
})()

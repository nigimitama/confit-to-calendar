// pub.confit.atlas.jp 用のコンテンツスクリプト

import {
  getDateTimes,
  getDetailsFromSessionPage,
  getDetailsFromSubjectPage,
  getLocation,
  getTitle,
} from "@/confit-new/parser"

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

const extractEventInfo = (isSessionPage: boolean) => {
  const details = isSessionPage ? getDetailsFromSessionPage() : getDetailsFromSubjectPage()
  const [startDate, endDate] = getDateTimes()

  chrome.runtime.sendMessage({
    url: document.URL,
    title: getTitle(),
    startDate: startDate,
    endDate: endDate,
    location: getLocation(),
    details: details,
  })
}

const HOST_ID = "ConfitToGoogleCalendarHost"
const BUTTON_ID = "ConfitToGoogleCalendar"

const createButton = () => {
  const button = document.createElement("button")
  button.id = BUTTON_ID
  button.textContent = "カレンダーに追加"

  // サイト側のグローバルCSS（button:activeなどのセレクタ、継承されるline-height等)の影響を
  // 受けないよう、まず全プロパティを初期値にリセットしてから独自のスタイルを当てる
  button.style.all = "initial"
  button.style.boxSizing = "border-box"
  button.style.fontFamily = "sans-serif"
  button.style.fontSize = "14px"
  button.style.color = "#666"
  button.style.cursor = "pointer"
  button.style.backgroundColor = "#f6f6f6"
  button.addEventListener("mouseover", function () {
    button.style.color = "#c9c9c9"
    button.style.backgroundColor = "#0c49c5"
  })
  button.addEventListener("mouseout", function () {
    button.style.color = "#666"
    button.style.backgroundColor = "#f6f6f6"
  })
  return button
}

const toFloatingButton = (button: HTMLButtonElement) => {
  button.style.position = "fixed"
  button.style.bottom = "16px"
  button.style.right = "80px"
  button.style.padding = "10px 16px"
  button.style.borderRadius = "4px"
  button.style.border = "1px solid #bbb"
  button.style.cursor = "pointer"
  button.style.zIndex = "9999"
  button.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)"
  button.innerHTML = `${calendarIcon} ${button.textContent}`
  return button
}

const NEXT_DATA_ID = "__NEXT_DATA__"

const getNextDataText = () => document.getElementById(NEXT_DATA_ID)?.textContent ?? null

const setButtonStale = (button: HTMLButtonElement, isStale: boolean) => {
  button.disabled = isStale
  button.style.opacity = isStale ? "0.5" : "1"
  button.style.cursor = isStale ? "default" : "pointer"
  button.title = isStale ? "ページの情報を読み込み中です…" : ""
}

// DOMが変化しなくなったこと（≒idle）は「データの取得が終わったこと」を意味しない
// （フェッチ中はDOMが変化しないまま待っているだけのことがある）ため、
// タイミングだけで判定せず、実際にカレンダー登録へ使う値（タイトル・日時）が
// 揃っているかどうかで判定する。
const isPageDataReady = () => {
  const title = getTitle()
  const [startDate, endDate] = getDateTimes()
  return Boolean(title) && startDate !== null && endDate !== null
}

// 万一データが揃ったことを検知し損ねてもボタンが無効化されたままにならないよう、
// 一定時間経過したら強制的に復帰させるフェイルセーフ。
const STALE_MAX_MS = 4000

// Next.js SPA内の画面遷移ではページが再読み込みされずボタンが残り続けるため、
// URL変更時に一旦ボタンを無効化し、遷移先のデータが実際に揃い次第すぐ再度有効化する。
// これにより固定時間待つよりも速く、かつ遷移前のセッション情報が誤って
// カレンダーに追加されるのを防ぐ。
const watchPageDataFreshness = (button: HTMLButtonElement) => {
  let knownUrl = document.URL
  let knownDataText = getNextDataText()
  let maxTimer: ReturnType<typeof setTimeout> | null = null

  const clearMaxTimer = () => {
    if (maxTimer !== null) clearTimeout(maxTimer)
    maxTimer = null
  }

  const markFresh = () => {
    clearMaxTimer()
    setButtonStale(button, false)
  }

  const check = () => {
    if (typeof document === "undefined") {
      observer.disconnect()
      clearMaxTimer()
      return
    }

    const url = document.URL
    if (url !== knownUrl) {
      knownUrl = url
      knownDataText = getNextDataText()
      setButtonStale(button, true)
      clearMaxTimer()
      maxTimer = setTimeout(markFresh, STALE_MAX_MS)
      return
    }

    if (!button.disabled) return

    // 遷移直後の待機中: __NEXT_DATA__自体が更新され、かつパース結果
    // （タイトル・日時）が実際に揃ってから復帰させる
    const dataText = getNextDataText()
    if (dataText !== knownDataText) {
      knownDataText = dataText
      if (isPageDataReady()) {
        markFresh()
      }
    }
  }

  const observer = new MutationObserver(check)
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true,
  })
}

const addButton = () => {
  const isAlreadyExist = document.getElementById(HOST_ID) !== null
  if (isAlreadyExist) return

  const button = createButton()

  button.addEventListener("click", () => {
    const isSessionPage =
      document.URL.includes("/session/") && !document.URL.includes("/presentation/")
    extractEventInfo(isSessionPage)
  })

  // Shadow DOMでラップし、サイト側のCSSがボタンに影響しないようにする
  const host = document.createElement("div")
  host.id = HOST_ID
  const shadowRoot = host.attachShadow({ mode: "open" })
  shadowRoot.appendChild(toFloatingButton(button))

  document.body.appendChild(host)

  watchPageDataFreshness(button)
}

export { addButton, BUTTON_ID, HOST_ID }

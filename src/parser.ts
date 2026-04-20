export const getTitle = () => {
  const titleH1: HTMLHeadingElement | null = document.querySelector("div.title")
  return titleH1?.innerText
}

export const getLocation = () => {
  const placeSpan: HTMLSpanElement | null = document.querySelector(
    "p.dateplace > span:nth-child(2)",
  )
  return placeSpan?.innerText
}

export const getDetailsFromSubjectPage = () => {
  const authorElement: HTMLElement | null = document.querySelector(".content > .author")
  const author = authorElement?.innerText || ""

  const keywordElement: HTMLElement | null = document.querySelector(".content > .keyword")
  const keyword = keywordElement?.innerText || ""

  const outlineElement: HTMLElement | null = document.querySelector(".content > .outline")
  const outline = outlineElement?.innerText || ""

  return `${author}\n${keyword}\n\n${outline}`
}

// セッションのページからsubjects（講演情報）を取得する
export const getDetailsFromSessionPage = () => {
  const subjects: NodeListOf<HTMLElement> = document.querySelectorAll(".sbject-box")

  let details = ""
  for (const subject of subjects) {
    const titleTag: HTMLElement | null = subject.querySelector(".sbjtitle")
    const title = titleTag?.innerText || ""
    const contentTag: HTMLElement | null = subject.querySelector(".sbjcontent")
    const author = contentTag?.innerText || ""
    details += `${title}\n${author}\n\n`
  }
  return "\n" + details.trim()
}

export const getDateTimes = () => {
  let [sessionStart, sessionEnd] = getDates()

  const isPresentationPage = document.URL.includes("subject")
  if (!isPresentationPage) {
    return [sessionStart, sessionEnd]
  }

  // もし個別のプレゼンのページなら、セッションの時刻ではなくプレゼンの時刻を使う
  try {
    return getTimeOfPresentation(sessionStart ?? new Date())
  } catch (e) {
    console.error("プレゼンの時間の取得に失敗しました", e)
    return getDates()
  }
}

const getDates = () => {
  const dateSpan: HTMLSpanElement | null = document.querySelector("p.dateplace > span:nth-child(1)")
  const dateString = dateSpan?.innerText
  if (dateString === undefined) return [null, null]

  return parseDateString(dateString)
}

const getTimeOfPresentation = (sessionDate: Date) => {
  // 個別のプレゼンテーションのページから時間を取得する
  const time: HTMLSpanElement | null = document.querySelector(
    "#ev-sbjct > div > section > article > div.clear > p",
  )
  const timeString = time?.innerText
  if (timeString === undefined) return [null, null]

  return parseTimeString(timeString, sessionDate)
}

const parseDateString = (dateString: string) => {
  // '2024年5月28日(火) 13:00 〜 14:40' のような表記をパースする
  const dateMatch = dateString.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/)
  if (dateMatch === null) {
    console.error("日付の解析に失敗しました")
    return [null, null]
  }
  const year = parseInt(dateMatch[1], 10)
  const month = parseInt(dateMatch[2], 10) - 1 // 月はDateでは0始まりなので-1する
  const day = parseInt(dateMatch[3], 10)

  const sessionDate = new Date(year, month, day, 0, 0)
  return parseTimeString(dateString, sessionDate)
}

const parseTimeString = (timeString: string, sessionDate: Date): Date[] => {
  const year = sessionDate.getFullYear()
  const month = sessionDate.getMonth() + 1 // 0〜11 → +1して 1〜12 に
  const day = sessionDate.getDate()

  // NOTE: timeMatchは['13:00', '14:40'] のような配列になる
  const timeMatch = timeString.match(/(\d{1,2}):(\d{1,2})/g)
  if (timeMatch?.length != 2) {
    console.error(`時間の解析に失敗しました (timeString=${timeString}, timeMatch=${timeMatch})`)
    return [new Date(year, month, day, 0, 0), new Date(year, month, day, 0, 0)]
  }

  const startTimeMatch = timeMatch[0].match(/(\d{1,2}):(\d{2})/)
  if (startTimeMatch?.length != 3) {
    console.error(
      `時間の解析に失敗しました (timeMatch[0]=${timeMatch[0]}, startTimeMatch=${startTimeMatch})`,
    )
    return [new Date(year, month, day, 0, 0), new Date(year, month, day, 0, 0)]
  }
  const startHours = parseInt(startTimeMatch[1], 10)
  const startMinutes = parseInt(startTimeMatch[2], 10)

  const endTimeMatch = timeMatch[1].match(/(\d{1,2}):(\d{2})/)
  if (endTimeMatch?.length != 3) {
    console.error(
      `時間の解析に失敗しました (timeMatch[1]=${timeMatch[1]}, endTimeMatch=${endTimeMatch})`,
    )
    return [new Date(year, month, day, startHours, startMinutes), new Date(year, month, day, 0, 0)]
  }
  const endHours = parseInt(endTimeMatch[1], 10)
  const endMinutes = parseInt(endTimeMatch[2], 10)

  return [
    new Date(year, month, day, startHours, startMinutes),
    new Date(year, month, day, endHours, endMinutes),
  ]
}

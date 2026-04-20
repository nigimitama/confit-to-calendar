// pub.confit.atlas.jp 用のパーサー
// TODO: 実際のDOMを確認してセレクターを適切に修正してください

export const getTitle = () => {
  // TODO: 新サイトのタイトル要素のセレクターに変更する
  const el: HTMLElement | null = document.querySelector("h1")
  return el?.innerText
}

export const getLocation = () => {
  // TODO: 新サイトの場所要素のセレクターに変更する
  const el: HTMLElement | null = document.querySelector("[class*='room'], [class*='place'], [class*='location']")
  return el?.innerText
}

export const getDetailsFromSubjectPage = () => {
  // TODO: 新サイトの発表ページの著者・キーワード・概要要素のセレクターに変更する
  const authorEl: HTMLElement | null = document.querySelector("[class*='author']")
  const author = authorEl?.innerText || ""

  const keywordEl: HTMLElement | null = document.querySelector("[class*='keyword']")
  const keyword = keywordEl?.innerText || ""

  const outlineEl: HTMLElement | null = document.querySelector("[class*='abstract'], [class*='outline']")
  const outline = outlineEl?.innerText || ""

  return `${author}\n${keyword}\n\n${outline}`
}

// セッションのページからsubjects（講演情報）を取得する
export const getDetailsFromSessionPage = () => {
  // TODO: 新サイトのセッション内の発表リスト要素のセレクターに変更する
  const subjects: NodeListOf<HTMLElement> = document.querySelectorAll("[class*='subject'], [class*='presentation']")

  let details = ""
  for (const subject of subjects) {
    const titleEl: HTMLElement | null = subject.querySelector("[class*='title']")
    const title = titleEl?.innerText || ""
    const authorEl: HTMLElement | null = subject.querySelector("[class*='author'], [class*='speaker']")
    const author = authorEl?.innerText || ""
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
  // TODO: 新サイトの日時要素のセレクターに変更する
  const el: HTMLElement | null = document.querySelector("[class*='date'], [class*='time'], [class*='schedule']")
  const dateString = el?.innerText
  if (dateString === undefined) return [null, null]

  return parseDateString(dateString)
}

const getTimeOfPresentation = (sessionDate: Date) => {
  // TODO: 新サイトの個別発表の時間要素のセレクターに変更する
  const el: HTMLElement | null = document.querySelector("[class*='time']")
  const timeString = el?.innerText
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

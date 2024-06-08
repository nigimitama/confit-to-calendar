export const getTitle = () => {
  const titleH1: HTMLHeadingElement | null = document.querySelector("div.title")
  return titleH1?.innerText
}

export const getDates = () => {
  const dateSpan: HTMLSpanElement | null = document.querySelector("p.dateplace > span:nth-child(1)")
  const dateString = dateSpan?.innerText
  if (dateString === undefined) return [null, null]

  return parseDateString(dateString)
}

export const getLocation = () => {
  const placeSpan: HTMLSpanElement | null = document.querySelector(
    "p.dateplace > span:nth-child(2)",
  )
  return placeSpan?.innerText
}

export const getDetails = () => {
  const authorElement: HTMLElement | null = document.querySelector(".content > .author")
  const author = authorElement?.innerText || ""

  const keywordElement: HTMLElement | null = document.querySelector(".content > .keyword")
  const keyword = keywordElement?.innerText || ""

  const outlineElement: HTMLElement | null = document.querySelector(".content > .outline")
  const outline = outlineElement?.innerText || ""

  return `${author}\n${keyword}\n\n${outline}`
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

  // NOTE: timeMatchは['13:00', '14:40'] のような配列になる
  const timeMatch = dateString.match(/(\d{1,2}):(\d{1,2})/g)
  if (timeMatch?.length != 2) {
    console.error(`時間の解析に失敗しました (dateString=${dateString}, timeMatch=${timeMatch})`)
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

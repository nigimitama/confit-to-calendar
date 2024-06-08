interface QueryParams {
  action: string
  text: string
  location: string
  dates?: string
  details: string
}

export const generateCalendarURL = (
  title: string,
  startDate: Date | null,
  endDate: Date | null,
  location: string,
  details: string,
) => {
  // GoogleカレンダーのURLにパラメータをつけたURLを生成する
  const baseURL = "https://calendar.google.com/calendar/render"
  let queryParams: QueryParams = {
    action: "TEMPLATE",
    text: title,
    location: location,
    details: details,
  }

  if (startDate !== null && endDate !== null) {
    queryParams["dates"] = generateDates(startDate, endDate)
  }
  return generateUrl(baseURL, queryParams)
}

const generateDates = (startDate: Date, endDate: Date) => {
  // YYYYMMDDToHHMMSSZ/YYYYMMDDToHHMMSSZ のフォーマットに変更
  // 参考： https://webasterisk.sakura.ne.jp/googlecalendar_eventbuttonsgenerator/
  return `${formatDate(startDate)}/${formatDate(endDate)}`
}

const formatDate = (date: Date): string => {
  const padZero = (num: number) => (num < 10 ? "0" + num : num.toString())

  const year = date.getFullYear()
  const month = padZero(date.getMonth() + 1) // getMonth() returns 0-indexed month
  const day = padZero(date.getDate())
  const hours = padZero(date.getUTCHours())
  const minutes = padZero(date.getUTCMinutes())
  const seconds = padZero(date.getUTCSeconds())

  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`
}

const generateUrl = (base: string, params: QueryParams): string => {
  const url = new URL(base)

  Object.keys(params).forEach((key) => {
    url.searchParams.append(key, params[key as keyof QueryParams] as string)
  })

  return url.toString()
}

// pub.confit.atlas.jp 用のパーサー
// Next.js SPA なので DOM セレクターではなく __NEXT_DATA__ JSON からデータを取得する

interface PresentationData {
  displayNumber: string
  presentationTitle: string
  presenter: string  // HTML タグ含む (例: "著者<sup>1</sup>")
  institution: string
  beginTime: string  // "2026-06-08 13:40:00"
  endTime: string    // "2026-06-08 13:55:00"
  summary: string
  keyword: string
  isRest: boolean
}

interface SessionData {
  displayNumber: string  // "1E3-OS-39a"
  sessionTitle: string
  beginDate: string      // "2026-06-08"
  beginTime: string      // "13:40"
  endTime: string        // "15:10"
  hall: string
  chair: string
}

interface NextDataState {
  // 発表ページ (/presentation/)
  presentation?: {
    presentation?: PresentationData
    session?: SessionData
  }
  // セッションページ (/session/)
  session?: {
    session?: SessionData
    presentations?: PresentationData[]
  }
}

const getNextDataState = (): NextDataState | null => {
  const el = document.getElementById("__NEXT_DATA__")
  if (!el?.textContent) return null
  try {
    const json = JSON.parse(el.textContent)
    return json?.props?.pageProps?.initialState ?? null
  } catch {
    return null
  }
}

const isPresentationPage = () => document.URL.includes("/presentation/")

export const getTitle = (): string | undefined => {
  const state = getNextDataState()
  if (isPresentationPage()) {
    const pres = state?.presentation?.presentation
    if (!pres) return undefined
    return `[${pres.displayNumber}] ${pres.presentationTitle}`
  } else {
    const session = state?.session?.session
    if (!session) return undefined
    return `[${session.displayNumber}] ${session.sessionTitle}`
  }
}

export const getLocation = (): string | undefined => {
  const state = getNextDataState()
  return isPresentationPage()
    ? state?.presentation?.session?.hall
    : state?.session?.session?.hall
}

export const getDetailsFromSubjectPage = (): string => {
  const state = getNextDataState()
  const pres = state?.presentation?.presentation
  if (!pres) return ""

  const presenterText = pres.presenter.replace(/<[^>]+>/g, "")
  const author = `${presenterText} (${pres.institution})`
  return `${author}\n${pres.keyword}\n\n${pres.summary}`
}

export const getDetailsFromSessionPage = (): string => {
  const state = getNextDataState()
  const session = state?.session?.session
  const presentations = state?.session?.presentations
  if (!session) return ""

  const lines: string[] = [session.chair, ""]

  for (const pres of presentations ?? []) {
    if (pres.isRest) continue
    const start = pres.beginTime.slice(11, 16)
    const end = pres.endTime.slice(11, 16)
    const presenterText = pres.presenter.replace(/<[^>]+>/g, "")
    lines.push(`${start} 〜 ${end}`)
    lines.push(`[${pres.displayNumber}] ${pres.presentationTitle}`)
    lines.push(`${presenterText} (${pres.institution})`)
    lines.push("")
  }

  return lines.join("\n").trimEnd()
}

export const getDateTimes = (): (Date | null)[] => {
  const state = getNextDataState()

  if (isPresentationPage()) {
    const session = state?.presentation?.session
    const pres = state?.presentation?.presentation
    if (!session) return [null, null]

    const sessionStart = parseSessionDateTime(session.beginDate, session.beginTime)
    const sessionEnd = parseSessionDateTime(session.beginDate, session.endTime)
    if (!pres) return [sessionStart, sessionEnd]

    const presStart = parseIsoLikeDateTime(pres.beginTime)
    const presEnd = parseIsoLikeDateTime(pres.endTime)
    return [presStart ?? sessionStart, presEnd ?? sessionEnd]
  } else {
    const session = state?.session?.session
    if (!session) return [null, null]
    return [
      parseSessionDateTime(session.beginDate, session.beginTime),
      parseSessionDateTime(session.beginDate, session.endTime),
    ]
  }
}

// "2026-06-08" + "13:40" → Date (ローカルタイム)
const parseSessionDateTime = (date: string, time: string): Date | null => {
  const d = date.match(/(\d{4})-(\d{2})-(\d{2})/)
  const t = time.match(/(\d{1,2}):(\d{2})/)
  if (!d || !t) return null
  return new Date(parseInt(d[1]), parseInt(d[2]) - 1, parseInt(d[3]), parseInt(t[1]), parseInt(t[2]))
}

// "2026-06-08 13:40:00" → Date (ローカルタイム)
const parseIsoLikeDateTime = (dateTimeStr: string): Date | null => {
  const m = dateTimeStr.match(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/)
  if (!m) return null
  return new Date(parseInt(m[1]), parseInt(m[2]) - 1, parseInt(m[3]), parseInt(m[4]), parseInt(m[5]))
}

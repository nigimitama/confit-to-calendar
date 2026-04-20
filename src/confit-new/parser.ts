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
}

interface SessionData {
  beginDate: string  // "2026-06-08"
  beginTime: string  // "13:40"
  endTime: string    // "15:10"
  hall: string
  sessionTitle: string
  displayNumber: string
}

interface NextDataState {
  presentation?: {
    presentation?: PresentationData
    session?: SessionData
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

export const getTitle = (): string | undefined => {
  const state = getNextDataState()
  const pres = state?.presentation?.presentation
  if (!pres) return undefined
  return `[${pres.displayNumber}] ${pres.presentationTitle}`
}

export const getLocation = (): string | undefined => {
  const state = getNextDataState()
  return state?.presentation?.session?.hall
}

export const getDetailsFromSubjectPage = (): string => {
  const state = getNextDataState()
  const pres = state?.presentation?.presentation
  if (!pres) return ""

  // presenter フィールドの HTML タグを除去する
  const presenterText = pres.presenter.replace(/<[^>]+>/g, "")
  const author = `${presenterText} (${pres.institution})`
  const keyword = pres.keyword
  const outline = pres.summary

  return `${author}\n${keyword}\n\n${outline}`
}

// セッションのページから講演情報の一覧を取得する
// TODO: セッションページの __NEXT_DATA__ 構造を確認して実装する
export const getDetailsFromSessionPage = (): string => {
  return ""
}

export const getDateTimes = (): (Date | null)[] => {
  const state = getNextDataState()
  const session = state?.presentation?.session
  const pres = state?.presentation?.presentation

  if (!session) return [null, null]

  const isPresentationPage = document.URL.includes("/presentation/")

  // セッションの日時
  const sessionStart = parseSessionDateTime(session.beginDate, session.beginTime)
  const sessionEnd = parseSessionDateTime(session.beginDate, session.endTime)

  if (!isPresentationPage || !pres) {
    return [sessionStart, sessionEnd]
  }

  // 個別発表のページなら発表の時刻を使う
  const presStart = parseIsoLikeDateTime(pres.beginTime)
  const presEnd = parseIsoLikeDateTime(pres.endTime)
  return [presStart ?? sessionStart, presEnd ?? sessionEnd]
}

// "2026-06-08" + "13:40" → Date (ローカルタイム)
const parseSessionDateTime = (date: string, time: string): Date | null => {
  const dateParts = date.match(/(\d{4})-(\d{2})-(\d{2})/)
  const timeParts = time.match(/(\d{1,2}):(\d{2})/)
  if (!dateParts || !timeParts) return null
  return new Date(
    parseInt(dateParts[1]), parseInt(dateParts[2]) - 1, parseInt(dateParts[3]),
    parseInt(timeParts[1]), parseInt(timeParts[2]),
  )
}

// "2026-06-08 13:40:00" → Date (ローカルタイム)
const parseIsoLikeDateTime = (dateTimeStr: string): Date | null => {
  const m = dateTimeStr.match(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/)
  if (!m) return null
  return new Date(
    parseInt(m[1]), parseInt(m[2]) - 1, parseInt(m[3]),
    parseInt(m[4]), parseInt(m[5]), parseInt(m[6]),
  )
}

import { beforeEach, describe, expect, it, vi } from "vitest"
import { installChromeMock, type MockChrome } from "@/test/chromeMock"

const mockGetTitle = vi.fn(() => "[1A1] テスト発表")
const mockGetLocation = vi.fn(() => "第1会場")
const mockGetDetailsFromSessionPage = vi.fn(() => "session details")
const mockGetDetailsFromSubjectPage = vi.fn(() => "subject details")
const mockGetDateTimes = vi.fn(() => [new Date(2026, 5, 8, 13, 40), new Date(2026, 5, 8, 13, 55)])

vi.mock("@/confit-new/parser", () => ({
  getTitle: mockGetTitle,
  getLocation: mockGetLocation,
  getDetailsFromSessionPage: mockGetDetailsFromSessionPage,
  getDetailsFromSubjectPage: mockGetDetailsFromSubjectPage,
  getDateTimes: mockGetDateTimes,
}))

const setDocumentUrl = (url: string) => {
  Object.defineProperty(document, "URL", { value: url, configurable: true })
}

// chrome.runtime.sendMessage() and background.ts communicate across extension
// contexts via message passing; wiring the mock's sendMessage straight into
// the background listener lets us assert on the real end-to-end behavior
// (click -> Google Calendar tab) instead of just the message shape.
const wireSendMessageToBackground = (mockChrome: MockChrome) => {
  const [listener] = mockChrome.runtime.onMessage.addListener.mock.calls[0] as [
    (message: unknown) => void,
  ]
  mockChrome.runtime.sendMessage.mockImplementation((message: unknown) => {
    listener(message)
  })
}

describe("confit-new addButton", () => {
  let mockChrome: MockChrome

  beforeEach(async () => {
    vi.resetModules()
    document.body.replaceChildren()
    mockChrome = installChromeMock()
    mockGetTitle.mockClear()
    mockGetLocation.mockClear()
    mockGetDetailsFromSessionPage.mockClear()
    mockGetDetailsFromSubjectPage.mockClear()
    mockGetDateTimes.mockClear()

    setDocumentUrl("https://pub.confit.atlas.jp/ja/presentation/xxxx")
    await import("@/background")
    wireSendMessageToBackground(mockChrome)
  })

  it("adds a button to the page", async () => {
    const { addButton, BUTTON_ID } = await import("@/confit-new/addButton")
    addButton()

    const button = document.getElementById(BUTTON_ID)
    expect(button).not.toBeNull()
    expect(button?.tagName).toBe("BUTTON")
  })

  it("opens a Google Calendar tab with the event info when the button is clicked", async () => {
    const { addButton, BUTTON_ID } = await import("@/confit-new/addButton")
    addButton()

    const button = document.getElementById(BUTTON_ID) as HTMLButtonElement
    button.click()

    expect(mockChrome.tabs.create).toHaveBeenCalledTimes(1)
    const [{ url }] = mockChrome.tabs.create.mock.calls[0] as [{ url: string }]
    const calendarUrl = new URL(url)

    expect(calendarUrl.origin + calendarUrl.pathname).toBe(
      "https://calendar.google.com/calendar/render",
    )
    expect(calendarUrl.searchParams.get("action")).toBe("TEMPLATE")
    expect(calendarUrl.searchParams.get("text")).toBe("[1A1] テスト発表")
    expect(calendarUrl.searchParams.get("location")).toBe("第1会場")
    expect(calendarUrl.searchParams.has("dates")).toBe(true)
  })

  it("keeps the button after returning from Google Calendar, and clicking it again opens Google Calendar the same way", async () => {
    const { addButton, BUTTON_ID } = await import("@/confit-new/addButton")
    addButton()

    const firstButton = document.getElementById(BUTTON_ID) as HTMLButtonElement
    firstButton.click()
    expect(mockChrome.tabs.create).toHaveBeenCalledTimes(1)

    // simulate the user coming back to this tab after Google Calendar opened
    // in a new tab; the content script's addButton() may run again but must
    // not duplicate the button
    addButton()
    expect(document.querySelectorAll(`#${BUTTON_ID}`)).toHaveLength(1)

    const secondButton = document.getElementById(BUTTON_ID) as HTMLButtonElement
    expect(secondButton).toBe(firstButton)

    secondButton.click()
    expect(mockChrome.tabs.create).toHaveBeenCalledTimes(2)
    const [{ url }] = mockChrome.tabs.create.mock.calls[1] as [{ url: string }]
    expect(new URL(url).origin + new URL(url).pathname).toBe(
      "https://calendar.google.com/calendar/render",
    )
  })
})

import { beforeEach, describe, expect, it, vi } from "vitest"

const mockAddButtonNew = vi.fn()
const mockAddButtonOld = vi.fn()

vi.mock("@/confit-new/addButton", () => ({ addButton: mockAddButtonNew }))
vi.mock("@/confit-old/addButton", () => ({ addButton: mockAddButtonOld }))

const setDocumentUrl = (url: string) => {
  Object.defineProperty(document, "URL", { value: url, configurable: true })
}

describe("content script entry point (src/addButton.ts)", () => {
  beforeEach(() => {
    vi.resetModules()
    mockAddButtonNew.mockClear()
    mockAddButtonOld.mockClear()
  })

  it('calls addButtonNew when the URL includes "pub.confit.atlas.jp"', async () => {
    setDocumentUrl("https://pub.confit.atlas.jp/ja/session/xxxx")

    await import("@/addButton")

    expect(mockAddButtonNew).toHaveBeenCalledTimes(1)
    expect(mockAddButtonOld).not.toHaveBeenCalled()
  })

  it('calls addButtonOld when the URL does not include "pub.confit.atlas.jp"', async () => {
    setDocumentUrl("https://confit.atlas.jp/ja/subject/xxxx")

    await import("@/addButton")

    expect(mockAddButtonOld).toHaveBeenCalledTimes(1)
    expect(mockAddButtonNew).not.toHaveBeenCalled()
  })
})

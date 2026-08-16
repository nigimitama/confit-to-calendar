import { vi } from "vitest"

export type MockChrome = {
  runtime: {
    sendMessage: ReturnType<typeof vi.fn>
    reload: ReturnType<typeof vi.fn>
    onMessage: {
      addListener: ReturnType<typeof vi.fn>
    }
  }
  tabs: {
    create: ReturnType<typeof vi.fn>
  }
}

export const createChromeMock = (): MockChrome => ({
  runtime: {
    sendMessage: vi.fn(),
    reload: vi.fn(),
    onMessage: {
      addListener: vi.fn(),
    },
  },
  tabs: {
    create: vi.fn(),
  },
})

export const installChromeMock = (): MockChrome => {
  const mockChrome = createChromeMock()
  vi.stubGlobal("chrome", mockChrome)
  return mockChrome
}

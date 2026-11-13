import { existsSync } from "node:fs"
import { afterEach, describe, expect, it, vi } from "vitest"
import { jsonResponse, providerResponse } from "./fixtures/provider.js"

const helperExists = existsSync(new URL("../src/lib/openrouter.js", import.meta.url))

afterEach(() => {
  vi.unstubAllGlobals()
  vi.resetModules()
})

describe.skipIf(!helperExists)("requestOpenRouter", () => {
  it("sends one authenticated JSON request", async () => {
    process.env.OPENROUTER_API_KEY = "test_key"
    const fetchSpy = vi.fn().mockResolvedValue(jsonResponse(providerResponse()))
    vi.stubGlobal("fetch", fetchSpy)
    const { requestOpenRouter } = await import("../src/lib/openrouter.js")

    await requestOpenRouter({ model: "openai/gpt-oss-120b:free", messages: [] })

    expect(fetchSpy).toHaveBeenCalledOnce()
    expect(fetchSpy.mock.calls[0][0]).toBe("https://openrouter.ai/api/v1/chat/completions")
    expect(fetchSpy.mock.calls[0][1].headers.Authorization).toBe("Bearer test_key")
  })
})

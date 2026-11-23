import { existsSync } from "node:fs"
import { afterEach, describe, expect, it, vi } from "vitest"
import { jsonResponse, providerResponse } from "./fixtures/provider.js"

const clientExists = existsSync(new URL("../src/lib/openrouter.js", import.meta.url))

afterEach(() => {
  vi.resetModules()
})

describe.skipIf(!clientExists)("OpenRouter SDK client", () => {
  it("uses the OpenRouter base URL and server key", async () => {
    process.env.OPENROUTER_API_KEY = "test_key"
    const fetchSpy = vi.fn().mockResolvedValue(jsonResponse(providerResponse()))
    const { createOpenRouterClient } = await import("../src/lib/openrouter.js")
    const client = createOpenRouterClient({ apiKey: "test_key", fetch: fetchSpy })

    await client.chat.completions.create({
      model: "openrouter/free",
      messages: [{ role: "user", content: "Hello" }]
    })

    expect(fetchSpy).toHaveBeenCalledOnce()
    const [url, options] = fetchSpy.mock.calls[0]
    expect(String(url)).toBe("https://openrouter.ai/api/v1/chat/completions")
    expect(new Headers(options.headers).get("authorization")).toBe("Bearer test_key")
  })
})

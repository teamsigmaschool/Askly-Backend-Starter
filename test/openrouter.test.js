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
    const OpenAI = (await import("openai")).default
    const client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
      maxRetries: 0,
      fetch: fetchSpy
    })

    await client.chat.completions.create({
      model: "openai/gpt-oss-120b:free",
      messages: [{ role: "user", content: "Hello" }]
    })

    expect(fetchSpy).toHaveBeenCalledOnce()
    const [url, options] = fetchSpy.mock.calls[0]
    expect(String(url)).toBe("https://openrouter.ai/api/v1/chat/completions")
    expect(new Headers(options.headers).get("authorization")).toBe("Bearer test_key")
  })
})

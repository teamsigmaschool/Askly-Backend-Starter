import OpenAI from "openai"
import { failureFixtures } from "../test/fixtures/provider.js"

process.env.OPENROUTER_API_KEY = "test_key"
process.env.OPENROUTER_MODEL = "openrouter/free"
process.env.OPENROUTER_MAX_TOKENS = "500"

const { createAnswer } = await import("../src/services/createAnswer.js")

for (const [name, fixture] of Object.entries(failureFixtures)) {
  const client = new OpenAI({
    apiKey: "test_key",
    timeout: 50,
    maxRetries: 0,
    fetch: async (_url, { signal }) => {
      if (name !== "slow") return fixture()
      return new Promise((resolve, reject) => {
        signal.addEventListener("abort", () => reject(signal.reason), { once: true })
        fixture().then(resolve, reject)
      })
    }
  })

  try {
    await createAnswer("What is an API?", client)
    console.log(name, "-> Unexpected success")
  } catch (error) {
    console.log(name, "->", error.code === "AI_EMPTY_RESPONSE" ? error.code : error.constructor.name)
  }
}

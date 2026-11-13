export function providerResponse(answer = "A clear answer") {
  return {
    id: "generation_test_123",
    choices: [{ message: { role: "assistant", content: answer } }],
    usage: { prompt_tokens: 12, completion_tokens: 8, total_tokens: 20 }
  }
}

export function jsonResponse(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...headers }
  })
}

export const failureFixtures = {
  invalidKey: () => jsonResponse({ error: { message: "Invalid key" } }, 401),
  rateLimited: () => jsonResponse({ error: { message: "Too many requests" } }, 429, { "Retry-After": "1" }),
  unavailable: () => jsonResponse({ error: { message: "Provider unavailable" } }, 503),
  emptyOutput: () => jsonResponse(providerResponse("")),
  slow: (delayMs = 300) => new Promise((resolve) => setTimeout(() => resolve(jsonResponse(providerResponse())), delayMs))
}

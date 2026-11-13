export function requireUser(request, response, next) {
  const userId = request.header("x-user-id")

  if (!userId) {
    return response.status(401).json({ code: "AUTH_REQUIRED", message: "Please sign in first" })
  }

  request.user = { id: userId, canUseAi: request.header("x-ai-access") === "true" }
  next()
}

export function requireAiAccess(request, response, next) {
  if (!request.user?.canUseAi) {
    return response.status(403).json({ code: "AI_ACCESS_REQUIRED", message: "AI access is not enabled" })
  }

  next()
}

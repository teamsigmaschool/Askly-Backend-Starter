import cors from "cors"
import express from "express"

export const app = express()

app.use(cors({ origin: "http://localhost:5173" }))
app.use(express.json({ limit: "8kb" }))

app.get("/api/health", (_request, response) => {
  response.status(200).json({ status: "ok" })
})

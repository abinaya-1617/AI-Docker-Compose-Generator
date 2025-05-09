import { type NextRequest, NextResponse } from "next/server"

// Replace with your actual FastAPI backend URL
const API_URL = process.env.FASTAPI_API_URL || "http://localhost:8000"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { repoUrl, apiProvider, apiEndpoint, modelName } = body

    if (!repoUrl) {
      return NextResponse.json({ error: "Repository URL is required" }, { status: 400 })
    }

    // Forward the request to your FastAPI backend
    const response = await fetch(`${API_URL}/generate-docker-config`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        repo_url: repoUrl,
        api_provider: apiProvider || "openai",
        api_endpoint: apiEndpoint || null,
        model_name: modelName || null
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData.detail || "Failed to generate Docker configuration" },
        { status: response.status },
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error generating Docker configuration:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

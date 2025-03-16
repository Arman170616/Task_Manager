import { jwtDecode } from "jwt-decode"

interface DecodedToken {
  exp: number
  user_id: string
  username: string
}

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<DecodedToken>(token)
    const currentTime = Date.now() / 1000
    return decoded.exp < currentTime
  } catch {
    return true
  }
}

export const refreshToken = async (): Promise<string | null> => {
  const refreshToken = localStorage.getItem("refreshToken")

  if (!refreshToken) {
    return null
  }

  try {
    const response = await fetch("http://localhost:8000/api/token/refresh/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }),
    })

    if (!response.ok) {
      throw new Error("Failed to refresh token")
    }

    const data = await response.json()
    localStorage.setItem("accessToken", data.access)

    return data.access
  } catch (error) {
    console.error("Error refreshing token:", error)
    return null
  }
}

export const getAuthToken = async (): Promise<string | null> => {
  let token = localStorage.getItem("accessToken")

  if (!token || isTokenExpired(token)) {
    token = await refreshToken()
  }

  return token
}


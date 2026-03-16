const DEFAULT_API_BASE_URL = 'http://localhost:4000/api'

function readEnvString(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined
  }

  const normalizedValue = value.trim()

  return normalizedValue.length > 0 ? normalizedValue : undefined
}

export const env = {
  apiBaseUrl: readEnvString(import.meta.env.VITE_API_BASE_URL) ?? DEFAULT_API_BASE_URL,
} as const

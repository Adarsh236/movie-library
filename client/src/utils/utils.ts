export const getCurrentTimestamp = (): number =>
  typeof globalThis.performance?.now === 'function' ? globalThis.performance.now() : Date.now()

export const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

export const getStringField = (value: unknown, key: string): string | undefined => {
  if (!isRecord(value)) return undefined

  const field = value[key]
  return typeof field === 'string' ? field : undefined
}

export const getNumberField = (value: unknown, key: string): number | undefined => {
  if (!isRecord(value)) return undefined

  const field = value[key]
  return typeof field === 'number' ? field : undefined
}

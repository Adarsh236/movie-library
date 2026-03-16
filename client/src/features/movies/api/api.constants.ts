export const API_REDUCER_PATH = 'baseApi' as const

export const ApiTag = {
  Movies: 'Movies',
  Genres: 'Genres',
} as const

export const API_TAG_TYPES = Object.values(ApiTag)

export const GENERIC_ERROR_MESSAGE = 'Something went wrong. Please try again.'
export const NETWORK_ERROR_MESSAGE = 'Unable to reach the server. Please check your connection.'
export const PARSING_ERROR_MESSAGE = 'Received an unexpected response from the server.'
export const TIMEOUT_ERROR_MESSAGE = 'The request timed out. Please try again.'
export const SERVICE_UNAVAILABLE_MESSAGE =
  'The service is temporarily unavailable. Please try again.'

export const HTTP_ERROR_MESSAGES: Record<number, string> = {
  400: 'The request is invalid.',
  404: 'The requested resource was not found.',
  408: TIMEOUT_ERROR_MESSAGE,
  500: 'The server encountered an unexpected error.',
  502: SERVICE_UNAVAILABLE_MESSAGE,
  503: SERVICE_UNAVAILABLE_MESSAGE,
  504: SERVICE_UNAVAILABLE_MESSAGE,
}

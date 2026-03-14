import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import type { SerializedError } from '@reduxjs/toolkit'
import type { ApiErrorPayload } from '../features/movies/types'
import { getNumberField, getStringField, isRecord } from '../utils/utils'

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL as string) ?? 'http://localhost:4000/api'

function isApiErrorPayload(value: unknown): value is ApiErrorPayload {
  return (
    getNumberField(value, 'statusCode') !== undefined &&
    getStringField(value, 'code') !== undefined &&
    getStringField(value, 'message') !== undefined
  )
}

function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return isRecord(error) && 'status' in error
}

function isSerializedError(error: unknown): error is SerializedError {
  return isRecord(error)
}

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: apiBaseUrl,
  }),
  tagTypes: ['Movies', 'Genres'],
  endpoints: () => ({}),
})

export function getApiErrorMessage(error: unknown): string {
  if (isFetchBaseQueryError(error) && isApiErrorPayload(error.data)) {
    const message = getStringField(error.data, 'message')
    if (message) return message
  }

  if (isFetchBaseQueryError(error)) {
    if (error.status === 404) {
      return 'The requested resource was not found.'
    }

    if (error.status === 500) {
      return 'The server encountered an unexpected error.'
    }

    if (error.status === 504) {
      return 'The request timed out. Please try again.'
    }
  }

  if (isSerializedError(error)) {
    const message = getStringField(error, 'message')
    if (message) return message
  }

  return 'Something went wrong. Please try again.'
}

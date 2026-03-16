import type { SerializedError } from '@reduxjs/toolkit'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import type { ApiErrorPayload } from '../../../types/types'
import { getNumberField, getStringField, isRecord } from '../../../utils/utils'
import {
  GENERIC_ERROR_MESSAGE,
  HTTP_ERROR_MESSAGES,
  NETWORK_ERROR_MESSAGE,
  PARSING_ERROR_MESSAGE,
  TIMEOUT_ERROR_MESSAGE,
} from './api.constants'

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

function getHttpErrorMessage(status: number): string {
  return HTTP_ERROR_MESSAGES[status] ?? GENERIC_ERROR_MESSAGE
}

export function getApiErrorMessage(error: unknown): string {
  if (isFetchBaseQueryError(error)) {
    if (isApiErrorPayload(error.data)) {
      return error.data.message
    }

    if (typeof error.status === 'number') {
      return getHttpErrorMessage(error.status)
    }

    switch (error.status) {
      case 'FETCH_ERROR':
        return NETWORK_ERROR_MESSAGE
      case 'PARSING_ERROR':
        return PARSING_ERROR_MESSAGE
      case 'TIMEOUT_ERROR':
        return TIMEOUT_ERROR_MESSAGE
      default:
        return GENERIC_ERROR_MESSAGE
    }
  }

  if (isSerializedError(error)) {
    const message = getStringField(error, 'message')

    if (message) {
      return message
    }
  }

  return GENERIC_ERROR_MESSAGE
}

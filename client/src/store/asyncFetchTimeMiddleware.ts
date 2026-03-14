import { isFulfilled, isPending, isRejected, type Middleware } from '@reduxjs/toolkit'
import { getCurrentTimestamp, isNonEmptyString, isRecord } from '../utils/utils'

const MAX_TRACKED_REQUESTS = 10_000

type SettledStatus = 'fulfilled' | 'rejected'

const getActionType = (action: unknown): string | null => {
  if (!isRecord(action)) {
    return null
  }

  return isNonEmptyString(action.type) ? action.type : null
}

const getRequestId = (action: unknown): string | null => {
  if (!isRecord(action)) {
    return null
  }

  const { meta } = action

  if (!isRecord(meta)) {
    return null
  }

  return isNonEmptyString(meta.requestId) ? meta.requestId : null
}

const getSettledStatus = (action: unknown): SettledStatus | null => {
  if (isFulfilled(action)) {
    return 'fulfilled'
  }

  if (isRejected(action)) {
    return 'rejected'
  }

  return null
}

const deleteOldestTrackedRequest = (requestStartTimes: Map<string, number>): void => {
  const oldestRequestId = requestStartTimes.keys().next().value

  if (oldestRequestId) {
    requestStartTimes.delete(oldestRequestId)
  }
}

const trackRequestStart = (requestStartTimes: Map<string, number>, requestId: string): void => {
  if (!requestStartTimes.has(requestId) && requestStartTimes.size >= MAX_TRACKED_REQUESTS) {
    deleteOldestTrackedRequest(requestStartTimes)
  }

  requestStartTimes.set(requestId, getCurrentTimestamp())
}

const consumeRequestDuration = (
  requestStartTimes: Map<string, number>,
  requestId: string,
): number | null => {
  const startedAt = requestStartTimes.get(requestId)

  if (typeof startedAt !== 'number' || !Number.isFinite(startedAt)) {
    return null
  }

  requestStartTimes.delete(requestId)

  return Math.max(0, Math.round(getCurrentTimestamp() - startedAt))
}

export const asyncFetchTimeMiddleware: Middleware = () => {
  const requestStartTimes = new Map<string, number>()

  return (next) => (action) => {
    if (isPending(action)) {
      const requestId = getRequestId(action)

      if (requestId) {
        trackRequestStart(requestStartTimes, requestId)
      }

      return next(action)
    }

    const status = getSettledStatus(action)

    if (!status) {
      return next(action)
    }

    const requestId = getRequestId(action)
    const actionType = getActionType(action)

    if (!requestId || !actionType) {
      return next(action)
    }

    try {
      return next(action)
    } finally {
      const durationMs = consumeRequestDuration(requestStartTimes, requestId)

      if (durationMs !== null) {
        console.info(`[fetch-timing] ${actionType} (${status}) completed in ${durationMs}ms`)
      }
    }
  }
}

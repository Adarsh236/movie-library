import type { MiddlewareAPI } from '@reduxjs/toolkit'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { asyncRequestTimingMiddleware } from '@/store/asyncRequestTimingMiddleware'

type AsyncStatus = 'pending' | 'fulfilled' | 'rejected'

function createAsyncAction(type: string, requestId: string, requestStatus: AsyncStatus) {
  return {
    type,
    meta: {
      requestId,
      requestStatus,
    },
  }
}

describe('asyncRequestTimingMiddleware', () => {
  const next = vi.fn((action: unknown) => action)
  const dispatch = vi.fn()
  const getState = vi.fn()

  const api: MiddlewareAPI = {
    dispatch,
    getState,
  }

  beforeEach(() => {
    vi.useFakeTimers()
    vi.spyOn(console, 'log').mockImplementation(() => undefined)
    next.mockClear()
    dispatch.mockClear()
    getState.mockClear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('tracks a pending request and logs duration when fulfilled', () => {
    const middleware = asyncRequestTimingMiddleware(api)(next)

    const pendingAction = createAsyncAction('movies/fetch/pending', 'request-1', 'pending')
    const fulfilledAction = createAsyncAction('movies/fetch/fulfilled', 'request-1', 'fulfilled')

    middleware(pendingAction)

    vi.advanceTimersByTime(125)

    middleware(fulfilledAction)

    expect(next).toHaveBeenNthCalledWith(1, pendingAction)
    expect(next).toHaveBeenNthCalledWith(2, fulfilledAction)
    expect(console.log).toHaveBeenCalledTimes(1)
    expect(console.log).toHaveBeenCalledWith(
      expect.stringMatching(/^\[request-timing\] movies\/fetch \(fulfilled\) completed in \d+ms$/),
    )
  })

  it('still logs timing even if next throws on fulfilled action', () => {
    const throwingNext = vi
      .fn<(action: unknown) => unknown>()
      .mockImplementationOnce((action) => action)
      .mockImplementationOnce(() => {
        throw new Error('downstream failure')
      })

    const middleware = asyncRequestTimingMiddleware(api)(throwingNext)

    const pendingAction = createAsyncAction('movies/fetch/pending', 'request-4', 'pending')
    const fulfilledAction = createAsyncAction('movies/fetch/fulfilled', 'request-4', 'fulfilled')

    middleware(pendingAction)
    vi.advanceTimersByTime(75)

    expect(() => middleware(fulfilledAction)).toThrow('downstream failure')
    expect(console.log).toHaveBeenCalledTimes(1)
    expect(console.log).toHaveBeenCalledWith(
      expect.stringMatching(/^\[request-timing\] movies\/fetch \(fulfilled\) completed in \d+ms$/),
    )
  })
})

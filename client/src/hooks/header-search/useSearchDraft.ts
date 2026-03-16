import { useState } from 'react'

type DraftState = {
  routeKey: string
  value: string
}

export function useSearchDraft(routeKey: string, routeValue: string) {
  const [draft, setDraft] = useState<DraftState>(() => ({
    routeKey,
    value: routeValue,
  }))

  const searchValue = draft.routeKey === routeKey ? draft.value : routeValue

  function setDraftValue(nextValue: string) {
    setDraft({
      routeKey,
      value: nextValue,
    })
  }

  return {
    searchValue,
    setDraftValue,
  }
}

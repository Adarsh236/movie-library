import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface FiltersState {
  query: string
  genre: string
  page: number
}

const initialState: FiltersState = {
  query: '',
  genre: '',
  page: 1,
}

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload
      state.page = 1
    },
    setGenre(state, action: PayloadAction<string>) {
      state.genre = action.payload
      state.page = 1
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload
    },
    resetFilters() {
      return initialState
    },
  },
})

export const { setQuery, setGenre, setPage, resetFilters } = filtersSlice.actions
export const filtersReducer = filtersSlice.reducer

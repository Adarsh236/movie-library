import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface FiltersState {
  titleInput: string
  title: string
  genre: string
  page: number
}

const initialState: FiltersState = {
  titleInput: '',
  title: '',
  genre: '',
  page: 1,
}

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setTitleInput(state, action: PayloadAction<string>) {
      state.titleInput = action.payload
    },
    applyTitleSearch(state, action: PayloadAction<string>) {
      const normalizedTitle = action.payload.trim()
      state.titleInput = action.payload
      state.title = normalizedTitle
      state.page = 1
    },
    clearTitleSearch(state) {
      state.titleInput = ''
      state.title = ''
      state.page = 1
    },
    setGenre(state, action: PayloadAction<string>) {
      state.genre = action.payload
      state.page = 1
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload
    },
  },
})

export const { setTitleInput, applyTitleSearch, clearTitleSearch, setGenre, setPage } =
  filtersSlice.actions

export const filtersReducer = filtersSlice.reducer

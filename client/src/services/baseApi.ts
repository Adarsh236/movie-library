import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_REDUCER_PATH, API_TAG_TYPES } from './api.constants'
import { env } from '../config/env'

export const baseApi = createApi({
  reducerPath: API_REDUCER_PATH,
  baseQuery: fetchBaseQuery({
    baseUrl: env.apiBaseUrl,
  }),
  tagTypes: [...API_TAG_TYPES],
  endpoints: () => ({}),
})

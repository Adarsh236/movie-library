/* eslint-disable react-refresh/only-export-components */
import { Suspense, lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from './RootLayout'
import { Spinner } from '../components/spinner/Spinner'
import { HomePage } from '../features/movies/pages/HomePage'

const SearchPage = lazy(async () => {
  const module = await import('../features/movies/pages/SearchPage')
  return { default: module.SearchPage }
})

const GenrePage = lazy(async () => {
  const module = await import('../features/movies/pages/GenrePage')
  return { default: module.GenrePage }
})

const AboutPage = lazy(async () => {
  const module = await import('../features/movies/pages/AboutPage')
  return { default: module.AboutPage }
})

const NotFoundPage = lazy(async () => {
  const module = await import('../features/movies/pages/NotFoundPage')
  return { default: module.NotFoundPage }
})

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'search',
        element: (
          <Suspense fallback={<Spinner />}>
            <SearchPage />
          </Suspense>
        ),
      },
      {
        path: 'genre/:genreId',
        element: (
          <Suspense fallback={<Spinner />}>
            <GenrePage />
          </Suspense>
        ),
      },
      {
        path: 'about',
        element: (
          <Suspense fallback={<Spinner />}>
            <AboutPage />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<Spinner />}>
            <NotFoundPage />
          </Suspense>
        ),
      },
    ],
  },
])

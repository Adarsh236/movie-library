import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from './RootLayout'

import { HomePage } from '../features/movies/pages/HomePage'
import { SearchPage } from '../features/movies/pages/SearchPage'
import { GenrePage } from '../features/movies/pages/GenrePage'
import { AboutPage } from '../features/movies/pages/AboutPage'
import { NotFoundPage } from '../features/movies/pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'genre/:genreId', element: <GenrePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

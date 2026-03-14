import { createBrowserRouter } from 'react-router-dom'
import { MoviesPage } from '../features/movies/MoviesPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MoviesPage />,
  },
])

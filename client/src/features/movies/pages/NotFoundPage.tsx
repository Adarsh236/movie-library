import { Link } from 'react-router-dom'

import { buildHomeUrl } from '../lib/movieRouteState'
import { EmptyState } from '../../../components/empty-state/EmptyState'
import { Button } from '../../../components/button/Button'

export function NotFoundPage() {
  return (
    <EmptyState
      title='Page not found'
      description='The page you are looking for does not exist or may have been moved.'
      action={
        <Button asChild>
          <Link to={buildHomeUrl()}>Back to Home</Link>
        </Button>
      }
    />
  )
}

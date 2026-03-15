import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable, tap } from 'rxjs'

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<{ method: string; url: string }>()
    const startedAt = Date.now()

    return next.handle().pipe(
      tap({
        next: () => {
          const durationMs = Date.now() - startedAt
          console.info(`[http] ${request.method} ${request.url} ${durationMs}ms`)
        },
        error: () => {
          const durationMs = Date.now() - startedAt
          console.error(`[http] ${request.method} ${request.url} failed ${durationMs}ms`)
        },
      }),
    )
  }
}

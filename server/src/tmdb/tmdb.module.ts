import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { TmdbService } from './tmdb.service'

@Module({
  imports: [
    HttpModule.register({
      baseURL: 'https://api.themoviedb.org/3',
      timeout: 8000,
    }),
  ],
  providers: [TmdbService],
  exports: [TmdbService],
})
export class TmdbModule {}

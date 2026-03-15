import { Module } from '@nestjs/common'
import { TmdbModule } from '../tmdb/tmdb.module'
import { GenresController } from '../genres/genres.controller'
import { MoviesController } from './movies.controller'
import { MoviesService } from './movies.service'

@Module({
  imports: [TmdbModule],
  controllers: [MoviesController, GenresController],
  providers: [MoviesService],
  exports: [MoviesService],
})
export class MoviesModule {}

import { Controller, Get } from '@nestjs/common'
import { MoviesService } from '../movies/movies.service'

@Controller('genres')
export class GenresController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  getGenres() {
    return this.moviesService.getGenres()
  }
}

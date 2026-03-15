import { Controller, Get, Param, Query } from '@nestjs/common'

import { SearchMoviesQueryDto } from './dto/search-movies-query.dto'
import { MoviesService } from './movies.service'
import { PageQueryDto } from './dto/page-query.dto'
import { GenreParamDto } from './dto/genre-param.dto'

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  getMovies(@Query() query: PageQueryDto) {
    return this.moviesService.getMovies(query)
  }

  @Get('search')
  searchMovies(@Query() query: SearchMoviesQueryDto) {
    return this.moviesService.searchMovies(query)
  }

  @Get('genre/:genreId')
  getMoviesByGenre(@Param() params: GenreParamDto, @Query() query: PageQueryDto) {
    return this.moviesService.getMoviesByGenre(params.genreId, query)
  }
}

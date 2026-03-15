import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common'
import { GetMoviesByGenreQueryDto } from './dto/get-movies-by-genre-query.dto'
import { GetMoviesQueryDto } from './dto/get-movies-query.dto'
import { SearchMoviesQueryDto } from './dto/search-movies-query.dto'
import { MoviesService } from './movies.service'

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  getMovies(@Query() query: GetMoviesQueryDto) {
    return this.moviesService.getMovies(query)
  }

  @Get('search')
  searchMovies(@Query() query: SearchMoviesQueryDto) {
    return this.moviesService.searchMovies(query)
  }

  @Get('genre/:genreId')
  getMoviesByGenre(
    @Param('genreId', ParseIntPipe) genreId: number,
    @Query() query: GetMoviesByGenreQueryDto,
  ) {
    return this.moviesService.getMoviesByGenre(genreId, query)
  }
}

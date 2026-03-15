import { Transform } from 'class-transformer'
import { IsInt, Max, Min } from 'class-validator'

export class GetMoviesByGenreQueryDto {
  @Transform(({ value }) => Number(value ?? 1))
  @IsInt()
  @Min(1)
  @Max(500)
  page = 1
}

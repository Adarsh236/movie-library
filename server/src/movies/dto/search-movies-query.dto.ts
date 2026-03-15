import { Transform } from 'class-transformer'
import { IsInt, IsString, Max, Min, MinLength } from 'class-validator'

export class SearchMoviesQueryDto {
  @IsString()
  @Transform(({ value }) => String(value ?? '').trim())
  @MinLength(1)
  title!: string

  @Transform(({ value }) => Number(value ?? 1))
  @IsInt()
  @Min(1)
  @Max(500)
  page = 1
}

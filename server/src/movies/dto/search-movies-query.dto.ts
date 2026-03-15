import { Transform, Type } from 'class-transformer'
import { IsInt, IsString, Matches, Max, MaxLength, Min, MinLength } from 'class-validator'

export class SearchMoviesQueryDto {
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  @Matches(/^[^\p{Cc}]+$/u, {
    message: 'title contains invalid control characters',
  })
  title!: string

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(500)
  page = 1
}

import { Type } from 'class-transformer'
import { IsInt, Min } from 'class-validator'

export class PageQueryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  // TODO: Not needed for now
  // @Max(500)
  page = 1
}

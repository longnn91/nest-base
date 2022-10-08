import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @Transform(({ value }: { value: string }) => parseInt(value))
  @ApiPropertyOptional({
    minimum: 0,
    default: 1,
  })
  public page: number = 1;

  @IsOptional()
  @Transform(({ value }: { value: string }) => parseInt(value))
  @ApiPropertyOptional({
    minimum: 0,
    default: 1000,
  })
  public limit: number = 1000;

  constructor(init?: Partial<PaginationDto>) {
    Object.assign(this, init);
  }
}

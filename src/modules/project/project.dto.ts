import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;
  @ApiProperty()
  @IsOptional()
  @IsDate()
  start_date: Date;
  @ApiProperty()
  @IsOptional()
  @IsDate()
  end_date: Date;
  @ApiProperty()
  @IsOptional()
  tasks: string[];
}

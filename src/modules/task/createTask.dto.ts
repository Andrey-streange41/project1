import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDate,
  IsIn,
  IsNumber,
} from 'class-validator';

export class CreateTaskDto {
  static readonly validStatuses = ['Новая', 'В процессе', 'Завершена'];
  @ApiProperty()
  @IsNotEmpty()
  project_id: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsIn(CreateTaskDto.validStatuses)
  status: string;
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  priority: number;
  @ApiProperty()
  @IsOptional()
  @IsDate()
  deadline: Date;
}

export class UpdateTaskDto {
  static readonly validStatuses = ['Новая', 'В процессе', 'Завершена'];
  @ApiProperty()
  @IsOptional()
  project_id: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  title: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsIn(CreateTaskDto.validStatuses)
  status: string;
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  priority: number;
  @ApiProperty()
  @IsOptional()
  @IsDate()
  deadline: Date;
}

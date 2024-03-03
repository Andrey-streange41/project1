import {
  BadRequestException,
  Injectable,
  ValidationPipe,
} from '@nestjs/common';
import { CreateProjectDto } from './project.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class CreateProjectValidationPipe extends ValidationPipe {
  async transform(value: any) {
    const createProjectDto = plainToClass(CreateProjectDto, value);
    const errors = await validate(createProjectDto);
    if (errors.length > 0) {
      throw new BadRequestException('Project creation validation failed');
    }
    return value;
  }
}

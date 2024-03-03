import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
  ValidationPipe,
} from '@nestjs/common';
import { CreateTaskDto, UpdateTaskDto } from './createTask.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Types } from 'mongoose';

@Injectable()
export class CreateTaskValidationPipe extends ValidationPipe {
  async transform(value: any) {
    const createTaskDto = plainToClass(CreateTaskDto, value);
    const errors = await validate(createTaskDto);
    if (errors.length > 0) {
      throw new BadRequestException('Task creation validation failed');
    }
    return value;
  }
}

@Injectable()
export class UpdateTaskValidationPipe extends ValidationPipe {
  async transform(value: any) {
    const updateTaskDto = plainToClass(UpdateTaskDto, value);
    const errors = await validate(updateTaskDto);
    if (errors.length > 0) {
      throw new BadRequestException('Task creation validation failed');
    }
    return value;
  }
}

@Injectable()
export class CheckObjectIdValidationPipe implements PipeTransform {
  constructor(private readonly validationPipe: ValidationPipe) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'param') {
      // Пропускаем проверку, если параметр не является параметром запроса
      return value;
    }

    const isValidObjectId = Types.ObjectId.isValid(value);
    if (!isValidObjectId) {
      throw new BadRequestException('Invalid ObjectId');
    }

    // Выполняем стандартную валидацию с использованием ValidationPipe
    return this.validationPipe.transform(value, { type: 'param' });
  }
}

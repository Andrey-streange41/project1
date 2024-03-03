import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class UserAuthPipe implements PipeTransform {
  async transform(value: any) {
    const { email, password } = value;
    if (!email || !password) {
      throw new BadRequestException('Email address and password are required');
    }
    return value;
  }
}

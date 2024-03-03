import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class AuthUserDTO {
  @ApiProperty()
  @IsEmail({}, { message: 'Invalid email format' })
  readonly email: string;
  @ApiProperty()
  @IsString({ message: 'Password must be a string' })
  @Length(8, 32, {
    message: 'Password must be between 8 and 32 characters long',
  })
  readonly password: string;
}

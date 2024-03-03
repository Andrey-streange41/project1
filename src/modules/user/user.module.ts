import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import {
  WrongPassword,
  WrongPasswordSchema,
} from 'src/schemas/wrongPassword.schema';
import { TokenService } from '../token/token.service';
import { Token, TokenSchema } from '../token/token.schema';
import { APP_FILTER } from '@nestjs/core';
import { UserFilter } from './user.filter';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: WrongPassword.name,
        schema: WrongPasswordSchema,
      },
      {
        name: Token.name,
        schema: TokenSchema,
      },
    ]),
  ],
  exports: [MongooseModule],
  controllers: [UserController],
  providers: [
    UserService,
    TokenService,
    {
      provide: APP_FILTER,
      useClass: UserFilter,
    },
  ],
})
export class UserModule {}

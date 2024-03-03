import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt_decode from 'jsonwebtoken';
import { SECRET_JWT } from 'src/config';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const refreshToken = req.cookies['refreshToken'];

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing');
    }

    try {
      const decodedToken: any = jwt_decode.verify(refreshToken, SECRET_JWT);

      if (!decodedToken.email) {
        throw new UnauthorizedException('User is not activated');
      }
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    next();
  }
}

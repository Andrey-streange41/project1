import * as jwt from 'jsonwebtoken';
import { SECRET_JWT } from '../config/index';
import { ITokenPayload } from 'src/types/User';

export const generateTokens = (payload: ITokenPayload) => {
  const accessToken = jwt.sign(
    {
      id: payload.id,
      email: payload.email,
      isActivated: payload.isActivated,
      type: 'access',
    },
    SECRET_JWT,
    { expiresIn: '1h' },
  );
  const refreshToken = jwt.sign(
    {
      id: payload.id,
      email: payload.email,
      isActivated: payload.isActivated,
      type: 'refresh',
    },
    SECRET_JWT,
    { expiresIn: '7d' },
  );

  return { accessToken, refreshToken };
};

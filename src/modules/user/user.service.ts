import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthUserDTO } from './user.dto';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';
import { WrongPassword } from '../../schemas/wrongPassword.schema';
import { generateTokens } from '../../core/generateToken';
import * as uuid from 'uuid';
import { activateLink } from '../../core/email/activateLink';
import { TokenService } from '../token/token.service';
import mongoose from 'mongoose';
import { APP_URL, SECRET_JWT } from '../../config';
import * as jwt from 'jsonwebtoken';
import { ITokenPayload } from '../../types/User';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userEntity: Model<User>,
    @InjectModel(WrongPassword.name)
    private readonly wrongPasswordModel: Model<WrongPassword>,
    private tokenService: TokenService,
  ) {}
  async findUserByEmailWithWrongPassword(email: string): Promise<User | null> {
    const user = await this.userEntity
      .findOne({ email })
      .populate('wrong_password')
      .exec();

    if (!user)
      throw new NotFoundException(
        `Користувача з такою електроною адресою '${email}' не знайдено`,
      );
    const wrong_password = await this.wrongPasswordModel.findOne({
      user_id: user.id,
    });
    user.wrong_password = wrong_password;
    return user;
  }
  async login(userDTO: AuthUserDTO): Promise<{
    refreshToken: string;
    accessToken: string;
  }> {
    const user = await this.findUserByEmailWithWrongPassword(userDTO.email);

    if (user.wrong_password?.amount === 5) {
      const today = moment();
      const blockTime = moment(user.wrong_password.updated_at).add(1, 'h');
      if (blockTime >= today) {
        throw new UnauthorizedException({
          message: `Кількість спроб вводу паролю перевищена, спробуйте о ${blockTime.format(
            'H:m DD.MM.YYYY',
          )}`,
        });
      } else {
        await user.wrong_password.deleteOne();
      }
    }

    const passwordResult = bcrypt.compareSync(userDTO.password, user.password);

    if (!passwordResult) {
      if (user.wrong_password) {
        user.wrong_password.amount = user.wrong_password.amount + 1;
        await user.wrong_password.save();
      } else {
        const newWrongPassword = new this.wrongPasswordModel({
          user_id: user._id,
          amount: 1,
        });
        await newWrongPassword.save();
      }

      throw new UnauthorizedException({
        message: 'Не правильний пароль',
      });
    }
    const tokens = generateTokens({
      email: user.email,
      id: user._id,
      isActivated: user.isActivated,
    });

    if (!tokens) throw new UnauthorizedException('Unauthorized!');

    await this.tokenService.saveToken(user.id, tokens.refreshToken);

    await this.userEntity.findOneAndUpdate(
      { _id: user._id },
      { updated_at: new Date() },
    );

    return {
      accessToken: `Bearer ${tokens.accessToken}`,
      refreshToken: tokens.refreshToken,
    };
  }
  async registrarion({ email, password }: AuthUserDTO) {
    const candidate = await this.userEntity.findOne({ email });
    if (candidate) throw new ConflictException('User already exist');
    const hasPass = await bcrypt.hash(password, 3);
    const activationLink = uuid.v4();
    const user = await this.userEntity.create({
      _id: new mongoose.Types.ObjectId(),
      email,
      password: hasPass,
      activationLink,
      isActivated: false,
    });
    try {
      await activateLink(
        user.email,
        APP_URL + 'user/activate/' + activationLink,
      );
    } catch (err) {}

    const tokens = generateTokens({
      email: user.email,
      isActivated: user.isActivated,
      id: user._id,
    });
    await this.tokenService.saveToken(user._id, tokens.refreshToken);
    return { ...tokens, user };
  }

  async activateAccount(link: string) {
    const candidate = await this.userEntity.findOne({ activationLink: link });
    if (!candidate) throw new NotFoundException('Not found ');
    candidate.isActivated = true;
    await candidate.save();
  }

  async logout(refreshToken: string) {
    const token = await this.tokenService.removeToken(refreshToken);
    return token;
  }

  async validadeRefreshToken(token: string): Promise<ITokenPayload> {
    const refreshToken = jwt.verify(token, SECRET_JWT) as ITokenPayload;
    return refreshToken;
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) return null;

    const tokenFromDB = await this.tokenService.findToken(refreshToken);

    const tokenData = await this.validadeRefreshToken(refreshToken);

    if (!tokenFromDB || !tokenData.id)
      throw new UnauthorizedException('Користувач не авторизованний');

    const user = await this.userEntity.findOne({ email: tokenData.email });

    if (!user) throw new UnauthorizedException('Користувач не авторизованний');

    const tokens = generateTokens({
      email: user.email,
      id: user.id,
      isActivated: user.isActivated,
    });

    return {
      ...tokens,
      email: user.email,
      id: user.id,
      isActivated: user.isActivated,
    };
  }
}

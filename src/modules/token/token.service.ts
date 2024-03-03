import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token } from './token.schema';
import mongoose from 'mongoose';

@Injectable()
export class TokenService {
  @InjectModel(Token.name)
  tokenEntity: Model<Token>;
  async saveToken(userId: string, refreshToken: string) {
    const tokenData = await this.tokenEntity.findOne({ user_id: userId });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    const token = await this.tokenEntity.create({
      _id: new mongoose.Types.ObjectId(),
      user_id: userId,
      refreshToken,
    });

    return token;
  }
  async removeToken(refreshToken: string) {
    const tokenData = await this.tokenEntity.deleteOne({ refreshToken });
    return tokenData;
  }

  async findToken(refreshToken: string) {
    const tokenData = await this.tokenEntity.findOne({ refreshToken });
    return tokenData;
  }
}

import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';
import { WrongPassword } from '../../schemas/wrongPassword.schema';

@Schema({ versionKey: false })
export class User extends mongoose.Document {
  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  _id: string;
  @ApiProperty()
  @Prop()
  password: string;
  @ApiProperty()
  @Prop()
  isActivated: boolean;
  @ApiProperty()
  @Prop()
  activationLink: string;
  @ApiProperty()
  @Prop()
  email: string;
  @ApiProperty()
  @Prop()
  fio: string;
  @ApiProperty()
  @Prop({ type: mongoose.SchemaTypes.ObjectId, ref: 'WrongPassword' })
  wrong_password: WrongPassword;
}

export const UserSchema = SchemaFactory.createForClass(User);

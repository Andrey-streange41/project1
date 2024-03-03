import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class Token extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  _id: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user_id: string;

  @Prop()
  accessToken: string;

  @Prop()
  refreshToken: string;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;
}

export const TokenSchema = SchemaFactory.createForClass(Token);

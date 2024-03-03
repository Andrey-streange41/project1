import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document } from 'mongoose';

@Schema({ versionKey: false })
export class Task extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  _id: string;
  @ApiProperty()
  @Prop({ type: 'ObjectId', ref: 'Project', default: '0' })
  project_id: string;
  @ApiProperty()
  @Prop({ required: true })
  title: string;
  @ApiProperty()
  @Prop({ required: true })
  description: string;
  @ApiProperty()
  @Prop({ required: true })
  status: string;
  @ApiProperty()
  @Prop()
  priority: number;
  @ApiProperty()
  @Prop()
  deadline: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);

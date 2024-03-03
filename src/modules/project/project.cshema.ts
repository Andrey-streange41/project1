import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document } from 'mongoose';

@Schema()
export class Project extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  _id: string;

  @ApiProperty()
  @Prop()
  title: string;

  @ApiProperty()
  @Prop()
  description: string;

  @ApiProperty()
  @Prop()
  start_date: Date;

  @ApiProperty()
  @Prop()
  end_date: Date;

  @ApiProperty()
  @Prop({ type: [{ type: 'ObjectId', ref: 'Task' }] })
  tasks: string[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);

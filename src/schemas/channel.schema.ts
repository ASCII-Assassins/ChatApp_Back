import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';

export type ChannelDocument = Channel & Document;
@Schema({ timestamps: true })

export class Channel{
  @Prop({ unique: true, required: true})
  name: string;

  @Prop({ required: false })
  description?: string;


  @Prop({ default: Date.now })
  createdAt: Date;
}

export const ChannelSchema = SchemaFactory.createForClass(Channel);

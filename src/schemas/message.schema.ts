// src/schemas/message.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sender: User;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  receiver?: User;

  @Prop({ type: Types.ObjectId, ref: 'Group' })
  group?: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ default: false })
  isRead: boolean;

  @Prop()
  readAt?: Date;

  @Prop({ default: 'private', enum: ['private', 'group', 'general'] })
  type: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

import { Document, Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema()
export class Notification {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  readonly senderId: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  readonly receiverId: string;

  @Prop({ type: String, enum: ['friendship', 'message'] })
  readonly type: string;

  @Prop({ type: Date, default: Date.now })
  readonly createdAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

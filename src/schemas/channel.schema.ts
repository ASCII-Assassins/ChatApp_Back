import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// channel.schema.ts
@Schema()
export class Channel extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;
}

export const ChannelSchema = SchemaFactory.createForClass(Channel);
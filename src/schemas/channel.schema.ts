import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Channel extends Document {
  @Prop({ required: true })
  name: string;  // Nom du canal

  @Prop({ type: [String], required: true })
  members: string[];  // Liste des ID des utilisateurs

  @Prop({ default: Date.now })
  createdAt: Date;  // Date de création du canal
}

export const ChannelSchema = SchemaFactory.createForClass(Channel);

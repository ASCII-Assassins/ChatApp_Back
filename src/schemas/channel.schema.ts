import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';




export type ChannelDocument = Channel & Document;
@Schema({ timestamps: true })

export class Channel{
  @Prop({ unique: true, required: true})
  name: string; // Nom du groupe

  @Prop({ required: false })
  description?: string;

  @Prop({type: Types.ObjectId,ref: 'User', required:true})
  owner:Types.ObjectId;

  @Prop([{ type: Types.ObjectId, ref: 'User' }]) // Membres du groupe
  members: Types.ObjectId[]; // Liste des ID des utilisateurs

  @Prop({ default: Date.now })
  createdAt: Date;  // Date de création du canal
}

export const ChannelSchema = SchemaFactory.createForClass(Channel);

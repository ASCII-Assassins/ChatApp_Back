// src/schemas/group.schema.ts
import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type GroupDocument = Group & Document;

@Schema({ timestamps: true })
export class Group {
  @Prop({ unique: true, required: true})
  name: string; // Nom du groupe

  @Prop({ required: false })
  description?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId;

  @Prop([{ type: Types.ObjectId, ref: 'User' }]) // Membres du groupe
  members: Types.ObjectId[];

  @Prop({ default: false })
  isPrivate: boolean; // Statut de groupe privé

  @Prop({ required: false }) 
  image?: string; 

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({
    type: [{ 
      userId: { type: Types.ObjectId, ref: 'User' }, 
      status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' } 
    }]
  })
  invitations: { userId: Types.ObjectId; status: string }[];
}

export const GroupSchema = SchemaFactory.createForClass(Group);

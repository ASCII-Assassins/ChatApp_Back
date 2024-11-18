// src/schemas/group.schema.ts
import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type GroupDocument = Group & Document;

@Schema({ timestamps: true })
export class Group {
  @Prop({ required: true })
  name: string; // Nom du groupe

  @Prop([{ type: Types.ObjectId, ref: 'User' }]) // Membres du groupe
  members: Types.ObjectId[];

  @Prop({ default: false })
  isPrivate: boolean; // Statut de groupe privé

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const GroupSchema = SchemaFactory.createForClass(Group);

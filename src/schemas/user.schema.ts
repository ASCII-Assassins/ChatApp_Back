// src/schemas/user.schema.ts
import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ default: 'offline' }) // Statut de l'utilisateur (en ligne, hors ligne, masqué)
  status: string;

  @Prop({ default: Date.now })
  lastSeen: Date; // Dernière connexion

  @Prop({ default: false })
  isOnline: boolean; // Si l'utilisateur est en ligne
}

export const UserSchema = SchemaFactory.createForClass(User);

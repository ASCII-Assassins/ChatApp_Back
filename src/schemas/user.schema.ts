// src/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

export enum UserStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  AWAY = 'away',
  DO_NOT_DISTURB = 'do_not_disturb'
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  socketId: string;

  @Prop({ default: null })
  lastSeen: Date;

  @Prop({
    type: String,
    enum: UserStatus,
    default: UserStatus.OFFLINE
  })
  status: UserStatus;

  @Prop({ default: '' })
  avatar: string;

  @Prop({ default: false })
  isTyping: boolean;

  @Prop({ type: [String], default: [] })
  blockedUsers: string[];

  @Prop({ type: [String], default: [] })
  friends: string[];

  @Prop({
    type: {
      notifications: { type: Boolean, default: true },
      soundEnabled: { type: Boolean, default: true },
      emailNotifications: { type: Boolean, default: true },
      showLastSeen: { type: Boolean, default: true }
    },
    default: {}
  })
  settings: {
    notifications: boolean;
    soundEnabled: boolean;
    emailNotifications: boolean;
    showLastSeen: boolean;
  };

  toResponse(): IUserResponse {
    return {
      id: this._id.toString(),
      username: this.username,
      email: this.email,
      status: this.status,
      avatar: this.avatar,
      isOnline: this.isOnline(),
      lastSeen: this.lastSeen,
      isTyping: this.isTyping
    };
  }

  isOnline(): boolean {
    return this.status === UserStatus.ONLINE && !!this.socketId;
  }

  async disconnect(): Promise<void> {
    this.socketId = null;
    this.status = UserStatus.OFFLINE;
    this.lastSeen = new Date();
    this.isTyping = false;
    await this.save();
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

// Ajout des méthodes au schema
UserSchema.methods.toResponse = function(): IUserResponse {
  return {
    id: this._id.toString(),
    username: this.username,
    email: this.email,
    status: this.status,
    avatar: this.avatar,
    isOnline: this.isOnline(),
    lastSeen: this.lastSeen,
    isTyping: this.isTyping
  };
};

UserSchema.methods.isOnline = function(): boolean {
  return this.status === UserStatus.ONLINE && !!this.socketId;
};

UserSchema.methods.disconnect = async function(): Promise<void> {
  this.socketId = null;
  this.status = UserStatus.OFFLINE;
  this.lastSeen = new Date();
  this.isTyping = false;
  await this.save();
};

export interface IUserResponse {
  id: string;
  username: string;
  email: string;
  status: UserStatus;
  avatar: string;
  isOnline: boolean;
  lastSeen: Date;
  isTyping: boolean;
}

export interface IUserSocket {
  socketId: string;
  status: UserStatus;
}
// src/user/user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument, UserStatus, IUserResponse, IUserSocket } from '../schemas/user.schema';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = new this.userModel({
      ...userData,
      password: hashedPassword,
      status: UserStatus.OFFLINE
    });
    return user.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async findBySocketId(socketId: string): Promise<User | null> {
    return this.userModel.findOne({ socketId }).exec();
  }



  async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  
  

  async updateUserStatus(userId: string, status: UserStatus, socketId: string): Promise<User> {
    return this.userModel.findByIdAndUpdate(
      userId, 
      { status, socketId }, 
      { new: true }
    ).exec();
  }

  async addFriend(userId: string, friendId: string): Promise<User> {
    return this.userModel.findByIdAndUpdate(
      userId, 
      { $addToSet: { friends: friendId } }, 
      { new: true }
    ).exec();
  }

  async blockUser(userId: string, blockedUserId: string): Promise<User> {
    return this.userModel.findByIdAndUpdate(
      userId, 
      { $addToSet: { blockedUsers: blockedUserId } }, 
      { new: true }
    ).exec();
  }
}

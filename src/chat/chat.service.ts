// src/chat/chat.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message, MessageDocument } from '../schemas/message.schema';
import { User, UserDocument } from '../schemas/user.schema';
import { Group, GroupDocument } from '../schemas/group.schema';
import { CreateMessageDto } from '../dtos/create-message.dto';
import { CreateGroupDto } from '../dtos/create-group.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Group.name) private groupModel: Model<GroupDocument>
  ) {}

  async createMessage(senderId: string, createMessageDto: CreateMessageDto) {
    const { recipientId, content } = createMessageDto;
    const message = new this.messageModel({
      sender: senderId,
      recipient: recipientId,
      content,
      status: 'sent', // Initialiser à "sent"
    });
    return message.save();
  }

  async getMessagesBetweenUsers(user1Id: string, user2Id: string) {
    return this.messageModel
      .find({
        $or: [
          { sender: user1Id, recipient: user2Id },
          { sender: user2Id, recipient: user1Id }
        ]
      })
      .sort({ createdAt: 1 });
  }

  async createGroup(createGroupDto: CreateGroupDto) {
    const { name, members } = createGroupDto;
    const group = new this.groupModel({
      name,
      members,
      isPrivate: false,
    });
    return group.save();
  }

  async getGroupMessages(groupId: string) {
    return this.messageModel
      .find({ group: groupId })
      .sort({ createdAt: 1 });
  }

  async setStatus(userId: string, status: string) {
    return this.userModel.findByIdAndUpdate(userId, { status });
  }

  async updateMessageStatus(messageId: string, status: string) {
    return this.messageModel.findByIdAndUpdate(messageId, { status });
  }

  async setUserOnline(userId: string, isOnline: boolean) {
    return this.userModel.findByIdAndUpdate(userId, { isOnline });
  }
}

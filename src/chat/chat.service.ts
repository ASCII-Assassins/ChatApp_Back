import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message, MessageDocument } from '../schemas/message.schema';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class ChatService {
  private connectedUsers: Map<string, string> = new Map();

  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}



  async getConnectedUsers(): Promise<User[]> {
    try {
      const userIds = Array.from(this.connectedUsers.keys());
      const validUserIds = userIds.filter(id => Types.ObjectId.isValid(id))
                                .map(id => new Types.ObjectId(id));
      
      return await this.userModel.find({
        _id: { $in: validUserIds },
      });
    } catch (error) {
      throw new BadRequestException('Failed to fetch connected users');
    }
  }

  

  private validateObjectId(id: string): Types.ObjectId {
    if (!id || !Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid ID: ${id}`);
    }
    return new Types.ObjectId(id);
  }

  async saveMessage(
    senderId: string,
    content: string,
    type: string,
    receiverId?: string,
    groupId?: string,
    channelId?: string
  ): Promise<Message> {
    try {
      const messageData: any = {
        sender: this.validateObjectId(senderId),
        content,
        type,
      };

      if (type === 'private' && receiverId) {
        messageData.receiver = this.validateObjectId(receiverId);
      } else if (type === 'group' && groupId) {
        messageData.group = this.validateObjectId(groupId);
      } else if (type === 'channel' && channelId) {
        messageData.channel = this.validateObjectId(channelId); // Fixed property name from 'type' to 'channel'
      }

      const message = new this.messageModel(messageData);
      return await message.save();
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to save message');
    }
  }

  async markMessageAsRead(messageId: string): Promise<Message> {
    try {
      const validMessageId = this.validateObjectId(messageId);
      const updatedMessage = await this.messageModel.findByIdAndUpdate(
        validMessageId,
        {
          isRead: true,
          readAt: new Date(),
        },
        { new: true }
      );
      
      if (!updatedMessage) {
        throw new BadRequestException('Message not found');
      }
      
      return updatedMessage;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to mark message as read');
    }
  }

  async getPrivateMessages(user1Id: string, user2Id: string): Promise<Message[]> {
    try {
      const validUser1Id = this.validateObjectId(user1Id);
      const validUser2Id = this.validateObjectId(user2Id);

      return await this.messageModel
        .find({
          type: 'private',
          $or: [
            { sender: validUser1Id, receiver: validUser2Id },
            { sender: validUser2Id, receiver: validUser1Id },
          ],
        })
        .populate('sender receiver')
        .sort({ createdAt: 1 });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch private messages');
    }
  }

  async userConnected(userId: string, socketId: string): Promise<void> {
    try {
      const validUserId = this.validateObjectId(userId);
      this.connectedUsers.set(userId, socketId);
      await this.userModel.findByIdAndUpdate(validUserId, {
        isOnline: true,
        lastSeen: new Date(),
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to connect user');
    }
  }

  async userDisconnected(userId: string): Promise<void> {
    try {
      const validUserId = this.validateObjectId(userId);
      this.connectedUsers.delete(userId);
      await this.userModel.findByIdAndUpdate(validUserId, {
        isOnline: false,
        lastSeen: new Date(),
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to disconnect user');
    }
  }

  getSocketId(userId: string): string | undefined {
    return this.connectedUsers.get(userId);
  }
}
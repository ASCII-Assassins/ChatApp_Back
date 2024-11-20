import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message, MessageType, MessageStatus } from '../schemas/message.schema';
import { User } from '../schemas/user.schema';
import { Group } from '../schemas/group.schema';
import { Channel } from '../schemas/channel.schema';

type MessageDestination = {
  type: MessageType;
  destinationField: string;
  destinationId: string;
  model: Model<any>;
};

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Group.name) private readonly groupModel: Model<Group>,
    @InjectModel(Channel.name) private readonly channelModel: Model<Channel>,
  ) {}

  private async validateDestination({ type, destinationId, model }: MessageDestination): Promise<void> {
    if (type !== MessageType.PRIVATE) {
      const destination = await model.findById(destinationId);
      if (!destination) {
        throw new Error(`${type.charAt(0).toUpperCase() + type.slice(1)} not found`);
      }
    }
  }

  private createMessageObject(
    senderId: string,
    content: string,
    { type, destinationField, destinationId }: MessageDestination
  ): Partial<Message> {
    return {
      sender: new Types.ObjectId(senderId),
      [destinationField]: new Types.ObjectId(destinationId),
      content,
      type,
      status: MessageStatus.SENT,
    };
  }

  private async createAndSaveMessage(messageData: Partial<Message>): Promise<Message> {
    const message = new this.messageModel(messageData);
    return await message.save();
  }

  async sendMessage(
    senderId: string,
    destinationId: string,
    content: string,
    type: MessageType
  ): Promise<Message> {
    const destinationConfig: Record<MessageType, MessageDestination> = {
      [MessageType.PRIVATE]: {
        type: MessageType.PRIVATE,
        destinationField: 'receiver',
        destinationId,
        model: this.userModel,
      },
      [MessageType.GROUP]: {
        type: MessageType.GROUP,
        destinationField: 'group',
        destinationId,
        model: this.groupModel,
      },
      [MessageType.CHANNEL]: {
        type: MessageType.CHANNEL,
        destinationField: 'channel',
        destinationId,
        model: this.channelModel,
      },
    };

    const destination = destinationConfig[type];
    await this.validateDestination(destination);
    const messageData = this.createMessageObject(senderId, content, destination);
    return await this.createAndSaveMessage(messageData);
  }

  async getMessages(
    type: MessageType,
    destinationId: string,
    userId?: string
  ): Promise<Message[]> {
    let query: any = {};

    switch (type) {
      case MessageType.PRIVATE:
        if (!userId) throw new Error('userId is required for private messages');
        query = {
          $or: [
            { sender: userId, receiver: destinationId },
            { sender: destinationId, receiver: userId },
          ],
        };
        break;
      case MessageType.GROUP:
        query = { group: destinationId };
        break;
      case MessageType.CHANNEL:
        query = { channel: destinationId };
        break;
    }

    return this.messageModel.find(query).sort({ createdAt: 1 });
  }

  async updateMessage(
    messageId: string,
    senderId: string,
    content: string
  ): Promise<Message> {
    const message = await this.messageModel.findOne({
      _id: messageId,
      sender: senderId,
    });

    if (!message) {
      throw new Error('Message not found or you are not authorized to edit it');
    }

    Object.assign(message, {
      content,
      isEdited: true,
      editedAt: new Date(),
    });

    return await message.save();
  }

  async deleteMessage(messageId: string, senderId: string): Promise<void> {
    const result = await this.messageModel.deleteOne({
      _id: messageId,
      sender: senderId,
    });

    if (result.deletedCount === 0) {
      throw new Error('Message not found or you are not authorized to delete it');
    }
  }

  async getUnreadMessagesCount(userId: string): Promise<number> {
    return this.messageModel.countDocuments({
      receiver: userId,
      status: { $ne: MessageStatus.READ },
    });
  }

  async markMessagesAsRead(userId: string, otherUserId: string): Promise<void> {
    await this.messageModel.updateMany(
      {
        sender: otherUserId,
        receiver: userId,
        status: { $ne: MessageStatus.READ },
      },
      { $set: { status: MessageStatus.READ } }
    );
  }

  async searchMessages(userId: string, searchTerm: string): Promise<Message[]> {
    return this.messageModel
      .find({
        $or: [
          { content: { $regex: searchTerm, $options: 'i' }, receiver: userId },
          { content: { $regex: searchTerm, $options: 'i' }, sender: userId },
        ],
      })
      .sort({ createdAt: 1 });
  }
}
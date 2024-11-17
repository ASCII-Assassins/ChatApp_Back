import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './schemas/message.schema';

@Injectable()
export class ChatService {
  constructor(@InjectModel('Message') private readonly messageModel: Model<Message>) {}
  async create(createMessageDto: Partial<Message>) {
    const createdMessage = new this.messageModel(createMessageDto);
    return createdMessage.save();
  }

  async findAll(query: any) {
    return this.messageModel.find(query).exec();
  }

  async findOne(id: string) {
    return this.messageModel.findById(id).exec();
  }
}

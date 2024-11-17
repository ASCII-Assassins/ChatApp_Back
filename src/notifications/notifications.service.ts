import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './schemas/notifications.schema';

@Injectable()
export class NotificationsService {
  constructor(@InjectModel('Notification') private readonly notificationModel: Model<Notification>) {}

  async findAll() {
    return this.notificationModel.find().exec();
  }

  async findOne(id: string) {
    return this.notificationModel.findById(id).exec();
  }

  async create(notification: Notification) {
    const createdNotification = new this.notificationModel(notification);
    return createdNotification.save();
  }

  async delete(id: string) {
    return this.notificationModel.findByIdAndDelete(id).exec();
  }
}


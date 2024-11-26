import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from '../schemas/notifications.schema';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private readonly notificationModel: Model<Notification>, // Injection du modèle Notification
  ) {}

  // Exemple de méthode dans NotificationsService
  async findAll(): Promise<Notification[]> {
    return this.notificationModel.find().exec();
  }
}

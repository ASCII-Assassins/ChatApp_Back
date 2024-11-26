import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { Notification, NotificationSchema } from '../schemas/notifications.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]), // Importation du modèle Notification
  ],
  providers: [NotificationsService],
  controllers: [NotificationsController],
  exports: [NotificationsService], // Exportation si nécessaire
})
export class NotificationsModule {}

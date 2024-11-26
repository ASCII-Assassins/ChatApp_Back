import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatModule } from './chat/chat.module';
import { UsersModule } from './users/users.module';
import { ChannelModule } from './channel/channel.module';
import { NotificationsModule } from './notifications/notifications.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [

    MongooseModule.forRoot('mongodb+srv://bouhamidisal:i5qgTbKB3lh2pqBH@cluster-chatapp.dlvhr.mongodb.net/Chat-Application'),

    MongooseModule.forRoot(
      process.env.MONGODB_URI,
    ),

    ChatModule,
    UsersModule,
    ChannelModule,
    NotificationsModule,
    EventsModule,
  ],
})
export class AppModule {}

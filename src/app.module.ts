import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatModule } from './chat/chat.module';
import { UsersModule } from './users/users.module';
import { GroupsModule } from './Group/groups.module';
import { NotificationsModule } from './notifications/notifications.module';


@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://bouhamidisal:i5qgTbKB3lh2pqBH@cluster-chatapp.dlvhr.mongodb.net/Chat-Application'),
    ChatModule,
    UsersModule,
    GroupsModule,
    NotificationsModule,
  ],
})
export class AppModule {}

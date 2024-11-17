import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatModule } from './chat/chat.module';
import { UsersModule } from './users/users.module';
import { GroupsModule } from './groups/groups.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/chat-service'),
    ChatModule,
    UsersModule,
    GroupsModule,
    NotificationsModule,
  ],
})
export class AppModule {}

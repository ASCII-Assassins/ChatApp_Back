import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatModule } from './chat/chat.module';
import { UsersModule } from './users/users.module';
import { GroupsModule } from './Group/groups.module';
import { NotificationsModule } from './notifications/notifications.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI,
    ),
    ChatModule,
    UsersModule,
    GroupsModule,
    NotificationsModule,
    EventsModule,
  ],
})
export class AppModule {}

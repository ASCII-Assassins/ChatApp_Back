// src/app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ChatModule } from './chat/chat.module';
import { UsersModule } from './users/users.module';
import { GroupsModule } from './channel/groups.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    // ConfigModule doit être chargé en premier car d'autres modules en dépendent
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Ensuite MongooseModule qui utilise la configuration
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    // Modules de l'application
    // AuthModule devrait être avant les autres modules qui peuvent en dépendre
    UsersModule,
    ChatModule,
    GroupsModule,
    NotificationsModule,
  ],
})
export class AppModule {}
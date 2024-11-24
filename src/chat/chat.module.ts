// src/chat/chat.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { Message, MessageSchema } from '../schemas/message.schema';
import { User, UserSchema } from '../schemas/user.schema';
import { ChatController } from './chat.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: User.name, schema: UserSchema }
    ])
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
  exports: [ChatService]
})
export class ChatModule {}
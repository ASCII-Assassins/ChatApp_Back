// src/chat/chat.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { UserModule } from '../users/user.module';
import { Message, MessageSchema } from '../schemas/message.schema';
import { Group, GroupSchema } from '../schemas/group.schema';
import { Channel, ChannelSchema } from '../schemas/channel.schema';
import { JwtModule } from '@nestjs/jwt'; 



@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: Group.name, schema: GroupSchema },
      { name: Channel.name, schema: ChannelSchema },
    ]),
    UserModule,

    JwtModule.register({  
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [ChatGateway, ChatService],
  exports: [ChatService],
})
export class ChatModule {}

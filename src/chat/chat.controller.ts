import { Controller, Get, Param } from '@nestjs/common';
import {ChatService} from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly messagesService: ChatService) {}

  @Get('private/:senderId/:receiverId')
  async getPrivateMessages(
    @Param('senderId') senderId: string,
    @Param('receiverId') receiverId: string,
  ) {
    return this.messagesService.getPrivateMessages(senderId, receiverId);
  }
}
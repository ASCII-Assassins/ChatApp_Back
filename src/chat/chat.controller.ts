// src/chat/chat.controller.ts
import { Controller, Post, Body, Param, Get, ValidationPipe } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateMessageDto } from '../dtos/create-message.dto';
import { CreateGroupDto } from '../dtos/create-group.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('message')
  async sendMessage(@Body(ValidationPipe) createMessageDto: CreateMessageDto) {
    return this.chatService.createMessage(createMessageDto.senderId, createMessageDto);
  }

  @Get(':user1Id/:user2Id')
  async getMessagesBetweenUsers(@Param('user1Id') user1Id: string, @Param('user2Id') user2Id: string) {
    return this.chatService.getMessagesBetweenUsers(user1Id, user2Id);
  }

  @Post('group')
  async createGroup(@Body(ValidationPipe) createGroupDto: CreateGroupDto) {
    return this.chatService.createGroup(createGroupDto);
  }

  @Get('group/:groupId/messages')
  async getGroupMessages(@Param('groupId') groupId: string) {
    return this.chatService.getGroupMessages(groupId);
  }
}

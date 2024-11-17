import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Message } from './schemas/message.schema';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async create(@Body() message: Message) {
    return this.chatService.create(message);
  }
                            
  @Get()
  async findAll(@Query() query: any) {
    return this.chatService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.chatService.findOne(id);
  }

  @Get('search')
  async search(@Query('term') term: string) {
    const query = { content: { $regex: term, $options: 'i' } };
    return this.chatService.findAll(query);
  }

}


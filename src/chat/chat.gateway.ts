// src/chat/chat.gateway.ts
import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { CreateMessageDto } from '../dtos/create-message.dto';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private chatService: ChatService) {}

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() createMessageDto: CreateMessageDto,
    @ConnectedSocket() client: Socket
  ) {
    const senderId = client.handshake.query.userId as string;
    const message = await this.chatService.createMessage(senderId, createMessageDto);
    
    // Mise à jour du statut du message
    await this.chatService.updateMessageStatus(message._id.toString(), 'sent');
    
    // Envoi du message à l'utilisateur destinataire
    this.server.to(createMessageDto.recipientId).emit('newMessage', message);
    client.emit('messageSent', message);
  }

  @SubscribeMessage('readMessage')
  async handleReadMessage(
    @MessageBody() messageId: string,
    @ConnectedSocket() client: Socket
  ) {
    await this.chatService.updateMessageStatus(messageId, 'read');
    this.server.emit('messageRead', messageId);
  }

  @SubscribeMessage('joinGroup')
  handleJoinGroup(@MessageBody() groupId: string, @ConnectedSocket() client: Socket) {
    client.join(groupId);
    client.emit('joinedGroup', groupId);
  }

  @SubscribeMessage('leaveGroup')
  handleLeaveGroup(@MessageBody() groupId: string, @ConnectedSocket() client: Socket) {
    client.leave(groupId);
    client.emit('leftGroup', groupId);
  }

  @SubscribeMessage('setStatus')
  async handleStatus(
    @MessageBody() status: string,
    @ConnectedSocket() client: Socket
  ) {
    const userId = client.handshake.query.userId as string;
    await this.chatService.setStatus(userId, status);
    this.server.emit('userStatusUpdated', { userId, status });
  }

  @SubscribeMessage('setOnline')
  async handleSetOnline(@MessageBody() status: boolean, @ConnectedSocket() client: Socket) {
    const userId = client.handshake.query.userId as string;
    await this.chatService.setUserOnline(userId, status);
    this.server.emit('userOnlineStatusUpdated', { userId, isOnline: status });
  }
}

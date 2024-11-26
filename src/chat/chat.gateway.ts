// chat.gateway.ts
import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    ConnectedSocket,
    MessageBody,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { ChatService } from './chat.service';
  
  @WebSocketGateway({
    cors: {
      origin: '*',
    },
  })
  export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
  
    constructor(private chatService: ChatService) {}
  
    async handleConnection(client: Socket) {
      const userId = client.handshake.query.userId as string;
      if (userId) {
        this.chatService.userConnected(userId, client.id);
        const connectedUsers = await this.chatService.getConnectedUsers();
        this.server.emit('users:connected', connectedUsers);
      }
    }
  
    async handleDisconnect(client: Socket) {
      const userId = client.handshake.query.userId as string;
      if (userId) {
        this.chatService.userDisconnected(userId);
        const connectedUsers = await this.chatService.getConnectedUsers();
        this.server.emit('users:connected', connectedUsers);
      }
    }
  
    @SubscribeMessage('message:private')
    async handlePrivateMessage(
      @ConnectedSocket() client: Socket,
      @MessageBody() data: { senderId: string; receiverId: string; content: string },
    ) {
      const message = await this.chatService.saveMessage(
        data.senderId,
        data.content,
        'private',
        data.receiverId,
      );
  
      const receiverSocketId = this.chatService.getSocketId(data.receiverId);
      if (receiverSocketId) {
        this.server.to(receiverSocketId).emit('message:private', message);
      }
      
      client.emit('message:private', message);
    }
  
    @SubscribeMessage('message:group')
    async handleGroupMessage(
      @MessageBody()
      data: { senderId: string; groupId: string; content: string },
    ) {
      const message = await this.chatService.saveMessage(
        data.senderId,
        data.content,
        'group',
        undefined,
        data.groupId,
      );
  
      this.server.emit('message:group', {
        groupId: data.groupId,
        message,
      });
    }
  
    @SubscribeMessage('message:general')
    async handleGeneralMessage(
      @MessageBody()
      data: { senderId: string; content: string },
    ) {
      const message = await this.chatService.saveMessage(
        data.senderId,
        data.content,
        'general',
      );
  
      this.server.emit('message:general', message);
    }
  
    @SubscribeMessage('message:read')
    async handleMessageRead(
      @MessageBody() data: { messageId: string },
    ) {
      const message = await this.chatService.markMessageAsRead(data.messageId);
      this.server.emit('message:updated', message);
    }
  }
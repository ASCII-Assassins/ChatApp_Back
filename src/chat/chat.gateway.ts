import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    ConnectedSocket,
    MessageBody,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { ChatService } from './chat.service';
  import { User, UserStatus } from '../schemas/user.schema';
  import { Message, MessageType, MessageStatus } from '../schemas/message.schema';
  import { UserService } from '../users/user.service';
  
  interface SendMessageDto {
    receiverId?: string;
    groupId?: string;
    channelId?: string;
    content: string;
  }
  
  @WebSocketGateway(3001, {
    namespace: '/chat',
    cors: {
      origin: '*', 
      methods: ['GET', 'POST'],
      credentials: true,
      allowedHeaders: ['Authorization', 'Content-Type'],
    },
    transports: ['websocket']
  })
 
  export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
  
    private userSocketMap: Map<string, string> = new Map();
    private socketUserMap: Map<string, string> = new Map();
  
    constructor(
      private readonly chatService: ChatService,
      private readonly userService: UserService,
    ) {}
  
    afterInit(server: Server) {
      console.log('WebSocket Gateway initialized');
    }
  
    async handleConnection(client: Socket) {
      try {
        const userId = client.handshake.query.userId as string;
        if (!userId) {
          client.disconnect();
          return;
        }
  
        // Validate user exists
        const user = await this.userService.findById(userId);
        if (!user){
          client.disconnect();
          return;
        }
  
        // Set user data and update status
        client.data.user = user;
        this.userSocketMap.set(userId, client.id);
        this.socketUserMap.set(client.id, userId);
  
        await this.userService.updateUserStatus(userId, UserStatus.ONLINE, client.id);
  
        // Broadcast user online status
        this.server.emit('userStatusChange', {
          userId,
          status: UserStatus.ONLINE,
          isOnline: true
        });
  
      } catch (e) {
        console.error('Connection error:', e);
        client.disconnect();
      }
    }
  
    async handleDisconnect(client: Socket) {
      const userId = this.socketUserMap.get(client.id);
      if (userId) {
        await this.userService.updateUserStatus(userId, UserStatus.OFFLINE, null);
        
        // Broadcast user offline status
        this.server.emit('userStatusChange', {
          userId,
          status: UserStatus.OFFLINE,
          isOnline: false,
        });
  
        this.userSocketMap.delete(userId);
        this.socketUserMap.delete(client.id);
      }
    }
  
    @SubscribeMessage('sendMessage')
    async handleSendMessage(
      @ConnectedSocket() client: Socket,
      @MessageBody() data: SendMessageDto,
    ) {
      const sender = client.data.user as User;
  
      try {
        let message: Message;
        let type: MessageType;
        let destinationId: string;
  
        if (data.receiverId) {
          type = MessageType.PRIVATE;
          destinationId = data.receiverId;
        } else if (data.groupId) {
          type = MessageType.GROUP;
          destinationId = data.groupId;
        } else if (data.channelId) {
          type = MessageType.CHANNEL;
          destinationId = data.channelId;
        } else {
          throw new Error('Invalid message destination');
        }
  
        message = await this.chatService.sendMessage(
          sender._id.toString(),
          destinationId,
          data.content,
          type
        );
  
        // Emit message based on type
        switch (type) {
          case MessageType.PRIVATE:
            await this.emitToUser(destinationId, 'newMessage', message);
            break;
          case MessageType.GROUP:
            this.server.to(`group-${destinationId}`).emit('newMessage', message);
            break;
          case MessageType.CHANNEL:
            this.server.to(`channel-${destinationId}`).emit('newMessage', message);
            break;
        }
  
        return message;
      } catch (error) {
        return { error: error.message };
      }
    }
  
    // Helper method to emit events to a specific user
    private async emitToUser(userId: string, event: string, data: any) {
      const socketId = this.userSocketMap.get(userId);
      if (socketId) {
        this.server.to(socketId).emit(event, data);
      }
    }
  }
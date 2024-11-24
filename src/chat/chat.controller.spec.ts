import { Test, TestingModule } from '@nestjs/testing';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { Server } from 'socket.io';

describe('ChatGateway', () => {
  let chatGateway: ChatGateway;
  let chatService: ChatService;
  let mockServer: Partial<Server>;

  beforeEach(async () => {
    const chatServiceMock = {
      userConnected: jest.fn(),
      userDisconnected: jest.fn(),
      getConnectedUsers: jest.fn().mockResolvedValue(['user1', 'user2']),
      saveMessage: jest.fn().mockResolvedValue({
        id: 'msg1',
        senderId: 'user1',
        content: 'Hello',
        type: 'private',
        receiverId: 'user2',
      }),
      markMessageAsRead: jest.fn().mockResolvedValue({
        id: 'msg1',
        status: 'read',
      }),
      getSocketId: jest.fn().mockReturnValue('socket123'),
    };

    mockServer = {
      emit: jest.fn(),
      to: jest.fn().mockReturnThis(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatGateway,
        { provide: ChatService, useValue: chatServiceMock },
      ],
    }).compile();

    chatGateway = module.get<ChatGateway>(ChatGateway);
    chatService = module.get<ChatService>(ChatService);
    (chatGateway as any).server = mockServer;
  });

  it('should handle connection', async () => {
    const mockClient: any = {
      id: 'socket1',
      handshake: { query: { userId: 'user1' } },
    };

    await chatGateway.handleConnection(mockClient);

    expect(chatService.userConnected).toHaveBeenCalledWith('user1', 'socket1');
    expect(chatService.getConnectedUsers).toHaveBeenCalled();
    expect(mockServer.emit).toHaveBeenCalledWith('users:connected', ['user1', 'user2']);
  });

  it('should handle disconnection', async () => {
    const mockClient: any = {
      id: 'socket1',
      handshake: { query: { userId: 'user1' } },
    };

    await chatGateway.handleDisconnect(mockClient);

    expect(chatService.userDisconnected).toHaveBeenCalledWith('user1');
    expect(chatService.getConnectedUsers).toHaveBeenCalled();
    expect(mockServer.emit).toHaveBeenCalledWith('users:connected', ['user1', 'user2']);
  });

  it('should handle private messages', async () => {
    const mockClient: any = {
      id: 'socket1',
      emit: jest.fn(),
    };

    const data = {
      senderId: 'user1',
      receiverId: 'user2',
      content: 'Hello',
    };

    await chatGateway.handlePrivateMessage(mockClient, data);

    expect(chatService.saveMessage).toHaveBeenCalledWith(
      'user1',
      'Hello',
      'private',
      'user2',
    );
    expect(mockServer.to).toHaveBeenCalledWith('socket123');
    expect(mockServer.emit).toHaveBeenCalledWith('message:private', {
      id: 'msg1',
      senderId: 'user1',
      content: 'Hello',
      type: 'private',
      receiverId: 'user2',
    });
    expect(mockClient.emit).toHaveBeenCalledWith('message:private', {
      id: 'msg1',
      senderId: 'user1',
      content: 'Hello',
      type: 'private',
      receiverId: 'user2',
    });
  });

  it('should mark a message as read', async () => {
    const data = { messageId: 'msg1' };

    await chatGateway.handleMessageRead(data);

    expect(chatService.markMessageAsRead).toHaveBeenCalledWith('msg1');
    expect(mockServer.emit).toHaveBeenCalledWith('message:updated', {
      id: 'msg1',
      status: 'read',
    });
  });
});

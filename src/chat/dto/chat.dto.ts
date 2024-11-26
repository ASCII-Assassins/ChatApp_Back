// src/chat/dto/chat.dto.ts
export class SendMessageDto {
    receiverId: string;
    content: string;
  }
  
  export class SendGroupMessageDto {
    groupId: string;
    content: string;
  }
  
  export class TypingDto {
    receiverId: string;
    isTyping: boolean;
  }
  
  export class ReadMessageDto {
    messageId: string;
  }
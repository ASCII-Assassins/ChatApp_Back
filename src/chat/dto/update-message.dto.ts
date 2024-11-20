// src/chat/dto/update-message.dto.ts
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class UpdateMessageDto {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  read?: boolean;
}
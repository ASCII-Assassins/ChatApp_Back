// src/dto/create-group.dto.ts
import { IsNotEmpty, IsArray, IsString } from 'class-validator';

export class CreateGroupDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsArray()
  @IsString({ each: true })
  members: string[]; // Liste des utilisateurs dans le groupe
}

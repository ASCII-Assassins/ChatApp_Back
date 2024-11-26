import { IsNotEmpty, IsString, IsOptional, IsMongoId, IsBoolean, IsArray } from 'class-validator';
import { Types } from 'mongoose';


export class CreateGroupDto {
  @IsString()
  @IsNotEmpty({message: "the name shouldn't be empty"})
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  members?: Types.ObjectId[];

  @IsMongoId()
  owner: string;

  @IsBoolean()
  @IsOptional()
  isPrivate?: boolean;

  @IsString()
  @IsOptional()
  image?: string;
}

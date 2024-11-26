import { IsNotEmpty, IsString, IsOptional, IsMongoId, IsBoolean,  } from 'class-validator';
import { Types } from 'mongoose';


export class SearchGroupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsMongoId()
  owner: Types.ObjectId;

  @IsBoolean()
  @IsOptional()
  isPrivate?: boolean;

}

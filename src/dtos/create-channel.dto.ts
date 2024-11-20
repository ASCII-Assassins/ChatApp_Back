import { IsNotEmpty, IsString, IsOptional, IsMongoId, IsBoolean, IsArray, isMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class CreateChannelDto{
    @IsString()
    @IsNotEmpty({message: "the name sholdn't be empty"})
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsArray()
    @IsMongoId({ each: true})
    members: Types.ObjectId[] = [];

    @IsMongoId()
    owner: string;


//   @IsString()
//   @IsOptional()
//   image?: string;

}
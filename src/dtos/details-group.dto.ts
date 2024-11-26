import { SearchGroupDto } from './search-group.dto';
import {IsOptional} from 'class-validator';
import { Types } from 'mongoose';


export class GroupDetailsDto extends SearchGroupDto {
  @IsOptional()
  members: Types.ObjectId[];; 
}
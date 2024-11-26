import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Group, GroupSchema } from '../schemas/group.schema';
import {User, UserSchema} from "../schemas/user.schema"
import { UsersModule } from 'src/users/users.module';



@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Group.name, schema: GroupSchema }
    ]),
    UsersModule
  ],
  providers: [GroupsService],
  controllers: [GroupsController],
  exports: [GroupsService]
})
export class GroupsModule {}

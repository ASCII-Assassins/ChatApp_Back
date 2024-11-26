import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Channel, ChannelDocument, ChannelSchema } from 'src/schemas/channel.schema';
import {User, UserSchema} from "../schemas/user.schema"
import { UsersModule } from 'src/users/users.module';



@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Channel.name, schema: ChannelSchema }
    ]),
    UsersModule
  ],
  providers: [ChannelService],
  controllers: [ChannelController],
  exports: [ChannelService]
})
export class ChannelModule {}
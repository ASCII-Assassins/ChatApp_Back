// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { User, UserSchema } from '../schemas/user.schema';
import { UsersController } from './user.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema }
    ])
  ],
  controllers: [UsersController],
  providers: [UserService],
  exports: [
    UserService, 
    MongooseModule, 
  ],
})
export class UserModule {}
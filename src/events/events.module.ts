import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [EventsController],
})
export class EventsModule {}

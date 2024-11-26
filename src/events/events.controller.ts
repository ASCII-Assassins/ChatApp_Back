import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Controller()
export class EventsController {
  constructor(private readonly usersService: UsersService) {}

  @EventPattern('user_registered')
  async handleUserRegistration(@Payload() data: CreateUserDto) {
    const user = await this.usersService.create(data);
    console.log(user);
  }
}



import { Controller, Get, Post, Body, Param } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get()
  findAll() {
    // logic to find all users
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // logic to find a user by id
  }

  @Post()
  create(@Body() createUserDto: any) {
    // logic to create a new user
  }
}

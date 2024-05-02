import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('getById/:id')
  async findOne(@Param('id') id: string): Promise<any> {
    return this.usersService.findOne(id);
  }

  @Get('all')
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  //////////////////////////////////////////////////////////////////////////////////


  @Post('login')
  async loginUser(@Body() loginData: { credentials: string; password: string }): Promise<any> {
    console.log('===================USUARIO LOGIN=====================');
    console.log(loginData);
    console.log('=====================================================');

    const { credentials, password } = loginData;
    return this.usersService.loginUser(credentials, password);
  }
}

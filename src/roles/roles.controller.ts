import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Role } from './entities/role.entity';

@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) { }

  @Get('all')
  async findAll(): Promise<Role[]> {
      return this.rolesService.findAll();
  }

  @Get('getById/:id')
  async findOne(@Param('id') id: string): Promise<any> {
      return this.rolesService.findOne(id);
  }

  @Post('create')
  async create(@Body() rolesData: Role): Promise<Role> {
      return this.rolesService.create(rolesData);
  }

  @Put('update/:id')
  async update(@Param('id') id: string, @Body() roleData: Role): Promise<any> {
      return this.rolesService.update(id, roleData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<any> {
      return this.rolesService.remove(id);
  }
}

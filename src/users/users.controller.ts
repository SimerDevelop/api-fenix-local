import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) { }

  /**
   * Obtiene una lista de todos los Users en la base de datos.
   * @returns Una lista de Users.
   */
  @Get('all')
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  /**
 * Obtiene una lista de todos los operarios en la base de datos.
 * @returns Una lista de operarios.
 */
  @Get('all/operators')
  async findAllOperators(): Promise<User[]> {
    return this.usersService.findAllOperators();
  }

  /**
 * Obtiene un User por su ID.
 * @param id - ID del User a buscar.
 * @returns Información sobre el resultado de la operación.
 */
  @Get('getById/:id')
  async findUserById(@Param('id') id: string): Promise<any> {
    return this.usersService.findUserById(id);
  }

  /**
   * Crea un nuevo User en la base de datos.
   * @param userData - Datos del User a crear.
   * @returns Información sobre el resultado de la operación.
   */
  @Post('create')
  async createUser(@Body() userData: User): Promise<User> {
    return this.usersService.createUser(userData);
  }

  /**
  * Actualiza un User por su ID.
  * @param id - ID del User a actualizar.
  * @param userData - Nuevos datos del User.
  * @returns Información sobre el resultado de la operación.
  */
  @Put('update/:id')
  async updateUser(@Param('id') id: string, @Body() userData: User): Promise<any> {
    return this.usersService.updateUserById(id, userData);
  }

  /**
   * Inicia sesión de un User.
   * @param loginData - Datos de inicio de sesión (correo y contraseña).
   * @returns Información sobre el resultado de la operación.
   */
  @Post('login')
  async loginUser(@Body() loginData: { credentials: string; password: string }): Promise<any> {
    console.log('===================User LOGIN=====================');
    console.log(loginData);
    console.log('=====================================================');
    
    const { credentials, password } = loginData;    
    return this.usersService.loginUser(credentials, password);
  }

  /**
  * Elimina un User por su ID.
  * @param id - ID del User a eliminar.
  * @returns Información sobre el resultado de la operación.
  */
  @Delete('delete/:id')
  async deleteUser(@Param('id') id: string): Promise<any> {
    return this.usersService.deleteUserById(id);
  }

  @Delete('activate/:id')
  async activateUserById(@Param('id') id: string): Promise<any> {
    return this.usersService.activateUserById(id);
  }
}

import { Injectable } from '@nestjs/common';
import { ResponseUtil } from 'src/utils/response.util';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User) private usuariosRepository: Repository<User>,
  ){ }

  //////////////////////////////////////////////////////////////////////////////////

  async findAll(): Promise<any> {
    try {
      const users = await this.usuariosRepository
        .createQueryBuilder('users')
        .getMany();

      if (users.length < 1) {
        return ResponseUtil.error(
          400,
          'Usuarios no encontrados',
        );
      } else {
        return ResponseUtil.success(
          200,
          'Usuarios encontrados',
          users
        );
      }

    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener los usuarios'
      );
    }
  }

    /**
   * Inicia sesión de un usuario en la base de datos.
   * @param credentials - Correo electrónico del usuario.
   * @param password - Contraseña del usuario.
   * @returns Información sobre el resultado de la operación.
   */
    async loginUser(credentials: string, password: string): Promise<any> {
      try {
        const user = await this.usuariosRepository
          .createQueryBuilder('users')
          .where('users.usuario = :credentials', { credentials })
          .getOne();
  
        if (!user) {
          return ResponseUtil.error(
            404,
            'Usuario no encontrado'
          );
        }
  
        const isPasswordValid = await bcrypt.compare(password, user.password);
  
        if (!isPasswordValid) {
          return ResponseUtil.error(
            401,
            'Contraseña incorrecta'
          );
        }
  
        // Generar un token de acceso
        const accessToken = jwt.sign({ userId: user.id, key: 'poseidon-gasco.9010' }, 'poseidon', { expiresIn: '1h' });
  
        return ResponseUtil.success(
          200,
          'Inicio de sesión exitoso',
          { user, accessToken } // Incluye el token en la respuesta
        );
  
      } catch (error) {
        console.log(error);
        
        return ResponseUtil.error(
          500,
          'Error al iniciar sesión',
        );
      }
    }
}

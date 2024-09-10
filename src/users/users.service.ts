import { Injectable, NotFoundException } from '@nestjs/common';
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
  ) { }

  async createUser(userData: User): Promise<any> {
    try {
      if (userData) {
        console.log(userData);
        // Verificar si ya existe un usuario con el numero de identificación
        const existingUser = await this.usuariosRepository
          .createQueryBuilder('users')
          .where('users.identificacion = :identificacion', { identificacion: userData.identificacion })
          .getOne();

        if (existingUser) {
          return ResponseUtil.error(400, 'El numero de identificación ya esta registrado');
        }

        const hashedPassword = await bcrypt.hash(userData.password, 1);

        const newUser = this.usuariosRepository.create({
          ...userData,
          password: hashedPassword,
          id_estado: 1,
          flag: "N",
        });

        const createdUser = await this.usuariosRepository.save(newUser);

        if (createdUser) {
          return ResponseUtil.success(
            200,
            'Usuario creado exitosamente',
            createdUser
          );
        } else {
          return ResponseUtil.error(
            500,
            'Ha ocurrido un problema al crear el usuario'
          );
        }
      }
    } catch (error) {
      console.log(error);
      return ResponseUtil.error(
        500,
        'Error al crear el usuario',
        error.message
        );

      
    }
  }

  async findOne(id: string): Promise<any> {
    try {
      const user = await this.usuariosRepository
        .createQueryBuilder('users')
        .where('users.id = :id', { id })
        .getOne();

      if (user) {
        return ResponseUtil.success(
          200,
          'Usuario encontrado',
          user
        );
      } else {
        return ResponseUtil.error(
          404,
          'Usuario no encontrado'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener el usuario'
      );
    }
  }

  async update(id, userData) {
    try {
      const existingUser = await this.usuariosRepository.findOne({
        where: { id },
      });

      if (!existingUser) {
        return ResponseUtil.error(
          400,
          'Usuario no encontrado'
        );
      }

      const updatedUser = await this.usuariosRepository.save({
        ...existingUser,
        ...userData,
      });

      return ResponseUtil.success(
        200,
        'Usuario actualizado exitosamente',
        updatedUser
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        return ResponseUtil.error(
          404,
          'Usuario no encontrado'
        );
      }
      return ResponseUtil.error(
        500,
        'Error al actualizar el Usuario'
      );
    }
  }

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
      const accessToken = jwt.sign({ userId: user.id, key: 'fenix-montagas.9010' }, 'fenix', { expiresIn: '1h' });

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

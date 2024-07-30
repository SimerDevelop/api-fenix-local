import { Injectable, NotFoundException } from '@nestjs/common';
import { Nif } from './entities/nif.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResponseUtil } from 'src/utils/response.util';

@Injectable()
export class NifService {

  constructor(
    @InjectRepository(Nif) private nifRepository: Repository<Nif>,
  ) { }

  async createNIF(nifData: Nif): Promise<any> {
    try {
      if (nifData) {
        // Validar y corregir el formato de la fecha
        const dateRegex = /^\d{4}[-/]\d{2}[-/]\d{2}$/;
        if (!dateRegex.test(nifData.fecha_mtto)) {
          return ResponseUtil.error(400, 'El formato de la fecha es inválido. Debe ser yyyy-mm-dd.');
        }
        nifData.fecha_mtto = nifData.fecha_mtto.replace(/\//g, '-');

        // Validar el campo nifData.nif
        const nifRegex = /^[^\s,]{9,}$/;
        if (!nifRegex.test(nifData.nif)) {
          return ResponseUtil.error(400, 'El campo NIF es inválido.');
        }

        const existingNif = await this.nifRepository
          .createQueryBuilder('cilindros')
          .where('cilindros.nif = :nif', { nif: nifData.nif })
          .getOne();

        if (existingNif) {
          const updatedNif = await this.nifRepository.save({
            ...existingNif,
            ...nifData,
          });

          return ResponseUtil.success(
            200,
            'NIF actualizado exitosamente',
            updatedNif
          );
        }

        const newNif = this.nifRepository.create({
          ...nifData,
        });

        const createdNif = await this.nifRepository.save(newNif);

        if (createdNif) {
          return ResponseUtil.success(
            200,
            'NIF creado exitosamente',
            createdNif
          );
        } else {
          return ResponseUtil.error(
            500,
            'Ha ocurrido un problema al crear el NIF'
          );
        }
      }
    } catch (error) {
      console.log(error);
      return ResponseUtil.error(
        500,
        'Error al crear el NIF',
        error.message
      );
    }
  }

  async findOne(nifData: string): Promise<any> {
    try {
      const nif = await this.nifRepository
        .createQueryBuilder('cilindros')
        .where('cilindros.nif = :nif', { nif: nifData })
        .getOne();

      if (nif) {
        return ResponseUtil.success(
          200,
          'NIF encontrado',
          nif
        );
      } else {
        return ResponseUtil.error(
          404,
          'NIF no encontrado'
        );
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener el NIF'
      );
    }
  }

  async update(id, nifData) {
    try {
      const existingNif = await this.nifRepository.findOne({
        where: { id },
      });

      // Validar el campo nifData.nif
      const nifRegex = /^[^\s,]{9,}$/;
      if (!nifRegex.test(nifData.nif)) {
        return ResponseUtil.error(400, 'El campo NIF es inválido.');
      }

      if (!existingNif) {
        return ResponseUtil.error(
          400,
          'NIF no encontrado'
        );
      }

      const updatedNif = await this.nifRepository.save({
        ...existingNif,
        ...nifData,
      });

      return ResponseUtil.success(
        200,
        'NIF actualizada exitosamente',
        updatedNif
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        return ResponseUtil.error(
          404,
          'NIF no encontrado'
        );
      }
      return ResponseUtil.error(
        500,
        'Error al actualizar el NIF'
      );
    }
  }


  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  async createMultiple(data: any): Promise<any> {
    const chunkSize = 500;
    const createdNifs = [];

    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize);
      const promises = chunk.map((item: any) => this.createNIF(item));
      const responses = await Promise.all(promises);

      const successfulNifs = responses
        .filter(response => response.statusCode === 200)
        .map(response => response.data.id);

      createdNifs.push(...successfulNifs);
    }

    return ResponseUtil.success(
      200,
      'NIFS creados exitosamente',
      createdNifs
    );
  }

  async validateNif(): Promise<any> {
    try {

      let nif = "078191a70960";
      let flag: boolean = false;

      const data = await this.nifRepository
        .createQueryBuilder('cilindros')
        .where('nif = :nif', { nif })
        .getMany();

      const currentDate = new Date();
      const formattedDate = currentDate.getFullYear() + '-' + String(currentDate.getMonth() + 1).padStart(2, '0') + '-' + String(currentDate.getDate()).padStart(2, '0');

      if (formattedDate > data[0].fecha_mtto) {
        flag = true;
      }

      if (data.length < 1) {
        return ResponseUtil.error(
          400,
          'Datos no encontrados',
        );

      } else {
        return ResponseUtil.success(
          200,
          'Periodo de prueba',
          flag
        );
      }

    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener los Datos'
      );
    }
  }
}

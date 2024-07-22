import { Injectable } from '@nestjs/common';
import { Nif } from './entities/nif.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResponseUtil } from 'src/utils/response.util';

@Injectable()
export class NifService {

  constructor(
    @InjectRepository(Nif) private nifRepository: Repository<Nif>,
  ) { }

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

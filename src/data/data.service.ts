import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Data } from './entities/data.entity';
import { Repository } from 'typeorm';
import { ResponseUtil } from 'src/utils/response.util';
import * as moment from 'moment-timezone';

@Injectable()
export class DataService {

  constructor(
    @InjectRepository(Data) private dataRepository: Repository<Data>,
  ) { }

  async findAll(): Promise<any> {
    try {
      const data = await this.dataRepository
        .createQueryBuilder('datos')
        .getMany();

      const formattedData = data.map(item => ({
        ...item,
        fecha: moment.tz(item.fecha, 'America/Bogota').format('YYYY-MM-DD HH:mm:ss')
      }));

      if (formattedData.length < 1) {
        return ResponseUtil.error(
          400,
          'Datos no encontrados',
        );
      } else {
        return ResponseUtil.success(
          200,
          'Datos encontrados',
          formattedData
        );
      }

    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener los Datos'
      );
    }
  }

  async generateCsvbyDate(billData: any) {
    try {
      console.log('billData', billData);

      const startDateTime = billData.start + ' ' + billData.time_start;
      const endDateTime = billData.end + ' ' + billData.time_end;

      console.log( 'startDateTime', startDateTime);
      console.log('endDateTime', endDateTime);
    
      const data = await this.dataRepository
        .createQueryBuilder('datos')
        .where("fecha >= :startDateTime", { startDateTime })
        .andWhere("fecha <= :endDateTime", { endDateTime })
        .getMany();

      data.forEach(item => {
        if (item.masa_aplicada < 0) {
          item.masa_aplicada = 0;
        }

        switch (item.estado) {
          case 'O2':
            item.estado = 'Éxito';
            break;
          case 'O3':
            item.estado = 'Fracaso';
            break;
          case 'O4':
            item.estado = 'Fuera de rango';
            break;
          case 'O5':
            item.estado = 'Capacidad no existe';
            break;
          case 'O6':
            item.estado = 'Cilindro presurizado';
            break;
          case 'O7':
            item.estado = 'Mantenimiento';
            break;
        }
      });

      const totalMasaAplicada = parseFloat((data.reduce((sum, item) => sum + item.masa_aplicada, 0)).toFixed(2));

      const formattedData = data.map(item => ({
        ...item,
        fecha: moment.tz(item.fecha, 'America/Bogota').format('YYYY-MM-DD HH:mm:ss')
      }));

      const records = formattedData.map(data => ({
        id: data.id,
        admin: data.admin,
        id_admin: data.id_admin,
        operario: data.operario,
        id_operario: data.id_operario,
        id_bascula: data.id_bascula,
        fecha: data.fecha,
        nif: data.nif,
        capacidad: data.capacidad,
        tara: data.tara,
        peso_inicial: data.peso_inicial,
        peso_final: data.peso_final,
        masa_aplicada: data.masa_aplicada,
        estado: data.estado,
        sucursal: data.sucursal,
      }))

      const headers = [
        'Id',
        'Admin',
        'Id_admin',
        'Operario',
        'Id_operario',
        'Id_bascula',
        'Fecha',
        'Nif',
        'Capacidad',
        'Tara',
        'Peso_inicial',
        'Peso_final',
        'Masa_aplicada' + ' (Total: ' + totalMasaAplicada + ')',
        'Estado',
        'Sucursal',
      ];

      if (records.length < 1) {
        return ResponseUtil.error(400, 'No hay datos para generar el csv')
      }

      console.log('Datos descargados correctamente' + ' ' + records.length + ' ' + 'registros');
      return ResponseUtil.success(200, 'Datos csv generados correctamente', { headers, records, totalMasaAplicada })

    } catch (error) {
      console.error(error);
      return ResponseUtil.error(400, 'Error al generar el csv', error)
    }
  }

}

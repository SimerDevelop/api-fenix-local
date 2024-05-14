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

      const startDateTime = billData.start + 'T' + billData.time_start + '.00Z';
      const endDateTime = billData.end + 'T' + billData.time_end + '.00Z';

      console.log('startDateTime', startDateTime);
      console.log('endDateTime', endDateTime);

      const serverTime = moment().format();
      console.log('Server time:', serverTime);

      // const skip = (billData.page - 1) * billData.limit;

      const data = await this.dataRepository
        .createQueryBuilder('datos')
        .where("fecha >= :startDateTime", { startDateTime })
        .andWhere("fecha <= :endDateTime", { endDateTime })
        // .skip(skip)
        // .take(billData.limit)
        .getMany();

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
        'Masa_aplicada',
        'Estado',
        'Sucursal',
      ];

      if (records.length < 1) {
        return ResponseUtil.error(400, 'No hay datos para generar el csv')
      }

      console.log('records', records);

      return ResponseUtil.success(200, 'Datos csv generados correctamente', { headers, records })

    } catch (error) {
      console.error(error);
      return ResponseUtil.error(400, 'Error al generar el csv', error)
    }
  }

  // async generateCsvbyDate(billData: any) {
  //   try {
  //     console.log('billData', billData);

  //     const startDateTime = billData.start + 'T' + billData.time_start + '.00Z';
  //     const endDateTime = billData.end + 'T' + billData.time_end + '.00Z';

  //     console.log('startDateTime', startDateTime);
  //     console.log('endDateTime', endDateTime);
  //     //console.log('Server time:', new Date().toISOString());

  //     const serverTime = moment().format();
  //     console.log('Server time:', serverTime);

  //     const data = await this.dataRepository
  //       .createQueryBuilder('datos')
  //       .where("fecha >= :startDateTime", { startDateTime })
  //       .andWhere("fecha <= :endDateTime", { endDateTime })
  //       .getMany();

  //     const formattedData = data.map(item => ({
  //       ...item,
  //       fecha: moment.tz(item.fecha, 'America/Bogota').format('YYYY-MM-DD HH:mm:ss')
  //     }));

  //     const records = formattedData.map(data => ({
  //       id: data.id,
  //       admin: data.admin,
  //       id_admin: data.id_admin,
  //       operario: data.operario,
  //       id_operario: data.id_operario,
  //       id_bascula: data.id_bascula,
  //       fecha: data.fecha,
  //       nif: data.nif,
  //       capacidad: data.capacidad,
  //       tara: data.tara,
  //       peso_inicial: data.peso_inicial,
  //       peso_final: data.peso_final,
  //       masa_aplicada: data.masa_aplicada,
  //       estado: data.estado,
  //       sucursal: data.sucursal,
  //     }))

  //     const headers = [
  //       'Id',
  //       'Admin',
  //       'Id_admin',
  //       'Operario',
  //       'Id_operario',
  //       'Id_bascula',
  //       'Fecha',
  //       'Nif',
  //       'Capacidad',
  //       'Tara',
  //       'Peso_inicial',
  //       'Peso_final',
  //       'Masa_aplicada',
  //       'Estado',
  //       'Sucursal',
  //     ];

  //     if (records.length < 1) {
  //       return ResponseUtil.error(400, 'No hay datos para generar el csv')
  //     }

  //     console.log('records', records);

  //     return ResponseUtil.success(200, 'Datos csv generados correctamente', { headers, records })

  //   } catch (error) {
  //     console.error(error);
  //     return ResponseUtil.error(400, 'Error al generar el csv', error)
  //   }
  // }

}

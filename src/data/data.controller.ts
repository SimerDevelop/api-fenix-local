import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DataService } from './data.service';
import { Data } from './entities/data.entity';

@Controller('data')
export class DataController {
  constructor(private readonly dataService: DataService) { }

  @Get('all')
  async findAll(): Promise<Data[]> {
    return this.dataService.findAll();
  }

  @Post('generateCsvbyDate')
  async generateCsvbyDate(@Body() billData: any): Promise<any> {
    return this.dataService.generateCsvbyDate(billData);
  }

}

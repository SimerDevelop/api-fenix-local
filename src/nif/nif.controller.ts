import { Controller, Get, Post, Body, Put, Param } from '@nestjs/common';
import { NifService } from './nif.service';
import { Nif } from './entities/nif.entity';

@Controller('nif')
export class NifController {
  constructor(private readonly nifService: NifService) {}

  @Post('create')
  async createNIF(@Body() nifData: Nif): Promise<Nif> {
    return this.nifService.createNIF(nifData);
  }

  @Get('getById/:id')
  async findOne(@Param('id') id: string): Promise<any> {
    return this.nifService.findOne(id);
  }

  @Put('update/:id')
  async update(@Param('id') id: string, @Body() nifData: Nif): Promise<any> {
    return this.nifService.update(id, nifData);
  }

  @Get('validator')
  async validateNif(): Promise<Nif[]> {
    return this.nifService.validateNif();
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  @Post('createMultiple')
  async createMultiple(@Body() nifData: Nif): Promise<Nif> {
      return this.nifService.createMultiple(nifData);
  }

}

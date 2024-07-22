import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NifService } from './nif.service';
import { Nif } from './entities/nif.entity';

@Controller('nif')
export class NifController {
  constructor(private readonly nifService: NifService) {}

  @Get('validator')
  async validateNif(): Promise<Nif[]> {
    return this.nifService.validateNif();
  }

}

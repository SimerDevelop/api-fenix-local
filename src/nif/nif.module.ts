import { Module } from '@nestjs/common';
import { NifService } from './nif.service';
import { NifController } from './nif.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nif } from './entities/nif.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Nif]), // Importar si se utiliza TypeORM
  ],
  controllers: [NifController],
  providers: [NifService],
})
export class NifModule {}

import { Module } from '@nestjs/common';
import { DataService } from './data.service';
import { DataController } from './data.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Data } from './entities/data.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Data]), // Importar si se utiliza TypeORM
  ],
  controllers: [DataController],
  providers: [DataService],
})
export class DataModule {}

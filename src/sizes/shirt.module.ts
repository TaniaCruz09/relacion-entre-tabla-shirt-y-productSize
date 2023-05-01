import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shirt } from './entities/shirts.entity';
import { ProductSize } from './entities/productSize.entity';
import { ShirtController } from './shirt.controller';
import { ShirtService } from './shirt.service';

@Module({
  imports: [TypeOrmModule.forFeature([Shirt, ProductSize])],
  controllers: [ShirtController],
  providers: [ShirtService],
})
export class SizesModule {}

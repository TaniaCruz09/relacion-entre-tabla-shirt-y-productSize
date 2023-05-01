import {
  Body,
  Controller,
  ParseUUIDPipe,
  Post,
  Delete,
  Get,
  Param,
  Patch,
} from '@nestjs/common';
import { CreateProductDTO } from './dto/product.dto';
import { ProductService } from './products.service';

@Controller('productos')
export class ProductsController {
  constructor(private readonly productServiceRepo: ProductService) {}

  //metodo para crear un producto
  @Post()
  create(@Body() productDTO: CreateProductDTO) {
    return this.productServiceRepo.create(productDTO);
  }

  //metodo para visualizar todos los porductos
  @Get()
  findAll() {
    return this.productServiceRepo.findAll();
  }

  //metodo para visualizar un producto en especifico
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productServiceRepo.findOne(id);
  }

  //Remover un producto especifico
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productServiceRepo.remove(id);
  }

  //Actualizar un producto especifico
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDTO: CreateProductDTO,
  ) {
    return this.productServiceRepo.update(id, updateProductDTO);
  }
}

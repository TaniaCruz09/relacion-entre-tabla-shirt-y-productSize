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
import { ShirtService } from './shirt.service';
import { CreateShirtDTO } from './dto/shirts.dto';

@Controller('camisa')
export class ShirtController {
  constructor(private readonly ShirtServiceRepo: ShirtService) {}

  //metodo para crear una camisa
  @Post()
  create(@Body() shirtDTO: CreateShirtDTO) {
    return this.ShirtServiceRepo.create(shirtDTO);
  }

  //metodo para visualizar todos las camisas
  @Get()
  findAll() {
    return this.ShirtServiceRepo.findAll();
  }

  //metodo para visualizar una camisa en especifico
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ShirtServiceRepo.findOne(id);
  }

  //Remover una camisa especifico
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.ShirtServiceRepo.remove(id);
  }

  //Actualizar una camisa en especifico
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateShirtDTO: CreateShirtDTO,
  ) {
    return this.ShirtServiceRepo.update(id, updateShirtDTO);
  }
}

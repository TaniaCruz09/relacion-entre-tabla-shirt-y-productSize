import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Shirt } from './entities/shirts.entity';
import { ProductSize } from './entities/productSize.entity';
import { CreateShirtDTO } from './dto/shirts.dto';

@Injectable()
export class ShirtService {
  constructor(
    @InjectRepository(Shirt)
    private readonly shirtRepository: Repository<Shirt>,

    @InjectRepository(ProductSize)
    private readonly sizeRepository: Repository<ProductSize>,
    private readonly dataSource: DataSource,
  ) {}

  async create(shirtDTO: CreateShirtDTO) {
    const { sizes = [], ...detalleShirt } = shirtDTO;
    const shirt = this.shirtRepository.create({
      ...detalleShirt,
      sizes: sizes.map((size) => this.sizeRepository.create({ sizes: size })),
    });
    await this.shirtRepository.save(shirt);
    return shirt;
  }

  //metodo para visualizar todos los productos
  findAll() {
    return this.shirtRepository.find({
      relations: ['sizes'],
    });
  }

  //metodo para visualizar un producto en especifico
  findOne(id: string) {
    return this.shirtRepository.findOneBy({ id });
  }

  //Remover un producto especifico
  async remove(id: string) {
    const product = await this.findOne(id);
    await this.shirtRepository.remove(product);
    return 'Producto eliminado satisfactoriamente';
  }

  async update(id: string, cambios: CreateShirtDTO) {
    const { sizes, ...updateAll } = cambios;
    const shirt = await this.shirtRepository.preload({
      id: id,
      ...updateAll,
    });

    //Consultar a la base de datos para modificarla
    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    //si vienen nuevas imagenes que se eliminen las anteriores
    if (sizes) {
      await queryRunner.manager.delete(ProductSize, { product: id });

      shirt.sizes = sizes.map((size) =>
        this.sizeRepository.create({ sizes: size }),
      );
    } else {
      shirt.sizes = await this.sizeRepository.findBy({ shirt: { id } });
    }

    await queryRunner.manager.save(shirt);
    await queryRunner.commitTransaction();
    await queryRunner.release();
    return shirt;
  }
}

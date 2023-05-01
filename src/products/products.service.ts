import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateProductDTO } from './dto/product.dto';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-image.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly imageRepository: Repository<ProductImage>,
    private readonly dataSource: DataSource,
  ) {}

  //metodo para crear un producto
  // async create(productDTO: CreateProductDTO) {
  //   const product = this.productRepository.create(productDTO);
  //   await this.productRepository.save(product);

  //   return product;
  // }
  async create(productDTO: CreateProductDTO) {
    const { images = [], ...detalleProducto } = productDTO;
    const product = this.productRepository.create({
      ...detalleProducto,
      images: images.map((image) =>
        this.imageRepository.create({ url: image }),
      ),
    });
    await this.productRepository.save(product);
    return product;
  }

  //metodo para visualizar todos los productos
  findAll() {
    return this.productRepository.find({
      relations: ['images'],
    });
  }

  //metodo para visualizar un producto en especifico
  findOne(id: string) {
    return this.productRepository.findOneBy({ id });
  }

  //Remover un producto especifico
  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
    return 'Producto eliminado satisfactoriamente';
  }

  //Actualizar un producto especifico
  // async update(id: string, cambios: CreateProductDTO) {
  //   const findProduct = await this.findOne(id);
  //   const updatedProduct = await this.productRepository.merge(
  //     findProduct,
  //     cambios,
  //   );
  //   return this.productRepository.save(updatedProduct);
  // }
  async update(id: string, cambios: CreateProductDTO) {
    const { images, ...updateAll } = cambios;
    const product = await this.productRepository.preload({
      id: id,
      ...updateAll,
    });

    //Consultar a la base de datos para modificarla
    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    //si vienen nuevas imagenes que se eliminen las anteriores
    if (images) {
      await queryRunner.manager.delete(ProductImage, { product: id });

      product.images = images.map((image) =>
        this.imageRepository.create({ url: image }),
      );
    } else {
      product.images = await this.imageRepository.findBy({ product: { id } });
    }

    await queryRunner.manager.save(product);
    await queryRunner.commitTransaction();
    await queryRunner.release();
    return product;
  }
}

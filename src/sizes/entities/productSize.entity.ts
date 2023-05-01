import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Shirt } from './shirts.entity';

@Entity()
export class ProductSize {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sizes: string;

  //Muchas tallas pueden ser para una camisa
  @ManyToOne(() => Shirt, (shirt) => shirt.sizes, {
    onDelete: 'CASCADE',
  })
  shirt: Shirt;
}

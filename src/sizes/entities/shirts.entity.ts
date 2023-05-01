import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductSize } from './productSize.entity';

@Entity()
export class Shirt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  bold: string;

  @Column({ type: 'text' })
  color: string;

  @Column({ type: 'numeric' })
  price: number;

  //una camis apuede tener varias tallas
  @OneToMany(() => ProductSize, (productSize) => productSize.shirt, {
    cascade: true,
    eager: true,
  })
  sizes?: ProductSize[];
}

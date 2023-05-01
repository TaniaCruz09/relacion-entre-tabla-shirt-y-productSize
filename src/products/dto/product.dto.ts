import {
  IsString,
  IsNotEmpty,
  IsNumber,
  MinLength,
  IsArray,
  IsOptional,
} from 'class-validator';

export class CreateProductDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  titulo: string;

  @IsNumber()
  precio: number;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[];
}

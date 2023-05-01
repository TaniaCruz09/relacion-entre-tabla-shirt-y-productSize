import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsOptional,
} from 'class-validator';

export class CreateShirtDTO {
  @IsString()
  @IsNotEmpty()
  bold: string;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  sizes?: string[];
}

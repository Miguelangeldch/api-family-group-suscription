import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateGroupAndOwnerDto {
  @IsNotEmpty()
  @IsNumber()
  carnet_identidad: number;

  @IsNotEmpty()
  @IsString()
  nombres: string;

  @IsNotEmpty()
  @IsString()
  apellido_paterno: string;

  @IsNotEmpty()
  @IsString()
  apellido_materno: string;

  @IsString()
  complemento: string;

  @IsString()
  extension: string;

  @IsString()
  fecha_nac: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsNumber()
  telefono: number;
}

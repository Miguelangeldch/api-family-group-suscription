import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { FamilyRelationship } from '../entity/family-relationship.enum';

export class CreateFamilyMemberDto {
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
  extension: string;

  @IsString()
  complemento: string;

  @IsString()
  fecha_nac: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsNumber()
  telefono: number;

  @IsNotEmpty()
  @IsString()
  parentesco: FamilyRelationship;

  @IsNotEmpty()
  @IsString()
  codigo_familia;
}

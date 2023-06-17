import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFamilyGroupDto {
  @IsNotEmpty()
  @IsString()
  codigo_familia: string;

  @IsNotEmpty()
  @IsString()
  nombre_grupo: string;
}

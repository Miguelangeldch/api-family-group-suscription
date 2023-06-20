import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetGroupFilter {
  @IsOptional()
  @IsString()
  carnetIdentidad: string;

  @IsOptional()
  @IsString()
  codigoFamilia: string;
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query
} from '@nestjs/common';
import { FamilyGroupService } from './family_group.service';
import { FamilyGroup } from './entity/family-group.entity';
import { CreateGroupAndOwnerDto } from './dto/create-group-and-owner.dto';
import { GetGroupFilter } from './dto/get-group-filter.dto';

@Controller('family-group')
export class FamilyGroupController {
  constructor(private familyGroupService: FamilyGroupService) {}

  //  CREAR NUEVO GRUPO DE FAMILIA Y MIEMBRO TITULAR
  @Post()
  createFamilyGroup(
    @Body() createGroupAndOwnerDto: CreateGroupAndOwnerDto
  ): Promise<FamilyGroup> {
    return this.familyGroupService.createGroupAndOwner(createGroupAndOwnerDto);
  }

  // CONSULTAR GRUPO POR ID Y CI OPCIONALES (ROL ADMIN) - DEVUELVE TODA LA INFORMACIÒN DEL GRUPO Y MIEMBROS
  @Get()
  getGroup(@Query() getGroupFilter: GetGroupFilter) {
    return this.familyGroupService.getGroupByFilter(getGroupFilter);
  }

  // CONSULTAR EL NOMBRE DEL GRUPO POR CODIGO_FAMILIA
  @Get(':codigoFamilia')
  getGroupNameBycodigoFamilia(@Param('codigoFamilia') codigoFamilia: string) {
    return this.familyGroupService.getGroupNameById(codigoFamilia);
  }

  // CONSULTAR GRUPO POR ID Y CI OBLIGATORIOS - DEVUELVE TODA LA INFORMACIÒN DEL GRUPO Y MIEMBROS
  @Get(':codigoFamilia/:carnetIdentidad')
  getGroupByIdAndCI(
    @Param('codigoFamilia') codigoFamilia: string,
    @Param('carnetIdentidad') carnetIdentidad: number
  ) {
    return this.familyGroupService.getGroupByIdAndCI(
      codigoFamilia,
      carnetIdentidad
    );
  }

  // BORRAR GRUPO Y TODOS LOS MIEMBROS ASOCIADOS POR ID - SE ELIMINAN LOS USUARIOS PRIMERO DEBIDO A LA RELACIÓN ENTRE TABLAS
  @Delete(':codigoFamilia')
  deleteGroupBycodigoFamilia(@Param('codigoFamilia') codigoFamilia: string) {
    return this.familyGroupService.deleteGroupById(codigoFamilia);
  }
}

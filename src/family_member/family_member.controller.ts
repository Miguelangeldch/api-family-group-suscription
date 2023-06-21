import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { FamilyMemberService } from './family_member.service';
import { CreateFamilyMemberDto } from './dto/create-member.dto';
import { FamilyMember } from './entity/family-member.entity';
import { UpdateMemberDto } from './dto/update-member.dto';

@Controller('family-member')
export class FamilyMemberController {
  constructor(private familyMemberService: FamilyMemberService) {}

  // CREAR MIEMBRO NO TITULAR, ROL DE USUARIO
  @Post('create')
  createFamilyMember(
    @Body() createFamilyMemberDto: CreateFamilyMemberDto
  ): Promise<FamilyMember> {
    return this.familyMemberService.createFamilyMember(createFamilyMemberDto);
  }
  // ELIMINAR UNO O MAS USUARIOS POR CARNET DE IDENTIDAD
  @Delete()
  deleteFamilyMembers(@Body('carnetIdentidad') carnetIdentidad: number[]) {
    return this.familyMemberService.deleteMultipleById(carnetIdentidad);
  }

  // ACTUALIZAR TITULARIDAD DEL GRUPO Y PARENTESCO
  @Patch(':carnetIdentidad/relationship')
  updateRelationshipMember(
    @Param('carnetIdentidad') carnetIdentidad: number,
    @Body() updateMemberDto: UpdateMemberDto
  ) {
    return this.familyMemberService.updateMember(
      carnetIdentidad,
      updateMemberDto
    );
  }
}

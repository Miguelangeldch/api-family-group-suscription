import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FamilyGroupService } from './family_group.service';
import { CreateFamilyMemberDto } from 'src/family_member/dto/create-member.dto';
import { FamilyGroup } from './entity/family-group.entity';
import { CreateGroupAndOwnerDto } from './dto/create-group-and-owner.dto';

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

  // CONSULTAR GRUPO POR ID, DEVUELVE LOS MIEMBROS ASOCIADOS
  @Get(':id')
  getGroupById(@Param('id') id: string): Promise<FamilyGroup[]> {
    return this.familyGroupService.getFamilyGroup(id);
  }
}

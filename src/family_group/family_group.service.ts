import {
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { FamilyGroup } from './entity/family-group.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FamilyMember } from 'src/family_member/entity/family-member.entity';
import { v4 as uuid } from 'uuid';
import { GroupOwner } from 'src/family_member/entity/family-group-owner.enum';
import { CreateGroupAndOwnerDto } from './dto/create-group-and-owner.dto';
import { FamilyRelationship } from 'src/family_member/entity/family-relationship.enum';

@Injectable()
export class FamilyGroupService {
  constructor(
    @InjectRepository(FamilyGroup)
    private familyGroupRepository: Repository<FamilyGroup>,
    @InjectRepository(FamilyMember)
    private familyMemberRepository: Repository<FamilyMember>
  ) {}

  async createGroupAndOwner(
    createGroupAndOwnerDto: CreateGroupAndOwnerDto
  ): Promise<FamilyGroup> {
    const { apellido_paterno, carnet_identidad } = createGroupAndOwnerDto;
    const codigo_familia = uuid();

    const findMember = await this.familyMemberRepository.findOne({
      where: { carnet_identidad }
    });

    if (findMember) {
      throw new ConflictException(
        `El carnet de identidad ya se encuentra registrado`
      );
    }

    const group = this.familyGroupRepository.create({
      codigo_familia,
      nombre_grupo: apellido_paterno
    });

    const member = this.familyMemberRepository.create({
      ...createGroupAndOwnerDto,
      parentesco: FamilyRelationship.PROPIETARIO,
      miembro_titular: GroupOwner.SI,
      id_: codigo_familia
    });

    await this.familyGroupRepository.save(group);
    await this.familyMemberRepository.save(member);
    return group;
  }

  async getFamilyGroup(id: string) {
    const group = this.familyGroupRepository.find({
      where: {
        codigo_familia: id
      }
    });

    if (!group) {
      throw new NotFoundException('El grupo no se encuentra registrado');
    }

    if (group['miembros'].length === 2) {
      throw new ConflictException(
        `El grupo ha alcanzado el maximo de registros permitidos`
      );
    }

    return group;
  }
}

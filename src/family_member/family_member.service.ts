import {
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FamilyMember } from './entity/family-member.entity';
import { CreateFamilyMemberDto } from './dto/create-member.dto';
import { Repository } from 'typeorm';
import { GroupOwner } from './entity/family-group-owner.enum';
import { FamilyGroup } from 'src/family_group/entity/family-group.entity';

@Injectable()
export class FamilyMemberService {
  constructor(
    @InjectRepository(FamilyGroup)
    private familyGroupRepository: Repository<FamilyGroup>,
    @InjectRepository(FamilyMember)
    private familyMemberRepository: Repository<FamilyMember>
  ) {}

  async createFamilyMember(
    createFamilyMemberDto: CreateFamilyMemberDto
  ): Promise<FamilyMember> {
    const { carnet_identidad, codigo_familia } = createFamilyMemberDto;

    const group = await this.familyGroupRepository.findOne({
      where: {
        codigo_familia
      }
    });

    let member = await this.familyMemberRepository.findOne({
      where: { carnet_identidad }
    });

    if (!member) {
      member = this.familyMemberRepository.create({
        miembro_titular: GroupOwner.NO,
        ...createFamilyMemberDto,
        id_: group
      });

      try {
        await this.familyMemberRepository.save(member);
        return member;
      } catch (error) {
        throw new Error(error.message);
      }
    } else {
      throw new ConflictException(
        `El carnet de identidad ya se encuentra registrado`
      );
    }
  }
}

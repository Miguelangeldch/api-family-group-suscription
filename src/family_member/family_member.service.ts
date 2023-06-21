import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FamilyMember } from './entity/family-member.entity';
import { CreateFamilyMemberDto } from './dto/create-member.dto';
import { Repository } from 'typeorm';
import { GroupOwner } from './entity/family-group-owner.enum';
import { FamilyGroup } from 'src/family_group/entity/family-group.entity';
import { FamilyGroupService } from 'src/family_group/family_group.service';
import { UpdateMemberDto } from './dto/update-member.dto';
import { FamilyRelationship } from './entity/family-relationship.enum';

@Injectable()
export class FamilyMemberService {
  constructor(
    @InjectRepository(FamilyGroup)
    private familyGroupRepository: Repository<FamilyGroup>,
    @InjectRepository(FamilyMember)
    private familyMemberRepository: Repository<FamilyMember>
  ) {}

  // CREAR MIEMBRO NO TITULAR, ROL DE USUARIO
  async createFamilyMember(
    createFamilyMemberDto: CreateFamilyMemberDto
  ): Promise<FamilyMember> {
    const { carnet_identidad, codigo_familia } = createFamilyMemberDto;

    const group = await this.familyGroupRepository.findOne({
      where: {
        codigo_familia
      }
    });

    if (!group) {
      throw new NotFoundException(
        'El codigo de familia es incorrecto o el grupo no existe'
      );
    }

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

  // OBTENER DATOS DE MIEMBRO POR CARNET DE IDENTIDAD
  async getMemberByCI(carnetIdentidad: number): Promise<FamilyMember> {
    const member = await this.familyMemberRepository.findOne({
      where: {
        carnet_identidad: carnetIdentidad
      }
    });

    if (!member) {
      throw new NotFoundException('Verifique los datos suministrados');
    }

    return member;
  }

  // ELIMINAR UNO O MAS USUARIOS POR CARNET DE IDENTIDAD
  async deleteMultipleById(carnetIdentidad: number[]): Promise<void> {
    try {
      await this.familyMemberRepository
        .createQueryBuilder()
        .delete()
        .where('carnet_identidad IN (:...carnetIdentidad)', { carnetIdentidad })
        .execute()
        .then((result) => {
          if (result.affected !== 0) {
            throw new HttpException('Usuario(s) eliminado correctamente', 200);
          }
        });
    } catch (error) {
      throw new HttpException(error.message, error.code);
    }
  }

  // ACTUALIZAR TITULARIDAD DEL GRUPO Y PARENTESCO
  async updateMember(
    carnetIdentidad: number,
    updateMember: UpdateMemberDto
  ): Promise<FamilyMember> {
    const { parentesco } = updateMember;
    const member = await this.getMemberByCI(carnetIdentidad);

    if (parentesco !== FamilyRelationship.PROPIETARIO) {
      member['miembro_titular'] === GroupOwner.NO;
      member['parentesco'] === parentesco;

      await this.familyMemberRepository.save(member);

      return member;
    }

    member['parentesco'] === parentesco;
    await this.familyMemberRepository.save(member);

    return member;
  }
}

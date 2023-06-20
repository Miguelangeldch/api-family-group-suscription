import {
  ConflictException,
  HttpException,
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
import { FamilyMemberService } from 'src/family_member/family_member.service';
import { GetGroupFilter } from './dto/get-group-filter.dto';

@Injectable()
export class FamilyGroupService {
  constructor(
    @InjectRepository(FamilyGroup)
    private familyGroupRepository: Repository<FamilyGroup>,
    @InjectRepository(FamilyMember)
    private familyMemberRepository: Repository<FamilyMember>,
    private familyMemberService: FamilyMemberService
  ) {}

  async _getGroupById(codigoFamilia: string): Promise<FamilyGroup> {
    const group = await this.familyGroupRepository.findOne({
      where: {
        codigo_familia: codigoFamilia
      }
    });

    if (!group) {
      throw new NotFoundException();
    }

    return group;
  }

  //  CREAR NUEVO GRUPO DE FAMILIA Y MIEMBRO TITULAR
  async createGroupAndOwner(
    createGroupAndOwnerDto: CreateGroupAndOwnerDto
  ): Promise<FamilyGroup> {
    const { apellido_paterno, carnet_identidad } = createGroupAndOwnerDto;
    const codigo_familia = uuid();

    const _member = await this.familyMemberRepository.findOne({
      where: { carnet_identidad }
    });

    if (_member) {
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

  // CONSULTAR EL NOMBRE DEL GRUPO POR CODIGO_FAMILIA
  async getGroupNameById(codigoFamilia: string) {
    const group = await this._getGroupById(codigoFamilia);
    if (group['miembros'].length === 3) {
      throw new ConflictException(
        `El grupo ha alcanzado el maximo de registros permitidos`
      );
    }
    return {
      nombre_grupo: group['nombre_grupo']
    };
  }

  // CONSULTAR GRUPO POR ID Y CI OBLIGATORIOS - DEVUELVE TODA LA INFORMACIÒN DEL GRUPO Y MIEMBROS
  async getGroupByIdAndCI(
    codigoFamilia: string,
    carnetIdentidad: number
  ): Promise<FamilyGroup> {
    const group = await this._getGroupById(codigoFamilia);
    const user = group['miembros'].find((miembro) => {
      return (
        miembro['carnet_identidad'] === Number(carnetIdentidad) &&
        miembro['miembro_titular'] === 'SI'
      );
    });

    if (user === undefined) {
      throw new NotFoundException('Verifique los datos suministrados');
    }

    return group;
  }

  // CONSULTAR GRUPO POR ID Y CI OPCIONALES (ROL ADMIN) - DEVUELVE TODA LA INFORMACIÒN DEL GRUPO Y MIEMBROS

  async getGroupByFilter(getGroupFilter: GetGroupFilter): Promise<FamilyGroup> {
    const { carnetIdentidad, codigoFamilia } = getGroupFilter;

    if (!carnetIdentidad && !codigoFamilia) throw new NotFoundException();

    if (carnetIdentidad && !codigoFamilia) {
      let group = await this.familyGroupRepository.findOne({
        where: {
          miembros: {
            carnet_identidad: Number(carnetIdentidad)
          }
        }
      });

      if (!group) {
        throw new NotFoundException();
      }

      group = await this._getGroupById(group['codigo_familia']);
      return group;
    }

    const group = this._getGroupById(codigoFamilia);
    return group;
  }

  // BORRAR GRUPO Y TODOS LOS MIEMBROS ASOCIADOS POR ID - SE ELIMINAN LOS USUARIOS PRIMERO DEBIDO A LA RELACIÓN ENTRE TABLAS

  async deleteGroupById(codigoFamilia: string) {
    await this.familyMemberRepository
      .createQueryBuilder()
      .delete()
      .where('id_ = :codigoFamilia', { codigoFamilia })
      .execute()
      .then(async (result) => {
        if (result.affected === 0) {
          throw new NotFoundException(
            `Group with ID ${codigoFamilia} not found`
          );
        } else {
          await this.familyGroupRepository.delete({
            codigo_familia: codigoFamilia
          });
        }
        throw new HttpException(
          `The task ${codigoFamilia} has been deleted`,
          200
        );
      });
  }
}

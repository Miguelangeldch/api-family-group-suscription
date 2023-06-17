import { PrimaryColumn, Column, Entity, ManyToOne } from 'typeorm';
import { FamilyRelationship } from './family-relationship.enum';
import { FamilyGroup } from 'src/family_group/entity/family-group.entity';
import { GroupOwner } from './family-group-owner.enum';

@Entity()
export class FamilyMember {
  @PrimaryColumn()
  carnet_identidad: number;

  @Column()
  nombres: string;

  @Column()
  apellido_paterno: string;

  @Column()
  apellido_materno: string;

  @Column()
  extension: string;

  @Column()
  complemento: string;

  @Column()
  fecha_nac: string;

  @Column()
  email: string;

  @Column()
  telefono: number;

  @Column()
  parentesco: FamilyRelationship;

  @Column()
  miembro_titular: GroupOwner;

  @ManyToOne((_type) => FamilyGroup, (group) => group.miembros, {
    eager: false
  })
  id_: FamilyGroup;
}

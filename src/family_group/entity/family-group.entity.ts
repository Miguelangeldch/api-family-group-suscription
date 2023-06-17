import { FamilyMember } from 'src/family_member/entity/family-member.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class FamilyGroup {
  @PrimaryColumn()
  codigo_familia: string;

  @Column()
  nombre_grupo: string;

  @OneToMany((_type) => FamilyMember, (miembro) => miembro.id_, {
    eager: true
  })
  miembros: FamilyMember[];
}

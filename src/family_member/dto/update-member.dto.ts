import { IsEnum, IsNotEmpty } from 'class-validator';
import { FamilyRelationship } from '../entity/family-relationship.enum';

export class UpdateMemberDto {
  @IsNotEmpty()
  @IsEnum(FamilyRelationship)
  parentesco: FamilyRelationship;
}

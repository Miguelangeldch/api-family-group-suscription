import { Module } from '@nestjs/common';
import { FamilyGroupService } from './family_group.service';
import { FamilyGroupController } from './family_group.controller';
import { FamilyGroup } from './entity/family-group.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FamilyMember } from 'src/family_member/entity/family-member.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([FamilyGroup]),
    TypeOrmModule.forFeature([FamilyMember])
  ],
  providers: [FamilyGroupService],
  controllers: [FamilyGroupController],
  exports: [FamilyGroupService]
})
export class FamilyGroupModule {}

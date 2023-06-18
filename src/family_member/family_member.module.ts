import { Module } from '@nestjs/common';
import { FamilyMemberService } from './family_member.service';
import { FamilyMemberController } from './family_member.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FamilyMember } from './entity/family-member.entity';
import { FamilyGroup } from 'src/family_group/entity/family-group.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([FamilyMember]),
    TypeOrmModule.forFeature([FamilyGroup])
  ],
  controllers: [FamilyMemberController],
  providers: [FamilyMemberService],
  exports: [FamilyMemberService]
})
export class FamilyMemberModule {}

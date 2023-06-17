import { Body, Controller, Post } from '@nestjs/common';
import { FamilyMemberService } from './family_member.service';
import { CreateFamilyMemberDto } from './dto/create-member.dto';
import { FamilyMember } from './entity/family-member.entity';

@Controller('family-member')
export class FamilyMemberController {
  constructor(private familyMemberService: FamilyMemberService) {}

  @Post('create')
  createFamilyMember(
    @Body() createFamilyMemberDto: CreateFamilyMemberDto
  ): Promise<FamilyMember> {
    return this.familyMemberService.createFamilyMember(createFamilyMemberDto);
  }
}

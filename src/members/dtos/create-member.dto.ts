import { MemberRole } from '@/members/entities/member.entity';
import { IsEmail, IsEnum, IsString } from 'class-validator';

export class CreateMemberDto {
  @IsString({
    message: 'O nome deve ser do tipo string',
  })
  name: string;

  @IsEmail(
    { host_whitelist: ['atriajr.com.br'] },
    {
      message: 'O email deve ser do domínio @atriajr.com.br',
    },
  )
  email: string;

  @IsEnum(MemberRole, {
    message:
      'O cargo deve ser um dos seguintes valores: advisor, coordinator, director',
  })
  role: MemberRole;
}

import { IsEnum, IsOptional } from "class-validator"
import { MemberRole } from "@/members/entities/member.entity"

export class ListMembersDto {
  @IsOptional()
  @IsEnum(MemberRole)
  role?: MemberRole
}
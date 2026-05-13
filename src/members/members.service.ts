import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMemberDto } from './dtos/create-member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Member, MemberRole } from './entities/member.entity';
import { Repository } from 'typeorm';
import { StorageService } from '@/storage/storage.service';
import { ListMembersDto } from './dtos/list-members.dto';

@Injectable()
export class MembersService {
    constructor(@InjectRepository(Member) private membersRepository: Repository<Member>, private storageService: StorageService) { }

    async create(body: CreateMemberDto, avatarFile: Express.Multer.File): Promise<Member> {
        const memberAlreadyExists = await this.membersRepository.findOneBy({
            email: body.email
        })

        if (memberAlreadyExists) {
            throw new BadRequestException("Usuário já cadastrado")
        }

        const uploadedAvatar = await this.storageService.uploadFile(avatarFile, "avatars")

        const member = this.membersRepository.create({
            name: body.name,
            email: body.email,
            role: body.role,
            avatarUrl: uploadedAvatar.url
        })

        await this.membersRepository.save(member)

        return member
    }

    async list(filter: ListMembersDto): Promise<Member[]> {
        const filters: Partial<Member> = {}

        if (filter.role) {
            filters.role = filter.role
        }

        const members = await this.membersRepository.find({
            where: filters
        })

        return members
    }

    async findByEmail(email: string): Promise<Member | null> {
        const member = await this.membersRepository.findOneBy({ email })

        return member
    }
}

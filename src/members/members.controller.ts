import { FileSizeValidationPipe } from '@/pipes/file-size-validation/file-size-validation.pipe';
import { Body, Controller, Get, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateMemberDto } from './dtos/create-member.dto';
import { ListMembersDto } from './dtos/list-members.dto';
import { MembersService } from './members.service';

@Controller('members')
export class MembersController {
    constructor(private membersService: MembersService) {}

    @Post()
    @UseInterceptors(FileInterceptor("avatar"))
    create(@Body() body: CreateMemberDto, @UploadedFile(new FileSizeValidationPipe()) avatarFile: Express.Multer.File) {
        return this.membersService.create(body, avatarFile)
    }

    @Get()
    list(@Query() query: ListMembersDto) {
        return this.membersService.list(query)
    }
}

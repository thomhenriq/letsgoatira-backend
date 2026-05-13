import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CreateEventDto } from './dtos/create-event.dto';
import { FileSizeValidationPipe } from '@/pipes/file-size-validation/file-size-validation.pipe';
import { EventsService } from './events.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AddAttendancesDto } from './dtos/add-attendances.dto';

@Controller('events')
export class EventsController {

    constructor(private eventsService: EventsService) { }

    @Post()
    @UseInterceptors(FileInterceptor("coverImage"))
    create(@Body() body: CreateEventDto, @UploadedFile(new FileSizeValidationPipe()) coverImageFile: Express.Multer.File) {
        return this.eventsService.create(body, coverImageFile)
    }

    @Get()
    list() {
        return this.eventsService.list()
    }

    @Get(':id')
    findById(@Param('id') id: string) {
        return this.eventsService.findById(id)
    }

    @Post(":id/attendances")
    addAttendances(@Param('id') id: string, @Body() body: AddAttendancesDto) {
        return this.eventsService.addAttendances(id, body)
    }
}

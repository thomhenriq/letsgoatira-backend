import { FileSizeValidationPipe } from '@/pipes/file-size-validation/file-size-validation.pipe';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { AddAttendancesDto } from './dtos/add-attendances.dto';
import { CreateEventDto } from './dtos/create-event.dto';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('coverImage'))
  create(
    @Body() body: CreateEventDto,
    @UploadedFile(new FileSizeValidationPipe())
    coverImageFile: Express.Multer.File,
  ) {
    return this.eventsService.create(body, coverImageFile);
  }

  @Get()
  list() {
    return this.eventsService.list();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.eventsService.findById(id);
  }

  @Post(':id/attendances')
  addAttendances(@Param('id') id: string, @Body() body: AddAttendancesDto) {
    return this.eventsService.addAttendances(id, body);
  }

  @Post(':id/photos')
  @UseInterceptors(FilesInterceptor('photos'))
  addPhotos(
    @Param('id') id: string,
    @UploadedFiles(new FileSizeValidationPipe())
    photosFiles: Express.Multer.File[],
  ) {
    return this.eventsService.addPhotos(id, photosFiles);
  }

  @Delete(':id/photos/:photoId')
  deletePhoto(@Param('id') eventId: string, @Param('photoId') photoId: string) {
    return this.eventsService.deletePhoto(eventId, photoId);
  }
}

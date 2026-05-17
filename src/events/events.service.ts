import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';
import { StorageService } from '@/storage/storage.service';
import { CreateEventDto } from './dtos/create-event.dto';
import { Attendance } from './entities/attendance.entity';
import { AddAttendancesDto } from './dtos/add-attendances.dto';
import { MembersService } from '@/members/members.service';
import { IAddAttendance } from './interfaces/add-attendance.interface';
import { IUploadFile } from '@/storage/interfaces/upload-file.interface';
import { Photo } from './entities/photo.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,

    @InjectRepository(Location)
    private locationsRepository: Repository<Location>,

    @InjectRepository(Attendance)
    private attendancesRepository: Repository<Attendance>,

    @InjectRepository(Photo)
    private photosRepository: Repository<Photo>,

    private storageService: StorageService,
    private membersService: MembersService,
  ) {}

  async create(
    body: CreateEventDto,
    coverImageFile: Express.Multer.File,
  ): Promise<Event> {
    const uploadedCoverImage = await this.storageService.uploadFile(
      coverImageFile,
      'events/cover',
    );

    const location = this.locationsRepository.create({
      name: body.location.name,
      city: body.location.city,
      country: body.location.country,
      state: body.location.state,
      latitude: body.location.latitude,
      longitude: body.location.longitude,
    });

    const event = this.eventsRepository.create({
      title: body.title,
      description: body.description,
      date: new Date(body.date),
      coverImageUrl: uploadedCoverImage.url,
      location: location,
    });

    await this.eventsRepository.save(event);

    return event;
  }

  async list(): Promise<Event[]> {
    const events = await this.eventsRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.location', 'location')
      .leftJoinAndSelect('event.photos', 'photos')
      .loadRelationCountAndMap('event.attendancesCount', 'event.attendances')
      .getMany();

    return events;
  }

  async findById(id: string): Promise<Event | null> {
    const event = await this.eventsRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.location', 'location')
      .leftJoinAndSelect('event.photos', 'photos')
      .loadRelationCountAndMap('event.attendancesCount', 'event.attendances')
      .where('event.id = :id', { id })
      .getOne();

    return event;
  }

  async addAttendances(
    eventId: string,
    body: AddAttendancesDto,
  ): Promise<IAddAttendance[]> {
    const event = await this.findById(eventId);

    if (!event) {
      throw new BadRequestException('O evento não existe');
    }

    const { emails } = body;

    const attendances: IAddAttendance[] = [];

    for (const email of emails) {
      const member = await this.membersService.findByEmail(email);

      if (!member) {
        attendances.push({
          email,
          message: 'Membro não encontrado',
          success: false,
        });
        continue;
      }

      const attendanceExists = await this.attendancesRepository.findOne({
        where: {
          event: {
            id: event.id,
          },
          member: {
            id: member.id,
          },
        },
        relations: {
          event: true,
          member: true,
        },
      });

      if (attendanceExists) {
        attendances.push({
          email,
          success: false,
          message: 'Presença já registrada',
        });

        continue;
      }

      const attendance = this.attendancesRepository.create({ event, member });

      await this.attendancesRepository.save(attendance);

      attendances.push({
        email,
        success: true,
        message: 'Presença confirmada',
      });
    }

    return attendances;
  }

  async addPhotos(
    eventId: string,
    photosFiles: Express.Multer.File[],
  ): Promise<IUploadFile[]> {
    const event = await this.findById(eventId);

    if (!event) {
      throw new BadRequestException('O evento não existe');
    }

    const uploadedPhotos: IUploadFile[] = [];

    for (const photo of photosFiles) {
      const uploadedPhoto = await this.storageService.uploadFile(
        photo,
        `events/photos/${event.id}`,
      );

      const createdPhoto = this.photosRepository.create({
        event: { id: event.id },
        url: uploadedPhoto.url,
        key: uploadedPhoto.key,
      });

      uploadedPhotos.push(uploadedPhoto);
      await this.photosRepository.save(createdPhoto);
    }

    return uploadedPhotos;
  }

  async deletePhoto(eventId: string, photoId: string): Promise<void> {
    const event = await this.findById(eventId);

    if (!event) {
      throw new BadRequestException('O evento não existe');
    }

    const photo = await this.photosRepository.findOne({
      where: {
        id: photoId,
        event: { id: eventId },
      },
    });

    if (!photo) {
      throw new BadRequestException('Foto não encontrada');
    }

    await this.storageService.deleteFile(photo.key);
    await this.photosRepository.remove(photo);
  }
}

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

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,

    @InjectRepository(Location)
    private locationsRepository: Repository<Location>,

    @InjectRepository(Attendance)
    private attendancesRepository: Repository<Attendance>,

    private storageService: StorageService,
    private membersService: MembersService,
  ) {}

  async create(
    body: CreateEventDto,
    coverImageFile: Express.Multer.File,
  ): Promise<Event> {
    const uploadedCoverImage = await this.storageService.uploadFile(
      coverImageFile,
      'events',
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

    await this.locationsRepository.save(location);
    await this.eventsRepository.save(event);

    return event;
  }

  async list(): Promise<Event[]> {
    const events = await this.eventsRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.location', 'location')
      .loadRelationCountAndMap('event.attendancesCount', 'event.attendances')
      .getMany();

    return events;
  }

  async findById(id: string): Promise<Event | null> {
    const event = await this.eventsRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.location', 'location')
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
}

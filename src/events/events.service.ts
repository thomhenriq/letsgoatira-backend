import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';
import { StorageService } from '@/storage/storage.service';
import { CreateEventDto } from './dtos/create-event.dto';

@Injectable()
export class EventsService {
    constructor(
        @InjectRepository(Event)
        private eventsRepository: Repository<Event>,

        @InjectRepository(Location)
        private locationsRepository: Repository<Location>,

        private storageService: StorageService
    ) { }

    async create(body: CreateEventDto, coverImageFile: Express.Multer.File): Promise<Event> {
        const uploadedCoverImage = await this.storageService.uploadFile(coverImageFile, "events")

        const location = this.locationsRepository.create({
            name: body.location.name,
            city: body.location.city,
            country: body.location.country,
            state: body.location.state,
            latitude: body.location.latitude,
            longitude: body.location.longitude,
        })

        const event = this.eventsRepository.create({
            title: body.title,
            description: body.description,
            date: new Date(body.date),
            coverImageUrl: uploadedCoverImage.url,
            location: location,
        })

        await this.locationsRepository.save(location)
        await this.eventsRepository.save(event)

        return event
    }

    async list(): Promise<Event[]> {
        const events = await this.eventsRepository.find()

        return events
    }

    async findById(id: string): Promise<Event | null> {
        const event = await this.eventsRepository.findOneBy({ id })

        return event
    }
}

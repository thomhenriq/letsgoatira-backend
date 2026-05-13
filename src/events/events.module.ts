import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { Location } from './entities/location.entity';
import { StorageModule } from '@/storage/storage.module';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Location]), StorageModule],
  controllers: [EventsController],
  providers: [EventsService]
})
export class EventsModule {}

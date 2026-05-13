import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { Location } from './entities/location.entity';
import { StorageModule } from '@/storage/storage.module';
import { Attendance } from './entities/attendance.entity';
import { MembersModule } from '@/members/members.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, Location, Attendance]),
    StorageModule,
    MembersModule,
  ],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}

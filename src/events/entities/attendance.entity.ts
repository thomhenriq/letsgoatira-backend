import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Event } from './event.entity';
import { Member } from '@/members/entities/member.entity';

@Entity('attendances')
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Event, (event) => event.attendances)
  @JoinColumn()
  event: Event;

  @ManyToOne(() => Member, (member) => member.attendances)
  @JoinColumn()
  member: Member;
}

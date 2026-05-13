import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Event } from './event.entity';

@Entity('photos')
export class Photo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  key: string;

  @Column()
  url: string;

  @ManyToOne(() => Event, (event) => event.photos, {
    cascade: true,
  })
  @JoinColumn()
  event: Event;
}

import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Event } from './event.entity';

@Entity('locations')
export class Location {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  country: string;

  @Column('decimal', {
    precision: 10,
    scale: 8,
  })
  latitude: number;

  @Column('decimal', {
    precision: 11,
    scale: 8,
  })
  longitude: number;

  @OneToMany(() => Event, (event) => event.location)
  events: Event[];
}

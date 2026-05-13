import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm"
import { Location } from "./location.entity"

@Entity("events")
export class Event {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  title: string

  @Column("text")
  description: string

  @Column()
  date: Date

  @Column()
  coverImageUrl: string

  @ManyToOne(() => Location, {
    cascade: true
  })
  @JoinColumn()
  location: Location
}
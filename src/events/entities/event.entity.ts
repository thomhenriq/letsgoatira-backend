import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm"
import { Attendance } from "./attendance.entity"
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

  @OneToMany(() => Attendance, (attendance) => attendance.event)
  attendances: Attendance[]
}
import { Attendance } from "@/events/entities/attendance.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

export enum MemberRole {
    TRAINEE = "trainee",
    ADVISOR = "advisor",
    COORDINATOR = "coordinator",
    DIRECTOR = "director"
}

@Entity("members")
export class Member {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    name: string

    @Column({ unique: true })
    email: string

    @Column({
        type: "enum",
        enum: MemberRole,
    })
    role: MemberRole

    @Column()
    avatarUrl: string

    @OneToMany(() => Attendance, (attendance) => attendance.member)
    attendances: Attendance[]
}
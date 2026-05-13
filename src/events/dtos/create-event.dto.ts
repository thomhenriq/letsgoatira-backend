import { plainToInstance, Transform } from "class-transformer"
import { IsDateString, IsString, ValidateNested } from "class-validator"
import { CreateLocationDto } from "./create-location.dto"

export class CreateEventDto {
    @IsString({ message: 'O título deve ser do tipo string' })
    title: string

    @IsString({ message: 'A descrição deve ser do tipo string' })
    description: string

    @IsDateString({}, { message: 'A data deve ser uma string de data válida' })
    date: string

    @Transform(({ value }) => plainToInstance(
        CreateLocationDto,
        JSON.parse(value),
    ))
    @ValidateNested({ message: 'A localização deve ser um objeto válido' })
    location: CreateLocationDto
}
import { IsEmail } from "class-validator";

export class AddAttendancesDto {
    @IsEmail(
        { host_whitelist: ['atriajr.com.br'] },
        {
            message: 'O email deve ser do domínio @atriajr.com.br',
            each: true
        },
    )
    emails: string[]
}
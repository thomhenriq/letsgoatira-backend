import { IsLatitude, IsLongitude, IsString } from 'class-validator';

export class CreateLocationDto {
  @IsString({ message: 'O nome deve ser do tipo string' })
  name: string;

  @IsString({ message: 'A cidade deve ser do tipo string' })
  city: string;

  @IsString({ message: 'O estado deve ser do tipo string' })
  state: string;

  @IsString({ message: 'O país deve ser do tipo string' })
  country: string;

  @IsLatitude({
    message: 'A latitude está inválida',
  })
  latitude: number;

  @IsLongitude({
    message: 'A longitude está inválida',
  })
  longitude: number;
}

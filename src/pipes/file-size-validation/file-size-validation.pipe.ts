import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  transform(value: any) {
    const sizeLimit = 16 * 1024 * 1024

    if (!value) {
      throw new BadRequestException("O arquivo é obrigatório")
    }

    if (value.size > sizeLimit) {
      throw new BadRequestException(
        "O tamanho do arquivo ultrapassa 16MB",
      )
    }

    return value
  }
}

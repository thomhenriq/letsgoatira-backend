import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  transform(value: Express.Multer.File | Express.Multer.File[]) {
    const sizeLimit = 16 * 1024 * 1024;

    if (!value || (Array.isArray(value) && value.length === 0)) {
      throw new BadRequestException('O arquivo é obrigatório');
    }

    if (Array.isArray(value)) {
      for (const file of value) {
        if (file.size > sizeLimit) {
          throw new BadRequestException(
            `O arquivo "${file.originalname}" ultrapassa o limite de 16MB`,
          );
        }
      }
      return value;
    }

    if (value.size > sizeLimit) {
      throw new BadRequestException('O tamanho do arquivo ultrapassa 16MB');
    }

    return value;
  }
}

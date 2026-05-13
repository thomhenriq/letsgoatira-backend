import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { extname } from 'path';
import { IUploadFile } from './interfaces/upload-file.interface';

@Injectable()
export class StorageService {
    private storage: S3Client
    private bucket: string
    private publicUrl: string

    constructor(private configService: ConfigService) {
        this.storage = new S3Client({
            region: this.configService.get<string>("STORAGE_REGION"),
            endpoint: this.configService.get<string>("STORAGE_ENDPOINT"),
            credentials: {
                accessKeyId: this.configService.get<string>("SUPABASE_ACCESS_KEY_ID")!,
                secretAccessKey: this.configService.get<string>("SUPABASE_SECRET_ACCESS_KEY")!,
            },
            forcePathStyle: true
        })

        this.bucket = this.configService.get<string>("STORAGE_BUCKET")!
        this.publicUrl = this.configService.get<string>("STORAGE_PUBLIC_URL")!
    }

    async uploadFile(file: Express.Multer.File, path?: string): Promise<IUploadFile> {
        const fileName = `${randomUUID()}${extname(file.originalname)}`
        const fileKey = path ? `${path}/${fileName}` : fileName

        const objectCommand = new PutObjectCommand({
            Bucket: this.bucket,
            Key: fileKey,
            Body: file.buffer,
            ContentType: file.mimetype,
        })

        await this.storage.send(objectCommand)

        const fileUrl = `${this.publicUrl}/${fileKey}`

        return {
            key: fileKey,
            url: fileUrl
        }
    }
}

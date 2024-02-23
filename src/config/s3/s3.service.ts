import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private s3: AWS.S3;
  private s3_bucket: string;

  constructor(private configService: ConfigService) {
    this.s3 = new AWS.S3({
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get<string>('AWS_REGION'),
    });
    this.s3_bucket = this.configService.get<string>('AWS_S3_BUCKET_NAME');
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    try {
      const { originalname, buffer, mimetype } = file;

      const params = {
        Bucket: this.s3_bucket,
        Key: String(originalname),
        Body: buffer,
        ContentType: mimetype,
        ContentDisposition: 'inline',
      };

      const s3Response = await this.s3.upload(params).promise();
      return s3Response.Location;
    } catch (error) {
      console.error('Error uploading image to S3:', error);
      throw new Error('Image upload failed');
    }
  }
}

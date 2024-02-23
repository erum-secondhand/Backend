import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class S3Service {
  private s3: AWS.S3;
  private s3_bucket: string;

  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
    this.s3_bucket = process.env.AWS_S3_BUCKET_NAME;

    console.log('AWS S3 Bucket:', this.s3_bucket);
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    try {
      console.log(
        'Attempting to upload file:',
        file.originalname,
        'to bucket:',
        this.s3_bucket,
      );

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

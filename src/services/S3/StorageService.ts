import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import ClientError from '../../exceptions/ClientError';

export default class StorageService {
  private _S3: S3Client;

  constructor() {
    this._S3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
      },
    });

    this.createPreSignedUrl = this.createPreSignedUrl.bind(this);
    this.writeFile = this.writeFile.bind(this);
  }

  createPreSignedUrl({
    bucket,
    key,
  }: {
    bucket: string | undefined;
    key: string;
  }) {
    const command = new GetObjectCommand({ Bucket: bucket, Key: key });
    return getSignedUrl(this._S3, command, { expiresIn: 3600 });
  }

  async writeFile(file: any, meta: any) {
    if (file._data.byteLength > 512000) {
      throw new ClientError(
        'File size exceeds the maximum limit of 512000 bytes',
        413
      );
    }

    const parameter = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME as string,
      Key: meta.filename,
      Body: file._data,
      ContentType: meta.headers['content-type'],
    });

    await this._S3.send(parameter);

    return this.createPreSignedUrl({
      bucket: process.env.AWS_BUCKET_NAME,
      key: meta.filename,
    });
  }
}

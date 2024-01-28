import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { AWS_S3_BUCKET_NAME } from '@/constants';
import { AWS_ACCESS_KEY_ID, AWS_REGION, AWS_SECRET_ACCESS_KEY } from '@/config';

const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

export async function getObjectUrl(Key: string) {
  const getObjCommand = new GetObjectCommand({
    Bucket: AWS_S3_BUCKET_NAME,
    Key,
  });

  const url = await getSignedUrl(s3Client, getObjCommand);
  return url;
}

import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { AWS_ACCESS_KEY_ID, AWS_REGION, AWS_SECRET_ACCESS_KEY } from '@/config';
import { AWS_S3_BUCKET_NAME } from '@/constants';
import mime from 'mime-types';

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

  const url = await getSignedUrl(s3Client, getObjCommand, {
    expiresIn: 7 * 24 * 60 * 60,
  });
  return url;
}

export async function putObjectUrl(
  username: string,
  location: 'videos' | 'profile',
  filename: string,
) {
  const putObjCommand = new PutObjectCommand({
    Bucket: AWS_S3_BUCKET_NAME,
    Key: `uploads/${username}/${location}/${filename}`,
    ContentType: mime.lookup(filename) || 'application/octet-stream',
  });

  const url = await getSignedUrl(s3Client, putObjCommand);
  return url;
}

export async function listObjects(key: string) {
  const objects = new ListObjectsV2Command({
    Bucket: AWS_S3_BUCKET_NAME,
    Prefix: key,
  });

  const res = await s3Client.send(objects);

  return res.Contents || [];
}

export async function deleteObject(key: string) {
  const deleteObjCommand = new DeleteObjectCommand({
    Bucket: AWS_S3_BUCKET_NAME,
    Key: key,
  });

  await s3Client.send(deleteObjCommand);
}

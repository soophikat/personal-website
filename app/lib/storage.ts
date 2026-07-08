import { S3Client, PutObjectCommand, CreateBucketCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
    region: 'us-east-1',
    endpoint: process.env.S3_ENDPOINT,
    forcePathStyle: true,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY!,
        secretAccessKey: process.env.S3_SECRET_KEY!,
    },
});


export async function deleteImage(key: string) {
    await s3.send(new DeleteObjectCommand({
        Key: key,
        Bucket: process.env.S3_BUCKET,
    }));
}




export async function uploadImage(buffer: Buffer, key: string, contentType: string) {

    await s3.send(new PutObjectCommand({
        Bucket: process.env.S3_BUCKET!,
        Key: key,
        Body: buffer,
        ContentType: contentType,
    }));

    return `${process.env.S3_PUBLIC_URL}/${key}`
}
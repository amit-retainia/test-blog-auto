/**
 * Upload a blog hero image to Cloudflare R2 and print its public URL.
 *
 *   node scripts/upload-image.mjs <file-path> <slug>
 *
 * Example:
 *   node scripts/upload-image.mjs ./hero.webp amazon-bullet-points-that-convert
 *   → https://pub-xxxx.r2.dev/blog/amazon-bullet-points-that-convert.webp
 *
 * The printed URL is public and permanent. Nothing about it expires.
 *
 * Env (put them in .env — see .env.example):
 *   R2_ACCOUNT_ID  R2_ACCESS_KEY_ID  R2_SECRET_ACCESS_KEY
 *   R2_BUCKET_NAME  R2_PUBLIC_BASE
 */

import { readFile } from 'node:fs/promises';
import { basename, extname } from 'node:path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const TYPES = {
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
};

const MAX_BYTES = 10 * 1024 * 1024;

function env(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var ${name}. Copy .env.example to .env and fill it in.`);
  return v;
}

const [filePath, slug] = process.argv.slice(2);

if (!filePath || !slug) {
  console.error('Usage: node scripts/upload-image.mjs <file-path> <slug>');
  process.exit(1);
}

if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
  console.error(`Bad slug "${slug}". Use lowercase words separated by hyphens.`);
  process.exit(1);
}

const ext = extname(filePath).toLowerCase();
const contentType = TYPES[ext];

if (!contentType) {
  console.error(`Unsupported file type "${ext}". Use .webp, .jpg or .png.`);
  process.exit(1);
}

const body = await readFile(filePath);

if (body.length > MAX_BYTES) {
  console.error(`${basename(filePath)} is ${(body.length / 1048576).toFixed(1)}MB. Limit is 10MB — compress it first.`);
  process.exit(1);
}

const key = `blog/${slug}${ext}`;

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${env('R2_ACCOUNT_ID')}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env('R2_ACCESS_KEY_ID'),
    secretAccessKey: env('R2_SECRET_ACCESS_KEY'),
  },
});

await s3.send(new PutObjectCommand({
  Bucket: env('R2_BUCKET_NAME'),
  Key: key,
  Body: body,
  ContentType: contentType,
  CacheControl: 'public, max-age=31536000, immutable',
}));

const publicUrl = `${env('R2_PUBLIC_BASE').replace(/\/+$/, '')}/${key}`;

console.error(`uploaded ${(body.length / 1024).toFixed(0)}KB → ${key}`);
console.log(publicUrl);   // stdout is just the URL, so it can be piped

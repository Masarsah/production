import webpush from 'web-push';
import dotenv from 'dotenv';
dotenv.config();

const { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY } = process.env;

if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
  console.warn('⚠️ Missing VAPID keys! Run: npx web-push generate-vapid-keys');
}

webpush.setVapidDetails(
  'mailto:you@example.com',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

export default webpush;

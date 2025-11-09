import webpush from '../utiles/webpush.js';
import db from '../database/config.js';

// ✅ Get the public VAPID key
export const getPublicKey = (req, res) => {
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
};

// ✅ Store a new push subscription in the database
export const subscribe = async (req, res) => {
  try {
    const subscription = req.body;

    await db.none(
      'INSERT INTO push_subscriptions(subscription) VALUES($1)',
      [JSON.stringify(subscription)]
    );

    res.status(201).json({ success: true });
  } catch (err) {
    console.error('Subscription error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ Trigger push notification to all stored subscribers
export const triggerNotify = async (req, res) => {
  try {
    const { title, body } = req.body;
    const payload = JSON.stringify({ title, body });

    const subs = await db.any('SELECT * FROM push_subscriptions');

    await Promise.all(
      subs.map(async (s) => {
        try {
          const sub = JSON.parse(s.subscription);
          await webpush.sendNotification(sub, payload);
        } catch (err) {
          console.error('Push send error:', err.message);
        }
      })
    );

    res.json({ success: true });
  } catch (err) {
    console.error('Trigger error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

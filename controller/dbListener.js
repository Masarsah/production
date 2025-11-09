import { db, listener } from '../database/config.js';
import webpush from '../utiles/webpush.js';

export default function setupDBListener(io) {
  // Attach listener to PostgreSQL notifications
  listener.connect()
    .then(obj => {
      console.log('📡 Connected for LISTEN/NOTIFY');
      const cn = obj.client;

      // Subscribe to channel
      cn.query('LISTEN new_event');

      cn.on('notification', async (data) => {
        const payload = data.payload;
        console.log('📢 DB Notification received:', payload);

        // Emit to all connected clients via Socket.IO
        io.emit('db_event', payload);

        // Send Web Push to all subscriptions
        try {
          const rows = await db.any('SELECT * FROM push_subscriptions');
          const pushPayload = JSON.stringify({ title: 'New Event', body: payload });

          await Promise.all(rows.map(async (row) => {
            try {
              const subscription = JSON.parse(row.subscription);
              await webpush.sendNotification(subscription, pushPayload);
            } catch (err) {
              console.error('❌ Push send error:', err.message);
            }
          }));
        } catch (err) {
          console.error('Error fetching subscriptions:', err);
        }
      });

      cn.on('end', () => console.warn('❗ Listener connection ended'));
    })
    .catch(err => console.error('Error connecting for LISTEN/NOTIFY:', err));
}

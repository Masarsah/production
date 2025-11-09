import express from 'express';
import * as pushController from '../controller/pushController.js';

const router = express.Router();

router.get('/vapidPublicKey', pushController.getPublicKey);
router.post('/subscribe', pushController.subscribe);
router.post('/trigger', pushController.triggerNotify);

export default router;

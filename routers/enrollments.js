import express from 'express';
import * as ctrl from '../controller/enrollments.js';
const router = express.Router();


router.post('/', ctrl.createEnrollment);
router.get('/', ctrl.getEnrollments);
router.get('/:user_id/:class_id', ctrl.getEnrollment);
router.put('/:user_id/:class_id', ctrl.updateEnrollment);
router.delete('/:user_id/:class_id', ctrl.deleteEnrollment);
export default router;
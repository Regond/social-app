import Express from 'express';
import { updateSeen, getUnseenData } from '../controllers/notification.js';

const router = Express.Router()


router.get('/unseenData', getUnseenData)
router.patch('/seen', updateSeen)
export default router;
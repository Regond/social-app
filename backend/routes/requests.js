import Express from 'express';
import { getRequests, addFriend} from '../controllers/request.js';

const router = Express.Router()
router.get('/', getRequests)
router.post('/', addFriend)


export default router;
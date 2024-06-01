import Express from 'express';
import { getLikes, like, dislike } from '../controllers/like.js';

const router = Express.Router()

router.get('/', getLikes)
router.post('/', like)
router.delete('/', dislike)
export default router;
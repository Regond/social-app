import Express from 'express';
import { getFollows, follow, unfollow } from '../controllers/follow.js';

const router = Express.Router()

router.get('/', getFollows)
router.post('/', follow)
router.delete('/', unfollow)

export default router;
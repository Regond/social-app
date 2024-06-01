import Express from 'express';
import { getComms, addComment } from '../controllers/comment.js';

const router = Express.Router()

router.get('/', getComms)
router.post('/', addComment)

export default router;
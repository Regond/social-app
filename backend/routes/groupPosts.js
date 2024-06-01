import Express from 'express';
import { getGroupPosts, addGroupPost, deleteGroupPost  } from '../controllers/groupPost.js';

const router = Express.Router()
router.get('/', getGroupPosts)
router.post('/', addGroupPost)
router.delete('/:id', deleteGroupPost)

export default router;
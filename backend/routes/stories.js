import Express from 'express';
import { getStories, addStory, deleteStory  } from '../controllers/story.js';

const router = Express.Router()
router.get('/', getStories)
router.post('/', addStory)
router.delete('/:id', deleteStory)

export default router;